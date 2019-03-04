import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { Typography, CircularProgress, NoSsr } from '@material-ui/core';

const styles = theme => ({
    root: {
        position: 'fixed',
        zIndex: 1500,
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#f0fbff82',
        color: '#05325a',
    },
    rootInline: {
        position: 'relative',
        width: '100%',
        minWidth: 100,
        height: '100%',
        minHeight: 100,
        textAlign: 'center',
        backgroundColor: '#f0fbff82',
        color: '#05325a',
    },
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    progress: {
        color: '#05325a',
    },
    message: {
        marginTop: theme.spacing.unit,
    },
    error: {
        marginTop: theme.spacing.unit,
    },
});

class Loading extends React.Component {
    state = {
        show: false,
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ show: true });
        }, 500);
    }

    render() {
        const {
            classes, loadingMessage, loading, translate, className, inline,
        } = this.props;

        if (!loading || !this.state.show) {
            return null;
        }

        return (
            <NoSsr>
                <div className={classnames(inline ? classes.rootInline : classes.root, className)}>
                    <div className={classes.content}>
                        <CircularProgress className={classes.progress} thickness={5} size={60} />
                        <Typography className={classes.message} variant="subtitle1" color="inherit">
                            {loadingMessage || translate('common.loading')}
                        </Typography>
                    </div>
                </div>
            </NoSsr>
        );
    }
}

Loading.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    className: PropTypes.string,
    inline: PropTypes.bool,
};

Loading.defaultProps = {
    loading: false,
    loadingMessage: null,
    className: null,
    inline: false,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(Loading));
