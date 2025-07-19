import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HeaderState {
  user_type: string;
  user_id: string;
}

const initialState: HeaderState = {
  user_type: '',
  user_id: '',
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader: (state, action: PayloadAction<Partial<HeaderState>>) => {
      Object.assign(state, action.payload);
    },
    clearHeader: (state) => {
      state.user_type = '';
      state.user_id = '';
    },
  },
});

export const { setHeader, clearHeader } = headerSlice.actions;

export const selectHeader = (state: { header: HeaderState }) => state.header;

export default headerSlice.reducer;
