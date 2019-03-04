import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';

import {
    Typography, TextField, IconButton, MenuItem,
} from '@material-ui/core';

import { EditIcon, CancelIcon, SaveIcon } from '../../common/icons';
import * as AuthStore from '../../app/store/AuthStore';
import { validateAllFields, validateField } from '../../youwell-common/validationUtils';
import { patientUserLevels } from '../../youwell-common/constants';
import { getRuleValidators } from './components/validation';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
    header: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    profileData: {
        display: 'flex',
        flexDirection: 'column',
    },
    textField: {
        marginBottom: theme.spacing.unit * 3,
    },
    actions: {
        marginTop: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});


const defaultState = {
    id: null,
    userLevel: '',

    username: '',
    email: '',
    phone: '',
    fnr: '',

    name: '',
    sex: '',
    birthDate: '',
    imageFileId: '',

    newPassword: '',
    newPasswordConfirm: '',
};

const stateFromData = (data) => {
    const initialState = {
        ...defaultState,
        editing: false,
        validators: getRuleValidators(data ? data.userLevel : null),
        validationErrors: {},
    };

    if (!data) {
        return initialState;
    }

    return Object.keys(defaultState).reduce(
        (obj, key) => (data[key] ? { ...obj, [key]: data[key] } : { ...obj }),
        {
            ...initialState,
        }
    );
};

class Profile extends React.Component {
    state = stateFromData(this.props.profileData);

    static getDerivedStateFromProps(props, state) {
        if (props.profileData && props.profileData.id !== state.id) {
            return stateFromData(props.profileData);
        }
        return null;
    }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value }, () => {
            if (this.state.validators[name]) {
                const validationErrors = validateField(this.state, this.state.validators[name], name); // eslint-disable-line react/no-access-state-in-setstate
                this.setState({ validationErrors });
            }
        });
    }

    startEditing = () => {
        this.setState({ editing: true });
    }

    cancelEditing = () => {
        this.setState(stateFromData(this.props.profileData));
    }

    saveChanges = () => {
        const validationErrors = validateAllFields(this.state, this.state.validators);

        if (!validationErrors.hasErrors) {
            const saveData = Object.keys(defaultState).reduce(
                (obj, key) => (this.state[key] ? { ...obj, [key]: this.state[key] } : { ...obj }),
                {
                    id: this.props.profileData.id,
                    organizationId: this.props.profileData.organizationId,
                    userLevel: this.props.profileData.userLevel,
                }
            );

            switch (saveData.userLevel) {
            case patientUserLevels.none: {
                break;
            }
            case patientUserLevels.anonymous: {
                saveData.fnr = null;
                saveData.email = null;
                saveData.name = null;
                saveData.phone = null;
                break;
            }
            case patientUserLevels.person: {
                saveData.username = null;
                saveData.fnr = null;
                break;
            }
            case patientUserLevels.patient: {
                saveData.username = null;
                saveData.newPassword = null;
                break;
            }
            default: {
                break;
            }
            }
            this.props.saveUserProfile(saveData, {
                callback: () => {
                    this.setState({ editing: false });
                },
            });
        } else {
            this.setState({ validationErrors });
        }
    }


    render() {
        const {
            classes, translate, profileData,
        } = this.props;

        if (!profileData) {
            return null;
        }

        return (
            <div className={classes.root}>
                <Typography variant="subtitle1" className={classes.header}>
                    {translate('profile.profileHeading')}
                </Typography>

                <div className={classes.actions}>
                    {this.state.editing ? (
                        <React.Fragment>
                            <IconButton onClick={this.cancelEditing} className={classes.iconButton} color="secondary">
                                <CancelIcon />
                            </IconButton>
                            <IconButton onClick={this.saveChanges} className={classes.iconButton} color="primary">
                                <SaveIcon />
                            </IconButton>
                        </React.Fragment>
                    ) : (
                        <IconButton onClick={this.startEditing} className={classes.iconButton}>
                            <EditIcon />
                        </IconButton>
                    )}
                </div>

                <div className={classes.profileData}>
                    {this.state.userLevel === patientUserLevels.anonymous && (
                        <TextField
                            className={classes.textField}
                            label={translate('profile.username')}
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            disabled={!this.state.editing}
                            error={!!this.state.validationErrors.username}
                            helperText={this.state.validationErrors.username ? translate(this.state.validationErrors.username) : null}
                        />
                    )}
                    {(this.state.userLevel !== patientUserLevels.anonymous) && (
                        <TextField
                            className={classes.textField}
                            label={translate('profile.name')}
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            disabled={!this.state.editing}
                            error={!!this.state.validationErrors.name}
                            helperText={this.state.validationErrors.name ? translate(this.state.validationErrors.name) : null}
                        />
                    )}
                    {this.state.userLevel !== patientUserLevels.anonymous && (
                        <React.Fragment>
                            <TextField
                                className={classes.textField}
                                label={translate('profile.email')}
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                disabled={!this.state.editing}
                                error={!!this.state.validationErrors.email}
                                helperText={this.state.validationErrors.email ? translate(this.state.validationErrors.email) : null}
                            />
                            <TextField
                                className={classes.textField}
                                label={translate('profile.phone')}
                                value={this.state.phone}
                                onChange={this.handleChange('phone')}
                                disabled={!this.state.editing}
                                error={!!this.state.validationErrors.phone}
                                helperText={this.state.validationErrors.phone ? translate(this.state.validationErrors.phone) : null}
                            />
                        </React.Fragment>
                    )}
                    {this.state.userLevel !== patientUserLevels.patient && (
                        <React.Fragment>
                            <TextField
                                className={classes.textField}
                                label={translate('profile.sex')}
                                value={this.state.sex}
                                onChange={this.handleChange('sex')}
                                disabled={!this.state.editing}
                                select
                            >
                                <MenuItem value="">{translate('profile.select_sex')}</MenuItem>
                                <MenuItem value="male">{translate('profile.male')}</MenuItem>
                                <MenuItem value="female">{translate('profile.female')}</MenuItem>
                                <MenuItem value="other">{translate('profile.other')}</MenuItem>
                            </TextField>
                            <TextField
                                className={classes.textField}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                label={translate('profile.birthDate')}
                                disabled={!this.state.editing}
                                value={this.state.birthDate}
                                onChange={this.handleChange('birthDate')}
                            />
                            <TextField
                                type="password"
                                className={classes.textField}
                                label={translate('profile.new_password')}
                                value={this.state.newPassword}
                                disabled={!this.state.editing}
                                onChange={this.handleChange('newPassword')}
                                error={!!this.state.validationErrors.newPassword}
                                helperText={this.state.validationErrors.newPassword ? translate(this.state.validationErrors.newPassword) : null}
                            />
                            <TextField
                                type="password"
                                className={classes.textField}
                                label={translate('profile.new_password_confirm')}
                                value={this.state.newPasswordConfirm}
                                disabled={!this.state.editing}
                                onChange={this.handleChange('newPasswordConfirm')}
                                error={!!this.state.validationErrors.newPasswordConfirm}
                                helperText={this.state.validationErrors.newPasswordConfirm ? translate(this.state.validationErrors.newPasswordConfirm) : null}
                            />
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    profileData: PropTypes.object,
    saveUserProfile: PropTypes.func.isRequired,
};

Profile.defaultProps = {
    profileData: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    profileData: state.auth.profileData,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AuthStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Profile));
