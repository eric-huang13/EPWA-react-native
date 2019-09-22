import { SET_LANGUAGE } from "../actions/language";

const initialState = null;

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.data;
    default:
      return state;
  }
}

export default reducer;
