document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  const cardData = [
      { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
      { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
      { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
      { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
  ];

  function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  const shuffledCards = shuffle([...cardData]);
  const gameBoard = document.querySelector(".game-board");

  if (!gameBoard) {
      console.error("Game board not found!");
      return;
  }

  shuffledCards.forEach((card) => {
      console.log("Rendering card:", card);
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-word", card.word);
      cardElement.innerHTML = `
          <div class="front">?</div>
          <div class="back">
              <img src="${card.img}" alt="${card.word}">
              <span>${card.word}</span>
          </div>
      `;
      gameBoard.appendChild(cardElement);
  });

  console.log("Cards rendered:", gameBoard.innerHTML);
});