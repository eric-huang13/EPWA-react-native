import { __, curry } from "ramda";
import dateFns from "date-fns";

export const setHours = curry(dateFns.setHours);
export const setMinutes = curry(dateFns.setMinutes);
export const setSeconds = curry(dateFns.setSeconds);
export const setMilliseconds = curry(dateFns.setMilliseconds);

export const setHoursToZero = setHours(__, 0);
export const setMinutesToZero = setMinutes(__, 0);
export const setSecondsToZero = setSeconds(__, 0);
export const setMillisecondsToZero = setMilliseconds(__, 0);
