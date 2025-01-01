document.addEventListener("DOMContentLoaded", () => {
    const cardData = [
        { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
        { word: "Avocado", img: "Avocado (ah-vuh-CAH-doh).jpeg" },
        { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
        { word: "Blackberry", img: "Blackberry (bl-ack-ber-ree).jpeg" },
        { word: "Blueberry", img: "Blueberry.jpeg" },
        { word: "Blueberry", img: "Blueberry.jpeg" },
        { word: "Cherry", img: "Cherry.jpeg" },
        { word: "Cherry", img: "Cherry.jpeg" }
    ];

    // Shuffle function (Fisher-Yates Shuffle)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledCards = shuffle([...cardData]);
    const gameBoard = document.querySelector(".game-board");

    // Render cards dynamically
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-word", `${card.word}-${index}`); // Unique attribute for duplicates
        cardElement.innerHTML = `
            <div class="front">?</div>
            <div class="back">
                <img src="${card.img}" alt="${card.word}">
                <span>${card.word}</span>
            </div>
        `;
        gameBoard.appendChild(cardElement);
    });

    // Prepare AudioContext for iOS Safari
    document.addEventListener("click", () => {
        if (typeof window.AudioContext !== "undefined") {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === "suspended") {
                audioContext.resume().then(() => console.log("AudioContext resumed"));
            }
        }
    });

    // Game Logic
    const cards = document.querySelectorAll(".card");
    let flippedCard = null;
    let lockBoard = false;

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (lockBoard || card.classList.contains("flipped")) return;

            card.classList.add("flipped");
            speakWord(card.dataset.word.split('-')[0]); // Use only the word part for speech

            if (!flippedCard) {
                flippedCard = card;
                return;
            }

            // Match check
            if (flippedCard.dataset.word.split('-')[0] === card.dataset.word.split('-')[0]) {
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

    // Function to speak the word with added debug logs
    function speakWord(word) {
        if (!window.speechSynthesis) {
            console.error("SpeechSynthesis not supported in this browser.");
            return;
        }

        const speech = new SpeechSynthesisUtterance(word);
        speech.rate = 1; // Normal speed
        speech.pitch = 1; // Normal pitch
        speech.onstart = () => console.log(`Speaking: ${word}`);
        speech.onend = () => console.log("Speech finished.");
        speech.onerror = (e) => console.error("Speech error:", e);
        
        // Slight delay for iOS reliability
        setTimeout(() => speechSynthesis.speak(speech), 100);
    }
});