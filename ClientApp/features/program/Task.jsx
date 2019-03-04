import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import { PrevIcon, NextIcon } from '../../common/icons';

import * as ProgramStore from '../../app/store/ProgramStore';
import * as ModalStore from '../../app/store/ModalStore';
import urls from '../../app/urls';
import TaskElement from './components/TaskElement';
import ProgramBreadcrumb from './components/ProgramBreadcrumb';
import { patientProgramElementGroups } from '../../youwell-common/constants';
import { hasValue } from '../../youwell-common/objectUtils';
import { DelayedFetch } from '../../common/components';
import LoadElementResponses from './components/LoadElementResponses';

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
            marginTop: theme.spacing.unit,
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
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: `${theme.spacing.unit * 4}px 0`,
    },
    singleactions: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: `${theme.spacing.unit * 4}px 0`,
    },
    navIconLeft: {
        marginRight: theme.spacing.unit,
    },
    navIconRight: {
        marginLeft: theme.spacing.unit,
    },
});

const getTask = (programDetails, match) => {
    const { group, elementIndex, subIndex } = match.params;
    if (!programDetails || !programDetails.groupedElements || !programDetails.groupedElements[group]) { return null; }
    const elementsInGroup = programDetails.groupedElements[group];
    const element = elementsInGroup[elementIndex];
    const subIndexNr = Number(subIndex) || 0;

    if (!element) {
        return null;
    }

    const task = element.module && element.module.tasks ? element.module.tasks[subIndexNr] : element.task;

    if (!task) {
        return null;
    }

    return {
        ...task,
        module: element.module,
        patientProgramId: programDetails.id,
        patientProgramElementId: element.id,
        currentTaskNr: Number(element.module ? subIndex : elementIndex),
        listLength: element.module ? element.module.tasks.length : elementsInGroup.length,
        latestResponses: group === patientProgramElementGroups.calendar ? task.todaysResponses : task.latestResponses,
        formDisabled: group === patientProgramElementGroups.scheduled && hasValue(task.latestResponses),
    };
};

const stateFromData = (programDetails, match) => {
    const task = getTask(programDetails, match);

    return {
        id: task && task.id,
    };
};

class Task extends React.Component {
    state = stateFromData(this.props.programDetails, this.props.match);

    static getDerivedStateFromProps(props, state) {
        const task = getTask(props.programDetails, props.match);

        if (task && task.id !== state.id) {
            return stateFromData(props.programDetails, props.match);
        }
        return null;
    }

    clickNext = nextDirection => () => {
        const { programDetails, match } = this.props;
        const { group, elementIndex } = match.params;
        const task = getTask(programDetails, match);

        const nextTaskNr = task.currentTaskNr + nextDirection;
        const isLastTask = nextTaskNr > task.listLength - 1;

        let redirect = '';
        if (nextTaskNr < 0 || isLastTask) redirect = `${urls.inside.program.home}/${this.props.programDetails.id}`;
        else if (task.module) redirect = `${urls.inside.program.home}/${programDetails.id}/${group}/${elementIndex}/${nextTaskNr}`;
        else redirect = `${urls.inside.program.home}/${programDetails.id}/${group}/${nextTaskNr}`;

        const lastTaskCallback = () => {
            const allTasksVisited = task.module ? task.module.tasks.filter(d => !d.visited && d.id !== task.id).length === 0 : true;
            if (allTasksVisited) {
                this.props.showModal({
                    header: this.props.translate('task.moduleCompletedHeader'),
                    message: this.props.translate('task.moduleCompletedDescription'),
                    link: `${urls.inside.program.home}/${this.props.programDetails.id}`,
                    linkText: this.props.translate('task.goToHomePage'),
                });
            } else {
                this.props.showModal({
                    header: this.props.translate('task.moduleIncompletedHeader'),
                    message: this.props.translate('task.moduleIncompletedDescription'),
                    link: `${urls.inside.program.home}/${programDetails.id}/${urls.inside.program.parts.module}/${group}/${elementIndex}`,
                    linkText: this.props.translate('task.goToModulePage'),
                });
            }
        };

        if (isLastTask) {
            lastTaskCallback();
        } else {
            this.props.redirect(redirect);
        }
    }

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
            classes, translate, programDetails, match,
        } = this.props;
        const { group, elementIndex, subIndex } = match.params;

        const task = getTask(programDetails, match);

        if (!task) {
            if (programDetails && programDetails.groupedElements && programDetails.groupedElements[group] && programDetails.groupedElements[group][elementIndex]
                && programDetails.groupedElements[group][elementIndex].module) {
                return (
                    <Redirect to={{ pathname: `${urls.inside.program.home}/${programDetails.id}/${urls.inside.program.parts.module}/${group}/${elementIndex}` }} />
                );
            }

            return (
                <React.Fragment>
                    <Typography align="center" color="primary" className={classes.noContent}>
                        {translate('noTask')}
                    </Typography>
                </React.Fragment>
            );
        }

        const taskElements = task.contentElements || [];
        const isFirstTask = task.currentTaskNr === 0;

        return (
            <div className={classes.root}>
                <ProgramBreadcrumb programDetails={programDetails} group={group} elementIndex={elementIndex} subIndex={subIndex} />
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
                                    key={`${task.id}-${item.id}`}
                                    patientProgramId={programDetails.id}
                                    patientProgramElementId={task.patientProgramElementId}
                                    task={task}
                                    element={item}
                                />
                            ))}
                        </React.Fragment>
                    )}
                </div>

                {group === patientProgramElementGroups.main ? (
                    <div className={classes.actions}>
                        <Button
                            onClick={this.clickNext(-1)}
                            disabled={isFirstTask}
                        >
                            <PrevIcon className={classes.navIconLeft} color="inherit" />
                            {translate('previous')}
                        </Button>
                        <Button
                            onClick={this.clickNext(1)}
                        >
                            {translate('next')}
                            <NextIcon className={classes.navIconRight} color="inherit" />
                        </Button>
                    </div>
                ) : (
                    <div className={classes.singleactions}>
                        <Button
                            component={Link}
                            to={`${urls.inside.program.home}/${this.props.programDetails.id}`}
                            color="primary"
                        >
                            {translate('backToProgramPage')}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

Task.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            programId: PropTypes.string.isRequired,
            group: PropTypes.string.isRequired,
            elementIndex: PropTypes.string.isRequired,
            subIndex: PropTypes.string,
        }).isRequired,
    }).isRequired,
    visitTask: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    programDetails: PropTypes.object,
};

Task.defaultProps = {
    programDetails: null,
};

const mapStateToProps = (state, ownProps) => ({
    translate: getTranslate(state.localize),
    programDetails: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
    showModal: bindActionCreators(ModalStore.actionCreators, dispatch).showModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Task));
