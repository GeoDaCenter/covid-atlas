import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import styles from './DataPanel.module.css';


const DataPanel = (props) => {
  const { selectedCounty } = props;

  // if there's no selected county, don't render
  if (!selectedCounty) return null;

  // to avoid NaNs or 0.000s
  let deathRate = 0;
  let casesPer10k = 0;
  let deathsPer10k = 0;
  let casesPerBed = 0;

  if (props.totalCases > 0) {
    deathRate = (props.totalDeaths / props.totalCases).toFixed(3);

    if (props.beds > 0) {
      casesPerBed = (props.totalCases / props.beds).toFixed(3);
    }

    if (props.population > 0) {
      casesPer10k = ((props.totalCases / props.population) * 10000).toFixed(3);
      deathsPer10k = ((props.totalDeaths / props.population) * 10000).toFixed(3);
    }
  }

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
      <hr></hr>

      <h5>April 22, 2020</h5>
      <Table variant="dark" striped bordered hover size="sm">
        <tbody>
          <tr>
            <td>Cases</td>
            <td>{props.totalCases}</td>
          </tr>
          <tr>
            <td>Cases per 10k Population</td>
            <td>{casesPer10k}</td>
          </tr>
          <tr>
            <td>Cases per Hospital Bed</td>
            <td>{casesPerBed}</td>
          </tr>
          <tr>
            <td>Deaths</td>
            <td>{props.totalDeaths}</td>
          </tr>
          <tr>
            <td>Deaths per 10k Population</td>
            <td>{deathsPer10k}</td>
          </tr>
          <tr>
            <td>Deaths/Cases</td>
            <td>{deathRate}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedCounty } = state.app;

  let stateName;
  let countyName;
  let population;
  let beds;
  let totalCases;
  let totalDeaths;

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
    // date hardcoded for now until we add slider
    const recentSnapshot = selectedCountySnapshots['2020-04-22T00:00:00.000Z'];
    totalDeaths = recentSnapshot.deaths;
    totalCases = recentSnapshot.cases;
  }

  return {
    selectedCounty,
    countyName,
    stateName,
    population,
    beds,
    totalCases,
    totalDeaths
  };
};

export default connect(mapStateToProps)(DataPanel);
