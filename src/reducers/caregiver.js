import {
    REQUEST_CAREGIVER,
    GET_ANIMAL_CAREGIVER,
    ADD_ANIMAL_CAREGIVER,
    DELETE_ANIMAL_CAREGIVER
} from "../actions/caregiver";

const initialState = {
    loading: false,
    data: [],
    message: ''
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_CAREGIVER:
            return {loading: true, data: state.data};
        case GET_ANIMAL_CAREGIVER:
            return {loading: false, data: action.sharelist};
        case ADD_ANIMAL_CAREGIVER:
            return {
                loading: false,
                data: state.data,
                message: action.payload
            }
        case DELETE_ANIMAL_CAREGIVER:
            return {
                loading: false,
                data: state,
                message: action.payload
            }
        default:
            return state;
    }
}

export default reducer;
