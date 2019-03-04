import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';

import {
    IconButton, Typography, Hidden,
} from '@material-ui/core';

import { MenuIcon, PlanIcon } from '../../../common/icons';
import apiUrls from '../../../youwell-common/apiUrls';
import urls from '../../../app/urls';
import { getCurrentProgram } from '../../../common/utils';

const styles = theme => ({
    root: {
        height: theme.sizes.desktopHeaderHeight,
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: theme.palette.common.white,
    },

    title: {
        flex: '1 1 auto',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    orgIcon: {
        height: 40,
        marginRight: theme.spacing.unit,
    },
    icon: {
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.2em',
        },
    },
    menuIcon: {
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.5em',
        },
    },
    badge: {
        top: -2,
        right: -8,
    },
});


class Header extends React.Component {
    render() {
        const {
            classes, translate, onOpenMenu, profile, currentProgram,
        } = this.props;

        const programId = currentProgram ? currentProgram.id : null;

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {profile && profile.organization && (
                        <React.Fragment>
                            {profile.organization.logoImageId && <img src={`${apiUrls.media}/${profile.organization.logoImageId}`} alt="" className={classes.orgIcon} />}
                            <div className={classes.title}>
                                <Link to={programId ? `${urls.inside.program.home}/${programId}` : `${urls.inside.home}`}>
                                    <Hidden implementation="css" smUp>
                                        <Typography variant="h6" noWrap color="inherit">
                                            {profile.organization.name}
                                        </Typography>
                                    </Hidden>
                                    <Hidden implementation="css" xsDown>
                                        <Typography variant="h6" noWrap color="inherit">
                                            {currentProgram ? currentProgram.program.name : profile.organization.name}
                                        </Typography>
                                    </Hidden>
                                </Link>
                            </div>
                        </React.Fragment>
                    )}

                    {currentProgram && currentProgram.myPlanElement && (
                        <Link to={`${urls.inside.program.home}/${programId}/${urls.inside.program.parts.plan}`}>
                            <IconButton
                                color="inherit"
                                aria-label={translate('header.goToMyPlan')}
                            >
                                <PlanIcon className={classes.icon} />
                            </IconButton>
                        </Link>
                    )}
                    <IconButton
                        color="inherit"
                        aria-label={translate('openMenu')}
                        onClick={onOpenMenu}
                    >
                        <MenuIcon className={classes.menuIcon} />
                    </IconButton>
                </div>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    onOpenMenu: PropTypes.func.isRequired,
    profile: PropTypes.object,
    currentProgram: PropTypes.object,
};

Header.defaultProps = {
    profile: null,
    currentProgram: null,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    profile: state.auth.profileData,
    currentProgram: getCurrentProgram(state),
});

export default connect(mapStateToProps)(withStyles(styles)(Header));
