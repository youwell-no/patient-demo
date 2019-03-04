import * as React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import {
    Button, Typography, CircularProgress, Tabs, Tab, TextField,
} from '@material-ui/core';

import * as AuthStore from '../../../app/store/AuthStore';
import Auth from '../../../common/Auth';
import apiUrls from '../../../youwell-common/apiUrls';
import urls from '../../../app/urls';

const TABS = {
    PASSWORD: 'usepw',
    IDPORTEN: 'idporten',
    SEVERLOGIN: 'serverlogin',
};

const styles = theme => ({
    root: {
        position: 'relative',
    },

    login_container: {
        width: 400,
        height: 400,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: theme.palette.common.white,
        padding: theme.spacing.unit * 4,

        [theme.breakpoints.down('xs')]: {
            width: 300,
            padding: theme.spacing.unit * 2,
        },
    },

    loginBox: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },

    loginDescription: {
        marginTop: theme.spacing.unit * 4,
    },

    textField: {

    },

    buttonContainer: {
        marginTop: theme.spacing.unit * 4,
        display: 'flex',
        justifyContent: 'center',
    },

    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1500,
        marginTop: -50,
    },
    infoContainer: {
        marginTop: theme.spacing.unit * 4,
    },
    backLinkContainer: {
        marginTop: theme.spacing.unit * 6,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    backLink: {
        textDecoration: 'underline',
    },
});

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        tab: TABS.PASSWORD,
    };

    componentDidMount() {
        if (this.props.match.params.code) {
            const redirect = this.props.match.params.redirect ? decodeURIComponent(this.props.match.params.redirect) : urls.inside.home;
            this.props.loginWithCode(this.props.match.params.code, this.props.match.params.state, { redirect });
        } else if (Auth.isUserAuthenticated()) {
            const token = Auth.getToken();
            const redirect = this.props.match.params.redirect ? decodeURIComponent(this.props.match.params.redirect) : urls.inside.home;
            this.props.loginWithToken(token, { redirect });
        }
    }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    handleTabChange = name => (event, value) => {
        this.setState({
            [name]: value,
        });
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    login = () => {
        const redirect = this.props.match.params.redirect ? decodeURIComponent(this.props.match.params.redirect) : urls.inside.home;
        this.props.login(this.state.username, this.state.password, { redirect });
    };


    render() {
        const {
            classes, translate, errorMessage, loading, match, logoutReason,
        } = this.props;

        let tab = this.state.tab;

        if (match.params.code || Auth.isUserAuthenticated()) {
            tab = TABS.SEVERLOGIN;
        }

        return (
            <div className={classes.root}>
                <div className={classes.login_container}>
                    <Typography variant="h6" gutterBottom>
                        {translate('login.heading')}
                    </Typography>

                    <Tabs value={this.state.tab} onChange={this.handleTabChange('tab')}>
                        <Tab label={translate('username')} value={TABS.PASSWORD} />
                        <Tab label="IDPorten" value={TABS.IDPORTEN} />
                    </Tabs>

                    <div className={classes.loginBox}>
                        {loading && (
                            <div className={classes.loading}>
                                <CircularProgress />
                            </div>
                        )}

                        {tab === TABS.SEVERLOGIN && !errorMessage && (
                            <React.Fragment>
                                <Typography color="textSecondary" className={classes.loginDescription}>
                                    {translate('login.loginInProgress')}
                                </Typography>
                            </React.Fragment>
                        )}
                        {tab === TABS.PASSWORD && (
                            <React.Fragment>
                                <TextField
                                    id="username"
                                    type="username"
                                    label={translate('username')}
                                    className={classes.textField}
                                    value={this.state.username}
                                    onChange={this.handleChange('username')}
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    id="password"
                                    type="password"
                                    label={translate('password')}
                                    className={classes.textField}
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        onKeyPress: this.handleKeyPress,
                                    }}
                                />

                                <div className={classes.buttonContainer}>
                                    <Button onClick={this.login} variant="contained" color="primary" disabled={loading}>
                                        {translate('login.login')}
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                        {tab === TABS.IDPORTEN && (
                            <React.Fragment>
                                <Typography color="textSecondary" className={classes.loginDescription}>
                                    {translate('login.idportenDescription')}
                                </Typography>
                                <div className={classes.buttonContainer}>
                                    <Button variant="contained" color="primary" href={`${apiUrls.loginredirect}/idporten/in`} disabled={loading}>
                                        {translate('login.loginWithIdporten')}
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}

                        <div className={classes.infoContainer}>
                            {logoutReason && (
                                <React.Fragment>
                                    <Typography color="secondary" gutterBottom>
                                        {translate(`errors.${logoutReason}`, null, { onMissingTranslation: ({ translationId }) => translationId })}
                                    </Typography>
                                </React.Fragment>
                            )}
                            {errorMessage && (
                                <React.Fragment>
                                    <Typography color="secondary">
                                        {translate(`errors.${errorMessage}`, null, { onMissingTranslation: ({ translationId }) => translationId })}
                                    </Typography>
                                    {tab === TABS.SEVERLOGIN && (
                                        <div className={classes.backLinkContainer}>
                                            <a href={urls.home} className={classes.backLink}>
                                                {translate('login.backToFrontPage')}
                                            </a>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    loginWithToken: PropTypes.func.isRequired,
    loginWithCode: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errorMessage: PropTypes.string,
    logoutReason: PropTypes.string,
};

Login.defaultProps = {
    loading: false,
    errorMessage: null,
    logoutReason: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    loading: state.auth.loading,
    errorMessage: state.auth.error,
    logoutReason: state.auth.logoutReason,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AuthStore.actionCreators, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login)));
