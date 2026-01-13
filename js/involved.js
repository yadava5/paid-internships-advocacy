/**
 * involved.js - 3D scroll effects for the Get Involved page
 * Handles 3D scroll effects, parallax, and interactive elements
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', initInvolvedPage);

  function initInvolvedPage() {
    init3DSectionEffects();
    initHeroParallax();
    initTiltCards();
    initScrollIndicator();
    initMagneticButtons();
    initCounters();
  }

  /**
   * 3D Scroll Effects - Sections minimize and fade as you scroll
   */
  function init3DSectionEffects() {
    const sections = document.querySelectorAll('.involved-section');
    if (!sections.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollEffects(sections);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateScrollEffects(sections);
  }

  function updateScrollEffects(sections) {
    const viewportHeight = window.innerHeight;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = (sectionCenter - viewportCenter) / viewportHeight;

      const bg = section.querySelector('.involved-section-bg');
      const content = section.querySelector('.involved-content');
      const icon = section.querySelector('.section-icon');

      // Background parallax
      if (bg) {
        const bgOffset = distanceFromCenter * 50;
        const bgScale = 1.1 - Math.abs(distanceFromCenter) * 0.05;
        bg.style.transform = `translateY(${bgOffset}px) scale(${bgScale})`;
        bg.style.opacity = 1 - Math.abs(distanceFromCenter) * 0.3;
      }

      // Content 3D transform
      if (content) {
        const scale = 1 - Math.abs(distanceFromCenter) * 0.15;
        const translateZ = -Math.abs(distanceFromCenter) * 100;
        const rotateX = distanceFromCenter * 8;
        const opacity = 1 - Math.abs(distanceFromCenter) * 0.6;
        const translateY = distanceFromCenter * -20;

        content.style.transform = `
          perspective(1200px)
          translateZ(${translateZ}px)
          translateY(${translateY}px)
          rotateX(${rotateX}deg)
          scale(${Math.max(0.85, scale)})
        `;
        content.style.opacity = Math.max(0.3, opacity);
      }

      // Icon parallax
      if (icon) {
        const iconOffset = distanceFromCenter * -15;
        icon.style.transform = `translateY(${iconOffset}px)`;
      }

      // In-view detection for animations
      if (Math.abs(distanceFromCenter) < 0.4) {
        section.classList.add('in-view');
        
        if (content && !content.classList.contains('animated')) {
          content.classList.add('animated');
          const children = content.children;
          Array.from(children).forEach((child, index) => {
            const delay = index * 0.08;
            child.style.transitionDelay = `${delay}s`;
            requestAnimationFrame(() => {
              child.classList.add('animate-in');
            });
          });
        }
      } else {
        section.classList.remove('in-view');
      }
    });
  }

  /**
   * Hero parallax effect
   */
  function initHeroParallax() {
    const hero = document.querySelector('.involved-hero');
    const heroBg = document.querySelector('.involved-hero-bg');
    const heroContent = document.querySelector('.involved-hero-content');

    if (!hero || !heroBg) return;

    let currentY = 0;
    let targetY = 0;
    let rafId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    function updateParallax() {
      currentY = lerp(currentY, targetY, 0.1);
      
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(currentY / heroHeight, 1);
      
      heroBg.style.transform = `translate3d(0, ${currentY * 0.3}px, 0) scale(${1 + progress * 0.1})`;
      heroBg.style.opacity = 1 - progress * 0.6;
      
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${currentY * 0.15}px, 0)`;
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
      }
      
      if (Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    }

    window.addEventListener('scroll', () => {
      targetY = window.scrollY;
      if (!rafId && targetY < hero.offsetHeight * 1.5) {
        rafId = requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }

  /**
   * 3D tilt effect on cards
   */
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /**
   * Scroll indicator
   */
  function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '1';
        indicator.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  }

  /**
   * Magnetic button effect
   */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * Animated counters in hero
   */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.count);
          animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeProgress);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  /**
   * Copy email template
   */
  window.copyTemplate = function() {
    const template = document.getElementById('email-template');
    if (!template) return;
    
    const text = template.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.copy-btn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check2"></i><span>Copied!</span>';
      btn.style.color = '#00c853';
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.color = '';
      }, 2000);
    });
  };

})();
