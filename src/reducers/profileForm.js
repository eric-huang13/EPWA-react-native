import {
  CHANGE_PROFILE_FORM,
  CLEAR_PROFILE_FORM,
  CLEAR_PROFILE_FORM_ERROR,
  REQUEST_PROFILE_FORM_ERROR,
  SENDING_PROFILE_UPDATE_REQUEST
} from "../actions/profileForm";

// TODO: Trim incoming strings!
const initialState = {
  formState: {
    email: "",
    firstName: "",
    lastName: "",
    pictureUrl: ""
  },
  error: "",
  currentlySending: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PROFILE_FORM:
      return {
        ...state,
        formState: { ...state.formState, ...action.newFormState }
      };
    case SENDING_PROFILE_UPDATE_REQUEST:
      return { ...state, currentlySending: action.sending };
    case REQUEST_PROFILE_FORM_ERROR:
      return { ...state, error: action.error };
    case CLEAR_PROFILE_FORM_ERROR:
      return { ...state, error: "" };
    case CLEAR_PROFILE_FORM:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
