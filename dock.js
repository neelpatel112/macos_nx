// dock.js - FIXED VERSION
class MacOSDock {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.dockEl = null;
        this.icons = [];
        this.mouseX = null;
        
        this.baseWidth = 52;
        this.distanceLimit = this.baseWidth * 6;
        this.spring = {
            stiffness: 0.3,
            damping: 0.7,
            velocity: 0
        };
        
        this.init();
    }
    
    init() {
        this.createDock();
        this.setupEventListeners();
        this.animate();
    }
    
    createDock() {
        this.dockEl = document.createElement('div');
        this.dockEl.className = 'dock-el';
        
        const apps = [
            { id: 'finder', name: 'Finder', icon: 'icons/finder.png' },
            { id: 'safari', name: 'Safari', icon: 'icons/safari.png' },
            { id: 'photos', name: 'Photos', icon: 'icons/photos.png' },
            { id: 'mail', name: 'Mail', icon: 'icons/mail.png' },
            { id: 'messages', name: 'Messages', icon: 'icons/messages.png' },
            { id: 'music', name: 'Music', icon: 'icons/music.png' },
            { id: 'calendar', name: 'Calendar', icon: 'icons/calendar.png' },
            { id: 'system', name: 'System Preferences', icon: 'icons/system.png' }
        ];
        
        apps.forEach(app => {
            const dockItem = document.createElement('div');
            dockItem.className = 'dock-item';
            
            const button = document.createElement('button');
            button.className = 'dock-button';
            button.dataset.app = app.id;
            
            const img = document.createElement('img');
            img.src = app.icon;
            img.alt = app.name;
            img.draggable = false;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'dock-tooltip';
            tooltip.textContent = app.name;
            
            button.appendChild(img);
            button.appendChild(tooltip);
            dockItem.appendChild(button);
            this.dockEl.appendChild(dockItem);
            
            this.icons.push({
                element: img,
                targetWidth: this.baseWidth,
                currentWidth: this.baseWidth,
                velocity: 0
            });
        });
        
        const separator = document.createElement('div');
        separator.className = 'dock-separator';
        this.dockEl.appendChild(separator);
        
        const trashItem = document.createElement('div');
        trashItem.className = 'dock-item';
        const trashButton = document.createElement('button');
        trashButton.className = 'dock-button';
        trashButton.dataset.app = 'trash';
        
        const trashImg = document.createElement('img');
        trashImg.src = 'icons/trash.png';
        trashImg.alt = 'Trash';
        trashImg.draggable = false;
        
        const trashTooltip = document.createElement('div');
        trashTooltip.className = 'dock-tooltip';
        trashTooltip.textContent = 'Trash';
        
        trashButton.appendChild(trashImg);
        trashButton.appendChild(trashTooltip);
        trashItem.appendChild(trashButton);
        this.dockEl.appendChild(trashItem);
        
        this.icons.push({
            element: trashImg,
            targetWidth: this.baseWidth,
            currentWidth: this.baseWidth,
            velocity: 0
        });
        
        this.container.appendChild(this.dockEl);
    }
    
    setupEventListeners() {
        this.dockEl.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
        });
        
        this.dockEl.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.icons.forEach(icon => {
                icon.targetWidth = this.baseWidth;
            });
        });
        
        this.dockEl.addEventListener('click', (e) => {
            if (e.target.closest('.dock-button')) {
                const button = e.target.closest('.dock-button');
                const app = button.dataset.app;
                this.launchApp(app);
            }
        });
    }
    
    calculateTargetWidth(iconIndex) {
        if (this.mouseX === null) return this.baseWidth;
        
        const icon = this.icons[iconIndex];
        const rect = icon.element.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(this.mouseX - iconCenterX);
        
        if (distance > this.distanceLimit) return this.baseWidth;
        
        const normalizedDistance = distance / this.distanceLimit;
        const scale = 1 + (1 - normalizedDistance) * 1.5;
        
        return this.baseWidth * Math.min(scale, 2.5);
    }
    
    animateIcon(icon) {
        const force = (icon.targetWidth - icon.currentWidth) * this.spring.stiffness;
        const damping = -icon.velocity * this.spring.damping;
        
        icon.velocity += force + damping;
        icon.currentWidth += icon.velocity;
        
        icon.element.style.width = `${icon.currentWidth}px`;
        icon.element.style.height = `${icon.currentWidth}px`;
    }
    
    animate() {
        this.icons.forEach((icon, index) => {
            icon.targetWidth = this.calculateTargetWidth(index);
            this.animateIcon(icon);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    launchApp(appId) {
        console.log("🚀 Launching app:", appId);
        
        // Visual feedback
        const button = this.dockEl.querySelector(`[data-app="${appId}"]`);
        if (button) {
            const img = button.querySelector('img');
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 200);
        }
        
        // System Preferences
        if (appId === 'system') {
            console.log("⚙️ Opening System Preferences...");
            if (window.SystemPreferences) {
                if (!window.SystemPreferences.isOpen) {
                    window.SystemPreferences.open();
                } else {
                    window.SystemPreferences.bringToFront();
                }
            } else {
                console.error("❌ SystemPreferences not found!");
                setTimeout(() => {
                    if (window.SystemPreferences) {
                        window.SystemPreferences.open();
                    }
                }, 500);
            }
            return;
        }
        
        // Photos App
        if (appId === 'photos') {
            console.log("🖼️ Opening Photos...");
            if (window.PhotosApp) {
                if (!window.PhotosApp.isOpen) {
                    window.PhotosApp.open();
                } else {
                    window.PhotosApp.bringToFront();
                }
            } else {
                console.error("❌ PhotosApp not found!");
                setTimeout(() => {
                    if (window.PhotosApp) {
                        window.PhotosApp.open();
                    }
                }, 500);
            }
            return;
        }

        // Music App
        if (appId === 'music') {
            console.log("🎵 Opening Music...");
            if (window.MusicApp) {
                if (!window.MusicApp.isOpen) {
                    window.MusicApp.open();
                } else {
                    window.MusicApp.bringToFront();
                }
            } else {
                console.error("❌ MusicApp not found! Check if music.js loaded correctly");
                // Try to initialize if not loaded
                if (typeof MusicApp !== 'undefined') {
                    window.MusicApp = new MusicApp();
                    setTimeout(() => window.MusicApp.open(), 100);
                } else {
                    alert("Music App failed to load. Check console for errors.");
                }
            }
            return;
        }
        
        // Finder App
        if (appId === 'finder') {
            console.log("📁 Opening Finder...");
            if (window.FinderApp) {
                if (!window.FinderApp.isOpen) {
                    window.FinderApp.open();
                } else {
                    window.FinderApp.bringToFront();
                }
            } else {
                console.error("❌ FinderApp not found! Check if finder.js loaded correctly");
                // Try to initialize if not loaded
                if (typeof FinderApp !== 'undefined') {
                    window.FinderApp = new FinderApp();
                    setTimeout(() => window.FinderApp.open(), 100);
                } else {
                    alert("Finder App failed to load. Check console for errors.");
                }
            }
            return;
        }

        // Calendar App
if (appId === 'calendar') {
    console.log("📅 Opening Calendar...");
    if (window.CalendarApp) {
        if (!window.CalendarApp.isOpen) {
            window.CalendarApp.open();
        } else {
            window.CalendarApp.bringToFront();
        }
    } else {
        console.error("❌ CalendarApp not found!");
        if (typeof CalendarApp !== 'undefined') {
            window.CalendarApp = new CalendarApp();
            setTimeout(() => window.CalendarApp.open(), 100);
        }
    }
    return;
}

        // Safari (placeholder)
        if (appId === 'safari') {
            alert('Safari would open here!');
            return;
        }
        
        // Other apps (placeholder)
        if (['mail', 'messages', 'trash'].includes(appId)) {
            alert(`📱 ${appId.charAt(0).toUpperCase() + appId.slice(1)} app would open here!`);
            return;
        }
    }
}

// Initialize dock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing Dock...');
    window.macOSDock = new MacOSDock('dockContainer');
    console.log('✅ Dock initialized');
}); 