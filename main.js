/* ============================================
   ALMIGHTY LINUX — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // --- Stat counter animation ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (statNumbers.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => statObserver.observe(el));
    }

    // --- Fade-in on scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // --- Hero particles ---
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 15 + 10) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            particleContainer.appendChild(p);
        }
    }

    // --- Lightbox for gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = '<img src="" alt="Preview">';
        document.body.appendChild(overlay);

        const lightboxImg = overlay.querySelector('img');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    overlay.classList.add('active');
                }
            });
        });

        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.classList.remove('active');
        });
    }

    // --- Tool search & filter (source + category) ---
    const searchInput = document.getElementById('toolSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catBtns = document.querySelectorAll('.cat-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolCountEl = document.getElementById('toolCount');

    if (searchInput && toolCards.length > 0) {
        let activeFilter = 'all';
        let activeCat = 'all';

        const filterTools = () => {
            const query = searchInput.value.toLowerCase().trim();
            let visible = 0;

            toolCards.forEach(card => {
                const name = (card.getAttribute('data-name') || '').toLowerCase();
                const desc = (card.getAttribute('data-desc') || '').toLowerCase();
                const source = card.getAttribute('data-source') || '';
                const category = (card.getAttribute('data-category') || '').toLowerCase();

                const matchSearch = !query || name.includes(query) || desc.includes(query) || category.includes(query);
                const matchFilter = activeFilter === 'all' || source === activeFilter;
                const matchCat = activeCat === 'all' || category === activeCat;

                if (matchSearch && matchFilter && matchCat) {
                    card.style.display = '';
                    visible++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (toolCountEl) {
                toolCountEl.innerHTML = `Showing <strong>${visible}</strong> of <strong>${toolCards.length}</strong> tools`;
            }
        };

        searchInput.addEventListener('input', filterTools);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.getAttribute('data-filter');
                filterTools();
            });
        });

        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCat = btn.getAttribute('data-cat');
                filterTools();
            });
        });
    }

    // --- Docs sidebar active tracking ---
    const docsSections = document.querySelectorAll('.docs-section');
    const docsNavLinks = document.querySelectorAll('.docs-nav a');

    if (docsSections.length > 0 && docsNavLinks.length > 0) {
        const docsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    docsNavLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' });

        docsSections.forEach(sec => docsObserver.observe(sec));
    }

    // --- Newsletter RSS feed loading ---
    const feedContainer = document.getElementById('newsletterFeed');
    if (feedContainer) {
        const feeds = [
            { name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/' },
            { name: 'OSINT Me', url: 'https://osintme.com/index.php/feed/' },
            { name: 'Trace Labs', url: 'https://www.tracelabs.org/blog/rss.xml' }
        ];

        const rssProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';

        const loadFeeds = async () => {
            feedContainer.innerHTML = '<div class="feed-loading">Loading OSINT news feeds...</div>';
            let allItems = [];

            for (const feed of feeds) {
                try {
                    const resp = await fetch(rssProxy + encodeURIComponent(feed.url));
                    const data = await resp.json();
                    if (data.status === 'ok' && data.items) {
                        data.items.slice(0, 5).forEach(item => {
                            allItems.push({
                                source: feed.name,
                                title: item.title,
                                link: item.link,
                                date: item.pubDate,
                                desc: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200)
                            });
                        });
                    }
                } catch (e) {
                    // silently skip failed feeds
                }
            }

            allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allItems.length === 0) {
                feedContainer.innerHTML = '<div class="feed-loading">Unable to load feeds. RSS sources may be temporarily unavailable.</div>';
                return;
            }

            feedContainer.innerHTML = allItems.map(item => `
                <div class="feed-item">
                    <div class="feed-item-source">${item.source}</div>
                    <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
                    <div class="feed-item-date">${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    ${item.desc ? `<p class="feed-item-desc">${item.desc}...</p>` : ''}
                </div>
            `).join('');
        };

        loadFeeds();
    }
});
