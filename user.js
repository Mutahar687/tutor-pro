document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeCharts();
    initializeModals();
    initializeNavigation();
    initializeReminders();
    initializeAchievements();
    setupEventListeners();
});

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// Chart Initialization
function initializeCharts() {
    // Weekly Progress Chart
    const weeklyCtx = document.getElementById('weeklyProgress')?.getContext('2d');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [4, 3, 5, 2, 4, 6, 3],
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#FFFFFF'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#FFFFFF'
                        }
                    }
                }
            }
        });
    }

    // Subject Progress Chart
    const subjectCtx = document.getElementById('subjectProgress')?.getContext('2d');
    if (subjectCtx) {
        new Chart(subjectCtx, {
            type: 'doughnut',
            data: {
                labels: ['Mathematics', 'Science', 'Programming', 'Languages'],
                datasets: [{
                    data: [85, 65, 75, 45],
                    backgroundColor: [
                        '#FF0000',
                        '#FF3333',
                        '#FF6666',
                        '#FF9999'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#FFFFFF'
                        }
                    }
                }
            }
        });
    }
}

// Modal Management
function initializeModals() {
    const modals = {
        editProfile: {
            modal: document.getElementById('editProfileModal'),
            trigger: document.querySelector('.edit-profile-btn'),
            form: document.getElementById('editProfileForm')
        },
        addReminder: {
            modal: document.getElementById('addReminderModal'),
            trigger: document.querySelector('.add-reminder-btn'),
            form: document.getElementById('addReminderForm')
        }
    };

    // Setup each modal
    Object.values(modals).forEach(({ modal, trigger, form }) => {
        if (!modal || !trigger) return;

        // Open modal
        trigger.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        // Close modal
        const closeBtn = modal.querySelector('.close');
        closeBtn?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Form submission
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(form.id);
            modal.style.display = 'none';
        });
    });
}

// Form Submission Handlers
function handleFormSubmission(formId) {
    switch (formId) {
        case 'editProfileForm':
            updateProfile();
            break;
        case 'addReminderForm':
            addNewReminder();
            break;
    }
}

function updateProfile() {
    const name = document.getElementById('userName').value;
    const bio = document.getElementById('userBio').value;
    const email = document.getElementById('userEmail').value;

    // Update profile information in the UI
    document.querySelector('.profile-details h1').textContent = name;
    document.querySelector('.user-bio').textContent = bio;

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Reminder Management
function initializeReminders() {
    const remindersList = document.querySelector('.reminders-list');
    if (!remindersList) return;

    // Setup reminder action buttons
    const actionButtons = remindersList.querySelectorAll('.reminder-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const reminderItem = e.target.closest('.reminder-item');
            completeReminder(reminderItem);
        });
    });
}

function addNewReminder() {
    const title = document.getElementById('reminderTitle').value;
    const description = document.getElementById('reminderDescription').value;
    const datetime = document.getElementById('reminderDate').value;

    const remindersList = document.querySelector('.reminders-list');
    if (!remindersList) return;

    const reminderHTML = `
        <div class="reminder-item animate__animated animate__fadeIn">
            <div class="reminder-time">${formatDateTime(datetime)}</div>
            <div class="reminder-content">
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
            <button class="reminder-action">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `;

    remindersList.insertAdjacentHTML('afterbegin', reminderHTML);
    showNotification('Reminder added successfully!', 'success');
}

function completeReminder(reminderItem) {
    reminderItem.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        reminderItem.remove();
    }, 500);
    showNotification('Reminder completed!', 'success');
}

// Achievement Management
function initializeAchievements() {
    const achievementCards = document.querySelectorAll('.achievement-card:not(.locked)');
    achievementCards.forEach(card => {
        card.addEventListener('click', () => {
            showAchievementDetails(card);
        });
    });
}

function showAchievementDetails(card) {
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    
    // Show achievement details in a modal or tooltip
    showNotification(`${title}: ${description}`, 'info');
}

// Utility Functions
function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate__animated animate__fadeIn`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
        notification.classList.replace('animate__fadeIn', 'animate__fadeOut');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Profile image upload
    const editAvatar = document.querySelector('.edit-avatar');
    editAvatar?.addEventListener('click', () => {
        // Trigger file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.profile-avatar img').src = e.target.result;
                    showNotification('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Add custom event listeners here
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close all modals
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}