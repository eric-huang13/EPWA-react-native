import { CLEAR_PROFILE, UPDATE_PERSONAL_INFO } from "../actions/profile";

const initialState = {
  email: "",
  id: "",
  firstName: "",
  lastName: "",
  pictureUrl: ""
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Used to update firstName, lastName, email and pictureUrl only
    case UPDATE_PERSONAL_INFO:
      return { ...state, ...action.data };
    case CLEAR_PROFILE:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
