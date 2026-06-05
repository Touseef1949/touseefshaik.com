/**
 * touseefshaik.com - Vanilla ES6 interactions
 * No frameworks. Progressive enhancement.
 */

// ============================================
// Newsletter form (global function — wired via inline onsubmit in HTML)
// ============================================
const NEWSLETTER_API_KEY = '4318bdce-37b8-4331-bfb4-1f835d5a2fe3';
const NEWSLETTER_API_URL = 'https://api.buttondown.email/v1/subscribers';

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
// Reveal on scroll (Intersection Observer)
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced motion: reduce)').matches;

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

    document.querySelectorAll('.app-card, .pattern-card, .blog-card, .resource-card, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 600ms ease, transform 600ms ease';
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
}

// ============================================
// Console welcome
// ============================================
console.log('%ctouseefshaik.com Lab', 'font-size: 14px; font-weight: bold; color: #1863dc;');
console.log('%cAI tools and workflows for BAs, POs, and product teams. 5 live apps.', 'font-size: 11px; color: #6b6b7a;');
