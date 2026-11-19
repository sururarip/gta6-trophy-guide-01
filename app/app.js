// Leonida Trophy Guide — offline tracker for the 55 GTA VI trophies.
// Progress lives in localStorage; export/import move it as a JSON file.
// Spoiler-free mode hides story trophy names and descriptions until earned.
const STORAGE_KEY = 'leonida-trophy-progress-v1';
const DATA_URL = 'data/trophies.json';

const rows = document.getElementById('rows');
const empty = document.getElementById('empty');
const count = document.getElementById('count');
const searchBox = document.getElementById('search');
const gradeSelect = document.getElementById('grade');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerBox = document.getElementById('spoiler');
const detail = document.getElementById('detail');

const STAGES = [
  { stage: 1, title: 'Stage 1 — Play the story', note: 'Chapters 1–4, the final mission and the big story heists. These trophies unlock by finishing the story.' },
  { stage: 2, title: 'Stage 2 — Strangers & side missions', note: 'Finish the mission strands for Andy, Kenton, Billy, Randy, Tyrone and the other strangers.' },
  { stage: 3, title: 'Stage 3 — Activities & challenges', note: 'Shooting range, races, fishing, arcade, meditation, hunting, stunts and robberies.' },
  { stage: 4, title: 'Stage 4 — Collectibles & money', note: 'Cards, WAiNK tags, vehicles, garages, laundering and shop spending.' },
  { stage: 5, title: 'Stage 5 — Cleanup & platinum', note: 'The last challenges, 100% completion, then the platinum itself.' },
];

let earned = new Set(loadStoredProgress());
let trophies = [];
let kindFilter = 'all';

function loadStoredProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((n) => typeof n === 'string') : [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function isHidden(trophy) {
  return spoilerBox.checked && trophy.hidden && !earned.has(trophy.name);
}

function kindMatches(trophy) {
  if (kindFilter === 'all') return true;
  if (kindFilter === 'missable') return trophy.missable === true;
  if (kindFilter === 'online') return false;
  return trophy.kind === kindFilter;
}

function renderRoadmap() {
  const list = document.getElementById('stages');
  list.replaceChildren();
  for (const s of STAGES) {
    const inStage = trophies.filter((t) => t.stage === s.stage);
    const got = inStage.filter((t) => earned.has(t.name)).length;
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = s.title;
    const p = document.createElement('p');
    p.textContent = s.note;
    const c = document.createElement('p');
    c.className = 'count';
    c.textContent = `${got} of ${inStage.length} earned`;
    li.append(h, p, c);
    list.append(li);
  }
}

function renderMissables() {
  const list = document.getElementById('missableList');
  list.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = t.name;
    li.append(b, document.createTextNode(earned.has(t.name) ? ' — earned ✓' : ' — one-time moment'));
    list.append(li);
  }
}

function updateProgress() {
  const total = trophies.length;
  const got = trophies.filter((t) => earned.has(t.name)).length;
  const pct = total ? Math.round((got / total) * 100) : 0;
  document.getElementById('ringText').textContent = `${pct}%`;
  document.getElementById('ring').style.setProperty('--p', String(pct));
  document.getElementById('progressText').textContent = `${got} of ${total} earned`;
  const byGrade = (g) => trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
  document.getElementById('gradeText').textContent =
    `${byGrade('platinum')} platinum · ${byGrade('gold')} gold · ${byGrade('silver')} silver · ${byGrade('bronze')} bronze`;
  document.getElementById('barFill').style.width = `${pct}%`;
}

function renderChecklist() {
  const q = searchBox.value.trim().toLowerCase();
  rows.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!kindMatches(t)) continue;
    if (gradeSelect.value !== 'all' && t.grade !== gradeSelect.value) continue;
    if (hideEarnedBox.checked && earned.has(t.name)) continue;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) continue;
    shown += 1;
    const li = document.createElement('li');
    if (earned.has(t.name)) li.classList.add('earned');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveProgress();
      updateProgress();
      renderRoadmap();
      renderMissables();
      renderChecklist();
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    if (isHidden(t)) {
      name.textContent = '??? Hidden story trophy';
      const tag = document.createElement('span');
      tag.className = 'hidden-tag';
      tag.textContent = ' hidden until earned';
      name.append(tag);
    } else {
      name.textContent = t.name;
    }
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = isHidden(t) ? 'Spoiler-free mode hides this story trophy until you earn it.' : t.description;
    const guide = document.createElement('div');
    guide.className = 'tguide';
    guide.textContent = isHidden(t) ? '' : t.guide;
    const tags = document.createElement('div');
    tags.className = 'ttags';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag ${t.grade}`;
    gradeTag.textContent = t.grade;
    tags.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = t.kind;
    tags.append(kindTag);
    if (t.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag miss';
      missTag.textContent = 'Missable';
      tags.append(missTag);
    }
    body.append(name, desc, guide, tags);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = 'Full guide';
    btn.addEventListener('click', () => openTrophyDetail(t));
    li.append(box, body, btn);
    rows.append(li);
  }
  empty.hidden = shown !== 0;
  count.textContent = `Showing ${shown} of ${trophies.length} trophies` +
    (kindFilter === 'online' ? ' — the official list has no online trophies; all 55 are single-player.' : '');
}

function openTrophyDetail(trophy) {
  document.getElementById('detailGrade').textContent = trophy.grade;
  document.getElementById('detailName').textContent = trophy.name;
  document.getElementById('detailDesc').textContent = trophy.description;
  document.getElementById('detailTags').textContent =
    `${trophy.kind}${trophy.missable ? ' · missable' : ''} · roadmap stage ${trophy.stage}`;
  document.getElementById('detailGuide').textContent = trophy.guide;
  document.getElementById('detailSource').textContent = trophy.source;
  const check = document.getElementById('detailEarned');
  check.checked = earned.has(trophy.name);
  check.onchange = () => {
    if (check.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveProgress();
    updateProgress();
    renderRoadmap();
    renderMissables();
    renderChecklist();
  };
  detail.hidden = false;
}

function closeTrophyDetail() {
  detail.hidden = true;
}

function exportProgress() {
  const blob = new Blob([JSON.stringify([...earned], null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  const list = JSON.parse(await file.text());
  if (!Array.isArray(list)) return;
  earned = new Set(list.filter((n) => typeof n === 'string'));
  saveProgress();
  updateProgress();
  renderRoadmap();
  renderMissables();
  renderChecklist();
}

async function loadTrophies() {
  const doc = await (await fetch(DATA_URL)).json();
  trophies = doc.trophies;
  renderRoadmap();
  renderMissables();
  updateProgress();
  renderChecklist();
}

document.getElementById('kindChips').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kind]');
  if (!btn) return;
  kindFilter = btn.dataset.kind;
  for (const b of document.querySelectorAll('#kindChips .chip')) b.classList.toggle('active', b === btn);
  renderChecklist();
});
searchBox.addEventListener('input', renderChecklist);
gradeSelect.addEventListener('change', renderChecklist);
hideEarnedBox.addEventListener('change', renderChecklist);
spoilerBox.addEventListener('change', renderChecklist);
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) await importProgress(file);
  e.target.value = '';
});
document.getElementById('closeDetail').addEventListener('click', closeTrophyDetail);

await loadTrophies();
