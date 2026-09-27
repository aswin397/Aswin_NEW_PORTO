/**
 * Aswin Suresh — Portfolio JavaScript
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getNavHeight() {
  const desktopNav = document.getElementById('desktop-nav');
  const hamburgerNav = document.getElementById('hamburger-nav');
  if (desktopNav && desktopNav.offsetParent !== null) return desktopNav.offsetHeight;
  if (hamburgerNav && hamburgerNav.offsetParent !== null) return hamburgerNav.offsetHeight;
  return 0;
}

// ---------- Hamburger menu ----------
function toggleMenu() {
  document.querySelector(".menu-links").classList.toggle("open");
  document.querySelector(".hamburger-icon").classList.toggle("open");
}

// ---------- Smooth scrolling ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(this.getAttribute('href'));
    if (targetElement) {
      const navHeight = getNavHeight();
      const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (this.closest('.menu-links')) toggleMenu();
  });
});

// ---------- Active nav link on scroll ----------
function updateActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links li a, .menu-links li a');
  const scrollPosition = window.scrollY;
  const navHeight = getNavHeight();
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + section.offsetHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${currentSection}`);
  });
}

// ---------- Back to top button ----------
function addScrollToTopButton() {
  const button = document.createElement('button');
  button.id = 'back-to-top';
  button.innerHTML = '↑';
  button.title = 'Back to Top';
  button.classList.add('back-to-top-btn');
  document.body.appendChild(button);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

function toggleScrollToTopButton() {
  const button = document.getElementById('back-to-top');
  if (!button) return;
  if (window.scrollY > 500) {
    button.style.display = 'block';
    button.style.opacity = '1';
  } else {
    button.style.opacity = '0';
    setTimeout(() => { if (window.scrollY <= 500) button.style.display = 'none'; }, 300);
  }
}

// ---------- Skill bars ----------
function animateSkillBars() {
  document.querySelectorAll('#experience article').forEach(article => {
    if (article.querySelector('.skill-bar')) return;
    const level = article.querySelector('p').textContent.toLowerCase();

    const skillBar = document.createElement('div');
    skillBar.classList.add('skill-bar');
    const progress = document.createElement('div');
    progress.classList.add('progress');
    skillBar.appendChild(progress);
    article.appendChild(skillBar);

    let progressWidth = '50%';
    if (level.includes('experienced')) progressWidth = '92%';
    else if (level.includes('intermediate')) progressWidth = '70%';
    else if (level.includes('basic')) progressWidth = '40%';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => { progress.style.width = progressWidth; }, 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(skillBar);
  });
}

// ---------- Responsive base font ----------
function setupResponsiveFonts() {
  function adjustFontSize() {
    const width = window.innerWidth;
    document.documentElement.style.fontSize = `${width < 768 ? 14 : width < 1024 ? 15 : 16}px`;
  }
  adjustFontSize();
  window.addEventListener('resize', adjustFontSize);
}

// ---------- Sticky nav shadow ----------
function setupStickyNavigation() {
  const nav = document.getElementById('desktop-nav');
  const hamburgerNav = document.getElementById('hamburger-nav');
  function handleScroll() {
    const scrolled = window.scrollY > 10;
    nav.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,0.12)' : 'none';
    hamburgerNav.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,0.12)' : 'none';
  }
  window.addEventListener('scroll', handleScroll);
}

// ---------- Dark mode (synced across both nav toggles) ----------
function setupDarkMode() {
  const toggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')].filter(Boolean);
  if (!toggles.length) return;

  const applyMode = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    toggles.forEach(btn => btn.textContent = isDark ? '☀️' : '🌙');
  };

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      applyMode(isDark);
      localStorage.setItem('darkMode', isDark);
    });
  });

  applyMode(localStorage.getItem('darkMode') === 'true');
}

// ---------- Typing / rotating role text ----------
function setupTypingEffect() {
  const wrap = document.getElementById('typed-role');
  const target = document.getElementById('typed-text');
  if (!wrap || !target) return;
  const roles = (wrap.dataset.roles || '').split('|').filter(Boolean);
  if (!roles.length) return;

  if (reduceMotion) { target.textContent = roles[0]; return; }

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }
  tick();
}

// ---------- Hero particle network ----------
function setupParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const profile = document.getElementById('profile');
  let w, h, particles;

  function resize() {
    w = canvas.width = profile.offsetWidth;
    h = canvas.height = profile.offsetHeight;
    const count = Math.min(70, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function isDark() { return document.body.classList.contains('dark-mode'); }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const dotColor = isDark() ? 'rgba(255,255,255,0.5)' : 'rgba(20,126,251,0.55)';
    const lineColor = isDark() ? 'rgba(255,255,255,' : 'rgba(20,126,251,';

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lineColor}${1 - dist / 120})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ---------- Cursor glow ----------
function setupCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || reduceMotion) return;
  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// ---------- 3D tilt on cards ----------
function setupTiltCards() {
  if (reduceMotion) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ---------- Magnetic buttons ----------
function setupMagneticButtons() {
  if (reduceMotion) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', function () {
  addScrollToTopButton();
  animateSkillBars();
  setupResponsiveFonts();
  setupStickyNavigation();
  setupDarkMode();
  setupTypingEffect();
  setupParticles();
  setupCursorGlow();
  setupTiltCards();
  setupMagneticButtons();

  window.addEventListener('scroll', () => {
    updateActiveNavLinks();
    toggleScrollToTopButton();
  });

  console.log('Portfolio scripts initialized successfully!');
});
