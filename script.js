// ========================================
// REUBEN BAZLEY - PORTFOLIO SCRIPTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeScrollAnimations();
    initializeSmoothScroll();
    initializeNavBackground();
});

// ========================================
// VIDEO FILTERING
// ========================================
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter videos
            const filter = button.dataset.filter;
            
            videoCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Trigger reflow for animation
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initializeScrollAnimations() {
    // Add fade-in class to elements we want to animate
    const animatedElements = document.querySelectorAll(
        '.about-content, .about-image-wrapper, .video-card, .contact-content'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// NAV BACKGROUND ON SCROLL
// ========================================
function initializeNavBackground() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add solid background after scrolling past hero
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 11, 0.98)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(10, 10, 11, 0.95), transparent)';
            nav.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// LAZY LOAD YOUTUBE IFRAMES
// ========================================
// This improves initial page load performance
function initializeLazyLoad() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    lazyLoadObserver.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '100px'
    });

    videoWrappers.forEach(wrapper => {
        lazyLoadObserver.observe(wrapper);
    });
}
