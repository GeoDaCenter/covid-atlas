import React from 'react';
import { connect } from 'react-redux';
import styles from './DataPanel.module.css';

const DataPanel = (props) => {
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.entityName}>
          {props.selectedCounty || 'No'} County
        </h1>
        <p className={styles.state}>Alaska</p>
      </header>

      <p>Data goes here</p>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedCounty } = state.app;
  return { selectedCounty };
};

export default connect(mapStateToProps)(DataPanel);
