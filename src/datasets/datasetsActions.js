import { createAsyncThunk } from '@reduxjs/toolkit';
import { merge } from 'lodash';
import { 
  fetchUsafactsCountiesDataset,
} from './datasetsUtils';

// action for fetching usafacts county-level data
// note these are two files that need to be merged
const fetchUsafactsCounties = createAsyncThunk(
  'datasets/fetchUsafactsCounties',
  async () => {
    // fetch and tidy cases and deaths in parallel
    const [cases, deaths] = await Promise.all([
      fetchUsafactsCountiesDataset({
        countType: 'cases',
        url: 'https://geodacenter.github.io/covid/covid_confirmed_usafacts.csv',
      }),
      fetchUsafactsCountiesDataset({
        countType: 'deaths',
        url: 'https://geodacenter.github.io/covid/covid_deaths_usafacts.csv',
      }),
    ]);

    // merge them
    const merged = merge(cases, deaths);

    return merged;
  },
);

// action for fetching all datasets
const fetchDatasets = createAsyncThunk(
  'datasets/fetchDatasets',
  async (arg, thunkApi) => {
    return Promise.all([
      thunkApi.dispatch(fetchUsafactsCounties()),
    ]);
  },
);

export {
  fetchUsafactsCounties,
  fetchDatasets,
};
