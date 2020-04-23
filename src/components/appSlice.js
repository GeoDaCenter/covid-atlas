import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    selectedCounty: null,
  },
  reducers: {
    updateSelectedCounty(state, action) {
      state.selectedCounty = action.payload;
    },
  },
});

export const { updateSelectedCounty } = appSlice.actions;

export default appSlice.reducer;
