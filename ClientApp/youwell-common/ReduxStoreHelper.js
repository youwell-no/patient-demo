import { addTask, fetch } from 'domain-task';
import { push, replace, LOCATION_CHANGE } from 'connected-react-router';

import apiUrls from './apiUrls';
import {
    authHeader, dispatchError, handleErrors, json, blob, jsonHeader,
} from './fetchUtils';

export const CLEAR_ERROR = 'APP/CLEAR_ERROR';
export const LOGOUT = 'APP/LOGOUT';

export const REQUEST_START = 'REQUEST_START';
export const REQUEST_FAILED = 'REQUEST_FAILED';
export const REQUEST_COMPLETE = 'REQUEST_COMPLETE';
export const LIST_RECIEVED = 'LIST_RECIEVED';
export const DETAILS_RECIEVED = 'DETAILS_RECIEVED';
export const INSERTED = 'INSERTED';
export const DELETED = 'DELETED';
export const UPDATED = 'UPDATED';

const handleOptions = (options, data, dispatch) => {
    if (!options) {
        return;
    }
    if (options.callback) {
        options.callback(data);
    }
    if (options.redirectWithElementId) {
        dispatch(push(`${options.redirectWithElementId}/${data.id}`));
    } else if (options.redirect) {
        dispatch(push(options.redirect));
    } else if (options.redirectExternal) {
        window.location = options.redirectExternal;
    }
};

const handleCatch = (params, dispatch, storePrefix) => (error) => {
    if (params.onError) {
        params.onError(error);
    } else {
        dispatchError(dispatch, `${storePrefix}/${REQUEST_FAILED}`, params.options, error);
    }
    if (params.options && params.options.errorCallback) {
        params.options.errorCallback();
    }
};

const handleData = (params, dispatch, bodyAsData = false) => (responseData) => {
    const data = bodyAsData ? params.body : responseData;

    if (params.completeAction) {
        dispatch({ type: params.completeAction, data, reducerParams: params.options && params.options.reducerParams });
    }
    if (params.onData) {
        params.onData(data);
    }
    handleOptions(params.options, data, dispatch);
};

const requestParams = (options) => {
    if (!options || !options.requestParams) {
        return '';
    }

    return Object.keys(options.requestParams).reduce((prev, key) => (
        options.requestParams[key] ? `${prev}${key}=${options.requestParams[key]}&` : prev), '?');
};

export default class ReduxStoreHelper {
    constructor(STORE_PREFIX) {
        this.STORE_PREFIX = STORE_PREFIX;
    }

    fetchNoData = (dispatch, params) => {
        fetch(`${apiUrls.baseUrl}/${params.url}${requestParams(params.options)}`, {
            headers: { ...authHeader(params.token), ...jsonHeader },
            method: params.method || 'GET',
            body: params.body ? JSON.stringify(params.body) : undefined,
        })
            .then(handleErrors(dispatch))
            .then(handleData(params, dispatch, true))
            .catch(handleCatch(params, dispatch, this.STORE_PREFIX));

        dispatch({ type: `${this.STORE_PREFIX}/${REQUEST_START}`, method: params.completeAction, options: params.options });
    }

    fetch = (dispatch, params) => {
        const fetchTask = fetch(`${apiUrls.baseUrl}/${params.url}${requestParams(params.options)}`, {
            headers: { ...authHeader(params.token), ...jsonHeader },
            method: params.method || 'GET',
            body: params.body ? JSON.stringify(params.body) : undefined,
        })
            .then(handleErrors(dispatch))
            .then(json)
            .then(handleData(params, dispatch))
            .catch(handleCatch(params, dispatch, this.STORE_PREFIX));

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: `${this.STORE_PREFIX}/${REQUEST_START}`, method: params.completeAction, options: params.options });
    }

    fetchFile = (dispatch, params) => {
        const formData = new FormData();
        formData.append('file', params.file);

        const fetchTask = fetch(`${apiUrls.baseUrl}/${params.url}${requestParams(params.options)}`, {
            headers: { ...authHeader(params.token) },
            method: 'POST',
            body: formData,
        })
            .then(handleErrors(dispatch))
            .then(json)
            .then(handleData(params, dispatch))
            .catch(handleCatch(params, dispatch, this.STORE_PREFIX));

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: `${this.STORE_PREFIX}/${REQUEST_START}`, method: params.completeAction, options: params.options });
    }

    fetchBlob = (dispatch, params) => {
        const fetchTask = fetch(`${apiUrls.baseUrl}/${params.url}${requestParams(params.options)}`, {
            headers: { ...authHeader(params.token), ...jsonHeader },
            method: params.method || 'GET',
            body: params.body ? JSON.stringify(params.body) : undefined,
        })
            .then(handleErrors(dispatch))
            .then(blob)
            .then(handleData(params, dispatch))
            .catch(handleCatch(params, dispatch, this.STORE_PREFIX));

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: `${this.STORE_PREFIX}/${REQUEST_START}`, method: params.completeAction, options: params.options });
    }

    createGetListActionCreator = (urlPart, COMPLETE_ACTION, requestParameters) => options => (dispatch) => {
        this.fetch(dispatch, {
            url: urlPart,
            options: { ...options, requestParams: { ...requestParameters, ...options ? options.requestParams : {} } },
            completeAction: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`,
        });
    };

    createGetElementActionCreator = (urlPart, COMPLETE_ACTION, requestParameters) => (elementId, options) => (dispatch) => {
        this.fetch(dispatch, {
            url: `${urlPart}/${elementId}`,
            options: { ...options, requestParams: { ...requestParameters, ...options ? options.requestParams : {} } },
            completeAction: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`,
        });
    };

    createInsertActionCreator = (urlPart, COMPLETE_ACTION, requestParameters) => (elementToAdd, options) => (dispatch) => {
        this.fetch(dispatch, {
            url: urlPart,
            options: { ...options, requestParams: { ...requestParameters, ...options ? options.requestParams : {} } },
            completeAction: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`,
            method: 'POST',
            body: elementToAdd,
        });
    };

    createDeleteActionCreator = (urlPart, COMPLETE_ACTION, requestParameters) => (elementToDelete, options) => (dispatch) => {
        this.fetchNoData(dispatch, {
            url: `${urlPart}/${elementToDelete.id}`,
            options: { ...options, requestParams: { ...requestParameters, ...options ? options.requestParams : {} } },
            method: 'DELETE',
            onData: () => {
                dispatch({ type: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`, data: elementToDelete, reducerParams: options && options.reducerParams });
            },
        });
    };

    createUpdateActionCreator = (urlPart, COMPLETE_ACTION, requestParameters) => (elementToUpdate, options) => (dispatch) => {
        this.fetch(dispatch, {
            url: urlPart,
            options: { ...options, requestParams: { ...requestParameters, ...options ? options.requestParams : {} } },
            completeAction: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`,
            method: 'PUT',
            body: elementToUpdate,
        });
    };

    createFileUploadActionCreator = (urlPart, COMPLETE_ACTION) => (file, options) => (dispatch) => {
        this.fetchFile(dispatch, {
            url: urlPart,
            options,
            completeAction: `${this.STORE_PREFIX}/${COMPLETE_ACTION}`,
            file,
        });
    };

    defaultActionCreators = urlPart => ({
        redirect: (url, replaceHistory) => (dispatch) => {
            if (replaceHistory) {
                dispatch(replace(url));
            } else {
                dispatch(push(url));
            }
        },
        getList: this.createGetListActionCreator(urlPart, LIST_RECIEVED),
        getElement: this.createGetElementActionCreator(urlPart, DETAILS_RECIEVED),
        insertElement: this.createInsertActionCreator(urlPart, INSERTED),
        deleteElement: this.createDeleteActionCreator(urlPart, DELETED),
        updateElement: this.createUpdateActionCreator(urlPart, UPDATED),
    });

    defaultInitialState = {
        error: null,
        loading: false,
        list: null,
        details: null,
    };

    defaultReducer = (state, action, initialState) => {
        switch (action.type) {
        case LOCATION_CHANGE: {
            return {
                ...state,
                error: null,
            };
        }
        case CLEAR_ERROR: {
            return {
                ...state,
                error: null,
            };
        }
        case LOGOUT: {
            return initialState;
        }
        case `${this.STORE_PREFIX}/${REQUEST_START}`: {
            return {
                ...state,
                error: null,
                loading: !(action.options && action.options.background),
            };
        }
        case `${this.STORE_PREFIX}/${REQUEST_COMPLETE}`: {
            return {
                ...state,
                error: null,
                loading: false,
            };
        }
        case `${this.STORE_PREFIX}/${REQUEST_FAILED}`: {
            /* eslint-disable no-console */
            if (action.options && action.options.background && console && console.error) {
                console.error(action.error);
            }
            /* eslint-enable no-console */

            return {
                ...state,
                error: action.options && action.options.background ? state.error : action.error,
                loading: false,
            };
        }
        case `${this.STORE_PREFIX}/${LIST_RECIEVED}`: {
            return {
                ...state,
                error: null,
                loading: false,
                list: action.data,
            };
        }
        case `${this.STORE_PREFIX}/${DETAILS_RECIEVED}`: {
            return {
                ...state,
                error: null,
                loading: false,
                details: {
                    ...state.details || {},
                    [action.data.id]: action.data,
                },
            };
        }
        case `${this.STORE_PREFIX}/${INSERTED}`: {
            return {
                ...state,
                error: null,
                loading: false,
                list: state.list ? [...state.list, action.data] : null,
                details: {
                    ...state.details || {},
                    [action.data.id]: action.data,
                },
            };
        }
        case `${this.STORE_PREFIX}/${DELETED}`: {
            return {
                ...state,
                error: null,
                loading: false,
                list: state.list ? state.list.filter(e => e.id !== action.data.id) : null,
                details: {
                    ...state.details || {},
                    [action.data.id]: undefined,
                },
            };
        }
        case `${this.STORE_PREFIX}/${UPDATED}`: {
            return {
                ...state,
                error: null,
                loading: false,
                details: {
                    ...state.details || {},
                    [action.data.id]: action.data,
                },
                list: state.list ? state.list.map(e => (e.id === action.data.id ? action.data : e)) : null,
            };
        }
        default: {
            return null;
        }
        }
    };
}
