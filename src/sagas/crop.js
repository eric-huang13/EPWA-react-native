import { call, put, select } from "redux-saga/effects";
import camelcaseKeys from "camelcase-keys";

import {
  SAVE_CROP_IMAGE, SAVE_CROP_IMAGE_FAILED
} from '../actions/crop';

import { getToken } from "../selectors/auth";
import { refreshToken } from "./auth";

import NavigatorService from "../services/navigator";

export function* saveCropImage(api, action) {
  const { original, crop_images, showNotification, translate } = action;
  const accessToken = yield select(getToken);
  const formData = new FormData();

  if (original) {
    const uri = original;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("original", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });
  }

  if (crop_images.a) {
    const uri = crop_images.a;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("ears", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });
  }

  if (crop_images.b) {
    const uri = crop_images.b;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("eyes", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });
  }

  if (crop_images.c) {
    const uri = crop_images.c;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("mouth", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });
  }

  let response = yield call(api.saveCropImage, formData, accessToken);

  if (!response.ok) {
    if (response.status !== 401) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("photoUploadErrorMsg")
      );
      return;
    }

    const hasRefreshedToken = yield call(refreshToken);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.saveCropImage, formData, newAccessToken);
    } else {
      return;
    }
  }

  // TODO check code below
  // const parsedResponse = camelcaseKeys(response.data);

  // yield put({
  //   type: SAVE_CROP_IMAGE,
  //   payload
  // });

  yield call(NavigatorService.navigate, "EPWACropImageResult");
}
