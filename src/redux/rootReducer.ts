//combine slice
import { combineReducers } from '@reduxjs/toolkit';
import headerReducer from './slices/headerSlice';

const rootReducer = combineReducers({
  header: headerReducer,
});

export default rootReducer;
