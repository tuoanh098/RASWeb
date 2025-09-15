import React from 'react';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import styles from '../pages/Salary.module.css';

export default function RasKpiCard({ icon, label, value, delta, positive=true }) {
  return (
    <div className={`ras-kpi ${styles.kpiGlow}`}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-ras-primary/10 text-ras-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-sm text-ras-dark/60">{label}</div>
          <div className="text-2xl font-extrabold text-ras-dark">{value}</div>
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3">
          <span className={`ras-chip ${positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {positive ? <TrendingUp fontSize="inherit" /> : <TrendingDown fontSize="inherit" />}
            <span className="ml-1">{delta}</span>
          </span>
        </div>
      )}
    </div>
  );
}
