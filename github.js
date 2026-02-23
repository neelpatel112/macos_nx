// github.js - GitHub Profile Viewer
class GitHubApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.profileUrl = 'https://github.com/neelpatel112';
        this.history = [];
        this.historyIndex = -1;
        this.bookmarks = [
            { name: 'Your Profile', url: 'https://github.com/neelpatel112' },
            { name: 'Your Repos', url: 'https://github.com/neelpatel112?tab=repositories' },
            { name: 'Your Stars', url: 'https://github.com/neelpatel112?tab=stars' },
            { name: 'GitHub Home', url: 'https://github.com' }
        ];
        
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('🐙 GitHub App initialized');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window github-window';
        this.window.style.cssText = `
            position: fixed;
            top: 80px;
            left: 120px;
            width: 1100px;
            height: 750px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
        `;
        
        this.window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">GitHub - neelpatel112</div>
            </div>
            
            <div class="github-container">
                <!-- Toolbar -->
                <div class="github-toolbar">
                    <div class="nav-buttons">
                        <button class="nav-btn" id="backBtn" title="Back" disabled>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="nav-btn" id="forwardBtn" title="Forward" disabled>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="nav-btn" id="reloadBtn" title="Reload">
                            <i class="fas fa-redo-alt"></i>
                        </button>
                    </div>
                    
                    <div class="url-bar">
                        <i class="fas fa-lock secure"></i>
                        <input type="text" class="url-input" id="urlInput" value="${this.profileUrl}" readonly>
                    </div>
                    
                    <div class="quick-actions">
                        <button class="quick-action" id="profileBtn">
                            <i class="fab fa-github"></i>
                            <span>Profile</span>
                        </button>
                        <button class="quick-action" id="reposBtn">
                            <i class="fas fa-code-branch"></i>
                            <span>Repos</span>
                        </button>
                        <button class="quick-action" id="starsBtn">
                            <i class="far fa-star"></i>
                            <span>Stars</span>
                        </button>
                        <button class="quick-action" id="bookmarkBtn">
                            <i class="far fa-bookmark"></i>
                            <span>Bookmark</span>
                        </button>
                    </div>
                    
                    <button class="action-btn" id="menuBtn" title="Menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                
                <!-- GitHub WebView -->
                <div class="github-webview">
                    <div class="loading-indicator" id="loadingIndicator"></div>
                    <div class="error-state" id="errorState">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Failed to load GitHub</h3>
                        <p>Check your internet connection and try again</p>
                        <button class="retry-btn" id="retryBtn">Retry</button>
                    </div>
                    <iframe id="githubFrame" src="${this.profileUrl}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe>
                </div>
                
                <!-- Status Bar -->
                <div class="github-statusbar">
                    <div class="status-item secure">
                        <i class="fas fa-lock"></i>
                        <span>Secure connection</span>
                    </div>
                    <div class="status-item" id="pageStatus">
                        <i class="fas fa-circle" style="color: #2da44e;"></i>
                        <span>Connected to GitHub</span>
                    </div>
                    <div class="progress-container" id="progressContainer">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                    <div id="bookmarkStatus" class="status-item" style="margin-left: auto;">
                        <i class="far fa-bookmark"></i>
                        <span>Bookmark this page</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Add to history
        this.addToHistory(this.profileUrl);
    }
    
    setupEventListeners() {
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Navigation
        const backBtn = this.window.querySelector('#backBtn');
        const forwardBtn = this.window.querySelector('#forwardBtn');
        const reloadBtn = this.window.querySelector('#reloadBtn');
        
        backBtn.addEventListener('click', () => this.goBack());
        forwardBtn.addEventListener('click', () => this.goForward());
        reloadBtn.addEventListener('click', () => this.reload());
        
        // Quick actions
        this.window.querySelector('#profileBtn').addEventListener('click', () => {
            this.navigateTo('https://github.com/neelpatel112');
        });
        
        this.window.querySelector('#reposBtn').addEventListener('click', () => {
            this.navigateTo('https://github.com/neelpatel112?tab=repositories');
        });
        
        this.window.querySelector('#starsBtn').addEventListener('click', () => {
            this.navigateTo('https://github.com/neelpatel112?tab=stars');
        });
        
        this.window.querySelector('#bookmarkBtn').addEventListener('click', () => this.toggleBookmark());
        this.window.querySelector('#bookmarkStatus').addEventListener('click', () => this.toggleBookmark());
        
        // Retry button
        this.window.querySelector('#retryBtn').addEventListener('click', () => this.retry());
        
        // Menu button
        this.window.querySelector('#menuBtn').addEventListener('click', () => this.showMenu());
        
        // Iframe events
        const iframe = this.window.querySelector('#githubFrame');
        iframe.addEventListener('load', () => this.onIframeLoad());
        iframe.addEventListener('error', () => this.onIframeError());
        
        // Handle navigation attempts
        try {
            iframe.contentWindow?.addEventListener('popstate', () => {
                this.updateUrlFromIframe();
            });
        } catch (e) {
            console.log('Cannot access iframe contentWindow');
        }
        
        // Make window draggable
        this.makeDraggable();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        this.reload();
                        break;
                    case '[':
                        e.preventDefault();
                        this.goBack();
                        break;
                    case ']':
                        e.preventDefault();
                        this.goForward();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleBookmark();
                        break;
                }
            }
            
            // Escape to close?
            if (e.key === 'Escape' && this.window.querySelector('#menuPopup')) {
                this.window.querySelector('#menuPopup').remove();
            }
        });
    }
    
    navigateTo(url) {
        const iframe = this.window.querySelector('#githubFrame');
        const urlInput = this.window.querySelector('#urlInput');
        const loadingIndicator = this.window.querySelector('#loadingIndicator');
        const errorState = this.window.querySelector('#errorState');
        
        // Show loading
        loadingIndicator.classList.add('active');
        errorState.classList.remove('active');
        
        // Update URL bar
        urlInput.value = url;
        
        // Simulate progress
        this.simulateProgress();
        
        // Navigate iframe
        try {
            iframe.src = url;
            this.addToHistory(url);
            
            // Update window title
            const title = this.window.querySelector('.window-title');
            if (url.includes('neelpatel112')) {
                title.textContent = 'GitHub - neelpatel112';
            } else {
                title.textContent = 'GitHub';
            }
        } catch (e) {
            console.error('Navigation error:', e);
            this.onIframeError();
        }
    }
    
    onIframeLoad() {
        const loadingIndicator = this.window.querySelector('#loadingIndicator');
        const errorState = this.window.querySelector('#errorState');
        const progressBar = this.window.querySelector('#progressBar');
        
        loadingIndicator.classList.remove('active');
        errorState.classList.remove('active');
        
        // Complete progress
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
            if (progressBar) progressBar.style.width = '0%';
        }, 300);
        
        // Try to get actual URL from iframe (may be restricted by CORS)
        try {
            const iframeUrl = this.window.querySelector('#githubFrame').contentWindow.location.href;
            this.window.querySelector('#urlInput').value = iframeUrl;
        } catch (e) {
            // Can't access iframe URL due to CORS, keep current
        }
        
        // Update bookmark status
        this.updateBookmarkStatus();
    }
    
    onIframeError() {
        const loadingIndicator = this.window.querySelector('#loadingIndicator');
        const errorState = this.window.querySelector('#errorState');
        
        loadingIndicator.classList.remove('active');
        errorState.classList.add('active');
    }
    
    simulateProgress() {
        const progressBar = this.window.querySelector('#progressBar');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 90) {
                clearInterval(interval);
                return;
            }
            width += 10;
            progressBar.style.width = width + '%';
        }, 100);
    }
    
    addToHistory(url) {
        // Remove forward history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(url);
        this.historyIndex = this.history.length - 1;
        
        this.updateNavButtons();
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const url = this.history[this.historyIndex];
            this.navigateTo(url);
        }
    }
    
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const url = this.history[this.historyIndex];
            this.navigateTo(url);
        }
    }
    
    updateNavButtons() {
        const backBtn = this.window.querySelector('#backBtn');
        const forwardBtn = this.window.querySelector('#forwardBtn');
        
        backBtn.disabled = this.historyIndex <= 0;
        forwardBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    reload() {
        const currentUrl = this.window.querySelector('#urlInput').value;
        this.navigateTo(currentUrl);
    }
    
    retry() {
        const currentUrl = this.window.querySelector('#urlInput').value;
        this.navigateTo(currentUrl);
    }
    
    toggleBookmark() {
        const currentUrl = this.window.querySelector('#urlInput').value;
        const bookmarkStatus = this.window.querySelector('#bookmarkStatus');
        const bookmarkBtn = this.window.querySelector('#bookmarkBtn i');
        
        // Check if already bookmarked
        const isBookmarked = this.bookmarks.some(b => b.url === currentUrl);
        
        if (isBookmarked) {
            // Remove bookmark
            this.bookmarks = this.bookmarks.filter(b => b.url !== currentUrl);
            bookmarkStatus.innerHTML = '<i class="far fa-bookmark"></i><span>Bookmark this page</span>';
            bookmarkBtn.className = 'far fa-bookmark';
            this.showNotification('Bookmark removed');
        } else {
            // Add bookmark
            let name = currentUrl.replace('https://github.com/', '');
            if (name === 'neelpatel112') name = 'Your Profile';
            else if (name.includes('tab=repositories')) name = 'Your Repositories';
            else if (name.includes('tab=stars')) name = 'Your Stars';
            
            this.bookmarks.push({ name, url: currentUrl });
            bookmarkStatus.innerHTML = '<i class="fas fa-bookmark"></i><span>Bookmarked</span>';
            bookmarkBtn.className = 'fas fa-bookmark';
            this.showNotification('Page bookmarked');
        }
    }
    
    updateBookmarkStatus() {
        const currentUrl = this.window.querySelector('#urlInput').value;
        const bookmarkStatus = this.window.querySelector('#bookmarkStatus');
        const bookmarkBtn = this.window.querySelector('#bookmarkBtn i');
        
        const isBookmarked = this.bookmarks.some(b => b.url === currentUrl);
        
        if (isBookmarked) {
            bookmarkStatus.innerHTML = '<i class="fas fa-bookmark"></i><span>Bookmarked</span>';
            bookmarkBtn.className = 'fas fa-bookmark';
        } else {
            bookmarkStatus.innerHTML = '<i class="far fa-bookmark"></i><span>Bookmark this page</span>';
            bookmarkBtn.className = 'far fa-bookmark';
        }
    }
    
    showMenu() {
        // Remove existing menu
        const existingMenu = this.window.querySelector('#menuPopup');
        if (existingMenu) existingMenu.remove();
        
        // Create menu
        const menu = document.createElement('div');
        menu.id = 'menuPopup';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 8px 0;
            min-width: 200px;
            z-index: 11000;
            border: 1px solid rgba(0,0,0,0.1);
        `;
        
        // Position near menu button
        const btn = this.window.querySelector('#menuBtn');
        const rect = btn.getBoundingClientRect();
        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.right = window.innerWidth - rect.right + 'px';
        
        // Menu items
        const items = [
            { icon: 'fa-home', text: 'GitHub Home', action: () => this.navigateTo('https://github.com') },
            { icon: 'fa-user', text: 'Your Profile', action: () => this.navigateTo('https://github.com/neelpatel112') },
            { icon: 'fa-code-branch', text: 'Your Repos', action: () => this.navigateTo('https://github.com/neelpatel112?tab=repositories') },
            { icon: 'fa-star', text: 'Your Stars', action: () => this.navigateTo('https://github.com/neelpatel112?tab=stars') },
            { divider: true },
            { icon: 'fa-cog', text: 'Settings', action: () => this.showNotification('Settings coming soon') },
            { icon: 'fa-question-circle', text: 'About GitHub', action: () => this.navigateTo('https://github.com/about') }
        ];
        
        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.style.cssText = 'height: 1px; background: #eaeef2; margin: 8px 0;';
                menu.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.style.cssText = `
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #24292f;
                `;
                menuItem.innerHTML = `<i class="fas ${item.icon}" style="width: 16px;"></i><span>${item.text}</span>`;
                
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = '#f6f8fa';
                });
                
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = 'transparent';
                });
                
                menuItem.addEventListener('click', () => {
                    item.action();
                    menu.remove();
                });
                
                menu.appendChild(menuItem);
            }
        });
        
        // Close when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
        
        document.body.appendChild(menu);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2da44e;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 13px;
            z-index: 12000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    open() {
        console.log('🐙 Opening GitHub');
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
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
        if (this.window.style.width === '90vw') {
            this.window.style.width = '1100px';
            this.window.style.height = '750px';
        } else {
            this.window.style.width = '90vw';
            this.window.style.height = '90vh';
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
        if (!titlebar) return;
        
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

// Initialize GitHub App
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing GitHub App...');
    try {
        window.GitHubApp = new GitHubApp();
        console.log('✅ GitHub App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize GitHub App:', error);
    }
});

// Add animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 