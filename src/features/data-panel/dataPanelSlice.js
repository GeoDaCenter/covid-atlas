import { createSlice } from '@reduxjs/toolkit';

export const dataPanelSlice = createSlice({
  // REVIEW does kebab case make sense for this?
  // https://github.com/reduxjs/redux-toolkit/blob/master/docs/api/createSlice.md#name
  name: 'data-panel',
  initialState: {},
  reducers: {},
});

export default dataPanelSlice.reducer;
