// Глобальные переменные
let questions = [];
let currentSession = {
    questions: [],
    currentIndex: 0,
    correct: 0,
    incorrect: 0,
    isActive: false
};

// Встроенные вопросы (данные загружаются из отдельного файла questionsData.js)
// Если файл questionsData.js существует, он перезапишет эту переменную
let questionsText = `Q: Какой нормальный диапазон артериального давления для взрослого человека?
A: 90/60 - 120/80 мм рт.ст.
B: 140/90 - 160/100 мм рт.ст.
C: 120/80 - 140/90 мм рт.ст.
D: 80/50 - 100/70 мм рт.ст.
CORRECT: A

Q: Признаки острого инфаркта миокарда (может быть несколько)?
A: Интенсивная боль за грудиной
B: Высокая температура тела
C: Одышка и затрудненное дыхание
D: Холодный пот
E: Сильная головная боль
CORRECT: A,C,D

Q: Что означает аббревиатура ЭКГ?
A: Электрокардиограмма
B: Эхокардиография
C: Электроэнцефалограмма
D: Эндоскопическая кардиография
CORRECT: A

Q: Какая нормальная частота сердечных сокращений в покое у взрослого?
A: 40-50 ударов в минуту
B: 60-100 ударов в минуту
C: 100-120 ударов в минуту
D: 120-140 ударов в минуту
CORRECT: B

Q: Симптомы гипогликемии (низкий уровень сахара в крови)?
A: Потливость
B: Дрожь в руках
C: Сухость во рту
D: Головокружение
E: Учащенное сердцебиение
CORRECT: A,B,D,E

Q: Что такое анафилактический шок?
A: Острая аллергическая реакция угрожающая жизни
B: Потеря сознания от удара
C: Сердечный приступ
D: Инсульт
CORRECT: A

Q: Нормальная температура тела человека (в градусах Цельсия)?
A: 35.5 - 36.0
B: 36.0 - 36.5
C: 36.5 - 37.2
D: 37.5 - 38.0
CORRECT: C

Q: Первая помощь при переломе конечности включает?
A: Иммобилизацию поврежденной конечности
B: Вправление перелома на месте
C: Наложение холодного компресса
D: Обезболивание при возможности
E: Транспортировку в медицинское учреждение
CORRECT: A,C,D,E

Q: Какой орган вырабатывает инсулин?
A: Печень
B: Поджелудочная железа
C: Щитовидная железа
D: Надпочечники
CORRECT: B

Q: Признаки инсульта по тесту FAST?
A: Face (асимметрия лица)
B: Arm (слабость в руке)
C: Speech (нарушение речи)
D: Time (время звонить в скорую)
CORRECT: A,B,C,D

Q: Что такое тахикардия?
A: Учащенное сердцебиение (более 100 уд/мин)
B: Замедленное сердцебиение (менее 60 уд/мин)
C: Нерегулярное сердцебиение
D: Остановка сердца
CORRECT: A

Q: Нормальная частота дыхания взрослого человека в покое?
A: 8-10 вдохов в минуту
B: 12-20 вдохов в минуту
C: 25-30 вдохов в минуту
D: 30-40 вдохов в минуту
CORRECT: B

Q: Что такое цианоз?
A: Посинение кожи и слизистых из-за недостатка кислорода
B: Покраснение кожи
C: Пожелтение кожи
D: Побледнение кожи
CORRECT: A

Q: Признаки сотрясения мозга?
A: Кратковременная потеря сознания
B: Головная боль
C: Тошнота и рвота
D: Повышение температуры
E: Головокружение
CORRECT: A,B,C,E

Q: Что такое артериальная гипертензия?
A: Повышенное артериальное давление
B: Пониженное артериальное давление
C: Нормальное артериальное давление
D: Нестабильное артериальное давление
CORRECT: A`;

// Загрузка и парсинг вопросов
async function loadQuestions() {
    try {
        // Пытаемся загрузить из внешнего файла (опционально)
        try {
            const response = await fetch('questions.txt');
            if (response.ok) {
                const text = await response.text();
                if (text.trim()) {
                    questionsText = text;
                    console.log('Вопросы загружены из questions.txt');
                }
            }
        } catch (fetchError) {
            console.log('Используются встроенные вопросы');
        }
        
        questions = parseQuestions(questionsText);
        console.log(`Загружено вопросов: ${questions.length}`);
        
        if (questions.length === 0) {
            throw new Error('Не удалось распарсить вопросы');
        }
        
        updateGlobalStats();
    } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
        alert('Ошибка загрузки вопросов. Проверьте консоль браузера для деталей.');
    }
}

// Парсинг текстового формата
function parseQuestions(text) {
    const questionBlocks = text.trim().split('\n\n').filter(block => block.trim());
    const parsed = [];

    questionBlocks.forEach((block, index) => {
        const lines = block.split('\n').filter(line => line.trim());
        const question = {
            id: index,
            text: '',
            answers: [],
            correctAnswers: []
        };

        lines.forEach(line => {
            if (line.startsWith('Q:')) {
                question.text = line.substring(2).trim();
            } else if (line.match(/^[A-Z]:/)) {
                const letter = line[0];
                const text = line.substring(2).trim();
                question.answers.push({ letter, text });
            } else if (line.startsWith('CORRECT:')) {
                const correct = line.substring(8).trim();
                question.correctAnswers = correct.split(',').map(c => c.trim());
            }
        });

        if (question.text && question.answers.length > 0) {
            parsed.push(question);
        }
    });

    return parsed;
}

// Система весов вопросов
function getQuestionWeight(questionId) {
    const stats = getQuestionStats(questionId);
    if (stats.attempts === 0) return 1;
    
    const errorRate = stats.incorrect / stats.attempts;
    // Вопросы с большим количеством ошибок имеют больший вес
    return 1 + (errorRate * 3);
}

// Выбор вопроса с учетом весов
function selectWeightedQuestion(availableQuestions) {
    const weights = availableQuestions.map(q => getQuestionWeight(q.id));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < availableQuestions.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return availableQuestions[i];
        }
    }
    
    return availableQuestions[availableQuestions.length - 1];
}

// Генерация серии вопросов
function generateSeries(size) {
    const usedIds = new Set();
    const series = [];
    const availableQuestions = [...questions];
    
    // Перемешиваем вопросы
    for (let i = availableQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]];
    }
    
    while (series.length < size && availableQuestions.length > 0) {
        const question = selectWeightedQuestion(availableQuestions);
        series.push(question);
        usedIds.add(question.id);
        
        // Удаляем использованный вопрос
        const index = availableQuestions.findIndex(q => q.id === question.id);
        availableQuestions.splice(index, 1);
    }
    
    return series;
}

// LocalStorage функции
function getProgress() {
    const data = localStorage.getItem('medicalTestProgress');
    return data ? JSON.parse(data) : { stats: {}, global: { total: 0, correct: 0 } };
}

function saveProgress(progress) {
    localStorage.setItem('medicalTestProgress', JSON.stringify(progress));
}

function getQuestionStats(questionId) {
    const progress = getProgress();
    return progress.stats[questionId] || { attempts: 0, correct: 0, incorrect: 0 };
}

function updateQuestionStats(questionId, isCorrect) {
    const progress = getProgress();
    
    if (!progress.stats[questionId]) {
        progress.stats[questionId] = { attempts: 0, correct: 0, incorrect: 0 };
    }
    
    progress.stats[questionId].attempts++;
    if (isCorrect) {
        progress.stats[questionId].correct++;
        progress.global.correct++;
    } else {
        progress.stats[questionId].incorrect++;
    }
    progress.global.total++;
    
    saveProgress(progress);
}

function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        localStorage.removeItem('medicalTestProgress');
        updateGlobalStats();
        alert('Прогресс сброшен');
    }
}

// Обновление глобальной статистики
function updateGlobalStats() {
    const progress = getProgress();
    const total = progress.global.total || 0;
    const correct = progress.global.correct || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    document.getElementById('totalQuestions').textContent = total;
    document.getElementById('totalCorrect').textContent = correct;
    document.getElementById('totalAccuracy').textContent = accuracy + '%';
}

// Показ экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Начало серии (бесконечный режим)
function startSeries() {
    currentSession = {
        questions: [],
        currentIndex: 0,
        correct: 0,
        incorrect: 0,
        isActive: true
    };
    
    // Генерируем первый вопрос
    addNextQuestion();
    
    showScreen('testScreen');
    showQuestion();
}

// Добавление следующего вопроса в серию
function addNextQuestion() {
    const availableQuestions = questions.filter(q => 
        !currentSession.questions.some(sq => sq.id === q.id)
    );
    
    // Если все вопросы использованы, начинаем заново
    if (availableQuestions.length === 0) {
        currentSession.questions = [];
        addNextQuestion();
        return;
    }
    
    const nextQuestion = selectWeightedQuestion(availableQuestions);
    currentSession.questions.push(nextQuestion);
}

// Показ вопроса
function showQuestion() {
    const question = currentSession.questions[currentSession.currentIndex];
    const isMultiple = question.correctAnswers.length > 1;
    
    document.getElementById('currentQuestion').textContent = currentSession.currentIndex + 1;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('sessionCorrect').textContent = currentSession.correct;
    document.getElementById('sessionIncorrect').textContent = currentSession.incorrect;
    
    // Отображение ответов
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    question.answers.forEach(answer => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.dataset.letter = answer.letter;
        
        if (isMultiple) {
            div.innerHTML = `
                <div class="answer-checkbox"></div>
                <span>${answer.letter}. ${answer.text}</span>
            `;
        } else {
            div.innerHTML = `<span>${answer.letter}. ${answer.text}</span>`;
        }
        
        div.addEventListener('click', () => selectAnswer(div, isMultiple));
        container.appendChild(div);
    });
    
    // Сброс кнопок и обратной связи
    document.getElementById('submitBtn').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
}

// Выбор ответа
function selectAnswer(element, isMultiple) {
    if (element.classList.contains('disabled')) return;
    
    if (isMultiple) {
        element.classList.toggle('selected');
    } else {
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');
    }
    
    // Активируем кнопку проверки, если есть выбор
    const hasSelection = document.querySelector('.answer-option.selected');
    document.getElementById('submitBtn').disabled = !hasSelection;
}

// Проверка ответа
function checkAnswer() {
    const question = currentSession.questions[currentSession.currentIndex];
    const selected = Array.from(document.querySelectorAll('.answer-option.selected'))
        .map(opt => opt.dataset.letter);
    
    const correctSet = new Set(question.correctAnswers);
    const selectedSet = new Set(selected);
    
    // Определяем тип ответа
    let isFullyCorrect = correctSet.size === selectedSet.size && 
                         [...correctSet].every(c => selectedSet.has(c));
    
    let hasCorrect = selected.some(s => correctSet.has(s));
    let hasIncorrect = selected.some(s => !correctSet.has(s));
    let missedCorrect = [...correctSet].some(c => !selectedSet.has(c));
    
    let answerType;
    if (isFullyCorrect) {
        answerType = 'correct';
        currentSession.correct++;
    } else if (hasCorrect && (hasIncorrect || missedCorrect)) {
        answerType = 'partial';
        currentSession.incorrect++;
    } else {
        answerType = 'incorrect';
        currentSession.incorrect++;
    }
    
    // Обновление статистики
    updateQuestionStats(question.id, isFullyCorrect);
    
    // Визуальная обратная связь
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.add('disabled');
        const letter = opt.dataset.letter;
        
        if (correctSet.has(letter) && selectedSet.has(letter)) {
            // Выбран и правильный
            opt.classList.add('correct');
        } else if (correctSet.has(letter) && !selectedSet.has(letter)) {
            // Правильный, но не выбран
            opt.classList.add('correct');
            opt.style.opacity = '0.7';
        } else if (!correctSet.has(letter) && selectedSet.has(letter)) {
            // Выбран, но неправильный
            opt.classList.add('incorrect');
        } else if (!correctSet.has(letter) && selectedSet.has(letter)) {
            // Неправильный и выбран
            opt.classList.add('partial');
        }
    });
    
    // Показ обратной связи
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback show ' + answerType;
    
    if (answerType === 'correct') {
        feedback.innerHTML = '<div class="feedback-title">✓ Правильно!</div>';
    } else if (answerType === 'partial') {
        const correctText = question.correctAnswers
            .map(letter => {
                const ans = question.answers.find(a => a.letter === letter);
                return `${letter}. ${ans.text}`;
            })
            .join('<br>');
        feedback.innerHTML = `
            <div class="feedback-title">⚠ Частично правильно</div>
            <div>Полный правильный ответ:<br>${correctText}</div>
        `;
    } else {
        const correctText = question.correctAnswers
            .map(letter => {
                const ans = question.answers.find(a => a.letter === letter);
                return `${letter}. ${ans.text}`;
            })
            .join('<br>');
        feedback.innerHTML = `
            <div class="feedback-title">✗ Неправильно</div>
            <div>Правильный ответ:<br>${correctText}</div>
        `;
    }
    
    // Обновление счетчика
    document.getElementById('sessionCorrect').textContent = currentSession.correct;
    document.getElementById('sessionIncorrect').textContent = currentSession.incorrect;
    
    // Переключение кнопок
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
}

// Следующий вопрос
function nextQuestion() {
    currentSession.currentIndex++;
    
    // Генерируем новый вопрос, если достигли конца текущего списка
    if (currentSession.currentIndex >= currentSession.questions.length) {
        addNextQuestion();
    }
    
    showQuestion();
}

// Завершение теста
function endTest() {
    if (!currentSession.isActive) return;
    
    if (confirm('Закончить тест? Результаты будут сохранены в статистике.')) {
        currentSession.isActive = false;
        updateGlobalStats();
        showScreen('startScreen');
    }
}

// Показ детальной статистики
function showDetailedStats() {
    const progress = getProgress();
    const total = progress.global.total || 0;
    const correct = progress.global.correct || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    document.getElementById('statsTotal').textContent = total;
    document.getElementById('statsCorrect').textContent = correct;
    document.getElementById('statsAccuracy').textContent = accuracy + '%';
    
    // Сложные вопросы (с ошибками)
    const difficultContainer = document.getElementById('difficultQuestions');
    difficultContainer.innerHTML = '';
    
    const difficultQuestions = questions
        .map(q => ({
            question: q,
            stats: getQuestionStats(q.id)
        }))
        .filter(item => item.stats.incorrect > 0)
        .sort((a, b) => {
            const rateA = a.stats.incorrect / a.stats.attempts;
            const rateB = b.stats.incorrect / b.stats.attempts;
            return rateB - rateA;
        })
        .slice(0, 10);
    
    if (difficultQuestions.length === 0) {
        difficultContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Пока нет ошибок. Отличная работа!</p>';
    } else {
        difficultQuestions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'difficult-question-item';
            const errorRate = Math.round((item.stats.incorrect / item.stats.attempts) * 100);
            
            div.innerHTML = `
                <div class="difficult-question-text">${item.question.text}</div>
                <div class="difficult-question-stats">
                    <span>Попыток: ${item.stats.attempts}</span>
                    <span>Ошибок: ${item.stats.incorrect}</span>
                    <span>Процент ошибок: ${errorRate}%</span>
                </div>
            `;
            difficultContainer.appendChild(div);
        });
    }
    
    showScreen('statsScreen');
}

// Управление темой
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    initTheme();
    
    // Обработчик кнопки старта теста
    document.getElementById('startTestBtn').addEventListener('click', () => {
        startSeries();
    });
    
    // Обработчики кнопок управления
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('exitTestBtn').addEventListener('click', endTest);
    
    // Статистика
    document.getElementById('showStatsBtn').addEventListener('click', showDetailedStats);
    document.getElementById('closeStatsBtn').addEventListener('click', () => {
        showScreen('startScreen');
    });
    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);
    
    // Тема
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Клавиатурные shortcuts
    document.addEventListener('keydown', (e) => {
        const currentScreen = document.querySelector('.screen.active').id;
        
        if (currentScreen === 'testScreen') {
            if (e.key === 'Enter' && !document.getElementById('submitBtn').disabled) {
                if (document.getElementById('submitBtn').style.display !== 'none') {
                    checkAnswer();
                } else {
                    nextQuestion();
                }
            }
            
            // Числовые клавиши для выбора ответов
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                const options = document.querySelectorAll('.answer-option');
                if (options[num - 1] && !options[num - 1].classList.contains('disabled')) {
                    const question = currentSession.questions[currentSession.currentIndex];
                    const isMultiple = question.correctAnswers.length > 1;
                    selectAnswer(options[num - 1], isMultiple);
                }
            }
        }
    });
});
