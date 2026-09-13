(() => {
  'use strict';

  const STORAGE_KEY = 'morrow.focus.v1';
  const BUILD = '1.7.0';

  const i18n = {
    en: {
      nav: { today: 'Today', time: 'Time', menu: 'Menu', me: 'Me' },
      common: { reset: 'Reset', export: 'Export', import: 'Import', sparks: 'Sparks', done: 'Done', undo: 'Undo', startTiny: 'Start tiny', pause: 'Pause', resume: 'Resume', startVisibleTime: 'Start', delete: 'Delete' },
      today: { placeholder: 'Add a task…', empty: 'Nothing here yet.' },
      menu: { taskDice: 'Dice', dopamineTitle: 'Dopamine menu', roll: 'Roll', startIt: 'Start it', initialTitle: 'Pick one thing.', noneTitle: 'No open tasks.', scanning: 'Choosing…' },
      dopamine: [
        ['One song', 'Play one song. Stop when it ends.'],
        ['Cold cue', 'Cold water on wrists or face for 20 seconds.'],
        ['Move', 'Stand up, stretch, walk out and back.'],
        ['Novelty', 'Change chair, room, playlist or lighting.'],
        ['Body double', 'Text someone: “I’m starting for 10 min.”']
      ],
      me: { preferences: 'Preferences', sessions: 'Sessions', focusTime: 'Focus time', language: 'Language', accent: 'Accent', dataHere: 'Export data', restore: 'Restore data', resetData: 'Reset data' },
      energy: { low: 'Low', medium: 'Medium', high: 'High' },
      resistance: { low: 'Easy', medium: 'Friction', high: 'Big wall' },
      emergency: { brand: 'FOCUS / Emergency', defaultTitle: 'Only the next 60 seconds.', enough: 'That was enough', another: 'Another task', fallback: 'this task', micro1: 'Open or place “{title}” in front of you.', micro2: 'Do the first visible action for exactly 60 seconds.', micro3: 'Then choose: continue for 2 minutes or stop without guilt.' },
      toast: { captured: 'Captured.', hardWall: 'Big wall crossed.', done: 'Done.', emergencySpark: '+1 Spark', rollFirst: 'Roll a task first.', timerComplete: 'Time complete.', exported: 'Backup exported.', restored: 'Backup restored.', invalidBackup: 'Invalid backup.', reset: 'Local data reset.' },
      confirm: { reset: 'Delete all FOCUS data from this browser?' },
      aria: { openEmergency: 'Open emergency mode', emergencyMode: 'Emergency mode', newTask: 'New task', addTask: 'Add task', visualTimer: 'Visual timer', menuMode: 'Choose menu mode', languageChoice: 'Choose language', chooseTheme: 'Choose accent theme', mintTheme: 'Mint theme', violetTheme: 'Violet theme', emberTheme: 'Ember theme', mainNavigation: 'Main navigation', closeEmergency: 'Close emergency mode', deleteTask: 'Delete task' }
    },
    de: {
      nav: { today: 'Heute', time: 'Zeit', menu: 'Menü', me: 'Ich' },
      common: { reset: 'Reset', export: 'Export', import: 'Import', sparks: 'Sparks', done: 'Erledigt', undo: 'Zurück', startTiny: 'Klein starten', pause: 'Pause', resume: 'Weiter', startVisibleTime: 'Starten', delete: 'Löschen' },
      today: { placeholder: 'Aufgabe hinzufügen…', empty: 'Noch keine Aufgabe.' },
      menu: { taskDice: 'Würfel', dopamineTitle: 'Dopamin-Menü', roll: 'Würfeln', startIt: 'Starten', initialTitle: 'Wähle eine Sache.', noneTitle: 'Keine offenen Aufgaben.', scanning: 'Wähle…' },
      dopamine: [
        ['Ein Song', 'Spiele genau einen Song.'],
        ['Kältereiz', '20 Sekunden kaltes Wasser an Handgelenke oder Gesicht.'],
        ['Bewegung', 'Aufstehen, strecken, kurz raus und zurück.'],
        ['Neuheit', 'Wechsle Stuhl, Raum, Playlist oder Licht.'],
        ['Body Double', 'Schreib jemandem: „Ich starte für 10 Min.“']
      ],
      me: { preferences: 'Einstellungen', sessions: 'Sessions', focusTime: 'Fokuszeit', language: 'Sprache', accent: 'Akzent', dataHere: 'Daten exportieren', restore: 'Daten importieren', resetData: 'Daten löschen' },
      energy: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' },
      resistance: { low: 'Leicht', medium: 'Reibung', high: 'Große Hürde' },
      emergency: { brand: 'FOCUS / Notfall', defaultTitle: 'Nur die nächsten 60 Sekunden.', enough: 'Das war genug', another: 'Andere Aufgabe', fallback: 'diese Aufgabe', micro1: 'Öffne oder lege „{title}“ vor dich hin.', micro2: 'Mach die erste sichtbare Teilhandlung genau 60 Sekunden.', micro3: 'Dann entscheide: 2 Minuten weiter oder ohne Schuld stoppen.' },
      toast: { captured: 'Erfasst.', hardWall: 'Große Hürde geschafft.', done: 'Erledigt.', emergencySpark: '+1 Spark', rollFirst: 'Würfle zuerst eine Aufgabe.', timerComplete: 'Zeit abgeschlossen.', exported: 'Backup exportiert.', restored: 'Backup wiederhergestellt.', invalidBackup: 'Ungültiges Backup.', reset: 'Lokale Daten gelöscht.' },
      confirm: { reset: 'Alle FOCUS-Daten aus diesem Browser löschen?' },
      aria: { openEmergency: 'Notfallmodus öffnen', emergencyMode: 'Notfallmodus', newTask: 'Neue Aufgabe', addTask: 'Aufgabe hinzufügen', visualTimer: 'Visueller Timer', menuMode: 'Menüansicht auswählen', languageChoice: 'Sprache auswählen', chooseTheme: 'Akzent auswählen', mintTheme: 'Mint', violetTheme: 'Violett', emberTheme: 'Ember', mainNavigation: 'Hauptnavigation', closeEmergency: 'Notfallmodus schließen', deleteTask: 'Aufgabe löschen' }
    }
  };

  const DEFAULT_STATE = {
    tasks: [],
    sparks: 0,
    sessions: [],
    settings: { theme: 'midnight', language: null },
    timer: { minutes: 15 },
    lastRolledTaskId: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const detectLanguage = () => String(navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';

  let state = loadState();
  let timerInterval = null;
  let timerStartedAt = 0;
  let timerDurationMs = state.timer.minutes * 60000;
  let timerRemainingMs = timerDurationMs;
  let timerRunning = false;
  let currentEmergencyTaskId = null;
  let emergencySparkAwarded = false;
  let audioContext = null;

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const merged = {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        timer: { ...DEFAULT_STATE.timer, ...(parsed.timer || {}) },
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : []
      };
      if (!['en', 'de'].includes(merged.settings.language)) merged.settings.language = detectLanguage();
      return merged;
    } catch {
      const fresh = structuredClone(DEFAULT_STATE);
      fresh.settings.language = detectLanguage();
      return fresh;
    }
  }

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
  function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function t(path, vars = {}) {
    const source = i18n[state.settings.language] || i18n.en;
    let value = path.split('.').reduce((obj, key) => obj?.[key], source);
    if (typeof value !== 'string') value = path;
    return value.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
  }

  function translateStatic() {
    document.documentElement.lang = state.settings.language;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    $$('.language-option').forEach(btn => btn.classList.toggle('active', btn.dataset.language === state.settings.language));
  }

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 1600);
  }

  function reward() {
    try {
      if (navigator.vibrate) navigator.vibrate(35);
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext ||= new AudioCtx();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain).connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.82);
    } catch {}
  }

  function navigate(screen) {
    $$('.screen').forEach(el => el.classList.toggle('active', el.dataset.screen === screen));
    $$('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.nav === screen));
  }

  function createTask(title) {
    const clean = title.trim();
    if (!clean) return;
    state.tasks.unshift({
      id: uid(),
      title: clean,
      minutes: 15,
      energy: 'medium',
      resistance: 2,
      done: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    });
    saveState();
    renderAll();
    toast(t('toast.captured'));
  }

  function toggleTask(id) {
    const task = state.tasks.find(item => item.id === id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : null;
    if (task.done) {
      state.sparks += task.resistance === 3 ? 3 : task.resistance === 2 ? 2 : 1;
      reward();
      toast(task.resistance === 3 ? t('toast.hardWall') : t('toast.done'));
    }
    saveState();
    renderAll();
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter(item => item.id !== id);
    if (state.lastRolledTaskId === id) state.lastRolledTaskId = null;
    saveState();
    renderAll();
  }

  function renderTasks() {
    const grid = $('#taskGrid');
    const tasks = [...state.tasks.filter(x => !x.done), ...state.tasks.filter(x => x.done)];
    if (!tasks.length) {
      grid.innerHTML = `<div class="empty-state">${t('today.empty')}</div>`;
      return;
    }
    grid.innerHTML = tasks.map(task => `
      <article class="task-card ${task.done ? 'done' : ''}" data-task-id="${task.id}">
        <div class="task-main">
          <div class="task-title">${esc(task.title)}</div>
          <div class="task-meta"><span>${task.minutes}m</span><span>${t(`energy.${task.energy}`)}</span></div>
        </div>
        <div class="task-actions">
          ${task.done ? '' : `<button class="mini-btn" data-action="start">▶</button>`}
          <button class="mini-btn done-btn" data-action="toggle">${task.done ? '↶' : '✓'}</button>
          <button class="mini-btn" data-action="delete" aria-label="${t('aria.deleteTask')}">×</button>
        </div>
      </article>
    `).join('');
  }

  function renderStats() {
    const total = state.sessions.reduce((sum, session) => sum + (session.minutes || 0), 0);
    $('#sparkCount').textContent = state.sparks;
    $('#meSparkCount').textContent = state.sparks;
    $('#sessionCount').textContent = state.sessions.length;
    $('#focusMinutes').textContent = `${total} min`;
    document.documentElement.dataset.theme = state.settings.theme;
    $$('.theme-dot').forEach(btn => btn.classList.toggle('active', btn.dataset.themeValue === state.settings.theme));
  }

  function renderDopamine() {
    const items = i18n[state.settings.language].dopamine;
    $('#dopamineItems').innerHTML = items.map(([title, note], index) => `
      <button class="dopamine-item" type="button" data-dopamine-index="${index}">
        <strong>${esc(title)}</strong><small>${esc(note)}</small>
      </button>
    `).join('');
  }

  function renderDice() {
    const task = state.tasks.find(item => item.id === state.lastRolledTaskId && !item.done);
    $('#diceResult').textContent = task ? task.title : t('menu.initialTitle');
    $('#startRolledBtn').disabled = !task;
  }

  function renderAll() {
    translateStatic();
    renderTasks();
    renderStats();
    renderDopamine();
    renderDice();
    updateTimerUI();
  }

  function pickTask() {
    const open = state.tasks.filter(task => !task.done);
    if (!open.length) return null;
    return [...open].sort((a, b) => (a.minutes + a.resistance * 6 + Math.random() * 8) - (b.minutes + b.resistance * 6 + Math.random() * 8))[0];
  }

  function rollTask() {
    const task = pickTask();
    if (!task) {
      $('#diceResult').textContent = t('menu.noneTitle');
      $('#startRolledBtn').disabled = true;
      return;
    }
    $('#diceResult').textContent = t('menu.scanning');
    $('#startRolledBtn').disabled = true;
    setTimeout(() => {
      state.lastRolledTaskId = task.id;
      saveState();
      renderDice();
    }, 450);
  }

  function startRolledTask() {
    const task = state.tasks.find(item => item.id === state.lastRolledTaskId && !item.done);
    if (!task) return toast(t('toast.rollFirst'));
    setTimerMinutes(task.minutes);
    navigate('time');
    startTimer();
  }

  function setTimerMinutes(minutes) {
    if (timerRunning) pauseTimer();
    state.timer.minutes = Number(minutes);
    timerDurationMs = state.timer.minutes * 60000;
    timerRemainingMs = timerDurationMs;
    saveState();
    $$('.duration-row [data-timer-minutes]').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.timerMinutes) === state.timer.minutes));
    updateTimerUI();
  }

  function formatMs(ms) {
    const seconds = Math.max(0, Math.ceil(ms / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function updateTimerUI() {
    const ratio = timerDurationMs ? Math.min(1, Math.max(0, (timerDurationMs - timerRemainingMs) / timerDurationMs)) : 0;
    $('#timerDigits').textContent = formatMs(timerRemainingMs);
    $('#timeOrbit').style.setProperty('--p', `${ratio * 360}deg`);
    $('#timerToggleBtn').textContent = timerRunning ? t('common.pause') : (timerRemainingMs < timerDurationMs ? t('common.resume') : t('common.startVisibleTime'));
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerStartedAt = Date.now() - (timerDurationMs - timerRemainingMs);
    timerInterval = setInterval(() => {
      timerRemainingMs = Math.max(0, timerDurationMs - (Date.now() - timerStartedAt));
      updateTimerUI();
      if (timerRemainingMs <= 0) finishTimer();
    }, 250);
    updateTimerUI();
  }

  function pauseTimer() {
    if (!timerRunning) return;
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerUI();
  }

  function resetTimer() {
    pauseTimer();
    timerRemainingMs = timerDurationMs;
    updateTimerUI();
  }

  function finishTimer() {
    pauseTimer();
    state.sessions.unshift({ id: uid(), minutes: state.timer.minutes, finishedAt: new Date().toISOString() });
    state.sparks += 1;
    saveState();
    reward();
    renderAll();
    toast(t('toast.timerComplete'));
  }

  function microSteps(task) {
    const title = task?.title || t('emergency.fallback');
    return [
      t('emergency.micro1', { title }),
      t('emergency.micro2', { title }),
      t('emergency.micro3', { title })
    ];
  }

  function openEmergency(id = null) {
    const task = state.tasks.find(item => item.id === id && !item.done)
      || state.tasks.find(item => item.id === state.lastRolledTaskId && !item.done)
      || pickTask();
    currentEmergencyTaskId = task?.id || null;
    emergencySparkAwarded = false;
    $('#emergencyTitle').textContent = task ? task.title : t('emergency.defaultTitle');
    $('#microSteps').innerHTML = microSteps(task).map((step, index) => `
      <button class="micro-step" type="button" data-step="${index}">
        <span class="step-num">${index + 1}</span><strong>${esc(step)}</strong>
      </button>
    `).join('');
    $('#emergencyBackdrop').classList.add('open');
  }

  function closeEmergency() { $('#emergencyBackdrop').classList.remove('open'); }

  function checkEmergencyComplete() {
    const steps = $$('.micro-step');
    if (!steps.length || emergencySparkAwarded || !steps.every(step => step.classList.contains('done'))) return;
    emergencySparkAwarded = true;
    state.sparks += 1;
    saveState();
    reward();
    renderStats();
    toast(t('toast.emergencySpark'));
  }

  function swapEmergency() {
    const candidates = state.tasks.filter(task => !task.done && task.id !== currentEmergencyTaskId);
    const task = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : pickTask();
    openEmergency(task?.id || null);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ product: 'FOCUS / by Morrow', version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast(t('toast.exported'));
  }

  async function importData(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = parsed.data || parsed;
      if (!incoming || !Array.isArray(incoming.tasks) || !Array.isArray(incoming.sessions)) throw new Error('invalid');
      state = {
        ...structuredClone(DEFAULT_STATE),
        ...incoming,
        settings: { ...DEFAULT_STATE.settings, ...(incoming.settings || {}) },
        timer: { ...DEFAULT_STATE.timer, ...(incoming.timer || {}) }
      };
      if (!['en', 'de'].includes(state.settings.language)) state.settings.language = detectLanguage();
      timerDurationMs = state.timer.minutes * 60000;
      timerRemainingMs = timerDurationMs;
      saveState();
      renderAll();
      toast(t('toast.restored'));
    } catch {
      toast(t('toast.invalidBackup'));
    }
  }

  function resetData() {
    if (!window.confirm(t('confirm.reset'))) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(DEFAULT_STATE);
    state.settings.language = detectLanguage();
    timerDurationMs = 15 * 60000;
    timerRemainingMs = timerDurationMs;
    saveState();
    renderAll();
    toast(t('toast.reset'));
  }

  function setMenuView(view) {
    $$('.segment-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.menuView === view));
    $('#menuPaneDice').classList.toggle('active', view === 'dice');
    $('#menuPaneDopamine').classList.toggle('active', view === 'dopamine');
  }

  function bindEvents() {
    $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));

    $('#quickCaptureForm').addEventListener('submit', event => {
      event.preventDefault();
      const input = $('#quickTaskInput');
      createTask(input.value);
      input.value = '';
    });

    $('#taskGrid').addEventListener('click', event => {
      const action = event.target.closest('[data-action]');
      const card = event.target.closest('[data-task-id]');
      if (!action || !card) return;
      const id = card.dataset.taskId;
      if (action.dataset.action === 'toggle') toggleTask(id);
      if (action.dataset.action === 'delete') deleteTask(id);
      if (action.dataset.action === 'start') openEmergency(id);
    });

    $$('.duration-row [data-timer-minutes]').forEach(btn => btn.addEventListener('click', () => setTimerMinutes(btn.dataset.timerMinutes)));
    $('#timerToggleBtn').addEventListener('click', () => timerRunning ? pauseTimer() : startTimer());
    $('#timerResetBtn').addEventListener('click', resetTimer);

    $$('.segment-btn').forEach(btn => btn.addEventListener('click', () => setMenuView(btn.dataset.menuView)));
    $('#rollBtn').addEventListener('click', rollTask);
    $('#startRolledBtn').addEventListener('click', startRolledTask);
    $('#dopamineItems').addEventListener('click', event => {
      const btn = event.target.closest('[data-dopamine-index]');
      if (!btn) return;
      const item = i18n[state.settings.language].dopamine[Number(btn.dataset.dopamineIndex)];
      if (item) toast(`${item[0]}: ${item[1]}`);
    });

    $('#emergencyBtn').addEventListener('click', () => openEmergency());
    $('#closeEmergencyBtn').addEventListener('click', closeEmergency);
    $('#emergencySwapBtn').addEventListener('click', swapEmergency);
    $('#emergencyDoneBtn').addEventListener('click', closeEmergency);
    $('#microSteps').addEventListener('click', event => {
      const step = event.target.closest('.micro-step');
      if (!step) return;
      step.classList.toggle('done');
      checkEmergencyComplete();
    });

    $$('.language-option').forEach(btn => btn.addEventListener('click', () => {
      state.settings.language = btn.dataset.language;
      saveState();
      renderAll();
      if ($('#emergencyBackdrop').classList.contains('open')) openEmergency(currentEmergencyTaskId);
    }));

    $$('.theme-dot').forEach(btn => btn.addEventListener('click', () => {
      state.settings.theme = btn.dataset.themeValue;
      saveState();
      renderStats();
    }));

    $('#exportBtn').addEventListener('click', exportData);
    $('#importBtn').addEventListener('click', () => $('#importFile').click());
    $('#importFile').addEventListener('change', event => {
      const [file] = event.target.files;
      if (file) importData(file);
      event.target.value = '';
    });
    $('#resetDataBtn').addEventListener('click', resetData);

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeEmergency();
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register(`./sw.js?v=${BUILD}`, { updateViaCache: 'none' });
        const update = async () => {
          try {
            await registration.update();
            if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          } catch {}
        };
        await update();
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') update(); });
        window.addEventListener('focus', update);
      } catch {}
    });
  }

  bindEvents();
  setTimerMinutes(state.timer.minutes);
  renderAll();
  saveState();
  registerServiceWorker();
})();
