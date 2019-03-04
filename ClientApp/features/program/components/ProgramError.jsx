import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { Link } from 'react-router-dom';
import {
    Typography, NoSsr,
} from '@material-ui/core';

import { FowardIcon } from '../../../common/icons';
import urls from '../../../app/urls';


const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 2,
        background: theme.colors.brown1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginBottom: theme.spacing.unit * 2,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginLeft: theme.spacing.unit,
    },
});


class ProgramError extends React.Component {
    render() {
        const {
            classes, translate, loading,
        } = this.props;

        if (loading) {
            return null;
        }

        return (
            <NoSsr>
                <div className={classes.root}>
                    <Typography variant="subtitle1" color="error" className={classes.title}>
                        {translate('program.couldNotFindProgram')}
                    </Typography>
                    <Link to={urls.inside.program.home}>
                        <Typography color="textSecondary" className={classes.link}>
                            {translate('program.goToStartPage')}
                            <FowardIcon className={classes.icon} />
                        </Typography>
                    </Link>
                </div>
            </NoSsr>
        );
    }
}


ProgramError.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

ProgramError.defaultProps = {
    loading: false,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    loading: state.programStore.loading,
});

export default connect(mapStateToProps)(withStyles(styles)(ProgramError));
