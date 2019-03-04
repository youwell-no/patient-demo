const SHOW_MESSAGE = 'MODALSTORE/SHOW_MESSAGE';
const CLOSE_MESSAGE = 'MODALSTORE/CLOSE_MESSAGE';

export const actionCreators = {
    showModal: modalProps => (dispatch) => {
        dispatch({ type: SHOW_MESSAGE, ...modalProps });
    },

    closeModal: () => (dispatch) => {
        dispatch({ type: CLOSE_MESSAGE });
    },
};

const initialState = {
    open: false,
    header: '',
    message: '',
    link: '',
    linkText: '',
};

export const reducer = (state, action) => {
    switch (action.type) {
    case SHOW_MESSAGE: {
        return {
            ...state,
            open: true,
            header: action.header,
            message: action.message,
            link: action.link,
            linkText: action.linkText,
        };
    }
    case CLOSE_MESSAGE: {
        return {
            ...initialState,
        };
    }
    default: {
        return state || initialState;
    }
    }
};
