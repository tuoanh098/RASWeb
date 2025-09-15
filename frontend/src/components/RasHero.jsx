import React from 'react';
import styles from '../pages/Salary.module.css';

export default function RasHero({ title, subtitle, actions }) {
  return (
    <div className={`${styles.heroWrap}`}>
      <div className={styles.heroAccent} />
      <div className={styles.pattern} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/90 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
