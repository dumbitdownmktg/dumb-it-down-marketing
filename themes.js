/*
  DUMB IT DOWN MARKETING - THEME SWITCHER
  =========================================
  Add this ONE line to every page just before </body>:
  <script src="themes.js"></script>

  Adds a theme toggle to the nav. Remembers choice across pages.
  Three themes: default (boring and basic), cats, kawaii.
*/

(function () {

  const STORAGE_KEY = 'didm_theme';

  const THEMES = {
    default: {
      label: 'Boring & Basic',
      emoji: '😐',
      colors: {},
      font: null,
      decorations: [],
      sound: null,
    },
    cats: {
      label: 'Cats Mode',
      emoji: '🐱',
      colors: {
        '--yellow':      '#ff9a3c',
        '--yellow-dark': '#e07800',
        '--black':       '#2d1b00',
        '--white':       '#fff9f0',
        '--gray-light':  '#f5e6d3',
      },
      decorations: ['🐱','🐾','😸','🐈','🐟','😻','🐈‍⬛','🐾'],
      sound: 'meow',
      cursor: '🐾',
    },
    kawaii: {
      label: 'Kawaii Mode',
      emoji: '✨',
      colors: {
        '--yellow':      '#ff85c2',
        '--yellow-dark': '#d4006a',
        '--black':       '#2d0028',
        '--white':       '#fff0f9',
        '--gray-light':  '#fde8f4',
        '--green':       '#a855f7',
      },
      decorations: ['✨','🌸','💖','🎀','🌷','💕','🍡','🌈'],
      sound: 'squeak',
      cursor: '🌸',
    },
  };

  // ---- AUDIO ----
  // Generate sounds via Web Audio API so no external files needed
  function playMeow() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';

      // meow: rise then fall
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
  }

  function playSqueak() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.1, 0.2].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + offset * 200, ctx.currentTime + offset);
        osc.frequency.linearRampToValueAtTime(1200 + offset * 100, ctx.currentTime + offset + 0.05);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + offset + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + offset);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + offset + 0.12);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.12);
      });
    } catch(e) {}
  }

  function playSound(theme) {
    if (theme === 'cats')   playMeow();
    if (theme === 'kawaii') playSqueak();
  }

  // ---- APPLY THEME ----
  function applyTheme(name, withSound) {
    const theme = THEMES[name];
    const root  = document.documentElement;

    // remove old theme classes
    document.body.classList.remove('theme-cats', 'theme-kawaii', 'theme-default');
    document.body.classList.add('theme-' + name);

    // apply CSS vars
    Object.keys(theme.colors || {}).forEach(k => root.style.setProperty(k, theme.colors[k]));

    // reset vars not in this theme
    const allVars = ['--yellow','--yellow-dark','--black','--white','--gray-light','--green'];
    allVars.forEach(v => {
      if (!theme.colors || !theme.colors[v]) root.style.removeProperty(v);
    });

    // floating decorations
    removeDecorations();
    if (theme.decorations && theme.decorations.length) {
      spawnDecorations(name, theme.decorations);
    }

    // sound
    if (withSound && theme.sound) playSound(name);

    // update nav button
    updateNavButton(name);

    // save
    localStorage.setItem(STORAGE_KEY, name);
  }

  // ---- DECORATIONS ----
  function removeDecorations() {
    document.querySelectorAll('.didm-deco').forEach(el => el.remove());
    if (window._decoInterval) { clearInterval(window._decoInterval); window._decoInterval = null; }
  }

  function injectDecoStyles() {
    if (document.getElementById('didm-deco-style')) return;
    const s = document.createElement('style');
    s.id = 'didm-deco-style';
    s.textContent = `
      @keyframes didm-fall {
        0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 0.85; }
        100% { transform: translateY(108vh) rotate(360deg); opacity: 0; }
      }
      @keyframes didm-fall-photo {
        0%   { transform: translateY(0) rotate(-3deg); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.9; }
        100% { transform: translateY(108vh) rotate(5deg); opacity: 0; }
      }
      .didm-deco {
        position: fixed; pointer-events: none; z-index: 9990; user-select: none;
      }
      .didm-deco-emoji {
        animation: didm-fall var(--dur, 5s) linear forwards;
      }
      .didm-deco-cat-photo {
        width: 88px; height: 88px;
        object-fit: cover;
        border: 3px solid white;
        border-radius: 3px;
        box-shadow: 2px 4px 10px rgba(0,0,0,0.22);
        animation: didm-fall-photo var(--dur, 6s) linear forwards;
        background: #f5e6d3;
      }
    `;
    document.head.appendChild(s);
  }

  function spawnCatPhoto() {
    injectDecoStyles();
    const wrap = document.createElement('div');
    wrap.className = 'didm-deco';
    const dur = 5 + Math.random() * 4;
    wrap.style.cssText = `left:${2 + Math.random() * 88}vw;top:-110px;--dur:${dur}s`;

    const img = document.createElement('img');
    img.className = 'didm-deco-cat-photo';
    // cataas.com - free cat image API, no key needed
    img.src = `https://cataas.com/cat?width=88&height=88&_=${Date.now()}-${Math.random()}`;
    img.alt = 'cat';
    img.onerror = () => {
      // if image fails, fall back to a cat emoji
      img.remove();
      const em = document.createElement('div');
      em.className = 'didm-deco-emoji';
      em.style.cssText = `font-size:${28 + Math.random()*16}px;--dur:${dur}s`;
      em.textContent = ['🐱','😸','🐈','😻','🐾'][Math.floor(Math.random()*5)];
      wrap.appendChild(em);
    };
    wrap.appendChild(img);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), (dur + 0.5) * 1000);
  }

  function spawnEmoji(emojis) {
    injectDecoStyles();
    const wrap = document.createElement('div');
    wrap.className = 'didm-deco';
    const dur = 4 + Math.random() * 4;
    wrap.style.cssText = `left:${2 + Math.random() * 92}vw;top:-40px;`;
    const em = document.createElement('div');
    em.className = 'didm-deco-emoji';
    em.style.cssText = `font-size:${18 + Math.random()*22}px;--dur:${dur}s`;
    em.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    wrap.appendChild(em);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), (dur + 0.5) * 1000);
  }

  function spawnDecorations(theme, emojis) {
    injectDecoStyles();

    function tick() {
      if (theme === 'cats') {
        // 2 real cat photos + 1 emoji per tick
        spawnCatPhoto();
        spawnCatPhoto();
        spawnEmoji(emojis);
      } else {
        // kawaii: emoji only
        spawnEmoji(emojis);
        spawnEmoji(emojis);
        spawnEmoji(emojis);
      }
    }

    // first burst
    for (let i = 0; i < 4; i++) setTimeout(tick, i * 400);
    window._decoInterval = setInterval(tick, 2500);
  }

  function injectNavButton() {
    if (document.getElementById('didm-theme-btn')) return;

    const saved = localStorage.getItem(STORAGE_KEY) || 'default';

    const wrap = document.createElement('div');
    wrap.id = 'didm-theme-wrap';
    wrap.style.cssText = 'position:relative;display:flex;align-items:center;margin-left:0.5rem;';

    wrap.innerHTML = `
      <button id="didm-theme-btn" title="Change the vibe" style="
        background: var(--black, #0f0f0f);
        color: var(--white, #f5f2eb);
        border: 1.5px solid var(--black, #0f0f0f);
        padding: 0.4rem 0.9rem;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
        transition: background 0.15s, color 0.15s;
      ">
        <span style="font-size:1rem" id="didm-theme-emoji">${THEMES[saved].emoji}</span>
        <span id="didm-theme-label">Change vibe</span>
        <span style="font-size:0.6rem;opacity:0.6">&#9660;</span>
      </button>
      <div id="didm-theme-menu" style="
        display: none;
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        background: var(--white, #f5f2eb);
        border: 1.5px solid var(--black, #0f0f0f);
        min-width: 200px;
        z-index: 500;
        flex-direction: column;
        box-shadow: 2px 4px 0 rgba(0,0,0,0.08);
      ">
        <div style="padding:0.6rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.68rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#888;border-bottom:1px solid var(--gray-light,#e8e4da)">Pick your vibe</div>
        ${Object.entries(THEMES).map(([key, t]) => `
          <button data-theme="${key}" style="
            display:flex;align-items:center;gap:0.85rem;
            padding:0.85rem 1rem;
            background:none;border:none;border-bottom:1px solid var(--gray-light,#e8e4da);
            font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:500;
            cursor:pointer;text-align:left;width:100%;color:inherit;
            transition:background 0.1s;
          "
          onmouseover="this.style.background='var(--gray-light,#e8e4da)'"
          onmouseout="this.style.background='none'">
            <span style="font-size:1.25rem">${t.emoji}</span>
            <div style="display:flex;flex-direction:column;gap:1px;text-align:left">
              <span style="font-weight:500">${t.label}</span>
              <span style="font-size:0.72rem;opacity:0.5">${key === 'default' ? 'The original. Boring on purpose.' : key === 'cats' ? 'Everything is better with cats.' : 'Pink. Sparkly. Chaotic.'}</span>
            </div>
          </button>
        `).join('')}
      </div>
    `;

    const nav = document.querySelector('nav');
    if (nav) nav.appendChild(wrap);

    const btn  = document.getElementById('didm-theme-btn');
    const menu = document.getElementById('didm-theme-menu');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = menu.style.display === 'flex';
      menu.style.display = isOpen ? 'none' : 'flex';
      menu.style.flexDirection = 'column';
    });

    document.addEventListener('click', () => { menu.style.display = 'none'; });

    menu.querySelectorAll('[data-theme]').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const name = item.dataset.theme;
        menu.style.display = 'none';
        applyTheme(name, true);
      });
    });
  }

  function updateNavButton(name) {
    const theme = THEMES[name];
    const emoji = document.getElementById('didm-theme-emoji');
    if (emoji) emoji.textContent = theme.emoji;

    // update button bg to match theme accent
    const btn = document.getElementById('didm-theme-btn');
    if (btn) {
      if (name === 'cats') {
        btn.style.background = '#ff9a3c';
        btn.style.borderColor = '#e07800';
        btn.style.color = '#2d1b00';
      } else if (name === 'kawaii') {
        btn.style.background = '#ff85c2';
        btn.style.borderColor = '#d4006a';
        btn.style.color = '#2d0028';
      } else {
        btn.style.background = 'var(--black, #0f0f0f)';
        btn.style.borderColor = 'var(--black, #0f0f0f)';
        btn.style.color = 'var(--white, #f5f2eb)';
      }
    }

    // highlight active in menu
    document.querySelectorAll('#didm-theme-menu [data-theme]').forEach(b => {
      b.style.fontWeight = b.dataset.theme === name ? '700' : '500';
      b.style.background = b.dataset.theme === name ? 'var(--gray-light,#e8e4da)' : 'none';
    });
  }

  // ---- INIT ----
  function init() {
    injectNavButton();
    const saved = localStorage.getItem(STORAGE_KEY) || 'default';
    applyTheme(saved, false); // no sound on page load
  }

  // wait for nav to exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
