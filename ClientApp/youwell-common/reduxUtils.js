import {
    applyMiddleware, combineReducers, compose, createStore,
} from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';

const buildRootReducer = (allReducers, history) => combineReducers({ ...allReducers, router: connectRouter(history) });

export const updateStore = (store, reducers, history) => {
    store.replaceReducer(buildRootReducer(reducers, history));
};

export const configureStore = (reducers, history, initialState) => {
    const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) // eslint-disable-line no-underscore-dangle
        || compose;

    const store = createStore(
        buildRootReducer(reducers, history),
        initialState,
        composeEnhancers(
            applyMiddleware(thunk, routerMiddleware(history))
        )
    );

    return store;
};
