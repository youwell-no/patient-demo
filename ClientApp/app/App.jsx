import * as React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import { withLocalize } from 'react-localize-redux';

import { ScrollToTop, PrivateRoute, PageNotFound } from '../common/components';
import { initialization } from './localization';
import urls from './urls';

import Inside from '../features/inside/Index';
import Outside from '../features/outside/Index';


class App extends React.Component {
    constructor(props) {
        super(props);
        props.initialize(initialization);
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <ScrollToTop />

                <Switch>
                    <Route exact path={urls.home} component={Outside} />
                    <Route path={urls.logout} component={Outside} />
                    <Route path={urls.login} component={Outside} />

                    <PrivateRoute path={urls.inside.home} component={Inside} loginUrl={urls.login} />

                    <Route component={PageNotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    initialize: PropTypes.func.isRequired,
};

export default hot(module)(withLocalize(withRouter(App)));
