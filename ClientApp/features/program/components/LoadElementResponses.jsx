import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProgramStore from '../../../app/store/ProgramStore';

class LoadElementResponses extends React.Component {
    componentDidMount() {
        if (!this.props.responses) {
            this.props.getElementResponses(this.props.patientProgramElementId,
                {
                    reducerParams: {
                        patientProgramId: this.props.patientProgramId,
                        patientProgramElementId: this.props.patientProgramElementId,
                    },
                });
        }
    }

    render() {
        return null;
    }
}

LoadElementResponses.propTypes = {
    getElementResponses: PropTypes.func.isRequired,
    patientProgramElementId: PropTypes.string.isRequired,
    patientProgramId: PropTypes.string.isRequired,
    responses: PropTypes.array,
};

LoadElementResponses.defaultProps = {
    responses: null,
};

const mapStateToProps = (state, ownProps) => ({
    responses: state.programStore.responses && state.programStore.responses[ownProps.patientProgramId]
        && state.programStore.responses[ownProps.patientProgramId][ownProps.patientProgramElementId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadElementResponses);
