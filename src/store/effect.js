const effectHandler = effect => {
  const { method } = effect;

  return new Promise((resolve, reject) => {
    if (method) {
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
    } else {
      reject();
    }
  });
};

export default effectHandler;
