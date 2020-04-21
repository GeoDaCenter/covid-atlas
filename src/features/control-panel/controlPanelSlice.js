import { createSlice } from '@reduxjs/toolkit';

export const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState: {
    dataset: '1p3a-counties',
    variable: 'cases',
  },
  reducers: {},
});

export default controlPanelSlice.reducer;
