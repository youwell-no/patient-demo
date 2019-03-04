import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProgramStore from '../../../app/store/ProgramStore';

class LoadProgramList extends React.Component {
    componentDidMount() {
        if (!this.props.list) {
            this.props.getList();
        }
    }

    render() {
        return null;
    }
}

LoadProgramList.propTypes = {
    getList: PropTypes.func.isRequired,
    list: PropTypes.array,
};

LoadProgramList.defaultProps = {
    list: null,
};

const mapStateToProps = state => ({
    list: state.programStore.list,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ProgramStore.actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadProgramList);
