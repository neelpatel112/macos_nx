// menubar.js - Full macOS Style Menu Bar Functionality
class MenuBar {
    constructor() {
        this.menuBar = document.querySelector('.menu-bar');
        this.activeMenu = null;
        this.menuStack = [];
        this.appState = {
            activeApp: 'Finder',
            isDarkMode: false,
            wifiEnabled: true,
            bluetoothEnabled: false,
            volume: 70,
            batteryLevel: 85,
            isCharging: true,
            currentSpace: 1,
            totalSpaces: 3
        };
        
        this.init();
    }
    
    init() {
        this.createMenuStructure();
        this.setupEventListeners();
        this.startTimeUpdate();
        this.updateStatusIcons();
        console.log('🍎 Menu Bar initialized');
    }
    
    createMenuStructure() {
        // Clear existing menu items
        const existingMenuItems = this.menuBar.querySelectorAll('.menu-item:not(.apple-menu)');
        existingMenuItems.forEach(item => item.remove());
        
        // Apple Menu (already exists, but we'll enhance it)
        const appleMenu = this.menuBar.querySelector('.apple-menu');
        appleMenu.innerHTML = '<i class="fab fa-apple"></i>';
        appleMenu.classList.add('has-dropdown');
        appleMenu.setAttribute('data-menu', 'apple');
        
        // Create all menu items with dropdowns
        const menuItems = [
            { name: 'Finder', menu: 'finder' },
            { name: 'File', menu: 'file' },
            { name: 'Edit', menu: 'edit' },
            { name: 'View', menu: 'view' },
            { name: 'Go', menu: 'go' },
            { name: 'Window', menu: 'window' },
            { name: 'Help', menu: 'help' }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item has-dropdown';
            menuItem.textContent = item.name;
            menuItem.setAttribute('data-menu', item.menu);
            this.menuBar.insertBefore(menuItem, document.querySelector('.status-area'));
        });
        
        // Create dropdown containers
        this.createDropdowns();
    }
    
    createDropdowns() {
        const dropdowns = {
            apple: `
                <div class="menu-dropdown" data-menu="apple">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘,</span> System Preferences...</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⎵</span> App Store...</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Recent Items</div>
                        <div class="menu-row submenu">
                            <span>Documents</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
                        <div class="menu-row submenu">
                            <span>Applications</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
                        <div class="menu-row submenu">
                            <span>Servers</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥⎋</span> Force Quit...</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘Q</span> Sleep</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘Q</span> Restart...</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘Q</span> Shut Down...</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘Q</span> Lock Screen</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘Q</span> Log Out Neel...</div>
                    </div>
                </div>
            `,
            
            finder: `
                <div class="menu-dropdown" data-menu="finder">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘N</span> New Finder Window</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘N</span> New Folder</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘O</span> Open</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘W</span> Close Window</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘I</span> Get Info</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥I</span> Show Inspector</div>
                        <div class="menu-row">Duplicate</div>
                        <div class="menu-row">Make Alias</div>
                        <div class="menu-row">Quick Look</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Services</div>
                        <div class="menu-row">Hide Finder</div>
                        <div class="menu-row">Hide Others</div>
                        <div class="menu-row">Show All</div>
                    </div>
                </div>
            `,
            
            file: `
                <div class="menu-dropdown" data-menu="file">
                    <div class="dropdown-section">
                        <div class="menu-row disabled">New</div>
                        <div class="menu-row disabled">Open...</div>
                        <div class="menu-row disabled">Close</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row disabled">Save</div>
                        <div class="menu-row disabled">Save As...</div>
                        <div class="menu-row disabled">Revert to Saved</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Export as PDF...</div>
                        <div class="menu-row">Print...</div>
                    </div>
                </div>
            `,
            
            edit: `
                <div class="menu-dropdown" data-menu="edit">
                    <div class="dropdown-section">
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘Z</span> Undo</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⇧⌘Z</span> Redo</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘X</span> Cut</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘C</span> Copy</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘V</span> Paste</div>
                        <div class="menu-row disabled">Paste and Match Style</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘A</span> Select All</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Find</div>
                        <div class="menu-row">Spelling and Grammar</div>
                        <div class="menu-row">Substitutions</div>
                    </div>
                </div>
            `,
            
            view: `
                <div class="menu-dropdown" data-menu="view">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘1</span> as Icons</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘2</span> as List</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘3</span> as Columns</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘4</span> as Gallery</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘/</span> Show Path Bar</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥S</span> Show Sidebar</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥T</span> Show Toolbar</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘.</span> Show Hidden Files</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Enter Full Screen</div>
                        <div class="menu-row">Hide Toolbar</div>
                        <div class="menu-row">Customize Toolbar...</div>
                    </div>
                </div>
            `,
            
            go: `
                <div class="menu-dropdown" data-menu="go">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘[</span> Back</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘]</span> Forward</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘↑</span> Enclosing Folder</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘F</span> Recents</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘O</span> Documents</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘D</span> Desktop</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘H</span> Home</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘C</span> Computer</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘K</span> Network</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘I</span> iCloud Drive</div>
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘R</span> AirDrop</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘⇧G</span> Go to Folder...</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘K</span> Connect to Server...</div>
                    </div>
                </div>
            `,
            
            window: `
                <div class="menu-dropdown" data-menu="window">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘M</span> Minimize</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥M</span> Minimize All</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘W</span> Close Window</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥W</span> Close All</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Zoom</div>
                        <div class="menu-row">Enter Full Screen</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Cycle Through Windows</div>
                        <div class="menu-row">Show Previous Tab</div>
                        <div class="menu-row">Show Next Tab</div>
                        <div class="menu-row">Move Tab to New Window</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Bring All to Front</div>
                    </div>
                </div>
            `,
            
            help: `
                <div class="menu-dropdown" data-menu="help">
                    <div class="menu-row help-search">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search" id="helpSearch">
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">macOS Help</div>
                        <div class="menu-row">Developer Documentation</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">About This Mac</div>
                        <div class="menu-row">System Report...</div>
                        <div class="menu-row">Software Update...</div>
                    </div>
                </div>
            `
        };
        
        // Add dropdowns to page
        Object.keys(dropdowns).forEach(key => {
            const dropdown = document.createElement('div');
            dropdown.innerHTML = dropdowns[key];
            this.menuBar.appendChild(dropdown.firstElementChild);
        });
    }
    
    setupEventListeners() {
        // Menu item click handlers
        this.menuBar.querySelectorAll('.menu-item.has-dropdown').forEach(item => {
            item.addEventListener('click', (e) => this.toggleMenu(e));
            item.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
        });
        
        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-item') && !e.target.closest('.menu-dropdown')) {
                this.closeAllMenus();
            }
        });
        
        // Status area click handlers
        const statusArea = document.querySelector('.status-area');
        statusArea.addEventListener('click', () => this.showControlCenter());
        
        // Help search
        const helpSearch = document.getElementById('helpSearch');
        if (helpSearch) {
            helpSearch.addEventListener('input', (e) => this.searchHelp(e.target.value));
        }
    }
    
    toggleMenu(e) {
        e.stopPropagation();
        const menuItem = e.currentTarget;
        const menuName = menuItem.dataset.menu;
        const dropdown = this.menuBar.querySelector(`.menu-dropdown[data-menu="${menuName}"]`);
        
        if (this.activeMenu === dropdown) {
            this.closeAllMenus();
        } else {
            this.closeAllMenus();
            this.showMenu(menuItem, dropdown);
        }
    }
    
    handleMouseEnter(e) {
        if (this.activeMenu) {
            const menuItem = e.currentTarget;
            const menuName = menuItem.dataset.menu;
            const dropdown = this.menuBar.querySelector(`.menu-dropdown[data-menu="${menuName}"]`);
            
            this.closeAllMenus();
            this.showMenu(menuItem, dropdown);
        }
    }
    
    showMenu(menuItem, dropdown) {
        menuItem.classList.add('active');
        dropdown.classList.add('active');
        
        // Position dropdown
        const rect = menuItem.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        
        this.activeMenu = dropdown;
    }
    
    closeAllMenus() {
        this.menuBar.querySelectorAll('.menu-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        this.menuBar.querySelectorAll('.menu-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        this.activeMenu = null;
    }
    
    startTimeUpdate() {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            document.getElementById('time').textContent = timeStr;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    updateStatusIcons() {
        const statusArea = document.querySelector('.status-area');
        
        // Add additional status icons
        const wifiIcon = document.createElement('i');
        wifiIcon.className = 'fas fa-wifi status-icon';
        wifiIcon.title = 'Wi-Fi: Connected';
        
        const batteryIcon = document.createElement('i');
        batteryIcon.className = 'fas fa-battery-three-quarters status-icon';
        batteryIcon.title = 'Battery: 85%';
        
        const volumeIcon = document.createElement('i');
        volumeIcon.className = 'fas fa-volume-up status-icon';
        volumeIcon.title = 'Volume: 70%';
        
        // Insert before time
        statusArea.insertBefore(volumeIcon, document.getElementById('time'));
        statusArea.insertBefore(batteryIcon, document.getElementById('time'));
        statusArea.insertBefore(wifiIcon, document.getElementById('time'));
    }
    
    showControlCenter() {
        // Create control center popup
        let controlCenter = document.querySelector('.control-center');
        
        if (controlCenter) {
            controlCenter.remove();
            return;
        }
        
        controlCenter = document.createElement('div');
        controlCenter.className = 'control-center';
        
        controlCenter.innerHTML = `
            <div class="control-section">
                <div class="control-row">
                    <i class="fas fa-wifi"></i>
                    <span>Wi-Fi</span>
                    <label class="switch">
                        <input type="checkbox" ${this.appState.wifiEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-row">
                    <i class="fab fa-bluetooth-b"></i>
                    <span>Bluetooth</span>
                    <label class="switch">
                        <input type="checkbox" ${this.appState.bluetoothEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="control-section">
                <div class="control-row">
                    <i class="fas fa-sun"></i>
                    <span>Display</span>
                    <div class="brightness-control">
                        <i class="fas fa-sun"></i>
                        <input type="range" min="0" max="100" value="80">
                    </div>
                </div>
                <div class="control-row">
                    <i class="fas fa-volume-up"></i>
                    <span>Sound</span>
                    <div class="volume-control">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" min="0" max="100" value="${this.appState.volume}">
                    </div>
                </div>
            </div>
            
            <div class="control-section">
                <div class="control-row">
                    <i class="fas fa-moon"></i>
                    <span>Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="darkModeToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-row">
                    <i class="fas fa-mobile-alt"></i>
                    <span>Do Not Disturb</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="control-section">
                <div class="control-row">
                    <i class="fas fa-battery-three-quarters"></i>
                    <span>Battery: ${this.appState.batteryLevel}%</span>
                    <span class="battery-status">${this.appState.isCharging ? '⚡ Charging' : ''}</span>
                </div>
            </div>
            
            <div class="control-section">
                <div class="space-control">
                    <span>Space ${this.appState.currentSpace} of ${this.appState.totalSpaces}</span>
                    <div class="space-dots">
                        ${Array(this.appState.totalSpaces).fill(0).map((_, i) => 
                            `<span class="space-dot ${i+1 === this.appState.currentSpace ? 'active' : ''}"></span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Position control center
        const statusRect = document.querySelector('.status-area').getBoundingClientRect();
        controlCenter.style.top = `${statusRect.bottom}px`;
        controlCenter.style.right = '20px';
        
        document.body.appendChild(controlCenter);
        
        // Add event listeners for toggles
        setTimeout(() => {
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('change', (e) => {
                    this.toggleDarkMode(e.target.checked);
                });
            }
        }, 100);
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeControl(e) {
                if (!e.target.closest('.control-center') && !e.target.closest('.status-area')) {
                    controlCenter.remove();
                    document.removeEventListener('click', closeControl);
                }
            });
        }, 0);
    }
    
    toggleDarkMode(enabled) {
        this.appState.isDarkMode = enabled;
        
        if (enabled) {
            document.body.classList.add('dark-mode');
            document.querySelectorAll('.window').forEach(win => {
                win.style.background = '#1e1e1e';
            });
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelectorAll('.window').forEach(win => {
                win.style.background = '';
            });
        }
    }
    
    searchHelp(query) {
        console.log('Searching help for:', query);
        // Implement help search functionality
    }
}

// Initialize menu bar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍎 Initializing Menu Bar...');
    window.MenuBar = new MenuBar();
}); 