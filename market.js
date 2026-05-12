/* ============================================================
   The Fighting Games Hub — market.js
   Game/platform selectors, CheapShark API, price cards
   ============================================================ */

/* ------------------------------------------------------------
   GAME DATA
   - MSRPs for each platform (used as fallback / for consoles)
   - storeUrls link directly to each storefront
   - cheapsharkTitle is what we'll search for to get live PC prices
   ------------------------------------------------------------ */
const GAMES = {
  sf6: {
    name: "Street Fighter 6",
    cheapsharkTitle: "Street Fighter 6",
    note: null,
    platforms: {
      ps5:    { available: true,  base: 59.99, dlc: 84.99 },
      xbox:   { available: true,  base: 59.99, dlc: 84.99 },
      pc:     { available: true,  base: 59.99, dlc: 84.99 },
      switch: {
        available: true,
        base: 59.99,
        dlc:  59.99,
        note: "On Switch 2, sold as the Years 1-2 Fighters Edition — includes Season 1 & 2 DLC at the base-game price."
      }
    },
    storeUrls: {
      ps5:    "https://store.playstation.com/en-us/search/Street%20Fighter%206",
      xbox:   "https://www.xbox.com/en-US/Search?q=Street+Fighter+6",
      pc:     "https://store.steampowered.com/app/1364780/",
      switch: "https://www.nintendo.com/us/store/products/street-fighter-6-years-1-2-fighters-edition-switch-2/"
    }
  },

  t8: {
    name: "Tekken 8",
    cheapsharkTitle: "TEKKEN 8",
    note: null,
    platforms: {
      ps5:    { available: true,  base: 69.99, dlc: 109.99 },
      xbox:   { available: true,  base: 69.99, dlc: 109.99 },
      pc:     { available: true,  base: 69.99, dlc: 109.99 },
      switch: { available: false }
    },
    storeUrls: {
      ps5:  "https://store.playstation.com/en-us/search/Tekken%208",
      xbox: "https://www.xbox.com/en-US/Search?q=Tekken+8",
      pc:   "https://store.steampowered.com/app/1778820/"
    }
  },

  ggst: {
    name: "Guilty Gear Strive",
    cheapsharkTitle: "Guilty Gear Strive",
    note: null,
    platforms: {
      ps5:    { available: true,  base: 59.99, dlc: 99.99 },
      xbox:   { available: true,  base: 59.99, dlc: 99.99 },
      pc:     { available: true,  base: 59.99, dlc: 99.99 },
      switch: {
        available: true,
        base: 59.99,
        dlc:  80.96,
        note: "Switch version released January 23, 2025. DLC tier covers the base game plus three additional characters (Venom, Unika, Lucy) sold separately at $6.99 each."
      }
    },
    storeUrls: {
      ps5:    "https://store.playstation.com/en-us/search/Guilty%20Gear%20Strive",
      xbox:   "https://www.xbox.com/en-US/Search?q=Guilty+Gear+Strive",
      pc:     "https://store.steampowered.com/app/1384160/",
      switch: "https://www.nintendo.com/us/store/products/guilty-gear-strive-nintendo-switch-edition-switch/"
    }
  },

  ffcotw: {
    name: "Fatal Fury: City of the Wolves",
    cheapsharkTitle: "Fatal Fury City of the Wolves",
    note: "Sold only as the Special Edition, which includes the base game and Season Pass 1.",
    platforms: {
      ps5:    { available: true,  base: 59.99, dlc: 59.99 },
      xbox:   { available: true,  base: 59.99, dlc: 59.99 },
      pc:     { available: true,  base: 59.99, dlc: 59.99 },
      switch: { available: false }
    },
    storeUrls: {
      ps5:  "https://store.playstation.com/en-us/search/Fatal%20Fury%20City%20of%20the%20Wolves",
      xbox: "https://www.xbox.com/en-US/Search?q=Fatal+Fury+City+of+the+Wolves",
      pc:   "https://store.steampowered.com/search/?term=Fatal+Fury+City+of+the+Wolves"
    }
  }
};

const PLATFORM_LABELS = {
  ps5:    { name: "PlayStation 5",    store: "PlayStation Store" },
  xbox:   { name: "Xbox Series X|S",  store: "Microsoft Store"   },
  pc:     { name: "PC (Steam)",       store: "Steam"             },
  switch: { name: "Nintendo Switch 2",  store: "Nintendo eShop"    }
};


/* ------------------------------------------------------------
   STATE
   ------------------------------------------------------------ */
const state = {
  game: null,
  platform: null
};

const statusEl = document.getElementById('marketStatus');
const gridEl   = document.getElementById('priceGrid');


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
      renderMarket();
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
   STORE NAME LOOKUP
   ------------------------------------------------------------ */
const STORE_NAMES = {
  "1":  "Steam",
  "3":  "GreenManGaming",
  "7":  "GOG",
  "11": "Humble Store",
  "15": "Fanatical",
  "25": "Epic Games Store",
  "27": "Gamesplanet",
  "30": "IndieGala"
};


/* ------------------------------------------------------------
   CHEAPSHARK API — Steam price + cheapest elsewhere
   ------------------------------------------------------------ */
async function fetchLivePCPrices(title) {
  try {
    const url  = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=60`;
    const res  = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Filter out Deluxe / Ultimate / Year 1 / etc. variants
    const baseDeals = data.filter(d =>
      !/(deluxe|ultimate|year\s*1|complete|bundle|edition\s*pack|season\s*pass)/i.test(d.title)
    );
    const pool = baseDeals.length ? baseDeals : data;

    // Steam = storeID "1"
    const steamDeal = pool.find(d => d.storeID === "1");

    // Cheapest deal that is NOT Steam
    const elsewhereDeals = pool
      .filter(d => d.storeID !== "1")
      .sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice));
    const cheapestElsewhere = elsewhereDeals[0] || null;

    return {
      steam: steamDeal ? {
        sale:   parseFloat(steamDeal.salePrice),
        normal: parseFloat(steamDeal.normalPrice)
      } : null,
      elsewhere: cheapestElsewhere ? {
        sale:    parseFloat(cheapestElsewhere.salePrice),
        storeID: cheapestElsewhere.storeID,
        dealID:  cheapestElsewhere.dealID
      } : null
    };
  } catch (err) {
    console.error('CheapShark fetch failed:', err);
    return null;
  }
}


/* ------------------------------------------------------------
   RENDERING
   ------------------------------------------------------------ */
function setStatus(text, kind = '') {
  statusEl.textContent = text;
  statusEl.className   = 'market-status' + (kind ? ' ' + kind : '');
}

function renderEmpty() {
  gridEl.innerHTML = `
    <div class="price-empty">
      <span class="price-empty-icon">💰</span>
      <span class="price-empty-text">Awaiting selection</span>
    </div>
  `;
}

function renderUnavailable(gameName, platformName) {
  gridEl.innerHTML = `
    <div class="price-unavailable panel">
      <span class="price-unavailable-icon">🚫</span>
      <span class="price-unavailable-heading">Not Available</span>
      <span class="price-unavailable-body">
        ${gameName} is not available on ${platformName}. Try another platform.
      </span>
    </div>
  `;
}

function priceCardHTML({ tierLabel, msrp, steamPrice, elsewhere, storeUrl, storeName, note }) {
  const mainPrice   = steamPrice ? steamPrice.sale : msrp;
  const showCompare = steamPrice && steamPrice.sale < msrp;

  const badge = steamPrice
    ? '<span class="price-source-badge badge-live">Live · Steam</span>'
    : '<span class="price-source-badge badge-msrp">Standard MSRP</span>';

  const priceBlock = `
    <div class="price-display">
      <div class="price-amount">$${mainPrice.toFixed(2)}</div>
      ${showCompare ? `<div class="price-amount compare">$${msrp.toFixed(2)}</div>` : ''}
    </div>
    ${badge}
  `;

  const elsewhereBlock = (elsewhere && elsewhere.sale < mainPrice)
    ? `
      <a class="price-elsewhere"
         href="https://www.cheapshark.com/redirect?dealID=${elsewhere.dealID}"
         target="_blank" rel="noopener">
        Cheaper on ${STORE_NAMES[elsewhere.storeID] || 'another store'}:
        <strong>$${elsewhere.sale.toFixed(2)}</strong>
        <span class="arrow">▶</span>
      </a>
    `
    : '';

  const noteBlock = note ? `<p class="price-note">${note}</p>` : '';

  return `
    <div class="price-card panel">
      <div class="price-tier-label">${tierLabel}</div>
      ${priceBlock}
      ${elsewhereBlock}
      ${noteBlock}
      <a class="price-store-btn" href="${storeUrl}" target="_blank" rel="noopener">
        View on ${storeName}
        <span class="arrow">▶</span>
      </a>
      <span class="corner-bl"></span>
    </div>
  `;
}

async function renderMarket() {
  const { game, platform } = state;

  // Need both selections
  if (!game || !platform) {
    setStatus('Select a game and platform to see pricing.');
    renderEmpty();
    return;
  }

  const gameData = GAMES[game];
  const platData = gameData.platforms[platform];
  const platMeta = PLATFORM_LABELS[platform];

  // Platform unavailable for this game
  if (!platData.available) {
    setStatus(`${gameData.name} is not available on ${platMeta.name}.`, 'error');
    renderUnavailable(gameData.name, platMeta.name);
    return;
  }

  setStatus(`Showing prices for ${gameData.name} on ${platMeta.name}.`);

  let pcData = null;

  if (platform === 'pc') {
    setStatus(`Fetching live prices for ${gameData.name}...`, 'loading');
    pcData = await fetchLivePCPrices(gameData.cheapsharkTitle);

    if (state.game !== game || state.platform !== platform) return;

    if (pcData && pcData.steam) {
      let msg = `Live Steam price: $${pcData.steam.sale.toFixed(2)} (MSRP $${pcData.steam.normal.toFixed(2)})`;
      if (pcData.elsewhere && pcData.elsewhere.sale < pcData.steam.sale) {
        const elseStoreName = STORE_NAMES[pcData.elsewhere.storeID] || 'another store';
        msg += ` · Cheaper at ${elseStoreName}: $${pcData.elsewhere.sale.toFixed(2)}`;
      }
      setStatus(msg);
    } else {
      setStatus(`Steam price unavailable — showing MSRP. Click the button to check Steam directly.`, 'error');
    }
  }

  const baseSteam     = (platform === 'pc' && pcData) ? pcData.steam     : null;
  const baseElsewhere = (platform === 'pc' && pcData) ? pcData.elsewhere : null;
  const noteText      = platData.note || gameData.note;

  gridEl.innerHTML = `
    ${priceCardHTML({
      tierLabel:  'Base Game',
      msrp:       platData.base,
      steamPrice: baseSteam,
      elsewhere:  baseElsewhere,
      storeUrl:   gameData.storeUrls[platform],
      storeName:  platMeta.store,
      note:       noteText
    })}
    ${priceCardHTML({
      tierLabel:  'Base Game + DLC',
      msrp:       platData.dlc,
      steamPrice: null,
      elsewhere:  null,
      storeUrl:   gameData.storeUrls[platform],
      storeName:  platMeta.store,
      note:       noteText
    })}
  `;
}
