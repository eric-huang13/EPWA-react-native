import {
  CHANGE_FORM,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR,
  CLEAR_AUTH_FORM
} from "../actions/authForm";

// TODO: Trim incoming strings!
const initialState = {
  formState: {
    username: "",
    password: ""
  },
  error: "",
  currentlySending: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return { ...state, formState: action.newFormState };
    case SENDING_REQUEST:
      return { ...state, currentlySending: action.sending };
    case REQUEST_ERROR:
      return { ...state, error: action.error };
    case CLEAR_ERROR:
      return { ...state, error: "" };
    case CLEAR_AUTH_FORM:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
