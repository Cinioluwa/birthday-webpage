// LOCKSCREEN FUNCTIONALITY
window.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('lockscreen-overlay');
    const input = document.getElementById('lockscreen-password');
    const error = document.getElementById('lockscreen-error');
    let lockscreenActive = true;

    // *** MODIFIED: This function is now smarter. ***
    // It allows events inside the lockscreen but blocks them outside.
    function blockIfLocked(e) {
        if (lockscreenActive) {
            // Unconditionally block the mouse wheel to prevent background scrolling.
            if (e.type === 'wheel') {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }

            // For mouse and touch events, check if they happened outside the overlay.
            if (overlay && !overlay.contains(e.target)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            // If the event is inside the overlay, we do nothing and let it pass through.
        }
    }
    // Block scroll, key, and mouse events
    window.addEventListener('wheel', blockIfLocked, { passive: false });
    document.addEventListener('mousedown', blockIfLocked, true);
    document.addEventListener('touchstart', blockIfLocked, { passive: false });

    // Add shake and eye pop CSS if not present
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
            100% { transform: translateX(0); }
        }
        .shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .eye-emoji-pop {
            position: fixed;
            font-size: 3.5rem;
            z-index: 9999;
            pointer-events: none;
            transition: transform 0.3s;
            filter: drop-shadow(0 2px 6px #0008);
        }
        .eye-emoji-big {
            font-size: 6rem;
            filter: drop-shadow(0 4px 12px #000a);
        }
        @keyframes fall-eye {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
        `;
        document.head.appendChild(style);
    }

    // Eye emoji pop logic
    function getInputBoxCenter() {
        const rect = input.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function angleToInput(x, y) {
        const center = getInputBoxCenter();
        const dx = center.x - x;
        const dy = center.y - y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    function popEyeEmoji({big = false, random = false, duration = 900} = {}) {
        const emoji = document.createElement('div');
        emoji.className = 'eye-emoji-pop' + (big ? ' eye-emoji-big' : '');
        emoji.textContent = '👀';
        let x, y, angle;
        if (!random) {
            // Place around the input box, at random angle/distance
            const center = getInputBoxCenter();
            const radius = big ? 80 : (100 + Math.random() * 80);
            const theta = Math.random() * 2 * Math.PI;
            x = center.x + Math.cos(theta) * radius;
            y = center.y + Math.sin(theta) * radius;
            angle = angleToInput(x, y) + (Math.random() - 0.5) * 30; // add some randomness
        } else {
            // Random position at top, will fall
            x = Math.random() * window.innerWidth * 0.9 + 20;
            y = -60;
            angle = Math.random() * 360;
            emoji.style.animation = `fall-eye ${1.2 + Math.random()}s linear forwards`;
        }
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;
        emoji.style.transform = `rotate(${angle}deg)`;
        document.body.appendChild(emoji);
        setTimeout(() => {
            emoji.style.opacity = '0';
            emoji.style.transform += ' scale(0.7)';
            setTimeout(() => emoji.remove(), 400);
        }, duration);
    }

    // Sequence: big, then a few small, then random falling
    function startEyeEmojiSequence() {
        let count = 0;
        function next() {
            if (count === 0) {
                popEyeEmoji({big: true, duration: 800});
                setTimeout(next, 850);
            } else if (count < 4) {
                popEyeEmoji({duration: 700 + Math.random() * 200});
                setTimeout(next, 400 + Math.random() * 200);
            } else if (count < 10) {
                popEyeEmoji({random: true, duration: 1200 + Math.random() * 400});
                setTimeout(next, 250 + Math.random() * 200);
            }
            count++;
        }
        next();
    }

    function validateInput() {
        const val = input.value.trim().toLowerCase();
        if (val.length >= 10) {//change to 5
            if (val === 'nottimeyet') {//change to buddy later
                overlay.style.opacity = '0';
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
                lockscreenActive = false;
                error.style.display = 'none';
                if (typeof goToPanel === 'function') goToPanel(0);
            } else {
                error.style.display = 'block';
                // Add shake effect
                overlay.querySelector('.lockscreen-content').classList.add('shake');
                setTimeout(() => {
                    overlay.querySelector('.lockscreen-content').classList.remove('shake');
                }, 400);
                // Start eye emoji sequence
                startEyeEmojiSequence();
            }
        } else {
            error.style.display = 'none';
        }
    }

    input.addEventListener('input', validateInput);

    
    setTimeout(() => { input.focus(); }, 300);
});

// Revolving effect for all photo-frames
let revolvingIndex = 0;
let lastFrame = null;
function revolvePhotoFrames() {
    const frames = Array.from(document.querySelectorAll('div.photo-frame'));
    if (frames.length === 0) return;
    frames.forEach(f => f.classList.remove('revolve'));
    if (revolvingIndex >= frames.length) revolvingIndex = 0;
    const frame = frames[revolvingIndex];
    if (frame) {
        void frame.offsetWidth;
        frame.classList.add('revolve');
    }
    revolvingIndex = (revolvingIndex + 1) % frames.length;
}
setInterval(revolvePhotoFrames, 1000);
setTimeout(revolvePhotoFrames, 500);

let currentPanel = 0;
const totalPanels = 11;
const storyWrapper = document.querySelector('.story-wrapper');
const progressBar = document.querySelector('.progress-bar');
const navDots = document.querySelectorAll('.nav-dot');
let isTransitioning = false;

// Touch/Mouse variables
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;
let lockscreenActive = true; // Also need this variable accessible here

// Listen for vertical scroll to move horizontally
window.addEventListener('wheel', function(e) {
    if (isTransitioning) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) {
            nextPanel();
        } else if (e.deltaY < 0) {
            prevPanel();
        }
        e.preventDefault();
    }
}, { passive: false });

function updateProgress() {
    const progress = ((currentPanel + 1) / totalPanels) * 100;
    progressBar.style.width = progress + '%';
}

function updateNavigation() {
    navDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPanel);
    });
}

function goToPanel(panelIndex) {
    if (isTransitioning || panelIndex === currentPanel) return;
    
    isTransitioning = true;
    currentPanel = Math.max(0, Math.min(panelIndex, totalPanels - 1));
    
    const translateX = -currentPanel * 100;
    storyWrapper.style.transform = `translateX(${translateX}vw)`;
    
    updateProgress();
    updateNavigation();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

function nextPanel() {
    if (currentPanel < totalPanels - 1) {
        goToPanel(currentPanel + 1);
    }
}

function prevPanel() {
    if (currentPanel > 0) {
        goToPanel(currentPanel - 1);
    }
}

function createHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'hearts';
    document.body.appendChild(heartsContainer);

    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = (Math.random() * 100 - 50) + 'px';
        heart.style.animationDelay = i * 0.2 + 's';
        heartsContainer.appendChild(heart);
    }

    setTimeout(() => {
        document.body.removeChild(heartsContainer);
    }, 3000);
}

// Touch events
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false });

// Mouse events
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

function handleTouchStart(e) {
    // *** MODIFIED: Don't start a drag if the lockscreen is on. ***
    if (lockscreenActive) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    document.body.classList.add('grabbing');
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('grabbing');
    
    const deltaX = startX - currentX;
    const deltaY = startY - currentY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            nextPanel();
        } else {
            prevPanel();
        }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
            nextPanel(); 
        } else {
            prevPanel();
        }
    }
}

function handleMouseDown(e) {
    // *** MODIFIED: Don't start a drag if the lockscreen is on. ***
    if (lockscreenActive) return;

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    document.body.classList.add('grabbing');
}

function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    currentY = e.clientY;
}

function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('grabbing');
    
    const deltaX = startX - currentX;
    const deltaY = startY - currentY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            nextPanel();
        } else {
            prevPanel();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lockscreenActive) return; // Also block keyboard nav when locked
    if (e.key === 'ArrowLeft') {
        prevPanel();
    } else if (e.key === 'ArrowRight') {
        nextPanel();
    }
});

// Initialize
updateProgress();
updateNavigation();

// Add some sparkle effects
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.backgroundColor = 'white';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.animation = 'sparkle 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

setInterval(createSparkle, 3000);