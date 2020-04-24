import React from 'react';
import { connect } from 'react-redux';
import styles from './DataPanel.module.css';

const DataPanel = (props) => {
  const { selectedCounty } = props;

  // if there's no selected county, don't render
  if (!selectedCounty) return null;

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.entityName}>
          {props.countyName} County
        </h1>
        <p className={styles.state}>
          {props.stateName}
        </p>
      </header>

      <p><b>Population:</b> {props.population}<br />
      <b>Hospital Beds:</b> {props.beds}</p>

    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedCounty } = state.app;

  let stateName;
  let countyName;
  let population; 
  let beds;

  if (selectedCounty) {
    // get state name
    const { states, counties } = state.datasets['states-and-counties'].data;
    const selectedCountySnapshots = state.datasets['usafacts-counties'].data[parseInt(selectedCounty)];
    const selectedCountyAttrs = counties[selectedCounty];
    const { stateId } = selectedCountyAttrs;
    stateName = states[stateId].name;
    population = selectedCountyAttrs.population;
    beds = selectedCountyAttrs.beds;
    // get county name
    countyName = selectedCountyAttrs.name;
  }

  return {
    selectedCounty,
    countyName,
    stateName,
    population,
    beds
  };
};

export default connect(mapStateToProps)(DataPanel);
