import { all, call, put, select } from "redux-saga/effects";
import camelcaseKeys from "camelcase-keys";
import snakeCaseKeys from "snakecase-keys";
import { get } from "lodash";
import { compose, evolve, isNil, map, reject, omit, not } from "ramda";
import { format } from "date-fns";
import RNCalendarEvents from "react-native-calendar-events";
// import Reactotron from "reactotron-react-native";

import {
  ADD_EVENT,
  ADD_EVENT_COMMIT,
  ADD_EVENT_ROLLBACK,
  ADD_EVENT_COMMIT_REQUESTED,
  ADD_EVENT_ROLLBACK_REQUESTED,
  EDIT_EVENT,
  EDIT_EVENT_COMMIT,
  EDIT_EVENT_ROLLBACK,
  EDIT_EVENT_COMMIT_REQUESTED,
  EDIT_EVENT_ROLLBACK_REQUESTED,
  DELETE_EVENT,
  DELETE_EVENT_ROLLBACK,
  DELETE_EVENT_ROLLBACK_REQUESTED,
  COMPLETE_EVENT
} from "../actions/events";

import NavigatorService from "../services/navigator";
import { eventsToCSV } from "../services/csv";
import { getToken } from "../selectors/auth";
import { refreshToken } from "./auth";

export function* getEvents(api, accessToken) {
  let eventResponse = yield call(api.getEvents, accessToken);

  if (!eventResponse.ok) {
    if (eventResponse.status !== 401) {
      throw new Error("Network error");
    }

    const hasRefreshedToken = yield call(refreshToken, api);

    if (hasRefreshedToken) {
      const newAccessToken = yield select(getToken);
      eventResponse = yield call(api.getEvents, newAccessToken);
    } else {
      throw new Error("Network error");
    }
  }

  const parsedEventsResponse = compose(
    map(event => {
      const result = event;

      // eslint-disable-next-line quotes
      if (event.data === "null" && event.data === '"null"') {
        result.data = null;
      }

      if (not(isNil(result.data))) {
        result.data = JSON.parse(result.data);
        result.data = camelcaseKeys(result.data);
      }

      if (isNil(result.endDate)) {
        return omit(["endDate"])(result);
      }

      result.completed = Boolean(result.completed);

      return result;
    }),
    camelcaseKeys
  )(eventResponse.data);

  yield all(
    parsedEventsResponse.map(entry =>
      put({
        type: ADD_EVENT,
        data: {
          ...entry
        }
      })
    )
  );

  return true;
}

export function* addEvent(api, dispatch, action) {
  const { payload, formHelpers } = action;
  const accessToken = yield select(getToken);
  const body = compose(
    JSON.stringify,
    map(omit(["local_id"])),
    map(snakeCaseKeys)
  )(payload);

  yield put({
    type: "ADD_EVENT_REQUEST_SENT",
    meta: {
      offline: {
        effect: {
          accessToken,
          api,
          body,
          dispatch,
          method: api.addEvent
        },
        commit: {
          type: ADD_EVENT_COMMIT_REQUESTED,
          meta: { formPayload: payload }
        },
        rollback: {
          type: ADD_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload }
        }
      }
    }
  });
  yield all(
    payload.map(entry =>
      put({
        type: ADD_EVENT,
        data: {
          ...entry
        }
      })
    )
  );

  if (yield RNCalendarEvents.authorizationStatus() != "authorized") {
    let auth = yield RNCalendarEvents.authorizeEventStore();
    if (auth == "authorized") {
      let title = payload[0].data.noteTitle;
      let description = payload[0].data.note;
      let recurring = payload[0].recurring;
      let startDate = new Date(payload[0].startDate).toISOString();
      let endDate = new Date(payload[0].recurring_untill).toISOString();
      switch (recurring) {
        case "d":
          recurring = "daily";
          break;
        case "w":
          recurring = "weekly";
          break;
        case "m":
          recurring = "monthly";
          break;
        case "y":
          recurring = "yearly";
          break;
        default:
          recurring = null;
      }
      console.tron.log("Event", {
        title,
        description,
        recurring,
        startDate,
        endDate
      });
      yield RNCalendarEvents.saveEvent(
        title,
        {
          title,
          description,
          startDate,
          endDate,
          recurrenceRule: {
            frequency: recurring,
            endDate: endDate
          }
        },
        {}
      );
    }
  }

  // If formHelpers are not passed, do not alter state of the UI
  if (formHelpers) {
    formHelpers.setSubmitting(false);
    formHelpers.resetForm();
  }

  yield call(NavigatorService.navigate, "Diary");
}

export function* addEventCommit(action) {
  const events = action.payload
    .map(event => camelcaseKeys(event))
    .map(event => {
      // eslint-disable-next-line prettier/prettier
      if (event.data === "null" || event.data === "\"null\"") {
        event.data = null;
      }

      if (not(isNil(event.data))) {
        return {
          ...event,
          data: camelcaseKeys(JSON.parse(event.data))
        };
      }

      event.completed = Boolean(event.completed);

      return event;
    });

  yield all(
    events.map((event, index) =>
      put({
        type: ADD_EVENT_COMMIT,
        payload: event,
        meta: { localId: get(action, `meta.formPayload[${index}].localId`) }
      })
    )
  );
}

export function* addEventRollback(action) {
  const events = action.meta.formPayload;

  yield all(
    events.map(event =>
      put({
        type: ADD_EVENT_ROLLBACK,
        payload: event
      })
    )
  );
}

export function* editEvent(api, dispatch, action) {
  const { initialValue, formHelpers, payload } = action;
  const accessToken = yield select(getToken);
  const body = compose(
    JSON.stringify,
    omit(["local_id"]),
    snakeCaseKeys
  )(payload);

  yield put({
    type: "EDIT_EVENT_REQUEST_SENT",
    meta: {
      offline: {
        effect: {
          accessToken,
          api,
          body,
          dispatch,
          method: api.editEvent
        },
        commit: {
          type: EDIT_EVENT_COMMIT_REQUESTED,
          meta: { formPayload: payload }
        },
        rollback: {
          type: EDIT_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload, initialValue }
        }
      }
    }
  });

  yield put({
    type: EDIT_EVENT,
    payload
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  yield call(NavigatorService.navigate, "Diary");
}

export function* editEventCommit(action) {
  const event = compose(
    evolve({ data: camelcaseKeys }),
    evolve({ data: JSON.parse }),
    reject(isNil),
    camelcaseKeys
  )(action.payload);

  yield put({
    type: EDIT_EVENT_COMMIT,
    payload: event
  });
}

export function* editEventRollback(action) {
  const previousValue = action.meta.initialValue;

  yield put({
    type: EDIT_EVENT_ROLLBACK,
    payload: previousValue
  });
}

export function* deleteEvent(api, dispatch, action) {
  const { formHelpers, payload } = action;
  const accessToken = yield select(getToken);

  const eventId = payload.id;

  yield put({
    type: "DELETE_EVENT_REQUEST_SENT",
    meta: {
      offline: {
        effect: {
          accessToken,
          api,
          dispatch,
          eventId,
          method: api.deleteEvent
        },
        // We don't need commit action
        // We optimistically delete the event and if server confirms it we have to do nothing more
        rollback: {
          type: DELETE_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload }
        }
      }
    }
  });

  yield put({
    type: DELETE_EVENT,
    payload
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  yield call(NavigatorService.navigate, "Diary");
}

export function* deleteEventRollback(action) {
  yield put({
    type: DELETE_EVENT_ROLLBACK,
    payload: action.meta.formPayload
  });
}

export function* exportEvents(api, action) {
  const { events, currentAnimal, currentDate } = action.payload;
  const { showAlert } = action.meta;
  const csv = yield call(eventsToCSV, events);
  const accessToken = yield select(getToken);

  const fileName = [
    currentAnimal.name,
    format(currentDate, "YYYYMMDD_HHmmss")
  ].join("_");

  const formData = new FormData();
  formData.append("filename", fileName + ".csv");
  formData.append("content", csv);

  const response = yield call(api.exportEvents, formData, accessToken);

  if (!response.ok) {
    return;
  }

  showAlert(response.data.url);
}

export function* completeEvent(api, dispatch, action) {
  const { eventId, completed } = action.payload;
  const accessToken = yield select(getToken);

  yield put({
    type: "COMPLETE_EVENT_REQUEST_SENT",
    meta: {
      offline: {
        effect: {
          accessToken,
          api,
          eventId,
          completed,
          dispatch,
          method: api.completeEvent
        }
        // commit: {
        //   type: EDIT_EVENT_COMMIT_REQUESTED,
        //   meta: { formPayload: payload }
        // }
        // rollback: {
        //   type: EDIT_EVENT_ROLLBACK_REQUESTED,
        //   meta: { formPayload: payload, initialValue }
        // }
      }
    }
  });

  yield put({
    type: COMPLETE_EVENT,
    payload: { eventId, completed }
  });
}

// export function* completeEventRollback(action) {
//   yield put({
//     type: COMPLETE_EVENT,
//     payload: action.meta.formPayload //TODO VERANDEREN
//   });
// }

export function* completeRecurringEvent(api, dispatch, action) {
  const { eventId, startDate, endDate } = action.payload;
  const accessToken = yield select(getToken);

  let eventResponse = yield call(api.completeRecurringEvent, {
    accessToken,
    eventId,
    startDate,
    endDate
  });

  if (!eventResponse.ok) {
    if (eventResponse.status !== 401) {
      throw new Error("Network error");
    }
  }
  const parsedEventsResponse = compose(
    event => {
      const result = event;

      if (event.data === "null" && event.data === "\"null\"") {
        result.data = null;
      }

      if (not(isNil(result.data))) {
        result.data = JSON.parse(result.data);
        result.data = camelcaseKeys(result.data);
      }

      //Complete to boolean
      result.completed = Boolean(result.completed);

      // result.recurring = null;

      if (isNil(result.endDate)) {
        return omit(["endDate"])(result);
      }

      return result;
    },
    camelcaseKeys
  )(eventResponse.data);

  yield put({
    type: ADD_EVENT,
    data: parsedEventsResponse
  });

  return true;
}
