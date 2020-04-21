import React from 'react';
import { ControlPanel } from '../features/control-panel/ControlPanel';
import { MapPanel } from '../features/map-panel/MapPanel';
import { DataPanel } from '../features/data-panel/DataPanel';
import './App.css';

function App() {
  return (
    <div className="App">
      <ControlPanel />
      <MapPanel />
      <DataPanel />
    </div>
  );
}

export default App;
