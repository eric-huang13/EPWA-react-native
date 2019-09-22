import * as R from "ramda";
import {
  differenceInMinutes,
  format,
  isSameDay,
  isBefore,
  isAfter
} from "date-fns";
import { get } from "lodash";
import i18n from "../config/i18n";

import { eventCategories, eventCategoryColors, eventTypes } from "../constants";
import { capitalize } from "../transforms";

const round = (value, step = 1.0) => {
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
};

// Labels
const getTimeLabels = (durationInMin) => {
  const hourLabel = i18n.language === "nl" ? "u" : "h";
  const hours = Math.trunc(durationInMin / 60);
  const minutes = durationInMin % 60;
  if (durationInMin >= 60 && minutes === 0) {
    return [[`${hours}`, hourLabel]];
  } else if (durationInMin > 60) {
    return [[`${hours}`, hourLabel], [`${minutes}`, "min"]];
  }
  return [[`${minutes}`, "min"]];
};

const getWeightLabels = (weightInGrams) =>
  weightInGrams < 500
    ? [[`${weightInGrams}`, "g"]]
    : [[`${round(weightInGrams / 1000, 0.1)}`, "kg"]];

const getItemCountLabels = (itemCount, unit) => [[`${itemCount}`, `${unit}`]];

const getSummedTimeLabels = (entries) => {
  const durationInMin = entries.reduce((acc, current) => {
    const diff = differenceInMinutes(current.endDate, current.startDate);
    return acc + diff;
  }, 0);

  return getTimeLabels(durationInMin);
};

const getSummedWeightLabels = (entries) => {
  const weightInGrams = entries.reduce((acc, current) => {
    const weight =
      current.data.quantity * (current.data.unit === "kg" ? 1000 : 1);
    return acc + weight;
  }, 0);

  return getWeightLabels(weightInGrams);
};

const getSummedItemCountLabels = (entries) => {
  const items = entries.reduce((acc, current) => {
    const count = current.data.quantity;
    return acc + count;
  }, 0);

  return getItemCountLabels(items);
};

const addTimeLabels = (event) => ({
  ...event,
  labels: getTimeLabels(differenceInMinutes(event.endDate, event.startDate))
});

const addWeightLabels = (event) => {
  if (event.data.unit === "unlimited") {
    return {
      ...event,
      labels: [["unlimited"]]
    };
  }

  return {
    ...event,
    labels: getWeightLabels(
      event.data.quantity * (event.data.unit === "kg" ? 1000 : 1)
    )
  };
};

const addItemCountLabels = (event) => ({
  ...event,
  labels: getItemCountLabels(event.data.quantity, event.data.unit)
});

export const isPainMeasurement = (event) =>
  event.category === "painMeasurement";

export const isFeeding = (event) => event.category === "feeding";

export const isRelatedToAnimal = R.curry(
  (animal, event) => event.animalId === animal.id
);

export const isDuringCurrentDate = R.curry((date, event) =>
  isSameDay(event.startDate, date)
);

export const isBeforeCurrentDate = R.curry((date, event) =>
  isBefore(date, event.StartDate)
);

export const isSelectedTab = R.curry((date, tabIndex, event) => {
  if (tabIndex === 1) {
    return isSameDay(event.startDate, date);
  }
  if (tabIndex === 0) {
    return isBefore(event.startDate, date);
  }
  if (tabIndex === 2) {
    return isAfter(event.startDate, date);
  }
  return [];
});

const formatStartDate = (event) => ({
  ...event,
  startDate: format(event.startDate, "HH:mm")
});

const formatEndDate = (event) => ({
  ...event,
  endDate: format(event.endDate, "HH:mm")
});

const formatDates = (event) => ({
  ...event,
  startDate: format(event.startDate, "HH:mm"),
  endDate: format(event.endDate, "HH:mm")
});

const addTitleToWeightEvent = (event) => ({
  ...event,
  title: event.data.name
});

const addTitleToItemCountEvent = (event) => ({
  ...event,
  title: event.data.name
});

const addTitleToTimeEvent = (event) => ({
  ...event,
  title: `${event.startDate} - ${event.endDate}`
});

// https://github.com/ramda/ramda/wiki/Cookbook#group-by-multiple
const groupByMultiple = R.curry((fields, data) => {
  if (fields.length === 1) return R.groupBy(fields[0], data);
  let groupBy = R.groupBy(R.last(fields));
  R.times(() => {
    groupBy = R.mapObjIndexed(groupBy);
  }, fields.length - 1);

  return groupBy(groupByMultiple(R.init(fields), data));
});

export const groupAndTransformEvents = (events) => {
  const groupedEvents = groupByMultiple(
    [R.prop("category"), R.prop("type")],
    events
  );

  const result = R.map((category) => {
    // Category object
    const categoryName = get(
      category,
      `${R.head(R.keys(category))}[0].category`
    );

    const types = R.map((type) => {
      // Type array
      const typeName = get(type, `[0].type`);

      let resultType = {
        name: typeName,
        color: eventCategoryColors[categoryName]
      };

      // Add generic properies
      const transformedEvents = R.map((event) => ({
        ...event,
        color: eventCategoryColors[categoryName],
        title: ""
      }))(type);

      switch (categoryName) {
        case eventCategories.exercise:
        case eventCategories.housing:
          resultType = {
            ...resultType,
            labels: getSummedTimeLabels(transformedEvents),
            events: R.compose(
              R.map(addTitleToTimeEvent),
              R.map(formatDates),
              R.map(addTimeLabels)
            )(transformedEvents)
          };
          break;
        case eventCategories.feeding:
          resultType = {
            ...resultType,
            labels: getSummedWeightLabels(transformedEvents),
            events: R.compose(
              R.map(addTitleToWeightEvent),
              R.map(addWeightLabels),
              R.map(formatStartDate)
            )(transformedEvents)
          };
          break;
        case eventCategories.medication:
          if (type === eventTypes.recovery || type === eventTypes.treatment) {
            resultType = {
              ...resultType,
              labels: [],
              events: R.compose(
                R.map(addTitleToItemCountEvent),
                R.map(formatStartDate)
              )(transformedEvents)
            };
          } else {
            resultType = {
              ...resultType,
              labels: [],
              events: R.compose(
                R.map(addTitleToItemCountEvent),
                R.map(addItemCountLabels),
                R.map(formatStartDate)
              )(transformedEvents)
            };
          }

          break;
        default:
          resultType = { events: type };
      }
      return resultType;
    })(category);

    const sortedTypes = R.compose(
      R.fromPairs,
      R.sortBy(R.path([0, 0])),
      R.toPairs
    )(types);

    return {
      name: categoryName,
      types: sortedTypes
    };
  }, groupedEvents);

  const sortedCategories = R.compose(
    R.fromPairs,
    R.sortBy(R.path([0, 0])),
    R.toPairs
  )(result);

  return sortedCategories;
};

// Creation of dataset for new feature design
export const transformCurrentDayEvents = (events) => {
  const groupedEvents = groupByMultiple(
    [R.prop("category"), R.prop("type")],
    events
  );

  const result = R.map((category) => {
    // Category object
    const categoryName = get(
      category,
      `${R.head(R.keys(category))}[0].category`
    );

    const types = R.map((type) => {
      // Type array
      const typeName = get(type, `[0].type`);

      let resultType = {
        name: typeName,
        color: eventCategoryColors[categoryName]
      };

      // Add generic properies
      const transformedEvents = R.map((event) => ({
        ...event,
        color: eventCategoryColors[categoryName],
        title: ""
      }))(type);

      switch (categoryName) {
        case eventCategories.exercise:
        case eventCategories.housing:
          resultType = {
            ...resultType,
            labels: getSummedTimeLabels(transformedEvents),
            events: R.compose(
              R.map(addTitleToTimeEvent),
              R.map(formatDates),
              R.map(addTimeLabels)
            )(transformedEvents)
          };
          break;
        case eventCategories.feeding:
          resultType = {
            ...resultType,
            labels: getSummedWeightLabels(transformedEvents),
            events: R.compose(
              R.map(addTitleToWeightEvent),
              R.map(addWeightLabels),
              R.map(formatStartDate)
            )(transformedEvents)
          };
          break;
        case eventCategories.medication:
          if (type === eventTypes.recovery || type === eventTypes.treatment) {
            resultType = {
              ...resultType,
              labels: [],
              events: R.compose(
                R.map(addTitleToItemCountEvent),
                R.map(formatStartDate)
              )(transformedEvents)
            };
          } else {
            resultType = {
              ...resultType,
              labels: [],
              events: R.compose(
                R.map(addTitleToItemCountEvent),
                R.map(addItemCountLabels),
                R.map(formatStartDate)
              )(transformedEvents)
            };
          }

          break;
        default:
          resultType = { events: type };
      }
      return resultType;
    })(category);

    const sortedTypes = R.compose(
      R.fromPairs,
      R.sortBy(R.path([0, 0])),
      R.toPairs
    )(types);

    return {
      name: categoryName,
      types: sortedTypes
    };
  }, events);

  const sortedCategories = R.compose(
    R.fromPairs,
    R.sortBy(R.path([0, 0])),
    R.toPairs
  )(result);

  return sortedCategories;
};
