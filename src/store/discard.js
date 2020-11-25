import { get } from "lodash";

import { refreshToken, refreshTokenDenied } from "../actions/auth";

const handleRefreshResponse = ({ dispatch, resolve }, refreshResponse) => {
  const newAccessToken = get(refreshResponse, "data.access_token");

  if (refreshResponse.ok && newAccessToken) {
    // If successfully refreshed token, save it in store and allow redux-offline retry the request
    dispatch(refreshToken(newAccessToken));
    // False means that redux-offline should NOT discard the request
    resolve(false);
  }

  // If refresh token request was valid but we still got 401, it means that user MUST log in again.
  // Trigger logout by dispatching an action
  dispatch(refreshTokenDenied());
  resolve(true);
};

const discard = (error, action) => {
  // Redux dispatch function
  const { accessToken, api, dispatch } = get(action, "meta.offline.effect");

  // Check if it's apisauce failed request object or it's an actual error
  if (error && !error.status && !error.duration) {
    throw error; // There was an error creating the request
  }

  if (error && error.status === 401) {
    return new Promise((resolve) => {
      api
        .refreshToken(accessToken)
        .then((res) => handleRefreshResponse({ dispatch, resolve }, res))
        .catch((refreshError) => {
          throw refreshError;
        });
    });
  }

  return error && error.status >= 400 && error.status < 500;
};

export default discard;
