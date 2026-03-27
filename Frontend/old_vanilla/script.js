// =========================================================================
// NAVBAR SCROLL & ACTIVE LINKS
// =========================================================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-center .nav-link');

window.addEventListener('scroll', () => {
    // Frosted glass effect toggle (can make it more pronounced on scroll)
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 15, 30, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 15, 30, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// =========================================================================
// SCROLL REVEAL ANIMATIONS
// =========================================================================
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
revealElements.forEach(el => revealObserver.observe(el));

// =========================================================================
// HERO GAUGE ANIMATION
// =========================================================================
const gaugeFill = document.getElementById('gauge-fill');
const gaugeNumber = document.getElementById('gauge-number');
// circle has radius 50. circumference = 2 * PI * 50 = 314.15
// an arc of half a circle would be 157.
// Path in SVG is `M 20 95 A 50 50 0 1 1 100 95`. This is roughly a semi-circle.
// Approx length = ~235.6 (using path length measure)
// Full dasharray is 235.6. Dashoffset starts at 235.6 (empty) and goes to 77 for score 67.
// 67% of 235.6 is 157.8. Dashoffset = 235.6 - 157.8 = 77.8.

// Initialize gauge as empty
gaugeFill.style.strokeDasharray = '235.6';
gaugeFill.style.strokeDashoffset = '235.6';
gaugeFill.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';

// Animate gauge on load
setTimeout(() => {
    gaugeFill.style.strokeDashoffset = '77.8';
    
    // Animate number
    let start = 0;
    const end = 67;
    const duration = 2000;
    const interval = 20;
    const step = (end / (duration / interval));
    
    const countTimer = setInterval(() => {
        start += step;
        if (start >= end) {
            gaugeNumber.innerText = end;
            clearInterval(countTimer);
        } else {
            gaugeNumber.innerText = Math.floor(start);
        }
    }, interval);
}, 500);

// =========================================================================
// NUMBER COUNTER ANIMATION (STATS BAND)
// =========================================================================
const counters = document.querySelectorAll('.counter');
const statsBand = document.querySelector('.stats-band');

const startCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; 
                const increment = target / (duration / 16); 
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                if (target > 0) requestAnimationFrame(updateCounter);
                else counter.innerText = '0';
            });
            observer.unobserve(entry.target);
        }
    });
};

const statsObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
if (statsBand) statsObserver.observe(statsBand);

// =========================================================================
// BACKGROUND CANVAS (ECG WAVEFORM PARTICLES)
// =========================================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 150, ${this.opacity * 0.3})`;
        ctx.fill();
    }
}

const particles = [];
const numParticles = 100;

for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

// ECG Waveform function
let time = 0;
function drawWave() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 200, 150, 0.05)';
    ctx.lineWidth = 2;
    
    const centerY = height / 2;
    const waveWidth = 400;
    
    // Slowly move wave across screen
    let startX = (time * 2) % (width + waveWidth) - waveWidth;
    
    ctx.moveTo(0, centerY);
    
    for (let x = 0; x < width; x++) {
        let y = centerY;
        
        // Create the heartbeat spike based on distance to the moving 'pulse'
        let dist = Math.abs(x - startX);
        if (dist < 100) {
            // Heartbeat complex shape approximation
            if (dist < 10) y = centerY - 80;      // R peak
            else if (dist < 20) y = centerY + 30; // S wave
            else if (dist < 30) y = centerY - 10; // Q wave
            else if (Math.abs(dist - 60) < 15) y = centerY - 15; // T wave
            else if (Math.abs(dist + 40) < 15) y = centerY - 10; // P wave
        }
        
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();
}

function animate() {
    // Semi-transparent black over previous frame for trailing effect
    ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
    ctx.fillRect(0, 0, width, height);
    
    drawWave();
    
    for (let p of particles) {
        p.update();
        p.draw();
    }
    
    // Grid overlay (faint)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    // Optimization: Draw grid sparingly or static, here static is fine
    // Removed grid drawing in loop for performance, it's very subtle anyway.
    
    time++;
    requestAnimationFrame(animate);
}

animate();

// Basic Mobile menu toggle placeholder
const mobileBtn = document.getElementById('mobile-menu-btn');
const navCenter = document.querySelector('.nav-center');

if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        // Simple toggle for demo
        const isHidden = navCenter.style.display === 'none' || navCenter.style.display === '';
        if(isHidden) {
            navCenter.style.display = 'flex';
            navCenter.style.flexDirection = 'column';
            navCenter.style.position = 'absolute';
            navCenter.style.top = '100%';
            navCenter.style.left = '0';
            navCenter.style.width = '100%';
            navCenter.style.background = 'rgba(10, 15, 30, 0.95)';
            navCenter.style.padding = '20px';
        } else {
            navCenter.style.display = '';
            navCenter.style.flexDirection = '';
            navCenter.style.position = '';
        }
    });
}
