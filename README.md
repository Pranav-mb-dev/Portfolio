# Alex Morgan — Portfolio Website

A minimal, dark-themed, fully responsive portfolio for a backend-focused software engineer.
Built with **plain HTML, CSS, and vanilla JavaScript** — zero dependencies, zero build step.

---

## 📁 Folder Structure

```
Portfolio/
├── index.html        # Semantic HTML — all sections
├── styles.css        # Design tokens + mobile-first styles
├── script.js         # All interactivity + data rendering
├── assets/           # Static files (resume PDF, favicon, photos)
│   ├── resume.pdf    ← add your resume here
│   └── favicon.ico   ← add your favicon here
└── README.md
```

---

## 🚀 Running Locally

No build step required. Just open `index.html` in a browser, or serve it with any static file server:

```bash
# Python (built-in)
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

---

## ✏️ Customisation Guide

### Personal Details
Edit `index.html` directly:
- **Name** — search for `Alex Morgan` and replace
- **Email** — search for `alex@example.com`
- **GitHub / LinkedIn URLs** — update `href` attributes in the hero and contact sections
- **Experience timeline** — update the `<ol class="timeline__list">` entries in the About section
- **Photo** — replace the `.about__photo-placeholder` div with an `<img>` tag pointing to your photo in `assets/`

### Skills & Projects
All data lives in `script.js` at the top of the file:

```js
const SKILLS_DATA = [ ... ];   // skill categories + tags
const PROJECTS_DATA = [ ... ]; // project cards
const PROJECT_FILTERS = [ ... ]; // filter tab labels
const TYPED_PHRASES = [ ... ];   // hero tagline cycling text
```

Edit these arrays — the page re-renders automatically.

### Colours / Theme
All design tokens are CSS custom properties in `styles.css` under **section 1**:

```css
:root {
  --clr-accent: #6c8eff;   /* change this to retheme the whole site */
  --clr-bg:     #0d0f14;
  /* ... */
}
```

---

## 🔌 Backend Integration Points

The site is structured so adding a real backend is straightforward.

| Feature | File | What to change |
|---|---|---|
| Skills data | `script.js` → `renderSkills()` | Replace `renderSkills(SKILLS_DATA)` with `fetch('/api/skills').then(r=>r.json()).then(renderSkills)` |
| Projects data | `script.js` → `renderProjects()` | Same pattern with `/api/projects` |
| Contact form | `script.js` → `submitForm()` | Replace the simulated delay with a real `fetch('/api/contact', { method:'POST', ... })` |

Each integration point has a detailed comment block in `script.js`.

---

## ♿ Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- Skip-to-content link for keyboard users
- All interactive elements have descriptive `aria-label` attributes
- `aria-live` regions for dynamic content (typed text, form feedback)
- `aria-expanded` / `aria-hidden` on the mobile menu
- Respects `prefers-reduced-motion` — all animations disabled for users who prefer it
- WCAG AA contrast ratios throughout

---

## 📱 Responsive Breakpoints

| Breakpoint | Columns |
|---|---|
| `< 640px` (mobile) | 1 column |
| `≥ 640px` (tablet) | 2 columns |
| `≥ 1024px` (desktop) | 3 columns, side-by-side layouts |

---

## 📄 License

MIT — use freely for your own portfolio.
