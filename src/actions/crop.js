export const SET_CROP_IMAGE = "SET_CROP_IMAGE";
export const SET_CROP_POSITION = "SET_CROP_POSITION";
export const SAVE_CROP_IMAGE = "SAVE_CROP_IMAGE";
export const SAVE_CROP_IMAGE_REQUESTED = "SAVE_CROP_IMAGE_REQUESTED";
export const SAVE_CROP_IMAGE_FAILED = "SAVE_CROP_IMAGE_FAILED";

export const setCropImage = (payload) => ({
  type: SET_CROP_IMAGE,
  payload
});

export const setCropPosition = (payload) => ({
  type: SET_CROP_POSITION,
  payload
});

export const saveCropImage = ({
  original,
  crop_images,
  showNotification,
  translate
}) => ({
  original,
  crop_images,
  showNotification,
  translate,
  type: SAVE_CROP_IMAGE_REQUESTED
});


