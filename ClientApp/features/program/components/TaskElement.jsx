import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import {
    Typography, Button, Hidden, ButtonBase,
} from '@material-ui/core';

import { HtmlContent } from '../../../common/components';
import { elementConditionTypes } from '../../../youwell-common/constants';

import TaskScript from './TaskScript';
import TaskForm from './TaskForm';
import TaskElementLink from './TaskElementLink';
import { CloseIcon } from '../../../common/icons';
import { hasValue } from '../../../youwell-common/objectUtils';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2,
        position: 'relative',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        background: theme.colors.blue1,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    },
    title: {
        flex: '1 1 auto',
    },
    closeButton: {
        minWidth: 0,
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    htmlContent: {
        width: '100%',
        overflow: 'hidden',
        marginTop: theme.spacing.unit,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    },
    linkContent: {
        marginTop: theme.spacing.unit,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    },
    questionnaire: {
        marginTop: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: `0 ${theme.spacing.unit * 4}px`,

        [theme.breakpoints.down('xs')]: {
            padding: 0,
            marginTop: 0,
        },
    },
    conditionContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conditionContentButton: {
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
        border: theme.borders.thickBlue,
    },
    conditionButton: {
        margin: theme.spacing.unit * 2,
        width: 150,
        height: 150,
        borderRadius: 75,
        background: theme.palette.common.white,
        border: theme.borders.thickBlue,
        color: 'inherit',
        '&:hover': {
            background: theme.colors.blue1,
        },
        animation: 'glow 1.5s ease 0.5s infinite alternate',
    },
    '@keyframes glow': {
        from: {
            background: theme.palette.common.white,
            boxShadow: 'none',
        },
        to: {
            background: `${theme.colors.blue1}55`,
            boxShadow: `0 0 8px 8px ${theme.colors.blue2}`,
        },
    },
    conditionLink: {
        margin: theme.spacing.unit,
        borderBottom: theme.borders.normal,
        color: theme.colors.blue3,
    },
    taskFormVariant: {
        background: theme.colors.blue1,
    },
});

const getShowContent = (element, responses) => {
    if (!element) {
        return false;
    }
    if (!element.condition) {
        return true;
    }

    switch (element.condition.type) {
    case elementConditionTypes.action:
        return false;
    case elementConditionTypes.response:
        if (element.condition.expectedAnswers != null && element.condition.expectedAnswers.length > 0) {
            return responses && responses[element.condition.questionId] && responses[element.condition.questionId].response
            && responses[element.condition.questionId].response.choiceResponse && responses[element.condition.questionId].response.choiceResponse
                .reduce((p, c) => p || element.condition.expectedAnswers.filter(d => d === c.value).length > 0, false);
        } if (hasValue(element.condition.scoreMin) || hasValue(element.condition.scoreMax)) {
            return responses && responses[element.condition.questionId] && responses[element.condition.questionId].response
            && hasValue(responses[element.condition.questionId].response.scaleResponse)
            && (
                (!element.condition.scoreMin || responses[element.condition.questionId].response.scaleResponse >= element.condition.scoreMin)
                && (!element.condition.scoreMax || responses[element.condition.questionId].response.scaleResponse <= element.condition.scoreMax)
            );
        }
        return false;
    default:
        return true;
    }
};

const getUpdateId = (element, task) => `${element.id}-${task.id}-${task.lastResponseDateTime}`;

const stateFromData = (element, task) => ({
    updateId: getUpdateId(element, task),
    showContent: getShowContent(element, task.latestResponses),
    conditionType: element && element.condition && element.condition.type,
});

class TaskElement extends React.Component {
    state = stateFromData(this.props.element, this.props.task);

    static getDerivedStateFromProps(props, state) {
        if (state.updateId !== getUpdateId(props.element, props.task)) {
            return stateFromData(props.element, props.task);
        }
        return null;
    }

    toggleShow = () => {
        this.setState(prevState => ({ showContent: !prevState.showContent }));
    }

    render() {
        const {
            classes, translate, patientProgramId, patientProgramElementId, task, element, variant,
        } = this.props;

        const { showContent, conditionType } = this.state;

        if (!showContent) {
            if (conditionType === elementConditionTypes.action) {
                return (
                    <React.Fragment>
                        <div className={classes.conditionContainer}>
                            {element.condition.introHtmlContent ? (
                                <ButtonBase onClick={this.toggleShow} className={classes.conditionContentButton}>
                                    <HtmlContent html={element.condition.introHtmlContent} />
                                </ButtonBase>
                            ) : (
                                <Button color="primary" variant="contained" onClick={this.toggleShow} className={classes.conditionButton}>
                                    {element.condition.actionLinkText || translate('taskElement.show') }
                                </Button>
                            )}
                        </div>
                    </React.Fragment>
                );
            }

            return null;
        }

        return (
            <div className={classes.root}>
                {(element.title || conditionType === elementConditionTypes.action) && (
                    <div className={classes.header}>
                        <Typography variant="subtitle1" className={classes.title}>
                            {element.title}
                        </Typography>
                        {(conditionType === elementConditionTypes.action) && (
                            <Button className={classes.closeButton} onClick={this.toggleShow} color="primary">
                                <CloseIcon />
                                <Hidden implementation="css" smDown>{translate('close')}</Hidden>
                            </Button>
                        )}
                    </div>
                )}

                <HtmlContent html={element.htmlContent} className={classes.htmlContent} />
                <TaskElementLink link={element.link} className={classes.linkContent} />

                {element.script && (
                    <TaskScript script={element.script} />
                )}

                {element.questions && element.questions.length > 0 && (
                    <div className={classes.questionnaire}>
                        <TaskForm
                            key={`${task.id}-${task.lastResponseDateTime}`}
                            questions={element.questions}
                            patientProgramId={patientProgramId}
                            patientProgramElementId={patientProgramElementId}
                            taskId={task.id}
                            responses={task.latestResponses}
                            lastResponseDateTime={task.lastResponseDateTime}
                            disabled={task.formDisabled}
                            className={variant ? classes.taskFormVariant : null}
                        />
                    </div>
                )}

            </div>
        );
    }
}

TaskElement.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    element: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    patientProgramElementId: PropTypes.string.isRequired,
    patientProgramId: PropTypes.string.isRequired,
    variant: PropTypes.bool,
};

TaskElement.defaultProps = {
    variant: false,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});


export default connect(mapStateToProps)(withStyles(styles)(TaskElement));
