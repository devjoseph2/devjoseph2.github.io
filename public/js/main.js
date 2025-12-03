document.addEventListener('DOMContentLoaded', () => {
    fetchPortfolioContent();
});

async function fetchPortfolioContent() {
    try {
        // Fetch from the local JSON file
        const response = await fetch('public/data/portfolio.json');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio content from JSON file.');
        }
        const data = await response.json();
        populatePortfolio(data);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Display an error on the page
        const portfolioContent = document.getElementById('portfolio-content');
        if(portfolioContent) {
            portfolioContent.innerHTML = `<p class="text-center text-red-500">Error loading portfolio content. Please try again later.</p>`;
        }
    }
}

function populatePortfolio(data) {
    // Hero Section
    if (data.hero) {
        const heroTitle = document.querySelector('#home .text-5xl');
        const heroSubtitle = document.querySelector('#home .text-2xl');
        if(heroTitle) heroTitle.textContent = data.hero.title;
        if(heroSubtitle) heroSubtitle.innerHTML = data.hero.subtitle;
    }

    // About Me Section
    if (data.about) {
        const aboutDescription = document.querySelector('#about .text-lg');
        if(aboutDescription) aboutDescription.innerHTML = data.about.description;
    }

    // Projects Section
    if (data.projects && Array.isArray(data.projects)) {
        const projectsGrid = document.querySelector('#projects .grid');
        if(projectsGrid) {
            projectsGrid.innerHTML = ''; // Clear existing projects

            data.projects.forEach(project => {
                const projectCard = `
                    <div class="project-card">
                        <a href="${project.liveUrl || '#'}" target="_blank" rel="noopener noreferrer">
                            <img class="h-56 w-full object-cover" src="${project.imageUrl}" alt="${project.title}">
                        </a>
                        <div class="p-6">
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">${project.title}</h3>
                            <p class="text-gray-600 mb-4">${project.description}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${project.tags.map(tag => `<span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">${tag}</span>`).join('')}
                            </div>
                            <div class="flex items-center space-x-4">
                                <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors">
                                    <svg class="w-6 h-6 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.84c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.577.688.48C19.135 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd" /></svg>
                                    Code
                                </a>
                                ${project.liveUrl && project.liveUrl !== '#' ? `
                                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors">
                                    <svg class="w-6 h-6 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    Live Demo
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                projectsGrid.innerHTML += projectCard;
            });
        }
    }
}
