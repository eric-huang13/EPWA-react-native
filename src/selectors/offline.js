export const getOffline = (state) => state.offline;
export const getIsOnline = (state) => getOffline(state).online;
