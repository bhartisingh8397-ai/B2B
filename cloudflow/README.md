# CloudFlow CRM - Enterprise B2B SaaS Marketing Website

Production-ready, ultra-modern, responsive marketing website for **CloudFlow CRM**, a fictional next-generation AI-powered B2B CRM company. Built from scratch with pure HTML5, CSS3, and Vanilla JavaScript.

Designed to emulate the high-end visual aesthetic of top software agency projects (e.g. Stripe, Linear, Vercel).

---

## 🚀 Key Features & Highlights

- **Zero External CSS/JS Libraries**: Crafted using Vanilla CSS3 design system tokens and modular JavaScript. No Tailwind, Bootstrap, or jQuery.
- **Glassmorphism & Micro-Gradients**: Modern dark theme background (`#0B0F19`), frosted glass cards with `backdrop-filter`, and vibrant electric indigo/cyan glowing accents (`#6366F1` & `#06B6D4`).
- **Interactive UI Components**:
  - **Sticky Navbar**: Blur backdrop header on scroll with active path indicators.
  - **Mobile Drawer Navigation**: Slide-out mobile navigation drawer with trap focus, aria attributes, and keyboard Escape key listener.
  - **Interactive Product Tab Switcher**: Switch between Pipeline Management, Sales AI, and Executive Analytics views without page reload.
  - **Billing Switcher**: Interactive Monthly vs Annual billing toggle with real-time price calculations (-20% discount).
  - **Accordions**: Accessible FAQ accordion panels with smooth height expansion.
  - **Contact Form Validation**: Real-time client-side form validation with success/error feedback.
  - **Counter Animations**: Animated metric numbers triggering upon scroll into viewport.
  - **Back-to-Top**: Smooth scrolling back-to-top button.
- **Mandatory Footer Attribution**: Every page footer contains: `"Built for Digital Heroes Training Task"` linked to `https://digitalheroesco.com`.

---

## 📂 Project Directory Structure

```
cloudflow/
├── index.html          # Home Page (Hero, Marquee, Features, Product Preview, Benefits, Testimonials, FAQ, CTA, Footer)
├── product.html        # Product Page (Overview, Dashboard Mockup, Core Modules, Integrations Directory, Workflow Builder)
├── pricing.html        # Pricing Page (Starter, Professional, Enterprise, Monthly/Annual Switcher, Feature Comparison Table)
├── contact.html        # Contact Page (Validated Form, Support Cards, Office Hours, Styled Google Maps, Social Links)
├── css/
│   ├── style.css       # Design System Tokens, Variables, Glassmorphism, Components & Keyframes
│   └── responsive.css  # Responsive Media Queries (Desktop, Tablet, Mobile Breakpoints)
├── js/
│   └── script.js       # Sticky Navbar, Drawer, Scroll Animations, Tabs, Accordions, Billing Toggle & Validation
├── favicon.svg         # Vector Brand Favicon
├── favicon.ico         # Legacy Favicon Fallback
├── robots.txt          # Search Engine Crawler Guidance
├── sitemap.xml         # XML Sitemap for Search Indexing
└── README.md           # Documentation & Project Overview
```

---

## 🎨 Design System Tokens

```css
:root {
  --bg-dark: #0b0f19;
  --bg-dark-elevated: #111827;
  --bg-card: rgba(17, 24, 39, 0.7);
  --primary: #6366f1;         /* Indigo */
  --secondary: #06b6d4;       /* Cyan */
  --accent-purple: #a855f7;    /* Purple */
  --grad-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  --font-family: 'Plus Jakarta Sans', sans-serif;
}
```

---

## 🔍 SEO & Accessibility Implementation

1. **Structured Data (JSON-LD)**:
   - `Organization` & `SoftwareApplication` schemas embedded on `index.html`.
   - `OfferCatalog` & `Product` schemas embedded on `pricing.html`.
   - `ContactPage` schema embedded on `contact.html`.
2. **Metadata & Social Sharing**:
   - Unique `<title>` and `<meta name="description">` per page.
   - Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and Twitter Cards (`summary_large_image`).
   - Canonical URLs (`<link rel="canonical">`).
3. **Accessibility (WCAG 2.1 AAA/AA Compliance)**:
   - Explicit `:focus-visible` ring styling for keyboard focus navigation.
   - ARIA roles (`role="tab"`, `role="navigation"`, `role="contentinfo"`, `aria-expanded`, `aria-controls`, `aria-hidden`).
   - High contrast text ratios on dark backgrounds.

---

## ⚡ Performance Optimization & Web Vitals

- **Lighthouse Score Target**: > 95 Across Performance, Accessibility, Best Practices, and SEO.
- Native `loading="lazy"` on media assets.
- Hardware-accelerated CSS transforms for `@keyframes` and scroll effects.
- Minification-ready clean modular code.

---

## 🛠️ How to View Locally

Simply open `index.html` in any web browser or launch a local web server:

```bash
# Using Python builtin server
python -m http.server 8000

# Or using Node.js npx serve
npx serve .
```

Navigate to `http://localhost:8000` to view the website.
