import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Route, Switch, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IdleTimer } from '../../common/components';
import LoadProgramList from './components/LoadProgramList';
import { logoutReasons } from '../../youwell-common/constants';

import * as AuthStore from '../../app/store/AuthStore';

import Layout from './Layout';
import Program from '../program/Index';
import Chat from '../messages/MessageList';
import Profile from '../home/Profile';

import urls from '../../app/urls';

const USER_IDLE_TIMEOUT_IN_MINUTES = 30;

const HomeRedirect = ({ ...rest }) => (
    <Route
        {...rest}
        render={() => (
            <Redirect to={{
                pathname: urls.inside.programredirect,
            }}
            />
        )}
    />
);

class Index extends React.Component {
    logoutOnIdle = () => {
        this.props.logout(logoutReasons.idleTimeout);
    }

    render() {
        return (
            <React.Fragment>

                <IdleTimer
                    timeoutInMinutes={USER_IDLE_TIMEOUT_IN_MINUTES}
                    onIdle={this.logoutOnIdle}
                />
                <LoadProgramList />

                <Layout>
                    <Switch>
                        <Route exact path={urls.inside.home} component={HomeRedirect} />
                        <Route path={urls.inside.profile} component={Profile} />
                        <Route path={urls.inside.chat} component={Chat} />
                        <Route path={urls.inside.program.home} component={Program} />
                        <Route path={urls.inside.programredirect} component={Program} />
                    </Switch>
                </Layout>
            </React.Fragment>
        );
    }
}

Index.propTypes = {
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
    logout: bindActionCreators(AuthStore.actionCreators, dispatch).logout,
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
