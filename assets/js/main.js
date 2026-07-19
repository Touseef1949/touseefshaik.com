/**
 * touseefshaik.com - Vanilla ES6 interactions
 * No frameworks. Progressive enhancement.
 */

// ============================================
// Newsletter form (global function — wired via inline onsubmit in HTML)
// ============================================
const NEWSLETTER_API_KEY = '4318bdce-37b8-4331-bfb4-1f835d5a2fe3';
const NEWSLETTER_API_URL = 'https://api.buttondown.email/v1/subscribers';

// Apply remote typography after the first rendered frame so font downloads do
// not delay meaningful content. The noscript fallback keeps fonts available
// when JavaScript is disabled.
const fontStylesheet = document.querySelector('[data-font-stylesheet]');
if (fontStylesheet) {
    window.addEventListener('load', function() {
        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(function() {
                fontStylesheet.media = 'all';
            });
        });
    }, { once: true });
}

async function submitNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = document.getElementById('newsletter-btn');
    const msgEl = document.getElementById('newsletter-msg');
    
    if (!emailInput) return false;
    const email = emailInput.value.trim();
    if (!email) return false;
    
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';
    }
    if (msgEl) {
        msgEl.style.color = 'var(--fg-muted)';
        msgEl.textContent = 'Submitting...';
    }
    
    try {
        const response = await fetch(NEWSLETTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + NEWSLETTER_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email_address: email })
        });
        
        if (response.ok || response.status === 201) {
            if (form) {
                form.innerHTML = '<p style="color: var(--accent); font-weight: 600; padding: 16px 0;">✓ Subscribed! Check your email to confirm.</p>';
            }
            return false;
        }
        
        let errMsg = 'Subscription failed. Please try again.';
        try {
            const data = await response.json();
            if (data) {
                if (Array.isArray(data.email_address) && data.email_address[0]) errMsg = data.email_address[0];
                else if (data.detail) errMsg = data.detail;
            }
        } catch (_) {}
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
        if (msgEl) {
            msgEl.style.color = '#dc2626';
            msgEl.textContent = errMsg;
        }
        return false;
    } catch (err) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
        if (msgEl) {
            msgEl.style.color = '#dc2626';
            msgEl.textContent = 'Network error. Please try again.';
        }
        return false;
    }
}

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
// Mobile nav toggle
// ============================================
(function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    
    function setOpen(open) {
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = document.body.classList.contains('nav-open');
        setOpen(!isOpen);
    });
    
    // Close menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            setOpen(false);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            setOpen(false);
        }
    });
    
    // Close menu when the viewport crosses out of the mobile breakpoint.
    const mobileViewport = window.matchMedia('(max-width: 768px)');
    mobileViewport.addEventListener('change', function(event) {
        if (!event.matches) setOpen(false);
    });
})();

// ============================================
// Privacy-safe conversion event contract
// ============================================
document.addEventListener('click', function(event) {
    const link = event.target.closest('[data-event]');
    if (!link) return;

    const detail = {
        name: link.dataset.event,
        path: window.location.pathname,
    };

    window.dispatchEvent(new CustomEvent('site:conversion', { detail }));

    // If a privacy-friendly analytics provider is configured later, it can
    // expose this standard function without changing the page markup.
    if (typeof window.plausible === 'function') {
        window.plausible(detail.name, { props: { path: detail.path } });
    }
});

// ============================================
// Console welcome
// ============================================
console.log('%ctouseefshaik.com Products', 'font-size: 14px; font-weight: bold; color: #2450A4;');
console.log('%cAI tools and workflows for BAs, POs, and product teams. Three public flagship products.', 'font-size: 11px; color: #55503F;');
