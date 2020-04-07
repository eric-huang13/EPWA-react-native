import {
    GET_ANIMAL_CAREGIVER,
    ADD_ANIMAL_CAREGIVER,
    DELETE_ANIMAL_CAREGIVER
} from "../actions/caregiver";

const initialState = [];

function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ANIMAL_CAREGIVER:
            return action.sharelist;
        case ADD_ANIMAL_CAREGIVER:
            return [state, action.payload]
        case DELETE_ANIMAL_CAREGIVER:
            return [...state, action.payload];
        default:
            return state;
    }
}

export default reducer;
