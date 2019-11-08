const effectHandler = effect => {
  const { method } = effect;

  return new Promise((resolve, reject) => {
    method(effect)
      .then(response => {
        if (response.ok) {
          return resolve(response.data);
        }

        return reject(response);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export default effectHandler;
