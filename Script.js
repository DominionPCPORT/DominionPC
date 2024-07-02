// Define the game data

const cards = {
  treasure: {
    copper: {
      cost: 0,
      value: 1,
      type: "treasure",
      quantity: 60,
      description: "Worth 1 Coin",
    },
    silver: {
      cost: 3,
      value: 2,
      type: "treasure",
      quantity: 40,
      description: "Worth 2 Coins",
    },
    gold: {
      cost: 6,
      value: 3,
      type: "treasure",
      quantity: 30,
      description: "Worth 3 Coins",
    },
  },
  victory: {
    estate: {
      cost: 2,
      points: 1,
      type: "victory",
      quantity: 24,
      description: "Worth 1 Victory Point",
    },
    duchy: {
      cost: 5,
      points: 3,
      type: "victory",
      quantity: 12,
      description: "Worth 3 Victory Points",
    },
    province: {
      cost: 8,
      points: 6,
      type: "victory",
      quantity: 12,
      description: "Worth 6 Victory Points",
    },
  },
  action: {
    workshop: {
      cost: 3,
      type: "action",
      effect: "Gain a card costing up to 4 coins",
      description: "Gain a card costing up to 4 coins",
    },
    woodcutter: {
      cost: 3,
      type: "action",
      effect: "+1 Buy, +2 Coins",
      description: "+1 Buy, +2 Coins",
    },
    cellar: {
      cost: 2,
      type: "action",
      effect: "Discard any number of cards, +1 Card per card discarded",
      description: "Discard any number of cards, +1 Card per card discarded",
    },
    market: {
      cost: 5,
      type: "action",
      effect: "+1 Card, +1 Action, +1 Buy, +1 Coin",
      description: "+1 Card, +1 Action, +1 Buy, +1 Coin",
    },
    militia: {
      cost: 4,
      type: "action",
      effect: "Each other player discards down to 3 cards in hand",
      description: "Each other player discards down to 3 cards in hand",
    },
    mine: {
      cost: 5,
      type: "action",
      effect:
        "Trash a Treasure card from your hand. Gain a Treasure card costing up to 3 coins more; put it into your hand.",
      description:
        "Trash a Treasure card from your hand. Gain a Treasure card costing up to 3 coins more; put it into your hand.",
    },
    moat: {
      cost: 2,
      type: "action-reaction",
      effect:
        "Draw 2 cards. --- When another player plays an Attack card, you may reveal this from your hand. If you do, you are unaffected by that Attack.",
      description:
        "Draw 2 cards. --- When another player plays an Attack card, you may reveal this from your hand. If you do, you are unaffected by that Attack.",
    },
    remodel: {
      cost: 4,
      type: "action",
      effect:
        "Trash a card from your hand. Gain a card costing up to 2 coins more than the trashed card.",
      description:
        "Trash a card from your hand. Gain a card costing up to 2 coins more than the trashed card.",
    },
    smithy: {
      cost: 4,
      type: "action",
      effect: "+3 Cards",
      description: "+3 Cards",
    },
    village: {
      cost: 3,
      type: "action",
      effect: "+1 Card, +2 Actions",
      description: "+1 Card, +2 Actions",
    },
  },
};

// Initialize game state
const gameState = {
  deck: [
    "copper",
    "copper",
    "copper",
    "copper",
    "copper",
    "copper",
    "copper",
    "estate",
    "estate",
    "estate",
  ],
  hand: [],
  playArea: [],
  discardPile: [],
  supply: {
    treasure: {
      copper: 60,
      silver: 40,
      gold: 30,
    },
    victory: {
      estate: 24,
      duchy: 12,
      province: 12,
    },
    action: {
      workshop: 10,
      woodcutter: 10,
      cellar: 10,
      market: 10,
      militia: 10,
      mine: 10,
      moat: 10,
      remodel: 10,
      smithy: 10,
      village: 10,
    },
  },
  actions: 1,
  buys: 1,
  coins: 0,
  phase: "action", // Initialize phase to action phase
};

// Shuffle the deck
function shuffleDeck() {
  for (let i = gameState.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.deck[i], gameState.deck[j]] = [
      gameState.deck[j],
      gameState.deck[i],
    ];
  }
}


// Draw cards
function drawCards(num) {
  for (let i = 0; i < num; i++) {
    if (gameState.deck.length === 0) {
      gameState.deck = gameState.discardPile;
      gameState.discardPile = [];
      shuffleDeck();
    }
    gameState.hand.push(gameState.deck.pop());
  }
}

// Play a treasure card
function playTreasure(card) {
  if (gameState.hand.includes(card) && cards.treasure.hasOwnProperty(card)) {
    gameState.coins += cards.treasure[card].value;
    gameState.playArea.push(card);
    gameState.hand.splice(gameState.hand.indexOf(card), 1);
    renderGame();
  }
}
let moreExpensiveCards = [];

// Function to get card cost
function getCardCost(cardName) {
  for (const category in cards) {
    if (cards[category].hasOwnProperty(cardName)) {
      return cards[category][cardName].cost;
    }
  }
  return null; // If the card is not found, return null
}

// Function to find cards up to 2 coins more expensive
function findCardsUpTo2MoreExpensive(cardName) {
  const cardCost = getCardCost(cardName);
  if (cardCost === null) {
    console.log(`${cardName} not found.`);
    return [];
  }

  const result = [];
  for (const category in cards) {
    for (const card in cards[category]) {
      if (cards[category][card].cost <= cardCost + 2) {
        result.push(card);
      }
    }
  }
  return result;
}

// Play an action card
function playAction(card) {
  if (gameState.hand.includes(card) && cards.action.hasOwnProperty(card)) {
    gameState.actions--;
    gameState.playArea.push(card);
    gameState.hand.splice(gameState.hand.indexOf(card), 1);

    // Apply card effects
    switch (card) {
      case "workshop":
        // Implement Workshop effect
        getworkshopcards();
        let workshopInput = prompt("Choose a card to gain: " + workshopcards.join(", "));
        if (workshopcards.includes(workshopInput)) {
          gameState.discardPile.push(workshopInput);
          gameState.supply.action[workshopInput]--;
        }
        break;
      case "woodcutter":
        // Implement Woodcutter effect
        gameState.buys++;
        gameState.coins += 2;
        break;
      case "cellar":
        // Implement Cellar effect
        let cellarInput;
        do {
          cellarInput = prompt("Choose a card to discard. Type 'confirm' to finish or 'View Hand' to view your hand.");
          if (cellarInput === null || cellarInput.toLowerCase() === 'confirm') {
            break;
          } else if (cellarInput.toLowerCase() === 'view hand') {
            alert("Cards in Hand: " + gameState.hand.join(', '));
          } else if (gameState.hand.includes(cellarInput)) {
            discardCardByName(cellarInput);
            drawCards(1);
          } else {
            alert("Invalid input. Please choose a card from your hand.");
          }
        } while (true);
        break;
      case "market":
        // Implement Market effect
        drawCards(1);
        gameState.actions++;
        gameState.buys++;
        gameState.coins++;
        break;
      case "militia":
        // Implement Militia effect
        break;
      case "mine":
        // Implement Mine effect
        let mineInput = prompt("Choose a Treasure card to upgrade (copper/silver)");
        discardCardByName(mineInput);
        if (mineInput === 'copper') {
          gameState.hand.push('silver');
        } else if (mineInput === 'silver') {
          gameState.hand.push('gold');
        }
        break;
      case "moat":
        // Implement Moat effect
        break;
      case "remodel":
        // Implement Remodel effect
        let remodelInput = prompt("Choose a card to trash");
        if (gameState.hand.includes(remodelInput)) {
          moreExpensiveCards = findCardsUpTo2MoreExpensive(remodelInput);
          alert("These are your options: " + moreExpensiveCards.join(", "));
          let remodelChoice = prompt("Choose a card to gain: " + moreExpensiveCards.join(", "));
          if (moreExpensiveCards.includes(remodelChoice)) {
            discardCardByName(remodelInput);
            gameState.discardPile.push(remodelChoice);
          } else {
            alert("Invalid choice.");
          }
        }
        break;
      case "smithy":
        // Implement Smithy effect
        drawCards(3);
        break;
      case "village":
        // Implement Village effect
        drawCards(1);
        gameState.actions += 2;
        break;
      default:
        break;
    }

    renderGame();
  }
}

// Continue with your existing code...

function initializeGame() {
  shuffleDeck();
  drawCards(5);
  renderGame();
}

// Call the initializeGame function to start the game
initializeGame();

// Attach event listeners to the end phase button, etc.
// Your remaining code...


// Render game
function renderGame() {
  const container = document.getElementById("game-container");
  container.innerHTML = "";

  // Check if it's the end of the game
  if (gameState.phase === "end") {
    endGame();
    return;
  }

  // Render End Phase button
  const endPhaseButton = document.createElement("button");
  endPhaseButton.id = "end-phase-button";
  if (gameState.phase === "action") {
    endPhaseButton.textContent = "End Action Phase";
    endPhaseButton.addEventListener("click", endActionPhase);
  } else if (gameState.phase === "buy") {
    endPhaseButton.textContent = "End Buy Phase";
    endPhaseButton.addEventListener("click", endBuyPhase);
  } else if (gameState.phase === "cleanup") {
    endPhaseButton.textContent = "End Turn";
    endPhaseButton.addEventListener("click", endTurn);
  }
  container.appendChild(endPhaseButton);

  // Render hand
  const handDiv = document.createElement("div");
  handDiv.className = "hand";
  handDiv.innerHTML = "<h3>Hand</h3>";
  gameState.hand.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = `card ${
      cards.treasure.hasOwnProperty(card)
        ? "treasure-card"
        : cards.victory.hasOwnProperty(card)
        ? "victory-card"
        : "action-card"
    }`;
    cardDiv.innerHTML = `<strong>${card}</strong><br>${
      cards.treasure.hasOwnProperty(card)
        ? `Value: ${cards.treasure[card].value}`
        : ""
    }<br>${
      cards.victory.hasOwnProperty(card)
        ? `Points: ${cards.victory[card].points}`
        : ""
    }<br>${
      cards.action.hasOwnProperty(card) ? `${cards.action[card].effect}` : ""
    }`;
    if (cards.treasure.hasOwnProperty(card)) {
      cardDiv.onclick = () => playTreasure(card);
    } else if (
      cards.victory.hasOwnProperty(card) ||
      cards.action.hasOwnProperty(card)
    ) {
      cardDiv.onclick = () => playAction(card);
    }
    handDiv.appendChild(cardDiv);
  });
  container.appendChild(handDiv);

  // Render play area
  const playAreaDiv = document.createElement("div");
  playAreaDiv.className = "play-area";
  playAreaDiv.innerHTML = "<h3>Play Area</h3>";
  gameState.playArea.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = `card ${
      cards.treasure.hasOwnProperty(card)
        ? "treasure-card"
        : cards.victory.hasOwnProperty(card)
        ? "victory-card"
        : "action-card"
    }`;
    cardDiv.textContent = card;
    playAreaDiv.appendChild(cardDiv);
  });
  container.appendChild(playAreaDiv);

  // Render deck and discard pile
  const deckDiv = document.createElement("div");
  deckDiv.className = "deck";
  deckDiv.innerHTML = `<h3>Deck</h3><div class="card">Deck (${gameState.deck.length})</div>`;
  container.appendChild(deckDiv);

  const discardDiv = document.createElement("div");
  discardDiv.className = "deck";
  discardDiv.innerHTML = `<h3>Discard Pile</h3><div class="card">Discard (${gameState.discardPile.length})</div>`;
  container.appendChild(discardDiv);

  // Render supply
  const supplyDiv = document.createElement("div");
  supplyDiv.className = "supply";
  supplyDiv.innerHTML = "<h3>Supply</h3>";

  // Helper function to sort cards by cost
  function sortByCost(cards) {
    return Object.keys(cards).sort(
      (card1, card2) => cards[card1].cost - cards[card2].cost
    );
  }

  // Treasure cards
  const treasureDiv = document.createElement("div");
  treasureDiv.innerHTML = "<h4>Treasure</h4>";
  sortByCost(cards.treasure).forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card treasure-card";
    cardDiv.innerHTML = `<strong>${card}</strong><br>Cost: ${cards.treasure[card].cost}<br>${cards.treasure[card].description}<br>Remaining: ${gameState.supply.treasure[card]}`;
    cardDiv.onclick = () => buyCard(card);
    treasureDiv.appendChild(cardDiv);
  });
  supplyDiv.appendChild(treasureDiv);

  // Victory cards
  const victoryDiv = document.createElement("div");
  victoryDiv.innerHTML = "<h4>Victory</h4>";
  sortByCost(cards.victory).forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card victory-card";
    cardDiv.innerHTML = `<strong>${card}</strong><br>Cost: ${cards.victory[card].cost}<br>${cards.victory[card].description}<br>Remaining: ${gameState.supply.victory[card]}`;
    cardDiv.onclick = () => buyCard(card);
    victoryDiv.appendChild(cardDiv);
  });
  supplyDiv.appendChild(victoryDiv);

  // Action cards
  const actionDiv = document.createElement("div");
  actionDiv.innerHTML = "<h4>Action</h4>";
  sortByCost(cards.action).forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card action-card";
    cardDiv.innerHTML = `<strong>${card}</strong><br>Cost: ${cards.action[card].cost}<br>${cards.action[card].description}<br>Remaining: ${gameState.supply.action[card]}`;
    cardDiv.onclick = () => buyCard(card);
    actionDiv.appendChild(cardDiv);
  });
  supplyDiv.appendChild(actionDiv);

  container.appendChild(supplyDiv);

  // Render actions, buys, and coins
  const statusDiv = document.createElement("div");
  statusDiv.className = "status";
  statusDiv.innerHTML = `<p>Phase: ${gameState.phase}</p>
                           <p>Actions: ${gameState.actions}</p>
                           <p>Buys: ${gameState.buys}</p>
                           <p>Coins: ${gameState.coins}</p>`;
  container.appendChild(statusDiv);

  // Disable buy buttons during action phase
  const buyButtons = document.querySelectorAll(".card");
  buyButtons.forEach((button) => {
    button.disabled = gameState.phase === "action";
  });
}
// Buy a card
function buyCard(card) {
  if (gameState.phase === "buy") {
    let cardType = "";
    if (cards.treasure.hasOwnProperty(card)) {
      cardType = "treasure";
    } else if (cards.victory.hasOwnProperty(card)) {
      cardType = "victory";
    } else if (cards.action.hasOwnProperty(card)) {
      cardType = "action";
    }

    // Calculate the effective cost
    let effectiveCost = cards[cardType][card].cost;

    if (
      gameState.buys > 0 &&
      gameState.coins >= effectiveCost &&
      gameState.supply[cardType][card] > 0
    ) {
      gameState.coins -= effectiveCost;
      gameState.supply[cardType][card]--;
      gameState.discardPile.push(card); // Add the bought card directly to the discard pile

      gameState.buys--;

      // Check if treasure or victory card count meets end game condition
      if (checkEndGameCondition()) {
        gameState.phase = "end"; // Set phase to end if conditions are met
        renderGame(); // Update the GUI to show the final score
        return;
      }

      renderGame(); // Update the GUI after state changes
    }
  }
}

// Check end game conditions
function checkEndGameCondition() {
  const totalTreasures = countCards("treasure");
  const totalVictories = countCards("victory");

  return totalTreasures >= 130 || totalVictories >= 48;
}

// Count cards in deck, hand, and discard pile
function countCards(type) {
  let count = 0;
  Object.keys(cards[type]).forEach((card) => {
    count += gameState.deck.filter((c) => c === card).length;
    count += gameState.hand.filter((c) => c === card).length;
    count += gameState.discardPile.filter((c) => c === card).length;
  });
  return count;
}

// End the action phase
function endActionPhase() {
  gameState.phase = "buy"; // Switch to buy phase
  renderGame();
}

// End the buy phase
function endBuyPhase() {
  if (gameState.phase === "buy") {
    gameState.phase = "cleanup"; // Switch to cleanup phase

    // Shuffle the hand only if transitioning from 'buy' to 'cleanup' phase
    shuffleHand();

    // Move cards from play area to discard pile
    gameState.discardPile.push(...gameState.playArea);
    gameState.playArea = [];

    renderGame();
  } else {
    gameState.phase = "action"; // Switch back to action phase if not in 'buy' phase
    renderGame();
  }
}

// Function to shuffle the hand
function shuffleHand() {
  for (let i = gameState.hand.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.hand[i], gameState.hand[j]] = [
      gameState.hand[j],
      gameState.hand[i],
    ];
  }
}

// Function to shuffle the hand
function shuffleHand() {
  for (let i = gameState.hand.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.hand[i], gameState.hand[j]] = [
      gameState.hand[j],
      gameState.hand[i],
    ];
  }
}

// End the turn (cleanup phase)
function endTurn() {
  gameState.phase = "action"; // Reset phase to action for next turn
  gameState.actions = 1; // Reset actions for next turn
  gameState.buys = 1; // Reset buys for next turn
  gameState.coins = 0; // Reset coins for next turn
  gameState.discardPile.push(...gameState.hand); // Discard remaining hand cards
  gameState.hand = []; // Clear hand for next turn
  initializeGame(); // Initialize next turn
}

// Start the game
initializeGame();

// Attach event listener to the end turn button
document.getElementById("end-phase-button").addEventListener("click", () => {
  if (gameState.phase === "action") {
    endActionPhase();
  } else if (gameState.phase === "buy") {
    endBuyPhase();
  } else if (gameState.phase === "cleanup") {
    endTurn();
  }
});
// End the game
function endGame() {
  // Calculate final score
  let finalScore = 0;

  // Add up victory points from remaining cards
  ["estate", "duchy", "province"].forEach((card) => {
    finalScore +=
      gameState.discardPile.filter((c) => c === card).length *
      cards.victory[card].points;
    finalScore +=
      gameState.deck.filter((c) => c === card).length *
      cards.victory[card].points;
    finalScore +=
      gameState.hand.filter((c) => c === card).length *
      cards.victory[card].points;
  });

  // Display final score
  const container = document.getElementById("game-container");
  container.innerHTML = "";
  const scoreDiv = document.createElement("div");
  scoreDiv.innerHTML = `<h2>Game Over</h2><p>Final Score: ${finalScore}</p>`;
  container.appendChild(scoreDiv);
}
// Function to give infinite buys and infinite coins
function debug() {
  gameState.buys = Infinity;
  gameState.coins = Infinity;
  gameState.actions = Infinity;
  gameState.phase = "buy";
}
function give(cardName) {
  if (
    cards.treasure.hasOwnProperty(cardName) ||
    cards.victory.hasOwnProperty(cardName) ||
    cards.action.hasOwnProperty(cardName)
  ) {
    gameState.hand.push(cardName);
    renderGame();
  } else {
    console.log("Invalid card name.");
  }
}
function revealDeck() {
  console.log("Deck:", gameState.deck);
  alert("Deck: " + gameState.deck.join(", "));
}
// Define workshopcards outside the function
let workshopcards = [];

function getworkshopcards() {
  // Clear workshopcards array before populating it
  workshopcards = [];

  for (let category in cards) {
    for (let card in cards[category]) {
      if (cards[category][card].cost <= 4) {
        workshopcards.push(card);
      }
    }
  }
  console.log("Affordable cards (cost 4 or less):", workshopcards);
  alert("Affordable cards (cost 4 or less): " + workshopcards.join(", "));
}

function discardCardByName(cardName) {
  const index = gameState.hand.indexOf(cardName);
  if (index !== -1) {
    gameState.discardPile.push(gameState.hand.splice(index, 1)[0]);
    console.log(`Discarded ${cardName}`);
    renderGame();
  } else {
    console.log(`${cardName} not found in hand.`);
  }
}
