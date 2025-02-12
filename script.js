/******************************************************
 * VARIÁVEIS GLOBAIS E ESTADO
 ******************************************************/
let deck = [];
let playerHand = [];
let groups = { group1: [], group2: [], group3: [], group4: [] };
let discardPile = [];
let cardIdCounter = 0;
let gameStarted = false;

/******************************************************
 * CRIA E EMBARALHA O BARALHO
 ******************************************************/
function createDeck() {
  const colors = ["red", "blue", "green", "yellow"];
  const numbers = [1,2,3,4,5,6,7,8,9];
  let newDeck = [];
  for (let color of colors) {
    for (let num of numbers) {
      newDeck.push({ id: cardIdCounter++, color: color, value: num });
      newDeck.push({ id: cardIdCounter++, color: color, value: num });
    }
  }
  return newDeck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/******************************************************
 * INICIAR / REINICIAR JOGO
 ******************************************************/
function startGame() {
  deck = shuffle(createDeck());
  playerHand = [];
  groups = { group1: [], group2: [], group3: [], group4: [] };
  discardPile = [];
  gameStarted = true;
  // 11 cartas iniciais
  for (let i = 0; i < 11; i++) {
    playerHand.push(deck.pop());
  }
  document.getElementById("message").textContent = "Jogo iniciado!";
  renderAll();
}

function resetGameState() {
  deck = [];
  playerHand = [];
  groups = { group1: [], group2: [], group3: [], group4: [] };
  discardPile = [];
  cardIdCounter = 0;
  gameStarted = false;
  document.getElementById("message").textContent =
    "Jogo reiniciado. Clique em 'Iniciar Jogo' para jogar novamente.";
  // Limpa as áreas
  document.getElementById("playerHand").innerHTML = "";
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach(zone => {
    let header = zone.querySelector("h3");
    zone.innerHTML = header ? header.outerHTML : "";
  });
  document.getElementById("discardCards").innerHTML = "";
  updateHandCountMessage();
}

/******************************************************
 * COMPRAR CARTA
 ******************************************************/
function drawCard() {
  if (!gameStarted) {
    alert("Inicie o jogo primeiro!");
    return;
  }
  if (deck.length === 0) {
    alert("O baralho acabou!");
    return;
  }
  
  // DESTACA: Bloqueio de compra se não tiver 11 cartas (mão + grupos)
  let total = getTotalCards();
  if (total !== 11) {
    alert("Você só pode comprar se estiver na fase de compra (total de 11 cartas).");
    return;
  }

  // Agora podemos comprar
  playerHand.push(deck.pop());
  renderAll();
}

/******************************************************
 * RENDERIZAÇÕES
 ******************************************************/
function renderAll() {
  renderHand();
  renderGroups();
  renderDiscardPile();
  updateHandCountMessage();
}

function renderHand() {
  const handDiv = document.getElementById("playerHand");
  handDiv.innerHTML = "";
  playerHand.forEach(card => {
    const cardEl = createCardElement(card, "hand");
    handDiv.appendChild(cardEl);
  });
}

function renderGroups() {
  for (let groupId in groups) {
    const groupDiv = document.getElementById(groupId);
    groupDiv.innerHTML = "";
    let header = document.createElement("h3");
    header.textContent =
      groupId === "group4"
        ? "Grupo 4 (2 cartas)"
        : groupId.charAt(0).toUpperCase() + groupId.slice(1) + " (3 cartas)";
    groupDiv.appendChild(header);

    groups[groupId].forEach(card => {
      const cardEl = createCardElement(card, groupId);
      groupDiv.appendChild(cardEl);
    });
  }
}

function renderDiscardPile() {
  const discardContainer = document.getElementById("discardCards");
  discardContainer.innerHTML = "";
  discardPile.forEach(card => {
    const cardEl = createCardElement(card, "discardPile");
    discardContainer.appendChild(cardEl);
  });
}

function createCardElement(card, source) {
  const cardEl = document.createElement("div");
  cardEl.classList.add("card", card.color);
  cardEl.textContent = card.value;
  cardEl.setAttribute("draggable", "true");
  cardEl.setAttribute("data-card-id", card.id);
  cardEl.dataset.source = source;
  cardEl.addEventListener("dragstart", dragStart);
  return cardEl;
}

/******************************************************
 * CONTAGEM DE CARTAS
 ******************************************************/
function updateHandCountMessage() {
  let total = getTotalCards();
  let handInfoEl = document.getElementById("handInfo");
  handInfoEl.textContent = `Total de cartas (mão + grupos): ${total}. (11 na fase de compra; 12 antes do descarte)`;
}

// Função auxiliar para saber o total de cartas do jogador (mão + grupos)
function getTotalCards() {
  let groupCount = groups.group1.length + groups.group2.length + groups.group3.length + groups.group4.length;
  return playerHand.length + groupCount;
}

/******************************************************
 * DRAG & DROP
 ******************************************************/
function dragStart(event) {
  const cardId = event.target.getAttribute("data-card-id");
  const source = event.target.dataset.source;
  event.dataTransfer.setData("text/plain", JSON.stringify({ cardId, source }));
}

function dragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("over");
}

function dragLeave(event) {
  event.currentTarget.classList.remove("over");
}

function drop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("over");
  const data = JSON.parse(event.dataTransfer.getData("text/plain"));
  const targetId = event.currentTarget.id; 
  moveCard(data.cardId, data.source, targetId);
}

function moveCard(cardId, from, to) {
  cardId = parseInt(cardId);

  // 1) Se o destino for descarte, checa total ANTES de remover a carta
  if (to === "discardPile" || to === "discardCards") {
    let totalBefore = getTotalCards(); // total atual (antes de remover)
    if (totalBefore !== 12) {
      alert("Você só pode descartar se estiver na fase de descarte (total de 12 cartas).");
      return; // sai daqui, não remove a carta
    }
  }

  // 2) Agora sim, remove do local de origem
  let card;
  if (from === "hand") {
    const idx = playerHand.findIndex(c => c.id === cardId);
    if (idx === -1) return;
    card = playerHand.splice(idx, 1)[0];
  } else if (from === "discardPile") {
    const idx = discardPile.findIndex(c => c.id === cardId);
    if (idx === -1) return;
    card = discardPile.splice(idx, 1)[0];
  } else {
    // Está em um dos grupos
    if (groups[from]) {
      const idx = groups[from].findIndex(c => c.id === cardId);
      if (idx === -1) return;
      card = groups[from].splice(idx, 1)[0];
    }
  }

  // 3) Destino: se for descarte, agora adiciona sem problemas
  if (to === "discardPile" || to === "discardCards") {
    discardPile.push(card);
  } else if (to === "playerHand") {
    playerHand.push(card);
  } else if (groups[to]) {
    const dropZone = document.getElementById(to);
    const max = parseInt(dropZone.dataset.max);
    if (groups[to].length >= max) {
      alert("Esse grupo já está completo.");
      restoreCardToSource(card, from);
      renderAll();
      return;
    }
    groups[to].push(card);
  } else {
    // Se cair aqui, não reconheceu o destino
    restoreCardToSource(card, from);
  }

  renderAll();
}


function restoreCardToSource(card, from) {
  if (from === "hand") {
    playerHand.push(card);
  } else if (from === "discardPile") {
    discardPile.push(card);
  } else if (groups[from]) {
    groups[from].push(card);
  }
}

/******************************************************
 * VERIFICAR BATIDA (3x3x3 + 2)
 * 1 e 9 não podem participar de sets
 ******************************************************/
function checkWin() {
  if (
    groups.group1.length !== 3 ||
    groups.group2.length !== 3 ||
    groups.group3.length !== 3 ||
    groups.group4.length !== 2
  ) {
    document.getElementById("message").textContent =
      "Você não tem a configuração 3x3x3 + 2.";
    return;
  }
  
  let g1 = groups.group1;
  let g2 = groups.group2;
  let g3 = groups.group3;
  let g4 = groups.group4;
  
  // Se qualquer grupo tiver carta 1 ou 9, é inválido
  if (contains19(g1) || contains19(g2) || contains19(g3) || contains19(g4)) {
    document.getElementById("message").textContent =
      "Você incluiu carta(s) 1 ou 9 em seus grupos. Elas não podem bater.";
    return;
  }
  
  // Verifica se g1, g2, g3 são "run" ou "group"
  // e se g4 é par ou mini-sequência
  if (
    (isValidRun(g1) || isValidGroup(g1)) &&
    (isValidRun(g2) || isValidGroup(g2)) &&
    (isValidRun(g3) || isValidGroup(g3)) &&
    isValidPair(g4)
  ) {
    document.getElementById("message").textContent = "Parabéns! Você bateu!";
  } else {
    document.getElementById("message").textContent =
      "Não é uma combinação válida para bater.";
  }
}

function contains19(cards) {
  return cards.some(c => c.value === 1 || c.value === 9);
}

function isValidRun(cards) {
  if (cards.length !== 3) return false;
  const color = cards[0].color;
  if (!cards.every(c => c.color === color)) return false;
  const sorted = [...cards].sort((a,b) => a.value - b.value);
  return (
    sorted[1].value === sorted[0].value + 1 &&
    sorted[2].value === sorted[1].value + 1
  );
}

function isValidGroup(cards) {
  if (cards.length !== 3) return false;
  const value = cards[0].value;
  if (!cards.every(c => c.value === value)) return false;
  const colorSet = new Set(cards.map(c => c.color));
  return colorSet.size === 3;
}

function isValidPair(cards) {
  if (cards.length !== 2) return false;
  if (cards[0].value === cards[1].value) return true;
  if (cards[0].color === cards[1].color) {
    let diff = Math.abs(cards[0].value - cards[1].value);
    if (diff === 1) return true;
  }
  return false;
}

/******************************************************
 * CONFIGURA EVENTOS APÓS O CARREGAMENTO
 ******************************************************/
window.addEventListener("load", function(){
  // Configura eventos de drop em todos os .dropzone
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach(zone => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("dragleave", dragLeave);
    zone.addEventListener("drop", drop);
  });

  // Botões
  document.getElementById("btnStart").addEventListener("click", startGame);
  document.getElementById("btnRestart").addEventListener("click", resetGameState);
  document.getElementById("btnDraw").addEventListener("click", drawCard);
  document.getElementById("btnCheckWin").addEventListener("click", checkWin);
});
