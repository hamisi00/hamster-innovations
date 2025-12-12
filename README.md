# Hamster Innovations - Company Website

**"From Idea to Interface - We build what you Imagine"**

A stunning, dark-themed company website for Hamster Innovations featuring:
- Dark blue bokeh animated background
- Bento Grid solutions showcase
- Stacked cards displaying core features
- Smooth micro-interactions
- Full accessibility support
- Mobile-first responsive design

## About Hamster Innovations

Hamster Innovations is a software development and technology services company that turns messy operational workflows into reliable, desktop-first applications. We build web and mobile systems for businesses that need to manage records, run transactions, and generate clear analytics — from retail shops to gyms, clinics, and beyond.

## Quick Start

1. **Assets are ready:**
   - ✅ Background image: `assets/background.jpg`
   - ✅ Logo: `assets/Logo design.png`
   - ✅ Icon: `assets/Icon.ico`

2. **Open the website:**
   - Simply open `index.html` in a modern browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve

     # Using VS Code
     # Install "Live Server" extension and click "Go Live"
     ```

3. **Customize content:**
   - Update company details in `index.html`
   - Add feature screenshots to `assets/images/`
   - Modify colors in `css/main.css` (CSS variables at top)

## File Structure

```
Website/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Core styles
│   ├── animations.css     # Animation definitions
│   └── responsive.css     # Mobile responsive styles
├── js/
│   ├── main.js           # Core functionality
│   ├── animations.js     # Animation controllers
│   └── utils.js          # Helper functions
├── assets/
│   ├── background.jpg    # Dark blue bokeh background
│   ├── Logo design.png   # Company logo
│   ├── Icon.ico          # Favicon
│   └── images/           # Feature screenshots (optional)
├── DEVELOPMENT_PLAN.md   # Complete development guide
└── README.md            # This file
```

## Website Features

### 🎨 Animations
- Bokeh background with drift and hue shift
- Pointer-reactive parallax
- Scroll-triggered reveals
- Micro-interactions on all interactive elements
- Stacked cards spread animation

### 📦 Package Tiers Showcase
- Demo (30-day trial)
- Basic (Essential features)
- Standard (+ Google Sheets)
- Pro (+ Email integration)
- Updates & Add-ons

### ✨ Core Features Display
- Security & Access Control
- Transactions & Payments (MPESA + Cards)
- Reports & Analytics
- Offline-First Architecture

### 📱 Responsive
- Mobile-first design
- Breakpoints: 375px, 640px, 1024px, 1280px
- Touch-optimized interactions
- Adaptive layouts

### ♿ Accessible
- WCAG 2.1 Level AA compliant
- Keyboard navigation
- Screen reader support
- Reduced motion support
- High contrast mode support

### ⚡ Performance
- GPU-accelerated animations
- Lazy loading images
- Intersection Observer for scroll effects
- Optimized for Core Web Vitals

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit CSS variables in `css/main.css`:
```css
:root {
    --color-primary: #4a90e2;
    --color-secondary: #6b5dd1;
    /* ... more colors */
}
```

### Animation Speed
Edit configuration in `js/utils.js`:
```javascript
const animationConfig = {
    timing: {
        quick: 180,  // Adjust timing
        /* ... */
    }
};
```

## Documentation

See `DEVELOPMENT_PLAN.md` for:
- Complete technical specifications
- Animation guidelines
- Bento Grid implementation details
- Stacked cards animation logic
- Development workflow
- Testing checklist
- Enhancement ideas

## Performance Targets

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: 95+

## Next Steps

1. ✅ All assets are in place (background, logo, icon)
2. Review and customize content in `index.html`
3. Add feature screenshots to `assets/images/` (optional)
4. Test on different devices and browsers
5. Deploy to your hosting platform (Netlify, Vercel, GitHub Pages, etc.)

## License

© 2025 Hamster Innovations. All rights reserved.

---

**Built with ❤️ using HTML, CSS, and JavaScript**
**"From Idea to Interface - We build what you Imagine"**
