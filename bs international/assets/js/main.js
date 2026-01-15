// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  
  // ==========================================
  // Active Navigation Link on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function setActiveLink() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // Set on page load
  
  // ==========================================
  // Close Mobile Menu on Link Click
  // ==========================================
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse.classList.contains('show')) {
        // Use Bootstrap's collapse method
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: true
        });
      }
    });
  });
  
  // ==========================================
  // Smooth Scroll with Offset
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip empty anchors
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==========================================
  // Enhanced Form Validation
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validation
      if (!name || !email || !phone || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Phone validation (basic)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
      }
      
      // Success
      showNotification(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
      contactForm.reset();
      
      // Here you would typically send the form data to a server
      // Example: fetch('/api/contact', { method: 'POST', body: formData })
    });
  }
  
  // ==========================================
  // Improved Notification System
  // ==========================================
  function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifs = document.querySelectorAll('.notification');
    existingNotifs.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button aria-label="Close notification">✖</button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('button').addEventListener('click', () => {
      notification.style.animation = 'slideOutUp 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }
    }, 5000);
  }
  
  // Make showNotification globally accessible
  window.showNotification = showNotification;
  
  // ==========================================
  // Lazy Loading Images (Enhanced)
  // ==========================================
  const lazyImages = document.querySelectorAll('.lazy');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.onload = () => {
              img.style.opacity = '1';
              img.classList.remove('lazy');
            };
            img.onerror = () => {
              // Fallback to placeholder on error
              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EImage Not Found%3C/text%3E%3C/svg%3E';
            };
          }
          
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' }); // Load images 50px before they enter viewport
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
  
  // ==========================================
  // Performance: Debounced Scroll Handler
  // ==========================================
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
      setActiveLink();
      // Add other scroll-dependent functions here
    });
  });
  
});

// ==========================================
// Add slideOutUp animation to CSS
// ==========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutUp {
    from {
      transform: translateX(-50%);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);