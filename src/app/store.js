import { configureStore } from '@reduxjs/toolkit';
import controlPanelReducer from '../features/control-panel/controlPanelSlice';
import mapPanelReducer from '../features/map-panel/mapPanelSlice';
import dataPanelReducer from '../features/data-panel/dataPanelSlice';

export default configureStore({
  reducer: {
    controlPanel: controlPanelReducer,
    mapPanel: mapPanelReducer,
    dataPanel: dataPanelReducer,
  },
});
