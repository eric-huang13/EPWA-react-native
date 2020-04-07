import { call, put, select } from "redux-saga/effects";
import snakeCaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { compose } from "ramda";

import {
  SAVE_CROP_IMAGE
} from "../actions/crop";

import { getToken } from "../selectors/auth";

import { refreshToken } from "./auth";

import NavigatorService from "../services/navigator";
import { basePath, assetPath } from "../constants";

export function* saveCropImage(api, action) {
  const { original, crop_images, showNotification, translate } = action;
  const accessToken = yield select(getToken);

//   const data = {
//       original: original,
//       ears: ear_image,
//       eyes: eye_image,
//       mouth: mouth_image
//   }

//   const body = compose(
//     JSON.stringify,
//     snakeCaseKeys
//   )(data);
console.log("original============>", original)
console.log(crop_images)
  console.log(crop_images.toString())
  console.log(crop_images.valueOf(2))
  console.log(crop_images.c)

//   let response = yield call(api.saveCropImage, body, accessToken);

//   if (!response.ok) {
//     if (response.status !== 401) {
//       yield call(
//         showNotification,
//         "error",
//         translate("errors.alertTitleGeneric"),
//         translate("animalDeleteErrorMsg")
//       );
//       return;
//     }

//     const hasRefreshedToken = yield call(refreshToken);

//     if (hasRefreshedToken) {
//       const newAccessToken = yield select(getToken);
//       response = yield call(api.saveCropImage, body, newAccessToken);
//     } else {
//       return;
//     }
//   }

//   const parsedResponse = camelcaseKeys(response.data);

//   yield put({
//     type: SAVE_CROP_IMAGE,
//     payload
//   });

//   yield call(NavigatorService.navigate, "EPWACropImageResult");
}
