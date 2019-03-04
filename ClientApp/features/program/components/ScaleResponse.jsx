import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';

import {
    Typography, Button, Hidden,
} from '@material-ui/core';

const styles = theme => ({
    scale: {
        margin: `${theme.spacing.unit * 2}px 0`,
        display: 'flex',
        alignItems: 'center',

        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    divider: {
        flex: '1 1 auto',
        margin: theme.spacing.unit,
        borderBottom: theme.borders.normal,

        [theme.breakpoints.down('xs')]: {
            margin: 0,
            borderRight: theme.borders.normal,
            height: theme.spacing.unit * 2,
        },
    },
    dividerSmall: {
        margin: theme.spacing.unit / 2,

        [theme.breakpoints.down('xs')]: {
            margin: 0,
        },
    },
    noLine: {
        borderBottom: 'none',
    },
    step: {
        width: '100%',
        minWidth: 0,
        maxWidth: 64,
    },
    smallButtons: {
    },
    green: {
        color: theme.colors.green,
    },
    red: {
        color: theme.colors.red,
    },
    scaleLabels: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    lastMobileLabel: {
        marginTop: '0.35em',
    },
});

class ScaleResponse extends React.Component {
    handleChange = value => () => {
        this.props.handleResponseUpdate(value);
    }

    render() {
        const {
            classes, translate, scaleConfig, response, disabled,
        } = this.props;

        const steps = [];
        for (let i = scaleConfig.min; i <= scaleConfig.max; i += scaleConfig.step) {
            steps.push(i);
        }

        const smallButtons = steps.length > 5;

        return (
            <React.Fragment>
                <Typography variant="caption">
                    {translate('selectAValueOnTheScale')}
                </Typography>
                <div className={classes.scale}>
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            {index === 0 && scaleConfig.minLabel && (
                                <Hidden implementation="css" smUp>
                                    <Typography color="primary" gutterBottom>
                                        {scaleConfig.minLabel}
                                    </Typography>
                                </Hidden>
                            )}
                            {index > 0 && <div className={classnames(classes.divider, { [classes.noLine]: steps[0] < 0, [classes.dividerSmall]: smallButtons })} />}
                            <Button
                                className={classnames(classes.step)}
                                variant={step === response ? 'contained' : 'outlined'}
                                color="primary"
                                aria-label={step}
                                onClick={this.handleChange(step)}
                                disabled={disabled}
                                size={smallButtons ? 'small' : 'medium'}
                            >
                                {step}
                            </Button>
                            {index === (steps.length - 1) && scaleConfig.maxLabel && (
                                <Hidden implementation="css" smUp>
                                    <Typography color="primary" className={classes.lastMobileLabel}>
                                        {scaleConfig.maxLabel}
                                    </Typography>
                                </Hidden>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                {scaleConfig.minLabel && scaleConfig.maxLabel && (
                    <Hidden implementation="css" xsDown>
                        <div className={classes.scaleLabels}>
                            <Typography color="primary">
                                {scaleConfig.minLabel}
                            </Typography>
                            <Typography color="primary">
                                {scaleConfig.maxLabel}
                            </Typography>
                        </div>
                    </Hidden>
                )}
            </React.Fragment>
        );
    }
}

ScaleResponse.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    handleResponseUpdate: PropTypes.func.isRequired,
    scaleConfig: PropTypes.object.isRequired,
    response: PropTypes.number,
    disabled: PropTypes.bool,
};

ScaleResponse.defaultProps = {
    response: null,
    disabled: false,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(ScaleResponse));
