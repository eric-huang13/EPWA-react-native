export const CHANGE_FORM = "CHANGE_FORM";
export const SENDING_REQUEST = "SENDING_REQUEST";
export const REQUEST_ERROR = "REQUEST_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const CLEAR_AUTH_FORM = "CLEAR_AUTH_FORM";

export function changeForm(newFormState) {
  return { type: CHANGE_FORM, newFormState };
}

export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}

export function requestError(error) {
  return { type: REQUEST_ERROR, error };
}

export function clearError() {
  return { type: CLEAR_ERROR };
}

export function clearAuthForm() {
  return { type: CLEAR_AUTH_FORM };
}
