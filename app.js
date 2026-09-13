(() => {
  'use strict';

  const STORAGE_KEY = 'morrow.focus.v1';
  const BUILD = '1.6.0';

  const i18n = {
    en: {
      'nav.today': 'Today', 'nav.time': 'Time', 'nav.menu': 'Menu', 'nav.me': 'Me',
      'common.add': 'Add', 'common.reset': 'Reset', 'common.export': 'Export', 'common.import': 'Import',
      'common.cancel': 'Cancel', 'common.saveTask': 'Save task', 'common.done': 'Done', 'common.undo': 'Undo',
      'common.startTiny': 'Start tiny', 'common.pause': 'Pause', 'common.resume': 'Resume', 'common.startVisibleTime': 'Start', 'common.sparks': 'Sparks',
      'today.placeholder': 'What needs doing?', 'today.openLoops': 'Open loops', 'today.clearDone': 'Clear done', 'today.empty': 'Nothing open.',
      'menu.taskDice': 'Task dice', 'menu.dopamineTitle': 'Dopamine menu', 'menu.roll': 'Roll', 'menu.startIt': 'Start it',
      'menu.initialTitle': 'Pick one thing.', 'menu.noneTitle': 'Nothing to roll.', 'menu.scanning': 'Choosing…',
      'me.preferences': 'Preferences', 'me.sessions': 'Sessions', 'me.focusTime': 'Focus time', 'me.language': 'Language', 'me.accent': 'Accent',
      'me.dataHere': 'Export data', 'me.restore': 'Restore data', 'me.resetData': 'Reset data',
      'modal.title': 'Add task', 'modal.taskLabel': 'Task', 'modal.durationLabel': 'Duration', 'modal.energyLabel': 'Energy', 'modal.wallLabel': 'Friction',
      'energy.low': 'Low', 'energy.medium': 'Medium', 'energy.high': 'High',
      'resistance.low': 'Easy', 'resistance.medium': 'Some friction', 'resistance.high': 'Big wall',
      'emergency.brand': 'FOCUS / Emergency', 'emergency.enough': 'Enough for now', 'emergency.another': 'Another task',
      'emergency.defaultTitle': 'Only the next 60 seconds.', 'emergency.micro1': 'Open or place “{title}” in front of you.',
      'emergency.micro2': 'Do the first visible action for exactly 60 seconds.', 'emergency.micro3': 'Then choose: continue for 2 minutes or stop without guilt.',
      'emergency.fallbackTask': 'this task',
      'aria.openEmergency': 'Open emergency mode', 'aria.emergencyMode': 'Emergency mode', 'aria.newTask': 'New task',
      'aria.quickDefaults': 'Quick duration', 'aria.visualTimer': 'Visual timer', 'aria.languageChoice': 'Choose language',
      'aria.chooseTheme': 'Choose accent theme', 'aria.mintTheme': 'Mint theme', 'aria.violetTheme': 'Violet theme', 'aria.emberTheme': 'Ember theme',
      'aria.mainNavigation': 'Main navigation', 'aria.close': 'Close', 'aria.closeEmergency': 'Close emergency mode', 'aria.deleteTask': 'Delete task',
      'dopamine.songTitle': 'One song', 'dopamine.songNote': 'Play one song, then begin.',
      'dopamine.coldTitle': 'Cold cue', 'dopamine.coldNote': 'Cold water on wrists for 20 seconds.',
      'dopamine.moveTitle': 'Move', 'dopamine.moveNote': 'Stand, stretch, walk there and back.',
      'dopamine.noveltyTitle': 'Switch it', 'dopamine.noveltyNote': 'Change seat, room, light or playlist.',
      'dopamine.treatTitle': 'Bring a treat', 'dopamine.treatNote': 'Tea, coffee or a snack beside the task.',
      'toast.captured': 'Captured.', 'toast.done': 'Done. Momentum kept.', 'toast.hardWall': 'Big wall crossed.',
      'toast.nothingClear': 'Nothing to clear.', 'toast.cleared': '{count} cleared.', 'toast.emergencySpark': '+1 Spark.',
      'toast.timerComplete': 'Time complete.', 'toast.exported': 'Backup exported.', 'toast.restored': 'Backup restored.',
      'toast.invalidBackup': 'Invalid backup.', 'toast.reset': 'Local data reset.', 'confirm.reset': 'Delete all local FOCUS data?'
    },
    de: {
      'nav.today': 'Heute', 'nav.time': 'Zeit', 'nav.menu': 'Menü', 'nav.me': 'Ich',
      'common.add': 'Hinzufügen', 'common.reset': 'Zurücksetzen', 'common.export': 'Export', 'common.import': 'Import',
      'common.cancel': 'Abbrechen', 'common.saveTask': 'Speichern', 'common.done': 'Erledigt', 'common.undo': 'Rückgängig',
      'common.startTiny': 'Klein starten', 'common.pause': 'Pause', 'common.resume': 'Weiter', 'common.startVisibleTime': 'Starten', 'common.sparks': 'Sparks',
      'today.placeholder': 'Was steht an?', 'today.openLoops': 'Offene Schleifen', 'today.clearDone': 'Erledigtes löschen', 'today.empty': 'Nichts offen.',
      'menu.taskDice': 'Würfel', 'menu.dopamineTitle': 'Dopamin-Menü', 'menu.roll': 'Würfeln', 'menu.startIt': 'Starten',
      'menu.initialTitle': 'Wähle eine Sache.', 'menu.noneTitle': 'Nichts zum Würfeln.', 'menu.scanning': 'Wähle…',
      'me.preferences': 'Einstellungen', 'me.sessions': 'Sessions', 'me.focusTime': 'Fokuszeit', 'me.language': 'Sprache', 'me.accent': 'Akzent',
      'me.dataHere': 'Daten exportieren', 'me.restore': 'Daten importieren', 'me.resetData': 'Daten löschen',
      'modal.title': 'Aufgabe hinzufügen', 'modal.taskLabel': 'Aufgabe', 'modal.durationLabel': 'Dauer', 'modal.energyLabel': 'Energie', 'modal.wallLabel': 'Hürde',
      'energy.low': 'Niedrig', 'energy.medium': 'Mittel', 'energy.high': 'Hoch',
      'resistance.low': 'Leicht', 'resistance.medium': 'Etwas Reibung', 'resistance.high': 'Große Hürde',
      'emergency.brand': 'FOCUS / Notfall', 'emergency.enough': 'Genug für jetzt', 'emergency.another': 'Andere Aufgabe',
      'emergency.defaultTitle': 'Nur die nächsten 60 Sekunden.', 'emergency.micro1': 'Öffne oder lege „{title}“ vor dich hin.',
      'emergency.micro2': 'Mach die erste sichtbare Teilhandlung für genau 60 Sekunden.', 'emergency.micro3': 'Dann entscheide: 2 Minuten weitermachen oder ohne Schuldgefühl stoppen.',
      'emergency.fallbackTask': 'diese Aufgabe',
      'aria.openEmergency': 'Notfallmodus öffnen', 'aria.emergencyMode': 'Notfallmodus', 'aria.newTask': 'Neue Aufgabe',
      'aria.quickDefaults': 'Schnelle Dauer', 'aria.visualTimer': 'Visueller Timer', 'aria.languageChoice': 'Sprache auswählen',
      'aria.chooseTheme': 'Akzent auswählen', 'aria.mintTheme': 'Mint', 'aria.violetTheme': 'Violett', 'aria.emberTheme': 'Ember',
      'aria.mainNavigation': 'Hauptnavigation', 'aria.close': 'Schließen', 'aria.closeEmergency': 'Notfallmodus schließen', 'aria.deleteTask': 'Aufgabe löschen',
      'dopamine.songTitle': 'Ein Song', 'dopamine.songNote': 'Einen Song hören, dann beginnen.',
      'dopamine.coldTitle': 'Kältereiz', 'dopamine.coldNote': '20 Sekunden kaltes Wasser auf die Handgelenke.',
      'dopamine.moveTitle': 'Bewegen', 'dopamine.moveNote': 'Aufstehen, strecken, kurz hin und zurück.',
      'dopamine.noveltyTitle': 'Wechsel', 'dopamine.noveltyNote': 'Stuhl, Raum, Licht oder Playlist ändern.',
      'dopamine.treatTitle': 'Genuss dazu', 'dopamine.treatNote': 'Tee, Kaffee oder Snack neben die Aufgabe.',
      'toast.captured': 'Erfasst.', 'toast.done': 'Erledigt. Momentum bleibt.', 'toast.hardWall': 'Große Hürde geschafft.',
      'toast.nothingClear': 'Nichts zu löschen.', 'toast.cleared': '{count} gelöscht.', 'toast.emergencySpark': '+1 Spark.',
      'toast.timerComplete': 'Zeit abgeschlossen.', 'toast.exported': 'Backup exportiert.', 'toast.restored': 'Backup wiederhergestellt.',
      'toast.invalidBackup': 'Ungültiges Backup.', 'toast.reset': 'Lokale Daten gelöscht.', 'confirm.reset': 'Alle lokalen FOCUS-Daten löschen?'
    }
  };

  const DOPAMINE_KEYS = [
    ['dopamine.songTitle', 'dopamine.songNote'],
    ['dopamine.coldTitle', 'dopamine.coldNote'],
    ['dopamine.moveTitle', 'dopamine.moveNote'],
    ['dopamine.noveltyTitle', 'dopamine.noveltyNote'],
    ['dopamine.treatTitle', 'dopamine.treatNote']
  ];

  const DEFAULT_STATE = {
    tasks: [], sparks: 0, sessions: [],
    settings: { theme: 'midnight', language: null },
    timer: { minutes: 15 }, lastRolledTaskId: null
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const detectLanguage = () => String(navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let state = loadState();
  let quickMinutes = 5;
  let timerInterval = null, timerStartedAt = 0, timerRunning = false;
  let timerDurationMs = state.timer.minutes * 60000, timerRemainingMs = timerDurationMs;
  let currentEmergencyTaskId = null, emergencySparkAwarded = false, audioContext = null;
  let rouletteMode = 'initial';

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const next = { ...structuredClone(DEFAULT_STATE), ...parsed };
      next.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
      next.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
      next.settings = { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) };
      next.timer = { ...DEFAULT_STATE.timer, ...(parsed.timer || {}) };
      if (!['en', 'de'].includes(next.settings.language)) next.settings.language = detectLanguage();
      return next;
    } catch {
      const next = structuredClone(DEFAULT_STATE); next.settings.language = detectLanguage(); return next;
    }
  }

  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const t = (key, vars = {}) => {
    let text = i18n[state.settings.language]?.[key] ?? i18n.en[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => { text = text.replaceAll(`{${k}}`, String(v)); });
    return text;
  };

  function applyTranslations() {
    document.documentElement.lang = state.settings.language;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    $$('.language-option').forEach(btn => btn.classList.toggle('active', btn.dataset.language === state.settings.language));
  }

  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 1700);
  }

  function rewardFeedback() {
    try {
      navigator.vibrate?.(35);
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext ||= new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime, osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(528, now);
      gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.075, now + 0.06); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain).connect(audioContext.destination); osc.start(now); osc.stop(now + 0.82);
    } catch {}
  }

  function navigate(screen) {
    $$('.screen').forEach(el => el.classList.toggle('active', el.dataset.screen === screen));
    $$('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.nav === screen));
  }

  function energyLabel(value) { return t(`energy.${value}`); }
  function resistanceLabel(value) { return t(`resistance.${({ 1: 'low', 2: 'medium', 3: 'high' })[value] || 'medium'}`); }

  function renderTasks() {
    const root = $('#taskGrid');
    const items = [...state.tasks.filter(x => !x.done), ...state.tasks.filter(x => x.done)];
    if (!items.length) { root.innerHTML = `<div class="empty-state">${esc(t('today.empty'))}</div>`; return; }
    root.innerHTML = items.map(task => `
      <article class="task-card ${task.done ? 'done' : ''}" data-task-id="${task.id}">
        <div class="task-topline">
          <div class="task-meta"><span class="pill">${task.minutes}m</span><span class="pill">${esc(energyLabel(task.energy))}</span><span class="pill">${esc(resistanceLabel(task.resistance))}</span></div>
          <button class="icon-btn" type="button" data-action="delete" aria-label="${esc(t('aria.deleteTask'))}">×</button>
        </div>
        <div class="task-title">${esc(task.title)}</div>
        <div class="task-actions">
          <button class="secondary-btn" type="button" data-action="toggle">${task.done ? t('common.undo') : t('common.done')}</button>
          ${task.done ? '' : `<button class="ghost-btn" type="button" data-action="start">${t('common.startTiny')}</button>`}
        </div>
      </article>`).join('');
  }

  function renderStats() {
    const totalMinutes = state.sessions.reduce((sum, x) => sum + Number(x.minutes || 0), 0);
    $('#sparkCount').textContent = state.sparks; $('#meSparkCount').textContent = state.sparks;
    $('#sessionCount').textContent = state.sessions.length; $('#focusMinutes').textContent = `${totalMinutes} min`;
    document.documentElement.dataset.theme = state.settings.theme;
    $$('.theme-dot').forEach(btn => btn.classList.toggle('active', btn.dataset.themeValue === state.settings.theme));
  }

  function renderDopamineMenu() {
    $('#dopamineItems').innerHTML = DOPAMINE_KEYS.map(([title, note], index) =>
      `<button class="dopamine-item" type="button" data-dopamine-index="${index}">${esc(t(title))}<small>${esc(t(note))}</small></button>`
    ).join('');
  }

  function renderRouletteState() {
    const task = state.tasks.find(x => x.id === state.lastRolledTaskId && !x.done);
    const result = $('#diceResult'), startBtn = $('#startRolledBtn');
    if (rouletteMode === 'result' && task) { result.textContent = task.title; startBtn.disabled = false; }
    else { rouletteMode = 'initial'; result.textContent = t('menu.initialTitle'); startBtn.disabled = true; }
  }

  function renderAll() { applyTranslations(); renderTasks(); renderStats(); renderDopamineMenu(); renderRouletteState(); updateTimerUI(); }

  function createTask(title, minutes = quickMinutes, energy = 'low', resistance = 2) {
    title = String(title || '').trim(); if (!title) return;
    state.tasks.unshift({ id: uid(), title, minutes: Number(minutes), energy, resistance: Number(resistance), done: false, createdAt: new Date().toISOString() });
    saveState(); renderAll(); toast(t('toast.captured'));
  }

  function toggleTask(id) {
    const task = state.tasks.find(x => x.id === id); if (!task) return;
    task.done = !task.done;
    if (task.done) { state.sparks += task.resistance === 3 ? 3 : task.resistance === 2 ? 2 : 1; rewardFeedback(); toast(t(task.resistance === 3 ? 'toast.hardWall' : 'toast.done')); }
    saveState(); renderAll();
  }

  function deleteTask(id) { state.tasks = state.tasks.filter(x => x.id !== id); if (state.lastRolledTaskId === id) state.lastRolledTaskId = null; saveState(); renderAll(); }
  function clearDone() { const count = state.tasks.filter(x => x.done).length; if (!count) return toast(t('toast.nothingClear')); state.tasks = state.tasks.filter(x => !x.done); saveState(); renderAll(); toast(t('toast.cleared', { count })); }

  function pickTask() {
    const open = state.tasks.filter(x => !x.done); if (!open.length) return null;
    const score = x => (x.energy === 'low' ? 3 : x.energy === 'medium' ? 2 : 1) + (x.minutes <= 5 ? 4 : x.minutes <= 15 ? 3 : x.minutes <= 30 ? 2 : 1) - (x.resistance === 3 ? 2 : x.resistance === 2 ? 1 : 0) + Math.random() * 2;
    return open.map(task => ({ task, score: score(task) })).sort((a, b) => b.score - a.score)[0].task;
  }

  function rollTask() {
    const result = $('#diceResult'), startBtn = $('#startRolledBtn'), stage = $('#rouletteStage');
    const task = pickTask();
    if (!task) { rouletteMode = 'none'; result.textContent = t('menu.noneTitle'); startBtn.disabled = true; return; }
    rouletteMode = 'scanning'; result.textContent = t('menu.scanning'); startBtn.disabled = true; stage.classList.add('spinning');
    setTimeout(() => { stage.classList.remove('spinning'); state.lastRolledTaskId = task.id; rouletteMode = 'result'; saveState(); renderRouletteState(); }, 420);
  }

  function startRolledTaskTimer() {
    const task = state.tasks.find(x => x.id === state.lastRolledTaskId && !x.done);
    if (!task) return;
    setTimerMinutes(task.minutes); navigate('time'); startTimer();
  }

  function generateMicroSteps(task) {
    const raw = task?.title?.trim() || t('emergency.fallbackTask'); const title = raw.length > 70 ? `${raw.slice(0, 67)}…` : raw;
    return [t('emergency.micro1', { title }), t('emergency.micro2'), t('emergency.micro3')];
  }

  function renderEmergency() {
    const task = state.tasks.find(x => x.id === currentEmergencyTaskId && !x.done) || null;
    $('#emergencyTitle').textContent = task ? task.title : t('emergency.defaultTitle');
    $('#microSteps').innerHTML = generateMicroSteps(task).map((step, i) => `<button class="micro-step" type="button" data-step="${i}"><span class="step-num">${i + 1}</span><strong>${esc(step)}</strong></button>`).join('');
  }

  function openEmergency(id = null) {
    const task = (id && state.tasks.find(x => x.id === id && !x.done)) || (state.lastRolledTaskId && state.tasks.find(x => x.id === state.lastRolledTaskId && !x.done)) || pickTask();
    currentEmergencyTaskId = task?.id || null; emergencySparkAwarded = false; renderEmergency(); $('#emergencyBackdrop').classList.add('open');
  }
  function closeEmergency() { $('#emergencyBackdrop').classList.remove('open'); }
  function emergencySwap() { const choices = state.tasks.filter(x => !x.done && x.id !== currentEmergencyTaskId); const task = choices.length ? choices[Math.floor(Math.random() * choices.length)] : pickTask(); currentEmergencyTaskId = task?.id || null; emergencySparkAwarded = false; renderEmergency(); }
  function checkEmergencyCompletion() {
    const steps = $$('#microSteps .micro-step');
    if (steps.length && steps.every(x => x.classList.contains('done')) && !emergencySparkAwarded) {
      emergencySparkAwarded = true; state.sparks += 1; saveState(); rewardFeedback(); renderStats(); toast(t('toast.emergencySpark'));
    }
  }

  function setTimerMinutes(minutes, persist = true) {
    if (timerRunning) pauseTimer(); state.timer.minutes = Number(minutes); if (persist) saveState();
    timerDurationMs = state.timer.minutes * 60000; timerRemainingMs = timerDurationMs;
    $$('[data-timer-minutes]').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.timerMinutes) === state.timer.minutes)); updateTimerUI();
  }
  function formatMs(ms) { const total = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`; }
  function updateTimerUI() {
    $('#timerDigits').textContent = formatMs(timerRemainingMs);
    const ratio = timerDurationMs ? Math.min(1, (timerDurationMs - timerRemainingMs) / timerDurationMs) : 0;
    $('#timeOrbit').style.setProperty('--p', `${ratio * 360}deg`);
    $('#timerToggleBtn').textContent = timerRunning ? t('common.pause') : (timerRemainingMs < timerDurationMs ? t('common.resume') : t('common.startVisibleTime'));
  }
  function startTimer() { if (timerRunning) return; timerRunning = true; timerStartedAt = Date.now() - (timerDurationMs - timerRemainingMs); timerInterval = setInterval(tickTimer, 250); updateTimerUI(); }
  function pauseTimer() { if (!timerRunning) return; timerRunning = false; clearInterval(timerInterval); timerInterval = null; updateTimerUI(); }
  function tickTimer() { if (timerRunning) timerRemainingMs = Math.max(0, timerDurationMs - (Date.now() - timerStartedAt)); updateTimerUI(); if (timerRemainingMs <= 0 && timerRunning) finishTimer(); }
  function finishTimer() { pauseTimer(); state.sessions.unshift({ id: uid(), minutes: state.timer.minutes, finishedAt: new Date().toISOString() }); state.sparks += 1; saveState(); rewardFeedback(); renderAll(); toast(t('toast.timerComplete')); }
  function resetTimer() { pauseTimer(); timerRemainingMs = timerDurationMs; timerStartedAt = 0; updateTimerUI(); }

  function exportData() {
    const blob = new Blob([JSON.stringify({ product: 'FOCUS / by Morrow', version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = `focus-morrow-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url); toast(t('toast.exported'));
  }
  async function importData(file) {
    try {
      const parsed = JSON.parse(await file.text()), incoming = parsed.data || parsed;
      if (!incoming || !Array.isArray(incoming.tasks) || !Array.isArray(incoming.sessions)) throw new Error();
      state = { ...structuredClone(DEFAULT_STATE), ...incoming, settings: { ...DEFAULT_STATE.settings, ...(incoming.settings || {}) }, timer: { ...DEFAULT_STATE.timer, ...(incoming.timer || {}) } };
      if (!['en', 'de'].includes(state.settings.language)) state.settings.language = detectLanguage(); saveState(); setTimerMinutes(state.timer.minutes, false); renderAll(); toast(t('toast.restored'));
    } catch { toast(t('toast.invalidBackup')); }
  }
  function resetData() { if (!confirm(t('confirm.reset'))) return; localStorage.removeItem(STORAGE_KEY); state = structuredClone(DEFAULT_STATE); state.settings.language = detectLanguage(); setTimerMinutes(15, false); saveState(); renderAll(); toast(t('toast.reset')); }

  function bindEvents() {
    $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
    $$('[data-menu-view]').forEach(btn => btn.addEventListener('click', () => { const view = btn.dataset.menuView; $$('[data-menu-view]').forEach(x => x.classList.toggle('active', x === btn)); $('#menuPaneDice').classList.toggle('active', view === 'dice'); $('#menuPaneDopamine').classList.toggle('active', view === 'dopamine'); }));
    $('#quickCaptureForm').addEventListener('submit', e => { e.preventDefault(); createTask($('#quickTaskInput').value); $('#quickTaskInput').value = ''; });
    $$('[data-duration]').forEach(btn => btn.addEventListener('click', () => { quickMinutes = Number(btn.dataset.duration); $$('[data-duration]').forEach(x => x.classList.toggle('active', x === btn)); }));
    $('#taskGrid').addEventListener('click', e => { const action = e.target.closest('[data-action]'), card = e.target.closest('[data-task-id]'); if (!action || !card) return; const id = card.dataset.taskId; if (action.dataset.action === 'delete') deleteTask(id); if (action.dataset.action === 'toggle') toggleTask(id); if (action.dataset.action === 'start') openEmergency(id); });
    $('#clearDoneBtn').addEventListener('click', clearDone); $('#rollBtn').addEventListener('click', rollTask); $('#startRolledBtn').addEventListener('click', startRolledTaskTimer);
    $('#dopamineItems').addEventListener('click', e => { const btn = e.target.closest('[data-dopamine-index]'); if (!btn) return; const [title, note] = DOPAMINE_KEYS[Number(btn.dataset.dopamineIndex)]; toast(`${t(title)} · ${t(note)}`); });
    $$('[data-timer-minutes]').forEach(btn => btn.addEventListener('click', () => setTimerMinutes(Number(btn.dataset.timerMinutes))));
    $('#timerToggleBtn').addEventListener('click', () => timerRunning ? pauseTimer() : startTimer()); $('#timerResetBtn').addEventListener('click', resetTimer);
    $('#emergencyBtn').addEventListener('click', () => openEmergency()); $('#closeEmergencyBtn').addEventListener('click', closeEmergency); $('#emergencyDoneBtn').addEventListener('click', closeEmergency); $('#emergencySwapBtn').addEventListener('click', emergencySwap);
    $('#microSteps').addEventListener('click', e => { const step = e.target.closest('.micro-step'); if (!step) return; step.classList.toggle('done'); checkEmergencyCompletion(); });
    $$('.theme-dot').forEach(btn => btn.addEventListener('click', () => { state.settings.theme = btn.dataset.themeValue; saveState(); renderStats(); }));
    $$('.language-option').forEach(btn => btn.addEventListener('click', () => { if (!['en', 'de'].includes(btn.dataset.language)) return; state.settings.language = btn.dataset.language; saveState(); renderAll(); if ($('#emergencyBackdrop').classList.contains('open')) renderEmergency(); }));
    $('#exportBtn').addEventListener('click', exportData); $('#importBtn').addEventListener('click', () => $('#importFile').click());
    $('#importFile').addEventListener('change', e => { const file = e.target.files?.[0]; if (file) importData(file); e.target.value = ''; }); $('#resetDataBtn').addEventListener('click', resetData);
    $('#closeTaskModalBtn').addEventListener('click', () => $('#taskModalBackdrop').classList.remove('open')); $('#cancelTaskModalBtn').addEventListener('click', () => $('#taskModalBackdrop').classList.remove('open'));
    $('#taskForm').addEventListener('submit', e => { e.preventDefault(); createTask($('#taskTitleInput').value, $('#taskMinutesInput').value, $('#taskEnergyInput').value, $('#taskResistanceInput').value); $('#taskModalBackdrop').classList.remove('open'); });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloading) { reloading = true; location.reload(); } });
    addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register(`./sw.js?v=${BUILD}`, { updateViaCache: 'none' });
        const update = async () => { try { await registration.update(); if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' }); } catch {} };
        await update(); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') update(); }); addEventListener('focus', update);
      } catch {}
    });
  }

  bindEvents(); renderAll(); setTimerMinutes(state.timer.minutes, false); saveState(); registerServiceWorker();
})();
