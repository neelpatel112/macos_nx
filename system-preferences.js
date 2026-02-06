// Save this as system-preferences.js
class SystemPreferences {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentPane = 'general';
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
    }
    
    createWindow() {
        // Create window container
        const windowContainer = document.createElement('div');
        windowContainer.innerHTML = document.querySelector('.system-preferences-window').outerHTML;
        this.window = windowContainer.firstElementChild;
        document.body.appendChild(this.window);
        
        // Load styles
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'system-preferences.css';
        document.head.appendChild(link);
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
        
        // Search functionality
        const searchInput = this.window.querySelector('#prefsSearch');
        searchInput.addEventListener('input', (e) => this.searchPreferences(e.target.value));
        
        // Live controls - DOCK SIZE
        const dockSizeSlider = this.window.querySelector('#dockSizeSlider');
        if (dockSizeSlider) {
            dockSizeSlider.addEventListener('input', (e) => {
                const size = e.target.value;
                this.updateDockSize(size);
            });
        }
        
        // Live controls - APPEARANCE
        this.window.querySelectorAll('.segmented-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.currentTarget.parentElement;
                parent.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // If it's the appearance control
                if (parent.closest('#general-pane')) {
                    const appearance = e.currentTarget.textContent.toLowerCase();
                    this.updateAppearance(appearance);
                }
            });
        });
        
        // Live controls - COLOR PICKER
        this.window.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', (e) => {
                const parent = e.currentTarget.parentElement;
                parent.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const colorValue = e.currentTarget.dataset.color;
                this.updateAccentColor(colorValue);
            });
        });
        
        // Live controls - VOLUME
        const volumeSlider = this.window.querySelector('.volume-slider');
        const volumeValue = this.window.querySelector('.volume-value');
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                volumeValue.textContent = `${value}%`;
                this.updateVolume(value);
            });
        }
        
        // Live controls - BRIGHTNESS
        const brightnessSlider = this.window.querySelector('#display-pane .prefs-slider');
        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                this.updateBrightness(e.target.value);
            });
        }
        
        // Make window draggable
        this.makeDraggable();
    }
    
    open() {
        this.window.style.display = 'flex';
        this.window.classList.add('active');
        this.isOpen = true;
        
        // Bring to front
        this.window.style.zIndex = this.getHighestZIndex() + 1;
        
        // Update dock icon indicator
        this.updateDockIndicator(true);
        
        console.log('System Preferences opened');
    }
    
    close() {
        this.window.style.display = 'none';
        this.window.classList.remove('active');
        this.isOpen = false;
        this.updateDockIndicator(false);
        console.log('System Preferences closed');
    }
    
    minimize() {
        this.window.style.transform = 'translateY(100vh)';
        this.window.style.opacity = '0';
        setTimeout(() => {
            this.window.style.display = 'none';
            this.isOpen = false;
            this.updateDockIndicator(false);
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
        const panes = this.window.querySelectorAll('.prefs-pane');
        
        if (!query.trim()) {
            // Show all if search is empty
            categories.forEach(cat => cat.style.display = 'flex');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        
        // Search in categories
        categories.forEach(category => {
            const text = category.textContent.toLowerCase();
            const paneId = category.dataset.pane;
            const pane = this.window.querySelector(`#${paneId}-pane`);
            
            let paneText = '';
            if (pane) {
                paneText = pane.textContent.toLowerCase();
            }
            
            if (text.includes(lowerQuery) || paneText.includes(lowerQuery)) {
                category.style.display = 'flex';
                
                // Highlight search results
                if (pane) {
                    this.highlightText(pane, query);
                }
            } else {
                category.style.display = 'none';
            }
        });
    }
    
    highlightText(element, query) {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    }
    
    // LIVE SETTINGS UPDATES
    updateDockSize(size) {
        // Update the actual dock in your main project
        if (window.macOSDock) {
            window.macOSDock.baseWidth = parseInt(size);
            console.log(`Dock size updated to: ${size}px`);
            
            // You could trigger a dock refresh here
            // window.macOSDock.refreshIcons();
        }
    }
    
    updateAppearance(theme) {
        console.log(`Appearance changed to: ${theme}`);
        
        // Apply theme to the entire emulator
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#1e1e1e';
            document.body.style.color = '#ffffff';
        } else if (theme === 'light') {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#000000';
        }
        // Auto would switch based on time
    }
    
    updateAccentColor(color) {
        console.log(`Accent color changed to: ${color}`);
        
        // Update CSS variables for accent color
        document.documentElement.style.setProperty('--accent-color', color);
        
        // Update all interactive elements
        const accentElements = document.querySelectorAll('button, .prefs-action-btn, .segmented-btn.active');
        accentElements.forEach(el => {
            el.style.backgroundColor = color;
        });
    }
    
    updateVolume(level) {
        console.log(`Volume set to: ${level}%`);
        
        // Play test sound if checkbox is checked
        const playSoundCheckbox = this.window.querySelector('#sound-pane input[type="checkbox"]');
        if (playSoundCheckbox && playSoundCheckbox.checked) {
            this.playVolumeSound(level);
        }
    }
    
    updateBrightness(level) {
        console.log(`Brightness set to: ${level}%`);
        
        // Adjust desktop brightness (visual effect)
        const desktop = document.querySelector('.desktop');
        if (desktop) {
            desktop.style.filter = `brightness(${level}%)`;
        }
    }
    
    playVolumeSound(level) {
        // Create audio context for volume feedback
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.value = level / 200; // Scale volume
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 100);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }
    
    updateDockIndicator(active) {
        // Update dock icon to show app is open
        const dockIcon = document.querySelector('.dock-button[data-app="system"] img');
        if (dockIcon) {
            if (active) {
                dockIcon.style.opacity = '1';
                dockIcon.style.filter = 'brightness(1.2)';
            } else {
                dockIcon.style.opacity = '0.8';
                dockIcon.style.filter = 'brightness(1)';
            }
        }
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
    
    getHighestZIndex() {
        const windows = document.querySelectorAll('.window');
        let maxZ = 100;
        windows.forEach(w => {
            const z = parseInt(window.getComputedStyle(w).zIndex);
            if (z > maxZ) maxZ = z;
        });
        return maxZ;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.SystemPreferences = new SystemPreferences();
    
    // Add to dock click handler
    const systemDockBtn = document.querySelector('.dock-button[data-app="system"]');
    if (systemDockBtn) {
        systemDockBtn.addEventListener('click', () => {
            if (!window.SystemPreferences.isOpen) {
                window.SystemPreferences.open();
            } else {
                window.SystemPreferences.close();
            }
        });
    }
}); 