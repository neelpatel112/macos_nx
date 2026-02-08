// dock.js - UPDATED WITH FULL APP SUPPORT
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
        console.log("🚀 Launching:", appId);
        
        // System Preferences
        if (appId === 'system') {
            console.log("🔧 Opening System Preferences...");
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
                }, 100);
            }
        }
        
        // Photos App
        else if (appId === 'photos') {
            console.log("📸 Opening Photos...");
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
                }, 100);
            }
        }
        
        // Music App
        else if (appId === 'music') {
            console.log("🎵 Opening Music...");
            if (window.MusicApp) {
                if (!window.MusicApp.isOpen) {
                    window.MusicApp.open();
                } else {
                    window.MusicApp.bringToFront();
                }
            } else {
                console.error("❌ MusicApp not found!");
                setTimeout(() => {
                    if (window.MusicApp) {
                        window.MusicApp.open();
                    }
                }, 100);
            }
        }
        
        // Finder
        else if (appId === 'finder') {
            console.log("📁 Opening Finder...");
            alert("Finder would open here!\n\nThis is a placeholder - you can implement Finder functionality.");
        }
        
        // Safari
        else if (appId === 'safari') {
            console.log("🌐 Opening Safari...");
            alert("Safari would open here!\n\nThis is a placeholder - you can implement web browser functionality.");
        }
        
        // Mail
        else if (appId === 'mail') {
            console.log("📧 Opening Mail...");
            alert("Mail would open here!\n\nThis is a placeholder - you can implement email functionality.");
        }
        
        // Messages
        else if (appId === 'messages') {
            console.log("💬 Opening Messages...");
            alert("Messages would open here!\n\nThis is a placeholder - you can implement messaging functionality.");
        }
        
        // Calendar
        else if (appId === 'calendar') {
            console.log("📅 Opening Calendar...");
            alert("Calendar would open here!\n\nThis is a placeholder - you can implement calendar functionality.");
        }
        
        // Trash
        else if (appId === 'trash') {
            console.log("🗑️ Opening Trash...");
            alert("Trash would open here!\n\nThis is a placeholder - you can implement trash functionality.");
        }
        
        else {
            console.log("⚠️ Unknown app:", appId);
        }
        
        // Visual feedback
        const button = this.dockEl.querySelector(`[data-app="${appId}"]`);
        if (button) {
            const img = button.querySelector('img');
            img.style.transform = 'scale(0.9)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Helper method to check if apps are available
    checkAppAvailability() {
        console.log("🔍 Checking app availability:");
        console.log("- SystemPreferences:", window.SystemPreferences ? "✅ Available" : "❌ Missing");
        console.log("- PhotosApp:", window.PhotosApp ? "✅ Available" : "❌ Missing");
        console.log("- MusicApp:", window.MusicApp ? "✅ Available" : "❌ Missing");
        
        // Create missing apps if they don't exist
        if (!window.SystemPreferences && typeof SystemPreferences === 'function') {
            window.SystemPreferences = new SystemPreferences();
            console.log("🛠️ Created SystemPreferences instance");
        }
        
        if (!window.PhotosApp && typeof PhotosApp === 'function') {
            window.PhotosApp = new PhotosApp();
            console.log("🛠️ Created PhotosApp instance");
        }
        
        if (!window.MusicApp && typeof MusicApp === 'function') {
            window.MusicApp = new MusicApp();
            console.log("🛠️ Created MusicApp instance");
        }
    }
    
    // Public method to manually open an app (for testing)
    openApp(appId) {
        this.launchApp(appId);
    }
}

// Initialize dock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.macOSDock = new MacOSDock('dockContainer');
    
    // Wait a moment for all scripts to load, then check app availability
    setTimeout(() => {
        window.macOSDock.checkAppAvailability();
        
        // Test: Uncomment to test app opening on load
        // setTimeout(() => window.macOSDock.openApp('music'), 1000);
    }, 500);
    
    // Add global shortcut to test Music app: Ctrl+Shift+M or Cmd+Shift+M
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            console.log("🎵 Testing Music app via keyboard shortcut...");
            if (window.macOSDock) {
                window.macOSDock.openApp('music');
            }
        }
    });
}); 