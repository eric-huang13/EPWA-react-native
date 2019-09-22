export const FETCH_ANIMALS_REQUESTED = "FETCH_ANIMALS_REQUESTED";
export const FETCH_ANIMALS_SUCCEEDED = "FETCH_ANIMALS_SUCCEEDED";
export const FETCH_ANIMALS_FAILED = "FETCH_ANIMALS_FAILED";

export const ADD_ANIMAL = "ADD_ANIMAL";
export const EDIT_ANIMAL = "EDIT_ANIMAL";
export const DELETE_ANIMAL = "DELETE_ANIMAL";

export const ADD_ANIMAL_REQUESTED = "ADD_ANIMAL_REQUESTED";
export const EDIT_ANIMAL_REQUESTED = "EDIT_ANIMAL_REQUESTED";
export const DELETE_ANIMAL_REQUESTED = "DELETE_ANIMAL_REQUESTED";

export const ADD_ANIMAL_REQUEST_FAILED = "ADD_ANIMAL_REQUEST_FAILED";
export const EDIT_ANIMAL_REQUEST_FAILED = "EDIT_ANIMAL_REQUEST_FAILED";
export const DELETE_ANIMAL_REQUEST_FAILED = "DELETE_ANIMAL_REQUEST_FAILED";

export const getAnimals = ({ showNotification, translate }) => ({
  showNotification,
  translate,
  type: FETCH_ANIMALS_REQUESTED
});

export const addAnimal = ({
  payload,
  formHelpers,
  showNotification,
  translate
}) => ({
  formHelpers,
  payload,
  showNotification,
  translate,
  type: ADD_ANIMAL_REQUESTED
});

export const editAnimal = ({
  payload,
  formHelpers,
  showNotification,
  translate
}) => ({
  formHelpers,
  payload,
  showNotification,
  translate,
  type: EDIT_ANIMAL_REQUESTED
});

export const deleteAnimal = ({ payload, showNotification, translate }) => ({
  payload,
  showNotification,
  translate,
  type: DELETE_ANIMAL_REQUESTED
});
