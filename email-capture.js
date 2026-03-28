/*
  DUMB IT DOWN MARKETING - EMAIL CAPTURE
  ========================================
  Add this ONE line to the bottom of calculator.html, funnel.html, and 5ps.html
  just before the closing </body> tag:

  <script src="email-capture.js"></script>

  It injects a signup section right after the results appear on the page.
  No popup. No interruption. Just there when they need it.
*/

(function () {
  const STORAGE_KEY   = 'didm_emails';
  const SIGNED_UP_KEY = 'didm_signed_up';

  function getEmails() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }

  function saveEmail(email, source) {
    const emails = getEmails();
    if (!emails.find(e => e.email === email)) {
      emails.push({ email, source, date: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    }
    localStorage.setItem(SIGNED_UP_KEY, '1');
  }

  function getSource() {
    const p = window.location.pathname;
    if (p.includes('calculator')) return 'Cost Per Lead Calculator';
    if (p.includes('funnel'))     return 'Lead Funnel Visualizer';
    if (p.includes('5ps'))        return 'The 5 Ps Diagnostic';
    return 'Homepage';
  }

  function alreadySignedUp() {
    return !!localStorage.getItem(SIGNED_UP_KEY);
  }

  function injectStyles() {
    if (document.getElementById('didm-styles')) return;
    const s = document.createElement('style');
    s.id = 'didm-styles';
    s.textContent = `
      #didm-capture {
        border-top: 1.5px solid #0f0f0f;
        background: #0f0f0f;
        color: #f5f2eb;
        padding: 3rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
        margin-top: 2rem;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }

      #didm-capture.visible {
        opacity: 1;
        transform: translateY(0);
      }

      #didm-capture-left {}

      #didm-capture-eyebrow {
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        margin-bottom: 0.75rem;
        font-family: 'DM Sans', sans-serif;
      }

      #didm-capture-headline {
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1;
        letter-spacing: 0.02em;
        color: #f2c94c;
        margin-bottom: 1rem;
      }

      #didm-capture-sub {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem;
        font-weight: 300;
        color: rgba(255,255,255,0.55);
        line-height: 1.7;
      }

      #didm-capture-sub strong {
        color: #f5f2eb;
        font-weight: 500;
      }

      #didm-capture-right {}

      #didm-capture-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      #didm-capture-input {
        width: 100%;
        padding: 0.9rem 1rem;
        border: 1.5px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.06);
        color: #f5f2eb;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
      }

      #didm-capture-input:focus {
        border-color: rgba(255,255,255,0.4);
      }

      #didm-capture-input::placeholder {
        color: rgba(255,255,255,0.2);
      }

      #didm-capture-error {
        display: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.78rem;
        color: #e84040;
        margin-top: -0.25rem;
      }

      #didm-capture-btn {
        width: 100%;
        padding: 0.95rem;
        background: #f2c94c;
        color: #0f0f0f;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        border: 1.5px solid #f2c94c;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
      }

      #didm-capture-btn:hover {
        background: #f5f2eb;
        border-color: #f5f2eb;
        color: #0f0f0f;
      }

      #didm-capture-fine {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.7rem;
        color: rgba(255,255,255,0.2);
        line-height: 1.5;
        text-align: center;
      }

      #didm-capture-success {
        display: none;
        text-align: center;
        padding: 1rem 0;
      }

      #didm-capture-success-icon {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 4rem;
        color: #2a9d5c;
        line-height: 1;
        margin-bottom: 0.75rem;
      }

      #didm-capture-success-msg {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        color: rgba(255,255,255,0.6);
        line-height: 1.7;
      }

      #didm-capture-success-msg strong {
        color: #f5f2eb;
        font-weight: 500;
      }

      #didm-already-signed-up {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: rgba(42,157,92,0.12);
        border: 1px solid rgba(42,157,92,0.25);
      }

      #didm-already-signed-up span {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.88rem;
        color: rgba(255,255,255,0.6);
        line-height: 1.5;
      }

      #didm-already-signed-up strong {
        color: #f5f2eb;
        font-weight: 500;
      }

      #didm-check {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.2rem;
        color: #2a9d5c;
        flex-shrink: 0;
      }

      @media (max-width: 768px) {
        #didm-capture {
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 2rem 1.5rem;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function buildCapture(container) {
    injectStyles();

    const wrap = document.createElement('div');
    wrap.id = 'didm-capture';

    const rightContent = alreadySignedUp()
      ? `<div id="didm-already-signed-up">
           <div id="didm-check">✓</div>
           <span><strong>You're already on the list.</strong> One email, once a month. Talk soon.</span>
         </div>`
      : `<div id="didm-capture-form">
           <input id="didm-capture-input" type="email" placeholder="your@email.com" autocomplete="email">
           <div id="didm-capture-error">That doesn't look like a valid email.</div>
           <button id="didm-capture-btn">Send me the monthly tip</button>
           <p id="didm-capture-fine">No spam. No selling your info. Unsubscribe anytime by replying "stop."</p>
         </div>
         <div id="didm-capture-success">
           <div id="didm-capture-success-icon">✓</div>
           <p id="didm-capture-success-msg"><strong>You're in.</strong> One email, once a month. No fluff, no pitch. Just one thing worth your time.</p>
         </div>`;

    wrap.innerHTML = `
      <div id="didm-capture-left">
        <div id="didm-capture-eyebrow">Stay in the loop</div>
        <div id="didm-capture-headline">One tip.<br>Once a month.<br>Actually useful.</div>
        <p id="didm-capture-sub">
          Every month I find <strong>one tool, resource, or idea</strong> worth a small business owner's time and send it in a single email. No fluff. No pitch. Just the thing.
        </p>
      </div>
      <div id="didm-capture-right">
        ${rightContent}
      </div>
    `;

    container.appendChild(wrap);

    // Animate in after paint
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('visible')));

    if (!alreadySignedUp()) {
      document.getElementById('didm-capture-btn').addEventListener('click', submit);
      document.getElementById('didm-capture-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') submit();
      });
    }

    function submit() {
      const input = document.getElementById('didm-capture-input');
      const err   = document.getElementById('didm-capture-error');
      const email = input.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.style.display = 'block';
        input.focus();
        return;
      }

      err.style.display = 'none';
      saveEmail(email, getSource());

      document.getElementById('didm-capture-form').style.display    = 'none';
      document.getElementById('didm-capture-success').style.display = 'block';
    }
  }

  // Watch for results to appear then inject below them
  function watchForResults() {
    let fired = false;

    const poll = setInterval(() => {
      if (fired) return;

      // Each tool has a different results container
      const resultsPanel  = document.getElementById('results-panel');   // calculator
      const funnelOutput  = document.getElementById('funnel-output');    // funnel
      const resultsWrap   = document.getElementById('results-wrap');     // 5ps

      // Check if results have actual content (not just empty state)
      const calcReady   = resultsPanel  && resultsPanel.querySelector('.big-moment');
      const funnelReady = funnelOutput  && funnelOutput.querySelector('.client-win');
      const psReady     = resultsWrap   && resultsWrap.classList.contains('active');

      const target = calcReady   ? resultsPanel
                   : funnelReady ? funnelOutput
                   : psReady     ? resultsWrap
                   : null;

      if (target && !document.getElementById('didm-capture')) {
        fired = true;
        clearInterval(poll);
        buildCapture(target);
      }
    }, 600);

    // Stop polling after 15 minutes
    setTimeout(() => clearInterval(poll), 900000);
  }

  watchForResults();

})();
