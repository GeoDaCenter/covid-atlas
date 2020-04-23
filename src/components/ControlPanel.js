import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faShieldVirus } from '@fortawesome/free-solid-svg-icons';
import styles from './ControlPanel.module.css';
import { Form } from 'react-bootstrap'

export default function ControlPanel() {
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
      <Form style={{ flex: 1 }}>
        <Form.Group controlId="control.Data">
          <Form.Label>Data</Form.Label>
          <Form.Control as="select">
            <option value="counties_usafacts">Counties - USAFacts</option>
            <option value="counties_1point3acres">Counties - 1Point3Acres</option>
            <option value="states_1point3acres">States - 1Point3Acres</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="control.Variable">
          <Form.Label>Variable</Form.Label>
          <Form.Control as="select">
            <option value="cases">Cases</option>
            <option value="cases_per_10k">Cases per 10K Population</option>
            <option value="deaths">Deaths</option>
            <option value="deaths_per_10k">Deaths per 10K Population</option>
            <option value="death_rate">Deaths/Cases</option>
            <option value="daily_new_cases">Daily New Cases</option>
            <option value="daily_new_cases_per_10k">Daily New Cases per 10K Pop</option>
            <option value="daily_new_deaths">Daily New Deaths</option>
            <option value="daily_new_deaths_per_10k">Daily New Deaths per 10K Pop</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
           <Form.Check
            type="checkbox"
            label="View as cartogram"
            value="view_cartogram"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Show hotspots"
            value="show_hotspots"
          />
          <Form.Check
            type="checkbox"
            label="Show hospitals"
            value="show_hospitals"
          />
          <Form.Check
            type="checkbox"
            label="Show Native Reservations"
            value="show_reservations"
          />
        </Form.Group>
      </Form>



      <footer className={styles.footer}>
        Powered by GeoDa
      </footer>
    </div>
  );
}
