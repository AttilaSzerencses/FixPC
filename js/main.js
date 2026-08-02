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

    // ── Portfolio filter ───────────────────────────────────
    window.filterPortfolio = function (category, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const show = category === 'all' || item.dataset.category === category;
            item.style.display = show ? '' : 'none';
        });
    };

    // ── Bootstrap modalok – nyitas/zaras, arva backdrop elleni vedelem ──
    //
    // Oka: "new bootstrap.Modal(el)" minden kattintasra UJ peldanyt hozott
    // letre ahelyett, hogy az elemhez mar tartozo peldanyt hasznalta volna
    // ujra. Ha valaki meg a nyitasi animacio kozben (kb. 300 ms-en belul)
    // rakattintott az X gombra, a Bootstrap sajat belso "_isTransitioning"
    // vedelme CSENDBEN eldobta a hide() hivast: a modal latszolag nem
    // reagalt, egy lathatatlan .modal-backdrop pedig ott ragadt a body-n,
    // ami blokkolta az egesz oldal kattinthatosagat.
    //
    // Megoldas ket reteg:
    //   1) getOrCreateInstance: egyetlen Modal-peldany elemenkent, es uj
    //      modal nyitasa elott minden mas nyitva maradt modal bezarasa.
    //   2) Kenyszeritett utolagos ellenorzes: fix keslelteles utan, a
    //      Bootstrap belso allapotatol fuggetlenul, kezzel bezarjuk a
    //      modalt (ha meg "nyitva" allna) es eltavolitunk minden arva
    //      backdrop-ot. Ez akkor is helyreallitja a lapot, ha a hide()
    //      hivast a fenti vedelem csendben eldobta.

    function resetBodyLock() {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
    }

    function forceCloseModal(modalEl) {
        if (!modalEl) return;
        const instance = bootstrap.Modal.getInstance(modalEl);
        if (instance) instance.hide();
        // Fuggetlenul attol, hogy a fenti hide() lefutott-e, kezzel is
        // biztositjuk, hogy a modal ne maradjon lathato allapotban.
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.removeAttribute('aria-modal');
        modalEl.removeAttribute('role');
    }

    function reconcileBackdrops() {
        const shown = document.querySelectorAll('.modal.show').length;
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (shown === 0) {
            backdrops.forEach(bd => bd.remove());
            resetBodyLock();
        } else if (backdrops.length > shown) {
            Array.from(backdrops).slice(0, backdrops.length - shown).forEach(bd => bd.remove());
        }
    }

    window.openModal = function (id) {
        const el = document.getElementById(id);
        if (!el) return;

        // minden mas nyitva levo modal azonnali bezarasa, hogy sose
        // halmozodhasson tobb backdrop egymasra
        document.querySelectorAll('.portfolio-modal.show').forEach(other => {
            if (other !== el) forceCloseModal(other);
        });
        reconcileBackdrops();

        bootstrap.Modal.getOrCreateInstance(el).show();
    };

    document.querySelectorAll('.portfolio-modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', reconcileBackdrops);
    });

    // Kenyszeritett zaras minden X-gombra vagy Escape-re torteno zarasi
    // kiserlet utan, fix keslelteles utan - fuggetlenul attol, hogy a
    // Bootstrap sajat hide() hivasa lefutott-e vagy csendben eldobodott.
    document.addEventListener('click', event => {
        const btn = event.target.closest('[data-bs-dismiss="modal"]');
        if (!btn) return;
        const modalEl = btn.closest('.portfolio-modal');
        setTimeout(() => { forceCloseModal(modalEl); reconcileBackdrops(); }, 400);
    });
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const openModalEl = document.querySelector('.portfolio-modal.show');
        setTimeout(() => { forceCloseModal(openModalEl); reconcileBackdrops(); }, 400);
    });

});
