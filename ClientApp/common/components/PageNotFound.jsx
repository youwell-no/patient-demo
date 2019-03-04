import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
    },
});

class PageNotFound extends React.Component {
    render() {
        const {
            classes, translate,
        } = this.props;

        return (
            <div className={classes.root}>
                <Typography variant="h6" color="error" className={classes.text}>
                    {translate('common.pageNotFound')}
                </Typography>
            </div>
        );
    }
}

PageNotFound.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(PageNotFound));
