import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import { Typography } from '@material-ui/core';

import * as ProgramStore from '../../app/store/ProgramStore';
import TaskElement from './components/TaskElement';
import BackLink from './components/BackLink';
import LoadElementResponses from './components/LoadElementResponses';
import { DelayedFetch } from '../../common/components';

const styles = theme => ({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    },
    noContent: {
        padding: theme.spacing.unit * 4,
        margin: theme.spacing.unit * 2,
    },
    taskTitle: {
        padding: `0 ${theme.spacing.unit * 4}px`,
        margin: `${theme.spacing.unit * 2}px 0`,

        [theme.breakpoints.up('sm')]: {
            margin: 0,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
            background: theme.colors.blue4,
            color: theme.palette.common.white,
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1Right,
        },
    },
    taskContent: {
        height: '100%', // Needed for IE
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1,
        },
    },
});

const getTask = (programDetails) => {
    if (!programDetails || !programDetails.myPlanElement || !programDetails.myPlanElement.task) { return null; }

    return {
        ...programDetails.myPlanElement.task,
        patientProgramId: programDetails.id,
        patientProgramElementId: programDetails.myPlanElement.id,
    };
};

class Plan extends React.Component {
    visitTask = () => {
        const { programDetails, match } = this.props;
        const task = getTask(programDetails, match);

        if (!task.visited) {
            this.props.visitTask({
                ppeId: task.patientProgramElementId,
                id: task.id,
            }, { reducerParams: { patientProgramId: programDetails.id, taskId: task.id } });
        }
    }

    render() {
        const {
            classes, translate, programDetails,
        } = this.props;

        const task = getTask(programDetails);

        if (!task) {
            return null;
        }

        const taskElements = task.contentElements || [];

        return (
            <div className={classes.root}>
                <BackLink history={this.props.history} />
                <DelayedFetch dataCall={this.visitTask} delaySeconds={2} key={task.id} />
                <LoadElementResponses patientProgramId={programDetails.id} patientProgramElementId={task.patientProgramElementId} />

                <div className={classes.taskTitle}>
                    <Typography variant="h6" color="inherit">
                        {task.name}
                    </Typography>
                </div>

                <div className={classes.taskContent}>
                    {taskElements.length === 0 ? (
                        <Typography align="center" color="textSecondary" className={classes.noContent}>
                            {translate('noContent')}
                        </Typography>
                    ) : (
                        <React.Fragment>
                            {taskElements.map(item => (
                                <TaskElement
                                    key={item.id}
                                    patientProgramId={programDetails.id}
                                    patientProgramElementId={task.patientProgramElementId}
                                    task={task}
                                    element={item}
                                    variant
                                />
                            ))}
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

Plan.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            programId: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    visitTask: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    programDetails: PropTypes.object,
};

Plan.defaultProps = {
    programDetails: null,
};

const mapStateToProps = (state, ownProps) => ({
    translate: getTranslate(state.localize),
    programDetails: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Plan));
