import { createSelector } from 'reselect';
import { RootAppState } from './types';
import { createSelector as _createSelector } from '@reduxjs/toolkit';

const selectHomePage = (state: RootAppState) => state.homePage;
//state.homePage means accessing the homePage in store.ts

export const makeSelectUser = createSelector(
  selectHomePage,
  (homePage) => homePage
);

export const stateSelector = _createSelector(makeSelectUser, (homePage) => ({
  currentUser: homePage.currentUser,
  users: homePage.users,
}));
/* 
createSelector takes 2 args:
1st arg: main route state that you want to extract all those states or properties from 
2nd arg: callback function that return the piece pf state you want
*/
