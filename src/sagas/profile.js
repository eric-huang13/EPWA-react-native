import { call, put, select } from "redux-saga/effects";
import { omit, pickAll } from "ramda";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

import { UPDATE_PERSONAL_INFO } from "../actions/profile";
import { REQUEST_PROFILE_FORM_ERROR } from "../actions/profileForm";

import { getToken } from "../selectors/auth";

import { refreshToken } from "./auth";

import { assetPath } from "../constants";
import { compose } from "../../node_modules/redux";
import { Alert } from 'react-native';

export const test = "";

export function* updateProfile(api, action) {
  const networkErrorAction = {
    type: REQUEST_PROFILE_FORM_ERROR,
    error: "generic"
  };

  let accessToken = yield select(getToken);
  let pictureUrl;

  if (action.data.pictureUrl) {
    const uri = action.data.pictureUrl;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("data", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });


    let response = yield call(api.uploadProfileImage, formData, accessToken);
   
    if (!response.ok) {

      if (response.status !== 401) {
        yield put(networkErrorAction);
        return;
      }

      const hasRefreshedToken = yield call(refreshToken, api);

      if (hasRefreshedToken) {
          accessToken = yield select(getToken);
          response = yield call(api.uploadProfileImage, formData, accessToken);
      } else {
          return;
      }
    }

    pictureUrl = `${assetPath}${response.data.medium}`;

  }

  const requestPayload = compose(
    snakecaseKeys,
    omit(["pictureUrl"])
  )(action.data);
  // Drop photo as it's handled by separate endpoint
  response = yield call(api.updateProfile, requestPayload, accessToken);

  if (!response.ok) {
    yield put(networkErrorAction);
    return;
  }

  const parsedResponse = camelcaseKeys(response.data);

  const payload = {
    ...pickAll(["firstName", "lastName", "email"])(parsedResponse)
  };
  if (pictureUrl) payload.pictureUrl = pictureUrl;

  yield put({
    type: UPDATE_PERSONAL_INFO,
    data: payload
  });

  // FIXME: Ugly hack, cutting corners with this one - it's the fastest way to show "success" Alert
  // without making separate action and reducer etc.
  // Fix it to avoid confusion during further development
  yield put({
    type: REQUEST_PROFILE_FORM_ERROR,
    error: "profileUpdateSuccess"
  });
}
