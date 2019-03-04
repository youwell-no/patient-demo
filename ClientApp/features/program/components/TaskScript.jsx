import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';

import { Typography, Grid, Hidden } from '@material-ui/core';

import apiUrls from '../../../youwell-common/apiUrls';

const styles = theme => ({
    root: {
    },
    stepHeader: {
        background: theme.colors.blue1,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    },
    step: {
        marginBottom: theme.spacing.unit * 4,
    },
    stepContent: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    },
    textContent: {
    },
    imageContent: {
    },
    padRight: {
        paddingRight: theme.spacing.unit,
    },
    image: {
        width: '100%',
    },
    text: {
        marginBottom: theme.spacing.unit * 3,
    },
});

class TaskScript extends React.Component {
    render() {
        const {
            classes, translate, script,
        } = this.props;

        if (script === null) {
            return null;
        }

        return (
            <div className={classes.root}>
                {script.steps && script.steps.map((step, index) => (
                    <div key={step.sorting} className={classes.step}>
                        <Hidden implementation="css" smUp>
                            <Typography variant="subtitle1" gutterBottom className={classes.stepHeader}>
                                {`${translate('step')} ${index + 1}`}
                            </Typography>
                        </Hidden>
                        <Grid container className={classes.stepContent}>
                            {!(index % 2) && (
                                <Grid item xs sm={4} md={4} className={classnames(classes.imageContent, classes.padRight)}>
                                    <img src={`${apiUrls.media}/${step.imageFileId}`} alt="" className={classes.image} />
                                </Grid>
                            )}

                            <Grid item xs sm={8} md={8} className={classnames(classes.textContent, { [classes.padRight]: !!(index % 2) })}>
                                <Hidden implementation="css" xsDown>
                                    <Typography variant="subtitle1" gutterBottom className={classes.stepHeader}>
                                        {`${translate('step')} ${index + 1}`}
                                    </Typography>
                                </Hidden>
                                <Typography variant="subtitle2" className={classes.text}>
                                    {step.text}
                                </Typography>
                            </Grid>

                            {!!(index % 2) && (
                                <Grid item xs sm={4} md={4} className={classes.imageContent}>
                                    <img src={`${apiUrls.media}/${step.imageFileId}`} alt="" className={classes.image} />
                                </Grid>
                            )}
                        </Grid>
                    </div>
                ))}
            </div>
        );
    }
}

TaskScript.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    script: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(TaskScript));
