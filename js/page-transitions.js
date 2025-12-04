/**
 * Page Transition System - Parallelogram Mask Reveal
 * Based on Ma Sài Gòn Space effect
 */

class PageTransition {
    constructor() {
        this.mask = null;
        this.isTransitioning = false;
        this.currentContentUrl = window.location.href;
        this.supportsViewTransition = 'startViewTransition' in document;

        // Mobile detection - use CSS transition on mobile, JS animation on desktop
        this.isMobile = window.matchMedia('(max-width: 1023px)').matches;

        // Listen for viewport changes (orientation/resize)
        window.matchMedia('(max-width: 1023px)').addEventListener('change', (e) => {
            this.isMobile = e.matches;
        });

        this.init();
    }

    init() {
        // Create mask element
        this.createMask();

        // Intercept navigation clicks
        this.setupNavigationInterception();

        // Set initial history state with current URL
        if (!window.history.state || !window.history.state.url) {
            window.history.replaceState({ url: window.location.href }, '', window.location.href);
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            // When popstate fires, URL has already changed - we need to update content
            const targetUrl = window.location.href;

            // Always navigate on popstate to sync content with URL
            // pushState=false because URL is already updated by browser
            this.navigateToPage(targetUrl, false);
        });

        // Check if this is a navigation (not initial page load)
        const isNavigation = window.performance &&
                           window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD ||
                           sessionStorage.getItem('pageTransitionNavigating') === 'true';

        if (isNavigation) {
            // Play entrance animation if arriving from navigation
            sessionStorage.removeItem('pageTransitionNavigating');
            this.playEntranceAnimation();
        } else {
            // Initial page load - start with content visible
            this.mask.classList.add('revealed');
            this.mask.classList.remove('active', 'covered');
        }
    }

    createMask() {
        this.mask = document.createElement('div');
        this.mask.className = 'page-transition-mask revealed';
        document.body.appendChild(this.mask);
    }

    setupNavigationInterception() {
        document.addEventListener('click', (e) => {
            // Check for product card links, logo links, or footer links
            const productLink = e.target.closest('a.cascading-card');
            const logoLink = e.target.closest('a.logo-link');
            const footerLink = e.target.closest('.footer-links a');

            const link = productLink || logoLink || footerLink;

            if (link && link.href && !link.target && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                // Only intercept same-origin links to different pages
                const url = new URL(link.href);
                if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
                    e.preventDefault();
                    this.navigateToPage(link.href, true);
                }
            }
        });
    }

    async navigateToPage(url, pushState = true) {
        if (this.isTransitioning) return;

        // Normalize URLs for comparison (remove trailing slashes, fragments)
        const normalizedUrl = url.split('#')[0].replace(/\/$/, '');
        const normalizedCurrent = this.currentContentUrl.split('#')[0].replace(/\/$/, '');

        // Skip if already showing this content
        if (normalizedUrl === normalizedCurrent) return;

        this.isTransitioning = true;

        try {
            // Mark that we're navigating
            sessionStorage.setItem('pageTransitionNavigating', 'true');

            // Play exit animation
            await this.playExitAnimation();

            // Navigate based on browser support
            if (this.supportsViewTransition && pushState) {
                await this.navigateWithViewTransition(url);
            } else {
                await this.navigateWithAJAX(url, pushState);
            }

            // Update current content URL
            this.currentContentUrl = url;

            // Play entrance animation
            await this.playEntranceAnimation();
        } catch (error) {
            console.error('Transition error:', error);
            // Fallback to traditional navigation
            sessionStorage.setItem('pageTransitionNavigating', 'true');
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    async navigateWithViewTransition(url) {
        const transition = document.startViewTransition(async () => {
            await this.updateContent(url);
        });

        await transition.finished;
    }

    async navigateWithAJAX(url, pushState) {
        // Fetch new page
        const response = await fetch(url);
        const html = await response.text();

        // Parse HTML
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        // Update content
        await this.updateContent(url, newDoc, pushState);
    }

    async updateContent(url, newDoc = null, pushState = true) {
        if (!newDoc) {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            newDoc = parser.parseFromString(html, 'text/html');
        }

        // Update title
        document.title = newDoc.title;

        // Update main content (everything except mask)
        const oldContent = document.querySelector('body');
        const newContent = newDoc.querySelector('body');

        // Preserve the mask element
        const maskElement = this.mask;

        // Replace body content
        Array.from(oldContent.children).forEach(child => {
            if (child !== maskElement) {
                child.remove();
            }
        });

        Array.from(newContent.children).forEach(child => {
            if (!child.classList.contains('page-transition-mask')) {
                oldContent.appendChild(child.cloneNode(true));
            }
        });

        // Re-initialize scripts
        this.reinitializeScripts();

        // Update URL
        if (pushState) {
            window.history.pushState({ url }, '', url);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    reinitializeScripts() {
        // Clean up animations before reinitializing
        if (window.AnimationController && window.AnimationController.cleanup) {
            window.AnimationController.cleanup();
        }

        // Re-run main.js initialization if it exists
        if (typeof window.initializeWebsite === 'function') {
            try {
                window.initializeWebsite();
            } catch (error) {
                console.error('Error reinitializing website:', error);
            }
        }

        // Reinitialize animations.js if it exists
        if (typeof window.initializeAnimations === 'function') {
            try {
                window.initializeAnimations();
            } catch (error) {
                console.error('Error reinitializing animations:', error);
            }
        }

        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('pageTransitionComplete'));
    }

    /**
     * Exit Animation - Cover screen (expand from center to corners)
     */
    async playExitAnimation() {
        return new Promise((resolve) => {
            this.mask.classList.add('active');
            this.mask.classList.remove('revealed', 'covered');

            // Animate vertices with platform-specific timing
            if (this.isMobile) {
                // Mobile: Simplified 2-vertex diagonal sweep (400ms)
                this.animateVerticesMobile('cover', () => {
                    this.mask.classList.add('covered');
                    resolve();
                });
            } else {
                // Desktop: Complex 4-vertex parallelogram (1200ms)
                this.animateVertices('cover', () => {
                    this.mask.classList.add('covered');
                    resolve();
                });
            }
        });
    }

    /**
     * Entrance Animation - Reveal content (collapse from corners to center)
     */
    async playEntranceAnimation() {
        return new Promise((resolve) => {
            this.mask.classList.add('active', 'covered');
            this.mask.classList.remove('revealed');

            // Small delay for effect
            setTimeout(() => {
                if (this.isMobile) {
                    // Mobile: Simplified 2-vertex diagonal sweep (400ms)
                    this.animateVerticesMobile('reveal', () => {
                        this.mask.classList.add('revealed');
                        this.mask.classList.remove('covered', 'active');
                        resolve();
                    });
                } else {
                    // Desktop: Complex 4-vertex parallelogram (1200ms)
                    this.animateVertices('reveal', () => {
                        this.mask.classList.add('revealed');
                        this.mask.classList.remove('covered', 'active');
                        resolve();
                    });
                }
            }, 100);
        });
    }

    /**
     * Animate the 4 vertices with different easing and delays
     */
    animateVertices(direction, callback) {
        const duration = 1200; // Total animation duration
        const startTime = performance.now();

        // Define vertex animation configs for DIAGONAL parallelogram effect
        // Diagonal pair 1: Top-left + Bottom-right (move together)
        // Diagonal pair 2: Top-right + Bottom-left (move together, offset from pair 1)
        const vertices = [
            { name: 'point1', delay: 0, easing: this.cubicBezier(0.4, 0, 0.2, 1) },      // Top-left (Diagonal 1)
            { name: 'point2', delay: 250, easing: this.cubicBezier(0.45, 0, 0.25, 1) }, // Top-right (Diagonal 2)
            { name: 'point3', delay: 0, easing: this.cubicBezier(0.4, 0, 0.2, 1) },      // Bottom-right (Diagonal 1)
            { name: 'point4', delay: 250, easing: this.cubicBezier(0.45, 0, 0.25, 1) }  // Bottom-left (Diagonal 2)
        ];

        // Position definitions
        const positions = {
            corners: [   // Mask fully visible (screen covered/black)
                { x: 0, y: 0 },       // point1: top-left corner
                { x: 100, y: 0 },     // point2: top-right corner
                { x: 100, y: 100 },   // point3: bottom-right corner
                { x: 0, y: 100 }      // point4: bottom-left corner
            ],
            center: [    // Mask barely visible (content shows)
                { x: 50, y: 50 },     // point1: center
                { x: 50, y: 50 },     // point2: center
                { x: 50, y: 50 },     // point3: center
                { x: 50, y: 50 }      // point4: center
            ]
        };

        // Determine start and end positions based on direction
        const startPos = direction === 'cover' ? positions.center : positions.corners;
        const endPos = direction === 'cover' ? positions.corners : positions.center;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            let completed = 0;

            vertices.forEach((vertex, index) => {
                const adjustedElapsed = Math.max(0, elapsed - vertex.delay);
                const progress = Math.min(1, adjustedElapsed / duration);
                const easedProgress = vertex.easing(progress);

                const x = this.lerp(startPos[index].x, endPos[index].x, easedProgress);
                const y = this.lerp(startPos[index].y, endPos[index].y, easedProgress);

                this.mask.style.setProperty(`--${vertex.name}X`, `${x}%`);
                this.mask.style.setProperty(`--${vertex.name}Y`, `${y}%`);

                if (progress >= 1) completed++;
            });

            if (completed < vertices.length) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Animate vertices for mobile - 4-vertex diagonal parallelogram (like desktop)
     * Creates true diagonal sweep effect, optimized for mobile with faster timing
     */
    animateVerticesMobile(direction, callback) {
        const duration = 400; // Fast mobile transition (vs desktop's 1200ms)
        const startTime = performance.now();

        // Define vertex animation configs for DIAGONAL parallelogram effect
        // Same diagonal pairing as desktop, but faster timing
        // Diagonal pair 1: Top-left + Bottom-right (move together)
        // Diagonal pair 2: Top-right + Bottom-left (move together, offset from pair 1)
        const vertices = [
            { name: 'point1', delay: 0, easing: this.cubicBezier(0.4, 0, 0.2, 1) },      // Top-left (Diagonal 1)
            { name: 'point2', delay: 100, easing: this.cubicBezier(0.45, 0, 0.25, 1) }, // Top-right (Diagonal 2)
            { name: 'point3', delay: 0, easing: this.cubicBezier(0.4, 0, 0.2, 1) },      // Bottom-right (Diagonal 1)
            { name: 'point4', delay: 100, easing: this.cubicBezier(0.45, 0, 0.25, 1) }  // Bottom-left (Diagonal 2)
        ];

        // Position definitions
        const positions = {
            corners: [   // Mask fully visible (screen covered/black)
                { x: 0, y: 0 },       // point1: top-left corner
                { x: 100, y: 0 },     // point2: top-right corner
                { x: 100, y: 100 },   // point3: bottom-right corner
                { x: 0, y: 100 }      // point4: bottom-left corner
            ],
            center: [    // Mask barely visible (content shows)
                { x: 50, y: 50 },     // point1: center
                { x: 50, y: 50 },     // point2: center
                { x: 50, y: 50 },     // point3: center
                { x: 50, y: 50 }      // point4: center
            ]
        };

        // Determine start and end positions based on direction
        const startPos = direction === 'cover' ? positions.center : positions.corners;
        const endPos = direction === 'cover' ? positions.corners : positions.center;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            let completed = 0;

            vertices.forEach((vertex, index) => {
                const adjustedElapsed = Math.max(0, elapsed - vertex.delay);
                const progress = Math.min(1, adjustedElapsed / duration);
                const easedProgress = vertex.easing(progress);

                const x = this.lerp(startPos[index].x, endPos[index].x, easedProgress);
                const y = this.lerp(startPos[index].y, endPos[index].y, easedProgress);

                this.mask.style.setProperty(`--${vertex.name}X`, `${x}%`);
                this.mask.style.setProperty(`--${vertex.name}Y`, `${y}%`);

                if (progress >= 1) completed++;
            });

            if (completed < vertices.length) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };

        requestAnimationFrame(animate);
    }

    // Linear interpolation
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    // Cubic bezier easing function
    cubicBezier(x1, y1, x2, y2) {
        return (t) => {
            const cx = 3.0 * x1;
            const bx = 3.0 * (x2 - x1) - cx;
            const ax = 1.0 - cx - bx;
            const cy = 3.0 * y1;
            const by = 3.0 * (y2 - y1) - cy;
            const ay = 1.0 - cy - by;

            const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
            const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
            const solveCurveX = (x) => {
                let t0, t1, t2, x2, d2, i;
                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = sampleCurveX(t2) - x;
                    if (Math.abs(x2) < 1e-6) return t2;
                    d2 = (3.0 * ax * t2 + 2.0 * bx) * t2 + cx;
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }
                t0 = 0.0;
                t1 = 1.0;
                t2 = x;
                if (t2 < t0) return t0;
                if (t2 > t1) return t1;
                while (t0 < t1) {
                    x2 = sampleCurveX(t2);
                    if (Math.abs(x2 - x) < 1e-6) return t2;
                    if (x > x2) t0 = t2;
                    else t1 = t2;
                    t2 = (t1 - t0) * 0.5 + t0;
                }
                return t2;
            };
            return sampleCurveY(solveCurveX(t));
        };
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pageTransition = new PageTransition();
    });
} else {
    window.pageTransition = new PageTransition();
}
