import { LOCATION_CHANGE } from 'connected-react-router';
import { getCurrentProgramId } from '../../common/utils';

export const actionCreators = {
};


const initialState = {
    lastProgramId: null,
};

export const reducer = (state, action) => {
    switch (action.type) {
    case LOCATION_CHANGE: {
        return {
            ...state,
            lastProgramId: getCurrentProgramId(action.payload.location.pathname) || state.lastProgramId,
        };
    }
    default: {
        return state || initialState;
    }
    }
};
