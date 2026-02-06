// DEBUG VERSION - system-preferences.js
console.log("🔧 system-preferences.js LOADING...");

class SystemPreferences {
    constructor() {
        console.log("🔧 SystemPreferences constructor called!");
        this.window = null;
        this.isOpen = false;
        this.currentPane = 'general';
        this.init();
    }
    
    init() {
        console.log("🔧 SystemPreferences.init() called");
        this.createWindow();
        this.setupEventListeners();
        console.log("✅ SystemPreferences READY!");
    }
    
    createWindow() {
        console.log("🔧 Creating window...");
        
        // Create the window HTML from scratch
        this.window = document.createElement('div');
        this.window.className = 'window system-preferences-window';
        this.window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="window-close">●</button>
                    <button class="window-minimize">●</button>
                    <button class="window-zoom">●</button>
                </div>
                <div class="window-title">System Preferences</div>
            </div>
            <div class="window-content">
                <div style="padding: 40px; text-align: center;">
                    <h1>🎉 SYSTEM PREFERENCES IS WORKING!</h1>
                    <p>If you see this, the app is loaded correctly!</p>
                    <button id="testClose" style="padding: 10px 20px; margin-top: 20px;">
                        Close This Window
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        console.log("✅ Window created and added to body");
    }
    
    setupEventListeners() {
        console.log("🔧 Setting up event listeners...");
        
        // Close button
        this.window.querySelector('.window-close').addEventListener('click', () => {
            console.log("Close button clicked");
            this.close();
        });
        
        // Test close button
        this.window.querySelector('#testClose').addEventListener('click', () => {
            this.close();
        });
        
        console.log("✅ Event listeners set up");
    }
    
    open() {
        console.log("🚀 OPEN() method called!");
        this.window.style.display = 'flex';
        this.window.style.left = '100px';
        this.window.style.top = '100px';
        this.isOpen = true;
        console.log("✅ Window should be visible now!");
        
        // Visual feedback
        this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
    }
    
    close() {
        console.log("Closing window...");
        this.window.style.display = 'none';
        this.isOpen = false;
    }
    
    bringToFront() {
        console.log("Bring to front called");
        this.window.style.zIndex = '10000';
    }
}

// GLOBAL INITIALIZATION
console.log("🔧 Creating global SystemPreferences instance...");
window.SystemPreferences = new SystemPreferences();
console.log("✅ window.SystemPreferences =", window.SystemPreferences);

// Test: Auto-open after 1 second (remove this later)
setTimeout(() => {
    console.log("⏰ AUTO-OPEN TEST in 1 second...");
    if (window.SystemPreferences) {
        console.log("SystemPreferences found, calling open()");
        window.SystemPreferences.open();
    } else {
        console.error("❌ SystemPreferences NOT FOUND!");
    }
}, 1000);