import { getTime } from "date-fns";
import { random } from "lodash";

let counter = 0;

const getId = () => {
  const timestamp = getTime(new Date());

  const result = timestamp + counter + random(1000, 1000000);
  counter++; // eslint-disable-line no-plusplus
  return result;
};

export default getId;
