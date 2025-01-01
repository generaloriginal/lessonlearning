document.addEventListener("DOMContentLoaded", () => {
  const cardData = [
      { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
      { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
      { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
      { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
      // Add more card pairs here
  ];

  // Shuffle function (Fisher-Yates Shuffle Algorithm)
  function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  // Dynamically render shuffled cards
  const shuffledCards = shuffle([...cardData]);
  const gameBoard = document.querySelector(".game-board");

  shuffledCards.forEach(card => {
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

  // Game logic
  const cards = document.querySelectorAll(".card");
  let flippedCard = null;
  let lockBoard = false;

  cards.forEach(card => {
      card.addEventListener("click", () => {
          if (lockBoard || card.classList.contains("flipped")) return;

          card.classList.add("flipped");
          speakWord(card.dataset.word);

          if (!flippedCard) {
              flippedCard = card;
              return;
          }

          // Match check
          if (flippedCard.dataset.word === card.dataset.word) {
              flippedCard = null;
          } else {
              lockBoard = true;
              setTimeout(() => {
                  card.classList.remove("flipped");
                  flippedCard.classList.remove("flipped");
                  flippedCard = null;
                  lockBoard = false;
              }, 1000);
          }
      });
  });

  // Function to speak the word on the card
  function speakWord(word) {
      const speech = new SpeechSynthesisUtterance(word);
      speechSynthesis.speak(speech);
  }
});