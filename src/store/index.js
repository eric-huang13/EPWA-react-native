import {createStore, applyMiddleware, compose} from 'redux';
import {createOffline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import createSagaMiddleware from 'redux-saga';

import {useReactotron} from '../../env.json';
import rootReducer from '../reducers/';
import rootSaga from '../sagas/';
import {setRehydrationDone} from '../actions/rehydration';

import discard from './discard';
import effect from './effect';

import Reactotron from '../config/reactotronConfig';

// creates the store
export default () => {
  const persistConfig = {
    blacklist: ['authForm', 'animalForm', 'form', 'profileForm'],
  };

  let store;

  const {
    middleware: offlineMiddleware,
    enhanceReducer,
    enhanceStore,
  } = createOffline({
    ...offlineConfig,
    discard,
    effect,
    persistOptions: persistConfig,
    persistCallback: () => {
      store.dispatch(setRehydrationDone(true));
    },
  });

  const sagaMiddleware = createSagaMiddleware();
  const middlewareList = [sagaMiddleware];

  const middleware = applyMiddleware(...middlewareList, offlineMiddleware);

  // if Reactotron is enabled, we'll create the store through Reactotron
  const createAppropriateStore = useReactotron
    ? createStore //console.tron.createStore
    : createStore;

  store = createAppropriateStore(
    enhanceReducer(rootReducer),
    compose(
      enhanceStore,
      middleware,
      Reactotron.createEnhancer(),
    ),
  );

  // kick off root saga, pass dispatch function to sagas so that they can pass it to functions outside of generator runtime
  // For example, effect and discard function of Redux-Offline should be able to dispatch actions
  const sagasManager = sagaMiddleware.run(rootSaga, store.dispatch);

  return {
    store,
    sagasManager,
    sagaMiddleware,
  };
};
