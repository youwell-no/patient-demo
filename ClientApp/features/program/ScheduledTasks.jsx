import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import * as ModalStore from '../../app/store/ModalStore';
import urls from '../../app/urls';
import BackLink from './components/BackLink';
import { patientProgramElementGroups } from '../../youwell-common/constants';
import { dateWithOptionalTime } from '../../youwell-common/dateUtils';
import { CompletedIcon, NotDoneIcon } from '../../common/icons';
import LoadElementResponses from './components/LoadElementResponses';

const styles = theme => ({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing.unit,
        },
    },
    heading: {
        marginTop: theme.spacing.unit * 4,
        marginLeft: theme.spacing.unit * 5,
        marginBottom: theme.spacing.unit,

        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 8,
        },
    },
    modules: {
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.down('xs')]: {
            flex: '1 1 auto',
        },

        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1,
        },
    },
    task: {
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 5}px`,
        display: 'flex',
        alignItems: 'center',
        borderBottom: theme.borders.normal,

        [theme.breakpoints.up('sm')]: {
            margin: `0 ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 6}px`,
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
        },
    },
    flex: {
        flex: '1 1 auto',
    },
    moduleDate: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    preIcon: {
        width: 40,
        color: theme.colors.green,
        marginLeft: -theme.spacing.unit * 2,

        [theme.breakpoints.up('sm')]: {
            marginLeft: -theme.spacing.unit * 6,
        },
    },
    noContent: {
        padding: theme.spacing.unit * 4,
        margin: theme.spacing.unit * 2,
    },
    disabled: {
        pointerEvents: 'none',
        cursor: 'default',
        opacity: 0.7,
    },
});

class ScheduledTasks extends React.Component {
    render() {
        const {
            classes, translate, programDetails,
        } = this.props;

        if (!programDetails) {
            return null;
        }

        const scheduledElements = programDetails.groupedElements[patientProgramElementGroups.scheduled];

        return (
            <div className={classes.root}>
                <BackLink history={this.props.history} />

                {scheduledElements.length > 0 ? (
                    <React.Fragment>
                        <Typography variant="subtitle1" className={classes.heading}>
                            {translate('program.scheduledTasksHeading')}
                        </Typography>
                        <div className={classes.modules}>
                            {scheduledElements.map((element, i) => (
                                <Link
                                    key={element.id}
                                    className={classnames(classes.task)}
                                    to={`${urls.inside.program.home}/${programDetails.id}/${patientProgramElementGroups.scheduled}/${i}`}
                                >
                                    <LoadElementResponses patientProgramId={programDetails.id} patientProgramElementId={element.id} />
                                    <div className={classes.preIcon}>
                                        {element.task.allQuestionsAnswered && <CompletedIcon color="inherit" />}
                                        {!element.task.allQuestionsAnswered && new Date(element.startTime) <= new Date() && <NotDoneIcon color="error" />}
                                    </div>
                                    <Typography className={classes.flex}>
                                        {element.task.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" className={classes.moduleDate}>
                                        {dateWithOptionalTime(element.startTime)}
                                    </Typography>
                                </Link>
                            ))}
                        </div>
                    </React.Fragment>
                ) : (
                    <Typography align="center" color="textSecondary" className={classes.noContent}>
                        {translate('noTasksAssigned')}
                    </Typography>
                )}
            </div>
        );
    }
}

ScheduledTasks.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    programDetails: PropTypes.object,
};

ScheduledTasks.defaultProps = {
    programDetails: null,
};

const mapStateToProps = (state, ownProps) => ({
    translate: getTranslate(state.localize),
    programDetails: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ModalStore.actionCreators, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ScheduledTasks));
