// Study Plan Generator
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Form Submission
    const preferencesForm = document.getElementById('preferencesForm');
    const generateButton = document.getElementById('generatePlan');
    
    generateButton.addEventListener('click', () => {
        const studyGoal = document.getElementById('studyGoal').value;
        const timeCommitment = document.getElementById('timeCommitment').value;
        const learningMethods = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
            .map(checkbox => checkbox.value);

        if (validateForm(studyGoal, timeCommitment, learningMethods)) {
            generateStudyPlan(studyGoal, timeCommitment, learningMethods);
        }
    });

    // AI Assistant
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.querySelector('.ai-chat-container');
    const minimizeBtn = document.querySelector('.minimize');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');

    aiToggle.onclick = () => {
        aiChat.style.display = aiChat.style.display === 'none' ? 'block' : 'none';
    };

    minimizeBtn.onclick = () => {
        aiChat.style.display = 'none';
    };

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

    // Action Buttons
    document.getElementById('savePlan').addEventListener('click', savePlan);
    document.getElementById('sharePlan').addEventListener('click', sharePlan);
    document.getElementById('printPlan').addEventListener('click', printPlan);
});

// Form Validation
function validateForm(goal, time, methods) {
    if (!goal) {
        showError('Please select a study goal');
        return false;
    }
    if (!time || time < 1 || time > 168) {
        showError('Please enter a valid time commitment (1-168 hours)');
        return false;
    }
    if (methods.length === 0) {
        showError('Please select at least one learning method');
        return false;
    }
    return true;
}

function showError(message) {
    // Implement error notification system
    alert(message);
}

// Study Plan Generation
function generateStudyPlan(goal, time, methods) {
    // Show loading state
    document.getElementById('generatePlan').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    // Simulate API call delay
    setTimeout(() => {
        const plan = createPersonalizedPlan(goal, time, methods);
        displayStudyPlan(plan);
        document.getElementById('generatePlan').innerHTML = '<i class="fas fa-magic"></i> Generate Study Plan';
        document.getElementById('studyPlan').style.display = 'block';
        
        // Scroll to plan
        document.getElementById('studyPlan').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

function createPersonalizedPlan(goal, time, methods) {
    // This would typically involve AI/ML models
    const weeklyHours = parseInt(time);
    const dailyHours = Math.round(weeklyHours / 7);

    return {
        schedule: generateSchedule(dailyHours),
        resources: generateResources(goal, methods),
        milestones: generateMilestones(goal)
    };
}

function generateSchedule(dailyHours) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};

    days.forEach(day => {
        schedule[day] = {
            hours: dailyHours,
            tasks: generateDailyTasks(dailyHours)
        };
    });

    return schedule;
}

function generateDailyTasks(hours) {
    const tasks = [
        'Video Lectures',
        'Reading Materials',
        'Practice Exercises',
        'Review Sessions',
        'Interactive Learning'
    ];

    return tasks.slice(0, hours).map(task => ({
        name: task,
        duration: '1 hour'
    }));
}

function generateResources(goal, methods) {
    // This would typically pull from a resource database
    const resources = [
        {
            type: 'video',
            title: 'Complete Video Course',
            platform: 'Coursera',
            url: '#',
            rating: 4.8
        },
        {
            type: 'reading',
            title: 'Comprehensive Study Guide',
            platform: 'Khan Academy',
            url: '#',
            rating: 4.5
        },
        {
            type: 'practice',
            title: 'Interactive Exercises',
            platform: 'TutorPro',
            url: '#',
            rating: 4.9
        }
    ];

    return resources.filter(resource => methods.includes(resource.type));
}

function generateMilestones(goal) {
    return [
        {
            title: 'Foundation Concepts',
            deadline: '1 week',
            tasks: ['Complete basic tutorials', 'Pass foundation quiz']
        },
        {
            title: 'Core Principles',
            deadline: '2 weeks',
            tasks: ['Master key concepts', 'Complete practice exercises']
        },
        {
            title: 'Advanced Topics',
            deadline: '4 weeks',
            tasks: ['Deep dive into advanced material', 'Work on final project']
        }
    ];
}

// Display Functions
function displayStudyPlan(plan) {
    displaySchedule(plan.schedule);
    displayResources(plan.resources);
    displayMilestones(plan.milestones);
}

function displaySchedule(schedule) {
    const grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';

    Object.entries(schedule).forEach(([day, data]) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'schedule-day';
        dayElement.innerHTML = `
            <h4>${day}</h4>
            <div class="day-tasks">
                ${data.tasks.map(task => `
                    <div class="task">
                        <span>${task.name}</span>
                        <span>${task.duration}</span>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(dayElement);
    });
}

function displayResources(resources) {
    const grid = document.getElementById('resourcesGrid');
    grid.innerHTML = '';

    resources.forEach(resource => {
        const resourceElement = document.createElement('div');
        resourceElement.className = 'resource-card';
        resourceElement.innerHTML = `
            <div class="resource-icon">
                <i class="fas fa-${getResourceIcon(resource.type)}"></i>
            </div>
            <h4>${resource.title}</h4>
            <p>Platform: ${resource.platform}</p>
            <div class="resource-rating">
                ${getStarRating(resource.rating)}
            </div>
            <a href="${resource.url}" class="resource-link">Access Resource</a>
        `;
        grid.appendChild(resourceElement);
    });
}

function displayMilestones(milestones) {
    const list = document.getElementById('milestonesList');
    list.innerHTML = '';

    milestones.forEach(milestone => {
        const milestoneElement = document.createElement('div');
        milestoneElement.className = 'milestone-item';
        milestoneElement.innerHTML = `
            <h4>${milestone.title}</h4>
            <p>Deadline: ${milestone.deadline}</p>
            <ul>
                ${milestone.tasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
        `;
        list.appendChild(milestoneElement);
    });
}

// Utility Functions
function getResourceIcon(type) {
    const icons = {
        video: 'video',
        reading: 'book',
        practice: 'tasks'
    };
    return icons[type] || 'file';
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        <span>${rating}</span>
    `;
}

// Action Functions
function savePlan() {
    // Implement save functionality
    alert('Study plan saved successfully!');
}

function sharePlan() {
    // Implement share functionality
    alert('Share feature coming soon!');
}

function printPlan() {
    window.print();
}

// AI Chat Functions
function sendAIMessage(message) {
    addChatMessage('user', message);

    // Simulate AI response
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
    // This would be replaced with actual AI/ML model responses
    const responses = [
        "I've analyzed your question and here's a personalized study tip...",
        "Based on your learning style, I recommend...",
        "Let me help you break down this concept...",
        "Here's a resource that might help you understand better..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}