import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { LocalizeProvider } from 'react-localize-redux';

import './app/style/styles.less';
import theme from './app/style/theme';
import App from './app/App';
import Auth from './common/Auth';
import { actionCreators as AuthStoreActions } from './app/store/AuthStore';
import { setBaseUrl } from './youwell-common/apiUrls';
import { configureStore, updateStore } from './youwell-common/reduxUtils';
import { reducers } from './app/store';
import { initialization as translationInitialization } from './app/localization';


const baseUrl = (window.serverParams && window.serverParams.baseUrl) || document.getElementById('react-app').getAttribute('data-base-url');
const apiUrl = (window.serverParams && window.serverParams.apiUrl) || document.getElementById('react-app').getAttribute('data-api-url');
const appConfig = (window.serverParams && window.serverParams.appConfig) || JSON.parse(document.getElementById('react-app').getAttribute('data-app-config'));

if (!apiUrl) {
    throw new Error('Missing asp-prerender parameter: data-apiUrl');
}
setBaseUrl(apiUrl);

// globals set in server-side rendering
const initialState = window.initialReduxState;

// Create browser history to use in the Redux store
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(reducers, history, initialState);

if (Auth.isUserAuthenticated() && (!initialState || !initialState.auth || !initialState.auth.profileData)) {
    AuthStoreActions.loginWithToken(Auth.getToken())(store.dispatch);
}

// Remove server-side generated jss
const jssStyles = document.getElementById('jss-server-side');
if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles);
}

const renderOrHydrate = appConfig.useServerSideRendering ? ReactDOM.hydrate : ReactDOM.render;

const renderApp = () => {
    renderOrHydrate(
        <MuiThemeProvider theme={theme}>
            <LocalizeProvider store={store} initialize={translationInitialization}>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App />
                    </ConnectedRouter>
                </Provider>
            </LocalizeProvider>
        </MuiThemeProvider>,
        document.getElementById('react-app')
    );
};

if (module.hot) {
    module.hot.accept('./app/store', () => {
        updateStore(store, reducers, history);
    });
}

renderApp();
