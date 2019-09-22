export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_LANGUAGE_REQUEST = "SET_LANGUAGE_REQUEST";

export function setLanguage(data) {
  return { type: SET_LANGUAGE_REQUEST, data };
}
