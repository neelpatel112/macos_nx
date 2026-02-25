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
            totalSpaces: 3,
            currentUser: 'Neel'
        };
        
        this.init();
    }
    
    init() {
        this.createMenuStructure();
        this.setupEventListeners();
        this.startTimeUpdate();
        this.updateStatusIcons();
        this.setupKeyboardShortcuts();
        console.log('🍎 Menu Bar initialized');
    }
    
    createMenuStructure() {
        // Clear existing menu items but preserve status area
        const menuItems = this.menuBar.querySelectorAll('.menu-item:not(.apple-menu):not(.status-area)');
        menuItems.forEach(item => item.remove());
        
        // Enhance Apple Menu
        const appleMenu = this.menuBar.querySelector('.apple-menu');
        appleMenu.innerHTML = '<i class="fab fa-apple"></i>';
        appleMenu.classList.add('has-dropdown');
        appleMenu.setAttribute('data-menu', 'apple');
        
        // Create all menu items with proper macOS ordering
        const menuItemsList = [
            { name: 'Finder', menu: 'finder', isBold: true },
            { name: 'File', menu: 'file' },
            { name: 'Edit', menu: 'edit' },
            { name: 'View', menu: 'view' },
            { name: 'Go', menu: 'go' },
            { name: 'Window', menu: 'window' },
            { name: 'Help', menu: 'help' }
        ];
        
        menuItemsList.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item has-dropdown';
            menuItem.textContent = item.name;
            if (item.isBold) {
                menuItem.style.fontWeight = '600';
            }
            menuItem.setAttribute('data-menu', item.menu);
            this.menuBar.insertBefore(menuItem, document.querySelector('.status-area'));
        });
        
        // Create dropdowns
        this.createDropdowns();
    }
    
    createDropdowns() {
        // Remove existing dropdowns
        const existingDropdowns = document.querySelectorAll('.menu-dropdown');
        existingDropdowns.forEach(dropdown => dropdown.remove());
        
        const dropdowns = {
            apple: `
                <div class="menu-dropdown" data-menu="apple">
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘,</span> System Preferences...</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⎵</span> App Store...</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row has-submenu">
                            <span>Recent Items</span>
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
                        <div class="menu-row"><span class="menu-shortcut">⌘Q</span> Log Out ${this.appState.currentUser}...</div>
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
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥W</span> Close All</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘I</span> Get Info</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥I</span> Show Inspector</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘D</span> Duplicate</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘L</span> Make Alias</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘Y</span> Quick Look</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row has-submenu">
                            <span>Services</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⌘H</span> Hide Finder</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘⌥H</span> Hide Others</div>
                        <div class="menu-row">Show All</div>
                    </div>
                </div>
            `,
            
            file: `
                <div class="menu-dropdown" data-menu="file">
                    <div class="dropdown-section">
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘N</span> New</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘O</span> Open...</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘W</span> Close</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row disabled"><span class="menu-shortcut">⌘S</span> Save</div>
                        <div class="menu-row disabled"><span class="menu-shortcut">⇧⌘S</span> Save As...</div>
                        <div class="menu-row disabled">Revert to Saved</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row">Export as PDF...</div>
                        <div class="menu-row"><span class="menu-shortcut">⌘P</span> Print...</div>
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
                        <div class="menu-row has-submenu">
                            <span>Find</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
                        <div class="menu-row has-submenu">
                            <span>Spelling and Grammar</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
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
                        <div class="menu-row has-submenu">
                            <span>Hide Toolbar</span>
                            <span class="submenu-indicator">▶</span>
                        </div>
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
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-section">
                        <div class="menu-row"><span class="menu-shortcut">⇧⌘G</span> Go to Folder...</div>
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
                        <div class="menu-row" onclick="window.MenuBar?.openAboutThisMac()">About This Mac</div>
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
        
        // Apple menu specific handling
        const appleMenu = this.menuBar.querySelector('.apple-menu');
        appleMenu.addEventListener('click', (e) => this.toggleMenu(e));
        
        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-item') && !e.target.closest('.menu-dropdown')) {
                this.closeAllMenus();
            }
        });
        
        // Status area click handlers
        const statusArea = document.querySelector('.status-area');
        statusArea.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showControlCenter();
        });
        
        // Help search
        const helpSearch = document.getElementById('helpSearch');
        if (helpSearch) {
            helpSearch.addEventListener('input', (e) => this.searchHelp(e.target.value));
            helpSearch.addEventListener('click', (e) => e.stopPropagation());
        }
        
        // Submenu handling
        document.addEventListener('mouseenter', (e) => {
            const submenuTrigger = e.target.closest('.has-submenu');
            if (submenuTrigger) {
                this.showSubmenu(submenuTrigger);
            }
        }, true);
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
            
            if (dropdown && dropdown !== this.activeMenu) {
                this.closeAllMenus();
                this.showMenu(menuItem, dropdown);
            }
        }
    }
    
    showMenu(menuItem, dropdown) {
        menuItem.classList.add('active');
        dropdown.classList.add('active');
        
        // Position dropdown with animation
        const rect = menuItem.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        
        // Add entrance animation
        dropdown.style.animation = 'menuDropdownFadeIn 0.15s ease-out';
        
        this.activeMenu = dropdown;
    }
    
    closeAllMenus() {
        this.menuBar.querySelectorAll('.menu-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        this.menuBar.querySelectorAll('.menu-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        // Close any open submenus
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.remove();
        });
        
        this.activeMenu = null;
    }
    
    showSubmenu(trigger) {
        // Remove existing submenus
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.remove();
        });
        
        const parentRow = trigger.closest('.menu-row');
        if (!parentRow) return;
        
        const rect = parentRow.getBoundingClientRect();
        const submenu = document.createElement('div');
        submenu.className = 'submenu';
        
        // Different submenu content based on trigger
        if (trigger.textContent.includes('Services')) {
            submenu.innerHTML = `
                <div class="menu-row disabled">Text</div>
                <div class="menu-row disabled">Files</div>
                <div class="menu-row disabled">Media</div>
                <div class="dropdown-divider"></div>
                <div class="menu-row disabled">Services Preferences...</div>
            `;
        } else if (trigger.textContent.includes('Find')) {
            submenu.innerHTML = `
                <div class="menu-row disabled">Find...</div>
                <div class="menu-row disabled">Find Next</div>
                <div class="menu-row disabled">Find Previous</div>
            `;
        } else {
            submenu.innerHTML = `
                <div class="menu-row">Option 1</div>
                <div class="menu-row">Option 2</div>
                <div class="menu-row">Option 3</div>
            `;
        }
        
        // Position submenu
        submenu.style.top = `${rect.top}px`;
        submenu.style.left = `${rect.right}px`;
        
        document.body.appendChild(submenu);
        
        // Add fade-in animation
        submenu.style.animation = 'menuDropdownFadeIn 0.1s ease-out';
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
        
        // Clear existing icons except time
        const existingIcons = statusArea.querySelectorAll('.status-icon:not(#time)');
        existingIcons.forEach(icon => icon.remove());
        
        // Add status icons in correct macOS order (right to left)
        const icons = [
            { icon: 'fa-search', title: 'Spotlight', id: 'spotlight-icon' },
            { icon: 'fa-wifi', title: 'Wi-Fi: Connected', id: 'wifi-icon' },
            { icon: 'fa-bluetooth-b', title: 'Bluetooth: Off', id: 'bluetooth-icon' },
            { icon: 'fa-volume-up', title: `Volume: ${this.appState.volume}%`, id: 'volume-icon' },
            { icon: 'fa-battery-three-quarters', title: `Battery: ${this.appState.batteryLevel}%`, id: 'battery-icon' }
        ];
        
        icons.reverse().forEach(iconData => {
            const icon = document.createElement('i');
            icon.className = `fas ${iconData.icon} status-icon`;
            icon.id = iconData.id;
            icon.title = iconData.title;
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleStatusIconClick(iconData.id);
            });
            statusArea.insertBefore(icon, document.getElementById('time'));
        });
    }
    
    handleStatusIconClick(iconId) {
        switch(iconId) {
            case 'spotlight-icon':
                this.showSpotlight();
                break;
            case 'wifi-icon':
                this.showNetworkMenu();
                break;
            case 'bluetooth-icon':
                this.showBluetoothMenu();
                break;
            case 'volume-icon':
                this.showVolumeMenu();
                break;
            case 'battery-icon':
                this.showBatteryMenu();
                break;
        }
    }
    
    showSpotlight() {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        spotlight.innerHTML = `
            <div class="spotlight-search">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Spotlight Search" autofocus>
            </div>
            <div class="spotlight-results">
                <div class="spotlight-category">Applications</div>
                <div class="spotlight-result"><i class="fas fa-folder"></i> Finder</div>
                <div class="spotlight-result"><i class="fab fa-safari"></i> Safari</div>
                <div class="spotlight-result"><i class="fas fa-cog"></i> System Preferences</div>
            </div>
        `;
        
        document.body.appendChild(spotlight);
        
        // Animation
        spotlight.style.animation = 'spotlightFadeIn 0.2s ease-out';
        
        // Close on click outside or escape
        const closeSpotlight = (e) => {
            if (e.key === 'Escape' || !e.target.closest('.spotlight')) {
                spotlight.remove();
                document.removeEventListener('keydown', closeSpotlight);
                document.removeEventListener('click', closeSpotlight);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('keydown', closeSpotlight);
            document.addEventListener('click', closeSpotlight);
            spotlight.querySelector('input').focus();
        }, 100);
    }
    
    showControlCenter() {
        // Remove existing control center
        const existingControl = document.querySelector('.control-center');
        if (existingControl) {
            existingControl.remove();
            return;
        }
        
        const controlCenter = document.createElement('div');
        controlCenter.className = 'control-center';
        
        controlCenter.innerHTML = `
            <div class="control-section">
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-wifi"></i></div>
                    <span>Wi-Fi</span>
                    <label class="switch">
                        <input type="checkbox" ${this.appState.wifiEnabled ? 'checked' : ''} id="wifiToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-row">
                    <div class="control-icon"><i class="fab fa-bluetooth-b"></i></div>
                    <span>Bluetooth</span>
                    <label class="switch">
                        <input type="checkbox" ${this.appState.bluetoothEnabled ? 'checked' : ''} id="bluetoothToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-moon"></i></div>
                    <span>Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="darkModeToggle" ${this.appState.isDarkMode ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="control-section">
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-sun"></i></div>
                    <span>Display</span>
                    <div class="control-slider">
                        <i class="fas fa-sun"></i>
                        <input type="range" min="0" max="100" value="80" class="slider-input">
                    </div>
                </div>
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-volume-up"></i></div>
                    <span>Sound</span>
                    <div class="control-slider">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" min="0" max="100" value="${this.appState.volume}" class="slider-input" id="volumeSlider">
                    </div>
                </div>
            </div>
            
            <div class="control-section">
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-battery-three-quarters"></i></div>
                    <span>Battery: ${this.appState.batteryLevel}%</span>
                    <span class="battery-status">${this.appState.isCharging ? '⚡ Charging' : ''}</span>
                </div>
                <div class="control-row">
                    <div class="control-icon"><i class="fas fa-desktop"></i></div>
                    <span>Space ${this.appState.currentSpace} of ${this.appState.totalSpaces}</span>
                    <div class="space-dots">
                        ${Array(this.appState.totalSpaces).fill(0).map((_, i) => 
                            `<span class="space-dot ${i+1 === this.appState.currentSpace ? 'active' : ''}"></span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="control-section now-playing">
                <i class="fas fa-music"></i>
                <div class="now-playing-info">
                    <div class="track-name">Not Playing</div>
                    <div class="artist-name">No Music</div>
                </div>
            </div>
        `;
        
        // Position control center
        const statusRect = document.querySelector('.status-area').getBoundingClientRect();
        controlCenter.style.top = `${statusRect.bottom + 8}px`;
        controlCenter.style.right = '16px';
        
        document.body.appendChild(controlCenter);
        
        // Animation
        controlCenter.style.animation = 'controlCenterFadeIn 0.2s ease-out';
        
        // Event listeners
        setTimeout(() => {
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('change', (e) => {
                    this.toggleDarkMode(e.target.checked);
                });
            }
            
            const wifiToggle = document.getElementById('wifiToggle');
            if (wifiToggle) {
                wifiToggle.addEventListener('change', (e) => {
                    this.appState.wifiEnabled = e.target.checked;
                    this.updateWifiIcon();
                });
            }
            
            const bluetoothToggle = document.getElementById('bluetoothToggle');
            if (bluetoothToggle) {
                bluetoothToggle.addEventListener('change', (e) => {
                    this.appState.bluetoothEnabled = e.target.checked;
                    this.updateBluetoothIcon();
                });
            }
            
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.appState.volume = e.target.value;
                    this.updateVolumeIcon();
                });
            }
        }, 100);
        
        // Close when clicking outside
        const closeControlCenter = (e) => {
            if (!controlCenter.contains(e.target) && !e.target.closest('.status-area')) {
                controlCenter.remove();
                document.removeEventListener('click', closeControlCenter);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeControlCenter);
        }, 0);
    }
    
    toggleDarkMode(enabled) {
        this.appState.isDarkMode = enabled;
        
        if (enabled) {
            document.body.classList.add('dark-mode');
            document.documentElement.style.setProperty('--menu-bar-bg', 'rgba(40, 40, 40, 0.8)');
            document.documentElement.style.setProperty('--dropdown-bg', 'rgba(50, 50, 50, 0.95)');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.style.setProperty('--menu-bar-bg', 'rgba(255, 255, 255, 0.7)');
            document.documentElement.style.setProperty('--dropdown-bg', 'rgba(255, 255, 255, 0.95)');
        }
    }
    
    updateWifiIcon() {
        const wifiIcon = document.getElementById('wifi-icon');
        if (wifiIcon) {
            wifiIcon.className = `fas ${this.appState.wifiEnabled ? 'fa-wifi' : 'fa-wifi-slash'} status-icon`;
            wifiIcon.title = `Wi-Fi: ${this.appState.wifiEnabled ? 'Connected' : 'Disabled'}`;
        }
    }
    
    updateBluetoothIcon() {
        const btIcon = document.getElementById('bluetooth-icon');
        if (btIcon) {
            btIcon.className = `fab fa-bluetooth-b status-icon`;
            btIcon.title = `Bluetooth: ${this.appState.bluetoothEnabled ? 'On' : 'Off'}`;
            btIcon.style.opacity = this.appState.bluetoothEnabled ? '1' : '0.5';
        }
    }
    
    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volume-icon');
        if (volumeIcon) {
            const volume = this.appState.volume;
            if (volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute status-icon';
            } else if (volume < 30) {
                volumeIcon.className = 'fas fa-volume-off status-icon';
            } else if (volume < 70) {
                volumeIcon.className = 'fas fa-volume-down status-icon';
            } else {
                volumeIcon.className = 'fas fa-volume-up status-icon';
            }
            volumeIcon.title = `Volume: ${volume}%`;
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Command + Space for Spotlight
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                this.showSpotlight();
            }
            
            // Command + , for Preferences
            if ((e.metaKey || e.ctrlKey) && e.key === ',') {
                e.preventDefault();
                this.openSystemPreferences();
            }
            
            // Escape to close menus
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    }
    
    searchHelp(query) {
        console.log('Searching help for:', query);
        // Implement help search
    }
    
    openAboutThisMac() {
        if (window.WindowManager) {
            const aboutWindow = window.WindowManager.createWindow('About This Mac', {
                width: 500,
                height: 400,
                title: 'About This Mac'
            });
            
            // Create about window HTML
            const windowElement = document.createElement('div');
            windowElement.className = 'window about-mac';
            windowElement.innerHTML = `
                <div class="window-titlebar">
                    <div class="window-controls">
                        <span class="window-close"></span>
                        <span class="window-minimize"></span>
                        <span class="window-zoom"></span>
                    </div>
                    <span class="window-title">About This Mac</span>
                </div>
                <div class="window-content about-content">
                    <div class="about-logo">
                        <i class="fab fa-apple" style="font-size: 64px;"></i>
                    </div>
                    <h2>macOS Web Emulator</h2>
                    <p>Version 1.0</p>
                    <p>macOS Ventura</p>
                    <div class="about-specs">
                        <div>MacBook Pro, 2023</div>
                        <div>Apple M2 Pro</div>
                        <div>16 GB RAM</div>
                        <div>Startup Disk: Macintosh HD</div>
                    </div>
                    <button class="about-button">System Report...</button>
                </div>
            `;
            
            // Add to window manager
            // Implementation depends on your window manager
        }
    }
    
    openSystemPreferences() {
        // Open system preferences window
        console.log('Opening System Preferences');
    }
    
    showNetworkMenu() {
        const menu = document.createElement('div');
        menu.className = 'status-menu';
        menu.innerHTML = `
            <div class="menu-row"><i class="fas fa-wifi"></i> Wi-Fi: ${this.appState.wifiEnabled ? 'On' : 'Off'}</div>
            <div class="menu-row">${this.appState.wifiEnabled ? 'Disconnect' : 'Connect to Network'}</div>
            <div class="dropdown-divider"></div>
            <div class="menu-row">Network Preferences...</div>
        `;
        
        this.showStatusMenu(menu);
    }
    
    showVolumeMenu() {
        const menu = document.createElement('div');
        menu.className = 'status-menu volume-menu';
        menu.innerHTML = `
            <div class="menu-row">
                <i class="fas fa-volume-up"></i>
                <input type="range" min="0" max="100" value="${this.appState.volume}" class="volume-slider">
            </div>
            <div class="menu-row">Output Device: Internal Speakers</div>
            <div class="dropdown-divider"></div>
            <div class="menu-row">Sound Preferences...</div>
        `;
        
        this.showStatusMenu(menu);
        
        // Add volume slider event
        const slider = menu.querySelector('.volume-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.appState.volume = e.target.value;
                this.updateVolumeIcon();
            });
        }
    }
    
    showBatteryMenu() {
        const menu = document.createElement('div');
        menu.className = 'status-menu';
        menu.innerHTML = `
            <div class="menu-row"><i class="fas fa-battery-three-quarters"></i> Battery: ${this.appState.batteryLevel}%</div>
            <div class="menu-row">${this.appState.isCharging ? '⚡ Charging' : 'On Battery'}</div>
            <div class="dropdown-divider"></div>
            <div class="menu-row">Battery Preferences...</div>
        `;
        
        this.showStatusMenu(menu);
    }
    
    showBluetoothMenu() {
        const menu = document.createElement('div');
        menu.className = 'status-menu';
        menu.innerHTML = `
            <div class="menu-row"><i class="fab fa-bluetooth-b"></i> Bluetooth: ${this.appState.bluetoothEnabled ? 'On' : 'Off'}</div>
            <div class="menu-row">${this.appState.bluetoothEnabled ? 'Turn Off' : 'Turn On'}</div>
            <div class="dropdown-divider"></div>
            <div class="menu-row">Bluetooth Preferences...</div>
        `;
        
        this.showStatusMenu(menu);
    }
    
    showStatusMenu(menu) {
        // Remove any existing status menu
        const existing = document.querySelector('.status-menu');
        if (existing) existing.remove();
        
        // Position menu
        const statusRect = document.querySelector('.status-area').getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${statusRect.bottom}px`;
        menu.style.right = '20px';
        menu.style.background = 'var(--dropdown-bg)';
        menu.style.backdropFilter = 'blur(20px)';
        menu.style.borderRadius = '8px';
        menu.style.padding = '8px 0';
        menu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        menu.style.minWidth = '200px';
        menu.style.zIndex = '9999';
        menu.style.animation = 'menuDropdownFadeIn 0.15s ease-out';
        
        document.body.appendChild(menu);
        
        // Close on click outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !e.target.closest('.status-icon')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }
}

// Initialize menu bar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍎 Initializing Menu Bar...');
    window.MenuBar = new MenuBar();
}); 