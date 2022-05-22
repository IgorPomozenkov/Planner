/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import User from '@/entities/user';
import { api } from '@/store';
import { AppDispatch } from "..";

const initialState = {
  curUser: User,
  authed: false,
  deeds: [],
  request: {
    status: 0,
    error: null
  }
}

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.curUser = payload,
      state.authed = true,
      state.request.status = 2;
    },
    userPending: (state) => {
      state.request.status = 1;
    },
    userFailure: (state) => {
      state.request.status = 3;
    },
    setDeeds: (state, { payload }) => {
      state.deeds = payload
    },
    userExit: (state) => {
      state.curUser = null;
      state.authed = false;
      state.deeds = [];
      state.request.status = 0;
      state.request.error = null;
    },
    avatarPending: (state) => {
      state.request.status = 4;
    },
    avatarSuccess: (state) => {
      state.request.status = 5;
    },
    avatarFailure: (state) => {
      state.request.status = 6;
    }
  }
});

const { setUser, userPending, userFailure, userExit, avatarPending, avatarSuccess, avatarFailure } = currentUserSlice.actions
export default currentUserSlice.reducer

export const userLogin = (name: string, pass: string) => async (dispatch: AppDispatch) => {
  dispatch(userPending());

  try {
    const loggedIn = await api.login(name, pass);
    if(loggedIn) {
      dispatch(setUser(loggedIn));
    }else dispatch(userFailure());
  }catch(error) {
    console.log(error);
    dispatch(userFailure());
  }
}

export const userRegister = (name: string, pass: string) => async (dispatch: AppDispatch) => {
  dispatch(userPending());

  try {
    const registered = await api.register(name, pass);
    const loggedIn = await api.login(registered.name, pass);
    if(loggedIn) {
      dispatch(setUser(loggedIn));
    }else dispatch(userFailure());
  }catch(error) {
    console.log(error);
    dispatch(userFailure());
  }
}

export const userLogout = () => (dispatch: AppDispatch) => {
  dispatch(userExit());
}

export const userSetAvatar = (data: FormData) => async (dispatch: AppDispatch) => {
  dispatch(avatarPending());

  try {
    const newUser = await api.uploadAvatar(data);
    if(newUser) dispatch(avatarSuccess());
    else dispatch(avatarFailure());
    //dispatch(setUser(newUser));
  }catch(error) {
    console.log(error);
    dispatch(avatarFailure());
  }
}
