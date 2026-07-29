/* Theme handling, typewriter tagline and subtle network background for sondreb.com */

function isDarkMode() {
    if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function initTheme() {
    const checkbox = document.getElementById('switch');

    if (isDarkMode()) {
        checkbox.checked = true;
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('theme-dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        document.body.classList.add('theme-light');
    }

    checkbox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.body.setAttribute('data-theme', 'dark');
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            localStorage.setItem('theme', 'light');
        }
        updateNetworkColor();
    });
}

function initTypewriter() {
    const element = document.querySelector('[data-type]');
    if (!element) return;

    const text = element.getAttribute('data-type');
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 35 + Math.random() * 40);
        }
    }

    setTimeout(type, 600);
}

function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    let isActive = true;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createParticles();
    }

    function createParticles() {
        const count = Math.min(Math.floor(width * height / 18000), 70);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function getColor() {
        const dark = document.body.getAttribute('data-theme') === 'dark';
        return dark ? 'rgba(243, 182, 35, 0.12)' : 'rgba(255, 140, 0, 0.10)';
    }

    function draw() {
        if (!isActive) return;
        ctx.clearRect(0, 0, width, height);
        const color = getColor();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = color.replace(/[\d.]+\)$/, (dist / 120 * 0.15).toFixed(3) + ')');
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            draw();
        }
    });

    window.updateNetworkColor = () => {
        // Triggered on theme change; color is read each frame.
    };

    resize();
    draw();
}

initTheme();
initTypewriter();
initNetworkCanvas();
