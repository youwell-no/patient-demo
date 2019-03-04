import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { createServerRenderer } from 'aspnet-prerendering';
import { JssProvider, SheetsRegistry } from 'react-jss';
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';
import { LocalizeProvider } from 'react-localize-redux';

import theme from './app/style/theme';
import App from './app/App';
import { actionCreators as AuthStoreActions } from './app/store/AuthStore';
import { setBaseUrl } from './youwell-common/apiUrls';
import { configureStore } from './youwell-common/reduxUtils';
import { reducers } from './app/store';
import { initialization as translationInitialization } from './app/localization';


export default createServerRenderer(params => new Promise((resolve, reject) => {
    if (!params.data.apiUrl) {
        throw new Error('Missing asp-prerender parameter: data-apiUrl');
    }

    setBaseUrl(params.data.apiUrl);

    // Prepare Redux store with in-memory history, and dispatch a navigation event
    // corresponding to the incoming URL
    const basename = params.data.baseUrl || params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
    const urlAfterBasename = params.url.substring(basename.length);

    const store = configureStore(reducers, createMemoryHistory());
    store.dispatch(replace(urlAfterBasename));

    // Set authentication if token is provided in param (from cookie)
    if (params.data.token) {
        AuthStoreActions.loginWithToken(params.data.token)(store.dispatch);
    }

    // Prepare an instance of the application and perform an inital render that will
    // cause any async tasks (e.g., data access) to begin
    const routerContext = {};

    // Configure JSS
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();

    const app = (
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                <LocalizeProvider store={store} initialize={translationInitialization}>
                    <Provider store={store}>
                        <StaticRouter context={routerContext} location={params.location.path}>
                            <App />
                        </StaticRouter>
                    </Provider>
                </LocalizeProvider>
            </MuiThemeProvider>
        </JssProvider>
    );

    // Once any async tasks are done, we can perform the final render
    // We also send the redux store state, so the client can continue execution where the server left off
    params.domainTasks.then(() => {
        // Must render to create the css before we can grab it
        renderToString(app);

        // Grab the CSS from our sheetsRegistry.
        const css = sheetsRegistry.toString();

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }

        const htmlOut = `<style id="jss-server-side">${css}</style>${renderToString(app)}`;
        resolve({
            html: htmlOut,
            globals: { initialReduxState: store.getState(), serverParams: params.data },
        });
    }, reject); // Also propagate any errors back into the host application
}));
