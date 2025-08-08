/**
 * Football Site JavaScript functionality
 * @module football-site
 * @author frontend@webit.de
 */

'use strict';

/**
 * Initializes the football site functionality
 * @function InitFootballSite
 */
function InitFootballSite() {
  // Add any specific JavaScript functionality for the football site here
  
  // Example: Smooth scrolling to training sections
  const trainingLinks = document.querySelectorAll('.training-quick-nav a');
  
  trainingLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Example: Email contact interaction
  const emailLinks = document.querySelectorAll('.trial-email, .training-contact .training-info p[class="clickable"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!link.href || !link.href.startsWith('mailto:')) {
        e.preventDefault();
        const email = link.textContent.trim();
        window.location.href = `mailto:${email}`;
      }
    });
  });
  
  // Training schedule animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe training team items
  const trainingItems = document.querySelectorAll('.training-team-item');
  trainingItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

export default InitFootballSite;
