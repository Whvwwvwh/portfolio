(function () {
  const C = window.CONTENT;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const initials = (s) => s.split(/[\s,·]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const chips = (list = []) => `<div class="chips">${list.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;

  /* Palette rétro */
  const COL = { blue: "#2E6FB7", green: "#1F8A5B", yellow: "#F2A71B", orange: "#E8622C", pink: "#F2A7B8", ink: "#262626", blush: "#EEDDD9" };
  const CYCLE = [COL.orange, COL.blue, COL.green, COL.yellow, COL.pink];
  const SECTION = {
    projets:  { color: COL.orange, badge: "Projets" },
    parcours: { color: COL.blue,   badge: "XP" },
    mixes:    { color: COL.pink,   badge: "Sets" },
    passions: { color: COL.green,  badge: "Fun" },
    contact:  { color: COL.yellow, badge: "Hello" },
  };
  const onDark = (c) => (c === COL.blue || c === COL.green ? COL.blush : COL.ink);

  /* Formes géométriques décoratives (SVG) */
  const SHAPES = {
    ring: (c) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke="${c}" stroke-width="22"/></svg>`,
    cross: (c) => `<svg viewBox="0 0 100 100"><path d="M38 0h24v38h38v24H62v38H38V62H0V38h38z" fill="${c}"/></svg>`,
    steps: (c) => `<svg viewBox="0 0 120 100">${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 8}" y="${i * 20}" width="80" height="14" rx="7" fill="${c}"/>`).join("")}</svg>`,
    half: (c) => `<svg viewBox="0 0 100 50"><path d="M0 50a50 50 0 0 1 100 0z" fill="${c}"/></svg>`,
  };
  const shape = (type, color, css) => `<span class="shape" aria-hidden="true" style="${css}">${SHAPES[type](color)}</span>`;

  /* ---------- En-tête & scène ---------- */
  $("#nom").textContent = C.profil.nom;
  $("#titre").textContent = C.profil.titre;
  $("#accroche").textContent = C.profil.accroche || "";
  $("#cv-link").href = C.profil.cv;
  if (C.profil.linkedin) $("#linkedin-link").href = C.profil.linkedin; else $("#linkedin-link").remove();

  /* Plan mobile : chaque meuble ouvre sa section */
  $$(".plan-spot").forEach((g) => {
    g.addEventListener("click", () => go(g.dataset.go));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(g.dataset.go); } });
  });
  $("#studio-bg").src = C.scene;
  if (C.profil.cvApercu) $("#monitor-cv").src = C.profil.cvApercu;

  const order = C.hotspots.map((h) => h.id);
  C.hotspots.forEach((h, i) => {
    const color = (SECTION[h.id] || {}).color || COL.orange;
    const b = document.createElement("button");
    b.className = "hotspot";
    b.style.cssText = `left:${h.left}%;top:${h.top}%;width:${h.width}%;height:${h.height}%;--c:${color}`;
    if (h.top < 12) b.dataset.tag = "below";
    b.setAttribute("aria-label", `${h.label} : ${h.hint}`);
    b.innerHTML = `<span class="dot"></span><span class="tag"><b>${pad(i + 1)}</b>${esc(h.hint)}</span>`;
    b.addEventListener("click", () => go(h.id));
    $("#hotspots").appendChild(b);

    const n = document.createElement("button");
    n.dataset.id = h.id;
    n.style.setProperty("--c", color);
    n.innerHTML = `<i aria-hidden="true"></i>${esc(h.hint)}`;
    n.addEventListener("click", () => go(h.id));
    $("#quicknav").appendChild(n);
  });

  const wrap = $("#studio-wrap");
  const centerScene = () => { wrap.scrollLeft = wrap.scrollWidth * 0.47 - wrap.clientWidth / 2; };
  window.addEventListener("load", () => requestAnimationFrame(centerScene));
  window.addEventListener("resize", centerScene);
  if (window.ResizeObserver) new ResizeObserver(centerScene).observe(wrap);

  /* Écran du projecteur : diaporama des projets */
  $("#screen-count").textContent = C.projets.length;
  const slides = C.projets.filter((p) => p.image).map((p) => {
    const im = new Image();
    im.alt = ""; im.loading = "lazy"; im.src = p.image;
    im.onerror = () => im.remove();
    $("#screen-slides").appendChild(im);
    return im;
  });
  let slide = 0;
  if (slides.length) {
    slides[0].classList.add("on");
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(() => {
        const live = $$("#screen-slides img");
        if (!live.length) return;
        live.forEach((im) => im.classList.remove("on"));
        slide = (slide + 1) % live.length;
        live[slide].classList.add("on");
      }, 3500);
    }
  }

  /* Visionneuse d'images */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "Image agrandie");
  lightbox.innerHTML = `<img alt="">`;
  document.body.appendChild(lightbox);
  const zoom = (src) => { lightbox.querySelector("img").src = src; lightbox.hidden = false; };
  lightbox.addEventListener("click", () => { lightbox.hidden = true; });

  /* =====================================================================
     PROJETS — étagère de cassettes VHS
     ===================================================================== */
  let vhsIndex = 0;
  const tapeColor = (p, i) => p.couleur || CYCLE[i % CYCLE.length];

  const mediaEmbed = (url, poster) => {
    if (!url) return `<div class="video-box label">▶ Vidéo à venir</div>`;
    if (/youtube\.com|youtu\.be|vimeo\.com/.test(url)) return `<div class="video-box"><iframe src="${esc(url)}" allowfullscreen loading="lazy" title="Vidéo"></iframe></div>`;
    return `<div class="video-box"><video src="${esc(url)}" ${poster ? `poster="${esc(poster)}"` : ""} controls preload="none" playsinline></video></div>`;
  };

  function renderProjets() {
    const tapes = C.projets.map((p, i) => `
      <button class="tape${p.image ? " has-img" : ""}" data-i="${i}" style="--c:${tapeColor(p, i)};color:${onDark(tapeColor(p, i))};${p.image ? `--img:url('${esc(p.image)}')` : ""}" aria-label="${esc(p.titre)} — ${esc(p.client)}">
        <span class="spine">${esc(p.titre)}</span>
        <span class="vhs-logo">VHS</span>
        <span class="cover">
          <span class="cv-top">${esc(p.client)}</span>
          <span class="cv-title">${esc(p.titre)}</span>
          <span class="cv-mid"></span>
          <span class="cv-bottom"><b>VHS</b><span>${esc(p.annee || "")}</span></span>
        </span>
      </button>`).join("");

    return `
      <p class="lead">Les archives du studio : chaque cassette est un projet. Fais défiler l'étagère et choisis une bande.</p>
      <div class="dark-block">
        <div class="vhs-stage"><div class="vhs-row" id="vhs-row">${tapes}</div></div>
        <div class="vhs-nav">
          <button id="vhs-prev" aria-label="Projet précédent">←</button>
          <span class="vhs-count" id="vhs-count"></span>
          <button id="vhs-next" aria-label="Projet suivant">→</button>
        </div>
        <div class="dark-foot label"><span>${C.projets.length} projets</span><span>Produit · Web · Mobile · Jeu</span><span>← → pour naviguer</span></div>
      </div>
      <div class="vhs-detail" id="vhs-detail" aria-live="polite"></div>
      ${C.videos && C.videos.length ? `
        <h3>Bandes 3D — espaces & scénographie</h3>
        <div class="video-grid">${C.videos.map((v) => `
          <div class="video-card">${mediaEmbed(v.video, v.poster)}<h4>${esc(v.titre)}</h4><p>${esc(v.resume)}</p></div>`).join("")}
        </div>` : ""}`;
  }

  function updateVhs() {
    const tapes = $$("#vhs-row .tape");
    if (!tapes.length) return;
    tapes.forEach((t, i) => {
      const d = i - vhsIndex;
      t.classList.toggle("active", d === 0);
      t.style.setProperty("--d", Math.abs(d));
      t.style.setProperty("--side", d < 0 ? 1 : d > 0 ? -1 : 0);
      t.style.zIndex = 50 - Math.abs(d);
      t.tabIndex = d === 0 ? 0 : -1;
      t.hidden = Math.abs(d) > 5;
    });
    const p = C.projets[vhsIndex];
    const color = tapeColor(p, vhsIndex);
    const years = (p.annee || "").split(/\s*[–-]\s*/);
    const liens = (p.liens || []).map((l) => `<a class="pill" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
    const prev = C.projets[(vhsIndex - 1 + C.projets.length) % C.projets.length];
    const next = C.projets[(vhsIndex + 1) % C.projets.length];
    const info = (k, v) => (v ? `<div class="info"><dt>${k}</dt><dd>${esc(v)}</dd></div>` : "");
    $("#vhs-count").textContent = `${pad(vhsIndex + 1)} / ${pad(C.projets.length)}`;
    $("#vhs-detail").innerHTML = `
      <div>
        <div class="arch" style="--c:${color}" ${p.image ? `data-zoom="${esc(p.image)}" role="button" tabindex="0" aria-label="Agrandir l'image"` : ""}>
          <span class="arch-fallback">${esc(initials(p.titre))}</span>
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.titre)} — aperçu du projet" loading="lazy" style="position:absolute;inset:0" onerror="this.remove()">` : ""}
        </div>
        ${p.annee ? `<div class="arch-years"><span>${esc(years[0])}</span><span>${esc(years[1] || "")}</span></div>` : ""}
        ${(p.galerie || []).length ? `<div class="gallery">${p.galerie.map((g, k) => `<button data-zoom="${esc(g)}" aria-label="Agrandir l'image ${k + 2}"><img src="${esc(g)}" alt="${esc(p.titre)} — image ${k + 2}" loading="lazy" onerror="this.parentNode.remove()"></button>`).join("")}</div>` : ""}
      </div>
      <div>
        <span class="label client">${esc(p.client)}</span>
        <h4>${esc(p.titre)}</h4>
        <p class="resume">${esc(p.resume)}</p>
        ${chips(p.tags)}
        ${liens ? `<div class="links">${liens}</div>` : ""}
        <dl>
          ${info("Contexte", p.contexte)}
          ${info("Mon rôle", p.role)}
          ${info("Choix de design défendu", p.choix)}
          ${info("Résultat", p.resultat)}
        </dl>
        <div class="proj-nav">
          <button data-step="-1"><span class="label">← Précédent</span><b>${esc(prev.titre)}</b></button>
          <button data-step="1"><span class="label">Suivant →</span><b>${esc(next.titre)}</b></button>
        </div>
      </div>`;
    $$("#vhs-detail [data-step]").forEach((b) => b.addEventListener("click", () => {
      setVhs(vhsIndex + +b.dataset.step);
      $("#vhs-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    $$("#vhs-detail [data-zoom]").forEach((el) => {
      el.addEventListener("click", () => zoom(el.dataset.zoom));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zoom(el.dataset.zoom); } });
    });
  }
  const setVhs = (i) => { vhsIndex = (i + C.projets.length) % C.projets.length; updateVhs(); };

  function bindProjets() {
    $$("#vhs-row .tape").forEach((t) => t.addEventListener("click", () => setVhs(+t.dataset.i)));
    $("#vhs-prev").addEventListener("click", () => setVhs(vhsIndex - 1));
    $("#vhs-next").addEventListener("click", () => setVhs(vhsIndex + 1));
    updateVhs();
  }

  /* =====================================================================
     MIXES — platine avec lecteur MP3
     ===================================================================== */
  const audio = $("#audio");
  const mixes = C.mixes || [];
  let current = -1;
  let ctx, analyser, freq, raf, seeking = false, audioError = "";

  const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}` : "0:00");
  const side = (i) => `${i % 2 ? "B" : "A"}${Math.floor(i / 2) + 1}`;

  function renderMixes() {
    if (!mixes.length) return `<p class="empty-note">Ajoute tes MP3 dans assets/mixes/ puis liste-les dans content.js.</p>`;
    const m = mixes[Math.max(current, 0)];
    return `
      <p class="lead">Pose le diamant : appuie sur play et la platine se met à tourner.</p>
      <div class="dark-block">
        <div class="deck" id="deck">
          <div class="platter-wrap">
            <div class="platter"></div>
            <div class="vinyl"><div class="vinyl-label"><b id="label-initials">${esc(initials(m.titre))}</b></div></div>
            <svg class="tonearm" viewBox="0 0 100 150" aria-hidden="true">
              <circle cx="82" cy="15" r="11" fill="#3a3a3a" stroke="#666" stroke-width="2"/>
              <circle cx="82" cy="15" r="4" fill="#F2A7B8"/>
              <path d="M82 15 L44 116 L33 134" stroke="#EEDDD9" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="24" y="128" width="16" height="12" rx="2" transform="rotate(25 32 134)" fill="#F2A71B"/>
            </svg>
          </div>
          <div class="deck-info">
            <span class="label" id="deck-side">Face ${side(Math.max(current, 0))}</span>
            <div class="deck-title" id="deck-title">${esc(m.titre)}</div>
            <div class="deck-genre" id="deck-genre">${esc(m.genre || "")}</div>
            <div class="controls">
              <button class="ctrl" id="prev" aria-label="Morceau précédent">⏮</button>
              <button class="ctrl play" id="play" aria-label="Lecture">▶</button>
              <button class="ctrl" id="next" aria-label="Morceau suivant">⏭</button>
            </div>
            <div class="progress">
              <span id="t-cur">0:00</span>
              <input type="range" id="seek" min="0" max="1000" value="0" aria-label="Position dans le morceau">
              <span id="t-dur">0:00</span>
            </div>
            <div class="vu" id="vu">${"<i></i>".repeat(25)}</div>
            <a class="pill sc-link" id="sc-link" target="_blank" rel="noopener" hidden>Écouter sur SoundCloud ↗</a>
            <label class="volume">VOL <input type="range" id="vol" min="0" max="1" step="0.01" value="${audio.volume}" aria-label="Volume"></label>
          </div>
        </div>
      </div>
      <h3>Tracklist</h3>
      <ol class="tracklist">${mixes.map((x, i) => `
        <li><button data-i="${i}"><span class="t-side">${side(i)}</span><span class="t-name">${esc(x.titre)}</span><span class="t-meta">${esc(x.genre || "")}</span></button></li>`).join("")}
      </ol>`;
  }

  /* ---------- Lecteur : MP3 local OU piste SoundCloud (même platine) ----------
     Dans content.js, chaque mix peut avoir  soundcloud: "https://soundcloud.com/…"
     (prioritaire) ou  fichier: "assets/mixes/….mp3". */
  const P = { mode: "audio", paused: true, time: 0, dur: 0, widget: null, frame: null, pending: null };
  let scApi = null;
  const loadScApi = () => scApi || (scApi = new Promise((res, rej) => {
    if (window.SC && window.SC.Widget) return res();
    const sc = document.createElement("script");
    sc.src = "https://w.soundcloud.com/player/api.js";
    sc.onload = () => res(); sc.onerror = () => rej(new Error("api"));
    document.head.appendChild(sc);
  }));

  function scLoad(url, autoplay) {
    P.mode = "soundcloud"; P.paused = true; P.time = 0; P.dur = 0;
    audio.pause(); audio.removeAttribute("src");
    if (!P.frame) {
      P.frame = document.createElement("iframe");
      P.frame.className = "sc-frame";
      P.frame.allow = "autoplay";
      P.frame.title = "Lecteur SoundCloud";
      document.body.appendChild(P.frame);
    }
    P.frame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&visual=false&show_comments=false&show_user=false&show_reposts=false&hide_related=true`;
    loadScApi().then(() => {
      const W = window.SC.Widget;
      P.widget = W(P.frame);
      P.widget.bind(W.Events.READY, () => {
        P.widget.getDuration((ms) => { P.dur = ms / 1000; syncDeck(); });
        P.widget.setVolume(Math.round(audio.volume * 100));
        if (P.pending != null) { P.widget.seekTo(P.pending * 1000); P.pending = null; }
        if (autoplay) P.widget.play();
      });
      P.widget.bind(W.Events.PLAY, () => { P.paused = false; audioError = ""; syncDeck(); });
      P.widget.bind(W.Events.PAUSE, () => { P.paused = true; syncDeck(); });
      P.widget.bind(W.Events.FINISH, () => { P.paused = true; mixes.length > 1 ? load(current + 1, true) : syncDeck(); });
      P.widget.bind(W.Events.PLAY_PROGRESS, (e) => { P.time = e.currentPosition / 1000; updateTime(); });
      P.widget.bind(W.Events.ERROR, () => { audioError = "Piste SoundCloud indisponible (lien privé ou supprimé ?)."; syncDeck(); });
    }).catch(() => { audioError = "Impossible de charger le lecteur SoundCloud."; syncDeck(); });
  }

  const isPaused = () => (P.mode === "soundcloud" ? P.paused : audio.paused);
  const curTime = () => (P.mode === "soundcloud" ? P.time : audio.currentTime);
  const duration = () => (P.mode === "soundcloud" ? P.dur : audio.duration);

  function load(i, autoplay) {
    current = (i + mixes.length) % mixes.length;
    audioError = "";
    const m = mixes[current];
    if (m.soundcloud) { scLoad(m.soundcloud, autoplay); syncDeck(); return; }
    P.mode = "audio";
    if (P.widget) P.widget.pause();
    audio.src = m.fichier;
    syncDeck();
    if (autoplay) play();
  }
  function play() {
    if (current < 0) return load(0, true);
    if (P.mode === "soundcloud") {
      if (P.widget) P.widget.play();
      /* Certains navigateurs mobiles bloquent la lecture pilotée à distance : on propose alors le lien direct */
      const asked = current;
      setTimeout(() => { if (P.mode === "soundcloud" && P.paused && current === asked) { audioError = "La lecture n'a pas démarré : utilise « Écouter sur SoundCloud »."; syncDeck(); } }, 5000);
      return;
    }
    /* Vumètre réel (Web Audio) seulement sur un vrai serveur : en file://, le son serait coupé. */
    const canAnalyse = /^https?:$/.test(location.protocol);
    if (canAnalyse && !ctx && (window.AudioContext || window.webkitAudioContext)) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        freq = new Uint8Array(analyser.frequencyBinCount);
        src.connect(analyser); analyser.connect(ctx.destination);
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    audio.play().catch((err) => {
      if (err.name === "AbortError") return;
      audioError = err.name === "NotAllowedError"
        ? "Le navigateur a bloqué la lecture : clique à nouveau sur ▶."
        : `Lecture impossible : ${mixes[current].fichier}`;
      syncDeck();
    });
  }
  function pause() { P.mode === "soundcloud" ? P.widget && P.widget.pause() : audio.pause(); }
  function seekTo(t) {
    if (P.mode === "soundcloud") {
      if (P.widget) { P.widget.seekTo(t * 1000); P.time = t; if (P.paused) P.widget.play(); } else P.pending = t;
      return;
    }
    const ok = [...Array(audio.seekable.length).keys()].some((k) => t >= audio.seekable.start(k) && t <= audio.seekable.end(k));
    if (!ok) { audioError = "Ce serveur ne permet pas d'avancer dans le morceau (voir serveur-local.py)."; syncDeck(); return; }
    audioError = "";
    audio.currentTime = t;
    if (audio.paused) play();
  }
  audio.addEventListener("error", () => {
    if (current < 0 || P.mode !== "audio" || !audio.getAttribute("src")) return;
    audioError = `Fichier introuvable : ${mixes[current].fichier}`;
    syncDeck();
  });
  const toggle = () => (isPaused() ? play() : pause());

  function syncDeck() {
    const playing = current >= 0 && !isPaused();
    const m = mixes[Math.max(current, 0)];
    const np = $("#now-playing");
    np.hidden = current < 0;
    if (m) $("#np-title").textContent = `${playing ? "En lecture" : "En pause"} — ${m.titre}`;
    np.querySelector(".np-disc").style.animationPlayState = playing ? "running" : "paused";

    const deck = $("#deck");
    if (!deck || !m) return;
    deck.classList.toggle("playing", playing);
    $("#play").textContent = playing ? "❚❚" : "▶";
    $("#play").setAttribute("aria-label", playing ? "Pause" : "Lecture");
    $("#deck-title").textContent = m.titre;
    $("#deck-genre").textContent = audioError || m.genre || "";
    $("#deck-genre").classList.toggle("deck-error", !!audioError);
    $("#deck-side").textContent = `Face ${side(Math.max(current, 0))}${m.soundcloud ? " · SoundCloud" : ""}`;
    $("#label-initials").textContent = initials(m.titre);
    const scl = $("#sc-link");
    if (scl) { scl.hidden = !m.soundcloud; if (m.soundcloud) scl.href = m.soundcloud; }
    $$(".tracklist button").forEach((b) => b.classList.toggle("current", +b.dataset.i === current));
    updateTime();
  }
  function updateTime() {
    if (!$("#deck")) return;
    const d = duration();
    if (!seeking) $("#t-cur").textContent = fmt(curTime());
    $("#t-dur").textContent = fmt(d);
    if (!seeking) $("#seek").value = d ? (curTime() / d) * 1000 : 0;
  }
  function vuLoop() {
    cancelAnimationFrame(raf);
    const bars = $$("#vu i");
    const tick = () => {
      if (!bars.length || !document.body.contains(bars[0])) return;
      const playing = current >= 0 && !isPaused();
      if (playing && analyser && P.mode === "audio") {
        analyser.getByteFrequencyData(freq);
        bars.forEach((b, i) => { b.style.height = `${8 + (freq[i] / 255) * 92}%`; });
      } else if (playing) {
        const t = performance.now() / 160;
        bars.forEach((b, i) => { b.style.height = `${12 + Math.abs(Math.sin(t + i * 0.7) * Math.cos(t * 0.6 + i)) * 80}%`; });
      } else {
        bars.forEach((b) => { b.style.height = "8%"; });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  }
  function bindMixes() {
    if (!$("#deck")) return;
    $("#play").addEventListener("click", toggle);
    $("#prev").addEventListener("click", () => load(current - 1, true));
    $("#next").addEventListener("click", () => load(current + 1, true));
    $$(".tracklist button").forEach((b) => b.addEventListener("click", () => load(+b.dataset.i, true)));
    const seek = $("#seek");
    const target = () => (seek.value / 1000) * duration();
    const jump = () => {
      seeking = false;
      if (current < 0) { load(0, false); return; }
      if (!duration()) return;
      seekTo(target());
    };
    seek.addEventListener("input", () => { seeking = true; if (duration()) $("#t-cur").textContent = fmt(target()); });
    seek.addEventListener("change", jump);
    seek.addEventListener("pointerup", () => { if (seeking) jump(); });
    $("#vol").addEventListener("input", (e) => {
      audio.volume = +e.target.value;
      if (P.widget) P.widget.setVolume(Math.round(audio.volume * 100));
    });
    syncDeck();
    vuLoop();
  }
  ["play", "pause", "loadedmetadata"].forEach((ev) => audio.addEventListener(ev, () => { if (P.mode === "audio") syncDeck(); }));
  audio.addEventListener("timeupdate", () => { if (P.mode === "audio") updateTime(); });
  audio.addEventListener("ended", () => (mixes.length > 1 ? load(current + 1, true) : syncDeck()));
  $("#now-playing").addEventListener("click", () => go("mixes"));

  /* =====================================================================
     AUTRES SECTIONS
     ===================================================================== */
  /* ---------- Profil mesuré (tests AssessFirst) ---------- */
  const LEVEL = {
    "Distinctif": { size: 74, color: COL.pink, note: "Supérieur à 80 % des gens" },
    "Avéré": { size: 62, color: COL.orange, note: "Supérieur à 60 % des gens" },
    "Mobilisable": { size: 50, color: COL.yellow, note: "Supérieur à 40 % des gens" },
    "À développer": { size: 34, color: "#16A3A3", note: "Inférieur à 60 % des gens" },
    "Non développé": { size: 18, color: COL.blue, note: "Inférieur à 80 % des gens" },
  };
  const FAMILY_COLORS = [COL.pink, COL.blue, COL.orange, COL.green, "#9B9595"];

  /* Radar des 20 traits, regroupés en 5 familles (comme le rapport SWIPE) */
  function radar20(familles) {
    const traits = familles.flatMap((f, fi) => f.traits.map(([t, v]) => ({ t, v, fi })));
    const n = traits.length, cx = 180, cy = 180, R = 130;
    const ang = (i) => -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / n;
    const pt = (i, v, r = R) => [cx + Math.cos(ang(i)) * r * (v / 10), cy + Math.sin(ang(i)) * r * (v / 10)];
    const arc = (r, a0, a1) => {
      const p0 = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], p1 = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
      return `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
    };
    let out = "";
    familles.forEach((f, fi) => {
      const a0 = -Math.PI / 2 + (fi * 4 * 2 * Math.PI) / n + 0.03, a1 = -Math.PI / 2 + ((fi + 1) * 4 * 2 * Math.PI) / n - 0.03;
      out += `<path d="${arc(R + 18, a0, a1)}" stroke="${FAMILY_COLORS[fi]}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    });
    [2, 4, 6, 8, 10].forEach((v) => { out += `<circle cx="${cx}" cy="${cy}" r="${(R * v) / 10}" fill="none" stroke="currentColor" stroke-opacity="${v === 10 ? .35 : .15}"/>`; });
    traits.forEach((_, i) => { const [x, y] = pt(i, 10); out += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="currentColor" stroke-opacity=".12"/>`; });
    out += `<polygon points="${traits.map((d, i) => pt(i, d.v).join(",")).join(" ")}" fill="${COL.pink}" fill-opacity=".55" stroke="#262626" stroke-width="2.5" stroke-linejoin="round"/>`;
    traits.forEach((d, i) => {
      const [x, y] = pt(i, d.v);
      out += `<circle cx="${x}" cy="${y}" r="9" fill="${FAMILY_COLORS[d.fi]}" stroke="#262626" stroke-width="1.5"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" font-size="10" font-weight="800" fill="#262626">${d.v}</text>`;
      const [lx, ly] = pt(i, 10, R + 40);
      out += `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor" opacity=".7">${i + 1}</text>`;
    });
    return `<svg viewBox="0 0 360 360" role="img" aria-label="Radar des 20 traits de personnalité">${out}</svg>`;
  }
  const ringSVG = (pct, color, size = 92) => {
    const r = 36, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 92 92" style="width:${size}px;height:${size}px" aria-hidden="true"><circle cx="46" cy="46" r="${r}" fill="none" stroke="#262626" stroke-opacity=".15" stroke-width="12"/><circle cx="46" cy="46" r="${r}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(c * pct) / 100} ${c}" transform="rotate(-90 46 46)"/><text x="46" y="52" text-anchor="middle" font-weight="800" font-size="18" fill="currentColor">${pct}%</text></svg>`;
  };
  const bar = (label, v, max, color) => `<div class="bar" style="--c:${color}">${esc(label)}<em>${v}/${max}</em><div class="track"><span style="width:${(v / max) * 100}%"></span></div></div>`;
  const slider = (left, right, pct) => `<div class="slider"><span>${left}</span><div class="slider-track"><i style="left:${pct}%"></i></div><span>${right}</span></div>`;

  function renderSwipe(S) {
    let k = 0;
    return `
      <div class="profile-grid">
        <div class="card dark card-wide disc-card">
          <div>
            <span class="label">Personnalité DISC</span>
            <div class="disc-style">${esc(S.disc.style)} <small>(${esc(S.disc.code)})</small></div>
            <div class="disc-traits">${S.disc.qualites.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            <p>${esc(S.disc.texte)}</p>
          </div>
          <ul class="atouts">${S.atouts.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>
        <div class="card card-wide radar-card">
          <div class="radar">${radar20(S.familles)}</div>
          <div class="radar-legend">
            <span class="label">Profil radar · 20 traits notés sur 10</span>
            ${S.familles.map((f, fi) => `
              <div class="fam"><b style="--c:${FAMILY_COLORS[fi]}">${esc(f.nom)}</b>
                <div class="fam-list">${f.traits.map(([t, v]) => { k++; return `<div class="fam-row"><span class="fam-n" style="--c:${FAMILY_COLORS[fi]}">${k}</span><span class="fam-t">${esc(t)}</span><span class="fam-v"><i style="width:${v * 10}%;background:${FAMILY_COLORS[fi]}"></i></span><em>${v}</em></div>`; }).join("")}</div>
              </div>`).join("")}
          </div>
        </div>
        <div class="card card-wide">
          <span class="label">Talent cloud</span><h4>Mes talents comportementaux</h4>
          <div class="cloud">${S.talentCloud.map((g) => `
            <div class="cloud-row"><b>${esc(g.groupe)}</b>${g.talents.map(([t, lvl]) => `
              <div class="cloud-cell"><span class="dotwrap"><i style="width:${LEVEL[lvl].size}px;height:${LEVEL[lvl].size}px;background:${LEVEL[lvl].color}"></i></span><small>${esc(t)}</small></div>`).join("")}
            </div>`).join("")}
          </div>
          <div class="cloud-legend">${Object.entries(LEVEL).map(([k2, v]) => `<span><i style="background:${v.color}"></i>${k2} · ${v.note}</span>`).join("")}</div>
        </div>
      </div>`;
  }

  function renderDrive(D) {
    return `
      <div class="profile-grid">
        <div class="card card-wide">
          <span class="label">Motivations principales</span><h4>Ce qui me fait avancer</h4>
          <div class="motiv-cards">${D.motivations.map((m, i) => `
            <div class="motiv-card" style="--c:${[COL.pink, COL.orange, COL.yellow][i % 3]}"><span class="score">${m.score}<small>/10</small></span><b>${esc(m.nom)}</b><p>${esc(m.texte)}</p></div>`).join("")}
          </div>
          <span class="label" style="display:block;margin-top:22px">Orientation des motivations</span>
          ${slider("Stabilité", "Dynamisme", D.orientation)}
        </div>
        <div class="card"><span class="label">Les 3 activités que je préfère</span><h4>Mes activités</h4>
          <div class="rings">${D.activites.map(([a, v], i) => `<div class="ring">${ringSVG(v, CYCLE[(i + 1) % CYCLE.length])}<b>${esc(a)}</b></div>`).join("")}</div>
        </div>
        <div class="card"><span class="label">Les styles de leadership qui me conviennent</span><h4>Mon manager idéal</h4>
          <div class="rings">${D.leadership.map(([a, v], i) => `<div class="ring">${ringSVG(v, [COL.pink, COL.green][i % 2])}<b>${esc(a)}</b></div>`).join("")}</div>
          <p class="culture">Culture privilégiée <span>${esc(D.culture)}</span></p>
        </div>
        <div class="card card-wide"><span class="label">Mes drivers · notés sur 10</span><h4>Ce que je recherche</h4>
          <div class="drivers">${D.drivers.map((g, gi) => `
            <div><b class="drv-title">${esc(g.groupe)}</b><div class="bars">${g.items.map(([t, v], i) => bar(t, v, 10, CYCLE[(gi * 2 + i) % CYCLE.length])).join("")}</div></div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  function renderBrain(B) {
    const max = Math.max(...B.distribution);
    const colors = ["#1E88E5", "#1E88E5", "#16A3A3", "#16A3A3", COL.yellow, COL.yellow, COL.orange, COL.orange, COL.pink, COL.pink];
    return `
      <div class="profile-grid">
        <div class="card dark">
          <span class="label">Potentiel global</span>
          <div class="big-score">${B.potentiel}<small>/10</small></div>
          <p style="margin:0 0 16px;line-height:1.5">Capacité à analyser l'information, à prendre de bonnes décisions et à progresser face aux changements.</p>
          <span class="label">Vitesse de raisonnement</span>
          ${slider("Lente", "Rapide", B.vitesse)}
        </div>
        <div class="card"><span class="label">Raisonnement général · répartition de la population</span><h4>Où je me situe</h4>
          <div class="distrib">${B.distribution.map((p, i) => `
            <div class="col${i + 1 === B.potentiel ? " me" : ""}"><em>${p}%</em><i style="height:${(p / max) * 100}%;background:${colors[i]}"></i><b>${i + 1}</b>${i + 1 === B.potentiel ? `<span class="me-tag">TW</span>` : ""}</div>`).join("")}
          </div>
        </div>
        <div class="card card-wide">
          <span class="label">Mon style cognitif</span>
          <div class="facts light">${B.styles.map(([l, v, t]) => `<div><span class="label">${esc(l)}</span><b>${esc(v)}</b><p>${esc(t)}</p></div>`).join("")}</div>
        </div>
        <div class="card">
          <span class="label">Façon d'agir</span>
          <div class="quad">
            <span class="q-axis q-top">Talent naturel</span><span class="q-axis q-bottom">Efforts</span>
            <span class="q-axis q-left">Contournement</span><span class="q-axis q-right">Persévérance</span>
            <div class="q on">${esc(B.facon.profil)}</div><div class="q">Challenger</div><div class="q">Réaliste</div><div class="q">Hard worker</div>
          </div>
          <p style="margin:14px 0 0;line-height:1.5">${esc(B.facon.texte)}</p>
        </div>
        <div class="card"><span class="label">Prise de décision · points d'appui</span><h4>Comment je décide</h4>
          <div class="levels">${B.appuis.map(([l, v]) => `<div><span>${esc(l)}</span><b class="lvl lvl-${v.toLowerCase()}">${esc(v)}</b></div>`).join("")}</div>
        </div>
      </div>`;
  }

  function renderProfil() {
    const T = C.tests;
    if (!T) return "";
    const tabs = [["swipe", "Personnalité", "SWIPE"], ["drive", "Motivations", "DRIVE"], ["brain", "Raisonnement", "BRAIN"]];
    return `
      <h3>Mon profil, mesuré</h3>
      <p class="source-note" style="margin:-8px 0 16px">D'après mes tests AssessFirst SWIPE, DRIVE et BRAIN du ${esc(T.date)}.</p>
      <div class="tabs" role="tablist">${tabs.map(([id, l, t], i) => `<button role="tab" data-tab="${id}" aria-selected="${i === 0}">${l} <small>${t}</small></button>`).join("")}</div>
      <div class="tab-panel" data-panel="swipe">${renderSwipe(T.swipe)}</div>
      <div class="tab-panel" data-panel="drive" hidden>${renderDrive(T.drive)}</div>
      <div class="tab-panel" data-panel="brain" hidden>${renderBrain(T.brain)}</div>`;
  }
  function bindProfil() {
    $$(".tabs [data-tab]").forEach((b) => b.addEventListener("click", () => {
      $$(".tabs [data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b));
      $$(".tab-panel").forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    }));
  }

  const sections = {
    projets: { kicker: "Le projecteur", title: "Projets <em>à l'écran</em>", render: renderProjets, bind: bindProjets },

    parcours: {
      kicker: "Le PC gaming",
      title: "Profil <em>joueur</em>",
      render: () => `
        <div class="player-card">
          <div class="player-avatar">${esc(initials(C.profil.nom))}</div>
          <div>
            <div class="player-name">${esc(C.profil.nom)}</div>
            <span class="label">Classe : ${esc(C.profil.titre)} · ${C.parcours.length} quêtes terminées</span>
            <div class="xp" aria-hidden="true"><span></span></div>
          </div>
          <div class="player-next label">Prochain niveau<b>${esc(C.profil.prochainNiveau || "Senior")}</b></div>
        </div>
        <h3>Quêtes terminées</h3>
        <div class="dark-block">
          ${shape("ring", COL.pink, "width:140px;left:-30px;top:30px;opacity:.9")}
          ${shape("cross", COL.green, "width:90px;right:40px;top:40px")}
          ${shape("steps", COL.orange, "width:150px;right:-20px;bottom:60px")}
          ${shape("half", COL.yellow, "width:120px;left:60px;bottom:-4px")}
          <ul class="credits">${C.parcours.map((x, i) => `
            <li>
              <span class="c-idx">${pad(i + 1)}</span><span class="c-name">${esc(x.lieu)}</span>
              <span class="c-meta label">${esc(x.poste)} · ${esc(x.periode)}</span>
              ${x.points.length ? `<span class="c-points">${x.points.map((pt) => `<i>${esc(pt)}</i>`).join("")}</span>` : ""}
            </li>`).join("")}
          </ul>
        </div>
        <h3>Arbre de compétences</h3>
        <div class="skills">${C.competences.map((g, i) => {
          const c = CYCLE[(i + 1) % CYCLE.length];
          return `<div class="skill-box" style="--c:${c};color:${onDark(c)}"><h4>${esc(g.groupe)}</h4>${chips(g.items)}</div>`;
        }).join("")}
        </div>
        <h3>Inventaire — outils</h3>
        ${chips(C.outils)}
        <h3>Succès débloqués — formation</h3>
        <ul class="rows">${C.formation.map((f) => `
          <li><div class="r-period">${esc(f.annee)}</div><div class="r-title">${esc(f.titre)}<span>${esc(f.ecole)}</span></div></li>`).join("")}
        </ul>
        ${C.langues ? `<h3>Langues</h3><div class="lang">${C.langues.map((l) => `<div><b>${esc(l.langue)}</b><span>${esc(l.niveau)}</span></div>`).join("")}</div>` : ""}`,
    },

    mixes: { kicker: "La table de mixage", title: "Mixes <em>& sets</em>", render: renderMixes, bind: bindMixes },

    passions: {
      kicker: "L'étagère",
      title: "Ce qui me <em>nourrit</em>",
      render: () => `
        <div class="shelf">${C.passions.map((p, i) => {
          const c = CYCLE[i % CYCLE.length];
          return `<div class="shelf-item" style="--c:${c};--r:${[-2, 1.5, -1, 2, -1.5][i % 5]}deg;color:${onDark(c)}"><span class="idx">${pad(i + 1)}</span><div class="emo" aria-hidden="true">${p.emoji}</div><h4>${esc(p.titre)}</h4><p>${esc(p.texte)}</p>${p.lien ? `<a class="pill shelf-link" href="${esc(p.lien.url)}" target="_blank" rel="noopener">${esc(p.lien.label)} ↗</a>` : ""}</div>`;
        }).join("")}
        </div>`,
    },

    contact: {
      kicker: "Le canapé",
      title: "On <em>discute ?</em>",
      bind: bindProfil,
      render: () => {
        const link = (href, label, sub, c, attrs = "") => `<li><a href="${esc(href)}" ${attrs} style="--c:${c};color:${onDark(c)}">${esc(label)} <span>${sub}</span></a></li>`;
        return `
        ${C.aPropos.map((p) => `<p class="lead">${esc(p)}</p>`).join("")}
        <div class="status label">${esc(C.profil.disponibilite)}</div>
        ${renderProfil()}
        <h3>Me contacter</h3>
        <ul class="contact-links">
          ${link(C.profil.cv, "Télécharger mon CV", "PDF ↓", COL.pink, "download")}
          ${C.profil.dossierCompetences ? link(C.profil.dossierCompetences, "Mon dossier de compétences", "PDF ↓", COL.green, "download") : ""}
          ${C.profil.email ? link("mailto:" + C.profil.email, C.profil.email, "Email ↗", COL.yellow) : ""}
          ${C.profil.linkedin ? link(C.profil.linkedin, "LinkedIn", "Profil ↗", COL.blue, 'target="_blank" rel="noopener"') : ""}
          ${C.profil.telephone ? link("tel:" + C.profil.telephone.replace(/\s/g, ""), C.profil.telephone, "Téléphone", COL.green) : ""}
        </ul>
        ${C.traits ? `<h3>Ce qui me définit</h3><div class="traits">${C.traits.map((t, i) => {
          const c = CYCLE[i % CYCLE.length];
          return `<span style="--c:${c};--r:${[-3, 2, -1, 3, -2, 1][i % 6]}deg;color:${onDark(c)}">${esc(t)}</span>`;
        }).join("")}</div>` : ""}`;
      },
    },
  };

  /* ---------- Ouverture / fermeture de l'aperçu ---------- */
  const panel = $("#panel");
  let lastFocus = null, openId = null;

  function open(id) {
    const s = sections[id];
    if (!s) return close();
    if (!openId) lastFocus = document.activeElement;
    openId = id;
    const n = order.indexOf(id) + 1;
    const meta = SECTION[id];
    panel.style.setProperty("--acc", meta.color);
    $("#panel-kicker").textContent = `${pad(n)} — ${s.kicker}`;
    $("#panel-index").textContent = pad(n);
    $("#panel-badge").textContent = meta.badge;
    $("#panel-title").innerHTML = s.title;
    $("#panel-body").innerHTML = s.render();
    if (s.bind) s.bind();
    panel.hidden = false;
    $(".panel-inner").scrollTop = 0;
    $$("#quicknav button").forEach((b) => b.classList.toggle("active", b.dataset.id === id));
    $("#back").focus();
  }
  function close() {
    panel.hidden = true;
    openId = null;
    cancelAnimationFrame(raf);
    $$("#quicknav button").forEach((b) => b.classList.remove("active"));
    if (lastFocus) lastFocus.focus();
  }
  function go(id) { location.hash = id; }

  window.addEventListener("hashchange", () => { const id = location.hash.slice(1); id ? open(id) : close(); });
  $("#back").addEventListener("click", () => { history.replaceState(null, "", location.pathname + location.search); close(); });
  panel.addEventListener("click", (e) => { if (e.target === panel) $("#back").click(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) { if (e.key === "Escape") lightbox.hidden = true; return; }
    if (panel.hidden) return;
    if (e.key === "Escape") $("#back").click();
    if (openId === "projets" && !/input|textarea/i.test(e.target.tagName)) {
      if (e.key === "ArrowLeft") setVhs(vhsIndex - 1);
      if (e.key === "ArrowRight") setVhs(vhsIndex + 1);
    }
    if (openId === "mixes" && e.key === " " && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") { e.preventDefault(); toggle(); }
  });

  if (location.hash.slice(1)) open(location.hash.slice(1));
})();
