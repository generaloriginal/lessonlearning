// script.js
document.addEventListener("DOMContentLoaded", () => {
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
  
    function speakWord(word) {
      const speech = new SpeechSynthesisUtterance(word);
      speechSynthesis.speak(speech);
    }
  });