document.addEventListener("DOMContentLoaded", async () => {
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

    // Function to fetch file names from the server
    async function fetchFileNames() {
        // This assumes you have a backend serving the folder's file names (e.g., using a static server or an API).
        // Replace the URL below with the actual endpoint that lists the files in your folder.
        const response = await fetch("file-list.json");
        if (!response.ok) {
            console.error("Failed to fetch file list");
            return [];
        }
        const files = await response.json();
        return files.filter(file => file.endsWith(".jpeg"));
    }

    // Fetch file names dynamically
    const jpegFiles = await fetchFileNames();
    const cardData = jpegFiles.map(file => {
        const word = file.replace(".jpeg", "").replace(/[_-]/g, " "); // Remove extension and replace underscores/dashes with spaces
        return { word, img: file };
    });

    // Shuffle and render cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledCards = shuffle([...cardData, ...cardData]); // Duplicate cards for pairs
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

    function speakWord(word) {
        if (!window.speechSynthesis) {
            console.error("SpeechSynthesis not supported in this browser.");
            return;
        }

        const speech = new SpeechSynthesisUtterance(word);
        speech.rate = 1; // Normal speed
        speech.pitch = 1; // Normal pitch
        speechSynthesis.speak(speech);
    }
});