document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('miniAccessChart');
  if (!ctx) return;

  fetch('assets/data/chart_data.json')
    .then(res => res.json())
    .then(data => {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.access_equity.labels,
          datasets: [
            {
              label: 'Paid Internship Access',
              data: data.access_equity.paid,
              borderColor: '#0d6efd',
              backgroundColor: 'rgba(13,110,253,0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      });
    })
    .catch(err => console.error('Chart load error:', err));
});
