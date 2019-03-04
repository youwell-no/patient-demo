import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import {
    withStyles, Grid, Hidden, Drawer, Menu,
} from '@material-ui/core';

import MenuContent from './components/MenuContent';
import Header from './components/Header';
import ModalMessage from './components/ModalMessage';
import { Loading, ErrorMessage } from '../../common/components';

import * as AuthStore from '../../app/store/AuthStore';

const styles = theme => ({
    root: {
        height: '100%',
        background: '#fafafa',
    },
    header: {
        background: theme.colors.blue4,
        height: theme.sizes.desktopHeaderHeight,
    },
    content: {
        background: theme.palette.common.white,
        height: `calc(100% - ${theme.sizes.desktopHeaderHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
    },
    mainContent: {
        flex: '1 1 auto',
        height: '100%', // Needed to enable scroll on subpages
        paddingBottom: theme.spacing.unit * 4,

        [theme.breakpoints.down('xs')]: {
            overflow: 'auto',
            paddingBottom: theme.spacing.unit,
        },
    },
    menu: {
        borderRadius: 0,
    },
});

class Layout extends React.Component {
    state = {
        menuOpen: false,
        menuAnchorElement: null,
    }

    openMenu = (event) => {
        this.setState({
            menuOpen: true,
            menuAnchorElement: event.currentTarget,
        });
    }

    closeMenu = () => {
        this.setState({ menuOpen: false });
    }

    render() {
        const {
            classes, children, loading, errorMessage,
        } = this.props;
        const { menuOpen, menuAnchorElement } = this.state;

        return (
            <React.Fragment>
                <Grid container justify="center" className={classnames(classes.root)}>
                    <Grid item xs={12} className={classes.header}>
                        <Grid container justify="center">
                            <Grid item xs={12} sm={11} md={9} lg={7} xl={5}>
                                <Header onOpenMenu={this.openMenu} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={11} md={9} lg={7} xl={5} className={classes.content}>
                        <div id="errorMessage"><ErrorMessage message={errorMessage} onClear={this.props.clearError} scrollId="errorMessage" /></div>
                        <div className={classes.mainContent}>
                            {children}
                        </div>
                    </Grid>
                </Grid>


                <Loading loading={loading} />
                <ModalMessage />

                <Hidden implementation="js" smUp>
                    <Drawer anchor="right" open={menuOpen} onClose={this.closeMenu}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.closeMenu}
                            onKeyDown={this.closeMenu}
                        >
                            <MenuContent />
                        </div>
                    </Drawer>
                </Hidden>

                <Hidden implementation="js" xsDown>
                    <Menu
                        id="app-menu"
                        anchorEl={menuAnchorElement}
                        open={menuOpen}
                        onClose={this.closeMenu}
                        onClick={this.closeMenu}
                        onKeyDown={this.closeMenu}
                        classes={{ paper: classes.menu }}
                    >
                        <MenuContent />
                    </Menu>
                </Hidden>

            </React.Fragment>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.element,
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    errorMessage: PropTypes.string,
    clearError: PropTypes.func.isRequired,
};

Layout.defaultProps = {
    children: null,
    loading: false,
    errorMessage: null,
};

const mapStateToProps = state => ({
    loading: state.auth.loading || state.programStore.loading || state.user.loading,
    errorMessage: [state.auth.error, state.programStore.error, state.user.error].filter(val => val).join('<br/>'),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AuthStore.actionCreators, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Layout)));
