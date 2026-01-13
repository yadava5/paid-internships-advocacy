/**
 * legal.js - Apple-style scroll effects for the Legal page
 * Handles parallax backgrounds, section reveals, and smooth scroll animations
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initLegalPage);

  function initLegalPage() {
    initSmoothScrollReveal();
    initHeroParallax();
    initFactorCards();
    initScrollIndicator();
    initSectionBackgrounds();
  }

  /**
   * Smooth scroll-triggered reveal animations with staggered children
   */
  function initSmoothScrollReveal() {
    const sections = document.querySelectorAll('.legal-section');
    
    const observerOptions = {
      root: null,
      rootMargin: '-5% 0px -5% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;
        const content = section.querySelector('.legal-content');
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          section.classList.add('visible');
          
          // Stagger animate child elements with eased delays
          if (content && !content.classList.contains('animated')) {
            content.classList.add('animated');
            const children = content.children;
            Array.from(children).forEach((child, index) => {
              // Use cubic easing for stagger timing
              const delay = index * 0.08;
              child.style.transitionDelay = `${delay}s`;
              
              // Small timeout to ensure CSS picks up the delay
              requestAnimationFrame(() => {
                child.classList.add('animate-in');
              });
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Smooth hero parallax effect with easing
   */
  function initHeroParallax() {
    const hero = document.querySelector('.legal-hero');
    const heroBg = document.querySelector('.legal-hero-bg');
    const heroContent = document.querySelector('.legal-hero-content');
    const stats = document.querySelectorAll('.legal-stats .stat-item');

    if (!hero || !heroBg) return;

    let currentY = 0;
    let targetY = 0;
    let rafId = null;

    // Smooth lerp function
    const lerp = (start, end, factor) => start + (end - start) * factor;

    function updateParallax() {
      // Smooth interpolation
      currentY = lerp(currentY, targetY, 0.1);
      
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(currentY / heroHeight, 1);
      
      // Parallax background with smooth easing
      heroBg.style.transform = `translate3d(0, ${currentY * 0.3}px, 0) scale(${1 + progress * 0.1})`;
      heroBg.style.opacity = 1 - progress * 0.6;
      
      // Content fade out with 3D transform for GPU acceleration
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${currentY * 0.15}px, 0)`;
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
      }
      
      // Stagger stats fade
      stats.forEach((stat, index) => {
        const offset = currentY * (0.1 + index * 0.03);
        stat.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      
      // Continue animation if still scrolling
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
   * Smooth hover effects for interactive cards
   */
  function initFactorCards() {
    const cards = document.querySelectorAll('.factor-card, .state-card, .action-step, .case-content');
    
    cards.forEach(card => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.3s ease, background 0.3s ease';
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px) scale(1.01)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Resource links with slide effect
    const resourceLinks = document.querySelectorAll('.resource-link, .btn-legal-source');
    resourceLinks.forEach(link => {
      link.style.transition = 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  }

  /**
   * Hide scroll indicator with smooth fade
   */
  function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    indicator.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(-50%) translateY(20px)';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateX(-50%) translateY(0)';
        indicator.style.pointerEvents = 'auto';
      }
      
      lastScrollY = scrollY;
    }, { passive: true });
  }

  /**
   * Subtle background movement on scroll for sections
   */
  function initSectionBackgrounds() {
    const sections = document.querySelectorAll('.legal-section');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if section is in view
            if (rect.top < windowHeight && rect.bottom > 0) {
              const bg = section.querySelector('.legal-section-bg');
              if (bg) {
                // Calculate how far through the section we've scrolled
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const offset = (progress - 0.5) * 30;
                
                bg.style.transform = `translate3d(0, ${offset}px, 0)`;
              }
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
