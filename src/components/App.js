import React from 'react';
import { ControlPanel } from './ControlPanel';
import { MapPanel } from './MapPanel';
import { DataPanel } from './DataPanel';
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
