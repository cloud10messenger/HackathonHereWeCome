// AHR Mechanical Inc. - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-scroll attribute
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => observer.observe(el));
    
    // Add scroll reveal to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.setAttribute('data-scroll', '');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add scroll reveal to career benefits
    const careerBenefits = document.querySelectorAll('.career-benefit');
    careerBenefits.forEach((benefit, index) => {
        benefit.setAttribute('data-scroll', '');
        benefit.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(benefit);
    });
    
    // Add scroll reveal to value items
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.setAttribute('data-scroll', '');
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
    });
    
    // Add scroll reveal to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.setAttribute('data-scroll', '');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate numbers in stat cards when visible
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Service card hover effects
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderTopColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--electric-blue');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderTopColor = '';
        });
    });
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Email link tracking (optional - for analytics)
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const action = new URL(this.href).searchParams.get('subject') || 'Email Click';
            console.log('Email link clicked:', action);
            // Add analytics tracking here if needed
        });
    });
    
    // Phone link tracking (optional - for analytics)
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Phone link clicked:', this.textContent);
            // Add analytics tracking here if needed
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroBackground = hero.querySelector('.hero-background');
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
    
    // Add loading class to body when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger animations on hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out forwards';
        }
    });
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Console message for developers
    console.log('%cAHR Mechanical Inc.', 'font-size: 24px; font-weight: bold; color: #2756FF;');
    console.log('%cWebsite developed with precision and care', 'font-size: 14px; color: #18233B;');
    console.log('%c24/7 Service: 315-668-6569', 'font-size: 12px; color: #D62828; font-weight: bold;');
    
    // Job Application Form Handler
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const submitBtn = this.querySelector('.form-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>SENDING...</span>';
            
            // Clear previous messages
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';
            
            // Get form data
            const formData = new FormData(this);
            
            // Send form data via AJAX
            fetch('submit-application.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = data.message;
                    formMessage.style.display = 'block';
                    
                    // Reset form
                    jobApplicationForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    formMessage.className = 'form-message error';
                    formMessage.textContent = data.message;
                    formMessage.style.display = 'block';
                }
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            })
            .catch(error => {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'An error occurred. Please try again or contact us at contact@ahrcny.com.';
                formMessage.style.display = 'block';
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                console.error('Form submission error:', error);
            });
        });
    }
});
