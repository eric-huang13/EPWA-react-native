import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import { call, put, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { get } from "lodash";
import { RESET_STATE as REDUX_OFFLINE_RESET_STATE } from "@redux-offline/redux-offline/lib/constants";
import camelcaseKeys from "camelcase-keys";
import snakeCaseKeys from "snakecase-keys";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
// import Reactotron from "reactotron-redux";

import i18n from "../config/i18n";

import {
  facebookAppId,
  googleClientIdIos,
  googleClientIdAndroid
} from "../../env.json";

import { basePath } from "../constants";

import {
  SET_ACCESS_TOKEN,
  RESET_STATE,
  SET_TOKENS,
  REFRESH_TOKEN
} from "../actions/auth";
import { UPDATE_PERSONAL_INFO } from "../actions/profile";
import {
  REQUEST_ERROR,
  SENDING_REQUEST,
  CLEAR_AUTH_FORM
} from "../actions/authForm";

import { getEvents } from "./events";

import NavigatorService from "../services/navigator";
import { getToken } from "../selectors/auth";
import { getIsOnline } from "../selectors/offline";

export function* authCheck() {
  const token = yield call(AsyncStorage.getItem, "userToken");

  if (token) {
    yield put({ type: SET_ACCESS_TOKEN, newAuthState: true });
    yield call(NavigatorService.navigate, "App");
  } else {
    yield put({ type: SET_ACCESS_TOKEN, newAuthState: false });
    yield call(NavigatorService.navigate, "Auth");
  }
}

export function* authorize({ username, password, isRegistering, api }) {
  let response;

  // We send an action that tells Redux we're sending a request
  yield put({ type: SENDING_REQUEST, sending: true });

  // We then try to register or log in the user, depending on the request
  if (isRegistering) {
    response = yield call(api.register, username, password);
  } else {
    response = yield call(api.login, username, password);
  }

  // When done, we tell Redux we're not in the middle of a request any more
  yield put({ type: SENDING_REQUEST, sending: false });

  return response;
}

export function* facebookLogin(api, facebookApi) {
  const errorAction = { type: REQUEST_ERROR, error: "facebookLoginGeneric" };
  const mixedAccountsErrorAction = {
    type: REQUEST_ERROR,
    error: "mixedAccounts"
  };

  let authResponse;
  let facebookToken;

  try {
    LoginManager.logOut();
    authResponse = yield LoginManager.logInWithPermissions([
      "public_profile",
      "email"
    ]);

    if (authResponse.isCancelled) {
      return;
    }

    const tokenResponse = yield AccessToken.getCurrentAccessToken();
    facebookToken = tokenResponse.accessToken;
  } catch (e) {
    yield put(errorAction);
    return;
  }

  if (!facebookToken) {
    yield put(errorAction);
    return;
  }

  const profileResponse = yield call(facebookApi.getProfile, facebookToken);

  if (profileResponse.problem) {
    yield put(errorAction);
    return;
  }

  const { email, firstName, lastName, id, picture } = camelcaseKeys(
    profileResponse.data
  );

  const loginResponse = yield call(api.loginSocial, {
    accessToken: facebookToken,
    socialId: id,
    provider: "facebook"
  });

  if (loginResponse.problem) {
    if (loginResponse.data.message === "mixed_accounts") {
      yield put(mixedAccountsErrorAction);
    }

    yield put(errorAction);
    return;
  }

  try {
    yield call(getEvents, api, loginResponse.data.access_token);
  } catch (e) {
    yield put(errorAction);
    return;
  }

  yield put({
    type: UPDATE_PERSONAL_INFO,
    data: {
      email: email || "",
      id,
      firstName,
      lastName,
      pictureUrl: picture.data.url
    }
  });

  yield put({
    type: SET_TOKENS,
    data: {
      accessToken: loginResponse.data.access_token,
      provider: "facebook",
      socialId: id
    }
  });

  yield call(NavigatorService.navigate, "App");
}

export function* googleLogin(api, googleApi) {
  const errorAction = { type: REQUEST_ERROR, error: "googleLoginGeneric" };
  const mixedAccountsErrorAction = {
    type: REQUEST_ERROR,
    error: "mixedAccounts"
  };

  let authResponse;

  try {
    GoogleSignin.configure({
      scopes: ["profile", "email"],
      iosClientId: googleClientIdIos,
      forceConsentPrompt: true
    });
    yield GoogleSignin.hasPlayServices();
    yield GoogleSignin.signOut();
    authResponse = yield GoogleSignin.signIn();
  } catch (e) {
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return;
    }

    yield put(errorAction);
    return;
  }

  const { accessToken, user } = authResponse;

  if (!accessToken || !user) {
    yield put(mixedAccountsErrorAction);
    yield put(errorAction);
    return;
  }

  const { email, familyName, givenName, id, photo } = user;

  const loginResponse = yield call(api.loginSocial, {
    accessToken,
    socialId: id,
    provider: "google"
  });

  if (loginResponse.problem) {
    if (loginResponse.data.message === "mixed_accounts") {
      yield put(mixedAccountsErrorAction);
    }

    yield put(errorAction);
    return;
  }

  try {
    yield call(getEvents, api, loginResponse.data.access_token);
  } catch (e) {
    yield put(errorAction);
    return;
  }

  yield put({
    type: UPDATE_PERSONAL_INFO,
    data: {
      email,
      id,
      firstName: givenName,
      lastName: familyName,
      pictureUrl: photo
    }
  });

  yield put({
    type: SET_TOKENS,
    data: {
      accessToken: loginResponse.data.access_token,
      provider: "google",
      socialId: id
    }
  });

  yield call(NavigatorService.navigate, "App");
}

export function* login(api, action) {
  const networkErrorAction = {
    type: REQUEST_ERROR,
    error: "emailLoginGeneric"
  };
  const fetchUserDataErrorAction = {
    type: REQUEST_ERROR,
    error: "fetchUserDataError"
  };
  const accountNotFoundErrorAction = {
    type: REQUEST_ERROR,
    error: "emailLoginNoAccount"
  };
  const invalidCredentialsErrorAction = {
    type: REQUEST_ERROR,
    error: "emailLoginInvalidCredentials"
  };

  const { username, password } = action.data;

  const response = yield call(authorize, {
    username,
    password,
    isRegistering: false,
    api
  });

  if (!response.ok) {
    const errorMsg = get(response, "data.message");

    if (errorMsg === "No account") {
      yield put(accountNotFoundErrorAction);
      return;
    }

    if (errorMsg === "Ongeldige gebruikersnaam of wachtwoord") {
      yield put(invalidCredentialsErrorAction);
      return;
    }

    yield put(networkErrorAction);
    return;
  }

  const parsedResponse = camelcaseKeys(response.data, { deep: true });

  // eslint-disable-next-line camelcase
  const { accessToken, user } = parsedResponse;
  const { email, firstName, lastName, id, image } = user;

  try {
    yield call(getEvents, api, accessToken);
  } catch (e) {
    yield put(fetchUserDataErrorAction);
    return;
  }

  yield put({
    type: UPDATE_PERSONAL_INFO,
    data: {
      email,
      id,
      firstName,
      lastName,
      pictureUrl: image ? `${basePath}${image.medium}` : undefined
    }
  });

  yield put({
    type: SET_TOKENS,
    data: {
      accessToken
    }
  });

  yield put({
    type: CLEAR_AUTH_FORM
  });

  yield call(NavigatorService.navigate, "App");
}

export function* register(api, action) {
  const networkErrorAction = {
    type: REQUEST_ERROR,
    error: "emailRegisterGeneric"
  };
  const emailAlreadyTakenErrorAction = {
    type: REQUEST_ERROR,
    error: "emailRegisterEmailAlreadyTaken"
  };

  const emailInvalid = {
    type: REQUEST_ERROR,
    error: "emailRegisterEmailInvalid"
  };

  const passwordTooShort = {
    type: REQUEST_ERROR,
    error: "emailRegisterPasswordTooShort"
  };

  const { username, password } = action.data;

  const response = yield call(authorize, {
    username,
    password,
    isRegistering: true,
    api
  });

  if (!response.ok) {
    // TODO: Do not hardcode error values - store the language preference in the DB
    // and get server-side message in correct language.
    // Show then upcoming error messages directly in alert
    const emailError = get(response.data, "errors.email[0]");
    const passwordError = get(response.data, "errors.password[0]");

    if (emailError === "e-mailadres is al in gebruik.") {
      yield put(emailAlreadyTakenErrorAction);
      return;
    }

    if (emailError === "e-mailadres is geen geldig e-mailadres.") {
      yield put(emailInvalid);
      return;
    }

    if (passwordError === "wachtwoord moet minimaal 6 karakters zijn.") {
      yield put(passwordTooShort);
      return;
    }

    yield put(networkErrorAction);
    return;
  }

  const loginResponse = yield call(authorize, {
    username,
    password,
    isRegistering: false,
    api
  });

  if (!response.ok) {
    yield put(networkErrorAction);
    return;
  }

  // eslint-disable-next-line camelcase
  const { access_token, user } = loginResponse.data;
  const { email, id } = user;

  yield put({
    type: UPDATE_PERSONAL_INFO,
    data: {
      email,
      id
    }
  });

  yield put({
    type: SET_TOKENS,
    data: {
      accessToken: access_token
    }
  });

  yield put({
    type: CLEAR_AUTH_FORM
  });

  yield call(NavigatorService.navigate, "App");
}

export function* forgotPassword(api, action) {
  const { username } = action.data;

  const response = yield call(api.resetPassword, { email: username });

  if (response.problem) {
    yield put({ type: REQUEST_ERROR, error: "forgotEmailGeneric" });
    return;
  }

  yield put({
    type: CLEAR_AUTH_FORM
  });

  // FIXME: Ugly hack, cutting corners with this one - it's the fastest way to show "success" Alert
  // without making separate action and reducer etc.
  // Fix it to avoid confusion during further development
  yield put({ type: REQUEST_ERROR, error: "forgotEmailSuccededAlertMessage" });
}

export function* changePassword(api, action) {
  const { payload, formHelpers, showNotification, translate } = action;
  const accessToken = yield select(getToken);

  let response = yield call(
    api.changePassword,
    snakeCaseKeys(payload),
    accessToken
  );

  if (!response.ok) {
    if (response.status !== 401) {
      if (response.data.message === "wrong_current_password") {
        yield call(
          showNotification,
          "error",
          translate("errors.alertTitleGeneric"),
          translate("changePasswordCurrentPasswordWrongErrorMsg")
        );
        return;
      }

      yield call(
        showNotification,
        "error",
        translate("errors.alertTitleGeneric"),
        translate("changePasswordErrorMsg")
      );
      return;
    }

    // eslint-disable-next-line no-use-before-define
    const hasRefreshedToken = yield call(refreshToken);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      response = yield call(api.changePassword, payload, newAccessToken);
    } else {
      return;
    }
  }

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  showNotification(
    "success",
    translate("alertSuccess"),
    translate("changePasswordSuccessMsg")
  );

  yield call(NavigatorService.navigate, "Settings");
}

export function* logout() {
  // Trigger cleanup in reducers/index.js - clean state and persisted state in local storage
  yield put({ type: RESET_STATE });
  // Trigger cleanup in Redux Offline
  // you don't want to keep retrying network requests when you might be logged in as a different user
  yield put({ type: REDUX_OFFLINE_RESET_STATE });
  // FIXME: It doesn't navigate back to Auth, stays in App stack
  yield call(NavigatorService.navigate, "Auth");
}

export function* refreshTokenDenied() {
  yield call(logout);

  yield call(
    Alert.alert,
    i18n.t("errors.alertTitleGeneric"),
    i18n.t("refreshTokenFailedLoggingOutMsg"),
    [{ text: "OK" }]
  );
}

export function* refreshToken(api) {
  const oldToken = yield select(getToken);
  const response = yield call(api.refreshToken, oldToken);

  const { data, ok } = response;

  if (ok && data.access_token) {
    yield put({
      type: REFRESH_TOKEN,
      payload: data.access_token
    });
    return true;
  }

  yield call(refreshTokenDenied);
  return false;
}

// Poll user profile with HEAD request
// If the auth token expires, polling will trigger refreshToken saga
// which in turn will refresh the token or log user out
export function* pollProfileHead(api) {
  while (true) {
    try {
      yield call(delay, 30000);
      const token = yield select(getToken);
      const isOnline = yield select(getIsOnline);

      if (!token) {
        return;
      }
      if (!isOnline) {
        return;
      }

      const response = yield call(api.headProfile, token);

      if (!response.ok) {
        if (response.status !== 401) {
          return;
        }

        yield call(refreshToken, api);
      }
    } catch (err) {
      return;
    }
  }
}

export function* watchPollProfileHead(api) {
  yield call(pollProfileHead, api);
}

export function* deleteAccount(api) {
  const accessToken = yield select(getToken);
  yield call(api.deleteAccount, { accessToken });
  // Trigger cleanup in reducers/index.js - clean state and persisted state in local storage
  yield put({ type: RESET_STATE });
  // Trigger cleanup in Redux Offline
  // you don't want to keep retrying network requests when you might be logged in as a different user
  yield put({ type: REDUX_OFFLINE_RESET_STATE });
  // FIXME: It doesn't navigate back to Auth, stays in App stack
  yield call(NavigatorService.navigate, "Auth");
}
