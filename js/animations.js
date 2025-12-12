/* ============================================
   PORTFOLIO WEBSITE - ANIMATIONS HANDLER
   Manages all animation behaviors
   ============================================ */

(function() {
    'use strict';

    const {
        config,
        lerp,
        clamp,
        throttle,
        isInViewport,
        prefersReducedMotion,
        createAnimationLoop,
        domReady
    } = window.AnimationUtils;

    /* -------------------- State -------------------- */
    const state = {
        animationsEnabled: !prefersReducedMotion(),
        mouseX: 0,
        mouseY: 0,
        targetMouseX: 0,
        targetMouseY: 0,
        scrollY: 0,
        observedElements: new Set(),
        featuresBypassRequested: false // Flag to bypass features scroll-lock
    };

    /* -------------------- Intersection Observer -------------------- */
    let intersectionObserver = null;

    function initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add revealed class
                    element.classList.add('revealed');

                    // Mark as animation complete after animation duration
                    setTimeout(() => {
                        element.classList.add('animation-complete');
                    }, config.timing.verySlow + 500);

                    // Stop observing this element
                    intersectionObserver.unobserve(element);
                    state.observedElements.delete(element);
                }
            });
        }, options);
    }

    /* -------------------- Observe Elements for Scroll Animations -------------------- */
    function observeScrollAnimations() {
        if (!intersectionObserver) {
            initIntersectionObserver();
        }

        // Observe all elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');

        animatedElements.forEach(element => {
            if (!state.observedElements.has(element)) {
                intersectionObserver.observe(element);
                state.observedElements.add(element);
            }
        });

        // Observe section headers
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            if (!state.observedElements.has(header)) {
                intersectionObserver.observe(header);
                state.observedElements.add(header);
            }
        });

        // Observe bento grid
        const bentoGrid = document.querySelector('.bento-grid');
        if (bentoGrid && !state.observedElements.has(bentoGrid)) {
            intersectionObserver.observe(bentoGrid);
            state.observedElements.add(bentoGrid);
        }
    }

    /* -------------------- Pointer Parallax (Bokeh) -------------------- */
    let parallaxLoop = null;

    function initPointerParallax() {
        if (!state.animationsEnabled) return;

        // Track mouse position
        document.addEventListener('mousemove', throttle((e) => {
            state.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            state.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }, 16)); // ~60fps

        // Smooth parallax animation
        parallaxLoop = createAnimationLoop(() => {
            // Lerp for smooth movement
            state.mouseX = lerp(state.mouseX, state.targetMouseX, config.parallax.smoothing);
            state.mouseY = lerp(state.mouseY, state.targetMouseY, config.parallax.smoothing);

            // Apply to bokeh elements
            const bokehElements = document.querySelectorAll('.bokeh-element');
            bokehElements.forEach((element, index) => {
                const depth = (index + 1) * 0.25; // Varying depth
                const offsetX = state.mouseX * config.parallax.maxOffset * depth;
                const offsetY = state.mouseY * config.parallax.maxOffset * depth;

                element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            });
        });

        parallaxLoop.start();
    }

    /* -------------------- Scroll Parallax -------------------- */
    function handleScrollParallax() {
        if (!state.animationsEnabled) return;

        state.scrollY = window.pageYOffset;

        // Apply parallax to elements with data-animate="parallax"
        const parallaxElements = document.querySelectorAll('[data-animate="parallax"]');

        parallaxElements.forEach(element => {
            if (isInViewport(element, 200)) {
                const elementTop = element.offsetTop;
                const offset = (state.scrollY - elementTop) * 0.1;

                // Apply subtle parallax
                element.style.transform = `translateY(${offset}px)`;
            }
        });
    }

    /* -------------------- Scroll Handler -------------------- */
    const handleScroll = throttle(() => {
        handleScrollParallax();
    }, 16); // ~60fps

    /* -------------------- Navigation Scroll Effect -------------------- */
    function initNavigationScroll() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 100) {
                nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        }, 100));
    }

    /* -------------------- Smooth Scroll to Anchor -------------------- */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        const SECTIONS_BELOW_FEATURES = ['products', 'solutions', 'contact'];

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    // Check if target section is below features
                    const targetId = href.replace('#', '');
                    if (SECTIONS_BELOW_FEATURES.includes(targetId)) {
                        // Set bypass flag to skip features scroll-lock
                        state.featuresBypassRequested = true;
                    }

                    const offsetTop = target.offsetTop - 80; // Account for fixed nav

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.querySelector('.nav-toggle');
                    const navBackdrop = document.querySelector('.nav-backdrop');
                    if (navMenu && navMenu.classList.contains('open')) {
                        navMenu.classList.remove('open');
                        navToggle.classList.remove('active');
                        if (navBackdrop) {
                            navBackdrop.classList.remove('active');
                        }
                    }
                }
            });
        });
    }

    /* -------------------- Button Press Animation -------------------- */
    function initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn, .bento-card, .card-link');

        buttons.forEach(button => {
            // Mouse down - scale down
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.98)';
            });

            // Mouse up - scale back
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });

            // Mouse leave - reset
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    /* -------------------- Cascading Cards Click/Tap Handlers -------------------- */
    /* DISABLED - Cards are now display-only without expand/collapse interaction */
    /*
    function initCascadingCards() {
        const cards = document.querySelectorAll('.cascading-card');
        if (cards.length === 0) return;

        let currentlyExpanded = null;

        cards.forEach(card => {
            const header = card.querySelector('.cascade-card-header');
            const body = card.querySelector('.cascade-card-body');

            if (!header || !body) return;

            // Skip cards that are links (have href attribute)
            if (card.hasAttribute('href')) return;

            // Add click/tap handler
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isExpanded = card.classList.contains('expanded');

                // Close previously expanded card
                if (currentlyExpanded && currentlyExpanded !== card) {
                    currentlyExpanded.classList.remove('expanded');
                    const prevBody = currentlyExpanded.querySelector('.cascade-card-body');
                    if (prevBody) {
                        prevBody.style.maxHeight = '0';
                        prevBody.style.opacity = '0';
                    }
                }

                // Toggle current card
                if (isExpanded) {
                    card.classList.remove('expanded');
                    body.style.maxHeight = '0';
                    body.style.opacity = '0';
                    currentlyExpanded = null;
                } else {
                    card.classList.add('expanded');
                    body.style.maxHeight = '800px';
                    body.style.opacity = '1';
                    currentlyExpanded = card;
                }
            });

            // Add keyboard support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });

            // Make header focusable for keyboard navigation
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');

            // Update aria-expanded on expansion
            const updateAriaExpanded = () => {
                const isExpanded = card.classList.contains('expanded');
                header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            };

            // Observe class changes to update aria-expanded
            const observer = new MutationObserver(updateAriaExpanded);
            observer.observe(card, { attributes: true, attributeFilter: ['class'] });
        });
    }
    */

    /* -------------------- Packages Pop-Out Animation -------------------- */
    function initPackagesPopOut() {
        const packagesStack = document.querySelector('.packages-stack');
        if (!packagesStack) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add revealing class to trigger animation
                    packagesStack.classList.add('revealing');

                    // Optional: Unobserve after first trigger
                    observer.unobserve(packagesStack);
                }
            });
        }, options);

        observer.observe(packagesStack);
    }

    /* -------------------- Stacked Product Cards Scroll Effect -------------------- */
    /* REMOVED - Using simple CSS-only sticky positioning instead */
    /* Cards stack naturally with position: sticky + z-index layering */

    /* -------------------- Navigation Toggle (Desktop & Mobile) -------------------- */
    function initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const mainNav = document.querySelector('.main-nav');
        const navBackdrop = document.querySelector('.nav-backdrop');

        if (!navToggle || !navMenu || !mainNav) return;

        // Toggle menu open/close - ONLY via X icon
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click listener from firing
            const isMobile = window.innerWidth <= 1024;

            if (isMobile) {
                // Mobile: Toggle menu open/close with active class
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('open');
                if (navBackdrop) {
                    navBackdrop.classList.toggle('active');
                }
            } else {
                // Desktop: Toggle nav expanded/collapsed
                mainNav.classList.toggle('expanded');
            }
        });

        /* REMOVED - Drawer should only close via X icon, not backdrop/outside/link clicks */
        /*
        // Close menu when clicking backdrop
        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                navBackdrop.classList.remove('active');
            });
        }

        // Close menu when clicking a navigation link (after navigation)
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const isMobile = window.innerWidth <= 1024;
                if (isMobile) {
                    // Small delay to allow navigation to complete
                    setTimeout(() => {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('open');
                        if (navBackdrop) {
                            navBackdrop.classList.remove('active');
                        }
                    }, 150);
                }
            });
        });

        // Close menu when clicking outside (but NOT inside menu)
        document.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 1024;

            if (isMobile && navMenu.classList.contains('open')) {
                // Only close if clicking outside both toggle and menu
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('open');
                    if (navBackdrop) {
                        navBackdrop.classList.remove('active');
                    }
                }
            }
        });
        */
    }

    /* -------------------- Scroll-Based Feature Tabs with Virtual Scroll -------------------- */
    function initFeatureTabs() {
        const section = document.querySelector('.features-tabs-section');
        const stickyWrapper = document.querySelector('.features-sticky-wrapper');
        const tabs = document.querySelectorAll('.feature-tab');
        const panels = document.querySelectorAll('.tab-panel');

        if (!section || !stickyWrapper || tabs.length === 0 || panels.length === 0) return;

        const SCROLL_PER_TAB = 300;
        const totalTabs = tabs.length;

        // Sections that are below the features section
        const SECTIONS_BELOW_FEATURES = ['products', 'solutions', 'contact'];

        // State machine
        const STATE = {
            IDLE: 'idle',
            APPROACHING: 'approaching',
            LOCKED: 'locked',
            UNLOCKED: 'unlocked'
        };

        let currentState = STATE.IDLE;
        let scrollBuffer = 0;
        let currentTabIndex = 0;
        let lockedScrollY = 0;
        let cachedScrollDistance = 0;
        let hasCompletedOnce = false;

        // Check if current page hash is for a section below features
        // If so, bypass the features scroll-lock mechanism
        const currentHash = window.location.hash.replace('#', '');
        if (SECTIONS_BELOW_FEATURES.includes(currentHash) || state.featuresBypassRequested) {
            hasCompletedOnce = true;
        }

        // Touch handling for mobile
        let touchStartY = 0;
        let lastTouchY = 0;

        // Update virtual scroll position (shared by wheel and touch)
        function updateVirtualScrollPosition() {
            const progress = scrollBuffer / (SCROLL_PER_TAB * totalTabs);
            const targetScrollY = lockedScrollY + (progress * cachedScrollDistance);

            window.scrollTo({
                top: targetScrollY,
                behavior: 'instant'
            });
        }

        // Block keyboard scrolling
        function handleKeyDown(e) {
            if (currentState !== STATE.LOCKED) return;

            // Block scroll-triggering keys: Space, PgUp, PgDn, End, Home, Arrows
            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
            if (scrollKeys.includes(e.keyCode)) {
                e.preventDefault();
            }
        }

        // Lock the section
        function lockSection() {
            if (hasCompletedOnce) return;

            currentState = STATE.LOCKED;
            lockedScrollY = window.scrollY;
            scrollBuffer = 0;
            currentTabIndex = 0;

            // Cache virtual scroll distance once on lock
            const rect = section.getBoundingClientRect();
            cachedScrollDistance = rect.height - window.innerHeight;

            // Change to fixed position - freezes content on screen
            stickyWrapper.classList.add('position-locked');

            activateTab(0);
        }

        // Unlock downward (to Products section)
        function unlockDownward() {
            currentState = STATE.UNLOCKED;
            hasCompletedOnce = true;

            // Change back to sticky - allows natural unsticking
            stickyWrapper.classList.remove('position-locked');
        }

        // Unlock upward (to About section)
        function unlockUpward() {
            currentState = STATE.APPROACHING;
            scrollBuffer = 0;
            currentTabIndex = 0;

            // Change back to sticky
            stickyWrapper.classList.remove('position-locked');
        }

        // Check section bounds and state
        function checkBounds() {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const inViewport = rect.top < viewportHeight && rect.bottom > 0;

            const wrapperRect = stickyWrapper.getBoundingClientRect();
            const atLockPosition = wrapperRect.top <= 110;

            // State machine transitions
            switch (currentState) {
                case STATE.IDLE:
                    if (inViewport && !atLockPosition) {
                        currentState = STATE.APPROACHING;
                    }
                    break;

                case STATE.APPROACHING:
                    if (!inViewport) {
                        currentState = STATE.IDLE;
                    } else if (atLockPosition && !hasCompletedOnce) {
                        lockSection();
                    }
                    break;

                case STATE.LOCKED:
                    // Stay locked until unlock conditions met
                    break;

                case STATE.UNLOCKED:
                    // Once unlocked, never re-lock
                    break;
            }
        }

        // Handle wheel events (desktop)
        function handleWheel(e) {
            if (currentState !== STATE.LOCKED) return;

            e.preventDefault();

            scrollBuffer += e.deltaY;

            // Check unlock conditions
            if (scrollBuffer < -50) {
                unlockUpward();
                return;
            }

            if (scrollBuffer >= SCROLL_PER_TAB * totalTabs) {
                unlockDownward();
                return;
            }

            // Clamp buffer
            scrollBuffer = Math.max(0, Math.min(scrollBuffer, SCROLL_PER_TAB * totalTabs));

            // Update virtual scroll
            updateVirtualScrollPosition();

            // Update tab if changed
            const newTabIndex = Math.floor(scrollBuffer / SCROLL_PER_TAB);
            if (newTabIndex !== currentTabIndex) {
                activateTab(newTabIndex);
            }
        }

        // Handle touch start (mobile)
        function handleTouchStart(e) {
            if (currentState !== STATE.LOCKED) return;
            touchStartY = e.touches[0].clientY;
            lastTouchY = touchStartY;
        }

        // Handle touch move (mobile)
        function handleTouchMove(e) {
            if (currentState !== STATE.LOCKED) return;

            e.preventDefault();

            const currentY = e.touches[0].clientY;
            const delta = lastTouchY - currentY;
            lastTouchY = currentY;

            // Apply touch sensitivity multiplier
            scrollBuffer += delta * 2;

            // Check unlock conditions
            if (scrollBuffer < -50) {
                unlockUpward();
                return;
            }

            if (scrollBuffer >= SCROLL_PER_TAB * totalTabs) {
                unlockDownward();
                return;
            }

            // Clamp buffer
            scrollBuffer = Math.max(0, Math.min(scrollBuffer, SCROLL_PER_TAB * totalTabs));

            // Update virtual scroll
            updateVirtualScrollPosition();

            // Update tab if changed
            const newTabIndex = Math.floor(scrollBuffer / SCROLL_PER_TAB);
            if (newTabIndex !== currentTabIndex) {
                activateTab(newTabIndex);
            }
        }

        // Activate tab
        function activateTab(index) {
            currentTabIndex = index;

            tabs.forEach((tab, i) => {
                tab.classList.toggle('active', i === index);
            });

            panels.forEach((panel, i) => {
                if (i === index) {
                    setTimeout(() => panel.classList.add('active'), 50);
                } else {
                    panel.classList.remove('active');
                }
            });
        }

        // Manual tab clicks
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                activateTab(index);
                scrollBuffer = index * SCROLL_PER_TAB;

                if (currentState === STATE.LOCKED) {
                    updateVirtualScrollPosition();
                }
            });
        });

        // Event listeners
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('keydown', handleKeyDown, { passive: false });

        window.addEventListener('scroll', () => {
            requestAnimationFrame(checkBounds);
        }, { passive: true });

        // Initial check
        checkBounds();
    }

    /* -------------------- Hero Title Animation -------------------- */
    function initHeroAnimation() {
        const heroTitle = document.querySelector('.hero-title[data-animate="title"]');
        if (!heroTitle) return;

        // Trigger hero animation on load
        setTimeout(() => {
            heroTitle.classList.add('revealed');
        }, 300);

        // Animate subtitle and CTA
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCta = document.querySelector('.hero-cta');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        setTimeout(() => {
            if (heroSubtitle) heroSubtitle.classList.add('revealed');
            if (heroCta) heroCta.classList.add('revealed');
            if (scrollIndicator) scrollIndicator.classList.add('revealed');
        }, 900);
    }

    /* -------------------- Cleanup -------------------- */
    function cleanup() {
        if (parallaxLoop) {
            parallaxLoop.stop();
        }
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
        window.removeEventListener('scroll', handleScroll);
    }


    /* -------------------- Initialize All Animations -------------------- */
    function init() {
        console.log('🎨 Initializing animations...');

        // Check for reduced motion preference
        if (prefersReducedMotion()) {
            console.log('⚠️ Reduced motion detected - animations simplified');
            document.body.classList.add('animations-paused');
            state.animationsEnabled = false;
        } else {
            document.body.classList.remove('animations-paused');
            state.animationsEnabled = true;
        }

        // Initialize all animation systems
        initIntersectionObserver();
        observeScrollAnimations();
        initPointerParallax();
        initNavigationScroll();
        initSmoothScroll();
        initButtonAnimations();
        // initCascadingCards(); // DISABLED - Cards are now display-only
        // initStackedCards(); // REMOVED - Using simple CSS-only sticky positioning
        initPackagesPopOut();
        initMobileMenu();
        initFeatureTabs();
        initHeroAnimation();

        // Start scroll animations
        window.addEventListener('scroll', handleScroll);

        // Trigger initial scroll check
        handleScroll();

        console.log('✅ Animations initialized');
    }

    /* -------------------- Start when DOM is ready -------------------- */
    domReady(() => {
        init();

        // Cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    });

    // Export for external use if needed
    window.AnimationController = {
        state,
        observeScrollAnimations,
        cleanup,
        reinit: init
    };

    // Export initialization function for page transitions
    window.initializeAnimations = init;

})();
