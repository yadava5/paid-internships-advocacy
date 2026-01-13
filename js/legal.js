/**
 * legal.js - Apple-style scroll effects for the Legal page
 * Handles parallax backgrounds, section reveals, and scroll animations
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initLegalPage);

  function initLegalPage() {
    initScrollEffects();
    initHeroParallax();
    initFactorCards();
    initScrollIndicator();
  }

  /**
   * Initialize scroll-triggered reveal animations for sections
   */
  function initScrollEffects() {
    const sections = document.querySelectorAll('.legal-section');
    
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Stagger animate child elements
          const content = entry.target.querySelector('.legal-content');
          if (content) {
            const children = content.children;
            Array.from(children).forEach((child, index) => {
              child.style.transitionDelay = `${index * 0.1}s`;
              child.classList.add('animate-in');
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Hero parallax effect on scroll
   */
  function initHeroParallax() {
    const hero = document.querySelector('.legal-hero');
    const heroBg = document.querySelector('.legal-hero-bg');
    const heroContent = document.querySelector('.legal-hero-content');

    if (!hero || !heroBg) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;

          if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            
            // Parallax background
            heroBg.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 + progress * 0.1})`;
            heroBg.style.opacity = 1 - progress * 0.5;
            
            // Content fade out
            if (heroContent) {
              heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
              heroContent.style.opacity = 1 - progress * 1.2;
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Add hover effects to factor cards
   */
  function initFactorCards() {
    const factorCards = document.querySelectorAll('.factor-card');
    
    factorCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  /**
   * Hide scroll indicator after scrolling
   */
  function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '1';
        indicator.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  }

})();
