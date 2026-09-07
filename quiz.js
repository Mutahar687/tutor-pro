// Quiz Data Structure
const quizData = {
    mathematics: {
        title: "Mathematics Quiz",
        questions: [
            {
                question: "What is the derivative of x²?",
                options: ["x", "2x", "x²", "2"],
                correct: 1
            },
            {
                question: "What is the value of π (pi) to two decimal places?",
                options: ["3.14", "3.16", "3.12", "3.18"],
                correct: 0
            },
            // Add more questions...
        ]
    },
    sciences: {
        title: "Sciences Quiz",
        questions: [
            {
                question: "What is the chemical symbol for gold?",
                options: ["Au", "Ag", "Fe", "Cu"],
                correct: 0
            },
            {
                question: "What is the speed of light in meters per second?",
                options: ["299,792,458", "300,000,000", "299,999,999", "298,792,458"],
                correct: 0
            },
            // Add more questions...
        ]
    },
    // Add more subjects...
};

// Quiz State
let currentSubject = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let timeLeft = 1800; // 30 minutes in seconds

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Subject Selection
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.dataset.subject;
            startQuiz(subject);
        });
    });

    // Quiz Navigation
    document.getElementById('prevQuestion').addEventListener('click', showPreviousQuestion);
    document.getElementById('nextQuestion').addEventListener('click', showNextQuestion);
    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);

    // Results Modal
    const modal = document.getElementById('resultsModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';

    // AI Assistant
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.querySelector('.ai-chat-container');
    const minimizeBtn = document.querySelector('.minimize');
    
    aiToggle.onclick = () => {
        aiChat.style.display = aiChat.style.display === 'none' ? 'block' : 'none';
    };
    
    minimizeBtn.onclick = () => {
        aiChat.style.display = 'none';
    };

    // AI Chat Input
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    
    aiSend.onclick = () => {
        const message = aiInput.value.trim();
        if (message) {
            sendAIMessage(message);
            aiInput.value = '';
        }
    };

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            aiSend.click();
        }
    });
});

// Quiz Functions
function startQuiz(subject) {
    currentSubject = subject;
    currentQuestions = [...quizData[subject].questions];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);

    // Update UI
    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quizInterface').style.display = 'block';
    document.getElementById('subjectTitle').textContent = quizData[subject].title;
    document.getElementById('totalQuestions').textContent = currentQuestions.length;

    // Start timer
    startTimer();
    showQuestion();
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;

    // Create options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = `option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`;
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });

    // Update navigation buttons
    document.getElementById('prevQuestion').disabled = currentQuestionIndex === 0;
    document.getElementById('nextQuestion').style.display = currentQuestionIndex === currentQuestions.length - 1 ? 'none' : 'block';
    document.getElementById('submitQuiz').style.display = currentQuestionIndex === currentQuestions.length - 1 ? 'block' : 'none';
}

function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    showQuestion(); // Refresh UI to show selected option
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function startTimer() {
    clearInterval(quizTimer);
    timeLeft = 1800; // Reset to 30 minutes
    updateTimerDisplay();
    
    quizTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timeLeft').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function submitQuiz() {
    clearInterval(quizTimer);
    
    // Calculate results
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuestions[index].correct) {
            correctCount++;
        }
    });

    const score = Math.round((correctCount / currentQuestions.length) * 100);
    const timeTaken = 1800 - timeLeft;
    const performanceLevel = getPerformanceLevel(score);

    // Update results modal
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('correctAnswers').textContent = `${correctCount}/${currentQuestions.length}`;
    document.getElementById('timeTaken').textContent = formatTime(timeTaken);
    document.getElementById('performanceLevel').textContent = performanceLevel;
    
    // Generate AI feedback
    generateAIFeedback(score, userAnswers);

    // Show modal
    document.getElementById('resultsModal').style.display = 'flex';
}

function getPerformanceLevel(score) {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Intermediate';
    if (score >= 60) return 'Basic';
    return 'Needs Improvement';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function generateAIFeedback(score, answers) {
    let feedback = '';
    
    if (score >= 90) {
        feedback = 'Excellent performance! Consider exploring more advanced topics.';
    } else if (score >= 70) {
        feedback = 'Good work! Focus on the questions you missed to improve further.';
    } else {
        feedback = 'Keep practicing! Let\'s review the fundamental concepts together.';
    }

    document.querySelector('#aiFeedback p').textContent = feedback;
}

// AI Assistant Functions
function sendAIMessage(message) {
    // Add user message
    addChatMessage('user', message);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage('ai', response);
    }, 1000);
}

function addChatMessage(type, message) {
    const messagesContainer = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    // Simulate AI responses (replace with actual AI integration)
    const responses = [
        "I can help you with that! Let's break down this concept...",
        "Good question! Here's what you need to know...",
        "Let me explain this in a simpler way...",
        "That's an interesting point! Consider this perspective..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}