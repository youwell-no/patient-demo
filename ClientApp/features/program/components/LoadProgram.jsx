import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProgramStore from '../../../app/store/ProgramStore';

class LoadProgram extends React.Component {
    componentDidMount() {
        if (!this.props.details) {
            this.props.getElement(this.props.match.params.programId);
        }
    }

    render() {
        return null;
    }
}

LoadProgram.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            programId: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    getElement: PropTypes.func.isRequired,
    details: PropTypes.object,
};

LoadProgram.defaultProps = {
    details: null,
};

const mapStateToProps = (state, ownProps) => ({
    details: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadProgram);
