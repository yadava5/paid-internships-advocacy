/**
 * Survey Page - Multi-Step Form with Apple-Style UX
 */

(function() {
  'use strict';

  let currentStep = 1;
  const totalSteps = 5;

  document.addEventListener('DOMContentLoaded', () => {
    initSurvey();
    initSliders();
    initScrollEffects();
  });

  function initSurvey() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('surveyForm');

    if (!form) return;

    // Next button
    nextBtn?.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });

    // Previous button
    prevBtn?.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showThankYou();
    });

    // Option card selection feedback
    document.querySelectorAll('.option-card input').forEach(input => {
      input.addEventListener('change', () => {
        // Remove selected from siblings
        const parent = input.closest('.option-cards');
        parent?.querySelectorAll('.option-card').forEach(card => {
          card.classList.remove('selected');
        });
        // Add selected to current
        input.closest('.option-card')?.classList.add('selected');
      });
    });

    // Toggle option feedback
    document.querySelectorAll('.toggle-option input').forEach(input => {
      input.addEventListener('change', () => {
        const parent = input.closest('.toggle-options');
        parent?.querySelectorAll('.toggle-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        input.closest('.toggle-option')?.classList.add('selected');
      });
    });

    // Emoji scale feedback
    document.querySelectorAll('.emoji-option input').forEach(input => {
      input.addEventListener('change', () => {
        const parent = input.closest('.emoji-scale');
        parent?.querySelectorAll('.emoji-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        input.closest('.emoji-option')?.classList.add('selected');
      });
    });

    // Rating scale feedback
    document.querySelectorAll('.scale-option input').forEach(input => {
      input.addEventListener('change', () => {
        const parent = input.closest('.scale-options');
        parent?.querySelectorAll('.scale-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        input.closest('.scale-option')?.classList.add('selected');
      });
    });

    // Checkbox feedback
    document.querySelectorAll('.checkbox-item input').forEach(input => {
      input.addEventListener('change', () => {
        input.closest('.checkbox-item')?.classList.toggle('selected', input.checked);
      });
    });
  }

  function goToStep(step) {
    // Hide current step
    const currentStepEl = document.querySelector(`.survey-step[data-step="${currentStep}"]`);
    const nextStepEl = document.querySelector(`.survey-step[data-step="${step}"]`);

    if (!currentStepEl || !nextStepEl) return;

    // Animate out
    currentStepEl.classList.remove('active');
    currentStepEl.classList.add('exit');

    setTimeout(() => {
      currentStepEl.classList.remove('exit');
      nextStepEl.classList.add('active');
      currentStep = step;
      updateProgress();
      updateNavButtons();
      
      // Scroll to form top
      document.getElementById('survey-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update step indicators
    document.querySelectorAll('.progress-steps .step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.remove('active', 'completed');
      
      if (stepNum === currentStep) {
        step.classList.add('active');
      } else if (stepNum < currentStep) {
        step.classList.add('completed');
      }
    });
  }

  function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (prevBtn) {
      prevBtn.disabled = currentStep === 1;
    }

    if (nextBtn && submitBtn) {
      if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
      } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
      }
    }
  }

  function showThankYou() {
    const form = document.getElementById('surveyForm');
    const thankYou = document.getElementById('thankYouMessage');
    const progress = document.querySelector('.survey-progress');

    if (form) form.style.display = 'none';
    if (progress) progress.style.display = 'none';
    if (thankYou) {
      thankYou.style.display = 'flex';
      thankYou.classList.add('animate-in');
    }

    // Scroll to thank you
    thankYou?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function initSliders() {
    const hoursSlider = document.getElementById('hoursSlider');
    const hoursValue = document.getElementById('hoursValue');

    if (hoursSlider && hoursValue) {
      hoursSlider.addEventListener('input', () => {
        hoursValue.textContent = hoursSlider.value;
        updateSliderBackground(hoursSlider);
      });
      updateSliderBackground(hoursSlider);
    }
  }

  function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #00c853 0%, #00c853 ${value}%, rgba(255,255,255,0.1) ${value}%, rgba(255,255,255,0.1) 100%)`;
  }

  function initScrollEffects() {
    const hero = document.querySelector('.survey-hero');
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          const progress = Math.min(scrollY / heroHeight, 1);

          const bg = hero.querySelector('.survey-hero-bg');
          const content = hero.querySelector('.survey-hero-content');

          if (bg) {
            bg.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 + progress * 0.1})`;
            bg.style.opacity = 1 - progress * 0.5;
          }

          if (content) {
            content.style.transform = `translateY(${scrollY * 0.3}px)`;
            content.style.opacity = 1 - progress * 0.8;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
