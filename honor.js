/*
  DUMB IT DOWN MARKETING — HONOR SYSTEM FLOATER
  Add <script src="honor.js"></script> before </body> on every page.
*/
(function() {
  if (document.getElementById('honor-wrap')) return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #honor-wrap {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 8000;
      display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
    }
    #honor-btn {
      background: var(--black, #0f0f0f); color: var(--yellow, #f2c94c);
      border: 1.5px solid var(--black, #0f0f0f);
      padding: 0.6rem 1.1rem; font-family: 'Bebas Neue', sans-serif;
      font-size: 0.95rem; letter-spacing: 0.08em; cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem;
      box-shadow: 2px 2px 0 rgba(0,0,0,0.15); transition: all 0.15s;
      white-space: nowrap;
    }
    #honor-btn:hover { background: var(--yellow, #f2c94c); color: var(--black, #0f0f0f); border-color: var(--yellow, #f2c94c); }
    #honor-panel {
      display: none; width: 300px;
      background: var(--white, #f5f2eb); border: 1.5px solid var(--black, #0f0f0f);
      box-shadow: 3px 3px 0 rgba(0,0,0,0.12);
    }
    #honor-panel.open { display: block; }
    .hp-head { background: var(--black, #0f0f0f); padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; }
    .hp-title { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.06em; color: var(--yellow, #f2c94c); }
    .hp-close { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0; }
    .hp-close:hover { color: white; }
    .hp-body { padding: 1.25rem; }
    .hp-cost { font-size: 0.78rem; color: var(--gray, #6b6b6b); line-height: 1.65; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light, #e8e4da); }
    .hp-cost strong { color: var(--black, #0f0f0f); font-weight: 500; }
    .hp-options { display: flex; flex-direction: column; gap: 0.5rem; }
    .hp-option { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.75rem 0.85rem; border: 1.5px solid var(--gray-light, #e8e4da); cursor: pointer; text-decoration: none; transition: all 0.15s; }
    .hp-option:hover { border-color: var(--black, #0f0f0f); }
    .hp-option.primary { background: var(--black, #0f0f0f); border-color: var(--black, #0f0f0f); }
    .hp-option.primary:hover { background: var(--yellow, #f2c94c); }
    .hp-option.primary .hp-opt-title { color: var(--yellow, #f2c94c); }
    .hp-option.primary:hover .hp-opt-title { color: var(--black, #0f0f0f); }
    .hp-option.primary .hp-opt-sub { color: rgba(255,255,255,0.45); }
    .hp-option.primary:hover .hp-opt-sub { color: rgba(0,0,0,0.55); }
    .hp-opt-title { font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem; letter-spacing: 0.05em; color: var(--black, #0f0f0f); }
    .hp-opt-sub { font-size: 0.72rem; color: var(--gray, #6b6b6b); line-height: 1.45; }
    .hp-skip { text-align: center; margin-top: 0.75rem; font-size: 0.72rem; color: var(--gray, #6b6b6b); line-height: 1.55; }
    .hp-skip a { color: var(--gray, #6b6b6b); }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'honor-wrap';
  wrap.innerHTML = `
    <div id="honor-panel">
      <div class="hp-head">
        <span class="hp-title">Keep this free</span>
        <button class="hp-close" onclick="document.getElementById('honor-panel').classList.remove('open')">&#215;</button>
      </div>
      <div class="hp-body">
        <p class="hp-cost">
          Honest answer: <strong>this costs about $200/month to run.</strong> No ads, no paywalls, no VC money. Just Zach paying out of pocket so small business owners have access to tools that actually work. If something here saved you a bad decision or a wasted dollar, here are three ways to pay it forward.
        </p>
        <div class="hp-options">
          <a href="https://venmo.com/u/zachary-maldonado-6" target="_blank" class="hp-option primary">
            <span class="hp-opt-title">&#36;49 on Venmo — once, forever</span>
            <span class="hp-opt-sub">Every tool, every update, forever. Honestly the best deal in marketing education.</span>
          </a>
          <div class="hp-option" onclick="shareLink()">
            <span class="hp-opt-title">Share it with one person</span>
            <span class="hp-opt-sub">Know a business owner who'd get value from this? Send them the link. That's worth more than money.</span>
          </div>
          <div class="hp-option" onclick="document.getElementById('honor-panel').classList.remove('open')">
            <span class="hp-opt-title">Keep browsing for free</span>
            <span class="hp-opt-sub">No judgment. Maybe you're just starting out. Maybe times are tight. It's all still here for you.</span>
          </div>
        </div>
        <p class="hp-skip">The only thing that would actually hurt is if you found this useful and never told anyone about it.</p>
      </div>
    </div>
    <button id="honor-btn" onclick="toggleHonor()">
      <span>&#9733;</span> Keep this free
    </button>
  `;
  document.body.appendChild(wrap);

  function toggleHonor() {
    document.getElementById('honor-panel').classList.toggle('open');
  }
  window.toggleHonor = toggleHonor;

  window.shareLink = function() {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: 'Dumb It Down Marketing', text: 'Free marketing tools for small businesses. Actually useful.', url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert('Link copied! Now send it to someone who needs it.'));
    }
  };
})();
