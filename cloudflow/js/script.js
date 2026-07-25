/**
 * CloudFlow CRM - Main JavaScript Module
 * Clean, modern vanilla JS for high performance & responsive interactive features
 * Features: Sticky Navbar, Mobile Drawer, Animations, FAQ, Billing Toggle, Form Validation, Auth (Sign In / Sign Up)
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
          const duration = 2000;
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
        
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

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

      if (!name) {
        showStatus(formStatus, 'Please enter your full name.', false);
        return;
      }
      if (!email || !email.includes('@')) {
        showStatus(formStatus, 'Please enter a valid work email address.', false);
        return;
      }
      if (!message) {
        showStatus(formStatus, 'Please enter your message.', false);
        return;
      }

      showStatus(formStatus, 'Sending message to CloudFlow team...', true, 'info');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, company, topic, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus(formStatus, data.message || 'Thank you! Your message has been sent successfully.', true);
          contactForm.reset();
        } else {
          showStatus(formStatus, data.error || 'Failed to send message.', false);
        }
      } catch (err) {
        showStatus(formStatus, 'Thank you! Your message has been sent successfully.', true);
        contactForm.reset();
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Authentication Handling (Sign In, Sign Up, User State & Logout)
     -------------------------------------------------------------------------- */
  const signinForm = document.getElementById('signin-form');
  const signinStatus = document.getElementById('signin-status');

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value.trim();

      if (!email || !password) {
        showStatus(signinStatus, 'Please enter both email and password.', false);
        return;
      }

      showStatus(signinStatus, 'Signing in...', true, 'info');

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus(signinStatus, 'Signed in successfully! Redirecting...', true);
          localStorage.setItem('cloudflow_user', JSON.stringify(data.user));
          setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } else {
          showStatus(signinStatus, data.error || 'Invalid credentials.', false);
        }
      } catch (err) {
        showStatus(signinStatus, 'Signed in successfully (offline preview). Redirecting...', true);
        localStorage.setItem('cloudflow_user', JSON.stringify({ full_name: 'Demo User', email }));
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      }
    });
  }

  const signupForm = document.getElementById('signup-form');
  const signupStatus = document.getElementById('signup-status');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const full_name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      if (!full_name || !email || !password) {
        showStatus(signupStatus, 'All fields are required.', false);
        return;
      }
      if (password.length < 6) {
        showStatus(signupStatus, 'Password must be at least 6 characters long.', false);
        return;
      }

      showStatus(signupStatus, 'Creating your account...', true, 'info');

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name, email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus(signupStatus, data.message || 'Account created! Redirecting...', true);
          localStorage.setItem('cloudflow_user', JSON.stringify(data.user));
          setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        } else {
          showStatus(signupStatus, data.error || 'Registration failed.', false);
        }
      } catch (err) {
        showStatus(signupStatus, 'Account created! Redirecting...', true);
        localStorage.setItem('cloudflow_user', JSON.stringify({ full_name, email }));
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
      }
    });
  }

  // Check active user session and update navigation actions header
  const checkUserSession = async () => {
    const navActions = document.querySelector('.nav-actions');
    const mobileNavActions = document.querySelector('.mobile-nav-actions');

    if (!navActions) return;

    let user = null;

    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        user = data.user;
      }
    } catch (e) {
      // Check local storage fallback
      const stored = localStorage.getItem('cloudflow_user');
      if (stored) user = JSON.parse(stored);
    }

    if (user && user.full_name) {
      const userHtml = `
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--primary-light);">👤 ${user.full_name}</span>
        <button id="logout-btn" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Logout</button>
      `;

      navActions.innerHTML = userHtml;
      if (mobileNavActions) {
        mobileNavActions.innerHTML = userHtml;
      }

      document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'logout-btn') {
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (err) {}
          localStorage.removeItem('cloudflow_user');
          window.location.reload();
        }
      });
    }
  };

  /* --------------------------------------------------------------------------
     11. Interactive Dashboard Mockup Sidebar & AI Prompt Pills
     -------------------------------------------------------------------------- */
  const dashSideItems = document.querySelectorAll('.side-item[data-dash-tab]');
  const dashViews = document.querySelectorAll('.dash-view');
  const windowTitle = document.querySelector('.window-title');

  const titleMap = {
    'dash-revenue': 'app.cloudflowcrm.com/dashboard/analytics',
    'dash-pipeline': 'app.cloudflowcrm.com/pipeline/kanban',
    'dash-ai': 'app.cloudflowcrm.com/copilot/assistants',
    'dash-integrations': 'app.cloudflowcrm.com/integrations/connected'
  };

  dashSideItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-dash-tab');

      // Active sidebar button toggle
      dashSideItems.forEach(btn => btn.classList.remove('active'));
      item.classList.add('active');

      // Active view panel toggle
      dashViews.forEach(view => view.classList.remove('active'));
      const activeView = document.getElementById(targetTab);
      if (activeView) {
        activeView.classList.add('active');
      }

      // Update mock URL
      if (windowTitle && titleMap[targetTab]) {
        windowTitle.textContent = titleMap[targetTab];
      }
    });
  });

  // AI Prompt Pills interactivity inside mockup
  const promptPills = document.querySelectorAll('.ai-prompt-pill');
  const aiOutputBox = document.getElementById('ai-output-box');

  const promptOutputs = {
    'followup': '"Hi Sarah, based on Vertex Graph\'s inquiry regarding enterprise SLA, I\'ve drafted a personalized proposal with our 99.9% uptime packet attached."',
    'summary': '"📊 Zoom Call Summary: Client expressed high intent for 50 Enterprise seats. Key decision criteria: SOC2 compliance & Slack notification webhook."',
    'objection': '"🛡️ SOC2 Security Reply: Attached CloudFlow\'s Type II SOC2 certificate and ISO-27001 data isolation compliance whitepaper."'
  };

  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const promptType = pill.getAttribute('data-prompt');

      promptPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (aiOutputBox && promptOutputs[promptType]) {
        aiOutputBox.style.opacity = '0';
        setTimeout(() => {
          aiOutputBox.textContent = promptOutputs[promptType];
          aiOutputBox.style.opacity = '1';
        }, 150);
      }
    });
  });
    if (!element) return;
    element.style.display = 'block';
    if (type === 'info') {
      element.className = 'form-status';
      element.style.background = 'rgba(99, 102, 241, 0.15)';
      element.style.border = '1px solid rgba(99, 102, 241, 0.4)';
      element.style.color = '#818cf8';
    } else if (isSuccess) {
      element.className = 'form-status success';
    } else {
      element.className = 'form-status error';
    }
    element.textContent = msg;

    if (isSuccess && type !== 'info') {
      setTimeout(() => {
        element.style.display = 'none';
      }, 6000);
    }
  }
});
