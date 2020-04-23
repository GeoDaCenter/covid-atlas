import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import appReducer from './components/appSlice';
import datasetsReducer, { fetchDatasets } from './datasets';

// disable a few pieces of default middleware (these cause slowdowns with large
// amounts of data in state)
const middleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false,
});

const store = configureStore({
  middleware, 
  reducer: {
    // TODO it might be nice to have general app state at the top level rather
    // than nested like this...
    app: appReducer,
    datasets: datasetsReducer,
  },
});

store.dispatch(fetchDatasets());

export default store;
