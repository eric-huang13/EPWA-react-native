import { call, put, select } from "redux-saga/effects";
import snakeCaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { compose } from "ramda";

import {
  GET_ANIMAL_CAREGIVER,
  ADD_ANIMAL_CAREGIVER,
  REQUEST_CAREGIVER,
  DELETE_ANIMAL_CAREGIVER
} from "../actions/caregiver";

import { getToken } from "../selectors/auth";

import { refreshToken } from "./auth";

import NavigatorService from "../services/navigator";

export function* getAnimalCaregiver(api, action) {
    const { animal_id, showNotification, translate } = action;
    const accessToken = yield select(getToken);

    const data = {
        animal_id: animal_id
    }
    
    const body = compose(
        JSON.stringify,
        snakeCaseKeys
    )(data);

    let response = yield call(api.getAnimalCaregiver, body, accessToken);

    if (!response.ok) {
        if (response.status !== 401) {
            yield call(
                showNotification,
                "error",
                translate("errors.alertTitleGeneric"),
                translate("animalCaregiverFetchErrorMsg")
            );
            return;
        }

        const hasRefreshedToken = yield call(refreshToken, api);

        if (hasRefreshedToken) {
            const newAccessToken = yield select(getToken);
            response = yield call(api.getAnimalCaregiver, body, newAccessToken);
        } else {
            return;
        }
    }
  
    const parsedResponse = camelcaseKeys(response.data);

    let sharelist = parsedResponse;

    if (Array.isArray(parsedResponse)) {
        sharelist = parsedResponse.map((share) => {
            return share;
        });
    }

    yield put({
        type: GET_ANIMAL_CAREGIVER, 
        sharelist
    });
}

export function* addAnimalCaregiver(api, action) {
    yield put({
        type: REQUEST_CAREGIVER
    });

    const { email_address, animal_id, showNotification, translate } = action;
    const accessToken = yield select(getToken);

    const data = {
        invite_address: email_address,
        animal_id: animal_id
    }

    const body = compose(
        JSON.stringify,
        snakeCaseKeys
    )(data);

    let response = yield call(api.addAnimalCaregiver, body, accessToken);

    if (!response.ok) {
        if (response.status !== 401) {
            yield call(
                showNotification,
                "error",
                translate("errors.alertTitleGeneric"),
                translate("animalCaregiverAddErrorMsg")
            );
            return;
        }

        const hasRefreshedToken = yield call(refreshToken);

        if (hasRefreshedToken) {
            const newAccessToken = yield select(getToken);
            response = yield call(api.addAnimalCaregiver, body, newAccessToken);
        } else {
            return;
        }
    }

    const parsedResponse = camelcaseKeys(response.data);

    yield put({
        type: ADD_ANIMAL_CAREGIVER,
        payload: parsedResponse
    });

    if(parsedResponse.success) {
        let response = yield call(api.getAnimalCaregiver, body, accessToken);

        if (!response.ok) {
            if (response.status !== 401) {
                yield call(
                    showNotification,
                    "error",
                    translate("errors.alertTitleGeneric"),
                    translate("animalCaregiverFetchErrorMsg")
                );
                return;
            }

            const hasRefreshedToken = yield call(refreshToken, api);

            if (hasRefreshedToken) {
                const newAccessToken = yield select(getToken);
                response = yield call(api.getAnimalCaregiver, body, newAccessToken);
            } else {
                return;
            }
        }

        const parsedResponse = camelcaseKeys(response.data);

        let sharelist = parsedResponse;

        if (Array.isArray(parsedResponse)) {
            sharelist = parsedResponse.map((share) => {
                return share;
            });
        }

        yield put({
            type: GET_ANIMAL_CAREGIVER, 
            sharelist
        });
    }
}

export function* deleteAnimalCaregiver(api, action) {
    const { share_id, animal_id, showNotification, translate } = action;
    const accessToken = yield select(getToken);

    const data = {
        animal_id: animal_id,
        share_id: share_id
    }
    
    const body = compose(
        JSON.stringify,
        snakeCaseKeys
    )(data);

    let response = yield call(api.deleteAnimalCaregiver, body, accessToken);

    if (!response.ok) {
        if (response.status !== 401) {
            yield call(
                showNotification,
                "error",
                translate("errors.alertTitleGeneric"),
                translate("animalCaregiverDeleteErrorMsg")
            );
            return;
        }

        const hasRefreshedToken = yield call(refreshToken);

        if (hasRefreshedToken) {
            const newAccessToken = yield select(getToken);
            response = yield call(api.deleteAnimalCaregiver, body, newAccessToken);
        } else {
            return;
        }
    }

    const parsedResponse = camelcaseKeys(response.data);

    yield put({
        type: DELETE_ANIMAL_CAREGIVER,
        payload: parsedResponse
    });

    if(parsedResponse.success) {
        let response = yield call(api.getAnimalCaregiver, body, accessToken);

        if (!response.ok) {
            if (response.status !== 401) {
                yield call(
                    showNotification,
                    "error",
                    translate("errors.alertTitleGeneric"),
                    translate("animalCaregiverFetchErrorMsg")
                );
                return;
            }

            const hasRefreshedToken = yield call(refreshToken, api);

            if (hasRefreshedToken) {
                const newAccessToken = yield select(getToken);
                response = yield call(api.getAnimalCaregiver, body, newAccessToken);
            } else {
                return;
            }
        }

        const parsedResponse = camelcaseKeys(response.data);

        let sharelist = parsedResponse;

        if (Array.isArray(parsedResponse)) {
            sharelist = parsedResponse.map((share) => {
                return share;
            });
        }

        yield put({
            type: GET_ANIMAL_CAREGIVER, 
            sharelist
        });
    }
}
