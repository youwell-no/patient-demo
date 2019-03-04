import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Auth from '../Auth';

const PrivateRoute = ({
    component: Component, authToken, loginUrl, ...rest
}) => (
    <Route
        {...rest}
        render={(props) => {
            if (Auth.isUserAuthenticated(authToken)) {
                return (
                    <Component {...props} />
                );
            }
            return (
                <Redirect to={{
                    pathname: `${loginUrl}/${encodeURIComponent(props.location.pathname)}`,
                }}
                />
            );
        }}
    />
);

const mapStateToProps = state => ({
    authToken: state.auth.token,
});


PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    authToken: PropTypes.string,
    location: PropTypes.object.isRequired,
    loginUrl: PropTypes.string.isRequired,
};

PrivateRoute.defaultProps = {
    authToken: null,
};


export default connect(mapStateToProps)(PrivateRoute);
