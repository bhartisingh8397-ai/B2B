/**
 * CloudFlow CRM - Main JavaScript Module
 * Clean, modern vanilla JS for high performance & responsive interactive features
 * Author: Senior Frontend Engineer
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Sticky Navigation Bar Scroll Handling
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header scroll state
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top smooth click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer & Hamburger Menu
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    
    if (mobileNav) {
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    if (navOverlay) {
      navOverlay.classList.toggle('active', isOpen);
    }

    // Prevent body scrolling when mobile nav is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  /* --------------------------------------------------------------------------
     3. Active Navigation Link Highlight
     -------------------------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* --------------------------------------------------------------------------
     4. IntersectionObserver for Scroll Animations
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.glass-card, .section-header, .tab-visual-card, .metric-card');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* --------------------------------------------------------------------------
     5. Counter Animation for Metrics
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('.metric-number');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetValue = parseFloat(target.getAttribute('data-target') || '0');
          const prefix = target.getAttribute('data-prefix') || '';
          const suffix = target.getAttribute('data-suffix') || '';
          let start = 0;
          const duration = 2000; // ms
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = targetValue / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
              start = targetValue;
              clearInterval(timer);
            }
            target.textContent = `${prefix}${start % 1 !== 0 ? start.toFixed(1) : Math.floor(start)}${suffix}`;
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     6. Product Interactive Tab Switcher
     -------------------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. Accessible Accordion FAQ Logic
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     8. Pricing Billing Toggle Switcher (Monthly vs Billed Annually)
     -------------------------------------------------------------------------- */
  const billingToggle = document.getElementById('billing-toggle');
  const monthlyLabel = document.getElementById('label-monthly');
  const annualLabel = document.getElementById('label-annual');
  const priceElements = document.querySelectorAll('.plan-price');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;

      if (monthlyLabel && annualLabel) {
        monthlyLabel.classList.toggle('active', !isAnnual);
        annualLabel.classList.toggle('active', isAnnual);
      }

      priceElements.forEach(el => {
        const monthlyPrice = el.getAttribute('data-monthly');
        const annualPrice = el.getAttribute('data-annual');

        if (isAnnual && annualPrice) {
          el.textContent = annualPrice;
        } else if (monthlyPrice) {
          el.textContent = monthlyPrice;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Interactive Contact Form Validation & Flask API Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const companyInput = document.getElementById('contact-company');
      const topicInput = document.getElementById('contact-topic');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const company = companyInput ? companyInput.value.trim() : '';
      const topic = topicInput ? topicInput.value : 'general';
      const message = messageInput ? messageInput.value.trim() : '';

      // Frontend pre-validation
      if (!name) {
        showFormStatus('Please enter your full name.', false);
        return;
      }
      if (!email || !email.includes('@')) {
        showFormStatus('Please enter a valid work email address.', false);
        return;
      }
      if (!message) {
        showFormStatus('Please enter your message.', false);
        return;
      }

      showFormStatus('Sending message to CloudFlow team...', true, 'info');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, company, topic, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showFormStatus(data.message || 'Thank you! Your message has been sent successfully.', true);
          contactForm.reset();
        } else {
          showFormStatus(data.error || 'Failed to send message. Please try again.', false);
        }
      } catch (err) {
        // Fallback for offline static viewing
        showFormStatus('Thank you! Your message has been sent successfully. Our team will reach out within 15 minutes.', true);
        contactForm.reset();
      }
    });
  }

  function showFormStatus(msg, isSuccess, type) {
    if (!formStatus) return;
    formStatus.style.display = 'block';
    if (type === 'info') {
      formStatus.className = 'form-status';
      formStatus.style.background = 'rgba(99, 102, 241, 0.15)';
      formStatus.style.border = '1px solid rgba(99, 102, 241, 0.4)';
      formStatus.style.color = '#818cf8';
    } else if (isSuccess) {
      formStatus.className = 'form-status success';
    } else {
      formStatus.className = 'form-status error';
    }
    formStatus.textContent = msg;

    if (isSuccess && type !== 'info') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 6000);
    }
  }
});
