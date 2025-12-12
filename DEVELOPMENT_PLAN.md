# Hamster Innovations - Website Development Plan

## Project Overview

This is a modern, dark-themed company website for **Hamster Innovations** featuring stunning animations, a Bento Grid solutions showcase, and stacked cards displaying core features. The design follows modern web development best practices for 2025 with emphasis on performance, accessibility, and user experience.

**Company Promise:** "From Idea to Interface - We build what you Imagine"

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Design System](#design-system)
4. [Animation Specifications](#animation-specifications)
5. [Bento Grid Implementation](#bento-grid-implementation)
6. [Stacked Cards Animation](#stacked-cards-animation)
7. [Development Workflow](#development-workflow)
8. [Optimization Guidelines](#optimization-guidelines)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Testing Checklist](#testing-checklist)
11. [Next Steps](#next-steps)

---

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Modern features (Grid, Flexbox, Custom Properties, Animations)
- **JavaScript (ES6+)**: Vanilla JS with modern APIs

### Key Libraries & APIs
- **Intersection Observer API**: For scroll-based animations
- **RequestAnimationFrame**: For smooth 60fps animations
- **CSS Grid**: For Bento Grid layout
- **CSS Sticky Positioning**: For stacked cards effect

### Optional Enhancements
- **GSAP**: For more complex animations (if needed later)
- **Lottie**: For vector animations (if needed later)

---

## Project Structure

```
Website/
├── index.html                 # Main HTML file
├── css/
│   ├── main.css              # Core styles and layout
│   ├── animations.css        # All animation definitions
│   └── responsive.css        # Mobile-first responsive styles
├── js/
│   ├── main.js              # Core functionality
│   ├── animations.js        # Animation controllers
│   └── utils.js             # Helper functions
├── assets/
│   ├── background.jpg       # Dark blue bokeh background
│   ├── images/              # Project images, photos
│   └── icons/               # SVG icons
└── DEVELOPMENT_PLAN.md      # This file
```

---

## Design System

### Color Palette

```css
/* Dark Blue Theme */
--color-bg-dark: #0a1628      /* Main background */
--color-bg-darker: #050d18    /* Deeper background */
--color-primary: #4a90e2      /* Primary blue */
--color-secondary: #6b5dd1    /* Purple accent */
--color-accent-pink: #d946d9  /* Pink highlight */
--color-accent-purple: #9b4dca /* Purple highlight */

/* Text Colors */
--color-text-primary: #ffffff
--color-text-secondary: #b8c5d6
--color-text-muted: #7a8ba3
```

### Typography

- **Primary Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Heading Font**: Segoe UI, system-ui
- **Font Sizes**: Fluid scale from 0.875rem to 3.5rem

### Spacing Scale

```css
--spacing-xs: 0.5rem   (8px)
--spacing-sm: 1rem     (16px)
--spacing-md: 1.5rem   (24px)
--spacing-lg: 2rem     (32px)
--spacing-xl: 3rem     (48px)
--spacing-2xl: 4rem    (64px)
--spacing-3xl: 6rem    (96px)
```

---

## Animation Specifications

Based on the Web.md guidelines, all animations follow these principles:

### 1. Dynamic Background Animation

**Bokeh Elements:**
- 4 bokeh circles with varying sizes (350px - 500px)
- Colors: Primary blue, pink, purple
- Opacity: 0.15 (15%)
- Blur: 80px

**Animations:**
- **Drift Animation**: 30s duration, cubic-bezier(0.4, 0.0, 0.2, 1)
  - Translate range: ±6-12px
  - Scale range: 0.98-1.03

- **Hue Shift**: 40s duration
  - Hue rotation: ±6 degrees
  - Very subtle color variation

- **Pointer Parallax**: Mouse-reactive
  - Max offset: 8-20px
  - Smoothing factor: 0.12 (lerp)

### 2. Micro-interactions

**Button Hover:**
- Scale: 1.02
- Glow: box-shadow with opacity 0.12-0.18
- Duration: 180ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)

**Button Press:**
- Scale: 0.98
- Duration: 120-160ms

**Error Shake:**
- TranslateX: ±6-10px
- Oscillations: 3-4
- Duration: 360-420ms

### 3. Scroll-based Reveals

**Pattern:**
- Fade: 0 → 1
- TranslateY: 16px → 0
- Duration: 700ms
- Stagger: 80-120ms between elements

**Parallax Depth:**
- Foreground: 0.9x scroll speed
- Mid-ground: 0.6x scroll speed
- Background: 0.3x scroll speed

### 4. Typography Animations

**Hero Headline:**
- Staggered word reveal
- Fade + translateY(12px)
- Total duration: 900ms

**Section Headings:**
- Fade + scale(0.98 → 1.0)
- Duration: 600ms

### 5. Performance Requirements

**GPU-Accelerated Properties Only:**
- ✅ transform (translate3d, scale, rotate)
- ✅ opacity
- ✅ filter (limited use)

**Avoid:**
- ❌ width, height
- ❌ left, top, right, bottom
- ❌ margin, padding (for animations)

---

## Bento Grid Implementation

### What is a Bento Grid?

A Bento Grid is a modular layout system inspired by Japanese bento boxes, featuring:
- Asymmetric card sizes
- Clean, organized presentation
- Mix of content types (text, images, stats, videos)

### Grid Structure

```css
.bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    grid-auto-rows: 200px;
}
```

### Card Sizes

- **Large**: 2 columns × 2 rows (featured content)
- **Medium**: 2 columns × 1 row (services/skills)
- **Small**: 1 column × 1 row (stats/metrics)
- **Wide**: 4 columns × 1 row (media content)

### Content Types

1. **Featured Project** (Large card)
   - Title, description, link
   - Image or video background

2. **Skills/Services** (Medium cards)
   - Icon, heading, description
   - Hover effects with glow

3. **Statistics** (Small cards)
   - Large number, label
   - Gradient text effect

4. **Media** (Wide card)
   - Video or image showcase
   - Placeholder for now

### Responsive Behavior

- **Desktop (>1024px)**: 4 columns
- **Tablet (640-1024px)**: 2 columns
- **Mobile (<640px)**: 1 column (stacks naturally)

---

## Stacked Cards Animation

### Concept

Cards start stacked on top of each other. As the user scrolls through the section, they spread out one by one, revealing their content.

### Implementation Strategy

#### 1. CSS Sticky Positioning

```css
.stack-card {
    position: sticky;
    top: 120px;
    height: 500px;
}
```

Each card "sticks" to the top as you scroll, creating the stacking effect.

#### 2. JavaScript Scroll Calculation

```javascript
// Calculate scroll progress through section
const scrollProgress = (scrollY - sectionTop) / sectionHeight;

// For each card:
const cardProgress = clamp(scrollProgress * cards.length - index, 0, 1);

// Apply transforms
const scale = 0.94 + (cardProgress * 0.06);  // 0.94 → 1.0
const translateY = (1 - cardProgress) * -20;
const opacity = 0.5 + (cardProgress * 0.5);
```

#### 3. Visual States

- **Stacked**: scale(0.94-0.98), slight Y offset
- **Spreading**: scale increases to 1.0, Y returns to 0
- **Passed**: scale(0.92), translateY(-20px), opacity(0.5)

### Card Content Structure

Each card contains:
- Image/visual placeholder
- Project title
- Description
- Technology tags
- Grid layout: 2 columns (image | content)

### Mobile Adaptation

On mobile (<640px):
- Disable sticky positioning
- Stack naturally with margin
- Full opacity and scale
- Simpler layout (1 column)

---

## Development Workflow

### Phase 1: Setup & Structure ✅ COMPLETED

- [x] Create folder structure
- [x] Set up HTML boilerplate
- [x] Create CSS architecture
- [x] Set up JavaScript modules
- [ ] Add background image to assets folder

### Phase 2: Core Styling

1. Implement base styles (colors, typography, spacing)
2. Build navigation component
3. Style hero section
4. Create reusable components (buttons, cards)

### Phase 3: Section Development

1. **Hero Section**
   - Animated headline with word reveal
   - CTA buttons with hover effects
   - Scroll indicator

2. **About Section**
   - Two-column layout
   - Fade-up animations
   - Parallax effects

3. **Bento Grid Section**
   - CSS Grid layout
   - Card hover interactions
   - Staggered reveal animations

4. **Stacked Cards Section**
   - Sticky positioning
   - Scroll-based transforms
   - Smooth transitions

### Phase 4: Animations

1. Background bokeh animations
2. Pointer parallax system
3. Scroll reveal with Intersection Observer
4. Micro-interactions on all interactive elements
5. Page transitions
6. Mobile menu animations

### Phase 5: Optimization

1. Minify CSS and JavaScript
2. Optimize images (WebP format)
3. Lazy load images
4. Test Core Web Vitals
5. Cross-browser testing
6. Accessibility audit

---

## Optimization Guidelines

### Performance Budget

- **Target Metrics:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Image Optimization

```bash
# Convert images to WebP
# Use responsive images with srcset
<img src="image.jpg"
     srcset="image-400.webp 400w,
             image-800.webp 800w,
             image-1200.webp 1200w"
     alt="Description">
```

### CSS Optimization

- Use CSS Custom Properties for theming
- Avoid layout-triggering properties in animations
- Use `will-change` sparingly and remove after animation
- Minimize selector complexity

### JavaScript Optimization

- Use Intersection Observer instead of scroll listeners
- Throttle/debounce expensive operations
- Use requestAnimationFrame for animations
- Lazy load non-critical scripts

### Loading Strategy

1. **Critical CSS**: Inline above-the-fold styles
2. **Defer JavaScript**: Load scripts with `defer` attribute
3. **Lazy Load**: Images below the fold
4. **Preconnect**: To external resources

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

#### 1. Keyboard Navigation

- All interactive elements accessible via Tab
- Visible focus indicators (2px outline)
- Logical tab order
- ESC to close modals/menus

#### 2. Screen Readers

```html
<!-- Semantic HTML -->
<nav aria-label="Main navigation">
<button aria-label="Toggle menu" aria-expanded="false">
<section aria-labelledby="section-heading">
```

#### 3. Color Contrast

- Text on background: Minimum 4.5:1
- Large text: Minimum 3:1
- Interactive elements: Visible in high contrast mode

#### 4. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

#### 5. Animation Toggle

- Provide manual toggle button
- Respect system preferences
- Static fallback for all animations

#### 6. Focus Management

- Never remove focus outlines without replacement
- Trap focus in modals
- Return focus after interactions

---

## Testing Checklist

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing

- [ ] Desktop (1920×1080, 1440×900)
- [ ] Laptop (1366×768)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667, 414×896)

### Performance Testing

- [ ] Lighthouse audit (95+ score)
- [ ] Core Web Vitals pass
- [ ] Network throttling (3G)
- [ ] CPU throttling (4x slowdown)

### Accessibility Testing

- [ ] Keyboard navigation only
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast checker
- [ ] Reduced motion preference
- [ ] High contrast mode
- [ ] Text zoom to 200%

### Functionality Testing

- [ ] All links work
- [ ] Navigation smooth scrolls
- [ ] Mobile menu toggles
- [ ] Animations trigger correctly
- [ ] Forms validate and submit
- [ ] Scroll animations perform smoothly

---

## Next Steps

### Immediate Actions

1. **Add Background Image**
   - Copy the provided background image to `assets/background.jpg`
   - Verify it displays correctly

2. **Content Population**
   - Replace placeholder text with your content
   - Add your project images
   - Update project descriptions
   - Add your personal information

3. **Customization**
   - Adjust color scheme if desired
   - Modify animation timings to preference
   - Add/remove sections as needed

### Enhancement Ideas

#### Short-term (Week 1-2)

- [ ] Add contact form with validation
- [ ] Implement scroll progress indicator
- [ ] Add loading screen animation
- [ ] Create custom cursor effect
- [ ] Add particles.js background layer

#### Medium-term (Week 3-4)

- [ ] Add project detail modals/pages
- [ ] Implement filtering for projects
- [ ] Add testimonials section
- [ ] Create skills visualization
- [ ] Add blog/article section

#### Long-term (Month 2+)

- [ ] Implement dark/light theme toggle
- [ ] Add internationalization (i18n)
- [ ] Create CMS integration
- [ ] Add analytics tracking
- [ ] Build contact form backend
- [ ] Set up CI/CD pipeline

---

## Resources & References

### Web Development Best Practices 2025

- **Performance**: Minify files, use CDN, lazy load assets
- **SEO**: Semantic HTML, meta tags, structured data
- **Security**: HTTPS, CSP headers, sanitize inputs
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Bento Grid Resources

- **Inspiration**: bentogrids.com, dribbble.com/tags/bento-grids
- **Examples**: Framer, Supabase, Apple promotional pages
- **Best Practices**:
  - Consistent gap spacing (16-24px)
  - Balance asymmetry with visual weight
  - Use bold typography
  - Mobile-friendly stacking

### Animation Resources

- **CSS Tricks**: css-tricks.com/stacked-cards-with-sticky-positioning
- **Scroll-driven Animations**: scroll-driven-animations.style
- **Performance**: Use GPU-accelerated properties only
- **Easing**: cubic-bezier.com for custom easing curves

### Modern CSS Features

- **CSS Grid**: Complete layout control
- **CSS Custom Properties**: Dynamic theming
- **CSS Scroll Snap**: Smooth section scrolling
- **Container Queries**: Component-level responsiveness (future)

---

## Technical Notes

### Browser Support

- **Modern browsers**: Full support for all features
- **IE11**: Not supported (uses modern CSS/JS)
- **Fallbacks**: Provided for older browsers where critical

### File Size Targets

- **HTML**: < 50KB
- **CSS (combined)**: < 100KB (< 20KB minified + gzipped)
- **JavaScript (combined)**: < 150KB (< 40KB minified + gzipped)
- **Images**: Use WebP, max 500KB per image

### Development Tools

**Recommended:**
- VS Code with Live Server extension
- Chrome DevTools for debugging
- Lighthouse for performance testing
- axe DevTools for accessibility testing

**Build Tools (optional):**
- PostCSS for autoprefixer
- Terser for JS minification
- cssnano for CSS minification

---

## Animation Configuration Object

The `animationConfig` object in `utils.js` allows you to tune all animation parameters without changing the code:

```javascript
const animationConfig = {
    timing: {
        fast: 120,      // Button press
        quick: 180,     // Micro-interactions
        normal: 360,    // Menu animations
        slow: 500,      // Page transitions
        verySlow: 700,  // Scroll reveals
        drift: 30000,   // Bokeh drift
        hue: 40000      // Hue shift
    },

    amplitude: {
        scaleHover: 1.02,
        scalePress: 0.98,
        translateReveal: 16,
        glowOpacity: 0.15
    },

    parallax: {
        foreground: 0.9,
        mid: 0.6,
        background: 0.3,
        maxOffset: 20,
        smoothing: 0.12
    }
};
```

Adjust these values to customize the feel of animations.

---

## Troubleshooting

### Common Issues

**1. Animations not working**
- Check console for JavaScript errors
- Verify Intersection Observer is supported
- Check if reduced motion is enabled
- Ensure elements have `data-animate` attributes

**2. Stacked cards not sticking**
- Verify parent has sufficient height
- Check `position: sticky` browser support
- Ensure `top` value is set
- Check z-index stacking context

**3. Performance issues**
- Use Chrome DevTools Performance tab
- Check for layout thrashing
- Reduce parallax smoothing factor
- Disable expensive animations on low-end devices

**4. Layout breaks on mobile**
- Test responsive styles in DevTools
- Check viewport meta tag
- Verify media queries
- Test on actual devices

---

## Contact & Support

For questions or issues with this template:

1. Check the browser console for errors
2. Verify all files are properly linked
3. Review the code comments for guidance
4. Test in different browsers

---

## License & Credits

**Created**: November 2025
**Version**: 1.0.0
**Built with**: HTML, CSS, JavaScript (Vanilla)

### Credits

- **Design Inspiration**: Modern portfolio trends, Bento Grid layouts
- **Animation Guidelines**: Based on Web.md specifications
- **Icons**: Custom SVG icons (expandable)
- **Fonts**: System fonts for optimal performance

---

## Changelog

### Version 1.0.0 (2025-11-02)
- ✅ Initial project setup
- ✅ Complete HTML structure
- ✅ Full CSS implementation (main, animations, responsive)
- ✅ JavaScript modules (utils, animations, main)
- ✅ Bento Grid section
- ✅ Stacked cards section
- ✅ Bokeh background system
- ✅ Accessibility features
- ✅ Mobile responsive design
- ✅ Development documentation

---

**Ready to build something amazing! 🚀**
