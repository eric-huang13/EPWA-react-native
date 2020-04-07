import {
  SET_CROP_IMAGE,
  SET_CROP_POSITION,
  SAVE_CROP_IMAGE,
} from "../actions/crop";

const initialState = {
  crops: {},
  image: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CROP_IMAGE:
      return {...state, image: action.payload};
    case SET_CROP_POSITION:
      return {...state, crops: {...state.crops, [action.payload.id]: action.payload.data}};
    case SAVE_CROP_IMAGE:
      return {...state};
    default:
      return state;
  }
}

export default reducer;
