import { push } from 'connected-react-router';

import urls from '../urls';
import apiUrls from '../../youwell-common/apiUrls';
import Auth from '../../common/Auth';
import ReduxStoreHelper, { REQUEST_FAILED, LOGOUT, CLEAR_ERROR } from '../../youwell-common/ReduxStoreHelper';
import { TOKEN_EXPIRED } from '../../youwell-common/fetchUtils';
import { logoutReasons } from '../../youwell-common/constants';

const ACTION_PREFIX = 'AUTH';

const storeHelper = new ReduxStoreHelper(ACTION_PREFIX);

const SUCCESS_LOGIN = 'AUTH/SUCCESS_LOGIN';
const SET_TOKEN = 'AUTH/SET_TOKEN';
const SUCCESS_PROFILE = 'AUTH/SUCCESS_PROFILE';
const SUCCESS_SAVEPROFILE = 'AUTH/SUCCESS_SAVEPROFILE';

export const actionCreators = {
    clearError: () => (dispatch) => {
        dispatch({
            type: CLEAR_ERROR,
        });
    },
    loginWithToken: (token, options) => (dispatch) => {
        if (!Auth.isUserAuthenticated(token)) {
            dispatch({ type: `${ACTION_PREFIX}/${REQUEST_FAILED}`, error: '401' });
        } else {
            dispatch({ type: SET_TOKEN, token }); // Needed for server-side rendering

            storeHelper.fetch(dispatch, {
                url: `${apiUrls.app.auth}/profile`,
                token,
                method: 'POST',
                onData: (data) => {
                    dispatch({ type: SUCCESS_PROFILE, data: { token, profile: data.profile } });
                    Auth.authenticateUser(token);
                },
                options,
            });
        }
    },
    loginWithCode: (code, state, options) => (dispatch) => {
        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.auth}/codelogin`,
            body: { code, state },
            method: 'POST',
            completeAction: SUCCESS_LOGIN,
            onData: (data) => {
                Auth.authenticateUser(data.token);
            },
            options,
        });
    },
    login: (username, password, options) => (dispatch) => {
        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.auth}/login`,
            body: { username, password },
            method: 'POST',
            completeAction: SUCCESS_LOGIN,
            onData: (data) => {
                Auth.authenticateUser(data.token);
            },
            options,
        });
    },
    logout: logoutReason => (dispatch) => {
        const idPortenLogin = Number(Auth.getTokenData('loginLevel')) === 4;
        const redirect = !idPortenLogin ? urls.home : null;
        const redirectExternal = idPortenLogin ? `${apiUrls.loginredirect}/idporten/out` : null;

        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.auth}/logout`,
            method: 'POST',
            completeAction: LOGOUT,
            onData: () => {
                Auth.deauthenticateUser();
                dispatch({ type: LOGOUT, logoutReason });
            },
            options: {
                redirect,
                redirectExternal,
            },
            onError: (error) => {
                Auth.deauthenticateUser();
                dispatch({ type: LOGOUT, error, logoutReason });

                if (redirect) {
                    dispatch(push(redirect));
                } else if (redirectExternal) {
                    window.location = redirectExternal;
                }
            },
        });
    },
    saveUserProfile: (elementToSave, options) => (dispatch) => {
        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.auth}/profile`,
            body: elementToSave,
            method: 'PUT',
            completeAction: SUCCESS_SAVEPROFILE,
            options,
        });
    },
};

const initialState = {
    ...storeHelper.defaultInitialState,
    token: null,
    profileData: null,
    logoutReason: null,
};

export const reducer = (state, action) => {
    // Base reducer overloads
    switch (action.type) {
    case LOGOUT: {
        return {
            ...initialState,
            logoutReason: action.logoutReason,
        };
    }
    default: {
        const stateFromDefaultActions = storeHelper.defaultReducer(state, action, initialState);

        if (stateFromDefaultActions !== null) {
            return stateFromDefaultActions;
        }
    }
    }

    switch (action.type) {
    case TOKEN_EXPIRED: {
        Auth.deauthenticateUser();
        return {
            ...initialState,
            error: action.error,
            logoutReason: logoutReasons.tokenExpired,
        };
    }
    case SUCCESS_PROFILE:
    case SUCCESS_LOGIN: {
        return {
            ...state,
            loading: false,
            error: null,
            token: action.data.token,
            profileData: action.data.profile,
            logoutReason: null,
        };
    }
    case SUCCESS_SAVEPROFILE: {
        return {
            ...state,
            loading: false,
            error: null,
            profileData: { ...state.profileData, ...action.data.profile },
        };
    }
    case SET_TOKEN: {
        return {
            ...state,
            token: action.token,
        };
    }
    default: {
        return state || initialState;
    }
    }
};
