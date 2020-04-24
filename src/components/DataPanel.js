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

      <p>Data goes here</p>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedCounty } = state.app;

  let stateName;
  let countyName;

  if (selectedCounty) {
    // get state name
    const { states, counties } = state.datasets['states-and-counties'].data;
    const selectedCountyAttrs = counties[selectedCounty];
    const { stateId } = selectedCountyAttrs;
    stateName = states[stateId].name;

    // get county name
    countyName = selectedCountyAttrs.name;
  }

  return {
    selectedCounty,
    countyName,
    stateName
  };
};

export default connect(mapStateToProps)(DataPanel);
