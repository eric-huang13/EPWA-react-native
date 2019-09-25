export const ADD_EVENT = "ADD_EVENT";
export const ADD_EVENT_REQUESTED = "ADD_EVENT_REQUESTED";
export const ADD_EVENT_COMMIT = "ADD_EVENT_COMMIT";
export const ADD_EVENT_ROLLBACK = "ADD_EVENT_ROLLBACK";
export const ADD_EVENT_COMMIT_REQUESTED = "ADD_EVENT_COMMIT_REQUESTED";
export const ADD_EVENT_ROLLBACK_REQUESTED = "ADD_EVENT_ROLLBACK_REQUESTED";

export const EDIT_EVENT = "EDIT_EVENT";
export const EDIT_EVENT_REQUESTED = "EDIT_EVENT_REQUESTED";
export const EDIT_EVENT_COMMIT = "EDIT_EVENT_COMMIT";
export const EDIT_EVENT_ROLLBACK = "EDIT_EVENT_ROLLBACK";
export const EDIT_EVENT_COMMIT_REQUESTED = "EDIT_EVENT_COMMIT_REQUESTED";
export const EDIT_EVENT_ROLLBACK_REQUESTED = "EDIT_EVENT_ROLLBACK_REQUESTED";

export const DELETE_EVENT = "DELETE_EVENT";
export const DELETE_EVENT_REQUESTED = "DELETE_EVENT_REQUESTED";
export const DELETE_EVENT_ROLLBACK = "DELETE_EVENT_ROLLBACK";
export const DELETE_EVENT_ROLLBACK_REQUESTED =
  "DELETE_EVENT_ROLLBACK_REQUESTED";
export const COMPLETE_EVENT = "COMPLETE_EVENT";
export const COMPLETE_EVENT_REQUESTED = "COMPLETE_EVENT_REQUESTED";
export const COMPLETE_EVENT_ROLLBACK_REQUESTED =
  "COMPLETE_EVENT_ROLLBACK_REQUESTED";

export const EXPORT_EVENTS = "EXPORT_EVENTS";

export const addEvent = ({ payload, formHelpers }) => ({
  formHelpers,
  payload,
  type: ADD_EVENT_REQUESTED
});

export const editEvent = ({ initialValue, payload, formHelpers }) => ({
  initialValue,
  formHelpers,
  payload,
  type: EDIT_EVENT_REQUESTED
});

export const deleteEvent = ({ payload, formHelpers }) => ({
  formHelpers,
  payload,
  type: DELETE_EVENT_REQUESTED
});

export const exportEvents = ({ payload, meta }) => ({
  meta,
  payload,
  type: EXPORT_EVENTS
});

export const completeEvent = ({ payload }) => ({
  payload,
  type: COMPLETE_EVENT_REQUESTED
});
