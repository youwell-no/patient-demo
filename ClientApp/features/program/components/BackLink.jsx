import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import {
    Typography, ButtonBase,
} from '@material-ui/core';

import { BackIcon } from '../../../common/icons';


const styles = theme => ({
    root: {
        width: '100%',

        [theme.breakpoints.down('xs')]: {
            margin: 0,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
            boxShadow: theme.shadows[1],
        },

        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px 0`,
        },
    },
    text: {
        display: 'flex',
        alignItems: 'center',

        [theme.breakpoints.up('sm')]: {
            borderBottom: theme.borders.normal,
        },
    },
    icon: {
        marginRight: theme.spacing.unit,
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1em',
    },
});


class BackLink extends React.Component {
    render() {
        const {
            classes, translate,
        } = this.props;

        return (
            <div className={classes.root}>
                <ButtonBase onClick={this.props.history.goBack}>
                    <Typography color="textSecondary" className={classes.text}>
                        <BackIcon className={classes.icon} />
                        {translate('back')}
                    </Typography>
                </ButtonBase>
            </div>
        );
    }
}


BackLink.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(BackLink));
