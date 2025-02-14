document.addEventListener("DOMContentLoaded", () => {
    let audioEnabled = false;

    const enableAudioButton = document.createElement("button");
    enableAudioButton.innerText = "Enable Audio";
    enableAudioButton.style.position = "absolute";
    enableAudioButton.style.top = "10px";
    enableAudioButton.style.left = "50%";
    enableAudioButton.style.transform = "translateX(-50%)";
    enableAudioButton.style.padding = "10px 20px";
    enableAudioButton.style.backgroundColor = "#4CAF50";
    enableAudioButton.style.color = "white";
    enableAudioButton.style.border = "none";
    enableAudioButton.style.borderRadius = "5px";
    enableAudioButton.style.cursor = "pointer";

    document.body.appendChild(enableAudioButton);

    enableAudioButton.addEventListener("click", () => {
        audioEnabled = true;
        document.body.removeChild(enableAudioButton);
        console.log("Audio enabled!");
    });

    const jpegFiles = [
        "Peach.jpeg",
        "Orange.jpeg",
        "Lychee.jpeg",
        "Lime.jpeg",
        "Lemon.jpeg",
        "Jackfruit.jpeg",
        "Guava.jpeg",
        "Gooseberry.jpeg",
        "Fig.jpeg",
        "Coconut.jpeg",
        "Cupuaçu.jpeg",
        "Acai berry.jpeg",
        "Avocado.jpeg",
        "Banana.jpeg",
        "Blackberry.jpeg",
        "Cacau.jpeg"
    ];

    function selectRandomFruits(files, count = 6) {
        const shuffled = files.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    const selectedFruits = selectRandomFruits(jpegFiles);
    const cardData = selectedFruits.map(file => ({
        word: file.replace(".jpeg", "").replace(/[_-]/g, " ").trim(),
        img: file
    }));

    const shuffledCards = shuffle([...cardData, ...cardData]);
    const gameBoard = document.querySelector(".game-board");

    shuffledCards.forEach((card, index) => {
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

    const cards = document.querySelectorAll(".card");
    let flippedCard = null;
    let lockBoard = false;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched") || !audioEnabled) return;

            card.classList.add("flipped");
            speakWord(card.dataset.word);

            if (!flippedCard) {
                flippedCard = card;
                return;
            }

            if (flippedCard.dataset.word === card.dataset.word) {
                // Match found, keep cards flipped
                flippedCard.classList.add("matched");
                card.classList.add("matched");

                // Say "Match!" when a pair is found
                speakWord("Match!");
                flippedCard = null; // Reset for the next match
            } else {
                // No match, flip back after a short delay
                lockBoard = true;
                setTimeout(() => {
                    flippedCard.classList.remove("flipped");
                    card.classList.remove("flipped");
                    flippedCard = null;
                    lockBoard = false;
                }, 1000);
            }
        });
    });

    function speakWord(word) {
        if (!window.speechSynthesis) {
            console.error("SpeechSynthesis not supported in this browser.");
            return;
        }

        if (!audioEnabled) {
            console.warn("Audio is not enabled yet.");
            return;
        }

        console.log(`Attempting to speak: ${word}`);
        const speech = new SpeechSynthesisUtterance(word);
        speech.rate = 1; // Normal speed
        speech.pitch = 1; // Normal pitch
        window.speechSynthesis.speak(speech);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});