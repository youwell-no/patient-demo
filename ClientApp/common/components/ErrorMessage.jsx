import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { Typography, IconButton, NoSsr } from '@material-ui/core';
import { ClearIcon } from '../icons';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        flex: '1 1 auto',
    },
    icon: {
        height: 'auto',
        width: 'auto',
    },
});

class ErrorMessage extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.message && this.props.message !== prevProps.message && this.props.scrollId) {
            if (document && document.getElementById(this.props.scrollId) && document.getElementById(this.props.scrollId).scrollTop > 0) {
                setTimeout(() => {
                    document.getElementById(this.props.scrollId).scroll({
                        top: 0,
                        behavior: 'smooth',
                    });
                }, 200);
            }
        }
    }

    render() {
        const {
            classes, translate, message, onClear, className,
        } = this.props;

        if (!message) {
            return null;
        }

        return (
            <NoSsr>
                <div className={classnames(classes.root, className)}>
                    <Typography color="error" className={classes.text}>
                        {translate(`errors.${message}`, null, { onMissingTranslation: ({ translationId }) => translationId.slice(7) })}
                    </Typography>
                    {onClear && (
                        <IconButton onClick={onClear} className={classes.icon} color="secondary">
                            <ClearIcon />
                        </IconButton>
                    )}
                </div>
            </NoSsr>
        );
    }
}

ErrorMessage.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    className: PropTypes.string,
    message: PropTypes.string,
    onClear: PropTypes.func,
    scrollId: PropTypes.string,
};

ErrorMessage.defaultProps = {
    message: null,
    className: null,
    onClear: null,
    scrollId: null,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(ErrorMessage));
