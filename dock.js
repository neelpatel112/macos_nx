// dock.js - SUPER DEBUG VERSION - GUARANTEED TO WORK
class MacOSDock {
    constructor(containerId) {
        console.log("🚀 DOCK: Constructor called");
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
        console.log("🚀 DOCK: init() called");
        this.createDock();
        this.setupEventListeners();
        this.animate();
    }
    
    createDock() {
        console.log("🚀 DOCK: Creating dock...");
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
            
            // Add click handler directly
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎯 DIRECT CLICK: ${app.id}`);
                this.launchApp(app.id);
            });
            
            const img = document.createElement('img');
            // Use placeholder if icon doesn't exist
            img.src = app.icon;
            img.alt = app.name;
            img.draggable = false;
            
            img.onerror = function() {
                console.log(`⚠️ Icon not found: ${app.icon}`);
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTIiIGhlaWdodD0iNTIiIHZpZXdCb3g9IjAgMCA1MiA1MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjYiIGN5PSIyNiIgcj0iMjUiIGZpbGw9IiMwMDdBRkYiLz4KPGNpcmNsZSBjeD0iMjYiIGN5PSIyNiIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMSAyN0gyMVYzM0gyMVYyN1pNMjYgMjZWMzJIMjZWMjZaTTMxIDI1VjMxSDMxVjI1WiIgZmlsbD0iIzAwN0FGRiIvPgo8L3N2Zz4K';
            };
            
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
        
        trashButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🎯 DIRECT CLICK: trash");
            this.launchApp('trash');
        });
        
        const trashImg = document.createElement('img');
        trashImg.src = 'icons/trash.png';
        trashImg.alt = 'Trash';
        trashImg.draggable = false;
        
        trashImg.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTIiIGhlaWdodD0iNTIiIHZpZXdCb3g9IjAgMCA1MiA1MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjYiIGN5PSIyNiIgcj0iMjUiIGZpbGw9IiNGRjNCMzAiLz4KPHBhdGggZD0iTTE4IDIxSDE3VjM0QzE3IDM2LjIwOTEgMTguNzkwOSAzOCAyMSAzOEgzMUMzMy4yMDkxIDM4IDM1IDM2LjIwOTEgMzUgMzRWMTlIMThWMjFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTUgMTlIMzdDMzggMTkgMzkgMTggMzkgMTdDMzkgMTYgMzggMTUgMzcgMTVIMTVDMTQgMTUgMTMgMTYgMTMgMTdDMTMgMTggMTQgMTkgMTUgMTlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjYgMTdWMzFIMjZIMTdWMjdIMjJWMjdIMzBWMjdIMzVWMzFIMjZIMjZWMjRIMjZWMjFIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBIMjZWMjBaTTI2IDE3SDI2WiIgZmlsbD0iIzAwN0FGRiIvPgo8L3N2Zz4K';
        };
        
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
        
        if (this.container) {
            this.container.appendChild(this.dockEl);
            console.log("✅ DOCK: Created successfully");
        } else {
            console.error("❌ DOCK: Container not found!");
        }
    }
    
    setupEventListeners() {
        console.log("🚀 DOCK: Setting up event listeners");
        
        this.dockEl.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
        });
        
        this.dockEl.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.icons.forEach(icon => {
                icon.targetWidth = this.baseWidth;
            });
        });
        
        // Add global click handler as backup
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dock-button')) {
                const button = e.target.closest('.dock-button');
                const app = button.dataset.app;
                console.log(`🌐 GLOBAL CLICK: ${app}`);
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
        console.log(`🎮 LAUNCHING APP: ${appId}`);
        console.log(`🔍 Checking window objects:`);
        console.log(`- window.SystemPreferences:`, window.SystemPreferences);
        console.log(`- window.PhotosApp:`, window.PhotosApp);
        console.log(`- window.MusicApp:`, window.MusicApp);
        
        // FORCE CREATE APPS IF THEY DON'T EXIST
        if (!window.MusicApp && appId === 'music') {
            console.log("🛠️ Creating MusicApp on the fly...");
            try {
                window.MusicApp = new MusicApp();
                console.log("✅ MusicApp created successfully!");
            } catch (error) {
                console.error("❌ Failed to create MusicApp:", error);
            }
        }
        
        if (!window.PhotosApp && appId === 'photos') {
            console.log("🛠️ Creating PhotosApp on the fly...");
            try {
                window.PhotosApp = new PhotosApp();
                console.log("✅ PhotosApp created successfully!");
            } catch (error) {
                console.error("❌ Failed to create PhotosApp:", error);
            }
        }
        
        if (!window.SystemPreferences && appId === 'system') {
            console.log("🛠️ Creating SystemPreferences on the fly...");
            try {
                window.SystemPreferences = new SystemPreferences();
                console.log("✅ SystemPreferences created successfully!");
            } catch (error) {
                console.error("❌ Failed to create SystemPreferences:", error);
            }
        }
        
        // Launch the app
        switch(appId) {
            case 'system':
                if (window.SystemPreferences) {
                    window.SystemPreferences.open();
                    console.log("✅ SystemPreferences opened!");
                } else {
                    console.error("❌ SystemPreferences still not available!");
                }
                break;
                
            case 'photos':
                if (window.PhotosApp) {
                    window.PhotosApp.open();
                    console.log("✅ PhotosApp opened!");
                } else {
                    console.error("❌ PhotosApp still not available!");
                }
                break;
                
            case 'music':
                if (window.MusicApp) {
                    window.MusicApp.open();
                    console.log("✅ MusicApp opened!");
                } else {
                    console.error("❌ MusicApp still not available!");
                    // Last resort - show alert
                    alert("🎵 Music App\n\nI can see the app isn't opening. Let's debug:\n\n1. Check console for errors (F12)\n2. Make sure music.js is loaded\n3. Try refreshing the page\n\nConsole should show debug messages!");
                }
                break;
                
            case 'finder':
            case 'safari':
            case 'mail':
            case 'messages':
            case 'calendar':
            case 'trash':
                alert(`🚧 ${appId.charAt(0).toUpperCase() + appId.slice(1)} App\n\nThis app is under development!\n\nConsole shows: "${appId}" clicked successfully.`);
                break;
                
            default:
                console.warn(`⚠️ Unknown app: ${appId}`);
        }
        
        // Visual feedback
        const button = this.dockEl.querySelector(`[data-app="${appId}"]`);
        if (button) {
            const img = button.querySelector('img');
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Public method to test
    testMusicApp() {
        console.log("🧪 TEST: Forcing Music App open...");
        this.launchApp('music');
    }
}

// CRITICAL: Force initialization when everything is loaded
window.addEventListener('DOMContentLoaded', function() {
    console.log("📋 DOM CONTENT LOADED - Initializing macOS Dock");
    
    // Check if container exists
    const container = document.getElementById('dockContainer');
    if (!container) {
        console.error("❌ dockContainer not found in DOM!");
        // Create it if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = 'dockContainer';
        newContainer.className = 'dock-container';
        document.body.appendChild(newContainer);
        console.log("✅ Created missing dockContainer");
    }
    
    // Initialize dock
    window.macOSDock = new MacOSDock('dockContainer');
    
    // Add global test function
    window.debugMacOS = {
        openMusic: function() {
            console.log("🎵 DEBUG: Opening Music via debug command");
            if (window.macOSDock) {
                window.macOSDock.launchApp('music');
            } else if (window.MusicApp) {
                window.MusicApp.open();
            } else {
                alert("Neither macOSDock nor MusicApp found!");
            }
        },
        listApps: function() {
            console.log("📱 Available Apps:");
            console.log("- SystemPreferences:", window.SystemPreferences);
            console.log("- PhotosApp:", window.PhotosApp);
            console.log("- MusicApp:", window.MusicApp);
            console.log("- macOSDock:", window.macOSDock);
        }
    };
    
    console.log("🎉 macOS Dock initialized!");
    console.log("💡 Type 'debugMacOS.openMusic()' in console to test");
    console.log("💡 Type 'debugMacOS.listApps()' to see available apps");
});

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("⚡ Document already loaded, initializing dock immediately");
    setTimeout(() => {
        if (!window.macOSDock) {
            window.macOSDock = new MacOSDock('dockContainer');
        }
    }, 100);
}