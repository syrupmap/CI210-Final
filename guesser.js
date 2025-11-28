const DEFAULT_DIFFICULTY = 'standard';
const DIFFICULTY_PRESETS = {
    relaxed: {
        label: 'Relaxed Learner',
        precisionRadius: 70,
        timerDuration: 45,
        description: 'Longer timer and wider hit radius to learn at your own pace.'
    },
    standard: {
        label: 'Explorer',
        precisionRadius: 50,
        timerDuration: 30,
        description: 'Balanced timer and precision for steady progress.'
    },
    expert: {
        label: 'Surgeon Mode',
        precisionRadius: 30,
        timerDuration: 20,
        description: 'Tight radius and rapid timer for precision masters.'
    }
};

const MOTIVATION_LINES = {
    neutral: [
        'Stay curious — every click wires a new memory.',
        'Prime your eyes for the next anatomy reveal.',
        'Scan the entire diagram; your brain loves patterns.',
        'Each mission is a blueprint for mastery.',
        'Zoom in mentally, breathe, and pick your landmark.'
    ],
    success: [
        'Precision today becomes instinct tomorrow.',
        'Mini wins stack up to major breakthroughs.',
        'Your anatomical compass is on point!',
        'Boom! That structure is now hardwired.',
        'Stack that knowledge — the body map is yours.'
    ],
    comeback: [
        'Reset, refocus, and try again — you got this.',
        'Every miss fine-tunes your mental map.',
        'Use the hint, trace the outline, and fire again.',
        'Learning is lumpy — the next click will land.',
        'Shake it off. Density now, clarity later.'
    ],
    streak: [
        'Streak blazing! Keep that momentum.',
        'Flow state unlocked — ride it to the next badge.',
        'Your synapses are sprinting — keep feeding them.',
        'That streak is glowing hot; go claim another.',
        'The body atlas is unfolding because of you.'
    ]
};

const ACHIEVEMENTS = [
    {
        id: 'first_correct',
        icon: '🎯',
        name: 'First Discovery',
        description: 'Nail your first correct anatomy target.',
        check: (state) => state.correctAnswers >= 1,
        progress: (state) => `${Math.min(state.correctAnswers, 1)} / 1`
    },
    {
        id: 'streak_builder',
        icon: '🔥',
        name: 'Hot Hands',
        description: 'Reach a streak of 5 correct answers.',
        check: (state) => state.bestStreak >= 5,
        progress: (state) => `${Math.min(state.bestStreak, 5)} / 5`
    },
    {
        id: 'bones_specialist',
        icon: '🦴',
        name: 'Skeletal Scholar',
        description: 'Lock in 10 perfect bone guesses.',
        check: (state) => state.stats.bonesCorrect >= 10,
        progress: (state) => `${Math.min(state.stats.bonesCorrect, 10)} / 10`
    },
    {
        id: 'organs_explorer',
        icon: '🫁',
        name: 'Vital Virtuoso',
        description: 'Secure 10 correct organ calls.',
        check: (state) => state.stats.organsCorrect >= 10,
        progress: (state) => `${Math.min(state.stats.organsCorrect, 10)} / 10`
    },
    {
        id: 'precision_pro',
        icon: '💎',
        name: 'Precision Pro',
        description: 'Hit 5 targets inside the tight radius.',
        check: (state) => state.stats.precisionHits >= 5,
        progress: (state) => `${Math.min(state.stats.precisionHits, 5)} / 5`
    }
];

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
        },
        mandible: {
            name: "Mandible",
            hint: "The jawbone",
            funFact: "🦷 The mandible is the largest, strongest and lowest bone in the human face.",
            centerX: 200,
            centerY: 75
        },
        sternum: {
            name: "Sternum",
            hint: "The breastbone",
            funFact: "🛡️ The sternum protects your heart, lungs, and major blood vessels from injury.",
            centerX: 200,
            centerY: 180
        },
        sacrum: {
            name: "Sacrum",
            hint: "Triangular bone at base of spine",
            funFact: "🧩 The sacrum is actually 5 fused vertebrae that connect your spine to your pelvis.",
            centerX: 200,
            centerY: 340
        },
        coccyx: {
            name: "Coccyx",
            hint: "The tailbone",
            funFact: "🐒 The coccyx is the remnant of a vestigial tail!",
            centerX: 200,
            centerY: 365
        },
        carpals: {
            name: "Carpals",
            hint: "Wrist bones",
            funFact: "✋ There are 8 small carpal bones in each wrist that allow for flexible movement.",
            centerX: 129,
            centerY: 332
        },
        phalanges_hand: {
            name: "Phalanges (Hand)",
            hint: "Finger bones",
            funFact: "✌️ Each finger has 3 phalanges, except for the thumb which has 2.",
            centerX: 127,
            centerY: 350
        },
        tarsals: {
            name: "Tarsals",
            hint: "Ankle bones",
            funFact: "🦶 The 7 tarsal bones in each foot support your body weight.",
            centerX: 175,
            centerY: 680
        },
        phalanges_foot: {
            name: "Phalanges (Foot)",
            hint: "Toe bones",
            funFact: "👣 Like fingers, toes have phalanges. They help you balance while walking.",
            centerX: 175,
            centerY: 705
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
        esophagus: {
            name: "Esophagus",
            hint: "Food pipe",
            funFact: "🌭 The esophagus pushes food down to your stomach using muscle waves called peristalsis.",
            centerX: 200,
            centerY: 120
        },
        trachea: {
            name: "Trachea",
            hint: "Windpipe",
            funFact: "🌬️ The trachea is reinforced with cartilage rings to keep it open for breathing.",
            centerX: 200,
            centerY: 140
        },
        heart: {
            name: "Heart",
            hint: "Pumps blood throughout your body",
            funFact: "❤️ Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood!",
            centerX: 200,
            centerY: 215
        },
        lungs: {
            name: "Lungs",
            hint: "Help you breathe oxygen",
            funFact: "🫁 Your lungs contain about 300 million alveoli for gas exchange!",
            centerX: 200,
            centerY: 210
        },
        liver: {
            name: "Liver",
            hint: "Filters toxins and produces bile",
            funFact: "🫀 The liver is the largest internal organ and can regenerate itself!",
            centerX: 220,
            centerY: 275
        },
        gallbladder: {
            name: "Gallbladder",
            hint: "Stores bile",
            funFact: "🟢 The gallbladder stores bile produced by the liver to help digest fats.",
            centerX: 215,
            centerY: 295
        },
        stomach: {
            name: "Stomach",
            hint: "Digests your food",
            funFact: "🫃 Your stomach acid is strong enough to dissolve metal, but your stomach lining protects you!",
            centerX: 190,
            centerY: 295
        },
        spleen: {
            name: "Spleen",
            hint: "Filters blood",
            funFact: "🩸 The spleen acts as a filter for blood and fights bacteria.",
            centerX: 245,
            centerY: 280
        },
        pancreas: {
            name: "Pancreas",
            hint: "Helps you digest and manages blood sugar",
            funFact: "🍽️ The pancreas releases enzymes and insulin at the perfect time after you eat!",
            centerX: 200,
            centerY: 310
        },
        kidneys: {
            name: "Kidneys",
            hint: "Filter your blood",
            funFact: "💧 Your kidneys filter about 50 gallons of blood every day to remove waste.",
            centerX: 200,
            centerY: 320
        },
        intestines: {
            name: "Intestines",
            hint: "Absorb nutrients from food",
            funFact: "🦠 Your small intestine is about 20 feet long! It's where most nutrient absorption happens.",
            centerX: 200,
            centerY: 370
        },
        bladder: {
            name: "Bladder",
            hint: "Stores urine",
            funFact: "🚽 The bladder can hold up to 2 cups of urine before you need to go!",
            centerX: 200,
            centerY: 400
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
    bestStreak: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    history: [],
    currentDifficulty: DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY].label,
    unlockedSystems: 1,
    precisionRadius: DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY].precisionRadius,
    timerDuration: DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY].timerDuration,
    difficultyKey: DEFAULT_DIFFICULTY,
    achievements: {},
    stats: {
        bonesCorrect: 0,
        organsCorrect: 0,
        precisionHits: 0
    }
};

let timerInterval = null;
let timeLeft = DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY].timerDuration;
let flashcards = [];
let flashcardIndex = 0;
let lastMotivationLine = '';
let toastTimeoutId = null;

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
        gameState.bestStreak = saved.bestStreak || 0;
        gameState.correctAnswers = saved.correctAnswers || 0;
        gameState.stats = {
            ...gameState.stats,
            ...(saved.stats || {})
        };
        gameState.achievements = saved.achievements || {};
        gameState.difficultyKey = saved.difficultyKey || DEFAULT_DIFFICULTY;
    }
    applyDifficultyPreset(gameState.difficultyKey, { skipSave: true });
    buildFlashcardDeck();
    evaluateAchievements({}, { showToast: false });
    updateUI();
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

    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', (event) => {
            applyDifficultyPreset(event.target.value);
        });
    }

    setupFlashcardControls();
}

function applyDifficultyPreset(key, options = {}) {
    const preset = DIFFICULTY_PRESETS[key] || DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY];
    const resolvedKey = DIFFICULTY_PRESETS[key] ? key : DEFAULT_DIFFICULTY;
    gameState.difficultyKey = resolvedKey;
    gameState.precisionRadius = preset.precisionRadius;
    gameState.timerDuration = preset.timerDuration;
    gameState.currentDifficulty = preset.label;
    timeLeft = gameState.timerDuration;

    const select = document.getElementById('difficulty-select');
    if (select && select.value !== resolvedKey) {
        select.value = resolvedKey;
    }
    setText('difficulty-description', preset.description);
    updateMissionMeta();
    updateIntelCards();

    if (!options.skipSave) {
        saveProgress();
    }
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
            updateFlashcardUI();
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
    gameState.currentQuestion = {
        partName: randomPart,
        ...data[randomPart]
    };

    // Update question display
    document.getElementById('target-name').textContent = gameState.currentQuestion.name;
    document.getElementById('hint').textContent = `💡 Hint: ${gameState.currentQuestion.hint}`;
    updateMissionMeta();
    startTimer();
    updateMotivationBanner('neutral');
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

    const isCorrect = !timedOut && distance <= gameState.precisionRadius;
    const wasPrecisionHit = isCorrect && distance <= (gameState.precisionRadius / 2);
    gameState.totalQuestions++;

    const feedback = document.getElementById('feedback');
    feedback.classList.remove('correct', 'incorrect');
    feedback.classList.add('show');

    if (isCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        if (gameState.currentMode === 'bones') {
            gameState.stats.bonesCorrect++;
        } else {
            gameState.stats.organsCorrect++;
        }
        if (wasPrecisionHit) {
            gameState.stats.precisionHits++;
        }
        gameState.streak++;
        gameState.bestStreak = Math.max(gameState.bestStreak, gameState.streak);
        feedback.classList.add('correct');
        feedback.innerHTML = `
            <div>🎉 Correct! +10 XP</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        playSound('correct');
        triggerConfetti();
        updateMotivationBanner(gameState.streak >= 5 ? 'streak' : 'success');
    } else if (timedOut) {
        feedback.classList.add('incorrect');
        feedback.innerHTML = `
            <div>⏱️ Time's up! The correct location is marked in green.</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        gameState.streak = 0;
        playSound('incorrect');
        updateMotivationBanner('comeback');
    } else {
        feedback.classList.add('incorrect');
        feedback.innerHTML = `
            <div>❌ Not quite! The correct location is marked in green.</div>
            <div class="fun-fact">${gameState.currentQuestion.funFact}</div>
        `;
        gameState.streak = 0;
        playSound('incorrect');
        updateMotivationBanner('comeback');
    }

    addHistoryEntry({
        name: gameState.currentQuestion.name,
        system: gameState.currentMode,
        result: isCorrect ? 'correct' : timedOut ? 'timedOut' : 'missed',
        distance: distance === Infinity ? null : Math.round(distance)
    });

    gameState.userAnswer = null;

    evaluateAchievements({
        isCorrect,
        timedOut,
        wasPrecisionHit,
        distance,
        mode: gameState.currentMode
    });
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
    updateSystemProgress();
    renderHistory();
    renderAchievements();
}

function saveProgress() {
    localStorage.setItem('anatomyGuesserState', JSON.stringify({
        score: gameState.score,
        streak: gameState.streak,
        correctAnswers: gameState.correctAnswers,
        bestStreak: gameState.bestStreak,
        difficultyKey: gameState.difficultyKey,
        stats: gameState.stats,
        achievements: gameState.achievements
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

function buildFlashcardDeck() {
    flashcards = Object.entries(anatomyData).flatMap(([system, parts]) =>
        Object.keys(parts).map(key => ({
            system,
            name: parts[key].name,
            hint: parts[key].hint,
            funFact: parts[key].funFact
        }))
    );
    shuffleFlashcards();
}

function shuffleFlashcards() {
    if (!flashcards.length) return;
    flashcards = flashcards
        .map(card => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    flashcardIndex = 0;
    updateFlashcardUI();
}

function setupFlashcardControls() {
    const flashcard = document.getElementById('flashcard');
    const prevBtn = document.getElementById('flashcard-prev');
    const nextBtn = document.getElementById('flashcard-next');
    const flipBtn = document.getElementById('flashcard-flip');
    const shuffleBtn = document.getElementById('flashcard-shuffle');

    if (flashcard) {
        flashcard.addEventListener('click', () => toggleFlashcard());
    }
    if (flipBtn) {
        flipBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFlashcard();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeFlashcard(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeFlashcard(1));
    }
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => shuffleFlashcards());
    }
}

function changeFlashcard(delta) {
    if (!flashcards.length) return;
    flashcardIndex = (flashcardIndex + delta + flashcards.length) % flashcards.length;
    resetFlashcardFlip();
    updateFlashcardUI();
}

function toggleFlashcard() {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
    }
}

function resetFlashcardFlip() {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.remove('flipped');
    }
}

function updateFlashcardUI() {
    if (!flashcards.length) return;
    const card = flashcards[flashcardIndex];
    const systemLabel = card.system === 'bones' ? 'Skeletal System' : 'Organ System';
    setText('flashcard-term', card.name);
    setText('flashcard-hint', card.hint);
    setText('flashcard-fact', card.funFact);
    setText('flashcard-system', systemLabel);
    setText('flashcard-position', `${flashcardIndex + 1} / ${flashcards.length}`);
    resetFlashcardFlip();
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function startTimer() {
    stopTimer();
    timeLeft = gameState.timerDuration;
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
    
    if (systemsUnlocked > gameState.unlockedSystems) {
        const card = document.getElementById('intel-systems').parentElement;
        card.classList.add('level-up');
        setTimeout(() => card.classList.remove('level-up'), 2000);
        playSound('correct'); // Bonus sound
    }
    
    gameState.unlockedSystems = systemsUnlocked;
    const systemsEl = document.getElementById('intel-systems');
    if (systemsEl) {
        systemsEl.textContent = `${systemsUnlocked} / 8`;
    }
}

function updateSystemProgress() {
    // Calculate progress based on score (capped at 100%)
    const progress = Math.min(100, Math.round((gameState.score / 500) * 100));
    
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text');
    
    if (fill) fill.style.width = `${progress}%`;
    if (text) text.textContent = `${progress}%`;
    
    // Unlock muscular system if progress is 100%
    if (progress >= 100) {
        const lockedItem = document.querySelector('.system-item.locked');
        if (lockedItem) {
            lockedItem.classList.remove('locked');
            lockedItem.querySelector('span').textContent = '💪 Muscular System';
            lockedItem.querySelector('.progress-text').textContent = 'Unlocked!';
        }
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

function renderAchievements() {
    const list = document.getElementById('achievement-list');
    if (!list) return;

    list.innerHTML = '';

    if (!ACHIEVEMENTS.length) {
        list.innerHTML = '<li class="achievement-item empty">Complete missions to unlock badges.</li>';
        return;
    }

    ACHIEVEMENTS.forEach((achievement) => {
        const unlockedMeta = gameState.achievements[achievement.id];
        const item = document.createElement('li');
        item.classList.add('achievement-item');
        if (unlockedMeta) {
            item.classList.add('earned');
        }

        const progressMarkup = !unlockedMeta && achievement.progress
            ? `<span class="achievement-progress">Progress: ${achievement.progress(gameState)}</span>`
            : unlockedMeta?.unlockedAt
                ? `<span class="achievement-progress">Unlocked ${new Date(unlockedMeta.unlockedAt).toLocaleDateString()}</span>`
                : '';

        item.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-copy">
                <h4>${achievement.name}</h4>
                <p>${unlockedMeta ? 'Badge unlocked!' : achievement.description}</p>
                ${progressMarkup}
            </div>
        `;
        list.appendChild(item);
    });
}

function evaluateAchievements(context = {}, options = {}) {
    const { showToast = true } = options;
    ACHIEVEMENTS.forEach((achievement) => {
        if (gameState.achievements[achievement.id]) return;
        if (achievement.check(gameState, context)) {
            unlockAchievement(achievement, { silent: !showToast });
        }
    });
}

function unlockAchievement(achievement, options = {}) {
    const { silent = false } = options;
    gameState.achievements[achievement.id] = {
        unlockedAt: new Date().toISOString()
    };
    renderAchievements();
    if (!silent) {
        showAchievementToast(achievement);
    }
    saveProgress();
}

function showAchievementToast(achievement) {
    const toast = document.getElementById('achievement-toast');
    if (!toast) return;

    toast.classList.remove('show');
    toast.innerHTML = `<strong>${achievement.icon} ${achievement.name}</strong><span>Badge unlocked! ${achievement.description}</span>`;
    // Force reflow so animation retriggers if the same toast fires twice.
    void toast.offsetWidth;
    toast.classList.add('show');
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
    }
    toastTimeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 4200);
}

function updateMotivationBanner(mood = 'neutral') {
    const banner = document.getElementById('motivation-banner');
    if (!banner) return;

    const pool = MOTIVATION_LINES[mood] || MOTIVATION_LINES.neutral;
    if (!Array.isArray(pool) || pool.length === 0) return;

    let line = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && line === lastMotivationLine) {
        const currentIndex = pool.indexOf(line);
        line = pool[(currentIndex + 1) % pool.length];
    }

    banner.textContent = line;
    banner.setAttribute('data-mood', mood);
    lastMotivationLine = line;
    animateMotivationBanner(banner);
}

function animateMotivationBanner(element) {
    element.classList.remove('bump');
    // Trigger reflow to restart the animation.
    void element.offsetWidth;
    element.classList.add('bump');
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.opacity = Math.random();
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
