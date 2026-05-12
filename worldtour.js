/* ============================================================
   The Fighting Games Hub — worldtour.js
   Game selector + external resource cards
   ============================================================ */

/* ------------------------------------------------------------
   GAME META
   ------------------------------------------------------------ */
const GAME_NAMES = {
  sf6:    "Street Fighter 6",
  t8:     "Tekken 8",
  ggst:   "Guilty Gear Strive",
  ffcotw: "Fatal Fury: City of the Wolves"
};


/* ------------------------------------------------------------
   RESOURCE DATA
   - Each entry is one external link.
   - Add more entries to any game's array as needed.
   ------------------------------------------------------------ */
const RESOURCES = {
  sf6: [
    {
      category:    "Glossary",
      title:       "The Fighting Game Glossary",
      author:      "Infil",
      description: "Over 1,000 carefully defined fighting game terms with video examples and Japanese translations. Filtered to the Street Fighter franchise — every term you'll hear during an SF6 stream, match commentary, or Discord conversation.",
      url:         "https://glossary.infil.net/?g=SF"
    },
    {
      category:    "Community",
      title:       "Street Fighter Official Discord",
      author:      "Capcom",
      description: "The official Street Fighter Discord server. Find matchmaking, character-specific discussion, tournament announcements, and a direct line to the wider SF6 community.",
      url:         "https://discord.gg/streetfighter"
    }
  ],

  t8: [
    {
      category:    "Glossary",
      title:       "The Fighting Game Glossary",
      author:      "Infil",
      description: "Over 1,000 carefully defined fighting game terms with video examples and Japanese translations. Filtered to the Tekken franchise — covers everything from Korean Backdash to Wave Dash, plus all the lingo unique to Tekken 8.",
      url:         "https://glossary.infil.net/?g=TK"
    },
    {
      category:    "Community",
      title:       "Tekken Official Discord",
      author:      "Bandai Namco",
      description: "The official Tekken Discord server. A hub for Tekken 8 players of all levels — matchmaking, character channels, patch discussion, and tournament coverage.",
      url:         "https://discord.gg/tekkenofficial"
    }
  ],

  ggst: [
    {
      category:    "Glossary",
      title:       "The Fighting Game Glossary",
      author:      "Infil",
      description: "Over 1,000 carefully defined fighting game terms with video examples and Japanese translations. Filtered to the Guilty Gear franchise — covers Roman Cancels, Gatlings, Faultless Defense, and the rest of Strive's mechanics.",
      url:         "https://glossary.infil.net/?g=GG"
    },
    {
      category:    "Community",
      title:       "Guilty Gear Strive Community Discord",
      author:      "Community",
      description: "The central community Discord for Guilty Gear Strive. Includes character-specific channels, combo labs, resource sharing, and matchmaking for all skill levels.",
      url:         "https://discord.gg/ggstcommunity"
    }
  ],

  ffcotw: [
    {
      category:    "Glossary",
      title:       "The Fighting Game Glossary",
      author:      "Infil",
      description: "Over 1,000 carefully defined fighting game terms with video examples and Japanese translations. Filtered to the Fatal Fury franchise — includes the new terminology added for City of the Wolves, like Brave Counter and the REV system.",
      url:         "https://glossary.infil.net/?g=FF"
    },
    {
      category:    "Community",
      title:       "Fatal Fury Official Discord",
      author:      "SNK",
      description: "The official Fatal Fury Discord server. Stay up to date on City of the Wolves news, connect with the community, and find matches and discussion for all skill levels.",
      url:         "https://discord.gg/fatalfury"
    }
  ]
};


/* ------------------------------------------------------------
   STATE
   ------------------------------------------------------------ */
const state = { game: null };

const statusEl = document.getElementById('worldtourStatus');
const listEl   = document.getElementById('resourceList');


/* ------------------------------------------------------------
   DROPDOWN WIRING
   ------------------------------------------------------------ */
document.querySelectorAll('.custom-select-btn').forEach(btn => {
  const wrapper = btn.closest('.custom-select-wrapper');
  const opts    = wrapper.querySelector('.custom-options');
  const control = btn.dataset.control;

  // Toggle open
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
      renderTour();
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

function resourceCardHTML(resource) {
  return `
    <div class="resource-card panel">
      <span class="resource-tag">${resource.category}</span>
      <h2 class="resource-title">${resource.title}</h2>
      <p class="resource-author">${resource.author}</p>
      <p class="resource-desc">${resource.description}</p>
      <a class="resource-link-btn" href="${resource.url}" target="_blank" rel="noopener">
        Visit Resource
        <span class="arrow">▶</span>
      </a>
      <span class="corner-bl"></span>
    </div>
  `;
}

function renderTour() {
  const { game } = state;

  if (!game) {
    setStatus('Select a game to see curated external resources.');
    listEl.innerHTML = `
      <div class="panel resource-empty">
        <span class="resource-empty-icon">🌍</span>
        <span class="resource-empty-text">Awaiting selection</span>
      </div>
    `;
    return;
  }

  const resources = RESOURCES[game] || [];
  const gameName  = GAME_NAMES[game];

  if (resources.length === 0) {
    setStatus(`No resources listed yet for ${gameName}.`);
    listEl.innerHTML = `
      <div class="panel resource-empty">
        <span class="resource-empty-icon">🚧</span>
        <span class="resource-empty-text">Resources coming soon</span>
      </div>
    `;
    return;
  }

  setStatus(
    `Showing ${resources.length} resource${resources.length === 1 ? '' : 's'} for ${gameName}.`
  );
  listEl.innerHTML = resources.map(resourceCardHTML).join('');
}
