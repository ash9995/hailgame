// --- بيانات المراحل ---
const levels = [
    {
        title: "المرحلة ١: معالم حائل التاريخية",
        puzzles: [
            { answer: "القشلة", clue: "١. قصر تاريخي شهير في وسط مدينة حائل (٦ حروف)" },
            { answer: "اعيرف", clue: "٢. قلعة وجبل يطل على حائل (٥ حروف)" },
            { answer: "حاتم", clue: "٣. رمز الكرم العربي الذي ارتبط اسمه بحائل (٤ حروف)" },
            { answer: "جبة", clue: "٤. مدينة تاريخية تشتهر بالنقوش (٣ حروف)" }
        ]
    },
    {
        title: "المرحلة ٢: طبيعة وجغرافيا حائل",
        puzzles: [
            { answer: "اجا", clue: "١. سلسلة جبال شهيرة في حائل، شقيقة سلمى (٣ حروف)" },
            { answer: "سلمى", clue: "٢. سلسلة جبال أخرى ترتبط بقصة حب أسطورية (٤ حروف)" },
            { answer: "النفود", clue: "٣. صحراء رملية ذهبية كبيرة تحيط بحائل (٦ حروف)" },
            { answer: "عقدة", clue: "٤. منطقة زراعية وسياحية داخل الجبال (٤ حروف)" }
        ]
    },
    {
        title: "المرحلة ٣: تراث وكرم حائل",
        puzzles: [
            { answer: "كبيبة", clue: "١. أكلة حائلية شهيرة تُعمل بورق العنب (٥ حروف)" },
            { answer: "دلة", clue: "٢. رمز للضيافة وتقديم القهوة (٣ حروف)" },
            { answer: "برزان", clue: "٣. حي تاريخي قديم في حائل (٥ حروف)" },
            { answer: "فيد", clue: "٤. مدينة تاريخية قديمة تقع على طريق الحج (٣ حروف)" }
        ]
    },
    { // المرحلة الرابعة: دور المراكز الثقافية (مفاهيم أساسية)
        title: "المرحلة ٤: دور بيوت الثقافة",
        puzzles: [
            { answer: "مواهب", clue: "١. الهدف الأهم للمراكز الثقافية هو اكتشاف وصقل ... الشباب (٥ حروف)" },
            { answer: "ورشة", clue: "٢. طريقة تدريب عملية قصيرة ومكثفة لتعليم مهارة جديدة (٤ حروف)" },
            { answer: "أطفال", clue: "٣. الفئة العمرية التي تُخصص لها برامج لتنمية الخيال والمهارات الحركية (٤ حروف)" }
            { answer: "تراث", clue: "٤. ما تحافظ عليه المراكز الثقافية من عادات وفنون الماضي (٤ حروف)" }
            { answer: "السياحة", clue: "١. بيوت الثقافة تسهم في تعزيز .... لجذب الزوار الأجانب والمحليين (٧ حروف)" },

        ]
    }
];


// --- متغيرات الحالة العامة ---
let currentLevelIndex = 0;
let currentScore = 0;
let gameStarted = false; // لم نعد نحتاجها بسبب التحديث ولكن نحافظ عليها كتأمين

// --- وظائف مساعدة ---

// دالة مساعدة لتحويل الأرقام إلى عربية
function toArabicNumerals(number) {
    const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(number).replace(/[0-9]/g, (d) => arabic[d]);
}

// دالة لإنشاء مجموعات الألغاز ديناميكياً
function createPuzzleGroup(puzzle) {
    const group = document.createElement('div');
    group.classList.add('word-group');
    group.setAttribute('data-answer', puzzle.answer);

    const clue = document.createElement('div');
    clue.classList.add('clue');
    clue.textContent = puzzle.clue;

    const inputs = document.createElement('div');
    inputs.classList.add('inputs');

    for (let i = 0; i < puzzle.answer.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.classList.add('cell');
        inputs.appendChild(input);
    }

    group.appendChild(clue);
    group.appendChild(inputs);
    return group;
}

// وظيفة التحقق من الإجابة
function checkAnswer(group, inputs, correctAnswer) {
    let userAnswer = '';
    let allFilled = true;
    let scoreGained = false;

    // لا تتحقق إذا كانت الإجابة محلولة سابقاً
    if (group.classList.contains('solved')) {
        return;
    }

    inputs.forEach(input => {
        // نستخدم toLowerCase للتحقق لتجاهل حالة الأحرف (في حال استخدام أحرف لاتينية)
        // ونزيل المسافات
        userAnswer += input.value.trim();
        if (input.value.length === 0) {
            allFilled = false;
        }
    });

    // لا تتحقق إلا إذا عبأ المستخدم جميع المربعات
    if (!allFilled) {
        return;
    }

    // المستخدم عبأ كل المربعات، نبدأ التصحيح
    // نحول الإجابة الصحيحة أيضاً لإزالة المسافات وتوحيد حالة الأحرف للتحقق الدقيق
    const cleanedUserAnswer = userAnswer.toLowerCase();
    const cleanedCorrectAnswer = correctAnswer.toLowerCase();

    if (cleanedUserAnswer === cleanedCorrectAnswer) {
        // الإجابة صحيحة (لون أخضر)
        group.classList.add('solved');
        inputs.forEach(input => {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            input.disabled = true; // نوقف الإدخال بعد الحل الصحيح
        });

        // زيادة النقاط
        currentScore += 10;
        updateScoreUI();
        scoreGained = true;

    } else {
        // الإجابة خاطئة (لون أحمر)
        inputs.forEach(input => {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        });
    }

    // التحقق من اكتمال المرحلة بعد كل محاولة
    if (scoreGained) {
        checkLevelCompletion();
    }
}

// وظيفة ربط الأحداث بمربعات الإدخال
function setupInputEvents(group) {
    const inputs = group.querySelectorAll('.cell');
    const correctAnswer = group.getAttribute('data-answer');

    inputs.forEach((input, index) => {

        // عند الكتابة في المربع
        input.addEventListener('input', (e) => {
            // إذا كتب حرف، ينتقل للمربع التالي
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            // بعد ما يخلص كتابة، نشيك على الإجابة
            checkAnswer(group, inputs, correctAnswer);
        });

        // عند مسح الحرف (Backspace)
        input.addEventListener('keydown', (e) => {
            // نسمح بإعادة المحاولة (نمسح الألوان)
            if (!group.classList.contains('solved')) {
                inputs.forEach(cell => {
                    cell.classList.remove('correct', 'incorrect');
                });
            }
            
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                // يرجع للمربع اللي قبله
                inputs[index - 1].focus();
            }
        });
    });
}

// وظيفة تحميل المرحلة
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showFinalScreen();
        return;
    }

    currentLevelIndex = levelIndex;
    const level = levels[currentLevelIndex];

    // تحديث عناوين المرحلة
    document.getElementById('current-level').textContent = toArabicNumerals(currentLevelIndex + 1);
    document.getElementById('level-title').textContent = level.title;

    // مسح الألغاز القديمة
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    // إضافة الألغاز الجديدة
    level.puzzles.forEach(puzzle => {
        const group = createPuzzleGroup(puzzle);
        gameArea.appendChild(group);
        setupInputEvents(group); // ربط الأحداث بكل مجموعة جديدة
    });

    updateProgressBar(); // تهيئة شريط التقدم
}

// وظيفة التحقق من اكتمال المرحلة
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
        // إظهار نافذة الانتصار
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
    // إعادة تعيين الشريط عند بدء مرحلة جديدة
    document.getElementById('progress-bar').style.width = '0%';
}

function showFinalScreen() {
    const finalModal = document.getElementById('final-modal');
    document.getElementById('final-score-display').textContent = toArabicNumerals(currentScore);
    finalModal.classList.remove('hidden');
}

// --- تهيئة اللعبة ---
document.addEventListener('DOMContentLoaded', () => {

    // ربط زر المرحلة التالية
    const nextLevelBtn = document.getElementById('next-level-btn');
    nextLevelBtn.addEventListener('click', () => {
        document.getElementById('victory-modal').classList.add('hidden');
        loadLevel(currentLevelIndex + 1);
    });
    
    // *** التعديل المهم هنا: نبدأ تحميل المرحلة 1 تلقائياً ***
    loadLevel(0);
});
