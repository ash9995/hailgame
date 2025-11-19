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
            { answer: "برزان", clue: "٣. قصر وحي تاريخي قديم في حائل (٥ حروف)" },
            { answer: "فيد", clue: "٤. مدينة تاريخية قديمة تقع على طريق الحج (٣ حروف)" }
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
