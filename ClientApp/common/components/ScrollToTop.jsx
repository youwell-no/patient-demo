import * as React from 'react';
import {
    withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location && prevProps.location && (this.props.location.pathname !== prevProps.location.pathname)) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // not supported by IE..
                //  window.scrollTo(0, 0);
            }, 0); // need timeout for iOs support
        }
    }

    render() {
        return this.props.children;
    }
}

ScrollToTop.propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.node,
};

ScrollToTop.defaultProps = {
    children: null,
};

export default withRouter(ScrollToTop);
