export const getAnimalById = (state, id) =>
  state.animals.find((animal) => animal.id === id);
