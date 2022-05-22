import { createSlice, current } from '@reduxjs/toolkit';
import { api, AppDispatch } from "..";
import NewDeed from '@/entities/newDeed';

const initialState = {
  events: [],
  deeds: [],
  request: {
    status: 0,
    error: null
  }
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents: (state, { payload }) => {
      state.events = [...state.events, payload];
    },
    delEvent: (state, { payload }) => {
      state.events = current(state.events).filter(({ id }) => id !== payload);
    },
    changeEvent: (state, { payload }) => {
      const eventIdx = current(state.events).findIndex(({ id }) => id === payload.id);
      const curEvents = [...current(state.events)];
      curEvents.splice(eventIdx, 1, payload);
      state.events = curEvents;
    },
    setDeeds: (state, { payload }) => {
      state.deeds = payload;
      state.request.status = 2;
      //state.events = [...payload];
    },
    clearDeeds: (state) => {
      state.deeds = [];
    },
    deedsPending: (state) => {
      state.request.status = 1;
    },
    deedsFailure: (state) => {
      state.request.status = 3;
    }
  }
});

const { setEvents, setDeeds, delEvent, changeEvent, clearDeeds, deedsPending, deedsFailure } = calendarSlice.actions
export default calendarSlice.reducer

export const calendarAddEvent = (event:Object) => (dispatch:AppDispatch) => {
  dispatch(setEvents(event));
}

export const calendarDelEvent = (id:number) => (dispatch:AppDispatch) => {
  dispatch(delEvent(id));
}

export const calendarChangeEvent = (event:Object) => (dispatch:AppDispatch) => {
  dispatch(changeEvent(event));
}

export const calendarInitDeeds = (id:number) => async (dispatch:AppDispatch) => {
  dispatch(deedsPending());

  try {
    const userDeeds = await api.getDeeds(id);
    if(!!userDeeds.length) {
      const deedObj = userDeeds.map((deed:NewDeed) => {
        return {
          id: deed.id,
          title: deed.title,
          start: deed.start,
          end: deed.end,
          allDay: deed.allDay,
          description: deed.description,
          color: deed.backgroundColor,
          display: deed.backgroundColor === 'none' ? 'none' : 'auto',
          extendedProps: {
            group: deed.group,
          }
        }
      });
      //console.log(deedObj);
      dispatch(setDeeds(deedObj));
    }else dispatch(deedsFailure());
  } catch(err) {
    console.log(err);
    dispatch(deedsFailure());
  }
}

export const calendarAddDeed = (deed:NewDeed, userId:number) => async (dispatch:Function) => {
  try {
    dispatch(deedsPending());
    await api.addDeed(deed);
    dispatch(calendarInitDeeds(userId));
  } catch(err) {
    console.log(err);
    dispatch(deedsFailure());
  }
}

export const calendarDelDeeds = (id:number, userId:number) => async (dispatch:Function) => {
  try {
    dispatch(deedsPending());
    await api.deleteDeed(id);
    dispatch(calendarInitDeeds(userId));
  } catch(err) {
    console.log(err);
    dispatch(deedsFailure());
  }
}

export const calendarChangeDeed = (deed:NewDeed, userId:number) => async (dispatch:Function) => {
  try {
    dispatch(deedsPending());
    await api.editDeed(deed);
    dispatch(calendarInitDeeds(userId));
  } catch(err) {
    console.log(err);
    dispatch(deedsFailure());
  }
}

export const calendarClearDeeds = () => (dispatch:AppDispatch) => {
  dispatch(clearDeeds());
}
