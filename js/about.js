/**
 * about.js - Apple-style scroll effects for the About page
 * Handles 3D scroll effects, parallax, and interactive elements
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', initAboutPage);

  function initAboutPage() {
    init3DSectionEffects();
    initHeroParallax();
    initTiltCards();
    initScrollIndicator();
    initMagneticButtons();
  }

  /**
   * Apple-Style 3D Scroll Effects - Sections minimize and fade as you scroll
   */
  function init3DSectionEffects() {
    const sections = document.querySelectorAll('.about-section');
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

      const bg = section.querySelector('.about-section-bg');
      const content = section.querySelector('.about-content');
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
    const hero = document.querySelector('.about-hero');
    const heroBg = document.querySelector('.about-hero-bg');
    const heroContent = document.querySelector('.about-hero-content');

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

})();
