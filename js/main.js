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
        "Or when we walked to the bus stop together",
        "Or when we've complained about our dogs😂",
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

function openLetter(type) {
    const messages = {
        happy: "Remember, I'm always here to celebrate with you💖🌚!",
        sad: "You're never alone. I'm just a call away! Sometimes!🥲... Why did you open the two👀?"
    };
    // Set the message text in the modal
    document.getElementById("modalMessage").textContent = messages[type];
    // Display the modal
    document.getElementById("openWhenModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("openWhenModal").style.display = "none";
}

// Close the modal when clicking outside the content
window.onclick = function(event) {
    const modal = document.getElementById("openWhenModal");
    if (event.target === modal) {
        closeModal();
    }
};




function createConfetti() {
    const numberOfConfetti = 50; // Number of confetti pieces
    const colors = ['#ff4081', '#32cd32', '#1e90ff']; // Colors for confetti

    for (let i = 0; i < numberOfConfetti; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 3}s`; // Random fall duration
        confetti.style.animationDelay = `${Math.random() * 5}s`; // Random delay to stagger the animation
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
    }
}

function randomizePositions() {
    const bubbles = document.querySelectorAll('.bubble');
    const balloons = document.querySelectorAll('.balloon');
    const confetti = document.querySelectorAll('.confetti');

    // Randomize bubbles position
    bubbles.forEach(bubble => {
        const randomX = Math.random() * window.innerWidth;
        bubble.style.left = `${randomX}px`;
        bubble.style.animationDelay = `${Math.random() * 3}s`;
    });

    // Randomize balloons position
    balloons.forEach(balloon => {
        const randomX = Math.random() * window.innerWidth;
        balloon.style.left = `${randomX}px`;
        balloon.style.animationDelay = `${Math.random() * 3}s`;
    });

    // Randomize confetti position
    confetti.forEach(piece => {
        const randomX = Math.random() * window.innerWidth;
        piece.style.left = `${randomX}px`;
        piece.style.animationDelay = `${Math.random() * 2}s`;
    });

    const music = document.getElementById("backgroundMusic");
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Music autoplayed successfully
                document.getElementById("musicPrompt").style.display = "none";
            })
            .catch(() => {
                // Autoplay was blocked, show the prompt
                document.getElementById("musicPrompt").style.display = "block";
            });
    }
}

window.onload = randomizePositions;
window.onload = function(){
    //Delay confetti creation by 2 seconds
    setTimeout(createConfetti, 2000);
    setTimeout(randomizePositions, 2000);

    document.getElementById("loadingSpinner").style.display = "none";

    // Call other functions
    initializeGallery();
    loadChats();
    loadQuiz();
    createConfetti();
    randomizePositions();
};

window.onresize = randomizePositions; // Re-randomize positions on window resize

window.onscroll = function() {
    const backToTop = document.getElementById("backToTop");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function playMusic() {
    const music = document.getElementById("backgroundMusic");
    music.play();
    document.getElementById("musicPrompt").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const music = document.getElementById("backgroundMusic");
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                document.getElementById("musicPrompt").style.display = "none";
            })
            .catch(() => {
                document.getElementById("musicPrompt").style.display = "block";
            });
    }
});

