import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { getTranslate } from 'react-localize-redux';

import { withStyles } from '@material-ui/core/styles';
import {
    MenuItem, ListItemIcon, ListItemText, Divider, Avatar,
} from '@material-ui/core';
import {
    LogoutIcon, HomeIcon,
    ListIcon, PersonIcon,
    QuestionnaireIcon, ChatIcon,
} from '../../../common/icons';

import * as AuthStore from '../../../app/store/AuthStore';

import { LanguageToggle } from '../../../common/components';
import { getCurrentProgram } from '../../../common/utils';

import urls from '../../../app/urls';


const styles = theme => ({
    root: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    noAction: {
        cursor: 'default',
        '&:hover': {
            backgroundColor: theme.palette.common.white,
        },
    },
    profileAvatar: {
        marginLeft: -theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    divider: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },
    version: {
        marginTop: theme.spacing.unit * 2,
    },
});

class MenuContent extends React.Component {
    logout = () => {
        this.props.logout();
    }

    render() {
        const {
            classes, translate, profileData, programList, currentProgram,
        } = this.props;

        const hasMultiplePrograms = programList && programList.length > 1;

        const programId = currentProgram ? currentProgram.id : null;

        return (
            <div className={classes.root}>
                {profileData && (
                    <Link to={urls.inside.profile}>
                        <MenuItem>
                            <Avatar className={classes.profileAvatar}>
                                <PersonIcon />
                            </Avatar>
                            <ListItemText primary={translate('user')} secondary={profileData.name} />
                        </MenuItem>
                    </Link>
                )}

                <Divider className={classes.divider} />

                {hasMultiplePrograms && (
                    <React.Fragment>
                        <Link to={urls.inside.program.home}>
                            <MenuItem>
                                <ListItemIcon>
                                    <ListIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate('selectProgram')} />
                            </MenuItem>
                        </Link>
                        <Divider className={classes.divider} />
                    </React.Fragment>
                )}
                {programId && (
                    <React.Fragment>
                        <Link to={`${urls.inside.program.home}/${programId}`}>
                            <MenuItem>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate('menu.startPage')} />
                            </MenuItem>
                        </Link>
                        {currentProgram && currentProgram.hasScheduledTasks && (
                            <Link to={`${urls.inside.program.home}/${programId}/${urls.inside.program.parts.scheduled}`}>
                                <MenuItem>
                                    <ListItemIcon>
                                        <QuestionnaireIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={translate('menu.scheduledTasks')} />
                                </MenuItem>
                            </Link>
                        )}
                    </React.Fragment>
                )}

                <Link to={urls.inside.chat}>
                    <MenuItem>
                        <ListItemIcon>
                            <ChatIcon />
                        </ListItemIcon>
                        <ListItemText primary={translate('messages')} />
                    </MenuItem>
                </Link>

                <Divider className={classes.divider} />
                {currentProgram && currentProgram.hasContentPages && (
                    <React.Fragment>
                        {currentProgram.program.contentPages.pages.map(page => (
                            <Link key={page.key} to={`${urls.inside.program.home}/${programId}/${urls.inside.program.parts.contentPage}/${page.key}`}>
                                <MenuItem>
                                    <ListItemText primary={page.title || translate(page.key)} />
                                </MenuItem>
                            </Link>
                        ))}
                        <Divider className={classes.divider} />
                    </React.Fragment>
                )}

                <MenuItem onClick={this.logout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('logout')} />
                </MenuItem>

                <Divider className={classes.divider} />

                <LanguageToggle />
            </div>
        );
    }
}

MenuContent.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    profileData: PropTypes.object,
    programList: PropTypes.array,
    currentProgram: PropTypes.object,
};

MenuContent.defaultProps = {
    profileData: null,
    programList: null,
    currentProgram: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    profileData: state.auth.profileData,
    programList: state.programStore.list,
    currentProgram: getCurrentProgram(state),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AuthStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuContent));
