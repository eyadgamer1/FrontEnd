// Form Handling
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const fileUploadArea = document.querySelector('.upload-area');

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // For demo purposes, just redirect to home page
            window.location.href = 'home.html';
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) { // Added async
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Send registration data to the backend
            try {
                const response = await fetch('/api/register', { // API endpoint defined in app.py
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fullName, email, password }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert(result.message || 'Registration successful! Please login.');
                    window.location.href = 'index.html'; // Redirect to login page
                } else {
                    alert(result.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred during registration. Please try again.');
            }
        });
    }

    // File Upload Handler
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileUploadArea.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => handleFiles(e.target.files);
            input.click();
        });
    }
});

// File Handler Function
function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    Array.from(files).forEach(file => {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
            <span>${fileSize} MB</span>
            <div class="progress-bar">
                <div class="progress" style="width: 0%"></div>
            </div>
        `;
        fileList.appendChild(fileItem);

        // Simulate upload progress
        simulateUpload(fileItem.querySelector('.progress'));
    });
}

// Simulate file upload progress
function simulateUpload(progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);
}