import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './MapPanel.module.css';

// xun's account
mapboxgl.accessToken = 'pk.eyJ1IjoibGl4dW45MTAiLCJhIjoiY2locXMxcWFqMDAwenQ0bTFhaTZmbnRwaiJ9.VRNeNnyb96Eo-CorkJmIqg';

// this is a class component because we don't want to re-render the map on every
// update, and it wasn't clear how to do this with functional components 🤷🏼‍♂️
class MapPanel extends React.Component {
  constructor(props) {
    super(props);
  
    this.map = null;
    this.mapContainerRef = React.createRef();
  }

  mapDidLoad() {
    const { map } = this;

    map.addSource('counties', {
      type: 'vector',
      url: 'mapbox://lixun910.ck99hp83904yc2lrwbu6j3zhz-3f7en',
    });

    map.addLayer({
      id: 'counties',
      source: 'counties',
      'source-layer': 'us-counties',
      type: 'fill',
      paint: {
        'fill-color': 'rgba(255, 255, 255, 0.5)',
        'fill-outline-color': '#333',
      },
    });
  }

  componentDidMount() {
    const map = this.map = new mapboxgl.Map({
			container: this.mapContainerRef.current,
			style: 'mapbox://styles/mapbox/dark-v10',
			center: [-98.581427, 39.8282031],
			zoom: 3.7,
    });
    
    map.on('load', this.mapDidLoad.bind(this));
  }

  render() {
    return (
      <div className={styles.mapPanel}>
        <div className={styles.mapContainer} ref={this.mapContainerRef} />
      </div>
    );
  }
}

export { MapPanel };
