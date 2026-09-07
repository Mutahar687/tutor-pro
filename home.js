// Quiz Questions
const quizQuestions = [
    {
        question: "What's your preferred learning style?",
        options: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"]
    },
    {
        question: "Which subject area do you want to improve in?",
        options: ["Mathematics", "Sciences", "Languages", "History"]
    },
    {
        question: "How much time can you dedicate to studying per week?",
        options: ["1-3 hours", "4-6 hours", "7-10 hours", "10+ hours"]
    }
];

// Quiz State
let currentQuestion = 0;
let userAnswers = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('quizModal');
    const closeBtn = document.querySelector('.close');
    const demoQuizBtn = document.querySelector('.secondary-cta');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Show quiz modal after 5 seconds
    setTimeout(() => {
        modal.style.display = 'flex';
        showQuestion();
    }, 5000);
    
    // Close modal when clicking the close button
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Show quiz when clicking demo quiz button
    demoQuizBtn.onclick = () => {
        currentQuestion = 0;
        userAnswers = [];
        modal.style.display = 'flex';
        showQuestion();
    };
    
    // Mobile navigation toggle
    navToggle.onclick = () => {
        navLinks.classList.toggle('show');
    };
    
    // Initialize stats animation
    initializeStatsAnimation();
});

// Quiz Functions
function showQuestion() {
    const question = quizQuestions[currentQuestion];
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const progressBar = document.querySelector('.progress');
    
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestion + 1;
    progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    
    // Clear previous options
    answerOptions.innerHTML = '';
    
    // Create new option buttons
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => handleAnswer(option);
        answerOptions.appendChild(button);
    });
}

function handleAnswer(answer) {
    userAnswers.push(answer);
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        completeQuiz();
    }
}

function completeQuiz() {
    const modal = document.getElementById('quizModal');
    const modalContent = document.querySelector('.modal-content');
    
    // Create personalized message based on answers
    const learningStyle = userAnswers[0];
    const subject = userAnswers[1];
    const timeCommitment = userAnswers[2];
    
    modalContent.innerHTML = `
        <h2>Perfect! We've Got Your Profile</h2>
        <div class="quiz-results">
            <p>Based on your responses, we recommend:</p>
            <ul>
                <li>Learning Style: ${learningStyle}-based materials</li>
                <li>Focus Area: ${subject}</li>
                <li>Weekly Schedule: ${timeCommitment}</li>
            </ul>
            <p>Ready to start your personalized learning journey?</p>
            <button onclick="startLearning()" class="primary-cta">Create My Study Plan</button>
        </div>
    `;
}

function startLearning() {
    window.location.href = 'study.html';
}

// Stats Animation
function initializeStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateStat(stat) {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateStat = () => {
        current += step;
        if (current < target) {
            stat.textContent = Math.round(current);
            requestAnimationFrame(updateStat);
        } else {
            stat.textContent = target;
        }
    };
    
    requestAnimationFrame(updateStat);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});