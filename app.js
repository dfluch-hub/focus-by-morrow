(() => {
  'use strict';

  const STORAGE_KEY = 'morrow.focus.v2';
  const DEFAULT_STATE = {
    lang: 'de',
    theme: 'midnight',
    sparks: 0,
    tasks: [],
    focusMinutes: 0,
    timerMin: 15
  };

  const i18n = {
    de: {
      placeholder: 'Schleife festhalten...',
      empty: 'Keine offenen Schleifen. Dein Kopf ist frei.',
      timeLabel: 'Fokuszeit',
      start: 'Starten',
      pause: 'Pause',
      resume: 'Weiter',
      doneToast: 'Erledigt. +1 Spark.',
      chimeStart: 'Timer läuft.',
      diceEmpty: 'Keine offenen Aufgaben.',
      diceSub: 'Leichtester Einstieg:',
      rolledBtn: 'In Timer übernehmen'
    },
    en: {
      placeholder: 'Capture a loop...',
      empty: 'No open loops. Your mind is clear.',
      timeLabel: 'Focus block',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      doneToast: 'Done. +1 spark.',
      chimeStart: 'Timer started.',
      diceEmpty: 'No tasks to roll.',
      diceSub: 'Lowest friction move:',
      rolledBtn: 'Start in Timer'
    }
  };

  const dopamineList = [
    { title: 'One-Song Reset', note: '1 Song hören, erst bei Minute 2 anfangen.' },
    { title: 'Kältereiz', note: '20 Sek. kaltes Wasser über die Handgelenke.' },
    { title: 'Ortswechsel', note: 'Aufstehen, Raum oder Sitzposition wechseln.' },
    { title: 'Sichtbarer Genuss', note: 'Wasser oder Tee direkt neben die Aufgabe stellen.' }
  ];

  let state = loadState();
  let quickMin = 5;
  let quickEnergy = 'low';
  let timerInterval = null;
  let timerRemainingMs = state.timerMin * 60 * 1000;
  let timerDurationMs = timerRemainingMs;
  let timerRunning = false;
  let lastRolledTask = null;

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];

  // Multisensorisches Feedback (Web Audio API - 528Hz Sinus Gong)
  function playTone(freq = 528) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
      if ('vibrate' in navigator) navigator.vibrate(35);
    } catch {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : structuredClone(DEFAULT_STATE);
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove('show'), 2000);
  }

  function renderTasks() {
    const list = $('#taskList');
    const t = i18n[state.lang];
    if (!state.tasks.length) {
      list.innerHTML = `<div class="empty-state">${t.empty}</div>`;
      return;
    }
    list.innerHTML = state.tasks
      .map(
        task => `
        <div class="task-card ${task.done ? 'done' : ''}" data-id="${task.id}">
          <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-sub">${task.min}m · ${task.energy}</div>
          </div>
          <div class="task-actions">
            <button class="action-check" data-action="toggle">${task.done ? 'Undo' : 'Done'}</button>
            <button class="icon-btn" data-action="del" style="width:28px;height:28px;">×</button>
          </div>
        </div>`
      )
      .join('');
  }

  function renderDopamine() {
    $('#dopamineList').innerHTML = dopamineList
      .map(
        d => `
        <div class="task-card" style="cursor:pointer" onclick="playTone(600)">
          <div>
            <div class="task-title">${d.title}</div>
            <div class="task-sub">${d.note}</div>
          </div>
        </div>`
      )
      .join('');
  }

  function updateTimerUI() {
    const sec = Math.ceil(timerRemainingMs / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    $('#timerDigits').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const ratio = timerDurationMs ? (timerDurationMs - timerRemainingMs) / timerDurationMs : 0;
    $('#timeOrbit').style.setProperty('--p', `${ratio * 360}deg`);
    $('#timerToggleBtn').textContent = timerRunning
      ? i18n[state.lang].pause
      : timerRemainingMs < timerDurationMs
        ? i18n[state.lang].resume
        : i18n[state.lang].start;
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    playTone(440);
    const start = Date.now() - (timerDurationMs - timerRemainingMs);
    timerInterval = setInterval(() => {
      timerRemainingMs = Math.max(0, timerDurationMs - (Date.now() - start));
      updateTimerUI();
      if (timerRemainingMs <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        state.focusMinutes += state.timerMin;
        state.sparks += 1;
        saveState();
        playTone(528);
        showToast('+1 Spark! Fokusblock beendet.');
        renderAll();
      }
    }, 250);
    updateTimerUI();
  }

  function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    updateTimerUI();
  }

  function resetTimer() {
    pauseTimer();
    timerRemainingMs = state.timerMin * 60 * 1000;
    timerDurationMs = timerRemainingMs;
    updateTimerUI();
  }

  function setTimerMin(min) {
    pauseTimer();
    state.timerMin = min;
    timerDurationMs = min * 60 * 1000;
    timerRemainingMs = timerDurationMs;
    saveState();
    $$('[data-timer-min]').forEach(b => b.classList.toggle('active', Number(b.dataset.timerMin) === min));
    updateTimerUI();
  }

  function renderAll() {
    document.documentElement.dataset.theme = state.theme;
    $('#sparkCount').textContent = state.sparks;
    $('#statFocusTime').textContent = `${state.focusMinutes} Min`;
    $('#quickInput').placeholder = i18n[state.lang].placeholder;
    $('#langDe').classList.toggle('active', state.lang === 'de');
    $('#langEn').classList.toggle('active', state.lang === 'en');
    renderTasks();
    renderDopamine();
    updateTimerUI();
  }

  function bindEvents() {
    // Nav
    $$('.nav-btn').forEach(b =>
      b.addEventListener('click', () => {
        $$('.nav-btn').forEach(x => x.classList.remove('active'));
        $$('.screen').forEach(s => s.classList.remove('active'));
        b.classList.add('active');
        $(`#screen-${b.dataset.nav}`).classList.add('active');
      })
    );

    // Quick Capture
    $('#quickCaptureForm').addEventListener('submit', e => {
      e.preventDefault();
      const input = $('#quickInput');
      const val = input.value.trim();
      if (!val) return;
      state.tasks.unshift({
        id: Date.now().toString(36),
        title: val,
        min: quickMin,
        energy: quickEnergy,
        done: false
      });
      input.value = '';
      saveState();
      renderTasks();
      playTone(650);
    });

    // Pills
    $$('.meta-pills .pill').forEach(p =>
      p.addEventListener('click', () => {
        if (p.dataset.min) {
          quickMin = Number(p.dataset.min);
          $$('[data-min]').forEach(x => x.classList.remove('active'));
          p.classList.add('active');
        }
        if (p.dataset.energy) {
          quickEnergy = p.dataset.energy;
          $$('[data-energy]').forEach(x => x.classList.remove('active'));
          p.classList.add('active');
        }
      })
    );

    // Task Actions
    $('#taskList').addEventListener('click', e => {
      const card = e.target.closest('[data-id]');
      if (!card) return;
      const id = card.dataset.id;
      const act = e.target.dataset.action;
      if (act === 'toggle') {
        const t = state.tasks.find(x => x.id === id);
        t.done = !t.done;
        if (t.done) {
          state.sparks += 1;
          playTone(528);
          showToast(i18n[state.lang].doneToast);
        }
        saveState();
        renderAll();
      }
      if (act === 'del') {
        state.tasks = state.tasks.filter(x => x.id !== id);
        saveState();
        renderTasks();
      }
    });

    $('#clearDoneBtn').addEventListener('click', () => {
      state.tasks = state.tasks.filter(t => !t.done);
      saveState();
      renderTasks();
    });

    // Timer Controls
    $$('[data-timer-min]').forEach(b =>
      b.addEventListener('click', () => setTimerMin(Number(b.dataset.timerMin)))
    );
    $('#timerToggleBtn').addEventListener('click', () => (timerRunning ? pauseTimer() : startTimer()));
    $('#timerResetBtn').addEventListener('click', resetTimer);

    // Menu Segment
    $('#tabBtnDice').addEventListener('click', () => {
      $('#tabBtnDice').classList.add('active');
      $('#tabBtnDopamine').classList.remove('active');
      $('#tabDice').classList.add('active');
      $('#tabDopamine').classList.remove('active');
    });
    $('#tabBtnDopamine').addEventListener('click', () => {
      $('#tabBtnDopamine').classList.add('active');
      $('#tabBtnDice').classList.remove('active');
      $('#tabDopamine').classList.add('active');
      $('#tabDice').classList.remove('active');
    });

    // Dice Roll
    $('#rollBtn').addEventListener('click', () => {
      const open = state.tasks.filter(t => !t.done);
      if (!open.length) {
        $('#diceTitle').textContent = i18n[state.lang].diceEmpty;
        return;
      }
      playTone(400);
      lastRolledTask = open[Math.floor(Math.random() * open.length)];
      $('#diceTitle').textContent = lastRolledTask.title;
      $('#diceSub').textContent = `${lastRolledTask.min} Min · ${lastRolledTask.energy}`;
      const sBtn = $('#startRolledBtn');
      sBtn.style.display = 'block';
      sBtn.textContent = i18n[state.lang].rolledBtn;
    });

    $('#startRolledBtn').addEventListener('click', () => {
      if (lastRolledTask) {
        setTimerMin(lastRolledTask.min);
        $('[data-nav="time"]').click();
        startTimer();
      }
    });

    // Notfall
    $('#emergencyBtn').addEventListener('click', () => {
      const open = state.tasks.filter(t => !t.done);
      const title = open.length ? open[0].title : 'dieser Aufgabe';
      $('#emergencySteps').innerHTML = `
        <div class="step-item"><span class="step-num">1</span>Öffne nur: "${title}".</div>
        <div class="step-item"><span class="step-num">2</span>Arbeite genau 60 Sekunden daran.</div>
        <div class="step-item"><span class="step-num">3</span>Danach entscheidest du: Stopp oder Weiter.</div>
      `;
      $('#emergencyModal').classList.add('open');
    });
    $('#emergencyCloseBtn').addEventListener('click', () => {
      state.sparks += 1;
      saveState();
      playTone(528);
      $('#emergencyModal').classList.remove('open');
      renderAll();
    });

    // Settings
    $('#langDe').addEventListener('click', () => { state.lang = 'de'; saveState(); renderAll(); });
    $('#langEn').addEventListener('click', () => { state.lang = 'en'; saveState(); renderAll(); });
    $$('[data-theme]').forEach(b =>
      b.addEventListener('click', () => {
        state.theme = b.dataset.theme;
        saveState();
        renderAll();
      })
    );
    $('#exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'focus-backup.json';
      a.click();
    });
    $('#resetBtn').addEventListener('click', () => {
      if (confirm('Wirklich alles löschen?')) {
        localStorage.removeItem(STORAGE_KEY);
        state = structuredClone(DEFAULT_STATE);
        renderAll();
      }
    });
  }

  function init() {
    bindEvents();
    renderAll();
  }
  init();
})();
