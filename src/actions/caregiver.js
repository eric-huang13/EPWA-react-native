export const GET_ANIMAL_CAREGIVER = "GET_ANIMAL_CAREGIVER";
export const ADD_ANIMAL_CAREGIVER = "ADD_ANIMAL_CAREGIVER";
export const DELETE_ANIMAL_CAREGIVER = "DELETE_ANIMAL_CAREGIVER";

export const GET_ANIMAL_CAREGIVER_REQUESTED = "GET_ANIMAL_CAREGIVER_REQUESTED";
export const ADD_ANIMAL_CAREGIVER_REQUESTED = "ADD_ANIMAL_CAREGIVER_REQUESTED";
export const DELETE_ANIMAL_CAREGIVER_REQUESTED = "DELETE_ANIMAL_CAREGIVER_REQUESTED";

export const GET_ANIMAL_CAREGIVER_FAILED = "ADD_ANIMAL_CAREGIVER_FAILED";
export const ADD_ANIMAL_CAREGIVER_REQUEST_FAILED = "ADD_ANIMAL_CAREGIVER_REQUEST_FAILED";
export const DELETE_ANIMAL_CAREGIVER_REQUEST_FAILED = "DELETE_ANIMAL_CAREGIVER_REQUEST_FAILED";
export const REQUEST_CAREGIVER = "REQUEST_CAREGIVER";

export const getAnimalCaregiver = ({
  showNotification,
  animal_id,
  translate
}) => ({
  showNotification,
  animal_id,
  translate,
  type: GET_ANIMAL_CAREGIVER_REQUESTED
});

export const addAnimalCaregiver = ({
  email_address,
  animal_id,
  showNotification,
  translate
}) => ({
  email_address,
  animal_id,
  showNotification,
  translate,
  type: ADD_ANIMAL_CAREGIVER_REQUESTED
});

export const deleteAnimalCaregiver = ({ 
  share_id,
  animal_id,
  showNotification,
  translate
}) => ({
  share_id,
  animal_id,
  showNotification,
  translate,
  type: DELETE_ANIMAL_CAREGIVER_REQUESTED
});
