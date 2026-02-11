// Глобальные переменные
let questions = [];
let currentSession = {
    questions: [],
    currentIndex: 0,
    seriesSize: 0,
    correct: 0,
    incorrect: 0
};

// Загрузка и парсинг вопросов
async function loadQuestions() {
    try {
        const response = await fetch('questions.txt');
        const text = await response.text();
        questions = parseQuestions(text);
        console.log(`Загружено вопросов: ${questions.length}`);
        updateGlobalStats();
    } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
        alert('Ошибка загрузки вопросов. Проверьте файл questions.txt');
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

// Начало серии
function startSeries(size) {
    currentSession = {
        questions: generateSeries(size),
        currentIndex: 0,
        seriesSize: size,
        correct: 0,
        incorrect: 0
    };
    
    document.getElementById('totalInSeries').textContent = size;
    showScreen('testScreen');
    showQuestion();
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
    
    const correct = question.correctAnswers.sort().join(',');
    const answer = selected.sort().join(',');
    const isCorrect = correct === answer;
    
    // Обновление статистики
    if (isCorrect) {
        currentSession.correct++;
    } else {
        currentSession.incorrect++;
    }
    updateQuestionStats(question.id, isCorrect);
    
    // Визуальная обратная связь
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.add('disabled');
        const letter = opt.dataset.letter;
        
        if (question.correctAnswers.includes(letter)) {
            opt.classList.add('correct');
        } else if (selected.includes(letter)) {
            opt.classList.add('incorrect');
        }
    });
    
    // Показ обратной связи
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback show ' + (isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        feedback.innerHTML = '<div class="feedback-title">✓ Правильно!</div>';
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
    
    if (currentSession.currentIndex < currentSession.questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Показ результатов
function showResults() {
    const correct = currentSession.correct;
    const total = currentSession.seriesSize;
    const percentage = Math.round((correct / total) * 100);
    
    document.getElementById('resultPercentage').textContent = percentage + '%';
    document.getElementById('resultFraction').textContent = `${correct}/${total}`;
    document.getElementById('resultCorrect').textContent = correct;
    document.getElementById('resultIncorrect').textContent = currentSession.incorrect;
    
    // Анимация круга
    const circumference = 339.292;
    const offset = circumference - (percentage / 100) * circumference;
    const circle = document.getElementById('resultCircle');
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
    
    updateGlobalStats();
    showScreen('resultsScreen');
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
    
    // Обработчики кнопок выбора серии
    document.querySelectorAll('.series-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const count = parseInt(btn.dataset.count);
            startSeries(count);
        });
    });
    
    // Обработчики кнопок управления
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('exitTestBtn').addEventListener('click', () => {
        if (confirm('Выйти из теста? Прогресс будет потерян.')) {
            showScreen('startScreen');
        }
    });
    
    // Результаты
    document.getElementById('repeatBtn').addEventListener('click', () => {
        startSeries(currentSession.seriesSize);
    });
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        showScreen('startScreen');
    });
    
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
