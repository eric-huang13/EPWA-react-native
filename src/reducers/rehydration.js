import { REHYDRATION_DONE } from "../actions/rehydration";

const initialState = { done: false };

function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATION_DONE:
      return { done: action.payload };
    default:
      return state;
  }
}

export default reducer;
