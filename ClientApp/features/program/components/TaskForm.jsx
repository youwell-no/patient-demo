import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { Typography, Button } from '@material-ui/core';

import FormQuestion, { hasValueForQuestionType } from './FormQuestion';
import { timestamp } from '../../../youwell-common/dateUtils';

import * as ProgramStore from '../../../app/store/ProgramStore';
import * as ModalStore from '../../../app/store/ModalStore';

const styles = theme => ({
    root: {
        background: theme.colors.grey1,
        flex: '1 1 auto',
        minHeight: 200,
        boxShadow: theme.borders.boxShadow1,

        [theme.breakpoints.down('xs')]: {
            padding: `0 ${theme.spacing.unit}px`,
        },
    },
    fomrContentSinglePage: {
        background: theme.colors.blue2,
    },
    titleText: {
        padding: `${theme.spacing.unit * 2}px 0`,
        flex: '1 1 auto',
    },
    introText: {
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
    },
    previousResponses: {
        marginTop: theme.spacing.unit * 2,
        padding: theme.spacing.unit,
    },
    questions: {
        padding: theme.spacing.unit,
    },
    actions: {
        padding: `${theme.spacing.unit}px 0`,
        margin: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        minWidth: 200,
        marginBottom: theme.spacing.unit * 2,
    },
});

class TaskForm extends React.Component {
    state = {
        showRequiredFieldsError: false,
        responses: this.props.responses || {},
        hasUnsavedChanges: false,
        saveMessage: '',
    };

    handleResponseUpdate = qId => (responseName, value) => {
        this.setState(prevState => ({
            hasUnsavedChanges: true,
            saveMessage: '',
            responses: {
                ...prevState.responses,
                [qId]: {
                    response: {
                        [responseName]: value,
                    },
                },
            },
        }));
    }

    send = () => {
        const { taskId, patientProgramId, patientProgramElementId } = this.props;

        const invalid = this.props.questions.reduce((prev, curr) => prev
        || (curr.required && !hasValueForQuestionType(curr.type, this.state.responses[curr.id] && this.state.responses[curr.id].response)),
        false);

        if (!invalid) {
            const responses = this.props.questions.map(q => ({
                questionId: q.id,
                ...(this.state.responses[q.id] || {}).response,
            }));

            const callback = () => {
                // this.setState({ saveMessage: this.props.translate('taskForm.answersHasBeenSent') });
                this.props.showModal({
                    // header: this.props.translate('taskForm.answersHasBeenSentHeader'),
                    message: this.props.translate('taskForm.answersHasBeenSent'),
                });
                this.setState({ hasUnsavedChanges: false, showRequiredFieldsError: false });
            };

            const responseData = {
                taskId,
                patientProgramId,
                patientProgramElementId,
                responses,
            };

            const reducerParams = {
                patientProgramId,
                taskId,
                responses,
            };

            this.props.sendTaskResponse(responseData, { callback, reducerParams });
        } else {
            this.setState({ showRequiredFieldsError: true });
        }
    }

    render() {
        const {
            classes, translate, questions, disabled, className,
        } = this.props;

        if (!questions || questions.length === 0) {
            return null;
        }

        const formDisabled = disabled;

        return (
            <div className={classnames(classes.root, className)}>
                <div className={classes.questions}>
                    {questions.map(q => (
                        <FormQuestion
                            key={q.id}
                            question={q}
                            response={this.state.responses[q.id] && this.state.responses[q.id].response}
                            handleResponseUpdate={this.handleResponseUpdate(q.id)}
                            showRequired={this.state.showRequiredFieldsError}
                            disabled={formDisabled}
                        />
                    ))}
                </div>

                {this.props.lastResponseDateTime && (
                    <Typography variant="caption" align="right" className={classes.previousResponses}>
                        {`${translate('lastResponded')}: ${timestamp(this.props.lastResponseDateTime)}`}
                    </Typography>
                )}

                <div className={classes.actions}>
                    {this.state.showRequiredFieldsError && (
                        <Typography color="error" gutterBottom>
                            {translate('pleaseAnswerRequiredQuestions')}
                        </Typography>
                    )}
                    {this.state.saveMessage && (
                        <Typography color="primary" gutterBottom>
                            {this.state.saveMessage}
                        </Typography>
                    )}
                    {!formDisabled && (
                        <Button onClick={this.send} color="primary" variant="contained" disabled={!this.state.hasUnsavedChanges} className={classes.sendButton}>
                            {translate('taskForm.saveAndSend')}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}


TaskForm.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    sendTaskResponse: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    lastResponseDateTime: PropTypes.string,
    taskId: PropTypes.string.isRequired,
    patientProgramElementId: PropTypes.string.isRequired,
    patientProgramId: PropTypes.string.isRequired,
    responses: PropTypes.object,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

TaskForm.defaultProps = {
    responses: null,
    lastResponseDateTime: null,
    disabled: false,
    className: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
    ...bindActionCreators(ModalStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TaskForm));
