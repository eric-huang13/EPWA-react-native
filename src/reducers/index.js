import AsyncStorage from '@react-native-community/async-storage';
import {combineReducers} from 'redux';

import animals from './animals';
import auth from './auth';
import authForm from './authForm';
import events from './events';
import language from './language';
import profile from './profile';
import profileForm from './profileForm';
import rehydration from './rehydration';
import crop from './crop';

import {RESET_STATE} from '../actions/auth';

const AppReducers = combineReducers({
  auth,
  authForm,
  language,
  profile,
  profileForm,
  rehydration,
  animals,
  events,
  crop,
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    Object.keys(state).forEach(key => {
      AsyncStorage.removeItem(`reduxPersist:${key}`);
    });
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return AppReducers(state, action);
};

export default rootReducer;
