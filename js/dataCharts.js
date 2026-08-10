/**
 * Data Page - Immersive Charts
 * Full-screen data sections with 3D scroll effects
 */

(function() {
  'use strict';

  // Chart.js Global Defaults
  Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
  Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

  // Premium color palette
  const colors = {
    paid: '#00c853',
    unpaid: '#ff5252',
    none: '#888888',
    gold: '#ffc107',
    purple: '#6930c3',
    blue: '#0d6efd',
    cyan: '#00bcd4'
  };

  // Animation config
  const animationConfig = {
    duration: 2000,
    easing: 'easeOutQuart'
  };

  // Tooltip config
  const tooltipConfig = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    cornerRadius: 12,
    titleFont: { size: 14, weight: '600' },
    bodyFont: { size: 13 }
  };

  // Store chart instances
  window.chartInstances = {};
  let chartsInitialized = {};

  // The JSON key behind each section's `data-chart` attribute. Both the chart
  // builders and the citation renderer read this one map, so the bars a reader
  // sees and the publication printed under them come from the same object and
  // cannot be pointed at different datasets.
  const datasetKeys = {
    offer: 'offer_rate',
    salary: 'salary_comparison',
    offers2015: 'salary_offers_2015',
    groups: 'unpaid_by_group',
    surveys: 'unpaid_by_instrument',
    overtime: 'unpaid_over_time'
  };

  // Load data and initialize
  document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/chart_data.json')
      .then(res => res.json())
      .then(data => {
        renderSources(data);
        initScrollEffects();
        initChartObservers(data);
      })
      .catch(err => console.error('Error loading chart data:', err));
  });

  /**
   * Print each dataset's own `source` string under its canvas.
   *
   * This is the only citation on the page. It is rendered from the same object
   * the chart is drawn from, so a figure and the publication it is attributed
   * to cannot drift apart — which is exactly how this page once ended up
   * crediting numbers to organisations that had never published them. To
   * change a citation, edit `source` in chart_data.json; do not type one into
   * data.html.
   *
   * Runs on load rather than inside createChart(): a citation has to be in the
   * document whether or not the reader has scrolled its chart into view.
   */
  function renderSources(data) {
    document.querySelectorAll('.data-section[data-chart]').forEach(section => {
      const key = datasetKeys[section.dataset.chart];
      const dataset = key && data[key];

      if (!dataset || !dataset.source) {
        console.error(
          `No source in chart_data.json for data-chart="${section.dataset.chart}"` +
          ' — the chart will render with no citation.'
        );
        return;
      }

      const wrapper = section.querySelector('.chart-wrapper');
      if (!wrapper || wrapper.parentElement.querySelector('.chart-source')) return;

      const caption = document.createElement('p');
      caption.className = 'chart-source';

      const icon = document.createElement('i');
      icon.className = 'bi bi-journal-text';
      icon.setAttribute('aria-hidden', 'true');

      caption.appendChild(icon);
      // textContent, not innerHTML: the string is data, never markup.
      caption.appendChild(document.createTextNode(` Source: ${dataset.source}`));

      wrapper.insertAdjacentElement('afterend', caption);
    });
  }

  /**
   * 3D Scroll Effects for Data Sections
   */
  function initScrollEffects() {
    const sections = document.querySelectorAll('.data-section');
    if (!sections.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDataScrollEffects(sections);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial call
    updateDataScrollEffects(sections);
  }

  function updateDataScrollEffects(sections) {
    const viewportHeight = window.innerHeight;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = (sectionCenter - viewportCenter) / viewportHeight;

      // Get elements
      const bg = section.querySelector('.data-section-bg');
      const content = section.querySelector('.data-content');
      const text = section.querySelector('.data-text');
      const visual = section.querySelector('.data-visual');
      const scrollHint = section.querySelector('.section-scroll-hint');

      // Background parallax
      if (bg) {
        const bgOffset = distanceFromCenter * 50;
        bg.style.transform = `translateY(${bgOffset}px) scale(1.1)`;
      }

      // Content 3D transform
      if (content) {
        const scale = 1 - Math.abs(distanceFromCenter) * 0.1;
        const translateZ = -Math.abs(distanceFromCenter) * 80;
        const rotateX = distanceFromCenter * 5;
        const opacity = 1 - Math.abs(distanceFromCenter) * 0.5;

        content.style.transform = `
          perspective(1000px)
          translateZ(${translateZ}px)
          rotateX(${rotateX}deg)
          scale(${Math.max(0.9, scale)})
        `;
        content.style.opacity = Math.max(0.4, opacity);
      }

      // Text parallax
      if (text) {
        const textOffset = distanceFromCenter * -30;
        text.style.transform = `translateY(${textOffset}px)`;
      }

      // Visual parallax (opposite direction)
      if (visual) {
        const visualOffset = distanceFromCenter * 20;
        visual.style.transform = `translateY(${visualOffset}px)`;
      }

      // Scroll hint
      if (scrollHint) {
        const hintOpacity = distanceFromCenter < -0.3 ? 0 : 1 - Math.abs(distanceFromCenter) * 2;
        scrollHint.style.opacity = Math.max(0, hintOpacity);
      }

      // Mark section as in-view for chart animation
      if (Math.abs(distanceFromCenter) < 0.5) {
        section.classList.add('in-view');
      } else {
        section.classList.remove('in-view');
      }
    });
  }

  /**
   * Initialize Chart Observers - Only create charts when visible
   */
  function initChartObservers(data) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chartType = entry.target.dataset.chart;
          if (chartType && !chartsInitialized[chartType]) {
            createChart(chartType, data);
            chartsInitialized[chartType] = true;
          }
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.data-section').forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Create individual charts
   *
   * Every dataset below is a published figure, and the `source` string beside
   * it in chart_data.json names the publication — rendered under the canvas by
   * renderSources(). The dataset is resolved through `datasetKeys`, the same
   * map the citation uses, so a chart and its citation always read the same
   * entry of the file.
   */
  function createChart(type, data) {
    const dataset = data[datasetKeys[type]];
    if (!dataset) return;

    switch(type) {
      case 'offer':
        createOfferChart(dataset);
        break;
      case 'salary':
        createSalaryChart(dataset);
        break;
      case 'offers2015':
        createSalaryOffersChart(dataset);
        break;
      case 'groups':
        createUnpaidGroupChart(dataset);
        break;
      case 'surveys':
        createSurveyGapChart(dataset);
        break;
      case 'overtime':
        createUnpaidOverTimeChart(dataset);
        break;
    }
  }

  // 1. Offer Rate - Vertical Bar (NACE Class of 2015, private for-profit, applicants)
  // Was a doughnut. It cannot be: 72.2 / 43.9 / 36.5 are three independent
  // rates, not parts of one whole, and a doughnut sizes each arc as
  // value / sum (152.6) — so the 72.2% slice rendered as 47% of the ring.
  // Bars against a 0-100 axis show each rate at its own size.
  function createOfferChart(data) {
    const ctx = document.getElementById('offerRateChart');
    if (!ctx) return;

    window.chartInstances['offer'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Received at least one offer',
          data: data.data,
          backgroundColor: [colors.paid, colors.unpaid, colors.none],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 90
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipConfig,
            callbacks: { label: (ctx) => ` ${ctx.raw}% received an offer` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { callback: (v) => v + '%', font: { size: 12 } }
          }
        },
        animation: animationConfig
      }
    });
  }

  // 2. Starting Salary - Horizontal Bar (NACE 2022 Student Survey)
  function createSalaryChart(data) {
    const ctx = document.getElementById('salaryChart');
    if (!ctx) return;

    window.chartInstances['salary'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: [colors.paid, colors.unpaid],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` $${ctx.raw.toLocaleString()}` } }
        },
        scales: {
          // Axis starts at zero: a truncated axis would overstate the gap.
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { callback: (v) => '$' + (v/1000) + 'k', font: { size: 12 } }
          },
          y: { grid: { display: false }, ticks: { font: { size: 13, weight: '500' } } }
        },
        animation: animationConfig
      }
    });
  }

  // 3. Class of 2015 salary offers - Vertical Bar
  // Label order is Paid / No internship / Unpaid, so the colours follow that
  // order too: an unpaid internship polled BELOW no internship at all.
  function createSalaryOffersChart(data) {
    const ctx = document.getElementById('salaryOffersChart');
    if (!ctx) return;

    window.chartInstances['offers2015'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: [colors.paid, colors.none, colors.unpaid],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 90
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` $${ctx.raw.toLocaleString()}` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { callback: (v) => '$' + (v/1000) + 'k', font: { size: 12 } }
          }
        },
        animation: animationConfig
      }
    });
  }

  // 4. Unpaid share by group - Vertical Bar (NACE Class of 2023, Table 2)
  // One measure only (share unpaid), so no paid/unpaid legend: the baseline
  // bar is gold, every group bar is the unpaid red.
  function createUnpaidGroupChart(data) {
    const ctx = document.getElementById('unpaidGroupChart');
    if (!ctx) return;

    const barColors = data.labels.map(label => label === 'All interns' ? colors.gold : colors.unpaid);

    window.chartInstances['groups'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Share unpaid',
          data: data.data,
          backgroundColor: barColors,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.raw}% unpaid` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 60, minRotation: 45 } },
          y: {
            beginAtZero: true,
            max: 60,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { callback: (v) => v + '%' }
          }
        },
        animation: animationConfig
      }
    });
  }

  // 5. Same year, two instruments - Horizontal Bar
  // NACE gold (as in chart 4); the two NSCI readings in cyan and blue.
  function createSurveyGapChart(data) {
    const ctx = document.getElementById('surveyGapChart');
    if (!ctx) return;

    window.chartInstances['surveys'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Share unpaid',
          data: data.data,
          backgroundColor: [colors.gold, colors.cyan, colors.blue],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.raw}% unpaid` } }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 60,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { callback: (v) => v + '%' }
          },
          y: { grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } }
        },
        animation: animationConfig
      }
    });
  }

  // 6. Unpaid share over time - Line, two observed points
  // Deliberately dashed: NACE measured the Class of 2014 and the Class of
  // 2023 on this basis, not the years between. The segment is a connection,
  // not a series.
  function createUnpaidOverTimeChart(data) {
    const ctx = document.getElementById('unpaidOverTimeChart');
    if (!ctx) return;

    window.chartInstances['overtime'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Share unpaid',
          data: data.data,
          borderColor: colors.unpaid,
          backgroundColor: 'transparent',
          borderDash: [8, 6],
          borderWidth: 3,
          pointRadius: 9,
          pointHoverRadius: 12,
          pointBackgroundColor: [colors.unpaid, colors.gold],
          pointBorderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.raw}% unpaid` } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { size: 13, weight: '500' } } },
          y: {
            beginAtZero: true,
            max: 60,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { callback: (v) => v + '%' }
          }
        },
        animation: animationConfig
      }
    });
  }

})();
