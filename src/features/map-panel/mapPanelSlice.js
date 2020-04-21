import { createSlice } from '@reduxjs/toolkit';

export const mapPanelSlice = createSlice({
  // REVIEW does kebab case make sense for this?
  // https://github.com/reduxjs/redux-toolkit/blob/master/docs/api/createSlice.md#name
  name: 'map-panel',
  initialState: {},
  reducers: {},
});

export default mapPanelSlice.reducer;
