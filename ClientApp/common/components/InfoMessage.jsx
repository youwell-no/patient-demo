import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
        border: theme.borders.normal,
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

class InfoMessage extends React.Component {
    render() {
        const {
            classes, translate, message, messageKey,
        } = this.props;

        if (!message && !messageKey) {
            return null;
        }

        return (
            <div className={classes.root}>
                <Typography color="primary" className={classes.text}>
                    {message}
                    {messageKey && translate(messageKey)}
                </Typography>
            </div>
        );
    }
}

InfoMessage.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    messageKey: PropTypes.string,
    message: PropTypes.string,
};

InfoMessage.defaultProps = {
    message: null,
    messageKey: null,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(InfoMessage));
