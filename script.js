// --- بيانات المراحل (نسخة الأطفال) ---
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
            { answer: "الصدق", clue: "١. الصفة التي نجت الراعي في النهاية وعكسها الكذب (٥ حروف)" },
            { answer: "التعاون", clue: "٢. سر نجاح النمل والنحل في العمل وبناء بيوتهم (٧ حروف)" },
            { answer: "الصبر", clue: "٣. مفتاح الفرج وصفة تعلمناها من قصص الأنبياء (٥ حروف)" },
            { answer: "القراءة", clue: "٤. مفتاح المعرفة وأول كلمة نزلت في القرآن (٧ حروف)" }
        ]
    }
];

let currentLevelIndex = 0;
let currentScore = 0;
const scorePerWord = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(currentLevelIndex);

    // زر الانتقال للمرحلة التالية
    document.getElementById('next-level-btn').addEventListener('click', () => {
        document.getElementById('victory-modal').classList.add('hidden');
        currentLevelIndex++;
        
        if (currentLevelIndex < levels.length) {
            loadLevel(currentLevelIndex);
        } else {
            showFinalScreen();
        }
    });
});

function loadLevel(index) {
    const gameArea = document.getElementById('game-area');
    const levelData = levels[index];
    
    // تحديث واجهة المستخدم
    document.getElementById('current-level').textContent = toArabicNumerals(index + 1);
    document.getElementById('level-title').textContent = levelData.title;
    updateProgressBar();

    // تنظيف المنطقة
    gameArea.innerHTML = '';

    // إنشاء الألغاز
    levelData.puzzles.forEach((puzzle, pIndex) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'word-group';
        groupDiv.setAttribute('data-answer', puzzle.answer);
        groupDiv.id = `puzzle-${pIndex}`;

        // نص السؤال
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue';
        clueDiv.textContent = puzzle.clue;
        groupDiv.appendChild(clueDiv);

        // مربعات الإدخال
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'inputs';
        
        // إنشاء المربعات بالترتيب الصحيح لـ RTL
        for (let i = 0; i < puzzle.answer.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = 'cell';
            input.dataset.index = i; // لتسهيل التتبع
            inputsDiv.appendChild(input);
        }
        groupDiv.appendChild(inputsDiv);
        gameArea.appendChild(groupDiv);

        // تفعيل منطق اللعبة لهذا اللغز
        attachLogicToGroup(groupDiv, puzzle.answer);
    });
}

function attachLogicToGroup(group, answer) {
    const inputs = group.querySelectorAll('.cell');
    
    inputs.forEach((input, index) => {
        
        // عند الكتابة
        input.addEventListener('input', () => {
            // الانتقال التلقائي للحقل التالي (لليمين في RTL)
            if (input.value.length === 1) {
                if (index < inputs.length - 1) { // إذا لم يكن الحقل الأخير
                    inputs[index + 1].focus();
                }
                checkOnePuzzle(group, inputs, answer);
            }
        });

        // أزرار التحكم (مسح، أسهم)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (input.value.length === 0 && index > 0) {
                    inputs[index - 1].focus(); // الرجوع للحقل السابق
                } else {
                    input.value = ''; // مسح الحرف الحالي
                }
                // إزالة حالات الألوان عند التعديل
                inputs.forEach(cell => cell.classList.remove('correct', 'incorrect'));
            }
            
            // التنقل بالأسهم (يمين ويسار)
            if (e.key === 'ArrowLeft' && index < inputs.length - 1) { // السهم الأيسر ينتقل لليمين في RTL
                inputs[index + 1].focus();
                e.preventDefault(); // منع سلوك المتصفح الافتراضي
            }
            if (e.key === 'ArrowRight' && index > 0) { // السهم الأيمن ينتقل لليسار في RTL
                inputs[index - 1].focus();
                e.preventDefault(); // منع سلوك المتصفح الافتراضي
            }
        });

        input.addEventListener('focus', () => input.select());
    });
}

function checkOnePuzzle(group, inputs, correctAnswer) {
    let userAnswer = '';
    let allFilled = true;

    inputs.forEach(input => {
        userAnswer += input.value;
        if (input.value === '') allFilled = false;
    });

    if (!allFilled) return;

    if (userAnswer === correctAnswer) {
        // إجابة صحيحة
        if (!group.classList.contains('solved')) {
            group.classList.add('solved');
            inputs.forEach(input => {
                input.classList.remove('incorrect');
                input.classList.add('correct');
                input.blur();
                input.disabled = true; // قفل الإجابة الصحيحة
            });
            
            // زيادة النقاط وتحديث الواجهة
            currentScore += scorePerWord;
            updateScoreUI();
            
            // التحقق من انتهاء المرحلة
            checkLevelCompletion();
        }
    } else {
        // إجابة خاطئة
        inputs.forEach(input => {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        });
    }
}

function checkLevelCompletion() {
    const currentPuzzles = document.getElementById('game-area').children;
    let solvedCount = 0;

    for (let group of currentPuzzles) {
        if (group.classList.contains('solved')) {
            solvedCount++;
        }
    }

    // تحديث شريط التقدم داخل المرحلة
    const progressPercent = ((solvedCount / currentPuzzles.length) * 100);
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    
    // إذا اكتملت جميع الألغاز
    if (solvedCount === currentPuzzles.length) {
        setTimeout(() => {
            const victoryModal = document.getElementById('victory-modal');
            victoryModal.classList.remove('hidden');
        }, 500);
    }
}

function updateScoreUI() {
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = toArabicNumerals(currentScore);
    scoreEl.style.color = 'var(--correct-green)'; // لون أخضر عند زيادة النقاط
    setTimeout(() => scoreEl.style.color = 'var(--text-dark)', 500); // العودة للون الأصلي
}

function updateProgressBar() {
    document.getElementById('progress-bar').style.width = '0%';
}

function showFinalScreen() {
    const finalModal = document.getElementById('final-modal');
    document.getElementById('final-score-display').textContent = toArabicNumerals(currentScore);
    finalModal.classList.remove('hidden');
}

// دالة مساعدة لتحويل الأرقام إلى عربية
function toArabicNumerals(n) {
    return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}
