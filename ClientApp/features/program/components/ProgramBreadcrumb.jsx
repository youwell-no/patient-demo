import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {
    Typography, Hidden,
} from '@material-ui/core';

import { SeparatorIcon, BackIcon } from '../../../common/icons';

import urls from '../../../app/urls';
import { patientProgramElementGroups } from '../../../youwell-common/constants';


const styles = theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            alignItems: 'center',
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        },
    },
    link: {
        [theme.breakpoints.up('sm')]: {
            borderBottom: theme.borders.normal,
        },
    },
    icon: {
        marginRight: theme.spacing.unit * 2,
        color: 'rgba(0, 0, 0, 0.54)',
    },
    iconsmall: {
        marginRight: theme.spacing.unit,
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1em',
    },
    program: {
        marginRight: theme.spacing.unit * 2,

        [theme.breakpoints.down('xs')]: {
            margin: 0,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        },
    },
    module: {
        marginRight: theme.spacing.unit * 2,

        [theme.breakpoints.down('xs')]: {
            margin: 0,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        },
    },
    boxShadow: {
        [theme.breakpoints.down('xs')]: {
            boxShadow: theme.shadows[1],
        },
    },
    task: {
        [theme.breakpoints.down('xs')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        },
    },
    visibleSmUp: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    visibleXsDown: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
    },
});


class ProgramBreadcrumb extends React.Component {
    render() {
        const {
            classes, translate, programDetails, group, elementIndex, subIndex,
        } = this.props;

        const elements = (programDetails && programDetails.groupedElements && programDetails.groupedElements[group]) || [];
        const element = elementIndex ? elements[elementIndex] : null;
        const elementIsModule = element && !!element.module;
        const subElement = elementIsModule && element.module.tasks ? element.module.tasks[subIndex] : null;

        let levels = 1;
        if (elementIndex) levels = 2;
        if (subIndex && group !== patientProgramElementGroups.scheduled) levels = 3;

        return (
            <div className={classes.root}>
                {(levels > 1) && (
                    <React.Fragment>
                        <Link to={`${urls.inside.program.home}/${programDetails.id}`}>
                            <Typography color="textSecondary" className={classnames(classes.program, classes.link, classes.boxShadow)}>
                                <span className={classes.visibleSmUp}>
                                    {translate('home')}
                                </span>
                                <span className={classnames(classes.visibleXsDown)}>
                                    <BackIcon className={classes.iconsmall} />
                                    {translate('home')}
                                </span>
                            </Typography>
                        </Link>
                        <Hidden implementation="css" xsDown>
                            <SeparatorIcon className={classes.icon} />
                        </Hidden>
                        <Hidden implementation="css" xsDown>
                            <Link to={elementIsModule ? `${urls.inside.program.home}/${programDetails.id}/${urls.inside.program.parts.module}/${group}/${elementIndex}`
                                : `${urls.inside.program.home}/${programDetails.id}/${group}/${elementIndex}`}
                            >
                                <Typography color="textSecondary" className={classnames(classes.module, { [classes.link]: levels > 2, [classes.boxShadow]: levels > 2 })}>
                                    {elementIsModule ? `${element.module.name}`
                                        : `${element.task.name}`}
                                </Typography>
                            </Link>
                        </Hidden>
                        <Hidden implementation="css" smUp>
                            {levels > 2 && (
                                <Link to={`${urls.inside.program.home}/${programDetails.id}/${urls.inside.program.parts.module}/${group}/${elementIndex}`}>
                                    <Typography color="textSecondary" className={classnames(classes.module, classes.flexCenter, { [classes.link]: levels > 2, [classes.boxShadow]: levels > 2 })}>
                                        <BackIcon className={classes.iconsmall} />
                                        {element.module.name}
                                    </Typography>
                                </Link>
                            )}
                        </Hidden>
                    </React.Fragment>
                )}
                {levels > 2 && subElement && (
                    <React.Fragment>
                        <Hidden implementation="css" xsDown>
                            <SeparatorIcon className={classes.icon} />
                        </Hidden>
                        <Hidden implementation="css" xsDown>
                            <Link to={`${urls.inside.program.home}/${programDetails.id}/${group}/${elementIndex}/${subIndex}`}>
                                <Typography color="textSecondary" className={classes.task}>
                                    {`${subElement.name}`}
                                </Typography>
                            </Link>
                        </Hidden>
                    </React.Fragment>
                )}
            </div>
        );
    }
}


ProgramBreadcrumb.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    programDetails: PropTypes.object,
    group: PropTypes.string,
    elementIndex: PropTypes.string,
    subIndex: PropTypes.string,
};

ProgramBreadcrumb.defaultProps = {
    programDetails: null,
    elementIndex: null,
    subIndex: null,
    group: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(ProgramBreadcrumb));
