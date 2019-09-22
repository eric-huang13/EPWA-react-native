import { SET_TOKENS, CLEAR_TOKENS, REFRESH_TOKEN } from "../actions/auth";

const initialState = {
  accessToken: "",
  // Name of social platform that has been used to sign in
  provider: "",
  // User's ID on social platform
  socialId: ""
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKENS:
      return { ...state, ...action.data };
    case REFRESH_TOKEN:
      return { ...state, accessToken: action.payload };
    case CLEAR_TOKENS:
      return { ...state, accessToken: "", provider: "", socialId: "" };
    default:
      return state;
  }
}

export default reducer;
