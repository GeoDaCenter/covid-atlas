import React from 'react';
import styles from './DataPanel.module.css';

const DataPanel = (props) => {
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.entityName}>Cook County</h1>
        <p className={styles.state}>Illinois</p>
      </header>

      <p>Data goes here</p>
    </div>
  );
}
export default DataPanel;
