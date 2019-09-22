export const getAuth = (state) => state.auth;
export const getToken = (state) => getAuth(state).accessToken;
