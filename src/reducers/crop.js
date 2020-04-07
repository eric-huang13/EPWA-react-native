import {
  SET_CROP_IMAGE,
  SET_CROP_POSITION,
  SAVE_CROP_IMAGE,
  REQUEST_CROP_IMAGE
} from "../actions/crop";

const initialState = {
  loading: false,
  crops: {},
  image: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CROP_IMAGE:
      return {...state, loading: true};
    case SET_CROP_IMAGE:
      return {...state, loading: false, image: action.payload, crops: {}};
    case SET_CROP_POSITION:
      if (action.payload.data && action.payload.id) {
        return {...state, loading: false, crops: {...state.crops, [action.payload.id]: action.payload.data}};
      }
      return {...state};
    case SAVE_CROP_IMAGE:
      return {...state, loading: false};
    default:
      return state;
  }
}

export default reducer;
