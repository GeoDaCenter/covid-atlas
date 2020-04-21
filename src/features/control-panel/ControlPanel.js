import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faShieldVirus } from '@fortawesome/free-solid-svg-icons';
import styles from './ControlPanel.module.css';

export function ControlPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.minimizeButtonContainer}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>
          COVID Atlas
          <FontAwesomeIcon icon={faShieldVirus} className={styles.shield} />
        </h1>
        <p className={styles.subtitle}>Spatial@UChicago</p>
      </header>

      <p style={{flex: 1}}>Controls go here</p>

      <footer className={styles.footer}>
        Powered by GeoDa
      </footer>
    </div>
  );
}
