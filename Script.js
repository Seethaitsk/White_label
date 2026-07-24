document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Navbar scrolled state ---------- */
    var nav = document.getElementById('mainNav');
    function onScroll() {
        if (window.scrollY > 40) {
            nav.classList.add('sr-scrolled');
        } else {
            nav.classList.remove('sr-scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Collapse mobile nav on link click ---------- */
    document.querySelectorAll('#navContent .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            var collapseEl = document.getElementById('navContent');
            if (collapseEl.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
                bsCollapse.hide();
            }
        });
    });

    /* ---------- Scroll reveal ---------- */
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('[data-reveal]');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('sr-in'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.classList.add('sr-in');
                    }, i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Hero multiplier ticker ---------- */
    var multiplierEl = document.getElementById('srMultiplier');
    if (multiplierEl && !prefersReducedMotion) {
        var mVal = 1.0;
        var mInterval = setInterval(function () {
            mVal += Math.random() * 0.35 + 0.05;
            if (mVal >= 9.5) {
                mVal = 1.0;
            }
            multiplierEl.innerHTML = mVal.toFixed(2) + '<span>x</span>';
        }, 90);
    }

    /* ---------- Stat counters ---------- */
    var statEls = document.querySelectorAll('.sr-stat-num');
    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    if (statEls.length) {
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            statEls.forEach(animateCount);
        } else {
            var statObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            statEls.forEach(function (el) { statObserver.observe(el); });
        }
    }

});