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



// --- المتغيرات العامة ---
let currentLevelIndex = 0;
let currentScore = 0;

// --- التشغيل الأساسي (Main Execution) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Game Loaded");
    initGame();
});

function initGame() {
    // تحميل المرحلة الأولى
    loadLevel(currentLevelIndex);

    // إعداد زر المرحلة التالية
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
    if (!gameArea) {
        console.error("عنصر game-area غير موجود!");
        return;
    }

    const levelData = levels[index];
    
    // تنظيف المنطقة
    gameArea.innerHTML = '';

    // تحديث النصوص
    document.getElementById('current-level').textContent = toArabicNumerals(index + 1);
    document.getElementById('level-title').textContent = levelData.title;
    
    // تحديث شريط التقدم (تصفيره)
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

    // السؤال
    const clue = document.createElement('div');
    clue.className = 'clue';
    clue.textContent = puzzle.clue;
    group.appendChild(clue);

    // المربعات
    const inputs = document.createElement('div');
    inputs.className = 'inputs';

    for (let i = 0; i < puzzle.answer.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.className = 'cell';
        
        // إضافة منطق التفاعل مباشرة
        addInputLogic(input, i, puzzle.answer.length, group, puzzle.answer);
        
        inputs.appendChild(input);
    }

    group.appendChild(inputs);
    return group;
}

// --- دالة إضافة منطق التفاعل لكل مربع ---
function addInputLogic(input, index, totalLength, group, correctAnswer) {
    // عند الكتابة
    input.addEventListener('input', (e) => {
        if (input.value.length === 1) {
            // الانتقال للمربع التالي
            const nextInput = group.querySelectorAll('.cell')[index + 1];
            if (nextInput) nextInput.focus();
            
            // التحقق من الحل
            checkAnswer(group, correctAnswer);
        }
    });

    // عند المسح أو الأسهم
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value.length === 0) {
            const prevInput = group.querySelectorAll('.cell')[index - 1];
            if (prevInput) prevInput.focus();
        }
        
        // مسح حالة الخطأ/الصحة عند التعديل
        if (!group.classList.contains('solved')) {
            group.querySelectorAll('.cell').forEach(c => {
                c.classList.remove('correct', 'incorrect');
            });
        }
    });
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

    // تنظيف النصوص للمقارنة
    const cleanUser = userAnswer.replace(/\s/g, '');
    const cleanCorrect = correctAnswer.replace(/\s/g, '');

    if (cleanUser === cleanCorrect) {
        // إجابة صحيحة
        if (!group.classList.contains('solved')) {
            currentScore += 10;
            updateScoreUI();
        }
        
        group.classList.add('solved');
        inputs.forEach(inp => {
            inp.classList.remove('incorrect');
            inp.classList.add('correct');
            inp.readOnly = true; // قفل المربع
        });

        checkLevelCompletion();
    } else {
        // إجابة خاطئة
        inputs.forEach(inp => {
            inp.classList.add('incorrect');
        });
    }
}

// --- دالة التحقق من اكتمال المرحلة ---
function checkLevelCompletion() {
    const totalPuzzles = document.querySelectorAll('.word-group').length;
    const solvedPuzzles = document.querySelectorAll('.word-group.solved').length;

    // تحديث الشريط
    const percent = (solvedPuzzles / totalPuzzles) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;

    if (solvedPuzzles === totalPuzzles) {
        setTimeout(() => {
            document.getElementById('victory-modal').classList.remove('hidden');
            
            // تحديث نص الزر في المرحلة الأخيرة
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
    document.getElementById('score').textContent = toArabicNumerals(currentScore);
}

function showFinalScreen() {
    document.getElementById('final-score-display').textContent = toArabicNumerals(currentScore);
    document.getElementById('final-modal').classList.remove('hidden');
}

function toArabicNumerals(n) {
    return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}
