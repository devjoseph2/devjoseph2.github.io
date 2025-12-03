document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }

                const { accessToken } = await response.json();
                localStorage.setItem('token', accessToken);
                window.location.href = 'index.html'; // Redirect to admin dashboard
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }

    // Logic for the admin dashboard (if on admin/index.html)
    if (window.location.pathname.endsWith('admin/index.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html'; // Redirect to login if not authenticated
            return;
        }
        
        // Fetch and display content (to be implemented)
        loadContent();
    }
});

async function loadContent() {
    const token = localStorage.getItem('token');
    const contentArea = document.getElementById('content-area');

    try {
        const response = await fetch('http://localhost:3000/api/content', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch content');
        }

        const data = await response.json();
        
        // Clear previous content
        contentArea.innerHTML = '';

        // Create editable forms for each section
        for (const section in data) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'mb-6 p-4 bg-white rounded-lg shadow';
            
            const title = document.createElement('h2');
            title.className = 'text-xl font-bold mb-2';
            title.textContent = section.charAt(0).toUpperCase() + section.slice(1);
            
            const form = document.createElement('form');
            form.dataset.section = section;
            
            const textarea = document.createElement('textarea');
            textarea.className = 'w-full h-40 p-2 border rounded';
            textarea.value = JSON.stringify(data[section], null, 2);
            
            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.className = 'mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
            saveButton.textContent = 'Save';

            form.appendChild(textarea);
            form.appendChild(saveButton);
            sectionDiv.appendChild(title);
            sectionDiv.appendChild(form);
            contentArea.appendChild(sectionDiv);

            form.addEventListener('submit', (e) => saveContent(e, section));
        }

    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

async function saveContent(event, section) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const form = event.target;
    const textarea = form.querySelector('textarea');
    
    try {
        const data = JSON.parse(textarea.value);
        
        const response = await fetch(`http://localhost:3000/api/content/${section}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            throw new Error('Failed to save content');
        }

        alert(`${section} content saved successfully!`);

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
