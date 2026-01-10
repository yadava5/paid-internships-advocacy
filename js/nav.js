// Highlight the current page in the navbar
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const path  = window.location.pathname.split('/').pop() || 'index.html';
  
    links.forEach(link => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  });
  