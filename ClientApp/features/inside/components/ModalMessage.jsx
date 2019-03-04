import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import {
    Typography, Modal, IconButton, Button,
} from '@material-ui/core';

import { CloseIcon } from '../../../common/icons';
import * as ModalStore from '../../../app/store/ModalStore';

const styles = theme => ({
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,

        [theme.breakpoints.down('xs')]: {
            width: 300,
        },
    },
    closeIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    linkButton: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        justifyContent: 'center',
    },
});

class ModalMessage extends React.Component {
    render() {
        const {
            classes, open, closeModal, header, message, link, linkText,
        } = this.props;

        return (
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                open={open}
                onClose={closeModal}
            >
                <div className={classes.modal}>
                    <IconButton onClick={closeModal} className={classes.closeIcon}>
                        <CloseIcon />
                    </IconButton>
                    {header && (
                        <Typography variant="subtitle1" id="modal-title" gutterBottom>
                            {header}
                        </Typography>
                    )}
                    {message && (
                        <Typography id="modal-description">
                            {message}
                        </Typography>
                    )}
                    {link && linkText && (
                        <div className={classes.linkButton}>
                            <Button component={Link} to={link} onClick={closeModal} variant="outlined" color="primary">
                                {linkText}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

ModalMessage.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    header: PropTypes.string,
    message: PropTypes.string,
    link: PropTypes.string,
    linkText: PropTypes.string,
};

ModalMessage.defaultProps = {
    header: null,
    message: null,
    link: null,
    linkText: null,
};

const mapStateToProps = state => ({
    open: state.modal.open,
    header: state.modal.header,
    message: state.modal.message,
    link: state.modal.link,
    linkText: state.modal.linkText,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ModalStore.actionCreators, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModalMessage));
