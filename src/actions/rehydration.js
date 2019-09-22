export const REHYDRATION_DONE = "REHYDRATION_DONE";

export function setRehydrationDone(payload) {
  return { type: REHYDRATION_DONE, payload };
}
