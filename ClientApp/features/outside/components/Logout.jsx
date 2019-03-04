import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { getTranslate } from 'react-localize-redux';

import { Loading } from '../../../common/components';
import * as AuthStore from '../../../app/store/AuthStore';

const styles = () => ({
    root: {
        position: 'relative',
    },

    container: {
        width: 300,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
});

class Logout extends React.Component {
    componentDidMount() {
        this.props.logout();
    }

    render() {
        const { classes, translate } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <Loading loading loadingMessage={translate('logging_out')} />
                </div>
            </div>
        );
    }
}

Logout.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AuthStore.actionCreators, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Logout)));
