/* ============================================
   PORTFOLIO WEBSITE - UTILITY FUNCTIONS
   Helper functions and configuration
   ============================================ */

/* -------------------- Animation Configuration -------------------- */
const animationConfig = {
    // Timing values (in milliseconds)
    timing: {
        fast: 120,
        quick: 180,
        normal: 360,
        slow: 500,
        verySlow: 700,
        drift: 30000,
        hue: 40000
    },

    // Easing functions
    easing: {
        standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)'
    },

    // Animation amplitudes
    amplitude: {
        scaleHover: 1.02,
        scalePress: 0.98,
        scaleReveal: 0.98,
        translateReveal: 16,
        translateShake: 8,
        glowOpacity: 0.15
    },

    // Parallax multipliers
    parallax: {
        foreground: 0.9,
        mid: 0.6,
        background: 0.3,
        maxOffset: 20,
        smoothing: 0.12
    },

    // Bokeh animation
    bokeh: {
        driftRange: { min: -12, max: 12 },
        scaleRange: { min: 0.98, max: 1.03 },
        hueRotation: 6
    }
};

/* -------------------- Lerp (Linear Interpolation) -------------------- */
/**
 * Smoothly interpolate between two values
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/* -------------------- Clamp Function -------------------- */
/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/* -------------------- Debounce Function -------------------- */
/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* -------------------- Throttle Function -------------------- */
/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* -------------------- Check if element is in viewport -------------------- */
/**
 * Check if an element is visible in the viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset from viewport edge (default: 0)
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= offset
    );
}

/* -------------------- Get scroll percentage -------------------- */
/**
 * Get scroll percentage of the page
 * @returns {number} Scroll percentage (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

/* -------------------- Get element offset from top -------------------- */
/**
 * Get element's distance from top of page
 * @param {HTMLElement} element - Element to measure
 * @returns {number} Distance in pixels
 */
function getOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
}

/* -------------------- Check reduced motion preference -------------------- */
/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* -------------------- Random number in range -------------------- */
/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* -------------------- Map range -------------------- */
/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/* -------------------- Easing functions -------------------- */
const easings = {
    // Ease in quad
    easeInQuad: t => t * t,

    // Ease out quad
    easeOutQuad: t => t * (2 - t),

    // Ease in-out quad
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    // Ease in cubic
    easeInCubic: t => t * t * t,

    // Ease out cubic
    easeOutCubic: t => (--t) * t * t + 1,

    // Ease in-out cubic
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

/* -------------------- Request Animation Frame Helper -------------------- */
/**
 * Simplified requestAnimationFrame handler
 * @param {Function} callback - Function to call on each frame
 * @returns {Object} Object with start and stop methods
 */
function createAnimationLoop(callback) {
    let animationId = null;
    let running = false;

    const loop = (timestamp) => {
        if (!running) return;
        callback(timestamp);
        animationId = requestAnimationFrame(loop);
    };

    return {
        start: () => {
            if (!running) {
                running = true;
                animationId = requestAnimationFrame(loop);
            }
        },
        stop: () => {
            running = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        },
        isRunning: () => running
    };
}

/* -------------------- DOM Ready Helper -------------------- */
/**
 * Execute callback when DOM is ready
 * @param {Function} callback - Function to execute
 */
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/* -------------------- Add class with delay -------------------- */
/**
 * Add class to element after delay
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to add
 * @param {number} delay - Delay in milliseconds
 */
function addClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/* -------------------- Remove class with delay -------------------- */
/**
 * Remove class from element after delay
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to remove
 * @param {number} delay - Delay in milliseconds
 */
function removeClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.remove(className);
    }, delay);
}

/* -------------------- Export utilities -------------------- */
// Make utilities available globally
window.AnimationUtils = {
    config: animationConfig,
    lerp,
    clamp,
    debounce,
    throttle,
    isInViewport,
    getScrollPercentage,
    getOffsetTop,
    prefersReducedMotion,
    random,
    mapRange,
    easings,
    createAnimationLoop,
    domReady,
    addClassWithDelay,
    removeClassWithDelay
};
