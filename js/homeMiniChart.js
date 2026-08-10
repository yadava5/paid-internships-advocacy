document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('miniAccessChart');
  if (!ctx) return;

  fetch('assets/data/chart_data.json')
    .then(res => res.json())
    .then(data => {
      // Share of interns whose internship was unpaid, by group.
      // NACE, Class of 2023 (Table 2) — see assets/data/chart_data.json.
      // Bars, not a line: these categories have no order, so a line would
      // draw a trend that does not exist.
      const groups = data.unpaid_by_group;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: groups.labels,
          datasets: [
            {
              label: 'Share of internships unpaid',
              data: groups.data,
              backgroundColor: groups.labels.map(l => l === 'All interns' ? '#ffc107' : '#ff5252'),
              borderRadius: 3,
              borderSkipped: false
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
