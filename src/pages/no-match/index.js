import React from 'react';
import styles from './styles.scss';

const NoMatch = ({ error, timedOut }) => {
  let tip = { title: 'Sorry! Page Not Found', des: '' };
  if (error) {
    tip = {
      title: 'Resource Not Found',
      des: 'Please reload page to fetch the latest version',
    };
  }
  if (timedOut) {
    tip = {
      title: 'Time Out',
      des: 'It seems that the network is too slow',
    };
  }
  return (
    <div className={styles.error}>
      <h1>{tip.title}</h1>
      <p className={styles['zoom-area']}>{tip.des}</p>
      <section className={styles['error-container']}>
        <span>
          <span>4</span>
        </span>
        <span>0</span>
        <span>
          <span>4</span>
        </span>
      </section>
      <div className={styles['link-container']}>
        <button
          className={styles['more-link']}
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default NoMatch;
