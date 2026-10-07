const players = [
  { id: 1, name: 'Ja Morant', team: 'Grizzlies', pos: 'PG', shot: 88, speed: 96, defense: 60, power: 74, special: 'Floater Burst', rating: 92 },
  { id: 2, name: 'Stephen Curry', team: 'Warriors', pos: 'PG', shot: 99, speed: 86, defense: 70, power: 68, special: 'Night Splash', rating: 98 },
  { id: 3, name: 'Giannis Antetokounmpo', team: 'Bucks', pos: 'PF', shot: 78, speed: 92, defense: 84, power: 99, special: 'Transition Slam', rating: 95 },
  { id: 4, name: 'Kevin Durant', team: 'Suns', pos: 'SF', shot: 97, speed: 85, defense: 81, power: 76, special: 'Mid-Range Master', rating: 96 },
  { id: 5, name: 'Jalen Brunson', team: 'Knicks', pos: 'PG', shot: 90, speed: 87, defense: 78, power: 72, special: 'Clutch Shot Creator', rating: 90 },
  { id: 6, name: 'Anthony Edwards', team: 'Timberwolves', pos: 'SG', shot: 86, speed: 94, defense: 72, power: 83, special: 'Explosive Drive', rating: 91 },
  { id: 7, name: 'Victor Wembanyama', team: 'Spurs', pos: 'C', shot: 84, speed: 82, defense: 90, power: 94, special: 'Sky Finish', rating: 94 },
  { id: 8, name: 'Shai Gilgeous-Alexander', team: 'Thunder', pos: 'G', shot: 89, speed: 90, defense: 76, power: 80, special: 'Stepback Creator', rating: 93 },
  { id: 9, name: 'Devin Booker', team: 'Suns', pos: 'SG', shot: 92, speed: 88, defense: 70, power: 78, special: 'Three-Point Bomb', rating: 92 },
  { id: 10, name: 'Jayson Tatum', team: 'Celtics', pos: 'SF', shot: 94, speed: 87, defense: 78, power: 82, special: 'Deep Range', rating: 94 }
];

const state = {
  selectedPlayer: players[0],
  playerScore: 0,
  cpuScore: 0,
  timer: 90,
  shotMeter: 20,
  money: 250,
  gameRunning: false,
  matchClock: null,
  shotDirection: 1,
  combo: 0,
  rank: 'Rookie'
};

const rosterList = document.getElementById('roster-list');
const playerScoreEl = document.getElementById('player-score');
const cpuScoreEl = document.getElementById('cpu-score');
const timerEl = document.getElementById('timer');
const shotMeterEl = document.getElementById('shot-meter');
const playerMoneyEl = document.getElementById('player-money');
const cityRankEl = document.getElementById('city-rank');
const selectedPlayerNameEl = document.getElementById('selected-player-name');
const selectedPlayerTeamEl = document.getElementById('selected-player-team');
const statShotEl = document.getElementById('stat-shot');
const statSpeedEl = document.getElementById('stat-speed');
const statDefenseEl = document.getElementById('stat-defense');
const statPowerEl = document.getElementById('stat-power');
const selectedPlayerSpecialEl = document.getElementById('selected-player-special');
const playerPositionEl = document.getElementById('player-position');
const gameStateEl = document.getElementById('game-state');
const ballEl = document.getElementById('ball');
const playerMarkerEl = document.getElementById('player-marker');
const opponentMarkerEl = document.getElementById('opponent-marker');

function renderRoster() {
  rosterList.innerHTML = '';

  players.forEach((player) => {
    const row = document.createElement('div');
    row.className = `roster-item ${player.id === state.selectedPlayer.id ? 'active' : ''}`;
    row.innerHTML = `
      <div class="avatar">${player.name.split(' ').map((n) => n[0]).slice(0,2).join('')}</div>
      <div class="roster-meta">
        <strong>${player.name}</strong>
        <small>${player.team} • ${player.pos}</small>
      </div>
      <div class="roster-rating">${player.rating}</div>
    `;

    row.addEventListener('click', () => {
      state.selectedPlayer = player;
      renderRoster();
      renderPlayerCard();
      updateRank();
    });

    rosterList.appendChild(row);
  });
}

function renderPlayerCard() {
  const player = state.selectedPlayer;
  selectedPlayerNameEl.textContent = player.name;
  selectedPlayerTeamEl.textContent = `${player.team} • ${player.pos}`;
  statShotEl.textContent = player.shot;
  statSpeedEl.textContent = player.speed;
  statDefenseEl.textContent = player.defense;
  statPowerEl.textContent = player.power;
  selectedPlayerSpecialEl.textContent = player.special;
  playerPositionEl.textContent = player.pos;
}

function updateRank() {
  const rating = state.selectedPlayer.rating + Math.floor(state.money / 100);
  if (rating >= 96) state.rank = 'Mythic';
  else if (rating >= 92) state.rank = 'Elite';
  else if (rating >= 88) state.rank = 'Star';
  else state.rank = 'Rookie';
  cityRankEl.textContent = state.rank;
}

function updateMeter() {
  const meterValue = Math.max(10, Math.min(100, state.shotMeter));
  shotMeterEl.style.width = `${meterValue}%`;
  if (state.shotMeter >= 100) {
    state.shotMeter = 20;
  }
}

function startMatch() {
  state.gameRunning = true;
  state.playerScore = 0;
  state.cpuScore = 0;
  state.timer = 90;
  state.combo = 0;
  gameStateEl.textContent = 'Live';
  playerScoreEl.textContent = state.playerScore;
  cpuScoreEl.textContent = state.cpuScore;
  timerEl.textContent = state.timer;
  state.matchClock = setInterval(() => {
    state.timer -= 1;
    timerEl.textContent = state.timer;

    if (state.timer <= 0) {
      clearInterval(state.matchClock);
      state.gameRunning = false;
      gameStateEl.textContent = 'Final';
      alert(`Match complete! Final score: ${state.playerScore} - ${state.cpuScore}`);
    }
  }, 1000);

  state.shotMeter = 20;
  updateMeter();
}

function showShotTrajectory() {
  const x = 26 + Math.random() * 18;
  const y = 48 - Math.random() * 20;
  ballEl.style.left = `${x}%`;
  ballEl.style.bottom = `${y}%`;
  ballEl.style.transform = 'scale(1.2)';
  setTimeout(() => {
    ballEl.style.transform = 'scale(1)';
  }, 180);
}

function shoot() {
  if (!state.gameRunning) return;
  const player = state.selectedPlayer;
  const shotChance = Math.min(0.95, 0.45 + (player.shot / 180));
  const meterBoost = state.shotMeter / 100;
  const chance = Math.min(0.98, shotChance + meterBoost * 0.25);
  const made = Math.random() < chance;

  state.shotMeter += 14;
  updateMeter();
  showShotTrajectory();

  if (made) {
    const points = state.shotMeter > 80 ? 3 : 2;
    state.playerScore += points;
    state.money += points * 10;
    state.combo += 1;
    playerScoreEl.textContent = state.playerScore;
    playerMoneyEl.textContent = `$${state.money}`;
    gameStateEl.textContent = `Bucket +${points}`;
    updateRank();
  } else {
    state.combo = 0;
    gameStateEl.textContent = 'Missed shot';
  }

  setTimeout(() => {
    if (state.gameRunning) gameStateEl.textContent = 'Live';
  }, 700);

  cpuResponse();
}

function dribble() {
  if (!state.gameRunning) return;
  state.shotMeter = Math.min(100, state.shotMeter + 18);
  updateMeter();
  const player = state.selectedPlayer;
  const lift = player.speed * 0.12;
  playerMarkerEl.style.transform = `translateX(${lift}px) scale(1.08)`;
  setTimeout(() => {
    playerMarkerEl.style.transform = 'translateX(0) scale(1)';
  }, 180);
  gameStateEl.textContent = 'Dribble alive';
}

function defend() {
  if (!state.gameRunning) return;
  const player = state.selectedPlayer;
  const defenseBoost = player.defense / 80;
  state.shotMeter = Math.max(10, state.shotMeter - 10 * defenseBoost);
  updateMeter();
  gameStateEl.textContent = 'Lockdown defense';
}

function powerMove() {
  if (!state.gameRunning) return;
  const player = state.selectedPlayer;
  const totalStat = player.power + player.speed + player.shot;
  const made = Math.random() < Math.min(0.9, totalStat / 300);

  if (made) {
    state.playerScore += 3;
    state.money += 35;
    playerScoreEl.textContent = state.playerScore;
    playerMoneyEl.textContent = `$${state.money}`;
    gameStateEl.textContent = 'Power move slam!';
  } else {
    gameStateEl.textContent = 'Power move stuffed';
  }

  updateRank();
  cpuResponse();
}

function cpuResponse() {
  const cpuShotChance = 0.44 + Math.random() * 0.18;
  if (Math.random() < cpuShotChance) {
    state.cpuScore += Math.random() < 0.55 ? 2 : 3;
    cpuScoreEl.textContent = state.cpuScore;
    gameStateEl.textContent = 'CPU answers back';
  }
}

function upgradePlayer() {
  if (state.money < 50) {
    gameStateEl.textContent = 'Need $50';
    return;
  }

  const player = state.selectedPlayer;
  player.shot = Math.min(99, player.shot + 2);
  player.speed = Math.min(99, player.speed + 2);
  player.defense = Math.min(99, player.defense + 1);
  player.power = Math.min(99, player.power + 2);
  player.rating = Math.min(99, player.rating + 1);
  state.money -= 50;
  playerMoneyEl.textContent = `$${state.money}`;
  renderPlayerCard();
  updateRank();
  gameStateEl.textContent = 'Upgrade complete';
}

function bindControls() {
  document.getElementById('start-match').addEventListener('click', startMatch);
  document.getElementById('shoot-btn').addEventListener('click', shoot);
  document.getElementById('dribble-btn').addEventListener('click', dribble);
  document.getElementById('defend-btn').addEventListener('click', defend);
  document.getElementById('special-btn').addEventListener('click', powerMove);
  document.getElementById('upgrade-player').addEventListener('click', upgradePlayer);
}

function initialize() {
  renderRoster();
  renderPlayerCard();
  updateRank();
  updateMeter();
  playerMoneyEl.textContent = `$${state.money}`;
  playerScoreEl.textContent = state.playerScore;
  cpuScoreEl.textContent = state.cpuScore;
  timerEl.textContent = state.timer;
  bindControls();
}

initialize();

setInterval(() => {
  if (!state.gameRunning) {
    state.shotMeter = Math.min(100, state.shotMeter + 1);
    updateMeter();
  }
}, 180);

