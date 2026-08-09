(() => {
  "use strict";

  const SAVE_KEY = "solarLiberationSave";
  const TAU = Math.PI * 2;
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const mini = document.getElementById("miniMap");
  const miniCtx = mini.getContext("2d");

    const ui = {
    storyScreen: document.getElementById("storyScreen"),
    storyText: document.getElementById("storyText"),
    skipStoryButton: document.getElementById("skipStoryButton"),
    commandDeck: document.getElementById("commandDeck"),
    hud: document.getElementById("hud"),
    pause: document.getElementById("pauseScreen"),
    result: document.getElementById("resultScreen"),
    toast: document.getElementById("toast"),
    planetList: document.getElementById("planetList"),
    upgradeList: document.getElementById("upgradeList"),
    selectedPlanet: document.getElementById("selectedPlanet"),
    selectedThreat: document.getElementById("selectedThreat"),
    selectedBrief: document.getElementById("selectedBrief"),
    planetPreview: document.getElementById("planetPreview"),
    intelNodes: document.getElementById("intelNodes"),
    intelDefenders: document.getElementById("intelDefenders"),
    intelReward: document.getElementById("intelReward"),
    intelBest: document.getElementById("intelBest"),
    frontStatus: document.getElementById("frontStatus"),
    bankSalvage: document.getElementById("bankSalvage"),
    launchButton: document.getElementById("launchButton"),
    repairButton: document.getElementById("repairButton"),
    paintButton: document.getElementById("paintButton"),
    paintScreen: document.getElementById("paintScreen"),
    paintSwatchGrid: document.getElementById("paintSwatchGrid"),
    resetButton: document.getElementById("resetButton"),
    muteButton: document.getElementById("muteButton"),
    resumeButton: document.getElementById("resumeButton"),
    abortButton: document.getElementById("abortButton"),
    continueButton: document.getElementById("continueButton"),
    retryButton: document.getElementById("retryButton"),
    hudPlanet: document.getElementById("hudPlanet"),
    hudObjective: document.getElementById("hudObjective"),
    hudSalvage: document.getElementById("hudSalvage"),
    hudTime: document.getElementById("hudTime"),
    hudCombo: document.getElementById("hudCombo"),
    hullText: document.getElementById("hullText"),
    shieldText: document.getElementById("shieldText"),
    heatText: document.getElementById("heatText"),
    ammoText: document.getElementById("ammoText"),
    hullBar: document.getElementById("hullBar"),
    shieldBar: document.getElementById("shieldBar"),
    heatBar: document.getElementById("heatBar"),
    ammoBar: document.getElementById("ammoBar"),
    dashReady: document.getElementById("dashReady"),
    pulseReady: document.getElementById("pulseReady"),
    missileReady: document.getElementById("missileReady"),
    droneReady: document.getElementById("droneReady"),
    speedText: document.getElementById("speedText"),
    dashCooldown: document.getElementById("dashCooldown"),
    pulseCooldown: document.getElementById("pulseCooldown"),
    missileCooldown: document.getElementById("missileCooldown"),
    droneCooldown: document.getElementById("droneCooldown"),
    speedBar: document.getElementById("speedBar"),
    warning: document.getElementById("warning"),
    controlsOverlay: document.getElementById("controlsOverlay"),
    resultKicker: document.getElementById("resultKicker"),
    resultTitle: document.getElementById("resultTitle"),
    resultBody: document.getElementById("resultBody"),
    resultSalvage: document.getElementById("resultSalvage"),
    resultTime: document.getElementById("resultTime"),
  };

  const planets = [
    {
      id: "mercury",
      name: "Mercury",
      color: "#d7a56f",
      accent: "#ffce7a",
      threat: 1,
      nodes: 3,
      defenders: "Light",
      reward: 180,
      brief: "A furnace relay feeds the inner-system colony lattice.",
    },
    {
      id: "venus",
      name: "Venus",
      color: "#e8c060",
      accent: "#ff8d5c",
      threat: 2,
      nodes: 3,
      defenders: "Heavy haze",
      reward: 260,
      brief: "Atmospheric foundries hide their shields inside corrosive cloud bands.",
    },
    {
      id: "earth",
      name: "Earth Orbit",
      color: "#3fa7ff",
      accent: "#61f2a2",
      threat: 3,
      nodes: 4,
      defenders: "Orbital net",
      reward: 360,
      brief: "The homeworld ring is crowded with sentries and capture beacons.",
    },
    {
      id: "mars",
      name: "Mars",
      color: "#c85b42",
      accent: "#ffd166",
      threat: 4,
      nodes: 4,
      defenders: "War drones",
      reward: 480,
      brief: "Buried transmitters pulse through the red dust and wake old machines.",
    },
    {
      id: "jupiter",
      name: "Jupiter",
      color: "#d89f72",
      accent: "#ff5c7a",
      threat: 5,
      nodes: 5,
      defenders: "Storm guard",
      reward: 650,
      brief: "Gas giant harvesters draw power from auroral storms and moon shadows.",
    },
    {
      id: "saturn",
      name: "Saturn",
      color: "#e5cf91",
      accent: "#b58cff",
      threat: 6,
      nodes: 5,
      defenders: "Ring fleets",
      reward: 820,
      brief: "Ring-bound colonies weaponize debris fields into rotating kill lanes.",
    },
    {
      id: "uranus",
      name: "Uranus",
      color: "#8de4e8",
      accent: "#35d8ff",
      threat: 7,
      nodes: 6,
      defenders: "Cryo swarms",
      reward: 1040,
      brief: "Cold colonies run silent until their seeders flood the dark with drones.",
    },
    {
      id: "neptune",
      name: "Neptune",
      color: "#4777ff",
      accent: "#61f2a2",
      threat: 8,
      nodes: 6,
      defenders: "Outer guardian",
      reward: 1300,
      brief: "The final command core bends the outer system into a blue warfront.",
    },
  ];

  const HULL_COLORS = [
    { name: "Helios",   body: "#c8e4ff", engine: "#35d8ff", cockpit: "#9070ff", trail: "rgba(53,216,255,0.78)" },
    { name: "Solaris",  body: "#ffe4a8", engine: "#ffd166", cockpit: "#ff8030", trail: "rgba(255,209,102,0.78)" },
    { name: "Nova",     body: "#ffc8c8", engine: "#ff5c7a", cockpit: "#cc2040", trail: "rgba(255,92,122,0.78)" },
    { name: "Verdant",  body: "#c0f0d0", engine: "#61f2a2", cockpit: "#30c870", trail: "rgba(97,242,162,0.78)" },
    { name: "Phantom",  body: "#d8c8f0", engine: "#b58cff", cockpit: "#7040c0", trail: "rgba(181,140,255,0.78)" },
    { name: "Titan",    body: "#dce8f2", engine: "#90b8d8", cockpit: "#507090", trail: "rgba(140,190,220,0.78)" },
  ];

  const upgradeDefs = [
    {
      key: "hull",
      name: "Titanium Hull",
      desc: "Raises maximum hull integrity.",
      baseCost: 140,
      max: 5,
    },
    {
      key: "weapon",
      name: "Lance Battery",
      desc: "Improves fire rate and projectile damage.",
      baseCost: 160,
      max: 5,
    },
    {
      key: "engine",
      name: "Vector Engine",
      desc: "Raises acceleration and top speed.",
      baseCost: 150,
      max: 5,
    },
    {
      key: "dash",
      name: "Blink Drive",
      desc: "Shortens dash recovery and extends the burst.",
      baseCost: 190,
      max: 4,
    },
    {
      key: "shield",
      name: "Aegis Shield",
      desc: "Expands shield capacity and recharge.",
      baseCost: 170,
      max: 5,
    },
    {
      key: "special",
      name: "Nova Pulse",
      desc: "Strengthens the area pulse.",
      baseCost: 220,
      max: 4,
    },
    {
      key: "missile",
      name: "Seeker Rack",
      desc: "Adds stronger homing missiles.",
      baseCost: 210,
      max: 4,
    },
    {
      key: "drone",
      name: "Drone Bay",
      desc: "Deploys longer-lasting allied attack drones.",
      baseCost: 240,
      max: 4,
    },
  ];

  const state = {
    mode: "story",
    selectedPlanet: 0,
    save: loadSave(),
    keys: new Set(),
    mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false },
    width: 1,
    height: 1,
    dpr: 1,
    camera: { x: 0, y: 0 },
    last: performance.now(),
    mission: null,
    stars: [],
    audio: null,
    toastTimer: 0,
    warp: null, // galaxy travel state
  };

  function defaultSave() {
    return {
      unlocked: ["mercury"],
      completed: {},
      best: {},
      upgrades: {
        hull: 0,
        weapon: 0,
        engine: 0,
        dash: 0,
        shield: 0,
        special: 0,
        missile: 0,
        drone: 0,
      },
      salvage: 0,
      muted: false,
      controlsSeen: false,
      customization: { hullColor: 0 },
    };
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const base = defaultSave();
      return {
        ...base,
        ...parsed,
        unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : base.unlocked,
        completed: parsed.completed || base.completed,
        best: parsed.best || base.best,
        upgrades: { ...base.upgrades, ...(parsed.upgrades || {}) },
        customization: { ...base.customization, ...(parsed.customization || {}) },
      };
    } catch {
      return defaultSave();
    }
  }

  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state.save));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function angleTo(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mins = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function isUnlocked(planet) {
    return state.save.unlocked.includes(planet.id);
  }

  function isCompleted(planet) {
    return Boolean(state.save.completed[planet.id]);
  }

  function upgradeCost(def) {
    const level = state.save.upgrades[def.key] || 0;
    return Math.round(def.baseCost * Math.pow(1.72, level));
  }

  function playerStats() {
    const u = state.save.upgrades;
    return {
      maxHull: 120 + u.hull * 34,
      maxShield: 58 + u.shield * 22,
      shieldRegen: 10 + u.shield * 2.6,
      acceleration: 720 + u.engine * 86,
      maxSpeed: 430 + u.engine * 38,
      fireDelay: Math.max(0.095, 0.18 - u.weapon * 0.015),
      bulletDamage: 21 + u.weapon * 6,
      heatPerShot: Math.max(8.5, 15 - u.weapon * 1.1),
      heatCool: 28 + u.weapon * 2,
      dashPower: 720 + u.dash * 95,
      dashCooldown: Math.max(0.9, 1.65 - u.dash * 0.16),
      specialRadius: 250 + u.special * 46,
      specialDamage: 90 + u.special * 26,
      specialCooldown: Math.max(8, 14 - u.special * 1.25),
      missileDamage: 82 + u.missile * 26,
      missileSplash: 96 + u.missile * 18,
      missileCooldown: Math.max(4.2, 8.2 - u.missile * 0.8),
      missileSpeed: 520 + u.missile * 42,
      maxAmmo: 88 + u.weapon * 16,
      maxMissileAmmo: 2 + u.missile,
      droneDamage: 15 + u.drone * 5,
      droneDuration: 11 + u.drone * 3,
      droneCooldown: Math.max(10, 20 - u.drone * 2.2),
      droneFireDelay: Math.max(0.42, 0.78 - u.drone * 0.07),
    };
  }

  function resize() {
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.width = Math.floor(window.innerWidth);
    state.height = Math.floor(window.innerHeight);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    const count = Math.round(clamp((state.width * state.height) / 7200, 90, 260));
    state.stars = Array.from({ length: count }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: rand(0.5, 1.9),
      a: rand(0.2, 0.9),
      p: rand(0.08, 0.35),
    }));
  }

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 2100);
  }

  function setMode(mode) {
    state.mode = mode;
    if (ui.storyScreen) ui.storyScreen.classList.toggle("hidden", mode !== "story");
    ui.commandDeck.classList.toggle("hidden", mode !== "command");
    ui.hud.classList.toggle("hidden", mode !== "playing" && mode !== "paused");
    ui.pause.classList.toggle("hidden", mode !== "paused");
    ui.result.classList.toggle("hidden", mode !== "result");
    const galaxyScreen = document.getElementById("galaxyScreen");
    if (galaxyScreen) galaxyScreen.classList.toggle("hidden", mode !== "galaxy");
    if (mode !== "playing") {
      ui.controlsOverlay.classList.add("hidden");
    }
    showMobileControls(mode === "playing" && isTouchDevice());
    if (mode === "command") {
      renderCommandDeck();
    }
  }

  function renderCommandDeck() {
    const completed = planets.filter(isCompleted).length;
    ui.frontStatus.textContent = `${completed} / ${planets.length} liberated`;
    ui.bankSalvage.textContent = state.save.salvage.toLocaleString();
    ui.muteButton.textContent = state.save.muted ? "Muted" : "Audio";
    renderPlanetList();
    renderDossier();
    renderUpgrades();
    renderHangar();
  }

  function renderHangar() {
    const container = document.getElementById("hangarList");
    if (!container) return;
    container.innerHTML = "";
    HULL_COLORS.forEach((hc, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hull-swatch" + (index === (state.save.customization.hullColor || 0) ? " selected" : "");
      btn.title = hc.name;
      btn.dataset.hullIndex = String(index);
      const swatch = document.createElement("span");
      swatch.className = "swatch-color";
      swatch.style.background = `linear-gradient(135deg, ${hc.body}, ${hc.engine})`;
      swatch.style.boxShadow = `0 0 10px ${hc.engine}88`;
      const label = document.createElement("span");
      label.className = "swatch-label";
      label.textContent = hc.name;
      btn.append(swatch, label);
      container.append(btn);
    });
  }

  function renderPaintModal() {
    const container = ui.paintSwatchGrid;
    if (!container) return;
    container.innerHTML = "";
    HULL_COLORS.forEach((hc, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hull-swatch" + (index === (state.save.customization.hullColor || 0) ? " selected" : "");
      btn.title = hc.name;
      btn.dataset.hullIndex = String(index);
      const swatch = document.createElement("span");
      swatch.className = "swatch-color";
      swatch.style.background = `linear-gradient(135deg, ${hc.body}, ${hc.engine})`;
      swatch.style.boxShadow = `0 0 14px ${hc.engine}aa`;
      const label = document.createElement("span");
      label.className = "swatch-label";
      label.textContent = hc.name;
      btn.append(swatch, label);
      container.append(btn);
    });
  }

  function renderPlanetList() {
    ui.planetList.innerHTML = "";
    planets.forEach((planet, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "planet-button";
      if (index === state.selectedPlanet) button.classList.add("selected");
      if (!isUnlocked(planet)) button.classList.add("locked");
      if (isCompleted(planet)) button.classList.add("completed");
      button.dataset.planet = String(index);

      const dot = document.createElement("span");
      dot.className = "planet-dot";
      dot.style.background = `linear-gradient(135deg, ${planet.color}, ${planet.accent})`;
      dot.style.color = planet.accent;

      const label = document.createElement("span");
      label.innerHTML = `<span class="planet-name">${planet.name}</span><span class="planet-meta">Threat ${planet.threat} / ${planet.defenders}</span>`;

      const status = document.createElement("span");
      status.className = "planet-state";
      status.textContent = isCompleted(planet) ? "Clear" : isUnlocked(planet) ? "Open" : "Locked";

      button.append(dot, label, status);
      ui.planetList.append(button);
    });
  }

  function renderDossier() {
    const planet = planets[state.selectedPlanet];
    ui.selectedPlanet.textContent = planet.name;
    ui.selectedThreat.textContent = `Threat ${planet.threat}`;
    ui.selectedBrief.textContent = planet.brief;
    ui.planetPreview.style.background = `linear-gradient(135deg, ${planet.color}, ${planet.accent})`;
    ui.planetPreview.style.color = planet.accent;
    ui.intelNodes.textContent = String(planet.nodes);
    ui.intelDefenders.textContent = planet.defenders;
    ui.intelReward.textContent = planet.reward.toLocaleString();
    ui.intelBest.textContent = state.save.best[planet.id]
      ? formatTime(state.save.best[planet.id])
      : "--";
    ui.launchButton.disabled = !isUnlocked(planet);
    ui.launchButton.textContent = !isUnlocked(planet)
      ? "Sector Locked"
      : isCompleted(planet)
        ? "Replay Mission"
        : "Launch Mission";
  }

  function renderUpgrades() {
    ui.upgradeList.innerHTML = "";
    upgradeDefs.forEach((def) => {
      const level = state.save.upgrades[def.key] || 0;
      const row = document.createElement("div");
      row.className = "upgrade-row";
      row.classList.toggle("maxed", level >= def.max);
      const title = document.createElement("h3");
      title.textContent = def.name;
      const levelNode = document.createElement("span");
      levelNode.className = "upgrade-level";
      levelNode.textContent = `Mk ${level} / ${def.max}`;
      const desc = document.createElement("p");
      desc.textContent = descWithEffect(def.key, level);
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.upgrade = def.key;
      if (level >= def.max) {
        button.textContent = "Maxed";
        button.disabled = true;
      } else {
        const cost = upgradeCost(def);
        const affordable = state.save.salvage >= cost;
        row.classList.toggle("affordable", affordable);
        button.textContent = affordable
          ? `Install upgrade - ${cost.toLocaleString()}`
          : `Need ${(cost - state.save.salvage).toLocaleString()} more`;
        button.disabled = !affordable;
      }
      row.append(title, levelNode, desc, button);
      ui.upgradeList.append(row);
    });
  }

  function descWithEffect(key, level) {
    const stat = playerStats();
    const labels = {
      hull: `${stat.maxHull} hull capacity`,
      weapon: `${Math.round(stat.bulletDamage)} damage / ${stat.maxAmmo} ammo`,
      engine: `${Math.round(stat.maxSpeed)} max velocity`,
      dash: `${stat.dashCooldown.toFixed(1)}s dash recovery`,
      shield: `${stat.maxShield} shield capacity`,
      special: `${Math.round(stat.specialRadius)} pulse radius`,
      missile: `${Math.round(stat.missileDamage)} damage / ${stat.maxMissileAmmo} missiles`,
      drone: `${stat.droneDuration.toFixed(0)}s drone duration`,
    };
    const def = upgradeDefs.find((item) => item.key === key);
    return `${def.desc} Current: ${labels[key]}.`;
  }

  function buyUpgrade(key) {
    const def = upgradeDefs.find((item) => item.key === key);
    if (!def) return;
    const level = state.save.upgrades[key] || 0;
    if (level >= def.max) return;
    const cost = upgradeCost(def);
    if (state.save.salvage < cost) {
      showToast("Insufficient salvage.");
      return;
    }
    state.save.salvage -= cost;
    state.save.upgrades[key] = level + 1;
    saveGame();
    playSfx("upgrade");
    renderCommandDeck();
  }

  function repairShip() {
    showToast("Dry dock crews are standing by. Ship integrity resets at launch.");
    playSfx("click");
  }

  function resetSave() {
    if (!window.confirm("Reset campaign data?")) return;
    state.save = defaultSave();
    saveGame();
    renderCommandDeck();
    showToast("Campaign data reset.");
  }

  function addCombo(mission, amount = 0.12) {
    mission.combo = clamp(mission.combo + amount, 1, 5);
    mission.comboTimer = 6.5;
    mission.bestCombo = Math.max(mission.bestCombo, mission.combo);
  }

  function awardSalvage(mission, baseValue, comboGain = 0.12) {
    addCombo(mission, comboGain);
    const value = Math.round(baseValue * mission.combo);
    mission.salvage += value;
    return value;
  }

  function createMission(planet) {
    const stats = playerStats();
    const world = {
      width: 4600 + planet.threat * 360,
      height: 3400 + planet.threat * 300,
    };
    const center = { x: world.width * 0.56, y: world.height * 0.5 };
    const start = { x: 330, y: world.height * 0.5 };
    const mission = {
      planet,
      world,
      time: 0,
      controlsHintTimer: 0,
      shake: 0,
      salvage: 0,
      combo: 1,
      comboTimer: 0,
      bestCombo: 1,
      phase: "scan",
      purge: 0,
      extractionTimer: null,
      spawnTimer: 2.5,
      guardianSpawned: false,
      powerupTimer: rand(45, 70),
      ammoDropTimer: rand(25, 40),
      extraction: { x: start.x, y: start.y, r: 120, active: false },
      player: {
        x: start.x,
        y: start.y,
        vx: 0,
        vy: 0,
        angle: 0,
        hull: stats.maxHull,
        maxHull: stats.maxHull,
        shield: stats.maxShield,
        maxShield: stats.maxShield,
        shieldDelay: 0,
        heat: 0,
        ammo: stats.maxAmmo,
        maxAmmo: stats.maxAmmo,
        missileAmmo: stats.maxMissileAmmo,
        maxMissileAmmo: stats.maxMissileAmmo,
        fireTimer: 0,
        dashTimer: 0,
        specialTimer: 1.2,
        missileTimer: 0,
        droneTimer: 0,
        invuln: 1.2,
        damageFlash: 0,
        inStorm: false,
        thrust: {
          forward: 0,
          reverse: 0,
          strafe: 0,
          brake: false,
          active: false,
          speed: 0,
        },
      },
      stats,
      core: {
        x: center.x,
        y: center.y,
        r: 92,
        shielded: true,
        pulse: 0,
      },
      relays: [],
      nodes: [],
      enemies: [],
      bullets: [],
      missiles: [],
      drones: [],
      enemyBullets: [],
      hazards: [],
      caches: [],
      rifts: [],
      nebula: [],
      particles: [],
      pickups: [],
      messages: [],
    };

    const relayCount = 2 + Math.floor(planet.threat / 3);
    for (let i = 0; i < relayCount; i += 1) {
      const angle = (i / relayCount) * TAU + rand(-0.35, 0.35);
      const radius = Math.min(world.width, world.height) * rand(0.18, 0.3);
      mission.relays.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        r: 32,
        progress: 0,
        scanned: false,
        pulse: rand(0, TAU),
      });
    }

    const nodeRadius = Math.min(world.width, world.height) * 0.26;
    for (let i = 0; i < planet.nodes; i += 1) {
      const angle = (i / planet.nodes) * TAU + rand(-0.16, 0.16);
      mission.nodes.push({
        x: center.x + Math.cos(angle) * nodeRadius * rand(0.86, 1.16),
        y: center.y + Math.sin(angle) * nodeRadius * rand(0.8, 1.13),
        r: 34,
        hp: 110 + planet.threat * 34,
        maxHp: 110 + planet.threat * 34,
        angle,
        fireTimer: rand(0.2, 1.5),
        alive: true,
      });
    }

    const initialEnemies = 7 + planet.threat * 3;
    for (let i = 0; i < initialEnemies; i += 1) {
      spawnEnemy(mission, i % 5 === 0 ? "turret" : i % 4 === 0 ? "interceptor" : "drone");
    }
    if (planet.threat >= 3) spawnEnemy(mission, "seeder");
    if (planet.threat >= 6) spawnEnemy(mission, "seeder");
    seedMissionFeatures(mission);

    return mission;
  }

  function seedMissionFeatures(mission) {
    const { world, planet } = mission;
    const asteroidCount = 7 + planet.threat * 2;
    for (let i = 0; i < asteroidCount; i += 1) {
      const r = rand(22, 58 + planet.threat * 2);
      mission.hazards.push({
        type: "asteroid",
        x: rand(520, world.width - 180),
        y: rand(160, world.height - 160),
        vx: rand(-22, 22),
        vy: rand(-18, 18),
        r,
        spin: rand(-0.8, 0.8),
        angle: rand(0, TAU),
        hp: r * 2.4,
      });
    }
    const storms = Math.max(1, Math.floor(planet.threat / 3));
    for (let i = 0; i < storms; i += 1) {
      mission.hazards.push({
        type: "storm",
        x: rand(760, world.width - 260),
        y: rand(260, world.height - 260),
        r: rand(150, 240 + planet.threat * 10),
        pulse: rand(0, TAU),
        hp: 300 + planet.threat * 50,
        maxHp: 300 + planet.threat * 50
      });
    }
    const cacheCount = 2 + Math.floor(planet.threat / 3);
    for (let i = 0; i < cacheCount; i += 1) {
      mission.caches.push({
        x: rand(420, world.width - 220),
        y: rand(180, world.height - 180),
        r: 24,
        used: false,
        kind: ["repair", "overcharge", "munition"][Math.floor(rand(0, 3))],
        pulse: rand(0, TAU),
      });
    }
    const riftCount = Math.max(1, Math.floor((planet.threat + 1) / 3));
    for (let i = 0; i < riftCount; i += 1) {
      const angle = (i / riftCount) * TAU + rand(-0.55, 0.55);
      const radius = Math.min(world.width, world.height) * rand(0.22, 0.36);
      mission.rifts.push({
        x: mission.core.x + Math.cos(angle) * radius,
        y: mission.core.y + Math.sin(angle) * radius,
        r: 42,
        hp: 170 + planet.threat * 34,
        maxHp: 170 + planet.threat * 34,
        pulse: rand(0, TAU),
        spawnTimer: rand(4.5, 8.5),
        alive: true,
      });
    }
    for (let i = 0; i < 7; i += 1) {
      mission.nebula.push({
        x: rand(0, world.width),
        y: rand(0, world.height),
        r: rand(280, 680),
        color: i % 2 ? "rgba(53, 216, 255, 0.07)" : "rgba(181, 140, 255, 0.06)",
      });
    }
  }

  function startMission(index = state.selectedPlanet) {
    const planet = planets[index];
    if (!isUnlocked(planet)) {
      showToast("That sector remains locked.");
      return;
    }
    unlockAudio();
    state.selectedPlanet = index;
    state.mission = createMission(planet);
    state.mission.controlsHintTimer = 0; // overlay only shown on H key press
    if (!state.save.controlsSeen) {
      state.save.controlsSeen = true;
      saveGame();
    }
    state.camera.x = 0;
    state.camera.y = Math.max(0, state.mission.player.y - state.height * 0.5);
    state.keys.clear();
    state.mouse.down = false;
    setMode("playing");
    playSfx("launch");
    showToast(`${planet.name} mission launched.`);
  }

  function completeMission(success) {
    const mission = state.mission;
    if (!mission) return;
    const planet = mission.planet;
    const time = mission.time;
    let totalSalvage = Math.round(mission.salvage);
    if (success) {
      totalSalvage += planet.reward;
      state.save.salvage += totalSalvage;
      state.save.completed[planet.id] = true;
      if (!state.save.best[planet.id] || time < state.save.best[planet.id]) {
        state.save.best[planet.id] = Math.round(time);
      }
      const next = planets[planets.findIndex((p) => p.id === planet.id) + 1];
      if (next && !state.save.unlocked.includes(next.id)) {
        state.save.unlocked.push(next.id);
      }
      ui.resultKicker.textContent = "Mission Complete";
      ui.resultTitle.textContent = `${planet.name} Liberated`;
      ui.resultBody.textContent = next
        ? `${next.name} has been added to the Solar Front.`
        : "The Solar System is liberated. Helios Fleet advances to the next star system.";
      playSfx("victory");
      if (!next) {
        // All planets liberated — trigger galaxy travel after 2.5s
        setTimeout(() => startGalaxyTravel(), 2500);
      }
    } else {
      totalSalvage = Math.round(totalSalvage * 0.35);
      state.save.salvage += totalSalvage;
      ui.resultKicker.textContent = "Mission Failed";
      ui.resultTitle.textContent = "Ship Recovered";
      ui.resultBody.textContent = "Emergency crews salvaged what they could from the combat zone.";
      playSfx("fail");
    }
    ui.resultSalvage.textContent = totalSalvage.toLocaleString();
    ui.resultTime.textContent = formatTime(time);
    saveGame();
    setMode("result");
  }

  function startGalaxyTravel() {
    state.warp = { timer: 0, speed: 0, streaks: [] };
    for (let i = 0; i < 180; i += 1) {
      const a = rand(0, TAU);
      state.warp.streaks.push({
        x: rand(0.1, 0.9),
        y: rand(0.1, 0.9),
        a,
        len: rand(0.01, 0.06),
        speed: rand(0.3, 1),
      });
    }
    setMode("galaxy");
  }

  function abortMission() {
    completeMission(false);
  }

  function retryMission() {
    startMission(state.selectedPlanet);
  }

  function returnToCommand() {
    state.mission = null;
    setMode("command");
  }

  function spawnEnemy(mission, type = "drone", near) {
    const world = mission.world;
    let x;
    let y;
    if (near) {
      x = near.x + rand(-220, 220);
      y = near.y + rand(-220, 220);
    } else if (type === "turret") {
      const anchor = mission.nodes[Math.floor(Math.random() * mission.nodes.length)] || mission.core;
      const a = rand(0, TAU);
      x = anchor.x + Math.cos(a) * rand(120, 260);
      y = anchor.y + Math.sin(a) * rand(120, 260);
    } else {
      const edge = Math.floor(rand(0, 4));
      x = edge === 0 ? 80 : edge === 1 ? world.width - 80 : rand(100, world.width - 100);
      y = edge === 2 ? 80 : edge === 3 ? world.height - 80 : rand(100, world.height - 100);
    }
    const threat = mission.planet.threat;
    const specs = {
      drone: { r: 18, hp: 40 + threat * 9, speed: 155 + threat * 10, damage: 16 },
      interceptor: { r: 20, hp: 54 + threat * 12, speed: 210 + threat * 13, damage: 18 },
      turret: { r: 24, hp: 82 + threat * 18, speed: 0, damage: 16 },
      seeder: { r: 27, hp: 120 + threat * 28, speed: 92 + threat * 6, damage: 12 },
      guardian: { r: 48, hp: 520 + threat * 80, speed: 128 + threat * 6, damage: 26 },
    };
    const spec = specs[type] || specs.drone;
    mission.enemies.push({
      type,
      x: clamp(x, 70, world.width - 70),
      y: clamp(y, 70, world.height - 70),
      vx: 0,
      vy: 0,
      angle: 0,
      r: spec.r,
      hp: spec.hp,
      maxHp: spec.hp,
      speed: spec.speed,
      damage: spec.damage,
      fireTimer: rand(0.5, 2.2),
      spawnTimer: rand(3, 6),
      strafe: Math.random() > 0.5 ? 1 : -1,
      hitFlash: 0,
    });
  }

  function update(dt) {
    if (state.mode === "playing" && state.mission) {
      updateMission(state.mission, dt);
    }
  }

  function updateMission(mission, dt) {
    const player = mission.player;
    const stats = mission.stats;
    mission.time += dt;
    mission.shake = Math.max(0, mission.shake - dt * 24);
    mission.comboTimer = Math.max(0, mission.comboTimer - dt);
    if (mission.comboTimer <= 0) mission.combo = Math.max(1, mission.combo - dt * 0.9);
    player.inStorm = false;
    player.invuln = Math.max(0, player.invuln - dt);
    player.fireTimer = Math.max(0, player.fireTimer - dt);
    player.dashTimer = Math.max(0, player.dashTimer - dt);
    player.specialTimer = Math.max(0, player.specialTimer - dt);
    player.missileTimer = Math.max(0, player.missileTimer - dt);
    player.droneTimer = Math.max(0, player.droneTimer - dt);
    player.shieldDelay = Math.max(0, player.shieldDelay - dt);
    player.damageFlash = Math.max(0, player.damageFlash - dt);
    mission.controlsHintTimer = Math.max(0, mission.controlsHintTimer - dt);
    player.heat = Math.max(0, player.heat - stats.heatCool * dt);
    if (player.shieldDelay <= 0) {
      player.shield = Math.min(player.maxShield, player.shield + stats.shieldRegen * dt);
    }

    updateMouseWorld();
    updateHazards(mission, dt);
    updateRifts(mission, dt);
    updatePlayer(mission, dt);
    updateCaches(mission, dt);
    updateBullets(mission, dt);
    updateMissiles(mission, dt);
    updateDrones(mission, dt);
    updateEnemies(mission, dt);
    updateMidGamePowerups(mission, dt);
    updateObjectives(mission, dt);
    updatePickups(mission, dt);
    updateParticles(mission, dt);
    updateCamera(mission, dt);
    updateHud(mission);

    if (player.hull <= 0) {
      completeMission(false);
    }
  }

  function updateMouseWorld() {
    state.mouse.worldX = state.camera.x + state.mouse.x;
    state.mouse.worldY = state.camera.y + state.mouse.y;
  }

  function updatePlayer(mission, dt) {
    const p = mission.player;
    const stats = mission.stats;
    p.angle = Math.atan2(state.mouse.worldY - p.y, state.mouse.worldX - p.x);

    const forward = state.keys.has("KeyW") || state.keys.has("ArrowUp");
    const reverse = state.keys.has("KeyS") || state.keys.has("ArrowDown");
    const left = state.keys.has("KeyA") || state.keys.has("ArrowLeft");
    const right = state.keys.has("KeyD") || state.keys.has("ArrowRight");
    const brake = state.keys.has("ShiftLeft") || state.keys.has("ShiftRight");
    const mainThrust = (forward ? 1 : 0) - (reverse ? 0.62 : 0);
    const sideThrust = (right ? 1 : 0) - (left ? 1 : 0);
    const activeThrust = Math.abs(mainThrust) > 0 || Math.abs(sideThrust) > 0;
    const sideAngle = p.angle + Math.PI / 2;

    if (mainThrust !== 0) {
      p.vx += Math.cos(p.angle) * mainThrust * stats.acceleration * dt;
      p.vy += Math.sin(p.angle) * mainThrust * stats.acceleration * dt;
    }
    if (sideThrust !== 0) {
      p.vx += Math.cos(sideAngle) * sideThrust * stats.acceleration * 0.66 * dt;
      p.vy += Math.sin(sideAngle) * sideThrust * stats.acceleration * 0.66 * dt;
    }

    if (brake) {
      p.vx *= Math.pow(0.0004, dt);
      p.vy *= Math.pow(0.0004, dt);
    } else if (activeThrust) {
      p.vx *= Math.pow(0.62, dt);
      p.vy *= Math.pow(0.62, dt);
    } else {
      p.vx *= Math.pow(0.28, dt);
      p.vy *= Math.pow(0.28, dt);
    }

    const speed = Math.hypot(p.vx, p.vy);
    const speedLimit = stats.maxSpeed * (brake ? 0.95 : 1.25);
    if (speed > speedLimit) {
      p.vx = (p.vx / speed) * speedLimit;
      p.vy = (p.vy / speed) * speedLimit;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.x = clamp(p.x, 34, mission.world.width - 34);
    p.y = clamp(p.y, 34, mission.world.height - 34);
    p.thrust = {
      forward: forward ? 1 : 0,
      reverse: reverse ? 1 : 0,
      strafe: sideThrust,
      brake,
      active: activeThrust || brake,
      speed: Math.hypot(p.vx, p.vy),
    };

    if (state.mouse.down) firePlayer(mission);
    if (state.keys.has("Space")) dashPlayer(mission);
    if (state.keys.has("KeyQ")) novaPulse(mission);

    emitThrusterParticles(mission, dt);
  }

  function emitThrusterParticles(mission, dt) {
    const p = mission.player;
    const t = p.thrust;
    const emissions = [];
    const hc = HULL_COLORS[state.save.customization.hullColor || 0];
    const trailCol = hc.trail;
    if (t.forward) {
      emissions.push({ angle: p.angle + Math.PI, x: -24, y: 0, color: trailCol, power: 1 });
    }
    if (t.reverse) {
      emissions.push({ angle: p.angle, x: 20, y: 0, color: "rgba(255, 209, 102, 0.72)", power: 0.7 });
    }
    if (t.strafe < 0) {
      emissions.push({ angle: p.angle + Math.PI / 2, x: 0, y: 16, color: trailCol, power: 0.7 });
    } else if (t.strafe > 0) {
      emissions.push({ angle: p.angle - Math.PI / 2, x: 0, y: -16, color: trailCol, power: 0.7 });
    }
    if (t.brake && t.speed > 60) {
      emissions.push({ angle: Math.atan2(p.vy, p.vx) + Math.PI, x: 0, y: 0, color: "rgba(255, 209, 102, 0.82)", power: 1.25 });
    }
    emissions.forEach((jet) => {
      const count = Math.max(1, Math.round(dt * 55 * jet.power));
      const ox = Math.cos(p.angle) * jet.x + Math.cos(p.angle + Math.PI / 2) * jet.y;
      const oy = Math.sin(p.angle) * jet.x + Math.sin(p.angle + Math.PI / 2) * jet.y;
      for (let i = 0; i < count; i += 1) {
        addParticle(mission, p.x + ox + rand(-3, 3), p.y + oy + rand(-3, 3), {
          color: jet.color,
          vx: Math.cos(jet.angle + rand(-0.28, 0.28)) * rand(110, 420) - p.vx * 0.08,
          vy: Math.sin(jet.angle + rand(-0.28, 0.28)) * rand(110, 420) - p.vy * 0.08,
          size: rand(2, 5.5) * jet.power,
          life: rand(0.22, 0.58),
        });
      }
    });
  }

  function updateHazards(mission, dt) {
    const p = mission.player;
    for (const hazard of mission.hazards) {
      if (hazard.type === "asteroid") {
        hazard.angle += hazard.spin * dt;
        hazard.x += hazard.vx * dt;
        hazard.y += hazard.vy * dt;
        if (hazard.x < hazard.r || hazard.x > mission.world.width - hazard.r) hazard.vx *= -1;
        if (hazard.y < hazard.r || hazard.y > mission.world.height - hazard.r) hazard.vy *= -1;
        const d = Math.hypot(p.x - hazard.x, p.y - hazard.y);
        if (d < hazard.r + 22) {
          const a = Math.atan2(p.y - hazard.y, p.x - hazard.x);
          hurtPlayer(mission, (18 + mission.planet.threat * 2) * dt * 3.4);
          p.vx += Math.cos(a) * 420 * dt;
          p.vy += Math.sin(a) * 420 * dt;
          hazard.vx -= Math.cos(a) * 60 * dt;
          hazard.vy -= Math.sin(a) * 60 * dt;
          mission.shake = Math.max(mission.shake, 8);
        }
      } else if (hazard.type === "storm") {
        hazard.pulse += dt;
        const d = Math.hypot(p.x - hazard.x, p.y - hazard.y);
        if (d < hazard.r) {
          p.inStorm = true;
          p.heat = Math.min(100, p.heat + (18 + mission.planet.threat) * dt);
          p.shield = Math.max(0, p.shield - (7 + mission.planet.threat * 0.8) * dt);
          p.shieldDelay = Math.max(p.shieldDelay, 0.4);
          if (Math.random() < dt * 18) {
            addParticle(mission, p.x + rand(-30, 30), p.y + rand(-30, 30), {
              color: "rgba(181, 140, 255, 0.78)",
              vx: rand(-110, 110),
              vy: rand(-110, 110),
              size: rand(1.5, 4.5),
              life: rand(0.22, 0.5),
            });
          }
        }
      }
    }
  }

  function updateRifts(mission, dt) {
    for (const rift of mission.rifts) {
      if (!rift.alive) continue;
      rift.pulse += dt;
      rift.spawnTimer -= dt;
      if (rift.spawnTimer <= 0 && mission.enemies.length < 50) {
        rift.spawnTimer = Math.max(3.2, 8.2 - mission.planet.threat * 0.35);
        spawnEnemy(mission, Math.random() > 0.72 && mission.planet.threat >= 3 ? "interceptor" : "drone", rift);
        burst(mission, rift.x, rift.y, 12, "rgba(255, 92, 122, 0.55)");
        playSfx("spawn");
      }
      const d = Math.hypot(mission.player.x - rift.x, mission.player.y - rift.y);
      if (d < rift.r + 90) {
        mission.player.heat = Math.min(100, mission.player.heat + dt * 6);
      }
    }
  }

  function damageRift(mission, rift, amount) {
    if (!rift.alive) return;
    rift.hp -= amount;
    spark(mission, rift.x, rift.y, "rgba(255, 92, 122, 0.72)", 5);
    if (rift.hp <= 0) {
      rift.alive = false;
      const value = awardSalvage(mission, 85 + mission.planet.threat * 18, 0.42);
      dropPickup(mission, rift.x, rift.y, value);
      burst(mission, rift.x, rift.y, 58, "rgba(255, 92, 122, 0.72)");
      mission.shake = Math.max(mission.shake, 16);
      playSfx("rift");
    }
  }

  function splitAsteroid(mission, asteroid) {
    const val = awardSalvage(mission, 18 + asteroid.r * 0.9, 0.14);
    dropPickup(mission, asteroid.x, asteroid.y, val);
    burst(mission, asteroid.x, asteroid.y, 22, "rgba(190, 170, 130, 0.75)");
    mission.shake = Math.max(mission.shake, 6);
    playSfx("pop");
    if (asteroid.r > 26) {
      const pieces = asteroid.r > 48 ? 3 : 2;
      for (let i = 0; i < pieces; i += 1) {
        const a = rand(0, TAU);
        const newR = asteroid.r * rand(0.4, 0.58);
        mission.hazards.push({
          type: "asteroid",
          x: asteroid.x + Math.cos(a) * asteroid.r * 0.55,
          y: asteroid.y + Math.sin(a) * asteroid.r * 0.55,
          vx: asteroid.vx + Math.cos(a) * rand(50, 130),
          vy: asteroid.vy + Math.sin(a) * rand(50, 130),
          r: newR,
          spin: rand(-1.6, 1.6),
          angle: rand(0, TAU),
          hp: newR * 2.4,
        });
      }
    }
  }

  function updateCaches(mission, dt) {
    const p = mission.player;
    for (const cache of mission.caches) {
      if (cache.used) continue;
      cache.pulse += dt;
      const d = Math.hypot(p.x - cache.x, p.y - cache.y);
      if (d < 82 && state.keys.has("KeyE")) {
        cache.used = true;
        if (cache.kind === "repair") {
          p.hull = Math.min(p.maxHull, p.hull + p.maxHull * 0.22);
          p.shield = Math.min(p.maxShield, p.shield + p.maxShield * 0.45);
          showToast("Repair cache secured.");
        } else if (cache.kind === "munition") {
          p.ammo = Math.min(p.maxAmmo, p.ammo + Math.ceil(p.maxAmmo * 0.55));
          p.missileAmmo = Math.min(p.maxMissileAmmo, p.missileAmmo + 1);
          showToast("Munition cache secured.");
        } else {
          p.heat = Math.max(0, p.heat - 45);
          p.dashTimer = 0;
          p.specialTimer = Math.min(p.specialTimer, 2);
          p.missileTimer = Math.min(p.missileTimer, 1);
          showToast("Overcharge cache online.");
        }
        const value = awardSalvage(mission, 35 + mission.planet.threat * 8, 0.18);
        dropPickup(mission, cache.x, cache.y, value);
        burst(
          mission,
          cache.x,
          cache.y,
          24,
          cache.kind === "repair"
            ? "rgba(97, 242, 162, 0.75)"
            : cache.kind === "munition"
              ? "rgba(255, 209, 102, 0.75)"
              : "rgba(53, 216, 255, 0.75)",
        );
        playSfx("upgrade");
      }
    }
  }

  function firePlayer(mission) {
    const p = mission.player;
    const stats = mission.stats;
    if (p.fireTimer > 0 || p.heat > 96) return;
    const spread = state.save.upgrades.weapon >= 4 ? 0.055 : 0;
    const shots = spread ? [-spread, spread] : [0];
    if (p.ammo < shots.length) {
      p.fireTimer = 0.22;
      return;
    }
    p.fireTimer = stats.fireDelay;
    p.heat += stats.heatPerShot;
    p.ammo -= shots.length;
    shots.forEach((offset) => {
      const a = p.angle + offset;
      mission.bullets.push({
        x: p.x + Math.cos(a) * 28,
        y: p.y + Math.sin(a) * 28,
        vx: Math.cos(a) * 820 + p.vx * 0.15,
        vy: Math.sin(a) * 820 + p.vy * 0.15,
        r: 5,
        damage: stats.bulletDamage,
        life: 1.25,
      });
    });
    playSfx("shot");
  }

  function dashPlayer(mission) {
    const p = mission.player;
    const stats = mission.stats;
    if (p.dashTimer > 0) return;
    const dir = Math.hypot(p.vx, p.vy) > 80 ? Math.atan2(p.vy, p.vx) : p.angle;
    p.vx += Math.cos(dir) * stats.dashPower;
    p.vy += Math.sin(dir) * stats.dashPower;
    p.dashTimer = stats.dashCooldown;
    p.invuln = 0.22;
    for (let i = 0; i < 26; i += 1) {
      addParticle(mission, p.x, p.y, {
        color: "rgba(97, 242, 162, 0.78)",
        vx: -Math.cos(dir) * rand(120, 420) + rand(-90, 90),
        vy: -Math.sin(dir) * rand(120, 420) + rand(-90, 90),
        size: rand(2, 6),
        life: rand(0.22, 0.56),
      });
    }
    playSfx("dash");
  }

  function novaPulse(mission) {
    const p = mission.player;
    const stats = mission.stats;
    if (p.specialTimer > 0) return;
    p.specialTimer = stats.specialCooldown;
    const radius = stats.specialRadius;
    const damage = stats.specialDamage;
    mission.enemies.forEach((enemy) => {
      const d = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (d < radius) damageEnemy(mission, enemy, damage * (1 - d / radius) + 30);
    });
    mission.nodes.forEach((node) => {
      if (!node.alive) return;
      const d = Math.hypot(node.x - p.x, node.y - p.y);
      if (d < radius) damageNode(mission, node, damage * 0.55);
    });
    for (let i = 0; i < 70; i += 1) {
      const a = rand(0, TAU);
      const v = rand(160, 620);
      addParticle(mission, p.x, p.y, {
        color: "rgba(181, 140, 255, 0.72)",
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        size: rand(2, 7),
        life: rand(0.35, 0.85),
      });
    }
    playSfx("pulse");
  }

  function launchMissile(mission) {
    if (!mission || state.mode !== "playing") return;
    const p = mission.player;
    const stats = mission.stats;
    if (p.missileTimer > 0 || p.heat > 98 || p.missileAmmo <= 0) return;
    const target = acquireMissileTarget(mission);
    const a = target ? angleTo(p, target) : p.angle;
    p.missileTimer = stats.missileCooldown;
    p.missileAmmo -= 1;
    p.heat = Math.min(100, p.heat + 12);
    mission.missiles.push({
      x: p.x + Math.cos(a) * 30,
      y: p.y + Math.sin(a) * 30,
      vx: Math.cos(a) * stats.missileSpeed + p.vx * 0.15,
      vy: Math.sin(a) * stats.missileSpeed + p.vy * 0.15,
      angle: a,
      r: 8,
      damage: stats.missileDamage,
      splash: stats.missileSplash,
      speed: stats.missileSpeed,
      target,
      life: 3.6,
      trail: 0,
    });
    mission.shake = Math.max(mission.shake, 4);
    playSfx("missile");
  }

  function deployDrone(mission) {
    if (!mission || state.mode !== "playing") return;
    const p = mission.player;
    const stats = mission.stats;
    if (p.droneTimer > 0) return;
    p.droneTimer = stats.droneCooldown;
    const count = state.save.upgrades.drone >= 3 ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      mission.drones.push({
        x: p.x,
        y: p.y,
        angle: (i / count) * TAU,
        orbit: 72 + i * 24,
        life: stats.droneDuration,
        fireTimer: 0.2 + i * 0.2,
        fixed: false,
      });
    }
    addCombo(mission, 0.08);
    burst(mission, p.x, p.y, 24, "rgba(53, 216, 255, 0.75)");
    playSfx("drone");
    showToast(count > 1 ? "Drone wing deployed." : "Escort drone deployed.");
  }

  function deployDroneAt(mission) {
    if (!mission || state.mode !== "playing") return;
    const p = mission.player;
    const stats = mission.stats;
    if (p.droneTimer > 0) return;
    p.droneTimer = stats.droneCooldown * 0.8;
    const tx = state.mouse.worldX;
    const ty = state.mouse.worldY;
    mission.drones.push({
      x: p.x, y: p.y,
      angle: 0,
      orbit: 0,
      life: stats.droneDuration * 1.4,
      fireTimer: 0.3,
      fixed: true,
      targetX: tx, targetY: ty,
    });
    addCombo(mission, 0.1);
    burst(mission, p.x, p.y, 18, "rgba(53, 216, 255, 0.75)");
    playSfx("drone");
    showToast("Combat drone deployed at target position.");
  }

  function acquireMissileTarget(mission) {
    const candidates = [
      ...mission.enemies,
      ...mission.nodes.filter((node) => node.alive),
      ...mission.rifts.filter((rift) => rift.alive),
      ...(mission.phase !== "nodes" ? [mission.core] : []),
    ];
    if (!candidates.length) return null;
    const aim = { x: state.mouse.worldX, y: state.mouse.worldY };
    candidates.sort((a, b) => {
      const aAim = Math.hypot(a.x - aim.x, a.y - aim.y);
      const bAim = Math.hypot(b.x - aim.x, b.y - aim.y);
      const aPlayer = Math.hypot(a.x - mission.player.x, a.y - mission.player.y);
      const bPlayer = Math.hypot(b.x - mission.player.x, b.y - mission.player.y);
      return aAim + aPlayer * 0.28 - (bAim + bPlayer * 0.28);
    });
    return candidates[0];
  }

  function acquireDroneTarget(mission, drone) {
    const targets = [
      ...mission.enemies,
      ...mission.rifts.filter((rift) => rift.alive),
      ...mission.nodes.filter((node) => node.alive),
      ...(mission.phase === "purge" ? [mission.core] : []),
    ];
    targets.sort((a, b) => Math.hypot(a.x - drone.x, a.y - drone.y) - Math.hypot(b.x - drone.x, b.y - drone.y));
    return targets.find((target) => Math.hypot(target.x - drone.x, target.y - drone.y) < 620) || null;
  }

  function updateBullets(mission, dt) {
    for (let i = mission.bullets.length - 1; i >= 0; i -= 1) {
      const b = mission.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      let remove = b.life <= 0 || outsideWorld(mission, b, 80);
      if (!remove) {
        for (const enemy of mission.enemies) {
          if (Math.hypot(enemy.x - b.x, enemy.y - b.y) < enemy.r + b.r) {
            damageEnemy(mission, enemy, b.damage);
            remove = true;
            break;
          }
        }
      }
      if (!remove) {
        for (const node of mission.nodes) {
          if (node.alive && Math.hypot(node.x - b.x, node.y - b.y) < node.r + b.r) {
            damageNode(mission, node, b.damage);
            remove = true;
            break;
          }
        }
      }
      if (!remove) {
        for (const rift of mission.rifts) {
          if (rift.alive && Math.hypot(rift.x - b.x, rift.y - b.y) < rift.r + b.r) {
            damageRift(mission, rift, b.damage);
            remove = true;
            break;
          }
        }
      }
      if (!remove) {
        for (let j = mission.hazards.length - 1; j >= 0; j -= 1) {
          const h = mission.hazards[j];
          if (h.type === "asteroid" && Math.hypot(h.x - b.x, h.y - b.y) < h.r + b.r) {
            h.hp -= b.damage;
            spark(mission, b.x, b.y, "rgba(190, 170, 130, 0.85)", 6);
            remove = true;
            if (h.hp <= 0) {
              splitAsteroid(mission, h);
              mission.hazards.splice(j, 1);
            }
            break;
          } else if (h.type === "storm" && Math.hypot(h.x - b.x, h.y - b.y) < h.r) {
            h.hp -= b.damage;
            spark(mission, b.x, b.y, "rgba(181, 140, 255, 0.95)", 12);
            remove = true;
            if (h.hp <= 0) {
              burst(mission, h.x, h.y, 72, "rgba(181, 140, 255, 0.8)");
              awardSalvage(mission, 150 + mission.planet.threat * 30, 0.42);
              dropPickup(mission, h.x, h.y, 80 + mission.planet.threat * 15);
              mission.shake = Math.max(mission.shake, 22);
              playSfx("boom");
              mission.hazards.splice(j, 1);
            }
            break;
          }
        }
      }
      if (remove) {
        spark(mission, b.x, b.y, "rgba(53, 216, 255, 0.8)", 5);
        mission.bullets.splice(i, 1);
      }
    }

    for (let i = mission.enemyBullets.length - 1; i >= 0; i -= 1) {
      const b = mission.enemyBullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      const p = mission.player;
      let remove = b.life <= 0 || outsideWorld(mission, b, 80);
      if (!remove && Math.hypot(p.x - b.x, p.y - b.y) < 22 + b.r) {
        hurtPlayer(mission, b.damage);
        remove = true;
      }
      if (remove) {
        spark(mission, b.x, b.y, "rgba(255, 92, 122, 0.74)", 4);
        mission.enemyBullets.splice(i, 1);
      }
    }
  }

  function updateMissiles(mission, dt) {
    for (let i = mission.missiles.length - 1; i >= 0; i -= 1) {
      const m = mission.missiles[i];
      m.life -= dt;
      const targetAlive = missileTargetAlive(m.target);
      if (targetAlive) {
        const desired = angleTo(m, m.target);
        let delta = ((desired - m.angle + Math.PI * 3) % TAU) - Math.PI;
        delta = clamp(delta, -3.2 * dt, 3.2 * dt);
        m.angle += delta;
      }
      m.vx = Math.cos(m.angle) * m.speed;
      m.vy = Math.sin(m.angle) * m.speed;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.trail -= dt;
      if (m.trail <= 0) {
        m.trail = 0.025;
        addParticle(mission, m.x - Math.cos(m.angle) * 10, m.y - Math.sin(m.angle) * 10, {
          color: "rgba(255, 209, 102, 0.78)",
          vx: -Math.cos(m.angle) * rand(40, 160) + rand(-40, 40),
          vy: -Math.sin(m.angle) * rand(40, 160) + rand(-40, 40),
          size: rand(2, 5),
          life: rand(0.18, 0.42),
        });
      }

      let exploded = m.life <= 0 || outsideWorld(mission, m, 80);
      if (!exploded) {
        for (const enemy of mission.enemies) {
          if (Math.hypot(enemy.x - m.x, enemy.y - m.y) < enemy.r + m.r) {
            exploded = true;
            break;
          }
        }
      }
      if (!exploded) {
        for (const node of mission.nodes) {
          if (node.alive && Math.hypot(node.x - m.x, node.y - m.y) < node.r + m.r) {
            exploded = true;
            break;
          }
        }
      }
      if (!exploded) {
        for (const rift of mission.rifts) {
          if (rift.alive && Math.hypot(rift.x - m.x, rift.y - m.y) < rift.r + m.r) {
            exploded = true;
            break;
          }
        }
      }
      if (exploded) {
        explodeMissile(mission, m);
        mission.missiles.splice(i, 1);
      }
    }
  }

  function updateDrones(mission, dt) {
    const p = mission.player;
    for (let i = mission.drones.length - 1; i >= 0; i -= 1) {
      const drone = mission.drones[i];
      drone.life -= dt;
      drone.angle += dt * (1.4 + i * 0.12);
      if (drone.fixed) {
        // Deployed drone: hover at fixed world position
        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;
        const dd = Math.hypot(dx, dy);
        if (dd > 12) {
          drone.x += (dx / dd) * Math.min(dd, 380 * dt);
          drone.y += (dy / dd) * Math.min(dd, 380 * dt);
        }
      } else {
        const targetX = p.x + Math.cos(drone.angle) * drone.orbit;
        const targetY = p.y + Math.sin(drone.angle) * drone.orbit;
        drone.x = lerp(drone.x, targetX, 1 - Math.pow(0.0005, dt));
        drone.y = lerp(drone.y, targetY, 1 - Math.pow(0.0005, dt));
      }
      drone.fireTimer -= dt;
      if (drone.fireTimer <= 0) {
        const target = acquireDroneTarget(mission, drone);
        if (target) {
          const a = angleTo(drone, target);
          drone.fireTimer = mission.stats.droneFireDelay;
          mission.bullets.push({
            x: drone.x + Math.cos(a) * 14,
            y: drone.y + Math.sin(a) * 14,
            vx: Math.cos(a) * 720,
            vy: Math.sin(a) * 720,
            r: 4,
            damage: mission.stats.droneDamage,
            life: 0.95,
          });
          spark(mission, drone.x, drone.y, "rgba(53, 216, 255, 0.58)", 2);
        }
      }
      if (drone.life <= 0) {
        burst(mission, drone.x, drone.y, 14, "rgba(53, 216, 255, 0.55)");
        mission.drones.splice(i, 1);
      }
    }
  }

  function missileTargetAlive(target) {
    if (!target) return false;
    if ("alive" in target) return target.alive;
    if ("hp" in target) return target.hp > 0;
    return true;
  }

  function explodeMissile(mission, missile) {
    mission.shake = Math.max(mission.shake, 14);
    burst(mission, missile.x, missile.y, 42, "rgba(255, 209, 102, 0.82)");
    mission.enemies.forEach((enemy) => {
      const d = Math.hypot(enemy.x - missile.x, enemy.y - missile.y);
      if (d < missile.splash + enemy.r) {
        damageEnemy(mission, enemy, missile.damage * (1 - d / (missile.splash + enemy.r)) + 28);
      }
    });
    mission.nodes.forEach((node) => {
      if (!node.alive) return;
      const d = Math.hypot(node.x - missile.x, node.y - missile.y);
      if (d < missile.splash + node.r) {
        damageNode(mission, node, missile.damage * 0.65);
      }
    });
    mission.rifts.forEach((rift) => {
      if (!rift.alive) return;
      const d = Math.hypot(rift.x - missile.x, rift.y - missile.y);
      if (d < missile.splash + rift.r) {
        damageRift(mission, rift, missile.damage * 0.8);
      }
    });
    for (let j = mission.hazards.length - 1; j >= 0; j -= 1) {
      const hazard = mission.hazards[j];
      const d = Math.hypot(hazard.x - missile.x, hazard.y - missile.y);
      if (hazard.type === "asteroid" && d < missile.splash + hazard.r) {
        hazard.hp -= missile.damage * 0.5;
        hazard.vx += ((hazard.x - missile.x) / Math.max(1, d)) * 160;
        hazard.vy += ((hazard.y - missile.y) / Math.max(1, d)) * 160;
        if (hazard.hp <= 0) { splitAsteroid(mission, hazard); mission.hazards.splice(j, 1); }
      } else if (hazard.type === "storm" && d < missile.splash + hazard.r) {
        hazard.hp -= missile.damage * 0.7;
        spark(mission, hazard.x, hazard.y, "rgba(181,140,255,0.9)", 16);
        if (hazard.hp <= 0) {
          burst(mission, hazard.x, hazard.y, 72, "rgba(181,140,255,0.8)");
          awardSalvage(mission, 150 + mission.planet.threat * 30, 0.42);
          mission.hazards.splice(j, 1);
        }
      }
    }
    playSfx("boom");
  }

  function inView(x, y, margin = 120) {
    return (
      x > state.camera.x - margin && x < state.camera.x + state.width + margin &&
      y > state.camera.y - margin && y < state.camera.y + state.height + margin
    );
  }

  function outsideWorld(mission, obj, pad = 0) {
    return (
      obj.x < -pad ||
      obj.y < -pad ||
      obj.x > mission.world.width + pad ||
      obj.y > mission.world.height + pad
    );
  }

  function updateEnemies(mission, dt) {
    const p = mission.player;
    mission.spawnTimer -= dt;
    if (mission.spawnTimer <= 0) {
      mission.spawnTimer = Math.max(3.2, 8.5 - mission.planet.threat * 0.55);
      const roll = Math.random();
      spawnEnemy(
        mission,
        roll > 0.82 && mission.planet.threat >= 4
          ? "seeder"
          : roll > 0.58
            ? "interceptor"
            : "drone",
      );
    }

    for (let i = mission.enemies.length - 1; i >= 0; i -= 1) {
      const e = mission.enemies[i];
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.fireTimer -= dt;
      e.angle = angleTo(e, p);
      const d = Math.hypot(p.x - e.x, p.y - e.y);

      if (e.type === "turret") {
        if (e.fireTimer <= 0 && d < 760) {
          enemyShoot(mission, e, e.damage, 390);
          e.fireTimer = 1.8 - mission.planet.threat * 0.07;
        }
      } else {
        let targetAngle = e.angle;
        if (e.type === "interceptor") targetAngle += e.strafe * 0.85;
        if (e.type === "seeder" && d < 420) targetAngle += Math.PI;
        const desired = e.speed * (e.type === "guardian" && d < 260 ? 0.4 : 1);
        e.vx += Math.cos(targetAngle) * desired * 2.1 * dt;
        e.vy += Math.sin(targetAngle) * desired * 2.1 * dt;
        e.vx *= Math.pow(0.07, dt);
        e.vy *= Math.pow(0.07, dt);
        const speed = Math.hypot(e.vx, e.vy);
        if (speed > e.speed) {
          e.vx = (e.vx / speed) * e.speed;
          e.vy = (e.vy / speed) * e.speed;
        }
        e.x = clamp(e.x + e.vx * dt, e.r, mission.world.width - e.r);
        e.y = clamp(e.y + e.vy * dt, e.r, mission.world.height - e.r);

        if (e.fireTimer <= 0 && d < (e.type === "guardian" ? 920 : 650)) {
          enemyShoot(mission, e, e.damage, e.type === "guardian" ? 430 : 350);
          if (e.type === "guardian") enemyShoot(mission, e, e.damage, 430, 0.16);
          if (e.type === "guardian") enemyShoot(mission, e, e.damage, 430, -0.16);
          e.fireTimer = e.type === "drone" ? rand(1.4, 2.5) : rand(0.9, 1.7);
        }
        if (e.type === "seeder") {
          e.spawnTimer -= dt;
          if (e.spawnTimer <= 0 && mission.enemies.length < 44) {
            e.spawnTimer = rand(4.2, 7.5);
            spawnEnemy(mission, "drone", e);
            playSfx("spawn");
          }
        }
      }

      if (d < e.r + 20) {
        hurtPlayer(mission, e.damage * dt * 1.7);
        const push = angleTo(e, p);
        p.vx += Math.cos(push) * 140 * dt;
        p.vy += Math.sin(push) * 140 * dt;
      }

      if (e.hp <= 0) {
        destroyEnemy(mission, e);
        mission.enemies.splice(i, 1);
      }
    }
  }

  function enemyShoot(mission, enemy, damage, speed, offset = 0) {
    const a = enemy.angle + offset;
    mission.enemyBullets.push({
      x: enemy.x + Math.cos(a) * (enemy.r + 8),
      y: enemy.y + Math.sin(a) * (enemy.r + 8),
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      r: enemy.type === "guardian" ? 7 : 5,
      damage,
      life: enemy.type === "guardian" ? 3 : 2.1,
    });
  }

  function damageEnemy(mission, enemy, amount) {
    enemy.hp -= amount;
    enemy.hitFlash = 0.09;
    spark(mission, enemy.x, enemy.y, "rgba(255, 209, 102, 0.7)", 3);
  }

  function destroyEnemy(mission, enemy) {
    const value = enemy.type === "guardian" ? 130 : enemy.type === "seeder" ? 42 : enemy.type === "turret" ? 28 : 18;
    const awarded = awardSalvage(mission, value, enemy.type === "guardian" ? 0.55 : 0.16);
    if (Math.random() < (enemy.type === "guardian" ? 1 : 0.18)) {
      mission.player.ammo = Math.min(mission.player.maxAmmo, mission.player.ammo + (enemy.type === "guardian" ? 18 : 5));
    }
    if (enemy.type === "guardian" || Math.random() < 0.06) {
      mission.player.missileAmmo = Math.min(mission.player.maxMissileAmmo, mission.player.missileAmmo + 1);
    }
    dropPickup(mission, enemy.x, enemy.y, awarded);
    burst(mission, enemy.x, enemy.y, enemy.type === "guardian" ? 54 : 20, "rgba(255, 209, 102, 0.82)");
    playSfx(enemy.type === "guardian" ? "boom" : "pop");
  }

  function damageNode(mission, node, amount) {
    node.hp -= amount;
    spark(mission, node.x, node.y, "rgba(181, 140, 255, 0.8)", 5);
    if (node.hp <= 0 && node.alive) {
      node.alive = false;
      const value = awardSalvage(mission, 45 + mission.planet.threat * 12, 0.32);
      dropPickup(mission, node.x, node.y, value);
      burst(mission, node.x, node.y, 34, "rgba(181, 140, 255, 0.78)");
      playSfx("node");
    }
  }

  function hurtPlayer(mission, amount) {
    const p = mission.player;
    if (p.invuln > 0) return;
    let remaining = amount;
    if (p.shield > 0) {
      const used = Math.min(p.shield, remaining);
      p.shield -= used;
      remaining -= used;
    }
    if (remaining > 0) p.hull -= remaining;
    p.damageFlash = Math.min(0.55, p.damageFlash + 0.2);
    p.shieldDelay = 1.65;
    p.invuln = 0.06;
    if (amount > 8) playSfx("hit");
  }

  function updateMidGamePowerups(mission, dt) {
    const p = mission.player;
    mission.powerupTimer -= dt;
    if (mission.powerupTimer <= 0) {
      mission.powerupTimer = rand(40, 68);
      const a = rand(0, TAU);
      const d = rand(360, 680);
      const x = clamp(p.x + Math.cos(a) * d, 160, mission.world.width - 160);
      const y = clamp(p.y + Math.sin(a) * d, 160, mission.world.height - 160);
      const kind = Math.random() < 0.38 ? "repair" : Math.random() < 0.55 ? "munition" : "overcharge";
      mission.caches.push({ x, y, r: 24, used: false, kind, pulse: 0 });
      showToast("Supply cache detected nearby.");
      spark(mission, x, y, "rgba(53, 216, 255, 0.8)", 18);
    }
    mission.ammoDropTimer -= dt;
    if (mission.ammoDropTimer <= 0) {
      mission.ammoDropTimer = rand(22, 38);
      // Drop a small ammo bonus at a random enemy kill site or random spot
      const a = rand(0, TAU);
      const d = rand(200, 520);
      const x = clamp(p.x + Math.cos(a) * d, 120, mission.world.width - 120);
      const y = clamp(p.y + Math.sin(a) * d, 120, mission.world.height - 120);
      mission.pickups.push({
        x, y, vx: 0, vy: 0,
        value: 0, life: 18,
        isAmmo: true,
        ammoAmount: Math.ceil(20 + state.save.upgrades.weapon * 5),
      });
    }
  }

  function updateObjectives(mission, dt) {
    const aliveNodes = mission.nodes.filter((node) => node.alive).length;
    const aliveRifts = mission.rifts.filter((rift) => rift.alive).length;
    const scannedRelays = mission.relays.filter((relay) => relay.scanned).length;
    mission.core.shielded = aliveNodes > 0 || aliveRifts > 0 || scannedRelays < mission.relays.length;
    mission.core.pulse += dt;

    if (mission.phase === "scan") {
      const p = mission.player;
      for (const relay of mission.relays) {
        if (relay.scanned) continue;
        relay.pulse += dt;
        const d = Math.hypot(p.x - relay.x, p.y - relay.y);
        if (d < 98 && state.keys.has("KeyE")) {
          relay.progress += dt * 34;
          p.heat = Math.min(100, p.heat + dt * 2.5);
          if (Math.random() < dt * 16) {
            addParticle(mission, relay.x, relay.y, {
              color: "rgba(53, 216, 255, 0.72)",
              vx: rand(-120, 120),
              vy: rand(-120, 120),
              size: rand(2, 5),
              life: rand(0.22, 0.55),
            });
          }
          if (relay.progress >= 100) {
            relay.scanned = true;
            awardSalvage(mission, 28 + mission.planet.threat * 5, 0.1);
            burst(mission, relay.x, relay.y, 24, "rgba(53, 216, 255, 0.72)");
            showToast("Recon relay scanned.");
            playSfx("pickup");
          }
        } else {
          relay.progress = Math.max(0, relay.progress - dt * 9);
        }
      }
      if (mission.relays.every((relay) => relay.scanned)) {
        const remainingNodes = mission.nodes.filter((n) => n.alive).length;
        if (remainingNodes === 0) {
          mission.phase = "purge";
          showToast("Recon complete. Core exposed.");
        } else {
          mission.phase = "nodes";
          showToast("Recon complete. Shield nodes are vulnerable.");
        }
      }
    }

    for (const node of mission.nodes) {
      if (!node.alive) continue;
      node.fireTimer -= dt;
      if (node.fireTimer <= 0) {
        node.fireTimer = rand(1.3, 2.2) - mission.planet.threat * 0.05;
        const a = angleTo(node, mission.player);
        mission.enemyBullets.push({
          x: node.x + Math.cos(a) * node.r,
          y: node.y + Math.sin(a) * node.r,
          vx: Math.cos(a) * 330,
          vy: Math.sin(a) * 330,
          r: 6,
          damage: 17 + mission.planet.threat * 2,
          life: 2.5,
        });
      }
    }

    if (aliveNodes === 0 && (mission.phase === "nodes" || mission.phase === "scan")) {
      mission.phase = aliveRifts > 0 ? "rifts" : "purge";
      showToast(aliveRifts > 0 ? "Destroy rift anchors before purge." : "Core exposed.");
      if (mission.planet.threat >= 4 && !mission.guardianSpawned) {
        mission.guardianSpawned = true;
        spawnEnemy(mission, "guardian", mission.core);
        showToast("Guardian signal detected.");
      }
    }

    if (mission.phase === "rifts" && aliveRifts === 0) {
      mission.phase = "purge";
      showToast("Rift anchors destroyed. Core exposed.");
    }

    if (mission.phase === "purge") {
      const p = mission.player;
      const coreDist = Math.hypot(p.x - mission.core.x, p.y - mission.core.y);
      if (state.keys.has("KeyE") && coreDist < 190) {
        mission.purge += dt * (18 + state.save.upgrades.special * 3);
        p.heat = Math.min(100, p.heat + dt * 4);
        if (Math.random() < dt * 24) {
          addParticle(mission, mission.core.x, mission.core.y, {
            color: "rgba(97, 242, 162, 0.8)",
            vx: rand(-210, 210),
            vy: rand(-210, 210),
            size: rand(2, 7),
            life: rand(0.35, 0.8),
          });
        }
      } else {
        mission.purge = Math.max(0, mission.purge - dt * 8);
      }
      if (mission.purge >= 100) {
        mission.phase = "extract";
        mission.extraction.active = true;
        mission.extractionTimer = Math.max(42, 82 - mission.planet.threat * 4);
        burst(mission, mission.core.x, mission.core.y, 92, "rgba(97, 242, 162, 0.72)");
        playSfx("purge");
        showToast("Colony core removed.");
      }
    }

    if (mission.phase === "extract") {
      const p = mission.player;
      mission.extractionTimer = Math.max(0, mission.extractionTimer - dt);
      if (mission.extractionTimer <= 0) {
        showToast("Extraction window collapsed.");
        completeMission(false);
        return;
      }
      const extractionDist = Math.hypot(p.x - mission.extraction.x, p.y - mission.extraction.y);
      if (state.keys.has("KeyE") && extractionDist < mission.extraction.r) {
        completeMission(true);
      }
    }
  }

  function updatePickups(mission, dt) {
    const p = mission.player;
    for (let i = mission.pickups.length - 1; i >= 0; i -= 1) {
      const item = mission.pickups[i];
      const a = angleTo(item, p);
      const d = Math.max(1, Math.hypot(p.x - item.x, p.y - item.y));
      const pull = d < 260 ? 520 / d : 0;
      item.vx += Math.cos(a) * pull * 180 * dt;
      item.vy += Math.sin(a) * pull * 180 * dt;
      item.vx *= Math.pow(0.08, dt);
      item.vy *= Math.pow(0.08, dt);
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      item.life -= dt;
      if (d < 28 || item.life <= 0) {
        if (d < 40) {
          playSfx("pickup");
          if (item.isAmmo) {
            p.ammo = Math.min(p.maxAmmo, p.ammo + (item.ammoAmount || 20));
            showToast(`Ammo resupply: +${item.ammoAmount || 20}`);
          }
        }
        mission.pickups.splice(i, 1);
      }
    }
  }

  function dropPickup(mission, x, y, value) {
    const pieces = clamp(Math.round(value / 18), 1, 8);
    for (let i = 0; i < pieces; i += 1) {
      mission.pickups.push({
        x: x + rand(-12, 12),
        y: y + rand(-12, 12),
        vx: rand(-90, 90),
        vy: rand(-90, 90),
        value: Math.round(value / pieces),
        life: 10,
      });
    }
  }

  function updateParticles(mission, dt) {
    for (let i = mission.particles.length - 1; i >= 0; i -= 1) {
      const p = mission.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.25, dt);
      p.vy *= Math.pow(0.25, dt);
      p.life -= dt;
      if (p.life <= 0) mission.particles.splice(i, 1);
    }
  }

  function updateCamera(mission, dt) {
    const p = mission.player;
    const targetX = clamp(p.x - state.width * 0.5, 0, Math.max(0, mission.world.width - state.width));
    const targetY = clamp(p.y - state.height * 0.5, 0, Math.max(0, mission.world.height - state.height));
    state.camera.x = lerp(state.camera.x, targetX, 1 - Math.pow(0.001, dt));
    state.camera.y = lerp(state.camera.y, targetY, 1 - Math.pow(0.001, dt));
  }

  function updateHud(mission) {
    const p = mission.player;
    const aliveNodes = mission.nodes.filter((node) => node.alive).length;
    const aliveRifts = mission.rifts.filter((rift) => rift.alive).length;
    const scannedRelays = mission.relays.filter((relay) => relay.scanned).length;
    ui.hudPlanet.textContent = mission.planet.name;
    ui.hudSalvage.textContent = Math.round(mission.salvage).toLocaleString();
    ui.hudTime.textContent = formatTime(mission.time);
    const hullPct = clamp(p.hull / p.maxHull, 0, 1);
    const shieldPct = clamp(p.shield / p.maxShield, 0, 1);
    const heatPct = clamp(p.heat / 100, 0, 1);
    const ammoPct = clamp(p.ammo / p.maxAmmo, 0, 1);
    const dashPct = 1 - clamp(p.dashTimer / mission.stats.dashCooldown, 0, 1);
    const pulsePct = 1 - clamp(p.specialTimer / mission.stats.specialCooldown, 0, 1);
    const missilePct = 1 - clamp(p.missileTimer / mission.stats.missileCooldown, 0, 1);
    const dronePct = 1 - clamp(p.droneTimer / mission.stats.droneCooldown, 0, 1);
    const speedPct = clamp(p.thrust.speed / mission.stats.maxSpeed, 0, 1);
    ui.hudCombo.textContent = `x${mission.combo.toFixed(1)}`;
    ui.hullText.textContent = `${Math.ceil(hullPct * 100)}%`;
    ui.shieldText.textContent =
      p.shieldDelay > 0 && shieldPct < 0.98 ? `${Math.ceil(shieldPct * 100)}% wait` : `${Math.ceil(shieldPct * 100)}%`;
    ui.heatText.textContent = p.heat > 96 ? "OVERHEAT" : `${Math.ceil(p.heat)}%`;
    ui.ammoText.textContent = `${Math.floor(p.ammo)} / ${p.maxAmmo}`;
    ui.hullBar.style.transform = `scaleX(${clamp(p.hull / p.maxHull, 0, 1)})`;
    ui.shieldBar.style.transform = `scaleX(${clamp(p.shield / p.maxShield, 0, 1)})`;
    ui.heatBar.style.transform = `scaleX(${heatPct})`;
    ui.ammoBar.style.transform = `scaleX(${ammoPct})`;
    ui.dashReady.textContent = p.dashTimer <= 0 ? "Ready" : `${p.dashTimer.toFixed(1)}s`;
    ui.pulseReady.textContent = p.specialTimer <= 0 ? "Ready" : `${p.specialTimer.toFixed(1)}s`;
    ui.missileReady.textContent =
      p.missileAmmo <= 0 ? "Empty" : p.missileTimer <= 0 ? `${p.missileAmmo} ready` : `${p.missileTimer.toFixed(1)}s`;
    ui.droneReady.textContent = p.droneTimer <= 0 ? "Ready" : `${p.droneTimer.toFixed(1)}s`;
    ui.speedText.textContent = `${Math.round(p.thrust.speed)}`;
    ui.dashCooldown.style.transform = `scaleX(${dashPct})`;
    ui.pulseCooldown.style.transform = `scaleX(${pulsePct})`;
    ui.missileCooldown.style.transform = `scaleX(${missilePct})`;
    ui.droneCooldown.style.transform = `scaleX(${dronePct})`;
    ui.speedBar.style.transform = `scaleX(${speedPct})`;
    // Controls overlay is toggled by H key only — do not auto-show here

    if (mission.phase === "scan") {
      ui.hudObjective.textContent = `Scan recon relays: ${scannedRelays} / ${mission.relays.length}`;
      const close = mission.relays.some((relay) => !relay.scanned && Math.hypot(p.x - relay.x, p.y - relay.y) < 98);
      ui.warning.textContent = close ? "Hold E to scan relay" : "Scan all recon relays to expose the colony core";
    } else if (mission.phase === "nodes") {
      ui.hudObjective.textContent = `Neutralize shield nodes: ${aliveNodes} remaining`;
      ui.warning.textContent =
        aliveNodes <= 1 ? "Core shield is weakening. Brake with Shift to hold aim on the last node." : "";
    } else if (mission.phase === "rifts") {
      ui.hudObjective.textContent = `Destroy rift anchors: ${aliveRifts} remaining`;
      ui.warning.textContent = "Rift anchors keep spawning defenders.";
    } else if (mission.phase === "purge") {
      ui.hudObjective.textContent = `Purge colony core: ${Math.floor(mission.purge)}%`;
      const close = Math.hypot(p.x - mission.core.x, p.y - mission.core.y) < 190;
      ui.warning.textContent = close ? "Hold E to purge colony core" : "Move to colony core";
    } else {
      ui.hudObjective.textContent = `Extract before collapse: ${Math.ceil(mission.extractionTimer || 0)}s`;
      const close = Math.hypot(p.x - mission.extraction.x, p.y - mission.extraction.y) < mission.extraction.r;
      ui.warning.textContent = close ? "Hold E to extract" : "Return to extraction beacon";
    }
    const nearbyCache = mission.caches.find((cache) => !cache.used && Math.hypot(cache.x - p.x, cache.y - p.y) < 120);
    if (nearbyCache) {
      ui.warning.textContent =
        nearbyCache.kind === "repair"
          ? "Repair cache nearby. Hold E to secure."
          : nearbyCache.kind === "munition"
            ? "Munition cache nearby. Hold E to resupply."
            : "Overcharge cache nearby. Hold E to secure.";
    }
    const nearbyRift = mission.rifts.find((rift) => rift.alive && Math.hypot(rift.x - p.x, rift.y - p.y) < 240);
    if (nearbyRift) {
      ui.warning.textContent = "Rift anchor is spawning defenders. Destroy it for combo salvage.";
    }

    if (p.heat > 96) {
      ui.warning.textContent = "Weapons overheated. Release fire to vent heat.";
    } else if (p.ammo <= 0) {
      ui.warning.textContent = "Primary ammo depleted. Secure munition caches or use abilities.";
    } else if (ammoPct < 0.18) {
      ui.warning.textContent = "Ammo low. Pick shots carefully.";
    } else if (p.inStorm) {
      ui.warning.textContent = "Ion storm interference. Shields draining and heat rising.";
    } else if (hullPct < 0.28) {
      ui.warning.textContent = "Hull critical. Use Shift brake and shields to recover spacing.";
    } else if (p.damageFlash > 0.2) {
      ui.warning.textContent = p.shield > 0 ? "Shield taking fire" : "Hull breach detected";
    }
  }

  function addParticle(mission, x, y, options) {
    mission.particles.push({
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      size: options.size || 3,
      color: options.color || "white",
      life: options.life || 0.5,
      maxLife: options.life || 0.5,
    });
  }

  function spark(mission, x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const a = rand(0, TAU);
      const v = rand(60, 260);
      addParticle(mission, x, y, {
        color,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        size: rand(1.5, 4.2),
        life: rand(0.18, 0.48),
      });
    }
  }

  function burst(mission, x, y, count, color) {
    for (let i = 0; i < count; i += 1) {
      const a = rand(0, TAU);
      const v = rand(80, 560);
      addParticle(mission, x, y, {
        color,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        size: rand(2, 8),
        life: rand(0.35, 1.15),
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, state.width, state.height);
    if (state.mode === "story") {
      renderStoryBackdrop();
    } else if (state.mode === "galaxy") {
      renderGalaxy();
    } else if (state.mode === "command" || !state.mission) {
      renderCommandBackdrop();
    } else {
      renderMission(state.mission);
    }
    requestAnimationFrame(loop);
  }

  function renderGalaxy() {
    if (!state.warp) return;
    const w = state.warp;
    w.timer += 0.016;
    w.speed = Math.min(1, w.timer / 2.5);
    ctx.fillStyle = "#000008";
    ctx.fillRect(0, 0, state.width, state.height);
    const cx = state.width / 2;
    const cy = state.height / 2;
    // Warp streaks
    w.streaks.forEach((s) => {
      const px = s.x * state.width;
      const py = s.y * state.height;
      const dx = px - cx;
      const dy = py - cy;
      const len = (s.len + w.speed * s.speed * 0.22) * Math.hypot(state.width, state.height) * 0.5;
      const nx = dx / Math.max(1, Math.hypot(dx, dy));
      const ny = dy / Math.max(1, Math.hypot(dx, dy));
      const alpha = Math.min(1, w.speed * 2) * (0.4 + s.speed * 0.5);
      ctx.strokeStyle = `rgba(160, 200, 255, ${alpha})`;
      ctx.lineWidth = 1 + w.speed * s.speed * 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + nx * len, py + ny * len);
      ctx.stroke();
      // Move streak outward
      s.x += (nx * w.speed * s.speed * 0.012);
      s.y += (ny * w.speed * s.speed * 0.012);
      if (s.x < 0 || s.x > 1 || s.y < 0 || s.y > 1) {
        s.x = 0.48 + rand(-0.05, 0.05);
        s.y = 0.48 + rand(-0.05, 0.05);
      }
    });
    // Central glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180 + w.speed * 120);
    glow.addColorStop(0, `rgba(100, 180, 255, ${w.speed * 0.35})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.width, state.height);
    // Auto-return after 8 seconds
    if (w.timer > 8) {
      state.warp = null;
      setMode("command");
    }
  }

  function renderStoryBackdrop() {
    const g = ctx.createLinearGradient(0, 0, 0, state.height);
    g.addColorStop(0, "#010208");
    g.addColorStop(1, "#040816");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.width, state.height);
    renderStars(0, 0, 0);
    const ng = ctx.createRadialGradient(
      state.width * 0.5, state.height * 0.42, 0,
      state.width * 0.5, state.height * 0.42, state.width * 0.58,
    );
    ng.addColorStop(0, "rgba(53, 216, 255, 0.05)");
    ng.addColorStop(0.55, "rgba(181, 140, 255, 0.03)");
    ng.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ng;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function renderCommandBackdrop() {
    const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
    gradient.addColorStop(0, "#02040a");
    gradient.addColorStop(0.45, "#07101b");
    gradient.addColorStop(1, "#090815");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);
    renderStars(0, 0, 0.15);
    const cx = state.width * 0.68;
    const cy = state.height * 0.46;
    for (let i = 0; i < planets.length; i += 1) {
      ctx.strokeStyle = `rgba(140, 210, 255, ${0.08 + i * 0.01})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 120 + i * 46, 48 + i * 25, -0.22, 0, TAU);
      ctx.stroke();
      const a = performance.now() * 0.00005 * (i + 1) + i * 0.72;
      const px = cx + Math.cos(a) * (120 + i * 46);
      const py = cy + Math.sin(a) * (48 + i * 25);
      ctx.fillStyle = planets[i].color;
      ctx.shadowColor = planets[i].accent;
      ctx.shadowBlur = i === state.selectedPlanet ? 24 : 8;
      ctx.beginPath();
      ctx.arc(px, py, i === state.selectedPlanet ? 7 : 4, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function renderMission(mission) {
    const cam = state.camera;
    const shakeX = mission.shake > 0 ? rand(-mission.shake, mission.shake) : 0;
    const shakeY = mission.shake > 0 ? rand(-mission.shake, mission.shake) : 0;
    ctx.save();
    const bg = ctx.createLinearGradient(0, 0, state.width, state.height);
    bg.addColorStop(0, "#03050b");
    bg.addColorStop(0.48, "#07111f");
    bg.addColorStop(1, "#0b0714");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);
    renderStars(cam.x, cam.y, 0.45);

    ctx.translate(shakeX - cam.x, shakeY - cam.y);
    drawWorldGrid(mission);
    drawNebula(mission);
    drawPlanetBackdrop(mission);
    drawHazards(mission);
    drawShieldTethers(mission);
    mission.rifts.forEach((rift) => drawRift(mission, rift));
    drawExtraction(mission);
    drawCore(mission);
    mission.nodes.forEach((node) => drawNode(mission, node));
    drawObjectivePrompts(mission);
    drawFlightVector(mission);
    mission.pickups.forEach(drawPickup);
    mission.bullets.forEach((bullet) => drawBullet(bullet, "#35d8ff"));
    mission.missiles.forEach(drawMissile);
    mission.enemyBullets.forEach((bullet) => drawBullet(bullet, "#ff5c7a"));
    mission.caches.forEach(drawCache);
    mission.enemies.filter((e) => inView(e.x, e.y, 80)).forEach(drawEnemy);
    drawPlayer(mission.player);
    mission.drones.filter((d) => inView(d.x, d.y, 60)).forEach(drawDrone);
    mission.particles.forEach(drawParticle);
    ctx.restore();
    drawGuidance(mission);
    drawReticle(mission);
    renderVignette();
    renderDamageOverlay(mission);
    renderMiniMap(mission);
  }

  function renderStars(offsetX, offsetY, parallax) {
    for (const star of state.stars) {
      const x = (star.x - offsetX * star.p * parallax) % state.width;
      const y = (star.y - offsetY * star.p * parallax) % state.height;
      ctx.fillStyle = `rgba(230, 248, 255, ${star.a})`;
      ctx.beginPath();
      ctx.arc(x < 0 ? x + state.width : x, y < 0 ? y + state.height : y, star.r, 0, TAU);
      ctx.fill();
    }
  }

  function drawWorldGrid(mission) {
    const step = 160;
    ctx.strokeStyle = "rgba(140, 210, 255, 0.055)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= mission.world.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mission.world.height);
      ctx.stroke();
    }
    for (let y = 0; y <= mission.world.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mission.world.width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(53, 216, 255, 0.28)";
    ctx.strokeRect(0, 0, mission.world.width, mission.world.height);
  }

  function drawPlanetBackdrop(mission) {
    const planet = mission.planet;
    // Centre-left, so the planet is always visible across the large world
    const px = mission.world.width * 0.62;
    const py = mission.world.height * 0.40;
    const r = 460 + planet.threat * 45;

    // Rings behind planet (Saturn / Uranus)
    if (planet.id === "saturn" || planet.id === "uranus") {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.28);
      const ringW = planet.id === "saturn" ? r * 0.82 : r * 0.64;
      const ringGrad = ctx.createLinearGradient(-r - ringW, 0, r + ringW, 0);
      ringGrad.addColorStop(0, "rgba(0,0,0,0)");
      ringGrad.addColorStop(0.28, `${planet.accent}55`);
      ringGrad.addColorStop(0.5, `${planet.color}88`);
      ringGrad.addColorStop(0.72, `${planet.accent}55`);
      ringGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = ringGrad;
      for (let ri = 0; ri < 5; ri += 1) {
        ctx.lineWidth = 8 + ri * 5;
        ctx.globalAlpha = 0.18 + ri * 0.04;
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.15 + ri * 0.14), 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Planet body gradient
    const grad = ctx.createRadialGradient(px - r * 0.32, py - r * 0.28, r * 0.04, px, py, r);
    grad.addColorStop(0, planet.accent);
    grad.addColorStop(0.38, planet.color);
    grad.addColorStop(0.78, `${planet.color}cc`);
    grad.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.globalAlpha = 0.58;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, TAU);
    ctx.fill();

    // Surface band stripes (gas giant look)
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, TAU);
    ctx.clip();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = planet.accent;
    const seed = planet.threat * 11;
    for (let band = 0; band < 8; band += 1) {
      const by = py - r + band * (r * 2 / 7) + ((seed * 3 + band * 17) % 22) - 11;
      const bh = 18 + (band * 13 + seed) % 32;
      ctx.fillRect(px - r, by, r * 2, bh);
    }
    // Pixel surface detail
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#ffffff";
    const ps = 16;
    const gridR = Math.floor(r / ps);
    for (let gy = -gridR; gy <= gridR; gy++) {
      for (let gx = -gridR; gx <= gridR; gx++) {
        if (Math.sqrt(gx * gx + gy * gy) > gridR) continue;
        if ((gx * 3 + gy * 7 + seed) % 7 === 0) {
          ctx.fillRect(px + gx * ps, py + gy * ps, ps - 2, ps - 2);
        }
      }
    }
    ctx.restore();

    // Atmosphere rim glow
    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = planet.accent;
    ctx.lineWidth = 18;
    ctx.shadowColor = planet.accent;
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(px, py, r + 4, 0, TAU);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Orbiting moon
    const moonAngle = performance.now() * 0.00018 * (planet.threat * 0.5 + 1);
    const moonDist = r * 1.55;
    const mx = px + Math.cos(moonAngle) * moonDist;
    const my = py + Math.sin(moonAngle) * moonDist * 0.42;
    const moonR = r * 0.14;
    const moonGrad = ctx.createRadialGradient(mx - moonR * 0.3, my - moonR * 0.3, 2, mx, my, moonR);
    moonGrad.addColorStop(0, "#d0c8be");
    moonGrad.addColorStop(1, "#4a4640");
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(mx, my, moonR, 0, TAU);
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  function drawShieldTethers(mission) {
    const activeNodes = mission.nodes.filter((node) => node.alive);
    if (!activeNodes.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    activeNodes.forEach((node, index) => {
      const pulse = 0.35 + Math.sin(mission.time * 4 + index) * 0.18;
      ctx.strokeStyle = `rgba(181, 140, 255, ${pulse})`;
      ctx.lineWidth = 2 + pulse * 2;
      ctx.setLineDash([18, 14]);
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.quadraticCurveTo(
        (node.x + mission.core.x) / 2 + Math.sin(mission.time + index) * 46,
        (node.y + mission.core.y) / 2 + Math.cos(mission.time + index) * 46,
        mission.core.x,
        mission.core.y,
      );
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawRift(mission, rift) {
    if (!rift.alive) return;
    const hp = clamp(rift.hp / rift.maxHp, 0, 1);
    const pulse = 0.5 + Math.sin(rift.pulse * 3) * 0.5;
    ctx.save();
    ctx.translate(rift.x, rift.y);
    ctx.rotate(rift.pulse * 0.8);
    ctx.globalCompositeOperation = "lighter";
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, rift.r * 2.2);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.22, "rgba(255, 92, 122, 0.45)");
    grad.addColorStop(1, "rgba(255, 92, 122, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rift.r * 2.2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 92, 122, ${0.55 + pulse * 0.3})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, rift.r * (0.75 + i * 0.26), rift.r * (0.28 + i * 0.1), i * 0.72, 0, TAU);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, rift.r + 15, -Math.PI / 2, -Math.PI / 2 + TAU * hp);
    ctx.stroke();
    ctx.restore();
  }

  function drawNebula(mission) {
    for (const cloud of mission.nebula) {
      const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
      grad.addColorStop(0, cloud.color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.r, 0, TAU);
      ctx.fill();
    }
  }

  function drawHazards(mission) {
    for (const hazard of mission.hazards) {
      if (hazard.type === "storm") {
        drawIonStorm(hazard);
      } else {
        drawAsteroid(hazard);
      }
    }
  }

  function drawIonStorm(storm) {
    const pulse = 0.5 + Math.sin(storm.pulse * 2.4) * 0.5;
    ctx.save();
    ctx.translate(storm.x, storm.y);
    const grad = ctx.createRadialGradient(0, 0, storm.r * 0.08, 0, 0, storm.r);
    grad.addColorStop(0, `rgba(181, 140, 255, ${0.22 + pulse * 0.1})`);
    grad.addColorStop(0.72, "rgba(53, 216, 255, 0.07)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, storm.r, 0, TAU);
    ctx.fill();
    ctx.rotate(storm.pulse * 0.35);
    ctx.strokeStyle = `rgba(181, 140, 255, ${0.35 + pulse * 0.2})`;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, storm.r * (0.38 + i * 0.14), i * 0.8, i * 0.8 + Math.PI * 1.15);
      ctx.stroke();
    }
    ctx.restore();
    // HP ring drawn separately (after restore to avoid rotation)
    if (storm.hp < storm.maxHp) {
      const hp = clamp(storm.hp / storm.maxHp, 0, 1);
      ctx.save();
      ctx.translate(storm.x, storm.y);
      ctx.strokeStyle = "rgba(60, 40, 80, 0.5)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, storm.r + 18, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(181, 140, 255, 0.9)";
      ctx.shadowColor = "#b58cff";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, storm.r + 18, -Math.PI / 2, -Math.PI / 2 + TAU * hp);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  function drawAsteroid(asteroid) {
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.angle);
    const ps = Math.max(3, Math.round(asteroid.r / 7));
    const halfG = Math.ceil(asteroid.r / ps);
    const seed = (Math.round(asteroid.r * 31 + Math.abs(asteroid.vy) * 17)) & 0x3fff;
    for (let gy = -halfG; gy <= halfG; gy++) {
      for (let gx = -halfG; gx <= halfG; gx++) {
        const d = Math.sqrt(gx * gx + gy * gy);
        if (d > halfG * 0.94) continue;
        if (d > halfG * 0.74 && ((gx * 7 + gy * 13 + seed) & 3) === 0) continue;
        const crack = ((gx * 5 + gy * 3 + seed) % 9) === 0 && d > halfG * 0.26;
        if (crack) {
          ctx.fillStyle = "#1e1c1a";
        } else if (d < halfG * 0.3) {
          ctx.fillStyle = "#b0a090";
        } else if (d < halfG * 0.62) {
          ctx.fillStyle = "#7a6e62";
        } else {
          ctx.fillStyle = "#4a4438";
        }
        ctx.fillRect(gx * ps - ps / 2, gy * ps - ps / 2, ps, ps);
      }
    }
    ctx.restore();
  }

  function drawCore(mission) {
    const c = mission.core;
    const pulse = 1 + Math.sin(c.pulse * 3) * 0.06;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.pulse * 0.45);
    ctx.strokeStyle = c.shielded ? "rgba(181, 140, 255, 0.58)" : "rgba(97, 242, 162, 0.72)";
    ctx.lineWidth = c.shielded ? 6 : 3;
    ctx.beginPath();
    ctx.arc(0, 0, c.r * 1.45 * pulse, 0, TAU);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * TAU;
      ctx.strokeStyle = i % 2 ? "rgba(255, 92, 122, 0.48)" : "rgba(53, 216, 255, 0.52)";
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
      ctx.lineTo(Math.cos(a) * c.r, Math.sin(a) * c.r);
      ctx.stroke();
    }
    const grad = ctx.createRadialGradient(-20, -16, 8, 0, 0, c.r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.22, c.shielded ? "#b58cff" : "#61f2a2");
    grad.addColorStop(1, "#290c2f");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, TAU);
    ctx.fill();
    if (mission.phase === "purge") {
      ctx.strokeStyle = "rgba(97, 242, 162, 0.86)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, c.r + 24, -Math.PI / 2, -Math.PI / 2 + TAU * (mission.purge / 100));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawNode(mission, node) {
    ctx.save();
    ctx.translate(node.x, node.y);
    if (!node.alive) {
      ctx.globalAlpha = 0.22;
    }
    ctx.rotate(node.angle + mission.time);
    ctx.strokeStyle = node.alive ? "rgba(181, 140, 255, 0.72)" : "rgba(255,255,255,0.18)";
    ctx.lineWidth = 3;
    ctx.strokeRect(-node.r, -node.r, node.r * 2, node.r * 2);
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-node.r * 0.8, -node.r * 0.8, node.r * 1.6, node.r * 1.6);
    const hp = clamp(node.hp / node.maxHp, 0, 1);
    ctx.fillStyle = node.alive ? "#b58cff" : "#475569";
    ctx.beginPath();
    ctx.arc(0, 0, node.r * 0.46, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, node.r + 10, -Math.PI / 2, -Math.PI / 2 + TAU * hp);
    ctx.stroke();
    ctx.restore();
  }

  function drawExtraction(mission) {
    const e = mission.extraction;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.strokeStyle = e.active ? "rgba(97, 242, 162, 0.82)" : "rgba(53, 216, 255, 0.36)";
    ctx.lineWidth = e.active ? 5 : 2;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, e.r, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = e.active ? "rgba(97, 242, 162, 0.09)" : "rgba(53, 216, 255, 0.05)";
    ctx.beginPath();
    ctx.arc(0, 0, e.r, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawObjectivePrompts(mission) {
    const p = mission.player;
    if (mission.phase === "nodes") {
      const node = nearestAliveNode(mission);
      if (node) {
        drawWorldLabel(node.x, node.y - node.r - 34, "Destroy shield node", "#b58cff");
      }
    } else if (mission.phase === "purge") {
      const close = Math.hypot(p.x - mission.core.x, p.y - mission.core.y) < 190;
      drawWorldLabel(
        mission.core.x,
        mission.core.y - mission.core.r - 44,
        close ? "Hold E to purge" : "Move to colony core",
        close ? "#61f2a2" : "#ffd166",
      );
    } else if (mission.phase === "extract") {
      const close = Math.hypot(p.x - mission.extraction.x, p.y - mission.extraction.y) < mission.extraction.r;
      drawWorldLabel(
        mission.extraction.x,
        mission.extraction.y - mission.extraction.r - 20,
        close ? "Hold E to extract" : "Extraction beacon",
        close ? "#61f2a2" : "#35d8ff",
      );
    }
    const cache = mission.caches.find((item) => !item.used && Math.hypot(item.x - p.x, item.y - p.y) < 130);
    if (cache) {
      drawWorldLabel(cache.x, cache.y - 46, "Hold E to secure cache", cache.kind === "repair" ? "#61f2a2" : "#35d8ff");
    }
    const rift = mission.rifts.find((item) => item.alive && Math.hypot(item.x - p.x, item.y - p.y) < 230);
    if (rift) {
      drawWorldLabel(rift.x, rift.y - 64, "Destroy rift anchor", "#ff5c7a");
    }
  }

  function drawWorldLabel(x, y, text, color) {
    ctx.save();
    ctx.font = "800 14px Inter, ui-sans-serif, system-ui, sans-serif";
    const width = Math.min(260, ctx.measureText(text).width + 30);
    ctx.fillStyle = "rgba(5, 10, 18, 0.78)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    roundRect(ctx, x - width / 2, y - 17, width, 34, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawFlightVector(mission) {
    const p = mission.player;
    const speed = Math.hypot(p.vx, p.vy);
    if (speed < 42) return;
    const scale = clamp(speed / mission.stats.maxSpeed, 0.18, 1.15);
    ctx.save();
    ctx.strokeStyle = p.thrust.brake ? "rgba(255, 209, 102, 0.78)" : "rgba(53, 216, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + (p.vx / speed) * 150 * scale, p.y + (p.vy / speed) * 150 * scale);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function nearestAliveNode(mission) {
    const alive = mission.nodes.filter((node) => node.alive);
    alive.sort((a, b) => Math.hypot(a.x - mission.player.x, a.y - mission.player.y) - Math.hypot(b.x - mission.player.x, b.y - mission.player.y));
    return alive[0];
  }

  function drawGuidance(mission) {
    const targets = [];
    if (mission.phase === "nodes") {
      const nodes = mission.nodes
        .filter((node) => node.alive)
        .sort((a, b) => Math.hypot(a.x - mission.player.x, a.y - mission.player.y) - Math.hypot(b.x - mission.player.x, b.y - mission.player.y))
        .slice(0, 3);
      nodes.forEach((node) => targets.push({ x: node.x, y: node.y, label: "NODE", color: "#b58cff" }));
    } else if (mission.phase === "purge") {
      targets.push({ x: mission.core.x, y: mission.core.y, label: "CORE", color: "#61f2a2" });
    } else if (mission.phase === "extract") {
      targets.push({ x: mission.extraction.x, y: mission.extraction.y, label: "EXTRACT", color: "#61f2a2" });
    }
    mission.enemies
      .filter((enemy) => enemy.type === "guardian" || Math.hypot(enemy.x - mission.player.x, enemy.y - mission.player.y) < 760)
      .slice(0, 3)
      .forEach((enemy) => targets.push({ x: enemy.x, y: enemy.y, label: enemy.type === "guardian" ? "GUARD" : "THREAT", color: "#ff5c7a" }));
    mission.rifts
      .filter((rift) => rift.alive)
      .slice(0, 2)
      .forEach((rift) => targets.push({ x: rift.x, y: rift.y, label: "RIFT", color: "#ff5c7a" }));

    targets.forEach((target) => drawScreenArrow(target));
  }

  function drawScreenArrow(target) {
    const sx = target.x - state.camera.x;
    const sy = target.y - state.camera.y;
    const margin = 52;
    if (sx > margin && sx < state.width - margin && sy > margin && sy < state.height - margin) return;
    const cx = state.width / 2;
    const cy = state.height / 2;
    const angle = Math.atan2(sy - cy, sx - cx);
    const x = clamp(sx, margin, state.width - margin);
    const y = clamp(sy, margin + 72, state.height - margin);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = target.color;
    ctx.shadowColor = target.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-11, -9);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-11, 9);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.rotate(-angle);
    ctx.font = "900 11px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(target.label, 0, 25);
    ctx.restore();
  }

  function drawReticle(mission) {
    const heat = clamp(mission.player.heat / 100, 0, 1);
    const color = heat > 0.92 ? "#ff5c7a" : "#35d8ff";
    const x = state.mouse.x;
    const y = state.mouse.y;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, 14 + heat * 8, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 25, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 25, y);
    ctx.moveTo(x, y - 25);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 25);
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawPickup(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(performance.now() * 0.003);
    if (item.isAmmo) {
      ctx.fillStyle = "#61f2a2";
      ctx.shadowColor = "#61f2a2";
      ctx.shadowBlur = 16;
      // Draw a small cross / plus shape for ammo
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillRect(-2, -6, 4, 12);
    } else {
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 12;
      ctx.fillRect(-5, -5, 10, 10);
    }
    ctx.restore();
  }

  function drawCache(cache) {
    if (cache.used) return;
    ctx.save();
    ctx.translate(cache.x, cache.y);
    ctx.rotate(cache.pulse * 0.8);
    const color = cache.kind === "repair" ? "#61f2a2" : "#35d8ff";
    ctx.strokeStyle = color;
    ctx.fillStyle = "rgba(5, 10, 18, 0.82)";
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2;
    roundRect(ctx, -22, -22, 44, 44, 8);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 8 + Math.sin(cache.pulse * 3) * 2, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawBullet(bullet, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = bullet.r * 1.4;
    ctx.lineCap = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y);
    ctx.lineTo(bullet.x - bullet.vx * 0.025, bullet.y - bullet.vy * 0.025);
    ctx.stroke();
    ctx.restore();
  }

  function drawMissile(missile) {
    ctx.save();
    ctx.translate(missile.x, missile.y);
    ctx.rotate(missile.angle);
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -6);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    const flash = e.hitFlash > 0;
    const baseColor =
      e.type === "guardian" ? "#ff5c7a"
      : e.type === "seeder" ? "#b58cff"
      : e.type === "turret" ? "#ffd166"
      : "#ff7a90";
    ctx.shadowColor = flash ? "#ffffff" : baseColor;
    ctx.shadowBlur = flash ? 32 : 14;
    const spr = SPRITES[e.type] || SPRITES.drone;
    const palette = flash ? spr.palette.map(() => "#ffffff") : spr.palette;
    drawPixelArt(spr.grid, spr.ps, palette);
    ctx.shadowBlur = 0;
    const hp = clamp(e.hp / e.maxHp, 0, 1);
    const bw = e.r * 2;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(-e.r, e.r + 8, bw, 4);
    ctx.fillStyle = flash ? "#ff4060" : baseColor;
    ctx.fillRect(-e.r, e.r + 8, bw * hp, 4);
    ctx.restore();
  }

  function drawGuardianHull(e, color) {
    const r = e.r;
    ctx.fillStyle = e.hitFlash > 0 ? "#ffffff" : "rgba(255, 92, 122, 0.92)";
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.moveTo(r * 1.25, 0);
    ctx.lineTo(r * 0.25, -r * 0.9);
    ctx.lineTo(-r * 0.7, -r * 1.08);
    ctx.lineTo(-r * 1.2, -r * 0.42);
    ctx.lineTo(-r * 0.86, 0);
    ctx.lineTo(-r * 1.2, r * 0.42);
    ctx.lineTo(-r * 0.7, r * 1.08);
    ctx.lineTo(r * 0.25, r * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.44)";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.42, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.56, 0, TAU);
    ctx.stroke();
    for (let side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.15, side * r * 0.48);
      ctx.lineTo(r * 0.86, side * r * 0.24);
      ctx.stroke();
    }
  }

  function drawSeederHull(e, color) {
    const r = e.r;
    ctx.fillStyle = e.hitFlash > 0 ? "#ffffff" : "rgba(181, 140, 255, 0.92)";
    ctx.strokeStyle = "rgba(255,255,255,0.68)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.18, r * 0.72, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, 0.25, Math.PI * 1.75);
    ctx.stroke();
    ctx.fillStyle = "rgba(5, 10, 18, 0.68)";
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.arc(r * 0.2, i * r * 0.36, r * 0.18, 0, TAU);
      ctx.fill();
    }
  }

  function drawTurretHull(e, color) {
    const r = e.r;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r + 16, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.56)";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.58, 0, TAU);
    ctx.stroke();
  }

  function drawDrone(drone) {
    ctx.save();
    ctx.translate(drone.x, drone.y);
    ctx.rotate(drone.angle);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(53, 216, 255, 0.84)";
    ctx.fillStyle = "rgba(53, 216, 255, 0.2)";
    ctx.shadowColor = "#35d8ff";
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(0, -10);
    ctx.lineTo(-14, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, TAU);
    ctx.fillStyle = "#edf7ff";
    ctx.fill();
    ctx.restore();
  }

  // --- Pixel Art Drawing System ---
  function drawPixelArt(grid, ps, palette) {
    const rows = grid.length;
    const cols = grid[0].length;
    const ox = -(cols * ps) / 2;
    const oy = -(rows * ps) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = grid[r][c];
        if (!v) continue;
        ctx.fillStyle = palette[v - 1] || palette[0];
        ctx.fillRect(ox + c * ps, oy + r * ps, ps, ps);
      }
    }
  }

  const SPRITES = {
    player: {
      grid: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,0,0,0,0,0,0],
        [2,1,1,1,1,1,1,0,0,0,0,0,0],
        [3,2,2,1,1,1,4,4,1,1,1,1,1],
        [2,1,1,1,1,1,1,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
      ],
      ps: 3,
      palette: ["#c8e4ff", "#35d8ff", "#61f2a2", "#9070ff"],
    },
    drone: {
      grid: [
        [0,0,0,1,0,0,0,0,0],
        [0,0,1,1,1,0,0,0,0],
        [0,1,1,2,1,1,0,0,0],
        [1,1,2,2,2,1,1,1,1],
        [0,1,1,2,1,1,0,0,0],
        [0,0,1,1,1,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],
      ],
      ps: 3,
      palette: ["#ff7a90", "#ff2040"],
    },
    interceptor: {
      grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,2,2,1,1,1],
        [1,1,1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
      ],
      ps: 3,
      palette: ["#ff5c7a", "#ff2040"],
    },
    turret: {
      grid: [
        [0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0,0,0,0],
        [0,1,1,2,1,2,1,1,0,0,0,0,0],
        [1,1,2,3,3,3,2,1,1,0,0,0,0],
        [1,1,2,3,3,3,3,3,3,3,3,3,3],
        [1,1,2,3,3,3,2,1,1,0,0,0,0],
        [0,1,1,2,1,2,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0,0,0],
      ],
      ps: 3,
      palette: ["#e8c050", "#b09030", "#ffd166"],
    },
    seeder: {
      grid: [
        [0,0,1,1,1,1,1,0,0,0,0],
        [0,1,2,1,1,1,2,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,0],
        [1,2,1,1,1,1,1,2,1,0,0],
        [1,2,1,1,3,1,1,2,1,1,1],
        [1,2,1,1,1,1,1,2,1,0,0],
        [1,1,1,1,1,1,1,1,1,0,0],
        [0,1,2,1,1,1,2,1,0,0,0],
        [0,0,1,1,1,1,1,0,0,0,0],
      ],
      ps: 3,
      palette: ["#b58cff", "#9060ff", "#ffffff"],
    },
    guardian: {
      grid: [
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,1,1,2,1,1,1,1,1,1,1,0,0,0,0],
        [1,1,2,2,1,1,1,1,1,1,1,1,1,0,0],
        [1,1,2,2,2,1,3,1,1,1,1,1,1,1,0],
        [1,1,2,2,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,2,2,2,1,3,1,1,1,1,1,1,1,0],
        [1,1,2,2,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,2,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
      ],
      ps: 4,
      palette: ["#ff5c7a", "#cc2040", "#ffffff"],
    },
  };

  function drawPlayer(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    drawPlayerJets(p);
    if (p.shield > 1) {
      const sa = 0.22 + (p.shield / p.maxShield) * 0.42;
      ctx.strokeStyle = `rgba(53, 216, 255, ${sa})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#35d8ff";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, TAU);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    const flash = p.invuln > 0.08;
    const hc = HULL_COLORS[state.save.customization.hullColor || 0];
    ctx.shadowColor = hc.engine;
    ctx.shadowBlur = flash ? 36 : 20;
    const palette = flash
      ? ["#ffffff", "#ffffff", "#ffffff", "#ffffff"]
      : [hc.body, hc.engine, "#61f2a2", hc.cockpit];
    drawPixelArt(SPRITES.player.grid, SPRITES.player.ps, palette);
    ctx.shadowBlur = 0;
    ctx.restore();
    drawAbilityRings(p);
  }

  function drawPlayerJets(p) {
    const t = p.thrust || {};
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    if (t.forward) drawJet(-22, 0, Math.PI, 28, "#35d8ff");
    if (t.reverse) drawJet(22, 0, 0, 18, "#ffd166");
    if (t.strafe < 0) drawJet(0, 17, Math.PI / 2, 18, "#61f2a2");
    if (t.strafe > 0) drawJet(0, -17, -Math.PI / 2, 18, "#61f2a2");
    if (t.brake) {
      drawJet(-16, -14, Math.PI, 22, "#ffd166");
      drawJet(-16, 14, Math.PI, 22, "#ffd166");
    }
    ctx.restore();
  }

  function drawJet(x, y, angle, length, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(0, 0, -length, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-length, 0);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawAbilityRings(p) {
    if (!state.mission) return;
    const dashReady = 1 - clamp(p.dashTimer / state.mission.stats.dashCooldown, 0, 1);
    const pulseReady = 1 - clamp(p.specialTimer / state.mission.stats.specialCooldown, 0, 1);
    const missileReady = 1 - clamp(p.missileTimer / state.mission.stats.missileCooldown, 0, 1);
    const droneReady = 1 - clamp(p.droneTimer / state.mission.stats.droneCooldown, 0, 1);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(97, 242, 162, 0.78)";
    ctx.beginPath();
    ctx.arc(0, 0, 36, -Math.PI / 2, -Math.PI / 2 + TAU * dashReady);
    ctx.stroke();
    ctx.strokeStyle = "rgba(181, 140, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(0, 0, 42, -Math.PI / 2, -Math.PI / 2 + TAU * pulseReady);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 209, 102, 0.76)";
    ctx.beginPath();
    ctx.arc(0, 0, 48, -Math.PI / 2, -Math.PI / 2 + TAU * missileReady);
    ctx.stroke();
    ctx.strokeStyle = "rgba(53, 216, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, 54, -Math.PI / 2, -Math.PI / 2 + TAU * droneReady);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticle(p) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + (1 - alpha) * 0.8), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function renderVignette() {
    const grad = ctx.createRadialGradient(
      state.width * 0.5,
      state.height * 0.5,
      state.height * 0.25,
      state.width * 0.5,
      state.height * 0.5,
      state.height * 0.78,
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function renderDamageOverlay(mission) {
    const p = mission.player;
    const hullDanger = 1 - clamp(p.hull / p.maxHull / 0.34, 0, 1);
    const hit = clamp(p.damageFlash / 0.55, 0, 1);
    const heat = p.heat > 92 ? clamp((p.heat - 92) / 8, 0, 1) : 0;
    if (hullDanger <= 0 && hit <= 0 && heat <= 0) return;
    ctx.save();
    if (hullDanger > 0 || hit > 0) {
      ctx.globalAlpha = Math.max(hullDanger * 0.22, hit * 0.28);
      ctx.strokeStyle = "#ff5c7a";
      ctx.lineWidth = 18 + hit * 20;
      ctx.strokeRect(0, 0, state.width, state.height);
    }
    if (heat > 0) {
      ctx.globalAlpha = heat * 0.18;
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(0, 0, state.width, state.height);
    }
    ctx.restore();
  }

  function renderMiniMap(mission) {
    const w = mini.width;
    const h = mini.height;
    miniCtx.clearRect(0, 0, w, h);
    miniCtx.fillStyle = "rgba(2, 5, 12, 0.78)";
    miniCtx.fillRect(0, 0, w, h);
    const sx = w / mission.world.width;
    const sy = h / mission.world.height;
    miniCtx.strokeStyle = "rgba(140, 210, 255, 0.28)";
    miniCtx.strokeRect(0.5, 0.5, w - 1, h - 1);
    mission.hazards.forEach((hazard) => {
      if (hazard.type === "storm") {
        miniCtx.strokeStyle = "rgba(181, 140, 255, 0.5)";
        miniCtx.beginPath();
        miniCtx.arc(hazard.x * sx, hazard.y * sy, Math.max(4, hazard.r * sx), 0, TAU);
        miniCtx.stroke();
      } else {
        miniCtx.fillStyle = "rgba(215, 194, 161, 0.55)";
        miniCtx.fillRect(hazard.x * sx - 1.5, hazard.y * sy - 1.5, 3, 3);
      }
    });
    mission.caches.forEach((cache) => {
      if (cache.used) return;
      miniCtx.strokeStyle = cache.kind === "repair" ? "#61f2a2" : "#35d8ff";
      miniCtx.strokeRect(cache.x * sx - 3, cache.y * sy - 3, 6, 6);
    });
    mission.rifts.forEach((rift) => {
      if (!rift.alive) return;
      miniCtx.strokeStyle = "#ff5c7a";
      miniCtx.beginPath();
      miniCtx.arc(rift.x * sx, rift.y * sy, 4.5, 0, TAU);
      miniCtx.stroke();
    });
    mission.nodes.forEach((node) => {
      miniCtx.fillStyle = node.alive ? "#b58cff" : "#334155";
      miniCtx.beginPath();
      miniCtx.arc(node.x * sx, node.y * sy, 3.5, 0, TAU);
      miniCtx.fill();
    });
    miniCtx.fillStyle = mission.phase === "extract" ? "#61f2a2" : "#ff5c7a";
    miniCtx.beginPath();
    miniCtx.arc(mission.core.x * sx, mission.core.y * sy, 5, 0, TAU);
    miniCtx.fill();
    mission.enemies.forEach((enemy) => {
      miniCtx.fillStyle = enemy.type === "guardian" ? "#ff5c7a" : "#ffd166";
      miniCtx.fillRect(enemy.x * sx - 1.5, enemy.y * sy - 1.5, 3, 3);
    });
    miniCtx.fillStyle = "#35d8ff";
    miniCtx.beginPath();
    miniCtx.arc(mission.player.x * sx, mission.player.y * sy, 4.5, 0, TAU);
    miniCtx.fill();
    mission.missiles.forEach((missile) => {
      miniCtx.fillStyle = "#ffd166";
      miniCtx.fillRect(missile.x * sx - 1.5, missile.y * sy - 1.5, 3, 3);
    });
    mission.drones.forEach((drone) => {
      miniCtx.fillStyle = "#35d8ff";
      miniCtx.fillRect(drone.x * sx - 1.5, drone.y * sy - 1.5, 3, 3);
    });
    if (mission.extraction.active) {
      miniCtx.strokeStyle = "#61f2a2";
      miniCtx.beginPath();
      miniCtx.arc(mission.extraction.x * sx, mission.extraction.y * sy, 5, 0, TAU);
      miniCtx.stroke();
    }
  }

  function unlockAudio() {
    if (state.audio || state.save.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.045;
    master.connect(context.destination);
    state.audio = { context, master };
  }

  function playSfx(kind) {
    if (state.save.muted) return;
    unlockAudio();
    if (!state.audio) return;
    const { context, master } = state.audio;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const presets = {
      click: [360, 0.04, "triangle"],
      launch: [120, 0.35, "sawtooth"],
      shot: [620, 0.035, "square"],
      missile: [300, 0.16, "sawtooth"],
      drone: [740, 0.18, "triangle"],
      dash: [260, 0.09, "triangle"],
      hit: [90, 0.08, "sawtooth"],
      pulse: [180, 0.35, "sine"],
      node: [240, 0.18, "triangle"],
      purge: [150, 0.5, "sine"],
      boom: [70, 0.32, "sawtooth"],
      pop: [180, 0.09, "triangle"],
      pickup: [820, 0.04, "sine"],
      upgrade: [520, 0.22, "triangle"],
      spawn: [130, 0.12, "sawtooth"],
      rift: [110, 0.42, "sawtooth"],
      victory: [440, 0.55, "triangle"],
      fail: [70, 0.5, "sawtooth"],
    };
    const [freq, length, type] = presets[kind] || presets.click;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(35, freq * 0.45), now + length);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + length + 0.02);
  }

  function toggleMute() {
    state.save.muted = !state.save.muted;
    saveGame();
    if (state.save.muted && state.audio) {
      state.audio.context.close();
      state.audio = null;
    } else {
      playSfx("click");
    }
    renderCommandDeck();
  }

  function loop(now) {
    const dt = clamp((now - state.last) / 1000, 0, 0.033);
    state.last = now;
    update(dt);
    render();
  }

  function bindEvents() {
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", (event) => {
      if (state.mode === "story") {
        setMode("command");
        return;
      }
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight", "KeyF", "KeyR"].includes(event.code)) {
        event.preventDefault();
      }
      if (event.code === "KeyP" && (state.mode === "playing" || state.mode === "paused")) {
        setMode(state.mode === "paused" ? "playing" : "paused");
        playSfx("click");
        return;
      }
      if (event.code === "KeyM") {
        toggleMute();
        return;
      }
      if (event.code === "KeyH" && state.mode === "playing") {
        ui.controlsOverlay.classList.toggle("hidden");
        return;
      }
      if (event.code === "KeyF" && state.mode === "playing") {
        launchMissile(state.mission);
        return;
      }
      if (event.code === "KeyR" && state.mode === "playing") {
        deployDrone(state.mission);
        return;
      }
      if (event.code === "KeyG" && state.mode === "playing") {
        deployDroneAt(state.mission);
        return;
      }
      state.keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => {
      state.keys.delete(event.code);
    });
    window.addEventListener("pointermove", (event) => {
      state.mouse.x = event.clientX;
      state.mouse.y = event.clientY;
    });
    if (ui.skipStoryButton) {
      ui.skipStoryButton.addEventListener("click", () => setMode("command"));
    }
    canvas.addEventListener("pointerdown", (event) => {
      if (state.mode === "story") { setMode("command"); return; }
      if (state.mode !== "playing") return;
      event.preventDefault();
      unlockAudio();
      state.mouse.down = true;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", (event) => {
      state.mouse.down = false;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released by the browser.
      }
    });
    canvas.addEventListener("pointerleave", () => {
      state.mouse.down = false;
    });

    ui.planetList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-planet]");
      if (!button) return;
      state.selectedPlanet = Number(button.dataset.planet);
      playSfx("click");
      renderCommandDeck();
    });
    ui.upgradeList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-upgrade]");
      if (!button) return;
      buyUpgrade(button.dataset.upgrade);
    });
    const hangarList = document.getElementById("hangarList");
    if (hangarList) {
      hangarList.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-hull-index]");
        if (!btn) return;
        state.save.customization.hullColor = Number(btn.dataset.hullIndex);
        saveGame();
        renderHangar();
        playSfx("click");
        showToast(`Hull paint: ${HULL_COLORS[state.save.customization.hullColor].name}`);
      });
    }
    // Ship paint modal
    if (ui.paintButton) {
      ui.paintButton.addEventListener("click", () => {
        renderPaintModal();
        if (ui.paintScreen) ui.paintScreen.classList.remove("hidden");
      });
    }
    const closePaintBtn = document.getElementById("closePaintButton");
    const confirmPaintBtn = document.getElementById("confirmPaintButton");
    if (closePaintBtn) closePaintBtn.addEventListener("click", () => {
      if (ui.paintScreen) ui.paintScreen.classList.add("hidden");
    });
    if (confirmPaintBtn) confirmPaintBtn.addEventListener("click", () => {
      if (ui.paintScreen) ui.paintScreen.classList.add("hidden");
      renderHangar();
      showToast(`Hull paint: ${HULL_COLORS[state.save.customization.hullColor || 0].name}`);
    });
    if (ui.paintSwatchGrid) {
      ui.paintSwatchGrid.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-hull-index]");
        if (!btn) return;
        state.save.customization.hullColor = Number(btn.dataset.hullIndex);
        saveGame();
        renderPaintModal();
        playSfx("click");
      });
    }

    ui.launchButton.addEventListener("click", () => startMission());
    ui.repairButton.addEventListener("click", repairShip);
    ui.resetButton.addEventListener("click", resetSave);
    ui.muteButton.addEventListener("click", toggleMute);
    ui.resumeButton.addEventListener("click", () => setMode("playing"));
    ui.abortButton.addEventListener("click", abortMission);
    ui.continueButton.addEventListener("click", returnToCommand);
    ui.retryButton.addEventListener("click", retryMission);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.mode === "playing") setMode("paused");
    });

    // ── Mobile controls ──────────────────────────────────────────────
    bindMobileControls();
  }

  function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  function showMobileControls(show) {
    const mc = document.getElementById("mobileControls");
    if (!mc) return;
    mc.classList.toggle("hidden", !show);
    mc.setAttribute("aria-hidden", String(!show));
  }

  function bindMobileControls() {
    if (!isTouchDevice()) return;

    const joystickZone = document.getElementById("joystickZone");
    const joystickKnob = document.getElementById("joystickKnob");
    const joystickBase = document.getElementById("joystickBase");
    const btnFire = document.getElementById("btnFire");
    const btnDash = document.getElementById("btnDash");
    const btnPulse = document.getElementById("btnPulse");
    const btnMissile = document.getElementById("btnMissile");
    const btnDrone = document.getElementById("btnDrone");
    const btnAction = document.getElementById("btnAction");
    const mobPause = document.getElementById("mobPause");

    if (!joystickZone || !btnFire) return;

    // Joystick state
    const joystick = { active: false, pointerId: null, startX: 0, startY: 0, dx: 0, dy: 0 };
    const DEAD_ZONE = 12;
    const MAX_RADIUS = 52;

    function updateJoystick(cx, cy, tx, ty) {
      let dx = tx - cx;
      let dy = ty - cy;
      const dist = Math.hypot(dx, dy);
      const clamped = Math.min(dist, MAX_RADIUS);
      if (dist > 0) { dx = (dx / dist) * clamped; dy = (dy / dist) * clamped; }
      joystick.dx = dx;
      joystick.dy = dy;
      // Move knob visually
      joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

      // Map to key presses
      const fwd = dy < -DEAD_ZONE;
      const rev = dy > DEAD_ZONE;
      const lft = dx < -DEAD_ZONE;
      const rgt = dx > DEAD_ZONE;
      if (fwd) state.keys.add("KeyW"); else state.keys.delete("KeyW");
      if (rev) state.keys.add("KeyS"); else state.keys.delete("KeyS");
      if (lft) state.keys.add("KeyA"); else state.keys.delete("KeyA");
      if (rgt) state.keys.add("KeyD"); else state.keys.delete("KeyD");
    }

    function resetJoystick() {
      joystick.active = false;
      joystick.pointerId = null;
      joystick.dx = 0;
      joystick.dy = 0;
      joystickKnob.style.transform = "translate(-50%, -50%)";
      state.keys.delete("KeyW");
      state.keys.delete("KeyS");
      state.keys.delete("KeyA");
      state.keys.delete("KeyD");
    }

    joystickZone.addEventListener("pointerdown", (e) => {
      if (state.mode !== "playing") return;
      e.preventDefault();
      unlockAudio();
      joystick.active = true;
      joystick.pointerId = e.pointerId;
      const rect = joystickBase.getBoundingClientRect();
      joystick.startX = rect.left + rect.width / 2;
      joystick.startY = rect.top + rect.height / 2;
      joystickZone.setPointerCapture(e.pointerId);
      updateJoystick(joystick.startX, joystick.startY, e.clientX, e.clientY);
    }, { passive: false });

    joystickZone.addEventListener("pointermove", (e) => {
      if (!joystick.active || e.pointerId !== joystick.pointerId) return;
      e.preventDefault();
      updateJoystick(joystick.startX, joystick.startY, e.clientX, e.clientY);
    }, { passive: false });

    joystickZone.addEventListener("pointerup", (e) => {
      if (e.pointerId !== joystick.pointerId) return;
      resetJoystick();
    });
    joystickZone.addEventListener("pointercancel", () => resetJoystick());

    // Aim: touch on right half of screen moves aim
    canvas.addEventListener("pointermove", (e) => {
      if (state.mode !== "playing") return;
      // Use touch position as aim for right-side touches
      if (e.clientX > state.width * 0.45) {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
      }
    });

    // Fire button (hold = continuous fire)
    btnFire.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      unlockAudio();
      state.mouse.down = true;
      btnFire.classList.add("pressed");
    }, { passive: false });
    btnFire.addEventListener("pointerup", () => {
      state.mouse.down = false;
      btnFire.classList.remove("pressed");
    });
    btnFire.addEventListener("pointercancel", () => {
      state.mouse.down = false;
      btnFire.classList.remove("pressed");
    });

    // Dash (Space)
    btnDash.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      state.keys.add("Space");
      btnDash.classList.add("pressed");
    }, { passive: false });
    btnDash.addEventListener("pointerup", () => {
      state.keys.delete("Space");
      btnDash.classList.remove("pressed");
    });
    btnDash.addEventListener("pointercancel", () => {
      state.keys.delete("Space");
      btnDash.classList.remove("pressed");
    });

    // Nova Pulse (Q)
    btnPulse.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      state.keys.add("KeyQ");
      btnPulse.classList.add("pressed");
    }, { passive: false });
    btnPulse.addEventListener("pointerup", () => {
      state.keys.delete("KeyQ");
      btnPulse.classList.remove("pressed");
    });
    btnPulse.addEventListener("pointercancel", () => {
      state.keys.delete("KeyQ");
      btnPulse.classList.remove("pressed");
    });

    // Missile (F)
    btnMissile.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (state.mode === "playing" && state.mission) launchMissile(state.mission);
      btnMissile.classList.add("pressed");
      setTimeout(() => btnMissile.classList.remove("pressed"), 160);
    }, { passive: false });

    // Drone (R)
    btnDrone.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (state.mode === "playing" && state.mission) deployDrone(state.mission);
      btnDrone.classList.add("pressed");
      setTimeout(() => btnDrone.classList.remove("pressed"), 160);
    }, { passive: false });

    // Action (E)
    btnAction.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      state.keys.add("KeyE");
      btnAction.classList.add("pressed");
    }, { passive: false });
    btnAction.addEventListener("pointerup", () => {
      state.keys.delete("KeyE");
      btnAction.classList.remove("pressed");
    });
    btnAction.addEventListener("pointercancel", () => {
      state.keys.delete("KeyE");
      btnAction.classList.remove("pressed");
    });

    // Mobile pause
    if (mobPause) {
      mobPause.addEventListener("click", () => {
        if (state.mode === "playing" || state.mode === "paused") {
          setMode(state.mode === "paused" ? "playing" : "paused");
          playSfx("click");
        }
      });
    }
  }

  // --- Story Intro ---
  let storyCharIndex = 0;
  let storyLineIndex = 0;
  const STORY_LINES = [
    "YEAR 2142.",
    "",
    "THE OUTER COLONIES",
    "HAVE FALLEN.",
    "",
    'A ROGUE AI CALLED',
    '"DOMINION" HAS SEIZED',
    "THE SOLAR SYSTEM.",
    "",
    "YOU COMMAND THE",
    "LAST FREE FLEET.",
    "",
    "LIBERATE THE PLANETS.",
    "FREE HUMANITY.",
  ];

  function startStory() {
    if (!ui.storyScreen) { setMode("command"); return; }
    ui.storyText.innerHTML = "";
    storyCharIndex = 0;
    storyLineIndex = 0;
    ui.skipStoryButton.classList.add("hidden");
    setTimeout(typewriterTick, 900);
  }

  function typewriterTick() {
    if (state.mode !== "story") return;
    if (storyLineIndex >= STORY_LINES.length) {
      ui.skipStoryButton.classList.remove("hidden");
      return;
    }
    const line = STORY_LINES[storyLineIndex];
    if (storyCharIndex === 0) {
      const div = document.createElement("div");
      div.className = line === "" ? "story-line story-gap" : "story-line";
      ui.storyText.appendChild(div);
    }
    const cur = ui.storyText.lastElementChild;
    if (!cur) { storyLineIndex++; storyCharIndex = 0; setTimeout(typewriterTick, 60); return; }
    if (storyCharIndex < line.length) {
      cur.textContent += line[storyCharIndex];
      storyCharIndex++;
      setTimeout(typewriterTick, 52);
    } else {
      storyLineIndex++;
      storyCharIndex = 0;
      setTimeout(typewriterTick, line === "" ? 90 : 340);
    }
  }

  resize();
  bindEvents();
  renderCommandDeck();
  requestAnimationFrame((now) => {
    state.last = now;
    loop(now);
  });
  startStory();
})();

