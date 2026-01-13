// ===========================================
// nav.js - Unified Navigation Behavior
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  // Highlight the current page in the navbar
  const links = document.querySelectorAll('.nav-link');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  
  // Glassmorphism Nav - Add scrolled class
  const navbar = document.querySelector('.glass-nav, .navbar');
  
  if (navbar) {
    const handleNavScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check
  }
  
  // Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  if (scrollTopBtn) {
    const handleScrollTopVisibility = () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };
    
    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    handleScrollTopVisibility(); // Initial check
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
  