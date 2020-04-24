import { createAsyncThunk } from '@reduxjs/toolkit';
import { merge } from 'lodash';
import {
  fetchUsafactsCountiesDataset,
  tidyStatesAndCounties,
} from './datasetsUtils';

export const fetchStatesAndCounties = createAsyncThunk(
  'datasets/fetchStatesAndCounties',
  async () => {
    // fetch
    const url = 'https://geodacenter.github.io/covid/county_usfacts.geojson';
    const response = await fetch(url);
    const data = await response.json();

    // "tidy" (this is really a bigger operation of normalizing and indexing)
    const statesAndCountiesTidied = tidyStatesAndCounties(data);

    return statesAndCountiesTidied;
  },
);

// action for fetching usafacts county-level data
// note these are two files that need to be merged
export const fetchUsafactsCounties = createAsyncThunk(
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
export const fetchDatasets = createAsyncThunk(
  'datasets/fetchDatasets',
  async (_, thunkApi) => {
    const actionCreators = [
      fetchStatesAndCounties,
      fetchUsafactsCounties,
    ];
    const dispatches = actionCreators.map((actionCreator) => {
      return thunkApi.dispatch(actionCreator());
    });

    return Promise.all(dispatches);
  },
);
