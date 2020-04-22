import { configureStore } from '@reduxjs/toolkit';
import appReducer from './components/appSlice';

export default configureStore({
  reducer: {
    // TODO it might be nice to have general app state at the top level rather
    // than nested like this...
    app: appReducer,
  },
});
