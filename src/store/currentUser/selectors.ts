/* eslint-disable prettier/prettier */
import { RootState } from "..";

export function getUser(state:RootState) {
  return state.currentUser;
}

export function userLoading(state:RootState) {
  return state.currentUser.request.status === 1;
}

export function userFailure(state:RootState) {
  return state.currentUser.request.status === 3;
}

export function avatarLoading(state:RootState) {
  return state.currentUser.request.status === 4;
}

export function avatarLoaded(state:RootState) {
  return state.currentUser.request.status === 5;
}

export function avatarFailure(state:RootState) {
  return state.currentUser.request.status === 6;
}
