document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeNavigation();
    initializeForm();
});

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// Form Handling
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value,
            grade: document.getElementById('grade').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form data
        if (validateForm(formData)) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate API call (replace with actual API endpoint in production)
                await simulateFormSubmission(formData);
                
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                // Show error message
                showNotification('Failed to send message. Please try again.', 'error');
                
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Form Validation
function validateForm(data) {
    // Name validation
    if (data.name.trim().length < 2) {
        showNotification('Please enter a valid name', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Age validation
    const age = parseInt(data.age);
    if (isNaN(age) || age < 13 || age > 120) {
        showNotification('Please enter a valid age (13 or older)', 'error');
        return false;
    }

    // Grade validation
    if (!data.grade) {
        showNotification('Please select your grade level', 'error');
        return false;
    }

    // Subject validation
    if (!data.subject) {
        showNotification('Please select a subject', 'error');
        return false;
    }

    // Message validation
    if (data.message.trim().length < 10) {
        showNotification('Please enter a message (minimum 10 characters)', 'error');
        return false;
    }

    return true;
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create new notification
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

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted with data:', data);
            resolve();
        }, 1500);
    });
}

// Social Media Link Tracking
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = e.currentTarget.querySelector('img').alt.toLowerCase();
        console.log(`Clicked ${platform} link`);
        // Add analytics tracking here if needed
    });
});