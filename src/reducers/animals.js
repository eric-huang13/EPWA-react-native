import {
  ADD_ANIMAL,
  EDIT_ANIMAL,
  FETCH_ANIMALS_SUCCEEDED,
  DELETE_ANIMAL
} from "../actions/animals";

const initialState = [];

function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ANIMALS_SUCCEEDED:
      return action.payload;
    case ADD_ANIMAL:
      return [...state, action.payload];
    case EDIT_ANIMAL:
      return state.map(
        (animal) => (animal.id === action.payload.id ? action.payload : animal)
      );
    case DELETE_ANIMAL:
      return state.filter((animal) => animal.id !== action.payload);
    default:
      return state;
  }
}

export default reducer;
