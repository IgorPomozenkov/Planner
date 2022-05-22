import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import currentUserSlice from "./currentUser/reducer";
import calendarSlice from "./calendar/reducer";
import API from '@/services/api';

const rootReducer = combineReducers({
  currentUser: currentUserSlice,
  calendar: calendarSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [ 'calendar'] //'currentUser',
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const api = new API();
