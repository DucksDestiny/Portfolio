// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const nav = document.querySelector('.nav');

// Mobile Navigation Toggle
if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.toggle('nav-links--open');
        navToggle.classList.toggle('nav-toggle--open');
        console.log('Mobile navigation toggled');
    });
}

// Enhanced smooth scrolling function
function scrollToSection(targetId) {
    console.log('Attempting to scroll to:', targetId);
    
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const navHeight = nav ? nav.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - navHeight - 10;
        
        console.log('Scrolling to position:', targetPosition);
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        // Close mobile nav if open
        if (navLinks) navLinks.classList.remove('nav-links--open');
        if (navToggle) navToggle.classList.remove('nav-toggle--open');
        
        return true;
    }
    console.log('Target section not found:', targetId);
    return false;
}

// Handle all navigation clicks
function handleNavigationClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const link = e.currentTarget;
    const targetId = link.getAttribute('href');
    
    console.log('Navigation click:', targetId);
    
    if (targetId && targetId.startsWith('#')) {
        scrollToSection(targetId);
    }
}

// Initialize navigation listeners
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Main navigation links
    navLinkItems.forEach((link, index) => {
        console.log(`Setting up nav link ${index + 1}:`, link.getAttribute('href'));
        link.addEventListener('click', handleNavigationClick);
    });
    
    // Hero CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    ctaButtons.forEach((button, index) => {
        const href = button.getAttribute('href');
        console.log(`Setting up CTA button ${index + 1}:`, href);
        if (href && href.startsWith('#')) {
            button.addEventListener('click', handleNavigationClick);
        }
    });
    
    // Footer navigation links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach((link, index) => {
        console.log(`Setting up footer link ${index + 1}:`, link.getAttribute('href'));
        link.addEventListener('click', handleNavigationClick);
    });
    
    console.log('Navigation initialization complete');
}

// Navbar background on scroll
function updateNavbar() {
    if (!nav) return;
    
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        nav.classList.add('nav--scrolled');
    } else {
        nav.classList.remove('nav--scrolled');
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = nav ? nav.offsetHeight : 80;
    
    let activeSection = null;
    const scrollPosition = window.scrollY + navHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section.id;
        }
    });
    
    // If we're at the very top, highlight home
    if (window.scrollY < 100) {
        activeSection = 'hero';
    }
    
    // Update active nav link
    navLinkItems.forEach(link => {
        link.classList.remove('nav-link--active');
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
            link.classList.add('nav-link--active');
        }
    });
}

// Enhanced contact form handling
function initializeContactForm() {
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Initializing contact form...');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const subject = formData.get('subject')?.toString().trim();
        const message = formData.get('message')?.toString().trim();
        
        console.log('Form submission attempt:', { name, email, subject, message });
        
        // Validation
        const errors = [];
        
        if (!name) errors.push('Name is required');
        if (!email) errors.push('Email is required');
        else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
        if (!subject) errors.push('Please select a subject');
        if (!message) errors.push('Message is required');
        else if (message.length < 10) errors.push('Message must be at least 10 characters long');
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }
        
        // Success
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
        
        console.log('Contact form successfully submitted');
    });
    
    // Form field enhancements
    const formControls = contactForm.querySelectorAll('.form-control');
    formControls.forEach(control => {
        if (control.type === 'email') {
            control.addEventListener('blur', (e) => {
                const email = e.target.value.trim();
                if (email && !isValidEmail(email)) {
                    e.target.style.borderColor = 'var(--color-error)';
                } else {
                    e.target.style.borderColor = '';
                }
            });
        }
    });
    
    console.log('Contact form initialization complete');
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
        notification.classList.add('notification--show');
    });
    
    // Auto-hide after 5 seconds
    const autoHideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton?.addEventListener('click', () => {
        clearTimeout(autoHideTimeout);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.classList.remove('notification--show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Project links initialization
function initializeProjectLinks() {
    console.log('Initializing project links...');
    
    const projectLinks = document.querySelectorAll('.project-links a, .btn[href^="http"]');
    
    projectLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        console.log(`Setting up project link ${index + 1}:`, href);
        
        if (href && (href.startsWith('http') || href.startsWith('https'))) {
            // Ensure external links open in new tab
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add click handler
            link.addEventListener('click', (e) => {
                const projectCard = link.closest('.project-card');
                const projectTitle = projectCard?.querySelector('.project-title')?.textContent || 'Project';
                const linkText = link.textContent.trim() || 'Link';
                
                console.log(`External project link clicked: ${projectTitle} - ${linkText}`);
                showNotification(`Opening ${linkText} in new tab...`, 'info');
                
                // Let the browser handle the actual link opening
            });
        }
    });
    
    console.log('Project links initialization complete');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skill-category')) {
                animateSkillBars(entry.target);
            }
        }
    });
}, observerOptions);

// Animate skill progress bars
function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level');
            if (level) {
                bar.style.width = level + '%';
            }
        }, index * 100);
    });
}

// Stats counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.textContent;
                
                if (originalText.match(/^\d/)) {
                    const numericValue = parseFloat(originalText.match(/[\d.]+/)[0]);
                    animateCounter(target, 0, numericValue, originalText);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, start, end, originalText) {
    const duration = 1500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        let currentValue;
        
        if (originalText.includes('.')) {
            currentValue = (start + (end - start) * easeOutCubic).toFixed(2);
        } else {
            currentValue = Math.floor(start + (end - start) * easeOutCubic);
        }
        
        element.textContent = originalText.replace(/[\d.]+/, currentValue.toString());
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize scroll animations
function initializeAnimations() {
    console.log('Initializing animations...');
    
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    animateStats();
    
    console.log('Animations initialization complete');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks?.classList.remove('nav-links--open');
        navToggle?.classList.remove('nav-toggle--open');
    }
    
    // Quick navigation shortcuts (Alt + number)
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const shortcuts = {
            '1': '#hero',
            '2': '#about', 
            '3': '#experience',
            '4': '#projects',
            '5': '#skills',
            '6': '#contact'
        };
        
        if (shortcuts[e.key]) {
            e.preventDefault();
            scrollToSection(shortcuts[e.key]);
        }
    }
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('nav-links--open')) {
        if (!nav?.contains(e.target)) {
            navLinks.classList.remove('nav-links--open');
            navToggle?.classList.remove('nav-toggle--open');
        }
    }
});

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize scroll handlers
function initializeScrollHandlers() {
    const throttledNavUpdate = throttle(updateNavbar, 16);
    const throttledActiveLink = throttle(updateActiveNavLink, 100);
    
    window.addEventListener('scroll', throttledNavUpdate);
    window.addEventListener('scroll', throttledActiveLink);
}

// Main initialization function
function initializePage() {
    console.log('=== Starting Portfolio Initialization ===');
    
    // Check for required elements
    console.log('Checking DOM elements...');
    console.log('Nav toggle:', navToggle ? 'Found' : 'Not found');
    console.log('Nav links:', navLinks ? 'Found' : 'Not found');
    console.log('Nav link items:', navLinkItems.length);
    console.log('Contact form:', contactForm ? 'Found' : 'Not found');
    
    // Initialize all components
    initializeNavigation();
    initializeContactForm();
    initializeProjectLinks();
    initializeAnimations();
    initializeScrollHandlers();
    
    // Set initial state
    updateActiveNavLink();
    document.body.classList.add('loaded');
    
    console.log('=== Portfolio Initialization Complete ===');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Also run on window load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    updateActiveNavLink();
});

// Handle browser navigation
window.addEventListener('popstate', updateActiveNavLink);

// Test functions for debugging
window.testNotification = function(message = 'Test notification', type = 'success') {
    showNotification(message, type);
};

window.testScroll = function(section = '#about') {
    console.log('Testing scroll to:', section);
    scrollToSection(section);
};

window.debugNavigation = function() {
    console.log('=== Navigation Debug ===');
    console.log('All sections:');
    document.querySelectorAll('section[id]').forEach((section, index) => {
        console.log(`  ${index + 1}. #${section.id} - ${section.querySelector('h1, h2')?.textContent || 'No title'}`);
    });
    
    console.log('Navigation links:');
    navLinkItems.forEach((link, index) => {
        console.log(`  ${index + 1}. ${link.textContent} -> ${link.getAttribute('href')}`);
    });
    
    console.log('CTA buttons:');
    document.querySelectorAll('.hero-cta .btn').forEach((btn, index) => {
        console.log(`  ${index + 1}. ${btn.textContent} -> ${btn.getAttribute('href')}`);
    });
};

// Run debug after initialization
setTimeout(() => {
    console.log('=== Available Debug Functions ===');
    console.log('- testNotification(message, type)');
    console.log('- testScroll(section)');
    console.log('- debugNavigation()');
    console.log('=== Keyboard Shortcuts ===');
    console.log('- Alt+1-6: Navigate to sections');
    console.log('- Escape: Close mobile menu');
}, 1000);