export const UPDATE_PERSONAL_INFO = "UPDATE_PERSONAL_INFO";
export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const CLEAR_PROFILE = "CLEAR_PROFILE";

export function updatePersonalInfo(data) {
  return { type: UPDATE_PERSONAL_INFO, data };
}

export function updateProfileRequest(data) {
  return { type: UPDATE_PROFILE_REQUEST, data };
}

export function clearProfile() {
  return { type: CLEAR_PROFILE };
}
