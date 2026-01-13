/**
 * Stories Page - Immersive Experience
 * Full-screen stories with 3D scroll transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize story carousels
  initStoryCarousels();
  // Initialize 3D scroll effects
  initScrollEffects();
});

/**
 * Story Carousel Navigation for each section
 */
function initStoryCarousels() {
  const sections = document.querySelectorAll('.story-focus-section');
  
  if (!sections.length) return;
  
  sections.forEach(section => {
    const slides = section.querySelectorAll('.story-slide');
    const dots = section.querySelectorAll('.story-dot');
    const prevBtn = section.querySelector('.story-nav-prev');
    const nextBtn = section.querySelector('.story-nav-next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      
      currentIndex = index;
      
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-left', 'slide-right');
        if (i === currentIndex) {
          slide.classList.add('active');
        } else if (i < currentIndex) {
          slide.classList.add('slide-left');
        } else {
          slide.classList.add('slide-right');
        }
      });
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
    
    // Keyboard navigation
    let isInView = false;
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInView = entry.isIntersecting;
        section.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0.5 });
    
    document.addEventListener('keydown', (e) => {
      if (!isInView) return;
      if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
      else if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
    
    viewObserver.observe(section);
    
    // Touch/swipe
    let touchStartX = 0;
    const slidesContainer = section.querySelector('.story-slides-container');
    
    slidesContainer?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slidesContainer?.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        showSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });
    
    showSlide(0);
  });
}

/**
 * 3D Scroll Effects
 * Creates depth, parallax, and 3D transformations when scrolling between sections
 */
function initScrollEffects() {
  const sections = document.querySelectorAll('.story-focus-section');
  if (!sections.length) return;
  
  // Create scroll-driven 3D effects
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const ratio = entry.intersectionRatio;
      
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        section.classList.remove('scrolling-out');
        
        // Animate elements in
        animateSectionIn(section, ratio);
      } else {
        section.classList.remove('in-view');
      }
    });
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  });
  
  sections.forEach(section => observer.observe(section));
  
  // Scroll-driven parallax and 3D transforms
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
  
  // Initial call
  updateScrollEffects(sections);
}

/**
 * Animate section elements as they come into view
 */
function animateSectionIn(section, ratio) {
  const header = section.querySelector('.section-header');
  const icon = section.querySelector('.section-icon');
  
  if (header && ratio > 0.3) {
    header.style.opacity = Math.min(1, (ratio - 0.3) * 3);
    header.style.transform = `translate(-50%, -50%) scale(${0.8 + ratio * 0.2})`;
  }
  
  if (icon && ratio > 0.2) {
    icon.style.opacity = Math.min(1, (ratio - 0.2) * 2);
    icon.style.transform = `translateX(-50%) translateY(${(1 - ratio) * 30}px)`;
  }
}

/**
 * Update 3D scroll effects based on scroll position
 */
function updateScrollEffects(sections) {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const sectionCenter = sectionTop + sectionHeight / 2;
    const viewportCenter = viewportHeight / 2;
    
    // Calculate how far section is from viewport center (-1 to 1)
    const distanceFromCenter = (sectionCenter - viewportCenter) / viewportHeight;
    
    // Get story showcase and apply 3D effects
    const showcase = section.querySelector('.story-showcase');
    const header = section.querySelector('.section-header');
    const scrollHint = section.querySelector('.section-scroll-hint');
    
    if (showcase) {
      // Depth effect - sections closer to center appear larger/closer
      const scale = 1 - Math.abs(distanceFromCenter) * 0.15;
      const translateZ = -Math.abs(distanceFromCenter) * 100;
      const rotateX = distanceFromCenter * 8; // Subtle tilt based on scroll
      const opacity = 1 - Math.abs(distanceFromCenter) * 0.6;
      
      showcase.style.transform = `
        perspective(1000px)
        translateZ(${translateZ}px)
        rotateX(${rotateX}deg)
        scale(${Math.max(0.85, scale)})
      `;
      showcase.style.opacity = Math.max(0.3, opacity);
    }
    
    if (header) {
      // Header fades and scales as section scrolls away
      const headerOpacity = 1 - Math.min(1, Math.abs(distanceFromCenter) * 2);
      const headerScale = 1 - Math.abs(distanceFromCenter) * 0.3;
      
      // Only show header when stories aren't active
      if (!section.classList.contains('story-active')) {
        header.style.opacity = Math.max(0, headerOpacity);
        header.style.transform = `
          translate(-50%, -50%)
          scale(${Math.max(0.7, headerScale)})
          translateZ(${Math.abs(distanceFromCenter) * -50}px)
        `;
      }
    }
    
    // Scroll hint visibility
    if (scrollHint) {
      const hintOpacity = distanceFromCenter < -0.3 ? 0 : 1 - Math.abs(distanceFromCenter) * 1.5;
      scrollHint.style.opacity = Math.max(0, hintOpacity);
    }
    
    // Image parallax effect within the showcase
    const images = section.querySelectorAll('.story-image img');
    images.forEach(img => {
      const parallaxOffset = distanceFromCenter * 30;
      img.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
    });
    
    // Content parallax (moves opposite to scroll for depth)
    const contents = section.querySelectorAll('.story-content');
    contents.forEach(content => {
      const contentParallax = -distanceFromCenter * 20;
      content.style.transform = `translateY(${contentParallax}px)`;
    });
  });
}

/**
 * Add smooth section snapping for a more polished feel
 */
function initSectionSnapping() {
  // Optional: Enable CSS scroll-snap for section snapping
  // This can be enabled/disabled based on preference
  const container = document.body;
  container.style.scrollSnapType = 'y proximity';
  
  const sections = document.querySelectorAll('.story-focus-section');
  sections.forEach(section => {
    section.style.scrollSnapAlign = 'start';
  });
}

// Uncomment to enable section snapping:
// initSectionSnapping();
