// Lightweight reportWebVitals helper used by CRA templates.
// Usage: import reportWebVitals from './reportWebVitals'; reportWebVitals(console.log);
function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        try {
          getCLS(onPerfEntry);
          getFID(onPerfEntry);
          getFCP(onPerfEntry);
          getLCP(onPerfEntry);
          getTTFB(onPerfEntry);
        } catch (e) {
          // ignore
        }
      })
      .catch(() => {
        // web-vitals not installed — silently ignore to avoid build error
      });
  }
}

export default reportWebVitals;
