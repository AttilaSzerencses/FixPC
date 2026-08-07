// FixPC – main.js
// Shared JS for index.html (HU) and index-en.html (EN)

document.addEventListener('DOMContentLoaded', function () {

    // ── Year ──────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Navbar scroll shrink ───────────────────────────────
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('navbar-scrolled', window.scrollY > 50);
        });
    }

    // ── Close mobile nav on outside tap ─────────────────────
    const navToggler = document.querySelector('.navbar-toggler');
    const navCollapseEl = document.getElementById('navResp');
    if (navToggler && navCollapseEl) {
        document.addEventListener('click', (e) => {
            const isOpen = navCollapseEl.classList.contains('show');
            if (!isOpen) return;
            if (navCollapseEl.contains(e.target) || navToggler.contains(e.target)) return;
            bootstrap.Collapse.getOrCreateInstance(navCollapseEl).hide();
        });
        navCollapseEl.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                bootstrap.Collapse.getOrCreateInstance(navCollapseEl).hide();
            });
        });
    }

    // ── Scroll fade-in ─────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(el => {
            if (el.isIntersecting) el.target.classList.add('visible');
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ── Active nav link on scroll ──────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 130) current = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    });

    // ── Google Maps scroll-trap guard: one click "wakes" the map ───
    document.querySelectorAll('[data-map-wake]').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.add('is-hidden');
            btn.setAttribute('tabindex', '-1');
            btn.setAttribute('aria-hidden', 'true');
        });
    });

    // ── Modal "contact" CTA: close the modal, then scroll to #contact ──
    const contactSection = document.getElementById('contact');
    document.querySelectorAll('.modal-contact-cta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalEl = btn.closest('.modal');
            if (modalEl && window.bootstrap) {
                const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
                modalEl.addEventListener('hidden.bs.modal', () => {
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                }, { once: true });
                instance.hide();
            } else {
                contactSection?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
