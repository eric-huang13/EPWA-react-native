import { find, propEq, pipe, prop } from "ramda";

export const capitalizeFirstLetter = (string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
};

export const getLocationNameById = (id, list = []) => {
  if (list.length) {
    return pipe(
      find(propEq("id", id)),
      prop("label")
    )(list);
  }
  return "";
};

export const uniqueID = () => {
  const chr4 = () => {
    return Math.random()
      .toString(16)
      .slice(-4);
  };
  return (
    chr4() +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    chr4() +
    chr4()
  );
};

export const constructFileData = (pictureFileUrl) => {
  const filename = uniqueID();
  const uri = pictureFileUrl;
  const uriParts = uri.split(".");
  const fileType =
    uriParts[uriParts.length - 1] === "jpg"
      ? "jpeg"
      : uriParts[uriParts.length - 1];
  return {
    uri,
    name: `${filename}.${fileType}`,
    type: `image/${fileType}`,
  };
};
