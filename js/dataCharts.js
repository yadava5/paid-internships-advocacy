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

  // Load data and initialize
  document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/chart_data.json')
      .then(res => res.json())
      .then(data => {
        initScrollEffects();
        initChartObservers(data);
      })
      .catch(err => console.error('Error loading chart data:', err));
  });

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
   */
  function createChart(type, data) {
    switch(type) {
      case 'offer':
        createOfferChart(data.offer_rate);
        break;
      case 'salary':
        createSalaryChart(data.salary_comparison);
        break;
      case 'growth':
        createGrowthChart(data.salary_growth);
        break;
      case 'industry':
        createIndustryChart(data.industry_distribution);
        break;
      case 'equity':
        createEquityChart(data.access_equity);
        break;
      case 'trend':
        createTrendChart(data.time_trend);
        break;
      case 'hours':
        createHoursChart(data.hours_worked);
        break;
      case 'mental':
        createMentalChart(data.mental_health);
        break;
    }
  }

  // 1. Offer Rate - Doughnut
  function createOfferChart(data) {
    const ctx = document.getElementById('offerRateChart');
    if (!ctx) return;

    window.chartInstances['offer'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: [colors.paid, colors.unpaid, colors.none],
          borderWidth: 0,
          hoverOffset: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, usePointStyle: true, pointStyle: 'circle', font: { size: 13, weight: '500' } }
          },
          tooltip: {
            ...tooltipConfig,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` }
          }
        },
        animation: { animateRotate: true, animateScale: true, ...animationConfig }
      }
    });
  }

  // 2. Salary - Horizontal Bar
  function createSalaryChart(data) {
    const ctx = document.getElementById('salaryChart');
    if (!ctx) return;

    window.chartInstances['salary'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: [colors.paid, colors.unpaid, colors.none],
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
          x: {
            beginAtZero: false,
            min: 35000,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { callback: (v) => '$' + (v/1000) + 'k', font: { size: 12 } }
          },
          y: { grid: { display: false }, ticks: { font: { size: 13, weight: '500' } } }
        },
        animation: animationConfig
      }
    });
  }

  // 3. Salary Growth - Line Chart
  function createGrowthChart(data) {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');
    const paidGradient = context.createLinearGradient(0, 0, 0, 400);
    paidGradient.addColorStop(0, 'rgba(0, 200, 83, 0.3)');
    paidGradient.addColorStop(1, 'rgba(0, 200, 83, 0)');

    window.chartInstances['growth'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Paid Interns',
            data: data.paid,
            borderColor: colors.paid,
            backgroundColor: paidGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: colors.paid,
            borderWidth: 3
          },
          {
            label: 'Unpaid Interns',
            data: data.unpaid,
            borderColor: colors.unpaid,
            backgroundColor: 'transparent',
            tension: 0.4,
            fill: false,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: colors.unpaid,
            borderWidth: 3
          },
          {
            label: 'No Internship',
            data: data.none,
            borderColor: colors.none,
            backgroundColor: 'transparent',
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            borderDash: [5, 5],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}` } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { size: 12 } } },
          y: {
            beginAtZero: false,
            min: 40000,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { callback: (v) => '$' + (v/1000) + 'k', font: { size: 12 } }
          }
        },
        animation: animationConfig
      }
    });
  }

  // 4. Industry - Horizontal Stacked Bar
  function createIndustryChart(data) {
    const ctx = document.getElementById('industryChart');
    if (!ctx) return;

    window.chartInstances['industry'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          { label: 'Paid', data: data.paid, backgroundColor: colors.paid, borderRadius: 4 },
          { label: 'Unpaid', data: data.unpaid, backgroundColor: colors.unpaid, borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: tooltipConfig
        },
        scales: {
          x: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: (v) => v + '%' } },
          y: { stacked: true, grid: { display: false }, ticks: { font: { size: 12 } } }
        },
        animation: animationConfig
      }
    });
  }

  // 5. Equity - Grouped Bar
  function createEquityChart(data) {
    const ctx = document.getElementById('equityChart');
    if (!ctx) return;

    window.chartInstances['equity'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          { label: 'Paid Access', data: data.paid, backgroundColor: colors.paid, borderRadius: 6 },
          { label: 'Unpaid Rate', data: data.unpaid, backgroundColor: colors.unpaid, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: tooltipConfig
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: (v) => v + '%' } }
        },
        animation: animationConfig
      }
    });
  }

  // 6. Trend - Area Chart
  function createTrendChart(data) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');
    const paidGradient = context.createLinearGradient(0, 0, 0, 400);
    paidGradient.addColorStop(0, 'rgba(0, 200, 83, 0.4)');
    paidGradient.addColorStop(1, 'rgba(0, 200, 83, 0)');

    const unpaidGradient = context.createLinearGradient(0, 0, 0, 400);
    unpaidGradient.addColorStop(0, 'rgba(255, 82, 82, 0.4)');
    unpaidGradient.addColorStop(1, 'rgba(255, 82, 82, 0)');

    window.chartInstances['trend'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Paid Internships',
            data: data.paidRate,
            borderColor: colors.paid,
            backgroundColor: paidGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            borderWidth: 3
          },
          {
            label: 'Unpaid Internships',
            data: data.unpaidRate,
            borderColor: colors.unpaid,
            backgroundColor: unpaidGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { size: 12 } } },
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: (v) => v + '%' } }
        },
        animation: animationConfig
      }
    });
  }

  // 7. Hours - Polar Area
  function createHoursChart(data) {
    const ctx = document.getElementById('hoursChart');
    if (!ctx) return;

    window.chartInstances['hours'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          { label: 'Paid Interns', data: data.paid, backgroundColor: colors.paid, borderRadius: 6 },
          { label: 'Unpaid Interns', data: data.unpaid, backgroundColor: colors.unpaid, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: tooltipConfig
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: (v) => v + '%' } }
        },
        animation: animationConfig
      }
    });
  }

  // 8. Mental Health - Radar Chart
  function createMentalChart(data) {
    const ctx = document.getElementById('mentalChart');
    if (!ctx) return;

    window.chartInstances['mental'] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Paid Interns',
            data: data.paid,
            borderColor: colors.paid,
            backgroundColor: 'rgba(0, 200, 83, 0.2)',
            pointBackgroundColor: colors.paid,
            pointRadius: 5,
            borderWidth: 2
          },
          {
            label: 'Unpaid Interns',
            data: data.unpaid,
            borderColor: colors.unpaid,
            backgroundColor: 'rgba(255, 82, 82, 0.2)',
            pointBackgroundColor: colors.unpaid,
            pointRadius: 5,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } },
          tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 80,
            grid: { color: 'rgba(255,255,255,0.1)' },
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } },
            ticks: { display: false }
          }
        },
        animation: animationConfig
      }
    });
  }

})();
