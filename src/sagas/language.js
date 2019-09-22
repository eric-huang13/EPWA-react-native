import { call, put } from "redux-saga/effects";

import { SET_LANGUAGE } from "../actions/language";

import i18n from "../config/i18n";

// eslint-disable-next-line import/prefer-default-export
export function* setLanguage(api, action) {
  yield call([i18n, "changeLanguage"], action.data);

  yield put({
    type: SET_LANGUAGE,
    data: action.data
  });
}
