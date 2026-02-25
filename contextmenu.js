// contextmenu.js - Global right-click handler for macOS NX with nxCloud integration

class ContextMenuManager {
    constructor() {
        this.activeMenu = null;
        this.currentTarget = null;
        this.currentItems = [];
        this.init();
    }

    init() {
        // Global right-click listener
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleContextMenu(e);
        });

        // Click anywhere to close menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.closeMenu();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        console.log('📋 Context Menu Manager initialized');
    }

    handleContextMenu(e) {
        // Find what was right-clicked
        const target = e.target;
        this.currentTarget = target;
        
        // Determine context type
        let contextType = 'desktop';
        let contextData = null;

        if (target.closest('.finder-window')) {
            contextType = 'finder';
            contextData = this.getFinderContext(target);
        } else if (target.closest('.dock-item')) {
            contextType = 'dock';
            contextData = target.closest('.dock-item').dataset;
        } else if (target.closest('.desktop-icon')) {
            contextType = 'desktop-icon';
            contextData = target.closest('.desktop-icon').dataset;
        } else if (target.closest('.desktop')) {
            contextType = 'desktop';
        }

        // Build and show menu
        const menu = this.buildContextMenu(contextType, contextData);
        this.showMenu(menu, e.clientX, e.clientY);
    }

    getFinderContext(target) {
        // Check if clicking on a file/folder item
        const fileItem = target.closest('.icon-item, .list-item, .column-item');
        if (fileItem) {
            return {
                type: 'file',
                name: fileItem.dataset.name,
                index: fileItem.dataset.index,
                element: fileItem
            };
        }
        
        // Clicking in empty space
        return {
            type: 'finder-empty',
            path: window.FinderApp?.currentPath || []
        };
    }

    buildContextMenu(type, data) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        
        // Check if user is logged into nxCloud
        const isCloudLoggedIn = !!localStorage.getItem('nxCloudToken');
        
        switch(type) {
            case 'file':
                menu.innerHTML = this.getFileMenuHTML(data, isCloudLoggedIn);
                break;
            case 'finder-empty':
                menu.innerHTML = this.getFinderEmptyMenuHTML(isCloudLoggedIn);
                break;
            case 'desktop-icon':
                menu.innerHTML = this.getDesktopIconMenuHTML(data, isCloudLoggedIn);
                break;
            case 'desktop':
                menu.innerHTML = this.getDesktopMenuHTML(isCloudLoggedIn);
                break;
            case 'dock':
                menu.innerHTML = this.getDockMenuHTML(data);
                break;
            default:
                menu.innerHTML = this.getDefaultMenuHTML();
        }

        return menu;
    }

    getFileMenuHTML(file, isCloudLoggedIn) {
        const isFolder = file.type === 'folder';
        
        return `
            <div class="menu-item" data-action="open">
                <i class="fas fa-folder-open"></i>
                Open
            </div>
            <div class="menu-item" data-action="quicklook">
                <i class="fas fa-search"></i>
                Quick Look
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="cut">
                <i class="fas fa-cut"></i>
                Cut
            </div>
            <div class="menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                Copy
            </div>
            <div class="menu-item" data-action="paste" ${this.canPaste() ? '' : 'style="opacity:0.5; pointer-events:none;"'}>
                <i class="fas fa-paste"></i>
                Paste
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="rename">
                <i class="fas fa-i-cursor"></i>
                Rename
            </div>
            <div class="menu-item" data-action="duplicate">
                <i class="fas fa-clone"></i>
                Duplicate
            </div>
            ${isFolder ? `
            <div class="menu-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                New Folder
            </div>
            ` : ''}
            <div class="menu-divider"></div>
            
            ${isCloudLoggedIn ? `
            <div class="menu-item has-submenu" data-action="cloud">
                <i class="fas fa-cloud"></i>
                nxCloud
                <span class="submenu-indicator">▶</span>
            </div>
            <div class="submenu cloud-submenu">
                <div class="menu-item" data-action="cloud-upload">
                    <i class="fas fa-upload"></i>
                    Upload to nxCloud
                </div>
                <div class="menu-item" data-action="cloud-share">
                    <i class="fas fa-share-alt"></i>
                    Share via nxCloud
                </div>
                <div class="menu-item" data-action="cloud-info">
                    <i class="fas fa-info-circle"></i>
                    Cloud Info
                </div>
            </div>
            ` : `
            <div class="menu-item" data-action="cloud-login">
                <i class="fas fa-cloud"></i>
                Sign in to nxCloud
            </div>
            `}
            
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="compress">
                <i class="fas fa-file-archive"></i>
                Compress
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="get-info">
                <i class="fas fa-info-circle"></i>
                Get Info
            </div>
            <div class="menu-item" data-action="tags">
                <i class="fas fa-tag"></i>
                Tags
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="trash" style="color: #FF3B30;">
                <i class="fas fa-trash"></i>
                Move to Trash
            </div>
        `;
    }

    getFinderEmptyMenuHTML(isCloudLoggedIn) {
        return `
            <div class="menu-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                New Folder
            </div>
            <div class="menu-item" data-action="paste" ${this.canPaste() ? '' : 'style="opacity:0.5; pointer-events:none;"'}>
                <i class="fas fa-paste"></i>
                Paste
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="clean-up">
                <i class="fas fa-broom"></i>
                Clean Up
            </div>
            <div class="menu-item" data-action="sort-by">
                <i class="fas fa-sort"></i>
                Sort By
            </div>
            <div class="menu-item" data-action="show-view-options">
                <i class="fas fa-sliders-h"></i>
                Show View Options
            </div>
            <div class="menu-divider"></div>
            ${isCloudLoggedIn ? `
            <div class="menu-item" data-action="cloud-refresh">
                <i class="fas fa-sync"></i>
                Refresh Cloud
            </div>
            ` : `
            <div class="menu-item" data-action="cloud-login">
                <i class="fas fa-cloud"></i>
                Sign in to nxCloud
            </div>
            `}
        `;
    }

    getDesktopMenuHTML(isCloudLoggedIn) {
        return `
            <div class="menu-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                New Folder
            </div>
            <div class="menu-item" data-action="paste" ${this.canPaste() ? '' : 'style="opacity:0.5; pointer-events:none;"'}>
                <i class="fas fa-paste"></i>
                Paste
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="clean-up">
                <i class="fas fa-broom"></i>
                Clean Up
            </div>
            <div class="menu-item" data-action="show-desktop">
                <i class="fas fa-desktop"></i>
                Show Desktop
            </div>
            <div class="menu-item" data-action="change-wallpaper">
                <i class="fas fa-image"></i>
                Change Wallpaper
            </div>
            <div class="menu-divider"></div>
            ${isCloudLoggedIn ? `
            <div class="menu-item" data-action="cloud-sync-desktop">
                <i class="fas fa-sync"></i>
                Sync Desktop with Cloud
            </div>
            ` : `
            <div class="menu-item" data-action="cloud-login">
                <i class="fas fa-cloud"></i>
                Sign in to nxCloud
            </div>
            `}
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="get-info">
                <i class="fas fa-info-circle"></i>
                Get Info
            </div>
        `;
    }

    getDesktopIconMenuHTML(icon, isCloudLoggedIn) {
        return `
            <div class="menu-item" data-action="open">
                <i class="fas fa-folder-open"></i>
                Open
            </div>
            <div class="menu-item" data-action="quicklook">
                <i class="fas fa-search"></i>
                Quick Look
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="cut">
                <i class="fas fa-cut"></i>
                Cut
            </div>
            <div class="menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                Copy
            </div>
            <div class="menu-item" data-action="paste" ${this.canPaste() ? '' : 'style="opacity:0.5; pointer-events:none;"'}>
                <i class="fas fa-paste"></i>
                Paste
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="rename">
                <i class="fas fa-i-cursor"></i>
                Rename
            </div>
            <div class="menu-item" data-action="duplicate">
                <i class="fas fa-clone"></i>
                Duplicate
            </div>
            <div class="menu-item" data-action="remove-icon">
                <i class="fas fa-times"></i>
                Remove from Desktop
            </div>
            <div class="menu-divider"></div>
            ${isCloudLoggedIn ? `
            <div class="menu-item" data-action="cloud-upload">
                <i class="fas fa-cloud-upload-alt"></i>
                Upload to Cloud
            </div>
            ` : ''}
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="get-info">
                <i class="fas fa-info-circle"></i>
                Get Info
            </div>
            <div class="menu-item" data-action="trash" style="color: #FF3B30;">
                <i class="fas fa-trash"></i>
                Move to Trash
            </div>
        `;
    }

    getDockMenuHTML(data) {
        return `
            <div class="menu-item" data-action="open">
                <i class="fas fa-folder-open"></i>
                Open
            </div>
            <div class="menu-item" data-action="show-in-finder">
                <i class="fas fa-finder"></i>
                Show in Finder
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="options">
                <i class="fas fa-cog"></i>
                Options
            </div>
            <div class="menu-item" data-action="keep-in-dock">
                <i class="fas fa-thumbtack"></i>
                Keep in Dock
            </div>
            <div class="menu-item" data-action="remove-from-dock">
                <i class="fas fa-times"></i>
                Remove from Dock
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="quit">
                <i class="fas fa-power-off"></i>
                Quit
            </div>
        `;
    }

    getDefaultMenuHTML() {
        return `
            <div class="menu-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                New Folder
            </div>
            <div class="menu-item" data-action="paste" ${this.canPaste() ? '' : 'style="opacity:0.5; pointer-events:none;"'}>
                <i class="fas fa-paste"></i>
                Paste
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="get-info">
                <i class="fas fa-info-circle"></i>
                Get Info
            </div>
        `;
    }

    showMenu(menu, x, y) {
        // Remove any existing menu
        this.closeMenu();

        // Position menu
        menu.style.position = 'fixed';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.zIndex = '10000';

        // Add to document
        document.body.appendChild(menu);
        this.activeMenu = menu;

        // Add click handlers to menu items
        menu.querySelectorAll('.menu-item[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(item.dataset.action);
            });
        });

        // Handle submenus
        menu.querySelectorAll('.has-submenu').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.showSubmenu(item);
            });
        });

        // Ensure menu stays within viewport
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - menuRect.width}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = `${window.innerHeight - menuRect.height}px`;
        }
    }

    showSubmenu(parentItem) {
        // Remove existing submenus
        document.querySelectorAll('.context-submenu').forEach(s => s.remove());

        const submenu = parentItem.nextElementSibling;
        if (!submenu || !submenu.classList.contains('submenu')) return;

        const parentRect = parentItem.getBoundingClientRect();
        submenu.style.position = 'fixed';
        submenu.style.left = `${parentRect.right}px`;
        submenu.style.top = `${parentRect.top}px`;
        submenu.style.zIndex = '10001';
        submenu.classList.add('context-submenu');

        document.body.appendChild(submenu);
    }

    closeMenu() {
        if (this.activeMenu) {
            this.activeMenu.remove();
            this.activeMenu = null;
        }
        document.querySelectorAll('.context-submenu').forEach(s => s.remove());
    }

    handleAction(action) {
        this.closeMenu();

        switch(action) {
            // Finder actions
            case 'open':
                window.FinderApp?.openSelectedItem();
                break;
            case 'quicklook':
                window.FinderApp?.showQuickLook();
                break;
            case 'new-folder':
                window.FinderApp?.createNewFolder();
                break;
            case 'cut':
                window.FinderApp?.cutSelected();
                break;
            case 'copy':
                window.FinderApp?.copySelected();
                break;
            case 'paste':
                window.FinderApp?.pasteClipboard();
                break;
            case 'rename':
                window.FinderApp?.renameSelected();
                break;
            case 'duplicate':
                window.FinderApp?.duplicateSelected();
                break;
            case 'compress':
                window.FinderApp?.compressSelected();
                break;
            case 'trash':
                window.FinderApp?.moveToTrash();
                break;
            case 'get-info':
                this.showGetInfo();
                break;

            // nxCloud actions
            case 'cloud-login':
                this.showCloudLogin();
                break;
            case 'cloud-upload':
                this.uploadToCloud();
                break;
            case 'cloud-share':
                this.shareViaCloud();
                break;
            case 'cloud-info':
                this.showCloudInfo();
                break;
            case 'cloud-refresh':
                this.refreshCloud();
                break;
            case 'cloud-sync-desktop':
                this.syncDesktopWithCloud();
                break;

            // Desktop actions
            case 'change-wallpaper':
                this.openSystemPreferences('wallpaper');
                break;
            case 'show-desktop':
                this.hideAllWindows();
                break;
            case 'clean-up':
                this.cleanUpDesktop();
                break;
        }
    }

    // nxCloud integration methods
    showCloudLogin() {
        // Create login modal
        const modal = document.createElement('div');
        modal.className = 'cloud-login-modal';
        modal.innerHTML = `
            <div class="cloud-login-content">
                <h2><i class="fas fa-cloud"></i> Sign in to nxCloud</h2>
                <input type="email" placeholder="Email" id="cloud-email">
                <input type="password" placeholder="Password" id="cloud-password">
                <div class="cloud-login-buttons">
                    <button id="cloud-login-btn">Sign In</button>
                    <button id="cloud-register-btn">Create Account</button>
                    <button id="cloud-close-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('cloud-login-btn').addEventListener('click', async () => {
            const email = document.getElementById('cloud-email').value;
            const password = document.getElementById('cloud-password').value;

            try {
                const res = await fetch('https://nex-cloud.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                
                if (data.success) {
                    localStorage.setItem('nxCloudToken', data.data.token);
                    localStorage.setItem('nxCloudUser', JSON.stringify(data.data));
                    modal.remove();
                    alert('✅ Signed in to nxCloud!');
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                alert('❌ Network error');
            }
        });

        document.getElementById('cloud-register-btn').addEventListener('click', () => {
            modal.remove();
            this.showCloudRegister();
        });

        document.getElementById('cloud-close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    showCloudRegister() {
        // Similar to login but with register form
        const modal = document.createElement('div');
        modal.className = 'cloud-login-modal';
        modal.innerHTML = `
            <div class="cloud-login-content">
                <h2><i class="fas fa-cloud"></i> Create nxCloud Account</h2>
                <input type="text" placeholder="Username" id="cloud-username">
                <input type="email" placeholder="Email" id="cloud-email">
                <input type="password" placeholder="Password" id="cloud-password">
                <div class="cloud-login-buttons">
                    <button id="cloud-register-btn">Create Account</button>
                    <button id="cloud-back-btn">Back to Login</button>
                    <button id="cloud-close-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('cloud-register-btn').addEventListener('click', async () => {
            const username = document.getElementById('cloud-username').value;
            const email = document.getElementById('cloud-email').value;
            const password = document.getElementById('cloud-password').value;

            try {
                const res = await fetch('https://nex-cloud.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();
                
                if (data.success) {
                    localStorage.setItem('nxCloudToken', data.data.token);
                    localStorage.setItem('nxCloudUser', JSON.stringify(data.data));
                    modal.remove();
                    alert('✅ Account created! You\'re signed in.');
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                alert('❌ Network error');
            }
        });

        document.getElementById('cloud-back-btn').addEventListener('click', () => {
            modal.remove();
            this.showCloudLogin();
        });

        document.getElementById('cloud-close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    async uploadToCloud() {
        const token = localStorage.getItem('nxCloudToken');
        if (!token) {
            this.showCloudLogin();
            return;
        }

        // Get selected file from Finder
        const selectedItems = window.FinderApp?.getSelectedItems();
        if (!selectedItems || selectedItems.length === 0) {
            alert('Select a file to upload');
            return;
        }

        alert(`📤 Would upload ${selectedItems.length} item(s) to nxCloud`);
        // In real implementation, you'd create FormData and upload
    }

    async shareViaCloud() {
        const token = localStorage.getItem('nxCloudToken');
        if (!token) {
            this.showCloudLogin();
            return;
        }

        alert('🔗 Share link would be generated');
    }

    async refreshCloud() {
        alert('☁️ Refreshing cloud files...');
    }

    // Helper methods
    canPaste() {
        return window.FinderApp?.clipboard?.length > 0;
    }

    showGetInfo() {
        alert('Get Info panel would appear');
    }

    openSystemPreferences(section) {
        if (window.SystemPreferences) {
            window.SystemPreferences.open(section);
        }
    }

    hideAllWindows() {
        document.querySelectorAll('.window').forEach(w => {
            w.style.display = 'none';
        });
    }

    cleanUpDesktop() {
        alert('Desktop icons would be rearranged');
    }

    syncDesktopWithCloud() {
        alert('☁️ Syncing desktop with nxCloud...');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ContextMenuManager = new ContextMenuManager();
}); 