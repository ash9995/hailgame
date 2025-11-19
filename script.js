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

// --- متغيرات الحالة العالمية ---
let currentLevelIndex = 0;
let currentScore = 0;

// تشغيل اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // *نقطة التفعيل الأساسية*: البدء بتحميل المرحلة الأولى هنا
    loadLevel(currentLevelIndex);
    
    // ربط زر الانتقال للمرحلة التالية
    document.getElementById('next-level-btn').addEventListener('click', () => {
        // إخفاء النافذة المنبثقة
        document.getElementById('victory-modal').classList.add('hidden');
        
        // الانتقال للمرحلة التالية
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            loadLevel(currentLevelIndex);
        } else {
            // انتهت جميع المراحل
            showFinalScreen();
        }
    });
});

// وظيفة تحميل المرحلة
function loadLevel(index) {
    const levelData = levels[index];
    const gameArea = document.getElementById('game-area');
    
    // تنظيف منطقة الألغاز
    gameArea.innerHTML = '';

    // تحديث واجهة المستخدم
    document.getElementById('current-level').textContent = toArabicNumerals(index + 1);
    document.getElementById('level-title').textContent = levelData.title;

    // تحديث إجمالي عدد المراحل في العنوان
    const levelIndicator = document.querySelector('.level-indicator span:last-child');
    if (levelIndicator) {
        levelIndicator.textContent = toArabicNumerals(levels.length);
    }
    
    updateProgressBar();
    
    // بناء الألغاز الجديدة
    levelData.puzzles.forEach(puzzle => {
        const group = createPuzzleGroup(puzzle.clue, puzzle.answer);
        gameArea.appendChild(group);
    });

    // إضافة منطق التفاعل للمربعات الجديدة
    addPuzzleInteractionLogic();
}

// دالة مساعدة لإنشاء مجموعة ألغاز HTML
function createPuzzleGroup(clue, answer) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'word-group';
    groupDiv.setAttribute('data-answer', answer);

    const clueDiv = document.createElement('div');
    clueDiv.className = 'clue';
    clueDiv.textContent = clue;
    
    const inputsDiv = document.createElement('div');
    inputsDiv.className = 'inputs';

    // إنشاء مربعات الإدخال بعدد حروف الإجابة
    for (let i = 0; i < answer.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.className = 'cell';
        inputsDiv.appendChild(input);
    }

    groupDiv.appendChild(clueDiv);
    groupDiv.appendChild(inputsDiv);
    return groupDiv;
}

// دالة تضيف المستمعات (Listeners) لجميع مربعات الألغاز
function addPuzzleInteractionLogic() {
    const wordGroups = document.querySelectorAll('.word-group');

    wordGroups.forEach(group => {
        const inputs = group.querySelectorAll('.cell');
        const correctAnswer = group.getAttribute('data-answer');

        inputs.forEach((input, index) => {
            
            // عند الكتابة في المربع
            input.oninput = () => {
                // تحويل الحرف المُدخل إلى حرف عربي وتأكيد حرف واحد
                input.value = input.value.trim().charAt(0);
                
                // الانتقال للمربع التالي إذا تم الإدخال
                if (input.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }

                // التحقق من الإجابة بعد كل إدخال
                checkAnswer(group, inputs, correctAnswer);
            };

            // عند مسح الحرف (Backspace)
            input.onkeydown = (e) => {
                // نمسح الألوان لتشجيع المحاولة الجديدة
                inputs.forEach(cell => {
                    cell.classList.remove('correct', 'incorrect');
                });
                group.classList.remove('solved');

                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    // يرجع للمربع اللي قبله
                    e.preventDefault(); // منع الحذف الافتراضي بعد العودة
                    inputs[index - 1].focus();
                    inputs[index - 1].value = ''; // مسح قيمة المربع السابق
                    
                }
            };
        });
    });
}

// وظيفة التحقق من الإجابة
function checkAnswer(group, inputs, correctAnswer) {
    let userAnswer = '';
    let allFilled = true; // نفترض أن كل المربعات مليانة

    inputs.forEach(input => {
        // نجمع الأحرف بعد إزالة المسافات
        userAnswer += input.value.trim();
        if (input.value.length === 0) {
            allFilled = false; // لا، فيه مربع فاضي
        }
    });

    // لا تتحقق إلا إذا عبأ المستخدم جميع المربعات
    if (!allFilled) {
        return; 
    }

    // المستخدم عبأ كل المربعات، نبدأ التصحيح
    // للمقارنة الصحيحة: نقوم بتنظيف الإجابة الصحيحة من المسافات
    const cleanedCorrectAnswer = correctAnswer.replace(/\s/g, '');
    const cleanedUserAnswer = userAnswer.replace(/\s/g, '');


    if (cleanedUserAnswer === cleanedCorrectAnswer) {
        // الإجابة صحيحة (لون أخضر)
        if (!group.classList.contains('solved')) {
             currentScore += 10; // زيادة النقاط مرة واحدة
             updateScoreUI();
        }
        inputs.forEach(input => {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            input.readOnly = true; // منع التعديل بعد الحل
        });
        group.classList.add('solved');
        
        // التحقق من اكتمال المرحلة
        checkLevelCompletion();

    } else {
        // الإجابة خاطئة (لون أحمر)
        inputs.forEach(input => {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        });
        // لا نقلل النقاط، فقط نتركهم يحاولون مرة أخرى
    }
}

// دالة التحقق من اكتمال المرحلة الحالية
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
            // تأكد من تحديث نص الزر إذا كانت هذه هي المرحلة الأخيرة
            if (currentLevelIndex + 1 === levels.length) {
                document.getElementById('next-level-btn').textContent = "إنهاء اللعبة";
            } else {
                document.getElementById('next-level-btn').textContent = "المرحلة التالية";
            }
        }, 500);
    }
}

function updateScoreUI() {
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = toArabicNumerals(currentScore);
    // تم تغيير اللون ليتوافق مع متغيرات CSS الجديدة
    scoreEl.style.color = 'var(--correct-green)'; 
    setTimeout(() => scoreEl.style.color = 'var(--text-dark)', 500); 
}

function updateProgressBar() {
    // إعادة تعيين الشريط عند بدء مرحلة جديدة
    document.getElementById('progress-bar').style.width = '0%';
}

function showFinalScreen() {
    const finalModal = document.getElementById('final-modal');
    document.getElementById('final-score-display').textContent = toArabicNumerals(currentScore);
    finalModal.classList.remove('hidden');
    // إخفاء زر المرحلة التالية وتغيير نص الزر
    document.getElementById('next-level-btn').style.display = 'none';
}

// دالة مساعدة لتحويل الأرقام إلى عربية
function toArabicNumerals(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).split('').map(digit => arabicDigits[digit]).join('');
}
