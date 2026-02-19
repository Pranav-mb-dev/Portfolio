/**
 * script.js — Portfolio Site Logic
 * Author  : Alex Morgan
 * Strategy: Vanilla JS, no dependencies.
 *           All data lives in plain arrays so it can be
 *           swapped for fetch() calls to a real API later.
 *
 * Table of Contents
 * -----------------
 *  1. DATA — Skills & Projects
 *  2. DOM HELPERS
 *  3. NAVIGATION — sticky header, hamburger, active link
 *  4. TYPED TEXT — hero tagline cycling
 *  5. SKILLS RENDERER
 *  6. PROJECTS RENDERER + FILTER
 *  7. SCROLL REVEAL (IntersectionObserver)
 *  8. BACK-TO-TOP BUTTON
 *  9. CONTACT FORM — validation & submit handler
 * 10. FOOTER — dynamic year
 * 11. CUSTOM CURSOR — smooth trailing animation
 * 12. INIT
 */

'use strict';

/* ============================================================
   1. DATA — Skills & Projects
   ============================================================
   Replace these arrays with fetch('/api/skills') etc.
   when a backend is available. The render functions below
   accept the same shape regardless of data source.
   ============================================================ */

/**
 * @typedef {Object} SkillCategory
 * @property {string} icon  - Emoji or SVG string
 * @property {string} title - Category label
 * @property {string[]} tags - Individual skill names
 */
/**
 * SKILL_ICONS — maps skill name → HTML string for the icon.
 * Brand icons: cdn.simpleicons.org/{slug}/{hex-color}
 * Concepts without a brand icon use a clean emoji fallback.
 */
const CDN = (slug, color) =>
  `<img src="https://cdn.simpleicons.org/${slug}/${color}" alt="${slug}" width="13" height="13" loading="lazy" style="display:inline-block;vertical-align:middle;">`;

const SKILL_ICONS = {
  // ── Backend Fundamentals ─────────────────────────────────
  'Java': CDN('openjdk', 'ED8B00'),
  'Spring Boot': CDN('springboot', '6DB33F'),
  'REST API Design': CDN('openapiinitiative', '6BA539'),
  'HTTP / HTTPS': '🌐',
  'MVC Architecture': '🏛️',
  'Request–Response Lifecycle': '🔄',
  'Stateless Backend Design': '📡',
  'Controller–Service–Repository': CDN('springboot', '6DB33F'),

  // ── Database ─────────────────────────────────────────────
  'PostgreSQL': CDN('postgresql', '4169E1'),
  'SQL': '🗄️',
  'JPA / Hibernate': CDN('hibernate', '59666C'),
  'Database Schema Design': '📐',
  'Data Modeling': '🔗',
  'Transactions & Atomicity': '⚛️',
  'Indexing (Conceptual)': '🔍',
  'Normalization vs Denormalization': '⚖️',

  // ── Security & Auth ──────────────────────────────────────
  'JWT Authentication': CDN('jsonwebtokens', 'FB015B'),
  'Role-Based Access Control': '🛡️',
  'Password Hashing': '🔐',
  'Basic Web Security': CDN('owasp', '000000'),
  'Authentication vs Authorization': '🪪',
  'Stateless Token Auth': CDN('jsonwebtokens', 'FB015B'),
  'Backend Validation': '✅',

  // ── Architecture & Engineering ───────────────────────────
  'Monolithic Architecture': '🏗️',
  'Clean Architecture Principles': '🧩',
  'Business Logic Isolation': '🎯',
  'API Versioning': CDN('swagger', '85EA2D'),
  'Pagination & Filtering': '📄',
  'Error Handling & Validation': '⚠️',
  'Logging & Debugging': CDN('datadog', '632CA6'),
  'Failure Handling & Edge Cases': '🛟',

  // ── Performance & Scalability ────────────────────────────
  'Caching Concepts': CDN('redis', 'DC382D'),
  'Async / Background Jobs': '⚙️',
  'Bottleneck Identification': '📊',
  'Scaling Intuition': '📈',

  // ── DevOps & Cloud ───────────────────────────────────────
  'Docker': CDN('docker', '2496ED'),
  'CI/CD Fundamentals': CDN('githubactions', '2088FF'),
  'Object Storage (S3)': CDN('amazonaws', '232F3E'),

  // ── Testing ──────────────────────────────────────────────
  'Unit Testing': CDN('junit5', '25A162'),
  'Integration Testing': '🔗',
  'What to Test vs Not': '🎯',
  'Testing for Refactor Safety': '🛡️',

  // ── Tools ────────────────────────────────────────────────
  'Git': CDN('git', 'F05032'),
  'Postman': CDN('postman', 'FF6C37'),
};

const SKILLS_DATA = [
  {
    icon: '☕',
    title: 'Backend Fundamentals',
    tags: [
      'Java',
      'Spring Boot',
      'REST API Design',
      'HTTP / HTTPS',
      'MVC Architecture',
      'Request–Response Lifecycle',
      'Stateless Backend Design',
      'Controller–Service–Repository',
    ],
  },
  {
    icon: '🗄️',
    title: 'Database',
    tags: [
      'PostgreSQL',
      'SQL',
      'JPA / Hibernate',
      'Database Schema Design',
      'Data Modeling',
      'Transactions & Atomicity',
      'Indexing (Conceptual)',
      'Normalization vs Denormalization',
    ],
  },
  {
    icon: '🔒',
    title: 'Security & Auth',
    tags: [
      'JWT Authentication',
      'Role-Based Access Control',
      'Password Hashing',
      'Basic Web Security',
      'Authentication vs Authorization',
      'Stateless Token Auth',
      'Backend Validation',
    ],
  },
  {
    icon: '🏗️',
    title: 'Architecture & Engineering',
    tags: [
      'Monolithic Architecture',
      'Clean Architecture Principles',
      'Business Logic Isolation',
      'API Versioning',
      'Pagination & Filtering',
      'Error Handling & Validation',
      'Logging & Debugging',
      'Failure Handling & Edge Cases',
    ],
  },
  {
    icon: '⚡',
    title: 'Performance & Scalability',
    tags: [
      'Caching Concepts',
      'Async / Background Jobs',
      'Bottleneck Identification',
      'Scaling Intuition',
    ],
  },
  {
    icon: '☁️',
    title: 'DevOps & Cloud',
    tags: [
      'Docker',
      'CI/CD Fundamentals',
      'AWS Object Storage (S3)',
    ],
  },
  {
    icon: '🧪',
    title: 'Testing',
    tags: [
      'Unit Testing',
      'Integration Testing',
      'What to Test vs Not',
      'Testing for Refactor Safety',
    ],
  },
  {
    icon: '🛠️',
    title: 'Tools',
    tags: ['Git', 'Postman'],
  },
];

/**
 * @typedef {Object} Project
 * @property {string}   icon        - Emoji icon
 * @property {string}   title       - Project name
 * @property {string}   description - Short description
 * @property {string[]} tags        - Tech stack tags
 * @property {string[]} categories  - Filter categories (must include 'all')
 * @property {string}   [github]    - GitHub URL (optional)
 * @property {string}   [demo]      - Live demo URL (optional)
 * @property {boolean}  [featured]  - Show featured badge
 */
const PROJECTS_DATA = [
  {
    icon: '🚀',
    title: 'HyperRoute API Gateway',
    description:
      'A high-performance API gateway built in Go supporting rate limiting, JWT auth, request routing, and circuit breaking. Handles 50k+ req/s on modest hardware.',
    tags: ['Go', 'Redis', 'Docker', 'Prometheus'],
    categories: ['all', 'go', 'infrastructure'],
    github: 'https://github.com/',
    demo: null,
    featured: true,
  },
  {
    icon: '📊',
    title: 'DataStream Pipeline',
    description:
      'Real-time event ingestion pipeline using Kafka and Apache Flink. Processes 1M+ events/day with exactly-once semantics and dead-letter queue handling.',
    tags: ['Java', 'Kafka', 'Flink', 'PostgreSQL', 'AWS'],
    categories: ['all', 'java', 'data'],
    github: 'https://github.com/',
    demo: null,
    featured: true,
  },
  {
    icon: '🔐',
    title: 'AuthForge',
    description:
      'OAuth 2.0 / OIDC identity provider with multi-tenant support, PKCE, refresh token rotation, and a self-service admin dashboard.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    categories: ['all', 'python', 'security'],
    github: 'https://github.com/',
    demo: 'https://example.com/',
    featured: false,
  },
  {
    icon: '🛒',
    title: 'OrderFlow Microservices',
    description:
      'Event-driven order management system using CQRS and Saga pattern. Includes inventory, payment, and notification services communicating via RabbitMQ.',
    tags: ['Java', 'Spring Boot', 'RabbitMQ', 'MongoDB', 'Kubernetes'],
    categories: ['all', 'java', 'microservices'],
    github: 'https://github.com/',
    demo: null,
    featured: false,
  },
  {
    icon: '📈',
    title: 'MetricsHub',
    description:
      'Lightweight observability SDK for Python services. Auto-instruments FastAPI and Django apps with OpenTelemetry traces, metrics, and structured logs.',
    tags: ['Python', 'OpenTelemetry', 'Prometheus', 'Grafana'],
    categories: ['all', 'python', 'infrastructure'],
    github: 'https://github.com/',
    demo: null,
    featured: false,
  },
  {
    icon: '🤖',
    title: 'CronForge Scheduler',
    description:
      'Distributed job scheduler with a REST API, cron expression support, retry policies, and a web UI. Backed by PostgreSQL for durability.',
    tags: ['Go', 'PostgreSQL', 'Docker', 'REST API'],
    categories: ['all', 'go', 'infrastructure'],
    github: 'https://github.com/',
    demo: 'https://example.com/',
    featured: false,
  },
];

/** Filter tab definitions — 'all' is always first */
const PROJECT_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'Python', value: 'python' },
  { label: 'Data', value: 'data' },
  { label: 'Microservices', value: 'microservices' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Security', value: 'security' },
];

/** Typed tagline phrases — cycles in the hero section */
const TYPED_PHRASES = [
  'scalable APIs.',
  'microservices.',
  'distributed systems.',
  'cloud infrastructure.',
  'event-driven pipelines.',
  'reliable backends.',
];

/* ============================================================
   2. DOM HELPERS
   ============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Shorthand querySelectorAll → Array
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/**
 * Create an element with optional attributes and inner HTML.
 * @param {string} tag
 * @param {Object} [attrs={}]
 * @param {string} [html='']
 * @returns {HTMLElement}
 */
function createElement(tag, attrs = {}, html = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (html) el.innerHTML = html;
  return el;
}

/* ============================================================
   3. NAVIGATION
   ============================================================ */

/**
 * Hamburger menu toggle for mobile.
 * Toggles .is-open on the drawer and aria-expanded on the button.
 */
function initHamburger() {
  const btn = $('#hamburger-btn');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    menu.setAttribute('aria-hidden', String(isOpen));
    menu.classList.toggle('is-open', !isOpen);
  });

  // Close menu when a link inside it is clicked
  $$('.mobile-menu__link, .mobile-menu__cta', menu).forEach(link => {
    link.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('is-open');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('is-open');
      btn.focus();
    }
  });
}

/**
 * Highlight the nav link whose section is currently in view.
 * Uses IntersectionObserver for performance.
 */
function initActiveNavLink() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   4. TYPED TEXT — hero tagline
   ============================================================ */

/**
 * Cycles through TYPED_PHRASES with a typewriter effect.
 * Uses requestAnimationFrame-based timing for smoothness.
 */
function initTypedText() {
  const el = $('#typed-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 70;   // ms per character typed
  const DELETE_SPEED = 35;   // ms per character deleted
  const PAUSE_AFTER = 1800; // ms to pause at full phrase
  const PAUSE_BEFORE = 400;  // ms to pause before typing next

  function tick() {
    const phrase = TYPED_PHRASES[phraseIndex];

    if (isPaused) return; // timer handles resume

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      el.setAttribute('aria-label', phrase);

      if (charIndex === phrase.length) {
        // Pause at end of phrase
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(tick, DELETE_SPEED);
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPED_PHRASES.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          setTimeout(tick, TYPE_SPEED);
        }, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Small initial delay so the page feels settled
  setTimeout(tick, 600);
}

/* ============================================================
   5. SKILLS RENDERER
   ============================================================ */

/**
 * Renders skill category cards into #skills-grid.
 *
 * TO INTEGRATE WITH BACKEND:
 *   Replace the direct call with:
 *     fetch('/api/skills')
 *       .then(r => r.json())
 *       .then(data => renderSkills(data));
 *
 * @param {SkillCategory[]} skills
 */
function renderSkills(skills) {
  const grid = $('#skills-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  skills.forEach((cat, i) => {
    const card = createElement('div', {
      class: 'skill-card',
      role: 'listitem',
      'data-reveal': '',
      'data-reveal-delay': String(Math.min(i % 3 + 1, 4)),
    });

    const tagsHTML = cat.tags.map(tag => {
      const svg = SKILL_ICONS[tag];
      const iconHTML = svg
        ? `<span class="skill-tag__icon" aria-hidden="true">${svg}</span>`
        : '';
      return `<span class="skill-tag">${iconHTML}<span class="skill-tag__label">${tag}</span></span>`;
    }).join('');

    card.innerHTML = `
      <div class="skill-card__icon" aria-hidden="true">${cat.icon}</div>
      <h3 class="skill-card__title">${cat.title}</h3>
      <div class="skill-card__tags" aria-label="${cat.title} skills">
        ${tagsHTML}
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/* ============================================================
   6. PROJECTS RENDERER + FILTER
   ============================================================ */

/**
 * Renders filter tab buttons into #project-filters.
 * @param {typeof PROJECT_FILTERS} filters
 * @param {Function} onFilter - callback(filterValue: string)
 */
function renderProjectFilters(filters, onFilter) {
  const container = $('#project-filters');
  if (!container) return;

  filters.forEach(({ label, value }) => {
    const btn = createElement('button', {
      class: `filter-btn${value === 'all' ? ' active' : ''}`,
      'data-filter': value,
      'aria-pressed': value === 'all' ? 'true' : 'false',
      role: 'tab',
    }, label);

    btn.addEventListener('click', () => {
      // Update active state
      $$('.filter-btn', container).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      onFilter(value);
    });

    container.appendChild(btn);
  });
}

/**
 * Renders project cards into #projects-grid.
 *
 * TO INTEGRATE WITH BACKEND:
 *   Replace the direct call with:
 *     fetch('/api/projects')
 *       .then(r => r.json())
 *       .then(data => renderProjects(data));
 *
 * @param {Project[]} projects
 */
function renderProjects(projects) {
  const grid = $('#projects-grid');
  if (!grid) return;

  grid.innerHTML = ''; // clear before re-render
  const fragment = document.createDocumentFragment();

  projects.forEach((project, i) => {
    const card = createElement('div', {
      class: 'project-card',
      role: 'listitem',
      'data-categories': project.categories.join(' '),
      'data-reveal': '',
      'data-reveal-delay': String(Math.min(i % 3 + 1, 4)),
    });

    // Build links HTML
    const githubLink = project.github
      ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-card__link" aria-label="View ${project.title} on GitHub">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
             <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
           </svg>
           GitHub
         </a>`
      : '';

    const demoLink = project.demo
      ? `<a href="${project.demo}" target="_blank" rel="noopener" class="project-card__link" aria-label="View live demo of ${project.title}">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
             <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
             <polyline points="15 3 21 3 21 9"/>
             <line x1="10" y1="14" x2="21" y2="3"/>
           </svg>
           Demo
         </a>`
      : '';

    const featuredBadge = project.featured
      ? `<span class="project-card__badge">⭐ Featured</span>`
      : '';

    const tagsHTML = project.tags
      .map(t => `<span class="tech-tag">${t}</span>`)
      .join('');

    card.innerHTML = `
      <div class="project-card__header">
        <span class="project-card__icon" aria-hidden="true">${project.icon}</span>
        <div class="project-card__links">
          ${githubLink}
          ${demoLink}
        </div>
      </div>
      <div>
        <h3 class="project-card__title">${project.title}</h3>
        ${featuredBadge}
      </div>
      <p class="project-card__desc">${project.description}</p>
      <div class="project-card__tags" aria-label="Technologies used">
        ${tagsHTML}
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  // Re-run reveal observer on newly created cards
  observeRevealElements();
}

/**
 * Filters project cards by category.
 * Cards not matching the filter get .is-hidden (display:none).
 * @param {string} filterValue
 */
function filterProjects(filterValue) {
  const cards = $$('.project-card', $('#projects-grid'));

  cards.forEach(card => {
    const cats = card.dataset.categories || '';
    const matches = filterValue === 'all' || cats.split(' ').includes(filterValue);
    card.classList.toggle('is-hidden', !matches);
  });
}

/* ============================================================
   7. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */

/** Holds a reference to the reveal observer so we can reuse it. */
let revealObserver = null;

/**
 * Observes all [data-reveal] elements and adds .is-visible
 * when they enter the viewport.
 * Safe to call multiple times — re-observes any new elements.
 */
function observeRevealElements() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
  }

  // Observe any element with [data-reveal] that isn't yet visible
  $$('[data-reveal]:not(.is-visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ============================================================
   8. BACK-TO-TOP BUTTON
   ============================================================ */

/**
 * Shows/hides the back-to-top button based on scroll position.
 * Clicking it scrolls to the top of the page.
 */
function initBackToTop() {
  const btn = $('#back-to-top-btn');
  if (!btn) return;

  const THRESHOLD = 400; // px from top before button appears

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Run once on load
  onScroll();
}

/* ============================================================
   9. CONTACT FORM — validation & submit handler
   ============================================================ */

/**
 * Validates the contact form and handles submission.
 *
 * TO INTEGRATE WITH BACKEND:
 *   In the submitForm() function below, replace the simulated
 *   delay with a real fetch() call:
 *
 *     const response = await fetch('/api/contact', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(payload),
 *     });
 *     if (!response.ok) throw new Error('Server error');
 *
 *   Add CSRF token header if your backend requires it:
 *     headers: { 'X-CSRF-Token': getCsrfToken() }
 */
function initContactForm() {
  const form = $('#contact-form');
  const feedback = $('#form-feedback');
  if (!form || !feedback) return;

  // --- Field references ---
  const nameInput = $('#contact-name');
  const emailInput = $('#contact-email');
  const messageInput = $('#contact-message');
  const submitBtn = $('#contact-submit-btn');

  // --- Validation helpers ---

  /**
   * Show an error message for a field.
   * @param {HTMLElement} input
   * @param {string} errorId - id of the error <span>
   * @param {string} message
   */
  function showError(input, errorId, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const errorEl = $(`#${errorId}`);
    if (errorEl) errorEl.textContent = message;
  }

  /**
   * Clear error state for a field.
   * @param {HTMLElement} input
   * @param {string} errorId
   */
  function clearError(input, errorId) {
    input.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
    const errorEl = $(`#${errorId}`);
    if (errorEl) errorEl.textContent = '';
  }

  /**
   * Validate all required fields.
   * @returns {boolean} true if valid
   */
  function validateForm() {
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'name-error', 'Please enter your name.');
      valid = false;
    } else {
      clearError(nameInput, 'name-error');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError(emailInput, 'email-error', 'Please enter your email address.');
      valid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'email-error', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, 'email-error');
    }

    // Message
    if (!messageInput.value.trim()) {
      showError(messageInput, 'message-error', 'Please enter a message.');
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'message-error', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError(messageInput, 'message-error');
    }

    return valid;
  }

  // Clear errors on input (live feedback)
  nameInput.addEventListener('input', () => clearError(nameInput, 'name-error'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'email-error'));
  messageInput.addEventListener('input', () => clearError(messageInput, 'message-error'));

  /**
   * Submits the contact form payload to the Spring Boot backend.
   * Backend endpoint: POST http://localhost:8080/api/contact
   * @param {Object} payload - { name, email, subject, message }
   * @returns {Promise<string>} - success message from server
   */
  async function submitForm(payload) {
    const response = await fetch('http://localhost:8080/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Server returned validation errors or 500 — surface them
      const messages = Object.values(data).join(' ');
      throw new Error(messages || 'Server error');
    }

    return data.message; // e.g. "Thanks Jane! Your message has been received."
  }

  // --- Form submit handler ---
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Hide any previous feedback
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    if (!validateForm()) return;

    // Collect payload
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: $('#contact-subject')?.value.trim() || '',
      message: messageInput.value.trim(),
    };

    // Disable submit while in-flight
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const serverMsg = await submitForm(payload);

      // Success state — show personalised message from the server
      feedback.textContent = '✓ ' + (serverMsg || 'Message sent! I\'ll get back to you within 24 hours.');
      feedback.className = 'form-feedback is-success';
      form.reset();

    } catch (err) {
      // Error state
      feedback.textContent = '✗ Something went wrong. Please try again or email me directly.';
      feedback.className = 'form-feedback is-error';
      console.error('[Contact Form] Submission error:', err);

    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/* ============================================================
   10. FOOTER — dynamic year
   ============================================================ */

/** Inserts the current year into #footer-year. */
function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   PROJECTS TOGGLE — round button to slide projects open/closed
   ============================================================ */

function initProjectsToggle() {
  const btn = $('#projects-toggle-btn');
  const content = $('#projects-content');
  if (!btn || !content) return;

  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;

    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Hide projects' : 'Show projects');

    if (isOpen) {
      // Measure full height, then animate to it
      content.classList.add('is-open');
      const fullHeight = content.scrollHeight;
      content.style.maxHeight = fullHeight + 'px';
    } else {
      // Collapse: set explicit height first, then shrink to 0
      content.style.maxHeight = content.scrollHeight + 'px';
      // Force reflow so the browser registers the starting value
      content.offsetHeight; // eslint-disable-line no-unused-expressions
      content.style.maxHeight = '0';
      content.classList.remove('is-open');
    }
  });

  // Update max-height on resize when open (so it doesn't clip)
  window.addEventListener('resize', () => {
    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}

/* ============================================================
   11. INIT — wire everything up on DOMContentLoaded
   ============================================================ */

/**
 * Main entry point.
 * Called once the DOM is fully parsed (script is deferred).
 */
function init() {
  // Navigation
  initHamburger();
  initActiveNavLink();

  // Hero
  initTypedText();

  // Render dynamic content from data arrays
  // (swap these for fetch() calls when backend is ready)
  renderSkills(SKILLS_DATA);
  renderProjectFilters(PROJECT_FILTERS, filterProjects);
  renderProjects(PROJECTS_DATA);

  // Scroll behaviours
  observeRevealElements();
  initBackToTop();

  // Projects toggle
  initProjectsToggle();

  // Contact form
  initContactForm();

  // Footer
  initFooterYear();

  // Custom cursor
  initCustomCursor();

  // Background gems
  initGemBackground();

  // Add data-reveal to static HTML sections that aren't
  // dynamically rendered (hero content, about, contact info)
  const staticRevealTargets = [
    '.hero__badge',
    '.hero__name',
    '.hero__title',
    '.hero__tagline',
    '.hero__bio',
    '.hero__actions',
    '.hero__socials',
    '.section__header',
    '.about__visual',
    '.about__content',
    '.contact__info',
    '.contact__form-wrap',
    '.timeline__item',
  ];

  staticRevealTargets.forEach(selector => {
    $$(selector).forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
        // Stagger siblings slightly
        if (i > 0 && i <= 4) {
          el.setAttribute('data-reveal-delay', String(i));
        }
      }
    });
  });

  // Final pass to observe all newly tagged elements
  observeRevealElements();
}

/* ============================================================
   11. CUSTOM CURSOR — Canvas Particle Trail
   ============================================================
   Each mouse movement spawns glowing spark particles that
   drift and fade like a comet tail.
   On click, a burst of extra particles explodes outward.
   A small glowing dot marks the exact pointer position.
   Disabled automatically on touch-only devices.
   ============================================================ */

function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = $('#cursor-canvas');
  const dot = $('#cursor-dot');
  if (!canvas || !dot) return;

  const ctx = canvas.getContext('2d');

  // Resize canvas to fill viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 200);
  });

  // Activate custom cursor (hides default)
  document.body.classList.add('custom-cursor-active');

  let mouseX = -200;
  let mouseY = -200;

  // Particle pool
  const particles = [];

  // Colour palette
  const COLORS = [
    'rgba(108, 142, 255, ',  // accent blue
    'rgba(160, 185, 255, ',  // lighter blue
    'rgba(200, 215, 255, ',  // near-white blue
    'rgba(255, 255, 255, ',  // white spark
  ];

  function spawnParticles(x, y, count, speed, maxR) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vel = (Math.random() * 0.6 + 0.4) * speed;
      const radius = Math.random() * maxR + 1;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x, y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        radius,
        alpha: Math.random() * 0.5 + 0.5,
        decay: Math.random() * 0.03 + 0.02,   // faster fade (was 0.012–0.030)
        color,
      });
    }
  }

  // Track mouse — with throttle
  let lastSpawn = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // DOM update moved to animate() loop for performance
    document.body.classList.remove('cursor-hidden');

    const now = Date.now();
    if (now - lastSpawn > 40) { // Increased throttle to 40ms
      spawnParticles(mouseX, mouseY, 2, 3.5, 3); // Slightly fewer particles per spawn
      lastSpawn = now;
    }
  });

  // Click burst
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-clicking');
    spawnParticles(mouseX, mouseY, 22, 8, 5);  // bigger burst
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-clicking');
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-hidden');
  });

  // Hover state on interactive elements
  const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .filter-btn, .social-link, .project-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hovering');
  });

  // Animation loop (Throttled to ~30 FPS for performance)
  let lastTime = 0;
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed < 32) { // Skip frame if less than ~33ms (target 30fps)
      requestAnimationFrame(animate);
      return;
    }
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update dot position using transform (GPU accelerated)
    // Centering handled by CSS margin or translate if needed.
    // Assuming top-left anchor, but if dot is small it's fine.
    // If CSS has translate(-50%, -50%), we append:
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.88;  // less friction = travels further before stopping (was 0.94)
      p.vy *= 0.88;
      p.alpha -= p.decay;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      // Radial gradient glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
      g.addColorStop(0, p.color + p.alpha + ')');
      g.addColorStop(0.5, p.color + (p.alpha * 0.4) + ')');
      g.addColorStop(1, p.color + '0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ============================================================
   12. BACKGROUND ANIMATION — Floating Gems
   ============================================================ */
function initGemBackground() {
  const container = document.getElementById('gems-container');
  if (!container) return;

  // Clear existing (if any)
  container.innerHTML = '';

  const gemCount = 15; // Reduced from 30 for performance
  const gemSrc = 'assets/gem.png';

  for (let i = 0; i < gemCount; i++) {
    const gem = document.createElement('img');
    gem.src = gemSrc;
    gem.classList.add('bg-gem');
    gem.alt = '';

    // Random Properties
    const size = Math.random() * 25 + 15; // 15px to 40px

    // Force balanced distribution with center fill
    let startX;
    if (i % 3 === 0) {
      // Left side (0-15%)
      startX = Math.random() * 15;
    } else if (i % 3 === 1) {
      // Right side (85-100%)
      startX = Math.random() * 15 + 85;
    } else {
      // Center zone (15-85%)
      startX = Math.random() * 70 + 15;
    }

    const startY = Math.random() * 100;
    const duration = Math.random() * 20 + 20; // 20s to 40s
    const delay = Math.random() * -40; // Start at random point in cycle
    const isReverse = Math.random() > 0.5;

    gem.style.width = `${size}px`;
    gem.style.left = `${startX}%`;
    gem.style.top = `${startY}%`;
    gem.style.animationDuration = `${duration}s`;
    gem.style.animationDelay = `${delay}s`;
    gem.style.opacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5

    if (isReverse) {
      gem.style.animationDirection = 'reverse';
    }

    container.appendChild(gem);
  }
}

// Run after DOM is ready (script is deferred, so this fires immediately)
document.addEventListener('DOMContentLoaded', init);
