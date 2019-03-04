import apiUrls from '../../youwell-common/apiUrls';
import ReduxStoreHelper from '../../youwell-common/ReduxStoreHelper';

const ACTION_PREFIX = 'USER';
const MESSAGE_LIST_RECIEVED = 'MESSAGE_LIST_RECIEVED';
const MESSAGE_LIST_UPDATE_RECIEVED = 'MESSAGE_LIST_UPDATE_RECIEVED';
const MESSAGES_READ_RECIEVED = 'MESSAGES_READ_RECIEVED';
const CHATMESSAGE_INSERTED = 'CHATMESSAGE_INSERTED';

const storeHelper = new ReduxStoreHelper(ACTION_PREFIX);

export const actionCreators = {
    getMessages: storeHelper.createGetListActionCreator(`${apiUrls.app.message}`, MESSAGE_LIST_RECIEVED),
    checkForNewMessages: storeHelper.createGetListActionCreator(`${apiUrls.app.message}`, MESSAGE_LIST_UPDATE_RECIEVED),
    insertMessage: storeHelper.createInsertActionCreator(`${apiUrls.app.message}`, CHATMESSAGE_INSERTED),
    markMessagesAsRead: (timestamp, options) => (dispatch) => {
        storeHelper.fetchNoData(dispatch, {
            url: `${apiUrls.app.message}/read/${timestamp}`,
            method: 'PUT',
            onData: () => {
                dispatch({ type: `${ACTION_PREFIX}/${MESSAGES_READ_RECIEVED}`, data: { timestamp } });
            },
            options,
        });
    },
};

const initialState = {
    ...storeHelper.defaultInitialState,
    messageList: null,
};


export const reducer = (state, action) => {
    const stateFromDefaultActions = storeHelper.defaultReducer(state, action, initialState);

    if (stateFromDefaultActions !== null) {
        return stateFromDefaultActions;
    }

    switch (action.type) {
    case `${ACTION_PREFIX}/${MESSAGE_LIST_RECIEVED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            messageList: action.data,
        };
    }
    case `${ACTION_PREFIX}/${MESSAGE_LIST_UPDATE_RECIEVED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            messageList: state.messageList
                ? [...state.messageList, ...action.data]
                : action.data,
        };
    }
    case `${ACTION_PREFIX}/${CHATMESSAGE_INSERTED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            messageList: [...state.messageList, action.data],
        };
    }
    case `${ACTION_PREFIX}/${MESSAGES_READ_RECIEVED}`: {
        return {
            ...state,
            messageList: state.messageList.map(m => (
                m.created < action.data.timestamp ? m : { ...m, patientReadTime: action.data.timestamp }
            )),
        };
    }
    default: {
        return state || initialState;
    }
    }
};
