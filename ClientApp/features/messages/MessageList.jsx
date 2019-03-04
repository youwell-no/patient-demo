import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import {
    TextField, Button, Typography,
} from '@material-ui/core';

import {
    validateRequired, validateAllFields, validateField,
} from '../../youwell-common/validationUtils';


// import { UnreadIcon } from '../../common/icons';

import * as UserStore from '../../app/store/UserStore';
import { timestamp } from '../../youwell-common/dateUtils';
import { PollData } from '../../common/components';

const POLLING_INTERVAL_IN_MINUTES = 1;

const styles = theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto',
        padding: theme.spacing.unit * 2,
    },
    actions: {
        marginTop: theme.spacing.unit * 2,
        padding: theme.spacing.unit,
        border: theme.borders.dim,
    },
    textInput: {
    },
    sendLine: {
        marginTop: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    messageList: {

    },
    message: {
        marginBottom: theme.spacing.unit * 2,
    },
    textLine: {
        display: 'flex',
        alignItems: 'center',
    },
    lineFill: {
        flex: '1 0 20%',
    },
    textBox: {
        padding: theme.spacing.unit * 2,
        borderRadius: theme.spacing.unit,
    },
    textarea: {
        height: 105,
        [theme.breakpoints.down('xs')]: {
            height: 55,
        },
    },
    fromPatient: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    fromOther: {
        background: theme.palette.secondary.main,
        // color: theme.palette.common.white,
    },
    date: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    },
    unreadIcon: {
        opacity: 0.54,
    },
});

const defaultState = {
    text: '',
};

const validators = {
    text: validateRequired,
};

const createInitialState = () => ({
    ...defaultState,
    validationErrors: {},
});

class MessageList extends React.Component {
    state = createInitialState();

    componentDidMount() {
        this.markAsReadIfAny();
    }

    componentDidUpdate(prevProps) {
        if (this.props.latestMessage !== prevProps.latestMessage) {
            this.markAsReadIfAny();

            setTimeout(() => {
                document.getElementById('scrollList').scroll({
                    top: document.getElementById('scrollList').scrollHeight,
                    behavior: 'smooth',
                });
            }, 200);
        }
    }

    checkForMessages = () => {
        this.props.checkForNewMessages({
            background: true,
            requestParams: { timeStamp: this.props.latestMessage },
        });
    }

    markAsReadIfAny = () => {
        if (this.props.messageList && this.props.messageList.filter(d => !d.patientReadTime).length > 0) {
            this.props.markMessagesAsRead(this.props.latestMessage, {
                background: true,
            });
        }
    }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value }, () => {
            if (validators[name]) {
                const validationErrors = validateField(this.state, validators[name], name); // eslint-disable-line react/no-access-state-in-setstate
                this.setState({ validationErrors });
            }
        });
    }

    sendMessage = () => {
        const validationErrors = validateAllFields(this.state, validators);

        if (!validationErrors.hasErrors) {
            const data = {
                patientId: this.props.profile.id,
                text: this.state.text,
            };
            this.props.insertMessage(data, {
                callback: () => {
                    this.setState(createInitialState());
                },
            });
        } else {
            this.setState({ validationErrors });
        }
    }

    render() {
        const {
            classes, translate, messageList, profile,
        } = this.props;

        if (!profile) {
            return null;
        }
        return (
            <div className={classes.root}>
                <PollData
                    initialdataCall={this.props.messageList ? this.checkForMessages : this.props.getMessages}
                    dataCall={this.checkForMessages}
                    pollingIntervalInMinutes={POLLING_INTERVAL_IN_MINUTES}
                />

                <div className={classes.list} id="scrollList">
                    {messageList && messageList.map(item => (
                        <div key={item.created} className={classes.message}>
                            <div className={classes.textLine}>
                                {!item.senderIsPatient && (
                                    <React.Fragment>
                                        <div className={classes.lineFill} />
                                        <Typography variant="caption" className={classes.date} color="textSecondary">
                                            {timestamp(item.created)}
                                        </Typography>
                                    </React.Fragment>
                                )}
                                <Typography className={classnames(classes.textBox, { [classes.fromPatient]: item.senderIsPatient, [classes.fromOther]: !item.senderIsPatient })}>
                                    {item.text}
                                </Typography>
                                {item.senderIsPatient && (
                                    <React.Fragment>
                                        <Typography variant="caption" className={classes.date} color="textSecondary">
                                            {timestamp(item.created)}
                                        </Typography>
                                        <div className={classes.lineFill} />
                                    </React.Fragment>
                                )}
                            </div>
                            <Typography variant="caption" align={item.senderIsPatient ? 'left' : 'right'} color="textSecondary">
                                {item.senderIsPatient ? translate('chat.you') : item.senderName}
                            </Typography>
                        </div>
                    ))}
                </div>

                <div className={classes.actions}>
                    <TextField
                        className={classes.textInput}
                        fullWidth
                        multiline
                        variant="outlined"
                        value={this.state.text}
                        onChange={this.handleChange('text')}
                        label={translate('chat.sendMessageToTherapist')}
                        error={!!this.state.validationErrors.text}
                        helperText={this.state.validationErrors.text && translate(this.state.validationErrors.text)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ classes: { inputMultiline: classes.textarea } }}
                        rows={5}
                    />
                    <div className={classes.sendLine}>
                        <Button onClick={this.sendMessage} color="primary" variant="contained">
                            {translate('chat.send')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

MessageList.propTypes = {
    classes: PropTypes.object.isRequired,
    profile: PropTypes.object,
    translate: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
    checkForNewMessages: PropTypes.func.isRequired,
    markMessagesAsRead: PropTypes.func.isRequired,
    messageList: PropTypes.array,
    insertMessage: PropTypes.func.isRequired,
    latestMessage: PropTypes.string,
};

MessageList.defaultProps = {
    messageList: null,
    profile: null,
    latestMessage: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    profile: state.auth.profileData,
    messageList: state.user.messageList,
    latestMessage: state.user.messageList && state.user.messageList.length > 0 && state.user.messageList[state.user.messageList.length - 1].created,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(UserStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageList));
