import { createSlice } from '@reduxjs/toolkit';

export const controlPanelSlice = createSlice({
  // REVIEW does kebab case make sense for this?
  // https://github.com/reduxjs/redux-toolkit/blob/master/docs/api/createSlice.md#name
  name: 'control-panel',
  initialState: {},
  reducers: {},
});

export default controlPanelSlice.reducer;
