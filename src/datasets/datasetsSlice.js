import { createSlice } from '@reduxjs/toolkit';
import { fetchUsafactsCounties } from './datasetsActions';

// create initial state
const datasetIds = ['usafacts-counties'];
const initialState = {};
datasetIds.forEach((datasetId) => {
  initialState[datasetId] = {
    status: null,
    data: {},
  };
});

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  extraReducers: {
    // TODO set these more programmatically? iterate over a map of dataset id =>
    // fetch action?
    [fetchUsafactsCounties.pending]: (state) => {
      state['usafacts-counties'].status = 'loading';
    },
    [fetchUsafactsCounties.fulfilled]: (state, action) => {
      state['usafacts-counties'].status = 'success';
      state['usafacts-counties'].data = action.payload;
      
    },
    [fetchUsafactsCounties.rejected]: (state, action) => {
      state['usafacts-counties'].status = 'error';
      state['usafacts-counties'].data = action.error;
    },
  },
});

export default datasetsSlice.reducer;
