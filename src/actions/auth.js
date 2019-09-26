export const AUTH_CHECK_REQUESTED = "AUTH_CHECK_REQUESTED";
export const SET_TOKENS = "SET_TOKENS";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const REFRESH_TOKEN_DENIED = "REFRESH_TOKEN_DENIED";
export const REFRESH_TOKEN_REQUESTED = "REFRESH_TOKEN_REQUESTED";
export const CLEAR_TOKENS = "CLEAR_TOKENS";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const FACEBOOK_LOGIN_REQUEST = "FACEBOOK_LOGIN_REQUEST";
export const GOOGLE_LOGIN_REQUEST = "GOOGLE_LOGIN_REQUEST";
export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
export const CHANGE_PASSWORD_REQUEST = "CHANGE_PASSWORD_REQUEST";
export const LOGOUT = "LOGOUT";
export const RESET_STATE = "RESET_STATE";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";

export const authCheckRequest = () => ({
  type: AUTH_CHECK_REQUESTED
});

export function setTokens(data) {
  return { type: SET_TOKENS, data };
}

export function refreshToken(newAccessToken) {
  return { type: REFRESH_TOKEN, payload: newAccessToken };
}

export function refreshTokenDenied() {
  return { type: REFRESH_TOKEN_DENIED };
}

export function loginRequest(data) {
  return { type: LOGIN_REQUEST, data };
}

export function facebookLoginRequest() {
  return { type: FACEBOOK_LOGIN_REQUEST };
}

export function googleLoginRequest() {
  return { type: GOOGLE_LOGIN_REQUEST };
}

export function registerRequest(data) {
  return { type: REGISTER_REQUEST, data };
}

export function forgotPasswordRequest(data) {
  return { type: FORGOT_PASSWORD_REQUEST, data };
}

export function changePasswordRequest(data) {
  return { type: CHANGE_PASSWORD_REQUEST, ...data };
}

export function logout() {
  return { type: LOGOUT };
}

// export function deleteAccountRequest(data) {
//   return { type: DELETE_ACCOUNT, ...data };
// }
