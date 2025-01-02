document.addEventListener("DOMContentLoaded", () => {
    let audioEnabled = false;

    // Add a prompt to enable audio on iOS
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

    // JSON list of .jpeg files
    const jpegFiles = [
        "Avocado.jpeg",
        "Açaí berry.jpeg",
        "Banana.jpeg",
        "Blackberry.jpeg",
        "Cacau - cocoa.jpeg",
        "Coconut.jpeg",
        "Cupuaçu.jpeg",
        "Fig.jpeg",
        "Gooseberry - groselha.jpeg",
        "Guava - goiaba.jpeg",
        "Jackfruit - jaca.jpeg",
        "Kiwi.jpeg",
        "Lemon.jpeg",
        "Lime.jpeg",
        "Lychee - lichia.jpeg",
        "Orange.jpeg",
        "Peach.jpeg",
        "Pineapple.jpeg",
        "Plum.jpeg",
        "Plum 2.jpeg",
        "Prunes.jpeg",
        "Raspberry.jpeg",
        "Soursop - graviola.jpeg",
        "Tomato.jpeg"
    ];

    // Randomly select 6 unique fruits for 12 tiles
    function selectRandomFruits(files, count = 6) {
        const shuffled = files.sort(() => 0.5 - Math.random()); // Shuffle files randomly
        const selected = shuffled.slice(0, count); // Pick the first `count` items
        console.log("Selected fruits:", selected); // Debug log
        return selected;
    }

    const selectedFruits = selectRandomFruits(jpegFiles);
    const cardData = selectedFruits.map(file => {
        const word = file.replace(".jpeg", "").replace(/[_-]/g, " ").trim();
        return { word, img: file };
    });
    console.log("Card data before duplication:", cardData); // Debug log

    const shuffledCards = shuffle([...cardData, ...cardData]); // Duplicate cards for matching pairs
    console.log("Shuffled cards:", shuffledCards); // Debug log

    const gameBoard = document.querySelector(".game-board");

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-word", `${card.word}-${index}`);
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

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (lockBoard || card.classList.contains("flipped") || !audioEnabled) return;

            card.classList.add("flipped");
            speakWord(card.dataset.word.split('-')[0]);

            if (!flippedCard) {
                flippedCard = card;
                return;
            }

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

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function speakWord(word) {
        if (!window.speechSynthesis) {
            console.error("SpeechSynthesis not supported in this browser.");
            return;
        }

        const speech = new SpeechSynthesisUtterance(word);
        speech.rate = 1;
        speech.pitch = 1;
        speechSynthesis.speak(speech);
    }
});