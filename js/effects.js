// ==========================================================
// effects.js · Apple-Style Immersive Experience
// ==========================================================

(function() {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Core effects
    initScrollProgress();
    initCustomCursor();
    initScrollReveal();
    initParallaxCards();
    initSmoothCounter();
    initNavbarScroll();
    initGlowOrbs();
    initMagneticElements();
    initScrollIndicator();
    initTextSplit();
  }

  // ---------- 1. Scroll Progress Bar --------------------
  function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      progress.style.transform = `scaleX(${scrollPercent})`;
    });
  }

  // ---------- 2. Custom Cursor --------------------------
  function initCustomCursor() {
    // Don't show on mobile
    if (window.innerWidth < 768) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .card, .btn, input, select, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        dot.style.transform = 'scale(2)';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover');
        dot.style.transform = 'scale(1)';
      });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  // ---------- 3. Scroll Reveal (Apple-style) ------------
  function initScrollReveal() {
    // Create observer for scroll-reveal elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get delay from data attribute or default to 0
          const delay = parseInt(entry.target.dataset.delay) || 0;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          // Unobserve after revealing (only animate once)
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      revealObserver.observe(el);
    });

    // Cards observer with staggered delays
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Cards
    document.querySelectorAll('.card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      cardObserver.observe(el);
    });

    // Card wrappers (stories page)
    document.querySelectorAll('.card-wrapper').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
      cardObserver.observe(el);
    });

    // Salary counter
    const salaryDiff = document.getElementById('salaryDiff');
    if (salaryDiff) {
      cardObserver.observe(salaryDiff);
    }
  }

  // ---------- 4. 3D Parallax Cards ----------------------
  function initParallaxCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateY(-10px) 
          scale(1.02)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------- 5. Smooth Counter -------------------------
  function initSmoothCounter() {
    const counter = document.getElementById('salaryDiff');
    if (!counter) return;

    const target = parseInt(counter.dataset.target) || 20000;
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounter(counter, target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  }

  function animateCounter(el, target) {
    const duration = 2500;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      const current = Math.round(target * easedProgress);
      el.textContent = '$' + current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---------- 6. Navbar Scroll Effect -------------------
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---------- 7. Glowing Orbs ---------------------------
  function initGlowOrbs() {
    // Only add to homepage
    if (!document.querySelector('header.bg-dark')) return;

    const orb1 = document.createElement('div');
    orb1.className = 'glow-orb glow-orb-1';
    document.body.appendChild(orb1);

    const orb2 = document.createElement('div');
    orb2.className = 'glow-orb glow-orb-2';
    document.body.appendChild(orb2);

    // Subtle movement with mouse
    document.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 30;
      
      orb1.style.transform = `translate(${moveX}px, ${moveY}px)`;
      orb2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    });
  }

  // ---------- 8. Magnetic Elements ----------------------
  function initMagneticElements() {
    const magnetics = document.querySelectorAll('.btn-warning, .btn-lg');
    
    magnetics.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------- 9. Scroll Indicator -----------------------
  function initScrollIndicator() {
    const hero = document.querySelector('header.bg-dark');
    if (!hero) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
      <svg width="30" height="50" viewBox="0 0 30 50">
        <rect x="1" y="1" width="28" height="48" rx="14" 
              stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>
        <circle cx="15" cy="15" r="5" fill="rgba(255,255,255,0.8)">
          <animate attributeName="cy" from="15" to="35" dur="1.5s" 
                   repeatCount="indefinite" calcMode="spline"
                   keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          <animate attributeName="opacity" from="1" to="0" dur="1.5s" 
                   repeatCount="indefinite"/>
        </circle>
      </svg>
    `;
    hero.appendChild(indicator);

    // Hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '1';
      }
    });
  }

  // ---------- 10. Text Split Animation ------------------
  function initTextSplit() {
    // This creates a cool character-by-character reveal on headings
    const headings = document.querySelectorAll('header .display-4');
    
    headings.forEach(heading => {
      const text = heading.textContent;
      heading.innerHTML = '';
      heading.style.opacity = '1';
      heading.style.transform = 'none';
      heading.style.animation = 'none';
      
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(50px) rotateX(-90deg);
          animation: charReveal 0.8s ease forwards;
          animation-delay: ${0.3 + i * 0.03}s;
        `;
        heading.appendChild(span);
      });
    });

    // Add keyframes
    if (!document.querySelector('#char-reveal-style')) {
      const style = document.createElement('style');
      style.id = 'char-reveal-style';
      style.textContent = `
        @keyframes charReveal {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---------- 11. Button Ripple Effect ------------------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    ripple.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
    `;

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });

  // Add ripple keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ---------- 12. Smooth Scroll for Anchors -------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---------- 13. Intersection Observer for Sections ----
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });

})();
