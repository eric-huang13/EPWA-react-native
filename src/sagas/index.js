import { fork, takeEvery, takeLatest } from "redux-saga/effects";

import {
  createApi,
  createFacebookApi,
  createGoogleApi,
  createCSVUploadApi
} from "../services/api";
import {
  AUTH_CHECK_REQUESTED,
  LOGIN_REQUEST,
  LOGOUT,
  REFRESH_TOKEN_REQUESTED,
  REGISTER_REQUEST,
  FACEBOOK_LOGIN_REQUEST,
  GOOGLE_LOGIN_REQUEST,
  FORGOT_PASSWORD_REQUEST,
  REFRESH_TOKEN_DENIED,
  CHANGE_PASSWORD_REQUEST,
  DELETE_ACCOUNT
} from "../actions/auth";
import { UPDATE_PROFILE_REQUEST } from "../actions/profile";
import {
  authCheck,
  login,
  facebookLogin,
  googleLogin,
  logout,
  forgotPassword,
  register,
  refreshToken,
  refreshTokenDenied,
  watchPollProfileHead,
  changePassword,
  deleteAccount
} from "./auth";
import { updateProfile } from "./profile";
import { 
  addAnimal,
  editAnimal,
  deleteAnimal,
  getAnimals
} from "./animals";
import { 
  getAnimalCaregiver,
  addAnimalCaregiver,
  deleteAnimalCaregiver
} from "./caregiver";

import { saveCropImage } from "./crop";
import {
  ADD_ANIMAL_REQUESTED,
  EDIT_ANIMAL_REQUESTED,
  FETCH_ANIMALS_REQUESTED,
  DELETE_ANIMAL_REQUESTED
} from "../actions/animals";

import {
  GET_ANIMAL_CAREGIVER_REQUESTED,
  ADD_ANIMAL_CAREGIVER_REQUESTED,
  DELETE_ANIMAL_CAREGIVER_REQUESTED
} from "../actions/caregiver";

import {
  SAVE_CROP_IMAGE_REQUESTED
} from "../actions/crop";
import {
  ADD_EVENT_REQUESTED,
  ADD_EVENT_COMMIT_REQUESTED,
  ADD_EVENT_ROLLBACK_REQUESTED,
  EDIT_EVENT_REQUESTED,
  EDIT_EVENT_COMMIT_REQUESTED,
  EDIT_EVENT_ROLLBACK_REQUESTED,
  DELETE_EVENT_REQUESTED,
  DELETE_EVENT_ROLLBACK_REQUESTED,
  EXPORT_EVENTS,
  COMPLETE_EVENT_REQUESTED,
  COMPLETE_RECURRING_EVENT_REQUESTED
} from "../actions/events";
import { SET_LANGUAGE_REQUEST } from "../actions/language";
import { setLanguage } from "./language";
import {
  addEvent,
  addEventRollback,
  addEventCommit,
  editEvent,
  editEventRollback,
  editEventCommit,
  deleteEvent,
  deleteEventRollback,
  exportEvents,
  completeEvent,
  completeRecurringEvent
} from "./events";

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = createApi();
const facebookApi = createFacebookApi();
const googleApi = createGoogleApi();
const csvUploadApi = createCSVUploadApi();

// TODO: Combine somehow generators so that index.js is not a big mess
export default function* root(dispatch) {
  yield fork(watchPollProfileHead, api);
  yield takeEvery(AUTH_CHECK_REQUESTED, authCheck);
  yield takeLatest(LOGIN_REQUEST, login, api);
  yield takeLatest(FACEBOOK_LOGIN_REQUEST, facebookLogin, api, facebookApi);
  yield takeLatest(GOOGLE_LOGIN_REQUEST, googleLogin, api, googleApi);
  yield takeLatest(REGISTER_REQUEST, register, api);
  yield takeLatest(REFRESH_TOKEN_REQUESTED, refreshToken, api);
  yield takeLatest(REFRESH_TOKEN_DENIED, refreshTokenDenied, api);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(FORGOT_PASSWORD_REQUEST, forgotPassword, api);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfile, api);
  yield takeLatest(FETCH_ANIMALS_REQUESTED, getAnimals, api);
  yield takeLatest(ADD_ANIMAL_REQUESTED, addAnimal, api);
  yield takeLatest(EDIT_ANIMAL_REQUESTED, editAnimal, api);
  yield takeLatest(DELETE_ANIMAL_REQUESTED, deleteAnimal, api);
  yield takeLatest(GET_ANIMAL_CAREGIVER_REQUESTED, getAnimalCaregiver, api);
  yield takeLatest(ADD_ANIMAL_CAREGIVER_REQUESTED, addAnimalCaregiver, api);
  yield takeLatest(DELETE_ANIMAL_CAREGIVER_REQUESTED, deleteAnimalCaregiver, api);
  yield takeLatest(SAVE_CROP_IMAGE_REQUESTED, saveCropImage, api);
  yield takeLatest(SET_LANGUAGE_REQUEST, setLanguage, api);
  yield takeLatest(CHANGE_PASSWORD_REQUEST, changePassword, api);
  yield takeLatest(EXPORT_EVENTS, exportEvents, csvUploadApi);
  yield takeEvery(ADD_EVENT_REQUESTED, addEvent, api, dispatch);
  yield takeEvery(ADD_EVENT_COMMIT_REQUESTED, addEventCommit);
  yield takeEvery(ADD_EVENT_ROLLBACK_REQUESTED, addEventRollback);
  yield takeEvery(EDIT_EVENT_REQUESTED, editEvent, api, dispatch);
  yield takeEvery(EDIT_EVENT_COMMIT_REQUESTED, editEventCommit);
  yield takeEvery(EDIT_EVENT_ROLLBACK_REQUESTED, editEventRollback);
  yield takeEvery(DELETE_EVENT_REQUESTED, deleteEvent, api, dispatch);
  yield takeEvery(DELETE_EVENT_ROLLBACK_REQUESTED, deleteEventRollback);
  yield takeEvery(COMPLETE_EVENT_REQUESTED, completeEvent, api, dispatch);
  yield takeEvery(DELETE_ACCOUNT, deleteAccount, api, dispatch);
  yield takeEvery(
    COMPLETE_RECURRING_EVENT_REQUESTED,
    completeRecurringEvent,
    api,
    dispatch
  );
}
