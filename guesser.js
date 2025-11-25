const PRECISION_RADIUS = 50;
const TIMER_DURATION = 30;

// Anatomy Data
const anatomyData = {
    bones: {
        skull: {
            name: "Skull",
            hint: "Protects your brain",
            funFact: "🧠 The skull has 22 bones! It protects your brain and gives your face its shape.",
            centerX: 200,
            centerY: 60
        },
        clavicle: {
            name: "Clavicle",
            hint: "Also called the collar bone",
            funFact: "🦴 The clavicle is one of the most commonly broken bones, often from falls or sports injuries!",
            centerX: 200,
            centerY: 107
        },
        scapula: {
            name: "Scapula",
            hint: "Your shoulder blade",
            funFact: "🛡️ The scapula anchors 17 different muscles allowing your shoulder incredible mobility!",
            centerX: 155,
            centerY: 150
        },
        ribs: {
            name: "Ribs",
            hint: "Protects your heart and lungs",
            funFact: "🫁 You have 24 ribs - 12 pairs! They form a protective cage around your vital organs.",
            centerX: 200,
            centerY: 200
        },
        humerus: {
            name: "Humerus",
            hint: "The upper arm bone",
            funFact: "💪 The humerus is the longest bone in your arm, extending from shoulder to elbow!",
            centerX: 120,
            centerY: 180
        },
        radius: {
            name: "Radius",
            hint: "Forearm bone on thumb side",
            funFact: "🤚 The radius rotates around the ulna, letting you turn your palm up and down!",
            centerX: 130,
            centerY: 260
        },
        ulna: {
            name: "Ulna",
            hint: "Forearm bone on pinky side",
            funFact: "📏 The ulna forms the bony point of your elbow and stabilizes your forearm movements.",
            centerX: 120,
            centerY: 285
        },
        spine: {
            name: "Spine",
            hint: "Your backbone, made of many vertebrae",
            funFact: "🦴 Your spine has 33 vertebrae and allows you to bend, twist, and stand upright!",
            centerX: 200,
            centerY: 230
        },
        pelvis: {
            name: "Pelvis",
            hint: "Hip bones that support your body",
            funFact: "🦴 The pelvis supports your spine and protects organs in your lower abdomen!",
            centerX: 200,
            centerY: 340
        },
        femur: {
            name: "Femur",
            hint: "The longest bone in the human body",
            funFact: "🦴 The femur is the longest, strongest bone in your body! It can support 30x your body weight!",
            centerX: 180,
            centerY: 445
        },
        patella: {
            name: "Patella",
            hint: "The kneecap",
            funFact: "🏃‍♀️ The patella protects your knee joint and improves the leverage of your thigh muscles.",
            centerX: 175,
            centerY: 525
        },
        tibia: {
            name: "Tibia",
            hint: "The larger shin bone",
            funFact: "🦴 The tibia is the second-largest bone in your body and bears most of your weight when standing!",
            centerX: 175,
            centerY: 600
        },
        fibula: {
            name: "Fibula",
            hint: "Thin calf bone",
            funFact: "🚶‍♂️ The fibula stabilizes your ankle and supports muscles of the lower leg.",
            centerX: 220,
            centerY: 600
        }
    },
    organs: {
        brain: {
            name: "Brain",
            hint: "Controls all your thoughts and movements",
            funFact: "🧠 Your brain contains about 86 billion neurons and uses 20% of your body's energy!",
            centerX: 200,
            centerY: 60
        },
        heart: {
            name: "Heart",
            hint: "Pumps blood throughout your body",
            funFact: "❤️ Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood!",
            centerX: 200,
            centerY: 180
        },
        lungs: {
            name: "Lungs",
            hint: "Help you breathe oxygen",
            funFact: "🫁 Your lungs contain about 300 million alveoli for gas exchange!",
            centerX: 200,
            centerY: 200
        },
        liver: {
            name: "Liver",
            hint: "Filters toxins and produces bile",
            funFact: "🫀 The liver is the largest internal organ and can regenerate itself!",
            centerX: 220,
            centerY: 240
        },
        stomach: {
            name: "Stomach",
            hint: "Digests your food",
            funFact: "🫃 Your stomach acid is strong enough to dissolve metal, but your stomach lining protects you!",
            centerX: 200,
            centerY: 260
        },
        intestines: {
            name: "Intestines",
            hint: "Absorb nutrients from food",
            funFact: "🦠 Your small intestine is about 20 feet long! It's where most nutrient absorption happens.",
            centerX: 200,
            centerY: 320
        },
        kidneys: {
            name: "Kidneys",
            hint: "Filter your blood",
            funFact: "💧 Your kidneys filter about 50 gallons of blood every day to remove waste.",
            centerX: 160,
            centerY: 280
        },
        pancreas: {
            name: "Pancreas",
            hint: "Helps you digest and manages blood sugar",
            funFact: "🍽️ The pancreas releases enzymes and insulin at the perfect time after you eat!",
            centerX: 210,
            centerY: 290
        }
    }
};

// Game State
let gameState = {
    currentMode: 'bones',
    currentQuestion: null,
    userAnswer: null,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    history: [],
    currentDifficulty: 'Explorer',
    unlockedSystems: 1,
    precisionRadius: PRECISION_RADIUS
};

let timerInterval = null;
let timeLeft = TIMER_DURATION;

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    loadNewQuestion();
});

function initializeGame() {
    // Load saved progress from localStorage
    const savedState = localStorage.getItem('anatomyGuesserState');
    if (savedState) {
        const saved = JSON.parse(savedState);
        gameState.score = saved.score || 0;
        gameState.streak = saved.streak || 0;
        gameState.correctAnswers = saved.correctAnswers || 0;
        updateUI();
    }
}

function setupEventListeners() {
    // Learning mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLearningMode(btn.dataset.mode);
        });
    });

    // Toggle between bones and organs
    document.getElementById('bones-toggle').addEventListener('click', () => {
        switchViewType('bones');
    });

    document.getElementById('organs-toggle').addEventListener('click', () => {
        switchViewType('organs');
    });

    // Body diagram clicks
    document.getElementById('body-svg').addEventListener('click', (e) => {
        handleBodyClick(e);
    });

    // Submit button
    document.getElementById('submit-btn').addEventListener('click', () => {
        checkAnswer();
    });

    // Next button
    document.getElementById('next-btn').addEventListener('click', () => {
        loadNewQuestion();
    });
}

function switchLearningMode(mode) {
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    // Hide all content
    document.querySelectorAll('.quiz-content, .video-content, .audio-content, .flashcard-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected content
    switch(mode) {
        case 'quiz':
            document.getElementById('quiz-content').classList.remove('hidden');
            break;
        case 'video':
            document.getElementById('video-content').classList.remove('hidden');
            break;
        case 'audio':
            document.getElementById('audio-content').classList.remove('hidden');
            break;
        case 'flashcard':
            document.getElementById('flashcard-content').classList.remove('hidden');
            break;
    }
}

function switchViewType(type) {
    gameState.currentMode = type;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const skeletonVector = document.getElementById('skeleton');
    const skeletonPhoto = document.getElementById('skeleton-photo-layer');
    const organsView = document.getElementById('organs-view');
    if (type === 'bones') {
        document.getElementById('bones-toggle').classList.add('active');
        // Show reference photo, keep vector overlay hidden to avoid stacking
        skeletonPhoto.style.display = 'block';
        skeletonVector.style.display = 'none';
        organsView.style.display = 'none';
        document.getElementById('bones-regions').style.display = 'block';
        document.getElementById('organs-regions').style.display = 'none';
    } else {
        document.getElementById('organs-toggle').classList.add('active');
        // Show organ overlay, hide all skeletal imagery
        skeletonPhoto.style.display = 'none';
        skeletonVector.style.display = 'none';
        organsView.style.display = 'block';
        document.getElementById('bones-regions').style.display = 'none';
        document.getElementById('organs-regions').style.display = 'block';
    }
    updateActiveSystemChip();
    // Load new question for the selected type
    loadNewQuestion();
}

function loadNewQuestion() {
    stopTimer();
    // Reset UI
    hideMarkers();
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('next-btn').style.display = 'none';
    gameState.userAnswer = null;

    // Get random anatomy part
    const data = anatomyData[gameState.currentMode];
    const parts = Object.keys(data);
    const randomPart = parts[Math.floor(Math.random() * parts.length)];
    const difficultyLevels = ['Explorer', 'Scholar', 'Surgeon'];
    gameState.currentDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    
    gameState.currentQuestion = {
        partName: randomPart,
        ...data[randomPart]
    };

    // Update question display
    document.getElementById('target-name').textContent = gameState.currentQuestion.name;
    document.getElementById('hint').textContent = `💡 Hint: ${gameState.currentQuestion.hint}`;
    updateMissionMeta();
    startTimer();
}

function handleBodyClick(e) {
    const svg = document.getElementById('body-svg');
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (400 / rect.width);
    const y = (e.clientY - rect.top) * (800 / rect.height);
    
    placeMarker(x, y);
}

function placeMarker(x, y) {
    gameState.userAnswer = { x, y };
    
    // Show user marker
    const marker = document.getElementById('user-marker');
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
    marker.setAttribute('opacity', '1');
    
    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
}

function checkAnswer(options = {}) {
    const { timedOut = false } = options;
    if (!gameState.userAnswer && !timedOut) return;

    stopTimer();

    const correctX = gameState.currentQuestion.centerX;
    const correctY = gameState.currentQuestion.centerY;
    const hasGuess = !!gameState.userAnswer && !timedOut;
    const userX = hasGuess ? gameState.userAnswer.x : null;
    const userY = hasGuess ? gameState.userAnswer.y : null;
    const distance = hasGuess
        ? Math.sqrt(Math.pow(correctX - userX, 2) + Math.pow(correctY - userY, 2))
        : Infinity;

    // Show markers
    const correctMarker = document.getElementById('correct-marker');
    correctMarker.setAttribute('cx', correctX);
    correctMarker.setAttribute('cy', correctY);
    correctMarker.setAttribute('opacity', '1');

    if (hasGuess) {
        const marker = document.getElementById('user-marker');
        marker.setAttribute('opacity', '1');
    }

    const isCorrect = !timedOut && distance <= PRECISION_RADIUS;
    gameState.totalQuestions++;

    const feedback = document.getElementById('feedback');
    feedback.classList.remove('correct', 'incorrect');
    feedback.classList.add('show');

    if (isCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        gameState.streak++;
        feedback.classList.add('correct');
        feedback.innerHTML = `
            <div>🎉 Correct! +10 XP</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        playSound('correct');
    } else if (timedOut) {
        feedback.classList.add('incorrect');
        feedback.innerHTML = `
            <div>⏱️ Time's up! The correct location is marked in green.</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        gameState.streak = 0;
        playSound('incorrect');
    } else {
        feedback.classList.add('incorrect');
        feedback.innerHTML = `
            <div>❌ Not quite! The correct location is marked in green.</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        gameState.streak = 0;
        playSound('incorrect');
    }

    addHistoryEntry({
        name: gameState.currentQuestion.name,
        system: gameState.currentMode,
        result: isCorrect ? 'correct' : timedOut ? 'timedOut' : 'missed',
        distance: distance === Infinity ? null : Math.round(distance)
    });

    gameState.userAnswer = null;

    updateUI();
    saveProgress();

    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
}

function hideMarkers() {
    document.getElementById('user-marker').setAttribute('opacity', '0');
    document.getElementById('correct-marker').setAttribute('opacity', '0');
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('correct').textContent = gameState.correctAnswers;
    updateMissionMeta();
    updateIntelCards();
    renderHistory();
}

function saveProgress() {
    localStorage.setItem('anatomyGuesserState', JSON.stringify({
        score: gameState.score,
        streak: gameState.streak,
        correctAnswers: gameState.correctAnswers
    }));
}

function playSound(type) {
    // Placeholder for sound effects
    // In a full implementation, you would play actual audio files
    if (type === 'correct') {
        console.log('🔊 Playing success sound');
    } else {
        console.log('🔊 Playing try again sound');
    }
}

// Flashcard functionality
document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    }
});

function startTimer() {
    stopTimer();
    timeLeft = TIMER_DURATION;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            stopTimer();
            if (document.getElementById('submit-btn').style.display !== 'none') {
                checkAnswer({ timedOut: true });
            }
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerValue = document.getElementById('timer-value');
    const timerChip = timerValue ? timerValue.parentElement : null;
    if (timerValue) {
        timerValue.textContent = `${timeLeft}s`;
    }
    if (timerChip) {
        if (timeLeft <= 10) {
            timerChip.classList.add('chip-danger');
        } else {
            timerChip.classList.remove('chip-danger');
        }
    }
}

function updateMissionMeta() {
    const accuracy = gameState.totalQuestions
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
        : 0;
    const accuracyRate = document.getElementById('accuracy-rate');
    if (accuracyRate) {
        accuracyRate.textContent = `${accuracy}%`;
    }

    const difficultyPill = document.getElementById('difficulty-pill');
    if (difficultyPill) {
        difficultyPill.textContent = `Difficulty · ${gameState.currentDifficulty}`;
    }

    updateActiveSystemChip();
}

function updateActiveSystemChip() {
    const chip = document.getElementById('active-system-chip');
    if (chip) {
        chip.textContent = gameState.currentMode === 'bones' ? 'Bones Focus' : 'Organs Focus';
    }
}

function updateIntelCards() {
    const streakEl = document.getElementById('intel-streak');
    if (streakEl) {
        streakEl.textContent = gameState.streak;
    }

    const precisionEl = document.getElementById('intel-precision');
    if (precisionEl) {
        precisionEl.textContent = `${gameState.precisionRadius}px`;
    }

    const systemsUnlocked = Math.min(8, 1 + Math.floor(gameState.score / 80));
    gameState.unlockedSystems = systemsUnlocked;
    const systemsEl = document.getElementById('intel-systems');
    if (systemsEl) {
        systemsEl.textContent = `${systemsUnlocked} / 8`;
    }
}

function addHistoryEntry(entry) {
    gameState.history.unshift({
        ...entry,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (gameState.history.length > 5) {
        gameState.history.pop();
    }
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;

    if (!gameState.history.length) {
        list.innerHTML = '<li class="empty">Complete a mission to build your streak.</li>';
        return;
    }

    list.innerHTML = '';
    gameState.history.forEach(item => {
        const li = document.createElement('li');
        const statusClass = item.result === 'correct' ? 'correct' : 'missed';
        const resultLabel = item.result === 'correct'
            ? 'Perfect'
            : item.result === 'timedOut'
                ? 'Timed Out'
                : 'Missed';
        const distanceLabel = item.distance != null ? `${item.distance}px` : '—';
        li.innerHTML = `
            <span>
                ${item.name}
                <small style="display:block;color:#94a3b8;">${item.system === 'bones' ? 'Skeletal' : 'Organ'} system · ${item.timestamp}</small>
            </span>
            <span class="history-status ${statusClass}">${resultLabel} · ${distanceLabel}</span>
        `;
        list.appendChild(li);
    });
}
