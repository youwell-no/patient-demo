import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Route, Switch,
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import Login from './components/Login';
import Logout from './components/Logout';
import urls from '../../app/urls';

const styles = () => ({
    root: {
        width: '100%',
        height: '100%',
    },
});

class Front extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center" alignItems="center" className={classes.root}>
                <Grid item xs={12} sm={12} md={11} lg={10} xl={9}>
                    <Switch>
                        <Route exact path={urls.home} component={Login} />
                        <Route exact path={urls.logout} component={Logout} />
                        <Route exact path={`${urls.login}/${urls.loginParts.accessCode}/:code/:state?`} component={Login} />
                        <Route exact path={`${urls.login}/:redirect?`} component={Login} />
                        <Route component={Login} />
                    </Switch>
                </Grid>
            </Grid>
        );
    }
}

Front.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Front);
