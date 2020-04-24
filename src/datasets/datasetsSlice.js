import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStatesAndCounties,
  fetchUsafactsCounties,
} from './datasetsActions';

// create map of dataset ids => action
const datasetActions = {
  'states-and-counties': fetchStatesAndCounties,
  'usafacts-counties': fetchUsafactsCounties,
};
const datasetIds = Object.keys(datasetActions);

// create initial state
const initialState = {};
datasetIds.forEach((datasetId) => {
  initialState[datasetId] = {
    status: null,
    data: {},
  };
});

// create extra reducers object
const extraReducers = datasetIds.reduce((acc, datasetId) => {
  const action = datasetActions[datasetId];
  
  // assign generic async lifecycle reducers
  const datasetReducers = {
    [action.pending]: (state) => {
      state[datasetId].status = 'loading';
    },
    [action.fulfilled]: (state, action) => {
      state[datasetId].status = 'success';
      state[datasetId].data = action.payload;

    },
    [action.rejected]: (state, action) => {
      state[datasetId].status = 'error';
      state[datasetId].data = action.error;
    },
  };

  Object.assign(acc, datasetReducers);

  return acc;
}, {});

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  extraReducers,
});

export default datasetsSlice.reducer;
