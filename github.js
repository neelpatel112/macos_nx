// github-profile.js - Custom GitHub Profile with Dark Humor
class GitHubProfileApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.username = 'neelpatel112';
        this.currentTab = 'overview';
        
        // Profile data (updated with your actual info)
        this.profileData = {
            name: 'Neel patel',
            login: 'neelpatel112',
            bio: 'how tf did you find me huh?',
            location: null,
            email: null,
            website: null,
            company: null,
            twitter: null,
            followers: 0,
            following: 0,
            publicRepos: 5, // Based on visible repos
            publicGists: 0,
            joinedDate: 'Unknown',
            contributions: {
                total: 251,
                currentStreak: 0,
                longestStreak: 0
            }
        };
        
        // Repository data (from your actual repos)
        this.repositories = [
            {
                name: 'macos_nx',
                description: '🍏 macOS web desktop emulator with native-like experience. Built with vanilla JS, CSS, HTML.',
                language: 'JavaScript',
                languageColor: '#f1e05a',
                stars: 1,
                forks: 0,
                updated: 'Feb 6, 2026',
                isPrivate: false,
                isArchived: false,
                isTemplate: false
            },
            {
                name: 'About-me',
                description: 'Nothin to see bruhh i ain\'t serious about this shit... Just open up the ReadMe2.md file and see...',
                language: 'JavaScript',
                languageColor: '#f1e05a',
                stars: 0,
                forks: 0,
                updated: 'Recently',
                isPrivate: false
            },
            {
                name: 'windows-8-web-os',
                description: 'Educational modification of Windows Web 8 by Kishlaya - A browser-based Windows 8 interface for learning web development. (Best balance of attribution, purpose, and clarity)',
                language: 'SCSS',
                languageColor: '#c6538c',
                stars: 1,
                forks: 0,
                updated: 'Recently',
                isPrivate: false
            },
            {
                name: 'michael_ifruit',
                description: 'Latest project - Feb 2026',
                language: 'JavaScript',
                languageColor: '#f1e05a',
                stars: 0,
                forks: 0,
                updated: 'Feb 21, 2026',
                isPrivate: false
            },
            {
                name: 'lunarc_',
                description: 'TypeScript project - Feb 2026',
                language: 'TypeScript',
                languageColor: '#3178c6',
                stars: 0,
                forks: 0,
                updated: 'Feb 17, 2026',
                isPrivate: false
            },
            {
                name: 'samsung_dex_web',
                description: 'JavaScript project - Feb 2026',
                language: 'JavaScript',
                languageColor: '#f1e05a',
                stars: 0,
                forks: 0,
                updated: 'Feb 1, 2026',
                isPrivate: false
            }
        ];
        
        // Pinned repositories (your actual pinned ones)
        this.pinnedRepos = [
            this.repositories[0], // macos_nx
            this.repositories[1], // About-me
            this.repositories[2], // windows-8-web-os
            this.repositories[3], // michael_ifruit (since it's recent)
            this.repositories[4], // lunarc_
            this.repositories[5]  // samsung_dex_web
        ];
        
        // Activity feed based on your recent contributions
        this.activity = [
            { type: 'create', repo: 'michael_ifruit', message: 'Created repository', time: 'Feb 21, 2026', icon: 'fa-plus-circle' },
            { type: 'create', repo: 'lunarc_', message: 'Created repository', time: 'Feb 17, 2026', icon: 'fa-plus-circle' },
            { type: 'push', repo: 'macos_nx', message: 'Updated macOS web emulator', time: 'Feb 6, 2026', icon: 'fa-code-branch' },
            { type: 'create', repo: 'samsung_dex_web', message: 'Created repository', time: 'Feb 1, 2026', icon: 'fa-plus-circle' },
            { type: 'push', repo: 'windows-8-web-os', message: 'Updated Windows 8 web OS', time: 'Jan 2026', icon: 'fa-code-branch' }
        ];
        
        // Dark humor quotes (keeping your style)
        this.humorQuotes = [
            "how tf did you find me huh?",
            "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 117 little bugs in the code.",
            "Real programmers count from 0",
            "There are 10 types of people in the world: those who understand binary and those who don't",
            "I'm not a great programmer; I'm just a good programmer with great habits",
            "Deleted the production database? That's just a character-building exercise",
            "The code compiles? Must be a fluke",
            "Junior: 'I broke the build' | Senior: 'That's cute, watch this'",
            "Works in production? Wait, that's not right...",
            "404: Developer motivation not found"
        ];
        
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        this.renderProfile();
        console.log('🐙 Custom GitHub Profile initialized');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window github-profile-window';
        this.window.style.cssText = `
            position: fixed;
            top: 80px;
            left: 120px;
            width: 1200px;
            height: 800px;
            background: #0d1117;
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
        `;
        
        this.window.innerHTML = `
            <div class="window-titlebar" style="background: #161b22; color: #c9d1d9; border-bottom: 1px solid #30363d;">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">
                    <i class="fab fa-github" style="margin-right: 8px; color: #f78166;"></i>
                    ${this.username} / GitHub Profile
                </div>
            </div>
            
            <div class="profile-container" id="profileContainer">
                <!-- Will be populated by renderProfile() -->
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        this.makeDraggable();
    }
    
    renderProfile() {
        const container = this.window.querySelector('#profileContainer');
        const randomQuote = this.humorQuotes[Math.floor(Math.random() * this.humorQuotes.length)];
        
        container.innerHTML = `
            <!-- Sidebar -->
            <div class="profile-sidebar">
                <div class="avatar-container">
                    <div class="avatar">
                        <div class="avatar-placeholder">NP</div>
                    </div>
                    <div class="status-indicator" title="Available for debugging"></div>
                </div>
                
                <h2 class="profile-name">${this.profileData.name}</h2>
                <div class="profile-login">${this.profileData.login}</div>
                
                <div class="profile-bio">
                    ${this.profileData.bio}
                </div>
                
                <!-- Dark humor section -->
                <div class="dark-humor">
                    <div class="humor-text">
                        <i class="fas fa-quote-left"></i> ${randomQuote}
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-number">${this.profileData.followers}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${this.profileData.following}</div>
                        <div class="stat-label">Following</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${this.profileData.publicRepos}</div>
                        <div class="stat-label">Repos</div>
                    </div>
                </div>
                
                <div class="profile-details">
                    <!-- Only show details that exist -->
                    ${this.profileData.location ? `
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="detail-text">${this.profileData.location}</span>
                    </div>` : ''}
                    ${this.profileData.email ? `
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${this.profileData.email}" class="detail-text">${this.profileData.email}</a>
                    </div>` : ''}
                    ${this.profileData.website ? `
                    <div class="detail-item">
                        <i class="fas fa-link"></i>
                        <a href="https://${this.profileData.website}" target="_blank" class="detail-text">${this.profileData.website}</a>
                    </div>` : ''}
                    ${this.profileData.company ? `
                    <div class="detail-item">
                        <i class="fas fa-building"></i>
                        <span class="detail-text">${this.profileData.company}</span>
                    </div>` : ''}
                    ${this.profileData.twitter ? `
                    <div class="detail-item">
                        <i class="fab fa-twitter"></i>
                        <a href="https://twitter.com/${this.profileData.twitter}" target="_blank" class="detail-text">@${this.profileData.twitter}</a>
                    </div>` : ''}
                    ${this.profileData.joinedDate !== 'Unknown' ? `
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="detail-text">Joined ${this.profileData.joinedDate}</span>
                    </div>` : ''}
                </div>
                
                <div class="org-section">
                    <div class="section-header">
                        <span class="section-title">Organizations</span>
                    </div>
                    <div class="org-grid">
                        <div class="org-item"><i class="fab fa-google"></i></div>
                        <div class="org-item"><i class="fab fa-microsoft"></i></div>
                        <div class="org-item"><i class="fab fa-apple"></i></div>
                        <div class="org-item"><i class="fab fa-amazon"></i></div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="profile-main">
                <!-- Tab Bar -->
                <div class="profile-tabs">
                    <div class="tab-item ${this.currentTab === 'overview' ? 'active' : ''}" data-tab="overview">
                        <i class="fas fa-book-open"></i>
                        Overview
                    </div>
                    <div class="tab-item ${this.currentTab === 'repositories' ? 'active' : ''}" data-tab="repositories">
                        <i class="fas fa-code-branch"></i>
                        Repositories
                        <span class="tab-count">${this.repositories.length}</span>
                    </div>
                    <div class="tab-item ${this.currentTab === 'projects' ? 'active' : ''}" data-tab="projects">
                        <i class="fas fa-project-diagram"></i>
                        Projects
                    </div>
                    <div class="tab-item ${this.currentTab === 'packages' ? 'active' : ''}" data-tab="packages">
                        <i class="fas fa-cube"></i>
                        Packages
                    </div>
                    <div class="tab-item ${this.currentTab === 'stars' ? 'active' : ''}" data-tab="stars">
                        <i class="far fa-star"></i>
                        Stars
                        <span class="tab-count">0</span>
                    </div>
                </div>
                
                <!-- Content Area -->
                <div class="profile-content" id="tabContent">
                    ${this.renderCurrentTab()}
                </div>
            </div>
        `;
        
        // Add tab event listeners
        container.querySelectorAll('.tab-item').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    renderCurrentTab() {
        switch(this.currentTab) {
            case 'overview':
                return this.renderOverviewTab();
            case 'repositories':
                return this.renderRepositoriesTab();
            case 'projects':
                return this.renderProjectsTab();
            case 'packages':
                return this.renderPackagesTab();
            case 'stars':
                return this.renderStarsTab();
            default:
                return this.renderOverviewTab();
        }
    }
    
    renderOverviewTab() {
        return `
            <!-- Contribution Graph -->
            <div class="contribution-section">
                <div class="contribution-header">
                    <span class="contribution-title">
                        ${this.profileData.contributions.total} contributions in the last year
                    </span>
                    <span class="contribution-streak">
                        🔥 ${this.profileData.contributions.currentStreak} day streak
                    </span>
                </div>
                
                <div class="contribution-graph">
                    ${this.generateContributionGraph()}
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8b949e;">
                    <span>Less</span>
                    <div style="display: flex; gap: 4px;">
                        <span class="graph-cell" style="width: 10px;"></span>
                        <span class="graph-cell level-1" style="width: 10px;"></span>
                        <span class="graph-cell level-2" style="width: 10px;"></span>
                        <span class="graph-cell level-3" style="width: 10px;"></span>
                        <span class="graph-cell level-4" style="width: 10px;"></span>
                    </div>
                    <span>More</span>
                </div>
            </div>
            
            <!-- Pinned Repositories -->
            <h3 style="color: #c9d1d9; margin-bottom: 16px; font-size: 16px;">Pinned</h3>
            <div class="repo-grid">
                ${this.pinnedRepos.map(repo => this.renderRepoCard(repo)).join('')}
            </div>
            
            <!-- README Section -->
            <div class="readme-section">
                <div class="readme-header">
                    <i class="fas fa-book readme-icon"></i>
                    <span class="readme-title">${this.username}/README.md</span>
                </div>
                <div class="readme-content">
                    ${this.renderReadme()}
                </div>
            </div>
        `;
    }
    
    renderRepositoriesTab() {
        return `
            <div style="margin-bottom: 20px;">
                <input type="text" placeholder="Find a repository..." 
                       style="width: 100%; padding: 8px 12px; background: #151b23; border: 1px solid #30363d; 
                              border-radius: 6px; color: #c9d1d9; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${this.repositories.map(repo => `
                    <div style="background: #151b23; border: 1px solid #30363d; border-radius: 6px; padding: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-book" style="color: #8b949e;"></i>
                                <span style="color: #58a6ff; font-weight: 600; font-size: 16px;">${repo.name}</span>
                                ${repo.isPrivate ? '<span class="repo-badge">Private</span>' : ''}
                            </div>
                            <button style="background: transparent; border: 1px solid #30363d; border-radius: 6px; 
                                         padding: 4px 12px; color: #c9d1d9; font-size: 12px; cursor: pointer;">
                                <i class="far fa-star"></i> Star
                            </button>
                        </div>
                        <p style="color: #8b949e; font-size: 13px; margin-bottom: 12px;">${repo.description}</p>
                        <div class="repo-stats">
                            <span class="repo-language">
                                <span class="language-color" style="background: ${repo.languageColor};"></span>
                                ${repo.language}
                            </span>
                            <span class="repo-stat">
                                <i class="far fa-star"></i> ${repo.stars}
                            </span>
                            <span class="repo-stat">
                                <i class="fas fa-code-branch"></i> ${repo.forks}
                            </span>
                            <span class="repo-stat" style="margin-left: auto;">
                                Updated ${repo.updated}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderProjectsTab() {
        return `
            <div style="text-align: center; padding: 60px 20px; color: #8b949e;">
                <i class="fas fa-project-diagram" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <h3 style="color: #c9d1d9; margin-bottom: 8px;">No projects yet</h3>
                <p style="font-size: 14px;">Projects are a way to organize your work. Create a project to get started.</p>
            </div>
        `;
    }
    
    renderPackagesTab() {
        return `
            <div style="text-align: center; padding: 60px 20px; color: #8b949e;">
                <i class="fas fa-cube" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <h3 style="color: #c9d1d9; margin-bottom: 8px;">No packages published</h3>
                <p style="font-size: 14px;">Publish your first package to share your code with the world.</p>
            </div>
        `;
    }
    
    renderStarsTab() {
        return `
            <div style="text-align: center; padding: 60px 20px; color: #8b949e;">
                <i class="far fa-star" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <h3 style="color: #c9d1d9; margin-bottom: 8px;">No stars yet</h3>
                <p style="font-size: 14px;">Star some repositories to see them here.</p>
            </div>
        `;
    }
    
    renderRepoCard(repo) {
        return `
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-book" style="color: #8b949e;"></i>
                    <span class="repo-name">${repo.name}</span>
                    ${repo.isPrivate ? '<span class="repo-badge">Private</span>' : ''}
                </div>
                <div class="repo-description">${repo.description}</div>
                <div class="repo-stats">
                    <span class="repo-language">
                        <span class="language-color" style="background: ${repo.languageColor};"></span>
                        ${repo.language}
                    </span>
                    <span class="repo-stat">
                        <i class="far fa-star"></i> ${repo.stars}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-code-branch"></i> ${repo.forks}
                    </span>
                </div>
            </div>
        `;
    }
    
    renderReadme() {
        return `
            <h1>how tf did you find me huh?</h1>
            
            <p>
                <strong>👋 Yo, I'm Neel!</strong> I build stuff that sometimes works. Currently deep in my macOS web emulator era.
            </p>
            
            <h2>📦 What I'm building</h2>
            <ul>
                <li><code>macos_nx</code> - A macOS web desktop emulator (the one you're in right now!)</li>
                <li><code>windows-8-web-os</code> - Because why not have both?</li>
                <li><code>About-me</code> - Not serious about this one, check the ReadMe2.md</li>
                <li>michael_ifruit, lunarc_, samsung_dex_web - New projects dropping Feb 2026</li>
            </ul>
            
            <h2>📊 GitHub Stats</h2>
            <pre>
⭐ Total Stars Earned: ${this.repositories.reduce((acc, repo) => acc + repo.stars, 0)}
🔀 Total Forks: ${this.repositories.reduce((acc, repo) => acc + repo.forks, 0)}
📦 Public Repositories: ${this.profileData.publicRepos}
🔥 Recent Activity: Created 4 repositories in Feb 2026
⚡ Fun fact: how tf did you find me huh?
            </pre>
            
            <h2>🎯 Current goals</h2>
            <ul>
                <li>✅ Build a macOS clone in the browser</li>
                <li>⬜ Actually finish michael_ifruit</li>
                <li>⬜ Make lunarc_ something cool</li>
                <li>⬜ Add more sarcastic bios</li>
            </ul>
            
            <div class="dark-humor" style="margin-top: 24px;">
                <div class="humor-text">
                    <i class="fas fa-terminal"></i>
                    "how tf did you find me huh?"
                </div>
            </div>
        `;
    }
    
    generateContributionGraph() {
        let cells = '';
        const levels = ['', 'level-1', 'level-2', 'level-3', 'level-4'];
        
        // Make it look like your actual contributions (mostly empty with recent activity)
        for (let i = 0; i < 52 * 7; i++) {
            // Simulate recent contributions in Feb 2026
            let randomLevel = 0;
            if (i > 50 * 7) { // Last few weeks
                randomLevel = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
            }
            cells += `<div class="graph-cell ${levels[randomLevel]}" title="${Math.floor(Math.random() * 5)} contributions"></div>`;
        }
        
        return cells;
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        this.renderProfile();
    }
    
    setupEventListeners() {
        // Any additional event listeners can go here
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Refresh random quote on open
        this.renderProfile();
        
        return true;
    }
    
    close() {
        this.window.style.display = 'none';
        this.isOpen = false;
    }
    
    minimize() {
        this.window.style.transform = 'translateY(100vh)';
        this.window.style.opacity = '0';
        setTimeout(() => {
            this.window.style.display = 'none';
            this.isOpen = false;
        }, 300);
    }
    
    zoom() {
        if (this.window.style.width === '95vw') {
            this.window.style.width = '1200px';
            this.window.style.height = '800px';
            this.window.style.top = '80px';
            this.window.style.left = '120px';
        } else {
            this.window.style.width = '95vw';
            this.window.style.height = '95vh';
            this.window.style.top = '2.5vh';
            this.window.style.left = '2.5vw';
        }
    }
    
    bringToFront() {
        const windows = document.querySelectorAll('.window');
        let maxZ = 100;
        windows.forEach(w => {
            const z = parseInt(window.getComputedStyle(w).zIndex) || 100;
            if (z > maxZ) maxZ = z;
        });
        this.window.style.zIndex = maxZ + 1;
    }
    
    makeDraggable() {
        const titlebar = this.window.querySelector('.window-titlebar');
        let isDragging = false;
        let offsetX, offsetY;
        
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            const rect = this.window.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        const onMouseMove = (e) => {
            if (!isDragging) return;
            this.window.style.left = `${e.clientX - offsetX}px`;
            this.window.style.top = `${e.clientY - offsetY}px`;
        };
        
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }
}

// Initialize GitHub Profile App
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing Custom GitHub Profile...');
    try {
        window.GitHubProfileApp = new GitHubProfileApp();
        console.log('✅ GitHub Profile initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize GitHub Profile:', error);
    }
});