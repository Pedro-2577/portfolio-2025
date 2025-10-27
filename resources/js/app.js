import './bootstrap';

// Alpine.js components and utilities
document.addEventListener('alpine:init', () => {
    // Global Alpine.js data and methods can be added here
    Alpine.data('mobileMenu', () => ({
        open: false,
        toggle() {
            this.open = !this.open;
        },
        close() {
            this.open = false;
        }
    }));

    Alpine.data('darkMode', () => ({
        init() {
            // Initialize dark mode from localStorage
            this.dark = localStorage.getItem('darkMode') === 'true';
            this.updateTheme();
        },
        toggle() {
            this.dark = !this.dark;
            localStorage.setItem('darkMode', this.dark);
            this.updateTheme();
        },
        updateTheme() {
            if (this.dark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }));

    Alpine.data('modal', () => ({
        open: false,
        toggle() {
            this.open = !this.open;
        },
        close() {
            this.open = false;
        }
    }));

    Alpine.data('smoothScroll', () => ({
        scrollTo(element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }));
});

// Utility functions
window.Utils = {
    // Debounce function for search inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }
};

// Initialize tooltips and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any tooltips or other interactive elements
    initializeTooltips();
    initializeScrollAnimations();
    initializeFormValidation();
});

function initializeTooltips() {
    // Add tooltip functionality if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = event.target.getAttribute('data-tooltip');
    if (tooltip) {
        // Create and show tooltip
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg';
        tooltipElement.textContent = tooltip;
        tooltipElement.style.top = event.target.offsetTop - 30 + 'px';
        tooltipElement.style.left = event.target.offsetLeft + 'px';
        tooltipElement.id = 'tooltip';
        document.body.appendChild(tooltipElement);
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function initializeScrollAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

function initializeFormValidation() {
    // Add custom form validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', validateForm);
    });
}

function validateForm(event) {
    const form = event.target;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
            showFieldError(input, 'Este campo es obligatorio');
        } else {
            input.classList.remove('border-red-500');
            hideFieldError(input);
        }
    });

    if (!isValid) {
        event.preventDefault();
    }
}

function showFieldError(field, message) {
    hideFieldError(field);
    const errorElement = document.createElement('p');
    errorElement.className = 'mt-1 text-sm text-red-600 dark:text-red-400 field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Export for use in other modules
// export { Utils };
