let currentImageIndex = 0;

function showNextImage() {
    const images = document.querySelectorAll(".gallery-slider img");
    images[currentImageIndex].style.display = "none"; // Hide current image
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].style.display = "block"; // Show next image
}

// Initialize by showing the first image and hiding the rest
function initializeGallery() {
    const images = document.querySelectorAll(".gallery-slider img");
    images.forEach((img, index) => {
        img.style.display = index === 0 ? "block" : "none";
    });
    setInterval(showNextImage, 3000); // Change image every 3 seconds
}

initializeGallery();

const messageBoard = document.getElementById("message-board");

function addMessage() {
    const newMessage = document.getElementById("newMessage").value;
    if (newMessage.trim() !== "") {
        const messageElement = document.createElement("p");
        messageElement.textContent = newMessage;
        messageBoard.appendChild(messageElement);
        document.getElementById("newMessage").value = ""; // Clear textarea
    }
}

const chatTimeline = document.getElementById("chat-timeline");

function loadChats() {
    const chats = [
        "Remember when we fought and Sandra had to separate us🌚?",
        "Or when we walked to the bus stop together with Priscilla",
        "Or when we complained about our dogs😂",
        "And many more, you've made such a big difference in my life."
    ];

    chats.forEach(chat => {
        const chatElement = document.createElement("p");
        chatElement.textContent = chat;
        chatTimeline.appendChild(chatElement);
    });
}

loadChats();

const quizContainer = document.getElementById("quiz");

function loadQuiz() {
    const questions = [
        { question: "Tea or Coffee?", optionA: "Tea", optionB: "Coffee" },
        { question: "Mountains or Beach?", optionA: "Mountains", optionB: "Beach" }
    ];

    questions.forEach(q => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `<p>${q.question}</p>
            <button onclick="chooseOption('${q.optionA}')">${q.optionA}</button>
            <button onclick="chooseOption('${q.optionB}')">${q.optionB}</button>`;
        quizContainer.appendChild(questionElement);
    });
}

function chooseOption(option) {
    alert(`You chose: ${option}`);
}

loadQuiz();

function loadMap() {
    const map = document.getElementById("map");
    const locations = ["Our favorite coffee shop", "The beach we visited", "Concert venue"];

    locations.forEach(location => {
        const locationElement = document.createElement("p");
        locationElement.textContent = location;
        map.appendChild(locationElement);
    });
}

loadMap();

function openLetter(type) {
    const messages = {
        happy: "Open this when you're happy: Remember, I'm always here to celebrate with you!",
        sad: "Open this when you're sad: You're never alone. I'm just a call away!"
    };
    alert(messages[type]);
}

function loadPlaylist() {
    const playlist = document.getElementById("playlist");
    const songs = [
        { title: "Song 1 - Artist", url: "https://example.com/song1" },
        { title: "Song 2 - Artist", url: "https://example.com/song2" }
    ];

    songs.forEach(song => {
        const songElement = document.createElement("a");
        songElement.href = song.url;
        songElement.textContent = song.title;
        songElement.target = "_blank";
        playlist.appendChild(songElement);
    });
}

loadPlaylist();
