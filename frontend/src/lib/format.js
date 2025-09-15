export const toCurrency = (v) =>
  (v ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 });

export const toDateStr = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  const y = dt.getFullYear();
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  const day = `${dt.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};
