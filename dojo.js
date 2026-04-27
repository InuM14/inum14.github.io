/* ============================================================
   The Fighting Games Hub — dojo.js
   Terminology dropdowns and definition rendering for The Dojo
   ============================================================ */

const TERMS = {
  gametypes: {
    "2d": {
      term: "2D Game",
      body: [
        "Any fighting game where your movement is locked to a 2D plane — that is to say, you can only move left, right, up, or down. Note that it doesn't matter if the game's art style is sprite-based, or rendered with 3D models; all that matters is how the characters are allowed to move. Although, some people will call a 2D game that uses 3D models a \"2.5D game\".",
        "They differ from 3D games in that they often have considerably more aspects of space control, like zoning and fireballs, and jumping is usually a way more prominent fixture."
      ]
    },
    "3d": {
      term: "3D Game",
      body: [
        "Any fighting game where you can move anywhere in 3D space — that is to say, you can move left, right, up, or down, as well as \"in\" and \"out\" of the camera. All 3D fighting games need to use 3D models, but some 2D games will use 3D models as well, so check the game's movement options to make the proper classification.",
        "Most 3D games tend to focus more on up-close brawling, where learning how to sidestep around moves instead of blocking them is a big part of the strategy."
      ]
    },
    "platform": {
      term: "Platform Fighter",
      body: [
        "Any fighting game where the primary goal is to knock characters off a series of platforms that comprise a stage. Super Smash Bros. invented this concept and remains the most popular platform fighter to date, but games such as Rivals of Aether and Brawlhalla are gaining popularity.",
        "Platform fighters have many unique elements that aren't shared by other 2D fighting games, and sometimes more closely resemble platforming games. Characters are not forced to face each other and can turn themselves around at will."
      ]
    }
  },
  principles: {
    "advantage": {
      term: "Advantage",
      body: [
        "Who is allowed to attack first after some move hits or is blocked. You might say \"you can't press a button there, I'm advantage\" to indicate that you are plus, or you can also talk about it from the perspective of the player who is minus, saying they are at disadvantage.",
        "In platform fighters like Smash Bros., advantage simply means being in a good position on the screen where your opponent's options are limited. There's no hard and fast frame data number you can apply here like you would in a 2D or 3D fighter — it's more of a general principle."
      ]
    },
    "plus": {
      term: "Plus",
      body: [
        "When you are able to freely act, but your opponent cannot (usually because they are still trapped in block stun from your previous attack). Being plus (or \"positive\") in a fighting game is quite strong; it means you always have a headstart on your next attack, even if it's only by a very slim margin."
      ]
    },
    "minus": {
      term: "Minus",
      body: [
        "When you cannot freely act, but your opponent can (usually because you're too busy recovering from your own move). It's not too much fun to be minus (or \"negative\") in a fighting game.",
        "First of all, if you're too minus, you can be punished. And even if you're only slightly minus, if you and your opponent attack as soon as possible with attacks that have the same startup, you'll always lose the race and get hit."
      ]
    },
    "block": {
      term: "Block",
      body: [
        "The act of defending against incoming attacks. The attack makes contact with your body, but you take zero damage, or a small amount of chip damage in the case of special moves. While a few fighting games require you to hold a designated button to block, most games, like Street Fighter titles, will block if you hold the direction away from your opponent.",
        "When you block an attack, you are put in block stun. Some attacks cannot be blocked, while other attacks — such as lows and overheads — must be blocked a certain way or else they will hit."
      ]
    },
    "cancel": {
      term: "Cancel",
      body: [
        "Removing the recovery of an attack, usually so that you can transition immediately into another move. By far the most common instance is canceling a normal attack into a special move. If the normal hits the opponent, it will kinda stop halfway through and the special move will start immediately. Some people call this a \"special cancel\" or a 2-in-1, notated with \"xx\" (or sometimes \">\"), like HP xx fireball.",
        "It's far from the only type of canceling in fighting games. Sometimes you can cancel a normal into itself (called chaining), or a normal into other normals (called a target combo or a string). Canceling is a staple of the genre, and a concept every fighting game player should know."
      ]
    }
  },
  techniques: {
    "bnb": {
      term: "Bread and Butter",
      body: [
        "A common, practical combo that you will use often in matches — almost always shortened to \"BnB\". You'll probably learn an easy BnB for your character for situations that come up a lot, such as landing a jumping attack or hitting with a crouching jab.",
        "It may be possible to do more advanced, situational combos, but BnBs are the dependable staples that every player should know and will put you on the fast track to character mastery."
      ]
    },
    "dp": {
      term: "Dragon Punch",
      body: [
        "A powerful rising uppercut attack that is great for anti-air and is usually invincible, making it great for reversal attacks. A dragon punch, or \"DP\", is a catch-all term for any motion attack that sees the character attack towards the air with their fist, usually leaving their feet.",
        "First seen with Ryu and Ken's shoryuken in Street Fighter II, this style of attack is now extremely common across dozens of fighting games and hundreds of characters. The term is basically synonymous with shoryuken and uppercut, although \"DP\" is the most common because it's catchy and short."
      ]
    },
    "divekick": {
      term: "Divekick",
      body: [
        "An aerial attack that accelerates quickly towards the ground, foot first. Divekicks are potent offensive weapons because they change how you can move through the air, and often characters can choose multiple angles for the divekick's approach, making it super annoying to anti-air them.",
        "Playing a character with a good divekick means you should be spending a lot of time in the air, irritating your opponent who just wants to live their best life on the ground."
      ]
    },
    "rekka": {
      term: "Rekka",
      body: [
        "A type of special move that has multiple stages, as long as you input more commands to continue the sequence. A rekka tends to have exactly three distinct parts and will move your character forward along the ground with each new input.",
        "Usually the first part is safe on block, and you'll only continue into the later parts as a hit confirm — although some games tinker with this formula, maybe including high and low options later in the sequence so you can use them to mix up your opponent."
      ]
    }
  }
};

/* Render a definition into the correct column's display area */
function renderDef(colId, termKey) {
  const entry   = TERMS[colId][termKey];
  const display = document.getElementById('def-' + colId);

  let html = `<div class="def-term">${entry.term}</div><div class="def-body">`;
  entry.body.forEach((para, i) => {
    html += `<p${i > 0 ? ' style="margin-top:10px"' : ''}>${para}</p>`;
  });
  html += '</div>';
  display.innerHTML = html;
}

/* Wire up each custom dropdown */
document.querySelectorAll('.custom-select-btn').forEach(btn => {
  const wrapper = btn.closest('.custom-select-wrapper');
  const opts    = wrapper.querySelector('.custom-options');
  const colId   = btn.dataset.col;

  // Toggle open/closed
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = opts.classList.toggle('open');
    btn.classList.toggle('open', isOpen);

    // Close any other open dropdowns
    document.querySelectorAll('.custom-options.open').forEach(o => {
      if (o !== opts) {
        o.classList.remove('open');
        o.closest('.custom-select-wrapper').querySelector('.custom-select-btn').classList.remove('open');
      }
    });
  });

  // Handle option selection
  opts.querySelectorAll('.custom-option').forEach(opt => {
    opt.addEventListener('click', () => {
      btn.querySelector('.btn-label').textContent = opt.textContent.trim();
      opts.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opts.classList.remove('open');
      btn.classList.remove('open');
      renderDef(colId, opt.dataset.value);
    });
  });
});

// Close all dropdowns on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-options.open').forEach(o => {
    o.classList.remove('open');
    o.closest('.custom-select-wrapper').querySelector('.custom-select-btn').classList.remove('open');
  });
});
