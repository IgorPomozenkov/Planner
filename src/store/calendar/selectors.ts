import { RootState } from "..";

export function getEvents(state:RootState) {
  return state.calendar;
}

export function deedsLoading(state:RootState) {
  return state.calendar.request.status === 1;
}

export function deedsLoaded(state:RootState) {
  return state.calendar.request.status === 2;
}

export function deedsFailure(state:RootState) {
  return state.calendar.request.status === 3;
}
