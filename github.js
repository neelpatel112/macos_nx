// github.js - GitHub Profile Viewer (FIXED with proxy)
class GitHubApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.profileUrl = 'https://github.com/neelpatel112';
        // Use a CORS proxy to bypass iframe restrictions
        this.proxyUrl = 'https://corsproxy.io/?';
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
                        <i class="fas fa-exclamation-triangle" style="color: #f0883e;"></i>
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
                        <button class="quick-action" id="openInNewBtn">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Open in Browser</span>
                        </button>
                    </div>
                    
                    <button class="action-btn" id="menuBtn" title="Menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                
                <!-- GitHub WebView - Using proxy -->
                <div class="github-webview">
                    <div class="loading-indicator" id="loadingIndicator"></div>
                    <div class="error-state" id="errorState">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>GitHub cannot be embedded</h3>
                        <p>GitHub blocks being shown in iframes for security reasons.</p>
                        <button class="retry-btn" id="openBrowserBtn">
                            <i class="fas fa-external-link-alt"></i>
                            Open in New Tab
                        </button>
                        <button class="retry-btn" id="retryBtn" style="background: #2da44e; margin-top: 10px;">
                            <i class="fas fa-redo-alt"></i>
                            Try Proxy
                        </button>
                    </div>
                    <iframe id="githubFrame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation" style="display: none;"></iframe>
                </div>
                
                <!-- Alternative: GitHub Stats Card -->
                <div id="profileCard" style="flex: 1; padding: 40px; overflow-y: auto; background: white; display: none;">
                    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" style="width: 120px; height: 120px; margin-bottom: 30px;">
                        
                        <h1 style="font-size: 36px; margin-bottom: 10px; color: #24292f;">neelpatel112</h1>
                        <p style="font-size: 18px; color: #57606a; margin-bottom: 30px;">GitHub Profile</p>
                        
                        <!-- GitHub Stats Cards -->
                        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap;">
                            <img src="https://github-readme-stats.vercel.app/api?username=neelpatel112&show_icons=true&theme=light" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%;">
                        </div>
                        
                        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=neelpatel112&layout=compact&theme=light" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%;">
                        </div>
                        
                        <div style="margin-top: 40px; padding: 20px; background: #f6f8fa; border-radius: 10px;">
                            <p style="color: #57606a; margin-bottom: 20px;">GitHub doesn't allow embedding in iframes due to security restrictions.</p>
                            <button class="retry-btn" id="openBrowserBtn2" style="background: #24292f;">
                                <i class="fas fa-external-link-alt"></i>
                                Open GitHub in New Tab
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Status Bar -->
                <div class="github-statusbar">
                    <div class="status-item" style="color: #f0883e;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>GitHub cannot be embedded</span>
                    </div>
                    <div class="status-item" style="margin-left: auto;">
                        <i class="far fa-bookmark"></i>
                        <span>Use proxy or open in browser</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Setup buttons
        this.setupButtons();
    }
    
    setupButtons() {
        // Open in browser buttons
        const openBtns = this.window.querySelectorAll('#openBrowserBtn, #openBrowserBtn2, #openInNewBtn');
        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.open(this.profileUrl, '_blank');
            });
        });
        
        // Try proxy button
        this.window.querySelector('#retryBtn').addEventListener('click', () => this.tryProxy());
        
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Navigation
        this.window.querySelector('#reloadBtn').addEventListener('click', () => this.tryProxy());
        
        // Quick actions
        this.window.querySelector('#profileBtn').addEventListener('click', () => {
            this.profileUrl = 'https://github.com/neelpatel112';
            this.tryProxy();
        });
        
        this.window.querySelector('#reposBtn').addEventListener('click', () => {
            this.profileUrl = 'https://github.com/neelpatel112?tab=repositories';
            this.tryProxy();
        });
        
        this.window.querySelector('#starsBtn').addEventListener('click', () => {
            this.profileUrl = 'https://github.com/neelpatel112?tab=stars';
            this.tryProxy();
        });
        
        // Menu button
        this.window.querySelector('#menuBtn').addEventListener('click', () => this.showMenu());
        
        // Make window draggable
        this.makeDraggable();
    }
    
    tryProxy() {
        const iframe = this.window.querySelector('#githubFrame');
        const errorState = this.window.querySelector('#errorState');
        const profileCard = this.window.querySelector('#profileCard');
        const loadingIndicator = this.window.querySelector('#loadingIndicator');
        
        // Try with different proxies
        const proxies = [
            `https://corsproxy.io/?${encodeURIComponent(this.profileUrl)}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(this.profileUrl)}`,
            `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(this.profileUrl)}`
        ];
        
        // Show loading
        errorState.style.display = 'none';
        profileCard.style.display = 'none';
        iframe.style.display = 'block';
        loadingIndicator.classList.add('active');
        
        // Try first proxy
        iframe.src = proxies[0];
        
        // Set timeout to try next proxy if this fails
        setTimeout(() => {
            if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML.includes('Error')) {
                // Try second proxy
                iframe.src = proxies[1];
                
                setTimeout(() => {
                    if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML.includes('Error')) {
                        // Try third proxy
                        iframe.src = proxies[2];
                        
                        setTimeout(() => {
                            if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML.includes('Error')) {
                                // All proxies failed, show profile card
                                loadingIndicator.classList.remove('active');
                                iframe.style.display = 'none';
                                profileCard.style.display = 'block';
                            }
                        }, 5000);
                    }
                }, 5000);
            }
        }, 5000);
        
        // Iframe load event
        iframe.onload = () => {
            loadingIndicator.classList.remove('active');
            
            try {
                // Check if we got GitHub content
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (doc.body.innerHTML.includes('GitHub') || doc.body.innerHTML.includes('neelpatel112')) {
                    // Success! Hide profile card
                    profileCard.style.display = 'none';
                    iframe.style.display = 'block';
                } else {
                    // Show profile card as fallback
                    iframe.style.display = 'none';
                    profileCard.style.display = 'block';
                }
            } catch (e) {
                // Can't access content due to CORS, show profile card
                iframe.style.display = 'none';
                profileCard.style.display = 'block';
            }
        };
        
        // Update URL display
        this.window.querySelector('#urlInput').value = this.profileUrl;
    }
    
    showMenu() {
        // Menu implementation (same as before)
        const existingMenu = this.window.querySelector('#menuPopup');
        if (existingMenu) existingMenu.remove();
        
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
        
        const btn = this.window.querySelector('#menuBtn');
        const rect = btn.getBoundingClientRect();
        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.right = window.innerWidth - rect.right + 'px';
        
        const items = [
            { icon: 'fa-home', text: 'GitHub Home', action: () => {
                this.profileUrl = 'https://github.com';
                this.tryProxy();
            }},
            { icon: 'fa-user', text: 'Your Profile', action: () => {
                this.profileUrl = 'https://github.com/neelpatel112';
                this.tryProxy();
            }},
            { icon: 'fa-code-branch', text: 'Your Repos', action: () => {
                this.profileUrl = 'https://github.com/neelpatel112?tab=repositories';
                this.tryProxy();
            }},
            { icon: 'fa-star', text: 'Your Stars', action: () => {
                this.profileUrl = 'https://github.com/neelpatel112?tab=stars';
                this.tryProxy();
            }},
            { divider: true },
            { icon: 'fa-external-link-alt', text: 'Open in Browser', action: () => window.open(this.profileUrl, '_blank') }
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
        
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== btn) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
        
        document.body.appendChild(menu);
    }
    
    open() {
        console.log('🐙 Opening GitHub');
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Show profile card by default (since iframe won't work)
        const iframe = this.window.querySelector('#githubFrame');
        const profileCard = this.window.querySelector('#profileCard');
        const errorState = this.window.querySelector('#errorState');
        
        iframe.style.display = 'none';
        errorState.style.display = 'block';
        profileCard.style.display = 'none';
        
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