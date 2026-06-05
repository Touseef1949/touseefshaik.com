/**
 * touseefshaik.com - Minimal JS for interactions
 * No frameworks. Vanilla ES6. Progressive enhancement.
 */

// ============================================
// Smooth scroll for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.focus({ preventScroll: true });
        }
    });
});

// ============================================
// Card hover effects (enhanced)
// ============================================
const cards = document.querySelectorAll('.app-card, .pattern-card, .stack-category');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ============================================
// Reveal on scroll (Intersection Observer)
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.app-card, .pattern-card, .stack-category, .next-phase, .next-apps, .monetization-philosophy, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 600ms ease, transform 600ms ease';
        revealObserver.observe(el);
    });

    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Copy code blocks
// ============================================
document.querySelectorAll('code').forEach(code => {
    if (code.parentElement.tagName === 'PRE') return; // Skip pre blocks
    
    code.style.cursor = 'pointer';
    code.title = 'Click to copy';
    
    code.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(code.textContent);
            const original = code.textContent;
            code.textContent = 'Copied!';
            code.style.color = 'var(--accent)';
            setTimeout(() => {
                code.textContent = original;
                code.style.color = '';
            }, 1500);
        } catch (e) {
            console.warn('Copy failed:', e);
        }
    });
});

// ============================================
// Table keyboard navigation
// ============================================
document.querySelectorAll('.apps-table').forEach(table => {
    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell, i) => {
        cell.tabIndex = 0;
        cell.addEventListener('keydown', (e) => {
            const cols = table.querySelectorAll('tr:first-child th, tr:first-child td').length;
            let target = null;
            
            switch (e.key) {
                case 'ArrowRight':
                    target = cells[i + 1];
                    break;
                case 'ArrowLeft':
                    target = cells[i - 1];
                    break;
                case 'ArrowDown':
                    target = cells[i + cols];
                    break;
                case 'ArrowUp':
                    target = cells[i - cols];
                    break;
            }
            
            if (target) {
                e.preventDefault();
                target.focus();
            }
        });
    });
});

// ============================================
// External link indicator
// ============================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.querySelector('.external-icon')) {
        const icon = document.createElement('span');
        icon.className = 'external-icon';
        icon.innerHTML = ' ↗';
        icon.style.fontSize = '0.7em';
        icon.style.opacity = '0.6';
        link.appendChild(icon);
    }
});

// ============================================
// Console welcome
// ============================================
console.log(`
%ctouseefshaik.com Lab
%cAI App Factory for Product Workflows
%c5 Live Apps • 5 Patterns • 12+ Yrs Fintech
%cBuilt with vanilla HTML/CSS/JS — no frameworks
`, 
'font-size: 14px; font-weight: bold; color: #00d4aa;',
'font-size: 12px; color: #e8e8ed;',
'font-size: 11px; color: #7a7a8a;',
'font-size: 10px; color: #7a7a8a; font-style: italic;'
);