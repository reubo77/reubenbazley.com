// ========================================
// REUBEN BAZLEY - PORTFOLIO SCRIPTS
// ========================================

// Force scroll to top on page load/refresh (runs before content loads)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at the top
    window.scrollTo(0, 0);
    
    initializeFilters();
    initializeScrollAnimations();
    initializeSmoothScroll();
    initializeNavBackground();
    initializeAutoScroll();
    initializeTextDecrypt();
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

// ========================================
// AUTO-SCROLL ON CLICK
// ========================================
function initializeAutoScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    let isAutoScrolling = false;
    let animationId = null;
    let startTime = null;
    let currentSpeed = 0;
    
    // Scroll parameters
    const maxSpeed = 4; // max pixels per frame
    const accelerationTime = 1500; // ms to reach max speed
    const pulseAmount = 0.3; // breathing effect intensity

    // Make it clickable
    scrollIndicator.style.cursor = 'pointer';

    // Easing function - smooth acceleration
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Stop auto-scroll when user takes control
    function stopAutoScroll() {
        if (isAutoScrolling) {
            isAutoScrolling = false;
            startTime = null;
            currentSpeed = 0;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
    }

    // User interaction events that should stop auto-scroll
    const stopEvents = ['wheel', 'touchstart', 'keydown'];
    stopEvents.forEach(event => {
        window.addEventListener(event, stopAutoScroll, { passive: true });
    });

    // Also stop if user clicks anywhere else
    document.addEventListener('mousedown', (e) => {
        if (!scrollIndicator.contains(e.target)) {
            stopAutoScroll();
        }
    });

    // Start auto-scroll on click
    scrollIndicator.addEventListener('click', () => {
        if (isAutoScrolling) {
            stopAutoScroll();
            return;
        }

        isAutoScrolling = true;
        startTime = performance.now();

        function autoScroll(currentTime) {
            if (!isAutoScrolling) return;

            // Check if we've reached the bottom
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (window.pageYOffset >= maxScroll) {
                stopAutoScroll();
                return;
            }

            // Calculate elapsed time
            const elapsed = currentTime - startTime;
            
            // Smooth acceleration phase
            const accelerationProgress = Math.min(elapsed / accelerationTime, 1);
            const easedProgress = easeOutCubic(accelerationProgress);
            
            // Add a subtle breathing/pulse effect for organic feel
            const pulse = 1 + Math.sin(elapsed / 400) * pulseAmount;
            
            // Calculate current speed with easing and pulse
            currentSpeed = maxSpeed * easedProgress * pulse;
            
            // Ensure minimum speed once started
            currentSpeed = Math.max(currentSpeed, 0.5);

            window.scrollBy(0, currentSpeed);
            animationId = requestAnimationFrame(autoScroll);
        }

        animationId = requestAnimationFrame(autoScroll);
    });
}

// ========================================
// TEXT DECRYPT EFFECT
// ========================================
function initializeTextDecrypt() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    // Characters to use for scrambling - mostly letters and numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Store original text and set up each element
    statNumbers.forEach(el => {
        el.dataset.original = el.textContent;
        el.dataset.decrypted = 'false';
    });

    // Decrypt animation function
    function decryptText(element) {
        if (element.dataset.decrypted === 'true') return;
        element.dataset.decrypted = 'true';

        const originalText = element.dataset.original;
        const duration = 2500; // total animation time (slower)
        const frameRate = 50; // ms between frames (slower updates)
        const totalFrames = duration / frameRate;
        const revealDelay = totalFrames / originalText.length; // frames before each char locks in
        
        let frame = 0;
        let lockedChars = 0;

        function animate() {
            frame++;
            
            // Calculate how many characters should be locked/revealed
            lockedChars = Math.floor(frame / revealDelay);
            
            // Build the display string
            let displayText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (i < lockedChars) {
                    // This character is revealed
                    displayText += originalText[i];
                } else if (originalText[i] === ' ') {
                    // Preserve spaces
                    displayText += ' ';
                } else {
                    // Scramble this character
                    displayText += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            
            element.textContent = displayText;
            
            // Continue until all characters are revealed
            if (lockedChars < originalText.length) {
                setTimeout(animate, frameRate);
            } else {
                element.textContent = originalText;
            }
        }

        // Start with scrambled text
        animate();
    }

    // Observe when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Small delay for dramatic effect
                setTimeout(() => {
                    decryptText(entry.target);
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(el => observer.observe(el));
}
