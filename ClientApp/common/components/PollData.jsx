import * as React from 'react';
import PropTypes from 'prop-types';

class PollData extends React.Component {
    componentDidMount() {
        if (this.props.callImediately) {
            if (this.props.initialdataCall) {
                this.props.initialdataCall();
            } else {
                this.props.dataCall();
            }
        }

        this.pollState();
    }

    componentDidUpdate() {
        this.pollState();
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

    pollState = () => {
        if (this.props.pollCondition && !this.timer) {
            this.timer = setTimeout(() => {
                this.clearTimeout();
                if (this.props.pollCondition) {
                    this.props.dataCall();
                    this.pollState();
                }
            }, this.props.pollingIntervalInMinutes * 60 * 1000);
        }
    }

    render() {
        return null;
    }
}

PollData.propTypes = {
    initialdataCall: PropTypes.func,
    dataCall: PropTypes.func.isRequired,
    pollCondition: PropTypes.bool,
    callImediately: PropTypes.bool,
    pollingIntervalInMinutes: PropTypes.number.isRequired,
};

PollData.defaultProps = {
    callImediately: true,
    initialdataCall: null,
    pollCondition: true,
};

export default PollData;
