// --- بيانات المراحل (قصص الأطفال) ---
const levels = [
    {
        title: "المرحلة ١: أبطال الحكايات",
        puzzles: [
            { answer: "ليلى", clue: "١. الفتاة التي زارت جدتها في الغابة وحاورها الذئب (٤ حروف)" },
            { answer: "علاء", clue: "٢. الشاب الذي وجد المصباح السحري وطار بالبساط (٤ حروف)" },
            { answer: "سندريلا", clue: "٣. الأميرة التي فقدت حذاءها الزجاجي قبل منتصف الليل (٧ حروف)" },
            { answer: "طرزان", clue: "٤. عاش في الغابة وربته الغوريلات وأصبح صديق الحيوانات (٥ حروف)" }
        ]
    },
    {
        title: "المرحلة ٢: حيوانات القصص",
        puzzles: [
            { answer: "سيمبا", clue: "١. الشبل الصغير الذي أصبح ملك الغابة في فيلم الأسد الملك (٥ حروف)" },
            { answer: "نيمو", clue: "٢. السمكة الصغيرة الملونة التي ضاعت في المحيط (٤ حروف)" },
            { answer: "جيري", clue: "٣. الفأر الذكي الذي يهرب دائماً من القط توم (٤ حروف)" },
            { answer: "بطوط", clue: "٤. البطة العصبية والمضحكة التي ترتدي ملابس البحارة (٤ حروف)" }
        ]
    },
    {
        title: "المرحلة ٣: أدوات سحرية",
        puzzles: [
            { answer: "مصباح", clue: "١. الشيء القديم الذي خرج منه الجني الأزرق (٥ حروف)" },
            { answer: "بساط", clue: "٢. وسيلة النقل الطائرة التي استخدمها علاء الدين (٤ حروف)" },
            { answer: "عصا", clue: "٣. الأداة التي تستخدمها الجنيات لإلقاء التعاويذ السحرية (٣ حروف)" },
            { answer: "مرآة", clue: "٤. سألتها الملكة الشريرة: من هي أجمل امرأة في البلاد؟ (٤ حروف)" }
        ]
    },
    {
        title: "المرحلة ٤: قيم ودروس",
        puzzles: [
            { answer: "الصدق", clue: "١. الصفة التي نجت الراعي في النهاية، وعكسها الكذب (٥ حروف)" },
            { answer: "التعاون", clue: "٢. سر نجاح النمل والنحل في العمل وبناء بيوتهم (٧ حروف)" },
            { answer: "الصبر", clue: "٣. مفتاح الفرج، وصفة تعلمناها من قصص الأنبياء (٥ حروف)" },
            { answer: "القراءة", clue: "٤. مفتاح المعرفة وأول كلمة نزلت في القرآن (٧ حروف)" }
        ]
    }
];

// --- المتغيرات العامة ---
let currentLevelIndex = 0;
let currentScore = 0;
const scorePerWord = 10;

// --- التشغيل الأساسي ---
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    loadLevel(currentLevelIndex);

    const nextBtn = document.getElementById('next-level-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            document.getElementById('victory-modal').classList.add('hidden');
            currentLevelIndex++;
            
            if (currentLevelIndex < levels.length) {
                loadLevel(currentLevelIndex);
            } else {
                showFinalScreen();
            }
        });
    }
}

// --- دالة تحميل المرحلة ---
function loadLevel(index) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    const levelData = levels[index];
    
    // تنظيف المنطقة
    gameArea.innerHTML = '';

    // تحديث النصوص
    const currentLevelEl = document.getElementById('current-level');
    const levelTitleEl = document.getElementById('level-title');
    
    if (currentLevelEl) {
        // تحديث رقم المرحلة والعدد الكلي
        const levelIndicator = currentLevelEl.parentElement;
        levelIndicator.innerHTML = `المرحلة: <span id="current-level">${toArabicNumerals(index + 1)}</span> / ${toArabicNumerals(levels.length)}`;
    }
    
    if (levelTitleEl) levelTitleEl.textContent = levelData.title;
    
    // تحديث شريط التقدم
    document.getElementById('progress-bar').style.width = '0%';

    // إنشاء الألغاز
    levelData.puzzles.forEach((puzzle, idx) => {
        const group = createPuzzleElement(puzzle, idx);
        gameArea.appendChild(group);
    });
}

// --- دالة إنشاء عنصر اللغز HTML ---
function createPuzzleElement(puzzle, idx) {
    const group = document.createElement('div');
    group.className = 'word-group';
    group.setAttribute('data-answer', puzzle.answer);
    group.id = `puzzle-${idx}`;

    const clue = document.createElement('div');
    clue.className = 'clue';
    clue.textContent = puzzle.clue;
    group.appendChild(clue);

    const inputs = document.createElement('div');
    inputs.className = 'inputs';

    for (let i = 0; i < puzzle.answer.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.className = 'cell';
        
        addInputLogic(input, i, puzzle.answer.length, group, puzzle.answer);
        
        inputs.appendChild(input);
    }

    group.appendChild(inputs);
    return group;
}

// --- دالة إضافة منطق التفاعل ---
function addInputLogic(input, index, totalLength, group, correctAnswer) {
    input.addEventListener('input', (e) => {
        if (input.value.length === 1) {
            const nextInput = group.querySelectorAll('.cell')[index + 1];
            if (nextInput) nextInput.focus();
            checkAnswer(group, correctAnswer);
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value.length === 0) {
            const prevInput = group.querySelectorAll('.cell')[index - 1];
            if (prevInput) prevInput.focus();
        }
        
        if (!group.classList.contains('solved')) {
            group.querySelectorAll('.cell').forEach(c => {
                c.classList.remove('correct', 'incorrect');
            });
        }
    });
    
    // تحديد النص عند التركيز لسهولة التعديل
    input.addEventListener('focus', () => input.select());
}

// --- دالة التحقق من الإجابة ---
function checkAnswer(group, correctAnswer) {
    const inputs = group.querySelectorAll('.cell');
    let userAnswer = '';
    let allFilled = true;

    inputs.forEach(inp => {
        userAnswer += inp.value.trim();
        if (inp.value.trim() === '') allFilled = false;
    });

    if (!allFilled) return;

    // تنظيف النصوص للمقارنة (إزالة المسافات وتوحيد الهمزات إن لزم)
    const cleanUser = userAnswer.replace(/\s/g, '');
    const cleanCorrect = correctAnswer.replace(/\s/g, '');

    if (cleanUser === cleanCorrect) {
        if (!group.classList.contains('solved')) {
            currentScore += scorePerWord;
            updateScoreUI();
        }
        
        group.classList.add('solved');
        inputs.forEach(inp => {
            inp.classList.remove('incorrect');
            inp.classList.add('correct');
            inp.readOnly = true;
        });

        checkLevelCompletion();
    } else {
        inputs.forEach(inp => {
            inp.classList.add('incorrect');
        });
    }
}

// --- دالة التحقق من اكتمال المرحلة ---
function checkLevelCompletion() {
    const totalPuzzles = document.querySelectorAll('.word-group').length;
    const solvedPuzzles = document.querySelectorAll('.word-group.solved').length;

    const percent = (solvedPuzzles / totalPuzzles) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;

    if (solvedPuzzles === totalPuzzles) {
        setTimeout(() => {
            const victoryModal = document.getElementById('victory-modal');
            victoryModal.classList.remove('hidden');
            
            if (currentLevelIndex + 1 === levels.length) {
                document.getElementById('next-level-btn').textContent = "إنهاء اللعبة";
            } else {
                document.getElementById('next-level-btn').textContent = "المرحلة التالية";
            }
        }, 500);
    }
}

// --- دوال مساعدة ---
function updateScoreUI() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) {
        scoreEl.textContent = toArabicNumerals(currentScore);
        scoreEl.style.color = 'var(--correct-green)';
        setTimeout(() => scoreEl.style.color = 'var(--text-dark)', 500);
    }
}

function showFinalScreen() {
    const finalModal = document.getElementById('final-modal');
    const finalScoreDisplay = document.getElementById('final-score-display');
    if (finalScoreDisplay) finalScoreDisplay.textContent = toArabicNumerals(currentScore);
    if (finalModal) finalModal.classList.remove('hidden');
}

function toArabicNumerals(n) {
    return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}
