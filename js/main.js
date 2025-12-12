/* ============================================
   PORTFOLIO WEBSITE - MAIN SCRIPT
   Core functionality and initialization
   ============================================ */

(function() {
    'use strict';

    const { domReady, debounce, throttle } = window.AnimationUtils;

    /* -------------------- Performance Monitoring -------------------- */
    const performance = {
        trackPageLoad() {
            window.addEventListener('load', () => {
                const loadTime = window.performance.timing.domContentLoadedEventEnd -
                               window.performance.timing.navigationStart;
                console.log(`📊 Page loaded in ${loadTime}ms`);
            });
        },

        trackCoreWebVitals() {
            // Largest Contentful Paint (LCP)
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log(`📈 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
                }).observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP monitoring not supported');
            }

            // First Input Delay (FID)
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log(`⚡ FID: ${entry.processingStart - entry.startTime}ms`);
                    });
                }).observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID monitoring not supported');
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsScore = 0;
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                            console.log(`📐 CLS: ${clsScore.toFixed(4)}`);
                        }
                    }
                }).observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('CLS monitoring not supported');
            }
        }
    };

    /* -------------------- Lazy Loading Images -------------------- */
    function initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* -------------------- Modal Control -------------------- */
    let modalControls = null; // Store modal controls globally

    function initModal() {
        const modal = document.getElementById('contactModal');
        const openBtn = document.getElementById('openContactModal');
        const closeBtn = document.getElementById('closeModal');
        const backdrop = document.getElementById('modalBackdrop');

        if (!modal || !openBtn) return;

        // Open modal
        function openModal() {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }, 10);
        }

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Wait for animation to complete
        }

        // Event listeners
        openBtn.addEventListener('click', openModal);

        // Footer email link
        const openBtnFooter = document.getElementById('openContactModalFooter');
        if (openBtnFooter) {
            openBtnFooter.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Store controls for access from form handler
        modalControls = { closeModal };
        return modalControls;
    }

    /* -------------------- Form Handling with EmailJS -------------------- */
    function initFormHandling() {
        // Initialize EmailJS
        // IMPORTANT: Replace these placeholders with your EmailJS credentials
        // Get them from: https://www.emailjs.com/
        const EMAILJS_SERVICE_ID = 'service_p0d7yun';
        const EMAILJS_TEMPLATE_ID = 'template_t7nd8lw';
        const EMAILJS_PUBLIC_KEY = 'SOTmuNy1cernsL7mR';

        // Initialize EmailJS with public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const successMessage = document.getElementById('successMessage');

        // Validation functions
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Enhanced email validation with API
        // IMPORTANT: Get a free API key from https://www.abstractapi.com/api/email-validation-api
        const EMAIL_VALIDATION_API_KEY = '804efa827b7c44dead5b345abe4ed1f0';
        let emailValidationTimeout = null;
        let lastValidatedEmail = '';
        let emailValidationCache = {};

        async function validateEmailWithAPI(email) {
            const indicator = document.getElementById('emailValidationIndicator');
            const validationMsg = document.getElementById('emailValidationMessage');
            const emailGroup = document.getElementById('emailGroup');
            const errorMsg = emailGroup.querySelector('.error-message');

            // First check basic pattern
            if (!validateEmail(email)) {
                return { valid: false, message: 'Please enter a valid email format' };
            }

            // Check cache
            if (emailValidationCache[email]) {
                return emailValidationCache[email];
            }

            // Show loading indicator
            indicator.style.display = 'flex';
            indicator.className = 'validation-indicator';
            validationMsg.textContent = '';
            validationMsg.className = 'validation-message';

            try {
                // Check if API key is configured
                if (EMAIL_VALIDATION_API_KEY === 'YOUR_ABSTRACTAPI_KEY') {
                    // Fallback to pattern-only validation with info message
                    validationMsg.textContent = 'Email format valid (API validation not configured)';
                    validationMsg.className = 'validation-message info';
                    indicator.style.display = 'none';

                    const result = { valid: true, message: 'Format valid' };
                    emailValidationCache[email] = result;
                    return result;
                }

                // Call AbstractAPI for email validation
                const response = await fetch(
                    `https://emailreputation.abstractapi.com/v1/?api_key=${EMAIL_VALIDATION_API_KEY}&email=${encodeURIComponent(email)}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error:', errorText);
                    throw new Error(`API request failed: ${response.status}`);
                }

                const data = await response.json();

                // Check validation results
                let isValid = true;
                let message = '';

                if (data.email_deliverability?.status === 'undeliverable') {
                    isValid = false;
                    message = 'This email address is undeliverable';
                } else if (data.email_deliverability?.status === 'deliverable') {
                    message = 'Email verified ✓';
                    indicator.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    indicator.className = 'validation-indicator success';
                    validationMsg.textContent = message;
                    validationMsg.className = 'validation-message success';
                } else {
                    message = 'Email format valid';
                    indicator.style.display = 'none';
                    validationMsg.textContent = message;
                    validationMsg.className = 'validation-message info';
                }

                if (!isValid) {
                    indicator.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                    indicator.className = 'validation-indicator error';
                    emailGroup.classList.add('error');
                    errorMsg.textContent = message;
                }

                const result = { valid: isValid, message: message };
                emailValidationCache[email] = result;
                return result;

            } catch (error) {
                console.error('Email validation API error:', error.message);

                // Fallback to pattern validation
                indicator.style.display = 'none';
                validationMsg.textContent = 'Email format valid';
                validationMsg.className = 'validation-message info';

                const result = { valid: true, message: 'Format valid' };
                emailValidationCache[email] = result;
                return result;
            }
        }

        function validateField(field) {
            const formGroup = field.closest('.form-group');
            const errorMsg = formGroup.querySelector('.error-message');
            const value = field.value.trim();

            // Clear previous errors
            formGroup.classList.remove('error');
            errorMsg.textContent = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                formGroup.classList.add('error');
                errorMsg.textContent = 'This field is required';
                return false;
            }

            // Email validation
            if (field.type === 'email' && value && !validateEmail(value)) {
                formGroup.classList.add('error');
                errorMsg.textContent = 'Please enter a valid email address';
                return false;
            }

            return true;
        }

        function validateForm() {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        // Real-time validation on blur
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            // Clear error on input
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    const errorMsg = formGroup.querySelector('.error-message');
                    errorMsg.textContent = '';
                }
            });
        });

        // Enhanced email validation with debouncing
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                const email = e.target.value.trim();

                // Clear any pending validation
                if (emailValidationTimeout) {
                    clearTimeout(emailValidationTimeout);
                }

                // Clear validation messages immediately on input
                const indicator = document.getElementById('emailValidationIndicator');
                const validationMsg = document.getElementById('emailValidationMessage');
                indicator.style.display = 'none';
                validationMsg.textContent = '';

                // Debounce API call (wait 800ms after user stops typing)
                if (email && email.length > 3) {
                    emailValidationTimeout = setTimeout(() => {
                        validateEmailWithAPI(email);
                    }, 800);
                }
            });

            // Also trigger on blur for immediate validation
            emailInput.addEventListener('blur', async () => {
                const email = emailInput.value.trim();
                if (email && validateEmail(email)) {
                    await validateEmailWithAPI(email);
                }
            });
        }

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                contactForm.classList.add('error-shake');
                setTimeout(() => contactForm.classList.remove('error-shake'), 360);
                return;
            }

            // Validate email with API before submitting
            const email = emailInput.value.trim();
            const emailValidation = await validateEmailWithAPI(email);

            if (!emailValidation.valid) {
                contactForm.classList.add('error-shake');
                setTimeout(() => contactForm.classList.remove('error-shake'), 360);
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            successMessage.style.display = 'none';

            try {
                // Send email using EmailJS
                const response = await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    contactForm
                );

                console.log('✅ Email sent successfully:', response);

                // Show success message
                successMessage.style.display = 'flex';
                contactForm.reset();

                // Clear email validation indicators
                const indicator = document.getElementById('emailValidationIndicator');
                const validationMsg = document.getElementById('emailValidationMessage');
                if (indicator) indicator.style.display = 'none';
                if (validationMsg) validationMsg.textContent = '';

                showNotification('Message sent! We\'ll get back to you soon.', 'success');

                // Auto-close modal after 3 seconds
                setTimeout(() => {
                    if (modalControls && modalControls.closeModal) {
                        modalControls.closeModal();
                        // Reset success message for next time
                        successMessage.style.display = 'none';
                    }
                }, 3000);

            } catch (error) {
                console.error('❌ Email sending failed:', error);

                contactForm.classList.add('error-shake');
                setTimeout(() => contactForm.classList.remove('error-shake'), 360);

                showNotification('Failed to send message. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }

    /* -------------------- Notification System -------------------- */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Determine background color based on type
        let backgroundColor;
        switch(type) {
            case 'success':
                backgroundColor = 'rgba(74, 222, 128, 0.9)';
                break;
            case 'error':
                backgroundColor = 'rgba(239, 68, 68, 0.9)';
                break;
            case 'info':
                backgroundColor = 'rgba(74, 144, 226, 0.9)';
                break;
            default:
                backgroundColor = 'rgba(74, 144, 226, 0.9)';
        }

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            background: backgroundColor,
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /* -------------------- Active Navigation Link -------------------- */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', throttle(() => {
            const scrollPosition = window.pageYOffset + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100));
    }

    /* -------------------- Keyboard Navigation -------------------- */
    function initKeyboardNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
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

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        // Remove keyboard nav class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /* -------------------- Viewport Height Fix (Mobile) -------------------- */
    function fixViewportHeight() {
        // Fix for mobile browsers where 100vh includes address bar
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', debounce(setVH, 250));
    }

    /* -------------------- Console Welcome Message -------------------- */
    function showWelcomeMessage() {
        const styles = [
            'color: #4a90e2',
            'font-size: 20px',
            'font-weight: bold',
            'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)'
        ].join(';');

        console.log('%c👋 Welcome to my Portfolio!', styles);
        console.log('%cInterested in the code? Check out the source!', 'color: #6b5dd1; font-size: 14px;');
        console.log('%c🎨 Built with: HTML, CSS, JavaScript', 'color: #9b4dca; font-size: 12px;');
    }

    /* -------------------- Handle External Links -------------------- */
    function handleExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');

        externalLinks.forEach(link => {
            // Add external link indicator
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');

                // Optional: Add visual indicator
                link.setAttribute('aria-label', `${link.textContent} (opens in new tab)`);
            }
        });
    }

    /* -------------------- Dark Mode (Future Enhancement) -------------------- */
    function initThemeToggle() {
        // Placeholder for theme toggle functionality
        // This site is designed for dark mode, but you can add light mode support here
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Store preference
        const theme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    }

    /* -------------------- Error Handling -------------------- */
    function initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // You could send this to an error tracking service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // You could send this to an error tracking service
        });
    }

    /* -------------------- Initialize Everything -------------------- */
    function init() {
        console.log('🚀 Initializing website...');

        // Welcome message
        showWelcomeMessage();

        // Core functionality
        initLazyLoading();
        initModal();
        initFormHandling();
        updateActiveNavLink();
        initKeyboardNavigation();
        fixViewportHeight();
        handleExternalLinks();
        initThemeToggle();
        initErrorHandling();

        // Performance monitoring (development only)
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            performance.trackPageLoad();
            performance.trackCoreWebVitals();
        }

        console.log('✅ Website initialized');
    }

    /* -------------------- Start Application -------------------- */
    domReady(() => {
        init();
    });

    // Export for debugging and page transitions
    window.PortfolioApp = {
        showNotification,
        performance
    };

    // Export initialization function for page transitions
    window.initializeWebsite = init;

})();
