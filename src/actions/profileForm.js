export const CHANGE_PROFILE_FORM = "CHANGE_PROFILE_FORM";
export const SENDING_PROFILE_UPDATE_REQUEST = "SENDING_PROFILE_UPDATE_REQUEST";
export const REQUEST_PROFILE_FORM_ERROR = "REQUEST_PROFILE_FORM_ERROR";
export const CLEAR_PROFILE_FORM_ERROR = "CLEAR_PROFILE_FORM_ERROR";
export const CLEAR_PROFILE_FORM = "CLEAR_PROFILE_FORM";

export function changeProfileForm(newFormState) {
  return { type: CHANGE_PROFILE_FORM, newFormState };
}

export function sendingProfileUpdateRequest(sending) {
  return { type: SENDING_PROFILE_UPDATE_REQUEST, sending };
}

export function requestProfileFormError(error) {
  return { type: REQUEST_PROFILE_FORM_ERROR, error };
}

export function clearProfileFormError() {
  return { type: CLEAR_PROFILE_FORM_ERROR };
}

export function clearProfileForm() {
  return { type: CLEAR_PROFILE_FORM };
}
