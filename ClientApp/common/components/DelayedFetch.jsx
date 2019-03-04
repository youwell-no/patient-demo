import * as React from 'react';
import PropTypes from 'prop-types';

class DelayedFetch extends React.Component {
    componentDidMount() {
        this.setup();
    }

    componentDidUpdate() {
        this.setup();
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

    clearTimeout = () => {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    setup = () => {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.props.dataCall();
            }, this.props.delaySeconds * 1000);
        }
    }

    render() {
        return null;
    }
}

DelayedFetch.propTypes = {
    dataCall: PropTypes.func.isRequired,
    delaySeconds: PropTypes.number.isRequired,
};

export default DelayedFetch;
