import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import homeReducer from './slices/home';
import reduxLogger from 'redux-logger';

export const store = configureStore({
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(reduxLogger),
  reducer: {
    homePage: homeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
