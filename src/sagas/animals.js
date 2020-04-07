import { call, put, select } from "redux-saga/effects";
import snakeCaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { compose, omit } from "ramda";

import {
  ADD_ANIMAL,
  EDIT_ANIMAL,
  FETCH_ANIMALS_SUCCEEDED,
  DELETE_ANIMAL
} from "../actions/animals";

import { getToken } from "../selectors/auth";
import { getAnimalById } from "../selectors/animals";
import { getIsOnline } from "../selectors/offline";

import { refreshToken } from "./auth";

import NavigatorService from "../services/navigator";
import { basePath, assetPath } from "../constants";

export function* getAnimals(api, action) {
  const { showNotification, translate } = action;

  const accessToken = yield select(getToken);
  let response = yield call(api.getAnimals, accessToken);

  if (!response.ok) {
    if (response.status !== 401) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalFetchErrorMsg")
      );
      return;
    }

    const hasRefreshedToken = yield call(refreshToken, api);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.getAnimals, newAccessToken);
    } else {
      return;
    }
  }

  const parsedResponse = camelcaseKeys(response.data);
  let payload = parsedResponse;

  if (Array.isArray(parsedResponse)) {
    payload = parsedResponse.map((animal) => {
      if (animal.image) {
        const result = {
          ...animal,
          pictureUrl: `${basePath}${animal.image.medium}`
        };
        return omit(["image"])(result);
      }
      return animal;
    });
  }

  yield put({
    type: FETCH_ANIMALS_SUCCEEDED,
    payload
  });
}

export function* addAnimal(api, action) {
  const { payload, formHelpers, showNotification, translate } = action;
  const accessToken = yield select(getToken);
  const isOnline = yield select(getIsOnline);
  const body = compose(
    JSON.stringify,
    snakeCaseKeys
  )(payload);

  if (!isOnline) {
    yield call(
      showNotification,
      "warn",
      translate("errors.alertTitleGeneric"),
      translate("offlineWarning")
    );
    return;
  }

  let response = yield call(api.addAnimal, body, accessToken);

  if (!response.ok) {
    if (response.status !== 401) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalAddErrorMsg")
      );
      return;
    }

    const hasRefreshedToken = yield call(refreshToken);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.addAnimal, body, newAccessToken);
    } else {
      return;
    }
  }

  const parsedResponse = camelcaseKeys(response.data);

  let pictureUrl;

  if (payload.pictureUrl) {
    const uri = payload.pictureUrl;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("data", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    const responsePhoto = yield call(
      api.uploadAnimalImage,
      formData,
      accessToken,
      parsedResponse.id
    );

    if (!responsePhoto.ok) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalAddErrorMsg")
      );
      return;
    }

    pictureUrl = `${assetPath}/${responsePhoto.data.medium}`;
  }

  yield put({
    type: ADD_ANIMAL,
    payload: { ...parsedResponse, pictureUrl }
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  yield call(NavigatorService.navigate, "AnimalProfile", {
    id: parsedResponse.id
  });
}

export function* editAnimal(api, action) {
  const { payload, formHelpers, showNotification, translate } = action;
  const accessToken = yield select(getToken);
  const isOnline = yield select(getIsOnline);
  const editedAnimal = yield select(getAnimalById, payload.id);
  const hasImageChanged = payload.pictureUrl !== editedAnimal.pictureUrl;

  const body = compose(
    JSON.stringify,
    snakeCaseKeys
  )(payload);

  if (!isOnline) {
    yield call(
      showNotification,
      "warn",
      translate("errors.alertTitleGeneric"),
      translate("offlineWarning")
    );
    return;
  }

  let response = yield call(api.editAnimal, body, payload.id, accessToken);

  if (!response.ok) {
    if (response.status !== 401) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalEditErrorMsg")
      );
      return;
    }

    const hasRefreshedToken = yield call(refreshToken);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.editAnimal, body, payload.id, newAccessToken);
    } else {
      return;
    }
  }

  const parsedResponse = camelcaseKeys(response.data);

  let pictureUrl;

  if (hasImageChanged) {
    const uri = payload.pictureUrl;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("data", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    const responsePhoto = yield call(
      api.uploadAnimalImage,
      formData,
      accessToken,
      parsedResponse.id
    );

    if (!responsePhoto.ok) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalEditErrorMsg")
      );
      return;
    }

    pictureUrl = `${assetPath}/${responsePhoto.data.medium}`;
  }

  yield put({
    type: EDIT_ANIMAL,
    payload: {
      ...parsedResponse,
      pictureUrl: hasImageChanged ? pictureUrl : editedAnimal.pictureUrl
    }
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  yield call(NavigatorService.navigate, "AnimalProfile", {
    id: parsedResponse.id,
    // Overwrite old header title
    title: parsedResponse.name
  });
}

export function* deleteAnimal(api, action) {
  const { payload, showNotification, translate } = action;
  const accessToken = yield select(getToken);
  const isOnline = yield select(getIsOnline);

  if (!isOnline) {
    yield call(
      showNotification,
      "warn",
      translate("errors.alertTitleGeneric"),
      translate("offlineWarning")
    );
    return;
  }

  let response = yield call(api.deleteAnimal, payload, accessToken);

  if (!response.ok) {
    if (response.status !== 401) {
      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("animalDeleteErrorMsg")
      );
      return;
    }

    const hasRefreshedToken = yield call(refreshToken);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.deleteAnimal, payload, newAccessToken);
    } else {
      return;
    }
  }

  yield put({
    type: DELETE_ANIMAL,
    payload
  });

  yield call(NavigatorService.navigate, "Stable");
}
