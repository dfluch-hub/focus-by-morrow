(() => {
'use strict';

const KEY = 'morrow.focus.v2';
const BUILD = '2.0.1';
const I = {
  de: {
    'nav.focus':'FOKUS','nav.collect':'SAMMELN','nav.reset':'RESET',
    'focus.draw':'Zufällige Aufgabe ziehen','focus.new':'Neue Aufgabe anlegen','focus.break':'Zu schwer? In 60s teilen','focus.done':'Erledigt (+1 Spark)','focus.skip':'Überspringen',
    'timer.start':'Start','timer.pause':'Pause','timer.resume':'Weiter','timer.reset':'Reset','timer.flow':'Im Flow bleiben (+15m)','timer.complete':'Erledigt (+1 Spark)',
    'collect.placeholder':'Was geht dir durch den Kopf?','collect.openLoops':'Offene Schleifen','collect.clearDone':'Erledigte leeren','collect.empty':'Noch keine offenen Schleifen.',
    'energy.low':'Niedrig','energy.medium':'Mittel','energy.high':'Hoch',
    'reset.song':'1-Song-Reset','reset.songSub':'3 Minuten Abstand','reset.breathe':'4-7-8 Atem-Kreis','reset.breatheSub':'Nervensystem beruhigen','reset.cold':'Kältereiz','reset.coldSub':'30 Sekunden','reset.move':'Körper-Impuls','reset.moveSub':'Bewegung / Ortswechsel',
    'reset.back':'Zurück','reset.stop':'Stop','reset.next':'Neuer Impuls','reset.inhale':'Einatmen','reset.hold':'Halten','reset.exhale':'Ausatmen',
    'move.1':'Steh auf und geh einmal in einen anderen Raum.','move.2':'Schultern kreisen, Arme ausschütteln, dann 10 Schritte gehen.','move.3':'Wechsle für 5 Minuten den Sitzplatz.','move.4':'Öffne ein Fenster oder geh kurz vor die Tür.','move.5':'Hol dir Wasser und trink drei bewusste Schlucke.',
    'settings.title':'Einstellungen','settings.language':'Sprache','settings.theme':'Akzent','settings.sparks':'Sparks','settings.focusTime':'Fokuszeit','settings.export':'JSON exportieren','settings.resetData':'Daten löschen',
    'theme.mint':'Mint','theme.violet':'Violet','theme.ember':'Ember',
    'micro.1':'Bereite „{task}“ sichtbar vor.','micro.2':'Starte genau 60 Sekunden mit der ersten sichtbaren Teilhandlung.','micro.3':'Entscheide danach: weiter oder ohne Schuldgefühl stoppen.',
    'toast.added':'Gespeichert.','toast.active':'Aufgabe aktiviert.','toast.done':'+1 Spark','toast.skipped':'Für diese Session nach hinten geschoben.','toast.exported':'Backup exportiert.','toast.cleared':'Erledigte Aufgaben entfernt.','toast.reset':'Lokale Daten gelöscht.',
    'confirm.reset':'Alle lokalen Aufgaben, Sparks und Fokusdaten löschen?',
    'aria.settings':'Einstellungen öffnen','aria.close':'Schließen','aria.navigation':'Hauptnavigation','aria.capture':'Gedanken erfassen','aria.add':'Hinzufügen','aria.delete':'Aufgabe löschen','aria.complete':'Aufgabe abhaken','new.prompt':'Neue Aufgabe'
  },
  en: {
    'nav.focus':'FOCUS','nav.collect':'COLLECT','nav.reset':'RESET',
    'focus.draw':'Draw a random task','focus.new':'Create a new task','focus.break':'Too hard? Break into 60s','focus.done':'Done (+1 Spark)','focus.skip':'Skip',
    'timer.start':'Start','timer.pause':'Pause','timer.resume':'Resume','timer.reset':'Reset','timer.flow':'Stay in flow (+15m)','timer.complete':'Done (+1 Spark)',
    'collect.placeholder':'What is on your mind?','collect.openLoops':'Open loops','collect.clearDone':'Clear completed','collect.empty':'No open loops yet.',
    'energy.low':'Low','energy.medium':'Medium','energy.high':'High',
    'reset.song':'1-song reset','reset.songSub':'3 minutes away','reset.breathe':'4-7-8 breathing','reset.breatheSub':'Regulate your nervous system','reset.cold':'Cold cue','reset.coldSub':'30 seconds','reset.move':'Body cue','reset.moveSub':'Movement / location shift',
    'reset.back':'Back','reset.stop':'Stop','reset.next':'New cue','reset.inhale':'Inhale','reset.hold':'Hold','reset.exhale':'Exhale',
    'move.1':'Stand up and walk into another room once.','move.2':'Roll your shoulders, shake out your arms, then walk 10 steps.','move.3':'Change your seat for 5 minutes.','move.4':'Open a window or step outside briefly.','move.5':'Get water and take three deliberate sips.',
    'settings.title':'Settings','settings.language':'Language','settings.theme':'Accent','settings.sparks':'Sparks','settings.focusTime':'Focus time','settings.export':'Export JSON','settings.resetData':'Delete data',
    'theme.mint':'Mint','theme.violet':'Violet','theme.ember':'Ember',
    'micro.1':'Put “{task}” visibly in front of you.','micro.2':'Start the first visible action for exactly 60 seconds.','micro.3':'Then choose: continue or stop without guilt.',
    'toast.added':'Saved.','toast.active':'Task activated.','toast.done':'+1 Spark','toast.skipped':'Moved back for this session.','toast.exported':'Backup exported.','toast.cleared':'Completed tasks cleared.','toast.reset':'Local data deleted.',
    'confirm.reset':'Delete all local tasks, Sparks and focus data?',
    'aria.settings':'Open settings','aria.close':'Close','aria.navigation':'Main navigation','aria.capture':'Capture a thought','aria.add':'Add','aria.delete':'Delete task','aria.complete':'Complete task','new.prompt':'New task'
  }
};

const DEF = {tasks:[],completed:[],activeId:null,sparks:0,totalFocusMs:0,language:null,theme:'mint',timerMinutes:15,sessionSkipOrder:[]};
const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => Array.from(r.querySelectorAll(s));
const lang0 = () => (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
let state = load();
let captureMinutes = 15;
let microOpen = false;
let audioCtx = null;
let resetSession = null;
let timer = makeTimer(state.timerMinutes);

function makeTimer(min){return {running:false,expired:false,durationMs:min*60000,remainingMs:min*60000,endAt:0,segmentStartedAt:0,interval:null};}
function load(){
  try{
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    const s = Object.assign({}, DEF, raw);
    s.tasks = Array.isArray(raw.tasks) ? raw.tasks : [];
    s.completed = Array.isArray(raw.completed) ? raw.completed : [];
    s.sessionSkipOrder = Array.isArray(raw.sessionSkipOrder) ? raw.sessionSkipOrder : [];
    if(!['de','en'].includes(s.language)) s.language = lang0();
    if(!['mint','violet','ember'].includes(s.theme)) s.theme = 'mint';
    if(!Number.isFinite(+s.timerMinutes)) s.timerMinutes = 15;
    return s;
  }catch(e){ return Object.assign({}, DEF, {language:lang0()}); }
}
function save(){ try{localStorage.setItem(KEY, JSON.stringify(state));}catch(e){} }
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function t(k,vars={}){let out=(I[state.language]&&I[state.language][k])||I.en[k]||k;Object.entries(vars).forEach(([a,b])=>{out=out.replaceAll(`{${a}}`,String(b));});return out;}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function activeTask(){return state.tasks.find(x=>x.id===state.activeId)||null;}
function toast(msg){const e=$('#toast');if(!e)return;e.textContent=msg;e.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove('show'),1800);}

function applyI18n(){
  document.documentElement.lang=state.language;
  $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(e=>e.placeholder=t(e.dataset.i18nPlaceholder));
  $$('[data-i18n-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.i18nAria)));
  $$('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.language===state.language));
}
function applyTheme(){document.documentElement.dataset.theme=state.theme;$$('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===state.theme));}
function navigate(name){$$('.screen').forEach(e=>e.classList.toggle('active',e.dataset.screen===name));$$('.nav').forEach(e=>e.classList.toggle('active',e.dataset.nav===name));if(name==='reset')renderResetHome();}

function addTask(title,minutes=15,energy='medium',activate=false){title=String(title||'').trim();if(!title)return;const task={id:uid(),title,minutes:+minutes,energy,createdAt:new Date().toISOString()};state.tasks.push(task);if(activate){state.activeId=task.id;state.timerMinutes=task.minutes;timer=makeTimer(task.minutes);}save();renderAll();if(activate)navigate('focus');toast(t('toast.added'));}
function chooseNovel(){if(!state.tasks.length)return null;const recent=new Set(state.sessionSkipOrder.slice(-Math.max(1,state.tasks.length-1)));let pool=state.tasks.filter(x=>x.id!==state.activeId&&!recent.has(x.id));if(!pool.length)pool=state.tasks.filter(x=>x.id!==state.activeId);if(!pool.length)pool=state.tasks.slice();return pool[Math.floor(Math.random()*pool.length)]||null;}
function activateTask(id){stopTimer(true);const task=state.tasks.find(x=>x.id===id);if(!task)return;state.activeId=id;state.timerMinutes=task.minutes||15;timer=makeTimer(state.timerMinutes);microOpen=false;state.sessionSkipOrder=state.sessionSkipOrder.filter(x=>x!==id);save();renderAll();navigate('focus');toast(t('toast.active'));}
function drawTask(){const task=chooseNovel();if(task)activateTask(task.id);}
function skipTask(){const task=activeTask();if(!task)return;stopTimer(true);state.sessionSkipOrder.push(task.id);state.activeId=null;microOpen=false;const next=chooseNovel();if(next){state.activeId=next.id;state.timerMinutes=next.minutes||15;timer=makeTimer(state.timerMinutes);}save();renderAll();toast(t('toast.skipped'));}
function completeTask(id,full=true){const task=state.tasks.find(x=>x.id===id);if(!task)return;if(id===state.activeId)stopTimer(true);state.tasks=state.tasks.filter(x=>x.id!==id);state.completed.unshift({...task,completedAt:new Date().toISOString()});state.sparks++;state.sessionSkipOrder=state.sessionSkipOrder.filter(x=>x!==id);if(id===state.activeId){state.activeId=null;const next=chooseNovel();if(next){state.activeId=next.id;state.timerMinutes=next.minutes||15;}timer=makeTimer(state.timerMinutes);microOpen=false;}save();if(full)reward();else vibrate();renderAll();toast(t('toast.done'));}
function deleteTask(id){if(id===state.activeId){stopTimer(true);state.activeId=null;timer=makeTimer(state.timerMinutes);}state.tasks=state.tasks.filter(x=>x.id!==id);save();renderAll();}
function clearCompleted(){state.completed=[];save();toast(t('toast.cleared'));}
function microSteps(task){return task?[t('micro.1',{task:task.title}),t('micro.2'),t('micro.3')]:[];}

function fmt(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function setMinutes(m){stopTimer(true);state.timerMinutes=+m;timer=makeTimer(+m);save();renderFocus();}
function startPause(){if(timer.running){stopTimer(true);updateTimerDOM();return;}if(timer.expired)return;primeAudio();timer.running=true;timer.segmentStartedAt=Date.now();timer.endAt=Date.now()+timer.remainingMs;timer.interval=setInterval(tick,250);updateTimerDOM();}
function stopTimer(acc){if(!timer.running){if(timer.interval)clearInterval(timer.interval);timer.interval=null;return;}const now=Date.now();if(acc)state.totalFocusMs+=Math.max(0,now-timer.segmentStartedAt);timer.remainingMs=Math.max(0,timer.endAt-now);timer.running=false;timer.endAt=0;timer.segmentStartedAt=0;clearInterval(timer.interval);timer.interval=null;save();}
function resetTimer(){stopTimer(true);timer=makeTimer(state.timerMinutes);renderFocus();}
function tick(){if(!timer.running)return;timer.remainingMs=Math.max(0,timer.endAt-Date.now());updateTimerDOM();if(timer.remainingMs<=0)expireTimer();}
function expireTimer(){if(timer.running)state.totalFocusMs+=Math.max(0,Date.now()-timer.segmentStartedAt);timer.running=false;timer.expired=true;timer.remainingMs=0;clearInterval(timer.interval);timer.interval=null;save();chime();vibrate();renderFocus();updateSettings();}
function addFlow(){timer=makeTimer(15);state.timerMinutes=15;renderFocus();startPause();}
function updateTimerDOM(){const o=$('#orbit'),d=$('#orbitTime'),b=$('#timerToggle');if(!o||!d)return;d.textContent=fmt(timer.remainingMs);const ratio=timer.durationMs?Math.min(1,(timer.durationMs-timer.remainingMs)/timer.durationMs):0;o.style.setProperty('--p',`${ratio*360}deg`);if(b)b.textContent=timer.running?t('timer.pause'):(timer.remainingMs<timer.durationMs?t('timer.resume'):t('timer.start'));}

function renderFocus(){const root=$('#focusStage');if(!root)return;const x=activeTask();const spark=$('#sparkCount');if(spark)spark.textContent=state.sparks;if(!x){root.innerHTML=`<div class="focus-card glass"><div class="focus-empty"><div class="focus-empty-actions"><button id="drawBtn" class="primary" type="button">${esc(t('focus.draw'))}</button><button id="newTaskBtn" class="ghost" type="button">${esc(t('focus.new'))}</button></div></div></div>`;return;}if(timer.expired){root.innerHTML=`<div class="focus-card glass"><div class="active-task"><h1 class="active-title">${esc(x.title)}</h1><div class="expired"><button id="flowBtn" class="primary" type="button">${esc(t('timer.flow'))}</button><button id="completeExpiredBtn" class="ghost" type="button">${esc(t('timer.complete'))}</button></div></div></div>`;return;}const micro=microOpen?`<div class="micro-inline">${microSteps(x).map((s,i)=>`<div class="micro"><b>${i+1}</b><span>${esc(s)}</span></div>`).join('')}</div>`:'';root.innerHTML=`<div class="focus-card glass"><div class="active-task"><h1 class="active-title">${esc(x.title)}</h1>${micro}<div class="timer-zone"><div id="orbit" class="orbit"><div id="orbitTime" class="orbit-time">${fmt(timer.remainingMs)}</div></div><div class="duration">${[5,15,25,45].map(m=>`<button type="button" class="pill ${state.timerMinutes===m?'active':''}" data-focus-minutes="${m}">${m}m</button>`).join('')}</div><div class="timer-buttons"><button id="timerToggle" class="primary" type="button"></button><button id="timerReset" class="ghost" type="button">${esc(t('timer.reset'))}</button></div></div><div class="focus-actions"><button id="breakBtn" class="subtle breakdown" type="button">${esc(t('focus.break'))}</button><button id="completeBtn" class="primary" type="button">${esc(t('focus.done'))}</button><button id="skipBtn" class="ghost" type="button">${esc(t('focus.skip'))}</button></div></div></div>`;updateTimerDOM();}
function renderCollect(){const list=$('#taskList');if(!list)return;list.innerHTML=state.tasks.length?state.tasks.map(x=>`<article class="task-row"><button class="task-main" type="button" data-activate="${x.id}"><strong>${esc(x.title)}</strong><div class="meta"><span class="badge">${x.minutes}m</span><span class="badge">${esc(t('energy.'+x.energy))}</span></div></button><button class="row-btn" type="button" data-complete="${x.id}" aria-label="${esc(t('aria.complete'))}">✓</button><button class="row-btn" type="button" data-delete="${x.id}" aria-label="${esc(t('aria.delete'))}">×</button></article>`).join(''):`<div class="list-empty">${esc(t('collect.empty'))}</div>`;$$('#captureDuration .pill').forEach(b=>b.classList.toggle('active',+b.dataset.captureMinutes===captureMinutes));}
function renderResetHome(){cancelReset();const root=$('#resetRoot');if(!root)return;root.className='reset-grid';root.innerHTML=[['song','reset.song','reset.songSub','♫'],['breathe','reset.breathe','reset.breatheSub','◯'],['cold','reset.cold','reset.coldSub','❄'],['move','reset.move','reset.moveSub','↗']].map(([m,a,b,i])=>`<button class="reset-card" type="button" data-reset-mode="${m}"><strong>${i} ${esc(t(a))}</strong><span>${esc(t(b))}</span></button>`).join('');}
function startReset(mode){cancelReset();const root=$('#resetRoot');if(!root)return;root.className='reset-session';if(mode==='song')countdown(root,180,'♫',t('reset.song'));else if(mode==='cold')countdown(root,30,'❄',t('reset.cold'));else if(mode==='breathe')breathing(root);else if(mode==='move')movement(root);}
function countdown(root,seconds,icon,label){let left=seconds;root.innerHTML=`<div class="reset-panel glass"><div style="font-size:34px">${icon}</div><div class="reset-label">${esc(label)}</div><div id="resetTimer" class="reset-timer">${fmt(left*1000)}</div><div class="reset-actions"><button id="resetBack" class="ghost" type="button">${esc(t('reset.back'))}</button><button id="resetStop" class="primary" type="button">${esc(t('reset.stop'))}</button></div></div>`;const interval=setInterval(()=>{left--;const e=$('#resetTimer');if(e)e.textContent=fmt(left*1000);if(left<=0){clearInterval(interval);chime();vibrate();}},1000);resetSession={interval};}
function breathing(root){const phases=[['reset.inhale',4,'inhale'],['reset.hold',7,'hold'],['reset.exhale',8,'exhale']];let p=0,left=phases[0][1];root.innerHTML=`<div class="reset-panel glass"><div id="breathCircle" class="breath-circle"></div><div id="breathLabel" class="reset-label"></div><div id="breathTime" class="reset-timer"></div><button id="resetBack" class="ghost" type="button">${esc(t('reset.back'))}</button></div>`;const paint=()=>{const x=phases[p],c=$('#breathCircle'),l=$('#breathLabel'),tm=$('#breathTime');if(c)c.className='breath-circle '+x[2];if(l)l.textContent=t(x[0]);if(tm)tm.textContent=left;};paint();const interval=setInterval(()=>{left--;if(left<=0){p=(p+1)%phases.length;left=phases[p][1];}paint();},1000);resetSession={interval};}
function movement(root){const draw=()=>t('move.'+(1+Math.floor(Math.random()*5)));root.innerHTML=`<div class="reset-panel glass"><div id="moveText" class="move-text">${esc(draw())}</div><div class="reset-actions"><button id="resetBack" class="ghost" type="button">${esc(t('reset.back'))}</button><button id="moveNext" class="primary" type="button">${esc(t('reset.next'))}</button></div></div>`;const next=$('#moveNext');if(next)next.addEventListener('click',()=>{const e=$('#moveText');if(e)e.textContent=draw();});}
function cancelReset(){if(resetSession&&resetSession.interval)clearInterval(resetSession.interval);resetSession=null;}

function primeAudio(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!audioCtx)audioCtx=new C();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
function chime(){try{primeAudio();if(!audioCtx)return;const n=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(528,n);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.08,n+.06);g.gain.exponentialRampToValueAtTime(.0001,n+.8);o.connect(g).connect(audioCtx.destination);o.start(n);o.stop(n+.82);}catch(e){}}
function vibrate(){try{if(navigator.vibrate)navigator.vibrate([28,22,42]);}catch(e){}}
function confetti(){const layer=$('#fx');if(!layer)return;for(let i=0;i<18;i++){const p=document.createElement('span');p.className='confetti';const a=Math.PI*2*i/18+Math.random()*.25,d=55+Math.random()*120;p.style.setProperty('--x',`${Math.cos(a)*d}px`);p.style.setProperty('--y',`${Math.sin(a)*d}px`);p.style.setProperty('--r',`${180+Math.random()*300}deg`);layer.appendChild(p);setTimeout(()=>p.remove(),900);}}
function reward(){vibrate();chime();confetti();}
function updateSettings(){const a=$('#settingsSparks'),b=$('#settingsFocusTime');if(a)a.textContent=`✦ ${state.sparks}`;if(b)b.textContent=`${Math.round(state.totalFocusMs/60000)} min`;$$('.lang-btn').forEach(x=>x.classList.toggle('active',x.dataset.language===state.language));$$('.theme-btn').forEach(x=>x.classList.toggle('active',x.dataset.theme===state.theme));}
function renderAll(){applyI18n();applyTheme();renderFocus();renderCollect();updateSettings();}
function exportJSON(){const blob=new Blob([JSON.stringify({product:'FOCUS / by Morrow',version:2,exportedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`focus-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500);toast(t('toast.exported'));}
function resetData(){if(!confirm(t('confirm.reset')))return;localStorage.removeItem(KEY);state=Object.assign({},DEF,{language:lang0()});timer=makeTimer(15);save();renderAll();const m=$('#settingsModal');if(m)m.classList.remove('open');toast(t('toast.reset'));}
function newPrompt(){const x=prompt(t('new.prompt'),'');if(x&&x.trim())addTask(x,15,'medium',true);}

function bind(){
  $$('.nav').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
  const settingsBtn=$('#settingsBtn'), settingsModal=$('#settingsModal'), closeSettings=$('#closeSettingsBtn');
  if(settingsBtn&&settingsModal)settingsBtn.addEventListener('click',()=>{settingsModal.classList.add('open');updateSettings();});
  if(closeSettings&&settingsModal)closeSettings.addEventListener('click',()=>settingsModal.classList.remove('open'));
  if(settingsModal)settingsModal.addEventListener('click',e=>{if(e.target===settingsModal)settingsModal.classList.remove('open');});
  $$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{state.language=b.dataset.language;save();renderAll();renderResetHome();}));
  $$('.theme-btn').forEach(b=>b.addEventListener('click',()=>{state.theme=b.dataset.theme;save();renderAll();}));
  const ex=$('#exportBtn'),reset=$('#resetDataBtn');if(ex)ex.addEventListener('click',exportJSON);if(reset)reset.addEventListener('click',resetData);
  const form=$('#captureForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();const input=$('#captureInput');if(input){addTask(input.value,captureMinutes,'medium');input.value='';}});
  const dur=$('#captureDuration');if(dur)dur.addEventListener('click',e=>{const b=e.target.closest('[data-capture-minutes]');if(b){captureMinutes=+b.dataset.captureMinutes;renderCollect();}});
  const clear=$('#clearDoneBtn');if(clear)clear.addEventListener('click',clearCompleted);
  const list=$('#taskList');if(list)list.addEventListener('click',e=>{const a=e.target.closest('[data-activate]'),c=e.target.closest('[data-complete]'),d=e.target.closest('[data-delete]');if(a)activateTask(a.dataset.activate);else if(c)completeTask(c.dataset.complete,false);else if(d)deleteTask(d.dataset.delete);});
  const focus=$('#focusStage');if(focus)focus.addEventListener('click',e=>{const min=e.target.closest('[data-focus-minutes]');if(e.target.closest('#drawBtn'))drawTask();else if(e.target.closest('#newTaskBtn'))newPrompt();else if(min)setMinutes(+min.dataset.focusMinutes);else if(e.target.closest('#timerToggle'))startPause();else if(e.target.closest('#timerReset'))resetTimer();else if(e.target.closest('#breakBtn')){microOpen=!microOpen;renderFocus();}else if(e.target.closest('#completeBtn'))completeTask(state.activeId,true);else if(e.target.closest('#skipBtn'))skipTask();else if(e.target.closest('#flowBtn'))addFlow();else if(e.target.closest('#completeExpiredBtn'))completeTask(state.activeId,true);});
  const rr=$('#resetRoot');if(rr)rr.addEventListener('click',e=>{const card=e.target.closest('[data-reset-mode]');if(card)startReset(card.dataset.resetMode);else if(e.target.closest('#resetBack')||e.target.closest('#resetStop'))renderResetHome();});
}
async function registerSW(){if(!('serviceWorker' in navigator))return;try{const reg=await navigator.serviceWorker.register(`./sw.js?v=${BUILD}`,{updateViaCache:'none'});reg.update().catch(()=>{});window.addEventListener('focus',()=>reg.update().catch(()=>{}));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{});});}catch(e){}}

function init(){try{bind();renderAll();renderResetHome();save();registerSW();}catch(err){console.error('FOCUS init failed',err);const root=$('#focusStage');if(root)root.innerHTML='<div class="focus-card glass"><div class="focus-empty"><div class="focus-empty-actions"><button class="primary" type="button" onclick="location.reload()">Reload FOCUS</button></div></div></div>';}}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();