import { all, call, put, select } from "redux-saga/effects";
import camelcaseKeys from "camelcase-keys";
import snakeCaseKeys from "snakecase-keys";
import { get } from "lodash";
import { compose, evolve, isNil, map, reject, omit, not } from "ramda";
import { format, addMinutes } from "date-fns";
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
  COMPLETE_EVENT,
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
    map((event) => {
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
    parsedEventsResponse.map((entry) =>
      put({
        type: ADD_EVENT,
        data: {
          ...entry,
        },
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
          method: api.addEvent,
        },
        commit: {
          type: ADD_EVENT_COMMIT_REQUESTED,
          meta: { formPayload: payload },
        },
        rollback: {
          type: ADD_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload },
        },
      },
    },
  });
  yield all(
    payload.map((entry) =>
      put({
        type: ADD_EVENT,
        data: {
          ...entry,
        },
      })
    )
  );

  // If formHelpers are not passed, do not alter state of the UI
  if (formHelpers) {
    formHelpers.setSubmitting(false);
    formHelpers.resetForm();
  }

  yield call(NavigatorService.navigate, "Diary", {
    id: payload,
  });
}

export function* addEventCommit(action) {
  const payload = action.payload
    .map((event) => camelcaseKeys(event))
    .map((event) => {
      // eslint-disable-next-line prettier/prettier
      if (event.data === "null" || event.data === '"null"') {
        event.data = null;
      }

      if (not(isNil(event.data))) {
        return {
          ...event,
          data: camelcaseKeys(JSON.parse(event.data)),
        };
      }

      event.completed = Boolean(event.completed);

      return event;
    });

  yield all(
    payload.map((event, index) =>
      put({
        type: ADD_EVENT_COMMIT,
        payload: event,
        meta: { localId: get(action, `meta.formPayload[${index}].localId`) },
      })
    )
  );

  for (let i = 0; i < payload.length; i++) {
    if (payload[i].data && payload[i].data.notification === true) {
      if (yield RNCalendarEvents.authorizationStatus() !== "authorized") {
        let auth = yield RNCalendarEvents.authorizeEventStore();
        if (auth === "authorized") {
          let title = payload[i].data.notificationData || payload[i].category;
          let description;
          let notes;
          if (!isNil(payload[i].data)) {
            description = payload[i].data.note || "";
            notes = payload[i].data.note || "";
          }
          let recurring = payload[i].recurring;
          let startDate = new Date(payload[i].startDate).toISOString();
          let endDate;
          let recurrenceEndDate = payload[i].recurring_untill
            ? new Date(payload[i].recurring_untill).toISOString()
            : endDate;

          if (
            payload[i].category === "housing" ||
            payload[i].category === "exercise"
          ) {
            endDate = new Date(payload[i].endDate).toISOString();
          } else {
            endDate = new Date(
              addMinutes(new Date(payload[i].startDate), 15)
            ).toISOString(); // eslint-disable-line prettier/prettier
          }

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

          const details = {
            title,
            description,
            startDate,
            endDate,
            notes,
          };
          details.alarms = [{ date: 0 }];

          if (recurring) {
            details.recurrenceRule = {
              frequency: recurring,
              endDate: recurrenceEndDate,
            };
          }

          yield RNCalendarEvents.saveEvent(title, details, {});
        }
      }
    }
  }
}

export function* addEventRollback(action) {
  const events = action.meta.formPayload;

  yield all(
    events.map((event) =>
      put({
        type: ADD_EVENT_ROLLBACK,
        payload: event,
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
          method: api.editEvent,
        },
        commit: {
          type: EDIT_EVENT_COMMIT_REQUESTED,
          meta: { formPayload: payload },
        },
        rollback: {
          type: EDIT_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload, initialValue },
        },
      },
    },
  });

  yield put({
    type: EDIT_EVENT,
    payload,
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  for (let i = 0; i < payload.length; i++) {
    if (payload[i].data.notification === true) {
      if (yield RNCalendarEvents.authorizationStatus() !== "authorized") {
        let auth = yield RNCalendarEvents.authorizeEventStore();
        if (auth === "authorized") {
          let title = payload[i].data.notificationData || payload[i].category;
          let description;
          let notes;
          if (!isNil(payload[i].data)) {
            description = payload[i].data.note || "";
            notes = payload[i].data.note || "";
          }
          let recurring = payload[i].recurring;
          let startDate = new Date(payload[i].startDate).toISOString();
          let endDate;
          let recurrenceEndDate = payload[i].recurring_untill
            ? new Date(payload[i].recurring_untill).toISOString()
            : endDate;

          if (
            payload[i].category === "housing" ||
            payload[i].category === "exercise"
          ) {
            endDate = new Date(payload[i].endDate).toISOString();
          } else {
            endDate = new Date(
              addMinutes(new Date(payload[i].startDate), 15)
            ).toISOString(); // eslint-disable-line prettier/prettier
          }

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

          const details = { title, description, startDate, endDate, notes };
          details.id = payload[i].id;
          details.alarms = [{ date: -5 }];

          if (recurring) {
            details.recurrenceRule = {
              frequency: recurring,
              endDate: recurrenceEndDate,
            };
          }

          yield RNCalendarEvents.saveEvent(title, details, {});
        }
      }
    }
  }

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
    payload: event,
  });
}

export function* editEventRollback(action) {
  const previousValue = action.meta.initialValue;

  yield put({
    type: EDIT_EVENT_ROLLBACK,
    payload: previousValue,
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
          method: api.deleteEvent,
        },
        // We don't need commit action
        // We optimistically delete the event and if server confirms it we have to do nothing more
        rollback: {
          type: DELETE_EVENT_ROLLBACK_REQUESTED,
          meta: { formPayload: payload },
        },
      },
    },
  });

  yield put({
    type: DELETE_EVENT,
    payload,
  });

  formHelpers.setSubmitting(false);
  formHelpers.resetForm();

  yield call(NavigatorService.navigate, "Diary");
}

export function* deleteEventRollback(action) {
  yield put({
    type: DELETE_EVENT_ROLLBACK,
    payload: action.meta.formPayload,
  });
}

export function* exportEvents(api, action) {
  const { events, currentAnimal, currentDate } = action.payload;
  const { showAlert } = action.meta;
  const csv = yield call(eventsToCSV, events);
  const accessToken = yield select(getToken);

  const fileName = [
    currentAnimal.name,
    format(currentDate, "YYYYMMDD_HHmmss"),
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
  const { eventId, completed, type } = action.payload;
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
          type,
          dispatch,
          method: api.completeEvent,
        },
        // commit: {
        //   type: EDIT_EVENT_COMMIT_REQUESTED,
        //   meta: { formPayload: payload }
        // }
        // rollback: {
        //   type: EDIT_EVENT_ROLLBACK_REQUESTED,
        //   meta: { formPayload: payload, initialValue }
        // }
      },
    },
  });

  yield put({
    type: COMPLETE_EVENT,
    payload: { eventId, completed, type },
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
    endDate,
  });

  if (!eventResponse.ok) {
    if (eventResponse.status !== 401) {
      throw new Error("Network error");
    }
  }
  const parsedEventsResponse = compose(
    (event) => {
      const result = event;

      if (event.data === "null" && event.data === '"null"') {
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
    data: parsedEventsResponse,
  });

  return true;
}
