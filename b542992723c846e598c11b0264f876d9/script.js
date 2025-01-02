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

    // Updated list of fruits
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
        const selected = shuffled.slice(0, count);
        console.log("Selected fruits:", selected); // Debug log
        return selected;
    }

    const selectedFruits = selectRandomFruits(jpegFiles);
    const cardData = selectedFruits.map(file => {
        const word = file.replace(".jpeg", "").replace(/[_-]/g, " ").trim();
        return { word, img: file };
    });
    console.log("Card data before duplication:", cardData); // Debug log

    const shuffledCards = shuffle([...cardData, ...cardData]);
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