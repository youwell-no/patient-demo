import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import {
    Typography, LinearProgress, Grid,
} from '@material-ui/core';

import ProgramBreadcrumb from './components/ProgramBreadcrumb';
import ModuleContent from './components/ModuleContent';
import CalendarContent from './components/CalendarContent';
import ProgramError from './components/ProgramError';
import { patientProgramElementGroups } from '../../youwell-common/constants';
import { getLocalDate, getNumberOfWeeks, getNumberOfDays } from '../../youwell-common/dateUtils';
import apiUrls from '../../youwell-common/apiUrls';

const styles = theme => ({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing.unit,
        },
    },
    topContainer: {
        height: '100%',
    },
    imageContainer: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        textAlign: 'center',
    },
    programNameContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        },
    },
    title: {
        flex: '1 1 auto',
        [theme.breakpoints.down('xs')]: {
            margin: theme.spacing.unit * 2,
        },
    },
    progress: {
        height: 12,
        marginTop: theme.spacing.unit * 2,
    },
    progressText: {
        marginTop: theme.spacing.unit / 2,
    },
    programImage: {
        [theme.breakpoints.down('xs')]: {
            width: '70%',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
    },
    noContent: {
        padding: theme.spacing.unit * 4,
        margin: theme.spacing.unit * 2,
    },
});

class Program extends React.Component {
    render() {
        const {
            classes, translate, programDetails,
        } = this.props;

        if (!programDetails || !programDetails.program) {
            return <ProgramError />;
        }

        const mainElements = (programDetails.groupedElements && programDetails.groupedElements[patientProgramElementGroups.main]) || [];
        const calendarElements = (programDetails.groupedElements && programDetails.groupedElements[patientProgramElementGroups.calendar]) || [];
        const hasContent = mainElements.length > 0 || calendarElements.length > 0;

        const programImage = programDetails.program.frontImageId ? `${apiUrls.media}/${programDetails.program.frontImageId}` : null;
        const start = getLocalDate(programDetails.startDate);
        const end = getLocalDate(programDetails.endDate);
        const now = new Date();
        const totalWeeks = getNumberOfWeeks(start, end);

        let progress;
        let progressText;
        if (totalWeeks > 2) {
            const finishedWeeks = getNumberOfWeeks(start, now);
            progress = finishedWeeks / totalWeeks * 100;
            progressText = translate('program.youHaveFinishedXWeeks', { finished: Math.min(finishedWeeks, totalWeeks), total: totalWeeks });
        } else if (start && end) {
            const finishedDays = getNumberOfDays(start, now);
            const totalDays = getNumberOfDays(start, end);
            progress = finishedDays / totalDays * 100;
            progressText = translate('program.youHaveFinishedXDays', { finished: Math.min(finishedDays, totalDays), total: totalDays });
        } else if (programDetails.totalModules > 0) {
            progress = programDetails.completedModules / programDetails.totalModules * 100;
            progressText = translate('program.youHaveFinishedXModules', { finished: Math.min(programDetails.completedModules, programDetails.totalModules), total: programDetails.totalModules });
        }

        return (
            <div className={classes.root}>
                <ProgramBreadcrumb programDetails={programDetails} />

                <Grid container className={classes.topContainer}>
                    <Grid item xs={12} sm={6} className={classes.imageContainer}>
                        {programImage && <img src={programImage} alt="" className={classes.programImage} />}
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.programNameContainer}>
                        <div className={classes.title}>
                            <Typography variant="h6">
                                {programDetails.program.name}
                            </Typography>
                            {(progress || progress === 0) && <LinearProgress variant="determinate" value={progress} className={classes.progress} />}
                            {progressText && (
                                <Typography variant="caption" className={classes.progressText}>
                                    {progressText}
                                </Typography>
                            )}
                        </div>
                    </Grid>
                </Grid>

                {hasContent ? (
                    <React.Fragment>
                        <ModuleContent elements={mainElements} programId={programDetails.id} elementType={patientProgramElementGroups.main} />
                        <CalendarContent elements={calendarElements} programId={programDetails.id} elementType={patientProgramElementGroups.calendar} />
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

Program.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    programDetails: PropTypes.object,
};

Program.defaultProps = {
    programDetails: null,
};

const mapStateToProps = (state, ownProps) => ({
    translate: getTranslate(state.localize),
    programDetails: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});


export default connect(mapStateToProps)(withStyles(styles)(Program));
