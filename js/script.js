const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const mobileToggle = document.querySelector('.mobile-toggle');
const navPanel = document.querySelector('.nav-panel');
if (mobileToggle && navPanel) {
    mobileToggle.addEventListener('click', () => {
        const isOpen = navPanel.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    });
    navPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navPanel.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }));
}

document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', event => {
        event.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        dropdown.classList.toggle('open');
    });
});

document.addEventListener('click', event => {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
        if (!dropdown.contains(event.target)) dropdown.classList.remove('open');
    });
});

const progress = document.querySelector('.scroll-progress span');
const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .12 });
    revealItems.forEach(item => revealObserver.observe(item));
}

const countUp = element => {
    const target = Number(element.dataset.count || 0);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    if (reduceMotion) {
        element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        return;
    }
    const duration = 1300;
    const start = performance.now();
    const tick = now => {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        element.textContent = `${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`;
        if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .6 });
    counters.forEach(counter => counterObserver.observe(counter));
}

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.toggle('open');
        question.setAttribute('aria-expanded', String(isOpen));
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const status = contactForm.querySelector('.form-status');
        if (status) status.textContent = 'Thank you — your enquiry is ready for our team to review.';
        contactForm.reset();
    });
}

document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
});
