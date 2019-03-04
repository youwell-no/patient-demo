import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import {
    Typography, TextField, FormControlLabel, RadioGroup, Radio, Checkbox, FormGroup,
} from '@material-ui/core';

import { hasValue, isEmpty } from '../../../youwell-common/objectUtils';
import { formAnswerTypes } from '../../../youwell-common/constants';
import { HtmlContent } from '../../../common/components';
import TableResponse from './TableResponse';
import ScaleResponse from './ScaleResponse';
import * as ProgramStore from '../../../app/store/ProgramStore';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 2,
    },
    response: {
        backgroundColor: theme.palette.common.white,
        padding: theme.spacing.unit * 2,
    },
    required: {
        border: `thin solid ${theme.palette.error.main}`,
        padding: theme.spacing.unit,
    },
    questionText: {
        margin: `${theme.spacing.unit}px 0`,
    },
    missingContent: {
        padding: theme.spacing.unit * 2,
    },
    formControlLabel: {
        flex: '1 1 auto',
    },
});

export const hasValueForQuestionType = (questionType, response) => {
    if (!response || isEmpty(response)) {
        return false;
    }
    switch (questionType) {
    case formAnswerTypes.freetext:
        return hasValue(response.freetextResponse);
    case formAnswerTypes.singleChoice:
    case formAnswerTypes.multipleChoice:
        return hasValue(response.choiceResponse);
    case formAnswerTypes.scale:
        return hasValue(response.scaleResponse);
    case formAnswerTypes.table:
        return hasValue(response.tableResponses);
    default:
        return false;
    }
};

class FormQuestion extends React.Component {
    handleChange = name => (event) => {
        this.props.handleResponseUpdate(name, event.target.value);
    }

    handleSingleSelectChange = (name, answers) => (event) => {
        this.props.handleResponseUpdate(name, answers.filter(d => d.value === event.target.value));
    }

    handleMultiSelectChange = (name, answer) => (event, checked) => {
        const prevResponse = (this.props.response && this.props.response[name]) || [];
        if (checked) {
            this.props.handleResponseUpdate(name, [...prevResponse, answer]);
        } else {
            this.props.handleResponseUpdate(name, prevResponse.filter(d => d.value !== answer.value));
        }
    };

    handleResponseUpdate = name => (value) => {
        this.props.handleResponseUpdate(name, value);
    }

    render() {
        const {
            classes, translate, question, response, showRequired, disabled,
        } = this.props;

        if (question === null) {
            return null;
        }

        const checkedResponses = response && response.choiceResponse && response.choiceResponse.reduce((prev, curr) => (
            { ...prev, [curr.value]: true }
        ), {});

        return (
            <div className={classnames(classes.root, { [classes.required]: showRequired && !hasValueForQuestionType(question.type, response) })}>
                <HtmlContent html={question.question} className={classes.questionText} />

                <div className={classes.response}>
                    {question.type === formAnswerTypes.freetext && (
                        <React.Fragment>
                            <TextField
                                placeholder={translate('writeYourResponseHere')}
                                multiline
                                rows={10}
                                fullWidth
                                disabled={disabled}
                                value={(response && response.freetextResponse) || ''}
                                onChange={this.handleChange('freetextResponse')}
                                className={classes.input}
                                InputProps={{ disableUnderline: true }}
                            />
                        </React.Fragment>
                    )}

                    {question.type === formAnswerTypes.singleChoice && (
                        <React.Fragment>
                            <Typography variant="caption">
                                {translate('choose_an_answer')}
                            </Typography>
                            <RadioGroup
                                aria-label={translate('response')}
                                className={classes.group}
                                value={(response && response.choiceResponse && response.choiceResponse[0] && response.choiceResponse[0].value) || ''}
                                onChange={this.handleSingleSelectChange('choiceResponse', question.answers)}
                            >
                                {question.answers && question.answers.length > 0 ? question.answers.map(item => (
                                    <FormControlLabel
                                        disabled={disabled}
                                        key={item.id}
                                        value={item.value}
                                        control={<Radio />}
                                        classes={{ label: classes.formControlLabel }}
                                        label={item.value}
                                    />
                                )) : (
                                    <Typography variant="caption" className={classes.missingContent}>
                                        {translate('noContent')}
                                    </Typography>
                                )}
                            </RadioGroup>
                        </React.Fragment>
                    )}

                    {question.type === formAnswerTypes.multipleChoice && (
                        <React.Fragment>
                            <Typography variant="caption">
                                {translate('choose_one_or_more_answers')}
                            </Typography>
                            <FormGroup>
                                {question.answers && question.answers.length > 0 ? question.answers.map(item => (
                                    <FormControlLabel
                                        key={item.id}
                                        control={(
                                            <Checkbox
                                                disabled={disabled}
                                                checked={(checkedResponses && checkedResponses[item.value]) || false}
                                                onChange={this.handleMultiSelectChange('choiceResponse', item)}
                                                value={item.value}
                                            />
                                        )}
                                        classes={{ label: classes.formControlLabel }}
                                        label={item.value}
                                    />
                                )) : (
                                    <Typography variant="caption" className={classes.missingContent}>
                                        {translate('noContent')}
                                    </Typography>
                                )}
                            </FormGroup>
                        </React.Fragment>
                    )}

                    {question.type === formAnswerTypes.scale && (
                        <ScaleResponse
                            scaleConfig={question.scaleConfig}
                            response={response && response.scaleResponse}
                            disabled={disabled}
                            handleResponseUpdate={this.handleResponseUpdate('scaleResponse')}
                        />
                    )}
                    {question.type === formAnswerTypes.table && (
                        <TableResponse
                            tableConfig={question.tableConfig}
                            response={response && response.tableResponses}
                            disabled={disabled}
                            handleResponseUpdate={this.handleResponseUpdate('tableResponses')}
                        />
                    )}
                </div>

            </div>
        );
    }
}

FormQuestion.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    handleResponseUpdate: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    response: PropTypes.object,
    showRequired: PropTypes.bool,
    disabled: PropTypes.bool,
};

FormQuestion.defaultProps = {
    response: null,
    showRequired: false,
    disabled: false,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormQuestion));
