import {reject} from 'ramda';

import {
  ADD_EVENT,
  ADD_EVENT_COMMIT,
  ADD_EVENT_ROLLBACK,
  EDIT_EVENT,
  EDIT_EVENT_COMMIT,
  EDIT_EVENT_ROLLBACK,
  DELETE_EVENT,
  DELETE_EVENT_ROLLBACK,
} from '../actions/events';

const initialState = [];

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
      return [
        ...state,
        {
          ...action.data,
        },
      ];
    case ADD_EVENT_COMMIT:
      return state.map(event => {
        if (event.localId === action.meta.localId) {
          return action.payload;
        }

        return event;
      });

    case ADD_EVENT_ROLLBACK:
      return reject(event => event.localId === action.payload.localId)(state);
    case EDIT_EVENT:
      return state.map(event =>
        event.id === action.payload.id ? action.payload : event,
      );
    case EDIT_EVENT_COMMIT:
      return state.map(event =>
        event.id === action.payload.id ? action.payload : event,
      );
    case EDIT_EVENT_ROLLBACK:
      return state.map(event =>
        event.id === action.payload.id ? action.payload : event,
      );
    case DELETE_EVENT:
      return state.filter(event => event.id !== action.payload.id);
    case DELETE_EVENT_ROLLBACK:
      return [...state, action.payload];
    default:
      return state;
  }
}

export default reducer;
