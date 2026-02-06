// system-preferences.js - COMPLETE FINAL VERSION
class SystemPreferences {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentPane = 'general';
        this.zIndex = 100;
        this.settings = {
            dockSize: 52,
            appearance: 'light',
            accentColor: '#007AFF',
            volume: 70,
            brightness: 80
        };
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        this.loadSettings();
    }
    
    createWindow() {
        // Create window container
        this.window = document.createElement('div');
        this.window.className = 'window system-preferences-window';
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 900px;
            height: 600px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: ${this.zIndex};
            animation: windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
        `;
        
        // Full System Preferences UI
        this.window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">System Preferences</div>
            </div>
            
            <div class="window-content">
                <div class="system-preferences-container">
                    <!-- Sidebar -->
                    <div class="prefs-sidebar">
                        <div class="prefs-search">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search" id="prefsSearch">
                        </div>
                        
                        <div class="prefs-categories">
                            <button class="prefs-category active" data-pane="general">
                                <i class="fas fa-gear"></i>
                                <span>General</span>
                            </button>
                            <button class="prefs-category" data-pane="desktop">
                                <i class="fas fa-desktop"></i>
                                <span>Desktop & Dock</span>
                            </button>
                            <button class="prefs-category" data-pane="sound">
                                <i class="fas fa-volume-up"></i>
                                <span>Sound</span>
                            </button>
                            <button class="prefs-category" data-pane="display">
                                <i class="fas fa-display"></i>
                                <span>Displays</span>
                            </button>
                            <button class="prefs-category" data-pane="wallpaper">
                                <i class="fas fa-image"></i>
                                <span>Wallpaper</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="prefs-content">
                        <!-- General Pane -->
                        <div class="prefs-pane active" id="general-pane">
                            <h2><i class="fas fa-gear"></i> General</h2>
                            <div class="prefs-section">
                                <h3>Appearance</h3>
                                <div class="prefs-option">
                                    <label>Appearance:</label>
                                    <div class="segmented-control">
                                        <button class="segmented-btn ${this.settings.appearance === 'light' ? 'active' : ''}" data-value="light">Light</button>
                                        <button class="segmented-btn ${this.settings.appearance === 'dark' ? 'active' : ''}" data-value="dark">Dark</button>
                                        <button class="segmented-btn ${this.settings.appearance === 'auto' ? 'active' : ''}" data-value="auto">Auto</button>
                                    </div>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>Accent color:</label>
                                    <div class="color-picker">
                                        ${['#007AFF', '#FF9500', '#FF3B30', '#34C759', '#5AC8FA', '#AF52DE', '#FF2D55', '#5856D6']
                                            .map(color => `
                                            <div class="color-option ${this.settings.accentColor === color ? 'active' : ''}" 
                                                 data-color="${color}" 
                                                 style="background: ${color};">
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="prefs-section">
                                <h3>Highlight color</h3>
                                <select class="prefs-select" id="highlightColor">
                                    <option>Accent Color</option>
                                    <option>Blue</option>
                                    <option>Purple</option>
                                    <option>Pink</option>
                                    <option>Red</option>
                                    <option>Orange</option>
                                    <option>Yellow</option>
                                    <option>Green</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Desktop & Dock Pane -->
                        <div class="prefs-pane" id="desktop-pane">
                            <h2><i class="fas fa-desktop"></i> Desktop & Dock</h2>
                            <div class="prefs-section">
                                <h3>Dock Size</h3>
                                <div class="slider-container">
                                    <i class="fas fa-minus"></i>
                                    <input type="range" min="20" max="100" value="${this.settings.dockSize}" 
                                           class="prefs-slider" id="dockSizeSlider">
                                    <i class="fas fa-plus"></i>
                                    <span class="slider-value">${this.settings.dockSize}px</span>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>
                                        <input type="checkbox" id="dockMagnification" checked>
                                        Magnification
                                    </label>
                                    <div class="help-text">Icons enlarge when you move the pointer over them</div>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>Position on screen:</label>
                                    <div class="segmented-control">
                                        <button class="segmented-btn active">Bottom</button>
                                        <button class="segmented-btn">Left</button>
                                        <button class="segmented-btn">Right</button>
                                    </div>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>
                                        <input type="checkbox" id="autoHideDock">
                                        Automatically hide and show the Dock
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sound Pane -->
                        <div class="prefs-pane" id="sound-pane">
                            <h2><i class="fas fa-volume-up"></i> Sound</h2>
                            <div class="prefs-section">
                                <h3>Output volume</h3>
                                <div class="volume-control">
                                    <i class="fas fa-volume-off"></i>
                                    <input type="range" min="0" max="100" value="${this.settings.volume}" 
                                           class="volume-slider" id="volumeSlider">
                                    <i class="fas fa-volume-up"></i>
                                    <span class="volume-value">${this.settings.volume}%</span>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>
                                        <input type="checkbox" id="volumeFeedback" checked>
                                        Play feedback when volume is changed
                                    </label>
                                </div>
                                
                                <div class="prefs-option">
                                    <label>Alert volume:</label>
                                    <input type="range" min="0" max="100" value="50" class="prefs-slider">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Displays Pane -->
                        <div class="prefs-pane" id="display-pane">
                            <h2><i class="fas fa-display"></i> Displays</h2>
                            <div class="prefs-section">
                                <h3>Brightness</h3>
                                <div class="slider-container">
                                    <i class="fas fa-sun"></i>
                                    <input type="range" min="10" max="100" value="${this.settings.brightness}" 
                                           class="prefs-slider" id="brightnessSlider">
                                    <i class="fas fa-sun bright"></i>
                                    <span class="slider-value">${this.settings.brightness}%</span>
                                </div>
                            </div>
                            
                            <div class="prefs-section">
                                <h3>Resolution</h3>
                                <select class="prefs-select" id="resolutionSelect">
                                    <option>Default for display</option>
                                    <option>1920 x 1080</option>
                                    <option>2560 x 1440</option>
                                    <option>3840 x 2160 (4K)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Wallpaper Pane -->
                        <div class="prefs-pane" id="wallpaper-pane">
                            <h2><i class="fas fa-image"></i> Wallpaper</h2>
                            <div class="prefs-section">
                                <h3>Current Wallpaper</h3>
                                <div class="wallpaper-preview">
                                    <img src="wallpaper.jpg" alt="Current Wallpaper" id="currentWallpaper">
                                </div>
                                
                                <div class="prefs-option">
                                    <label>Change wallpaper:</label>
                                    <div class="wallpaper-options">
                                        <button class="wallpaper-btn" data-wallpaper="default">
                                            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200" alt="Default">
                                            <span>Default</span>
                                        </button>
                                        <button class="wallpaper-btn" data-wallpaper="gradient">
                                            <img src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200" alt="Gradient">
                                            <span>Gradient</span>
                                        </button>
                                        <button class="wallpaper-btn" data-wallpaper="nature">
                                            <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w-200" alt="Nature">
                                            <span>Nature</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <button class="prefs-action-btn" id="changeWallpaperBtn">
                                    <i class="fas fa-sync-alt"></i>
                                    Change Wallpaper
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="window-statusbar">
                <span>System Preferences</span>
                <span style="margin-left: auto;">Made with ❤️ for macOS Web</span>
            </div>
        `;
        
        document.body.appendChild(this.window);
    }
    
    setupEventListeners() {
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Category switching
        this.window.querySelectorAll('.prefs-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pane = e.currentTarget.dataset.pane;
                this.switchPane(pane);
            });
        });
        
        // Search
        this.window.querySelector('#prefsSearch').addEventListener('input', (e) => {
            this.searchPreferences(e.target.value);
        });
        
        // LIVE CONTROLS
        this.setupLiveControls();
        
        // Make draggable
        this.makeDraggable();
    }
    
    setupLiveControls() {
        // Dock Size - Actually controls your dock!
        const dockSlider = this.window.querySelector('#dockSizeSlider');
        const dockValue = dockSlider.parentElement.querySelector('.slider-value');
        dockSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            dockValue.textContent = `${size}px`;
            this.settings.dockSize = parseInt(size);
            this.updateDockSize(size);
        });
        
        // Appearance
        this.window.querySelectorAll('.segmented-btn[data-value]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.settings.appearance = value;
                this.updateAppearance(value);
                
                // Update active state
                e.target.parentElement.querySelectorAll('.segmented-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Accent Color
        this.window.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', (e) => {
                const colorValue = e.target.dataset.color;
                this.settings.accentColor = colorValue;
                
                // Update active state
                e.target.parentElement.querySelectorAll('.color-option').forEach(c => {
                    c.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.updateAccentColor(colorValue);
            });
        });
        
        // Volume - with sound feedback!
        const volumeSlider = this.window.querySelector('#volumeSlider');
        const volumeValue = this.window.querySelector('.volume-value');
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            volumeValue.textContent = `${value}%`;
            this.settings.volume = parseInt(value);
            this.updateVolume(value);
        });
        
        // Brightness - affects desktop!
        const brightnessSlider = this.window.querySelector('#brightnessSlider');
        const brightnessValue = brightnessSlider.parentElement.querySelector('.slider-value');
        brightnessSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            brightnessValue.textContent = `${value}%`;
            this.settings.brightness = parseInt(value);
            this.updateBrightness(value);
        });
        
        // Wallpaper changer
        this.window.querySelectorAll('.wallpaper-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wallpaper = e.currentTarget.dataset.wallpaper;
                this.previewWallpaper(wallpaper);
            });
        });
        
        this.window.querySelector('#changeWallpaperBtn').addEventListener('click', () => {
            this.changeWallpaper();
        });
    }
    
    // ACTUAL SYSTEM CONTROL FUNCTIONS
    updateDockSize(size) {
        console.log(`Updating dock size to: ${size}px`);
        if (window.macOSDock) {
            window.macOSDock.baseWidth = parseInt(size);
            // Optional: Trigger dock refresh
            // window.macOSDock.refresh();
        }
    }
    
    updateAppearance(theme) {
        console.log(`Changing appearance to: ${theme}`);
        
        // Apply theme to the entire emulator
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-color', '#1e1e1e');
            root.style.setProperty('--text-color', '#ffffff');
            document.body.style.backgroundColor = '#1e1e1e';
        } else if (theme === 'light') {
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#000000');
            document.body.style.backgroundColor = '#ffffff';
        }
        // Auto theme would switch based on time
    }
    
    updateAccentColor(color) {
        console.log(`Changing accent color to: ${color}`);
        
        // Update CSS variable
        document.documentElement.style.setProperty('--accent-color', color);
        
        // Update interactive elements
        const style = document.createElement('style');
        style.textContent = `
            .prefs-action-btn,
            .segmented-btn.active,
            ::selection {
                background-color: ${color} !important;
            }
            
            .prefs-slider::-webkit-slider-thumb,
            .volume-slider::-webkit-slider-thumb {
                background: ${color} !important;
            }
        `;
        
        // Remove old style if exists
        const oldStyle = document.getElementById('accent-color-style');
        if (oldStyle) oldStyle.remove();
        
        style.id = 'accent-color-style';
        document.head.appendChild(style);
    }
    
    updateVolume(level) {
        console.log(`Setting volume to: ${level}%`);
        
        // Play sound feedback if enabled
        const feedback = this.window.querySelector('#volumeFeedback');
        if (feedback && feedback.checked) {
            this.playVolumeSound(level);
        }
    }
    
    updateBrightness(level) {
        console.log(`Setting brightness to: ${level}%`);
        
        // Adjust desktop brightness
        const desktop = document.querySelector('.desktop');
        if (desktop) {
            desktop.style.filter = `brightness(${level}%)`;
        }
    }
    
    previewWallpaper(type) {
        const preview = this.window.querySelector('#currentWallpaper');
        const wallpapers = {
            default: 'wallpaper.jpg',
            gradient: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800',
            nature: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800'
        };
        
        if (wallpapers[type]) {
            preview.src = wallpapers[type];
            preview.dataset.newWallpaper = wallpapers[type];
        }
    }
    
    changeWallpaper() {
        const preview = this.window.querySelector('#currentWallpaper');
        const newWallpaper = preview.dataset.newWallpaper;
        
        if (newWallpaper) {
            const desktop = document.querySelector('.desktop');
            if (desktop) {
                desktop.style.backgroundImage = `url('${newWallpaper}')`;
                console.log('Wallpaper changed!');
            }
        }
    }
    
    playVolumeSound(level) {
        // Create a simple volume test sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            gainNode.gain.value = level / 200;
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 100);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    switchPane(paneId) {
        // Update active category
        this.window.querySelectorAll('.prefs-category').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.pane === paneId) {
                btn.classList.add('active');
            }
        });
        
        // Show corresponding pane
        this.window.querySelectorAll('.prefs-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetPane = this.window.querySelector(`#${paneId}-pane`);
        if (targetPane) {
            targetPane.classList.add('active');
            this.currentPane = paneId;
        }
    }
    
    searchPreferences(query) {
        const categories = this.window.querySelectorAll('.prefs-category');
        
        if (!query.trim()) {
            categories.forEach(cat => cat.style.display = 'flex');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        categories.forEach(category => {
            const text = category.textContent.toLowerCase();
            category.style.display = text.includes(lowerQuery) ? 'flex' : 'none';
        });
    }
    
    loadSettings() {
        // Load from localStorage if available
        const saved = localStorage.getItem('macosSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('macosSettings', JSON.stringify(this.settings));
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Reset animation
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
        return true;
    }
    
    close() {
        this.window.style.display = 'none';
        this.isOpen = false;
        this.saveSettings();
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
            this.window.style.width = '900px';
            this.window.style.height = '600px';
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
        
        this.zIndex = maxZ + 1;
        this.window.style.zIndex = this.zIndex;
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

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.SystemPreferences = new SystemPreferences();
});