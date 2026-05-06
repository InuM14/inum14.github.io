/* ============================================================
   The Fighting Games Hub — masters.js
   Social Media + Projects dropdowns
   ============================================================ */

/* ------------------------------------------------------------
   DATA
   ------------------------------------------------------------ */
const SOCIALS = {
  twitch: {
    category:    "Twitch",
    title:       "InuM14",
    handle:      "@inum14",
    description: "Live streams covering fighting game ranked sessions, lab work, and casual play.",
    url:         "https://www.twitch.tv/inum14",
    buttonLabel: "Open Twitch Channel"
  },
  youtube: {
    category:    "YouTube",
    title:       "InuM14",
    handle:      "@real.InuM14",
    description: "Uploads featuring highlights, tech breakdowns, and longer-form fighting game content.",
    url:         "https://www.youtube.com/@real.InuM14",
    buttonLabel: "Open YouTube Channel"
  }
};

const PROJECTS = {
  combo: {
    category:    "Project",
    title:       "Universal Combo Builder",
    handle:      "In Development",
    description: "A tool for designing and visualizing combos across multiple fighting games. Aims to provide a shared format for notation regardless of the title being played.",
    url:         null,
    buttonLabel: "Coming Soon"
  },
  steam: {
    category:    "Project",
    title:       "Random Steam Game Launcher",
    handle:      "In Development",
    description: "Pulls a random title from your Steam library and launches it directly. Built for the indecisive — never stare at your library again.",
    url:         null,
    buttonLabel: "Coming Soon"
  },
  qr: {
    category:    "Project",
    title:       "QR Code Generator",
    handle:      "In Development",
    description: "A lightweight, no-frills QR code generator for any text or URL. Designed for quick personal use without ads or sign-ups.",
    url:         null,
    buttonLabel: "Coming Soon"
  }
};


/* ------------------------------------------------------------
   STATE
   ------------------------------------------------------------ */
const state = {
  social:  null,
  project: null,
  /* Tracks which control was used most recently
     so the detail card always shows the latest pick. */
  last:    null
};

const statusEl = document.getElementById('masterStatus');
const detailEl = document.getElementById('masterDetail');


/* ------------------------------------------------------------
   DROPDOWN WIRING
   ------------------------------------------------------------ */
document.querySelectorAll('.custom-select-btn').forEach(btn => {
  const wrapper = btn.closest('.custom-select-wrapper');
  const opts    = wrapper.querySelector('.custom-options');
  const control = btn.dataset.control;

  // Toggle open/closed
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = opts.classList.toggle('open');
    btn.classList.toggle('open', isOpen);

    document.querySelectorAll('.custom-options.open').forEach(o => {
      if (o !== opts) {
        o.classList.remove('open');
        o.closest('.custom-select-wrapper').querySelector('.custom-select-btn').classList.remove('open');
      }
    });
  });

  // Option select
  opts.querySelectorAll('.custom-option').forEach(opt => {
    opt.addEventListener('click', () => {
      btn.querySelector('.btn-label').textContent = opt.textContent.trim();
      opts.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opts.classList.remove('open');
      btn.classList.remove('open');

      state[control] = opt.dataset.value;
      state.last     = control;
      renderMaster();
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-options.open').forEach(o => {
    o.classList.remove('open');
    o.closest('.custom-select-wrapper').querySelector('.custom-select-btn').classList.remove('open');
  });
});


/* ------------------------------------------------------------
   RENDERING
   ------------------------------------------------------------ */
function setStatus(text) {
  statusEl.textContent = text;
}

function detailCardHTML(entry) {
  // External link button if URL exists, otherwise a disabled "coming soon" tag
  const action = entry.url
    ? `
      <a class="resource-link-btn" href="${entry.url}" target="_blank" rel="noopener">
        ${entry.buttonLabel}
        <span class="arrow">▶</span>
      </a>
    `
    : `
      <span class="price-source-badge badge-msrp" style="align-self:flex-start;margin-top:auto;">
        ${entry.buttonLabel}
      </span>
    `;

  return `
    <div class="resource-card panel">
      <span class="resource-tag">${entry.category}</span>
      <h2 class="resource-title">${entry.title}</h2>
      <p class="resource-author">${entry.handle}</p>
      <p class="resource-desc">${entry.description}</p>
      ${action}
      <span class="corner-bl"></span>
    </div>
  `;
}

function renderMaster() {
  const { social, project, last } = state;

  // Pull the entry from whichever dropdown was used last
  let entry = null;
  if (last === 'social'  && social)  entry = SOCIALS[social];
  if (last === 'project' && project) entry = PROJECTS[project];

  if (!entry) {
    setStatus('Select a social platform or project to learn more.');
    detailEl.innerHTML = `
      <div class="panel resource-empty">
        <span class="resource-empty-icon">🥋</span>
        <span class="resource-empty-text">Awaiting selection</span>
      </div>
    `;
    return;
  }

  setStatus(`Showing ${entry.category}: ${entry.title}.`);
  detailEl.innerHTML = detailCardHTML(entry);
}
