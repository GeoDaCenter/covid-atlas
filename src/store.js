import { configureStore } from '@reduxjs/toolkit';
import appReducer from './components/appSlice';
import datasetsReducer, { fetchDatasets } from './datasets';

const store = configureStore({
  reducer: {
    // TODO it might be nice to have general app state at the top level rather
    // than nested like this...
    app: appReducer,
    datasets: datasetsReducer,
  },
});

store.dispatch(fetchDatasets());

export default store;
