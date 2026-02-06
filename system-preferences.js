// system-preferences.js - WORKING VERSION
console.log("🔧 System Preferences loading...");

class SystemPreferences {
    constructor() {
        console.log("🔧 SystemPreferences constructor called");
        this.window = null;
        this.isOpen = false;
        this.currentPane = 'general';
        this.zIndex = 100;
        this.init();
    }
    
    init() {
        console.log("🔧 Initializing System Preferences...");
        this.createWindow();
        this.setupEventListeners();
        console.log("✅ System Preferences ready!");
    }
    
    createWindow() {
        // Create main window container
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
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: ${this.zIndex};
        `;
        
        // Window content (simplified version - we'll expand later)
        this.window.innerHTML = `
            <div class="window-titlebar" style="
                height: 40px;
                background: rgba(255, 255, 255, 0.8);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                padding: 0 15px;
                -webkit-user-select: none;
                user-select: none;
            ">
                <div class="window-controls" style="display: flex; gap: 8px; margin-right: 20px;">
                    <button class="window-close" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: none;
                        background: #ff5f57;
                        cursor: pointer;
                    "></button>
                    <button class="window-minimize" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: none;
                        background: #ffbd2e;
                        cursor: pointer;
                    "></button>
                    <button class="window-zoom" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: none;
                        background: #28ca42;
                        cursor: pointer;
                    "></button>
                </div>
                <div class="window-title" style="
                    font-size: 13px;
                    font-weight: 500;
                    color: #000;
                    flex: 1;
                    text-align: center;
                ">System Preferences</div>
            </div>
            
            <div class="window-content" style="
                flex: 1;
                padding: 30px;
                overflow-y: auto;
                color: #000;
            ">
                <h1 style="margin-bottom: 20px;">🎉 System Preferences</h1>
                <p>Your macOS settings center is working!</p>
                
                <div style="margin-top: 30px;">
                    <h3>Quick Settings:</h3>
                    <div style="margin: 15px 0;">
                        <label>Dock Size: </label>
                        <input type="range" min="20" max="100" value="52" 
                               style="width: 200px; margin: 0 10px;"
                               oninput="console.log('Dock size:', this.value)">
                        <span>52px</span>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <label>Appearance: </label>
                        <button style="padding: 5px 15px; margin: 0 5px; background: #007AFF; color: white; border: none; border-radius: 4px;">Light</button>
                        <button style="padding: 5px 15px; margin: 0 5px; background: #333; color: white; border: none; border-radius: 4px;">Dark</button>
                    </div>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <button id="closeBtn" style="
                        padding: 10px 30px;
                        background: #007AFF;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Close Window</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        console.log("✅ Window created and added to body");
    }
    
    setupEventListeners() {
        // Close button
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        
        // Minimize button
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        
        // Zoom button
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Custom close button
        this.window.querySelector('#closeBtn').addEventListener('click', () => this.close());
        
        // Make window draggable via titlebar
        this.makeDraggable();
        
        console.log("✅ Event listeners set up");
    }
    
    open() {
        console.log("🚀 Opening System Preferences...");
        
        // Show window
        this.window.style.display = 'flex';
        this.isOpen = true;
        
        // Bring to front
        this.bringToFront();
        
        // Add open animation
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
        console.log("✅ System Preferences opened!");
        return true;
    }
    
    close() {
        console.log("Closing System Preferences...");
        this.window.style.display = 'none';
        this.isOpen = false;
    }
    
    minimize() {
        console.log("Minimizing window...");
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
        // Find highest z-index
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
    console.log("🔧 Initializing SystemPreferences...");
    window.SystemPreferences = new SystemPreferences();
    console.log("✅ SystemPreferences instance created:", window.SystemPreferences);
    
    // Test: Auto-open (remove this line later)
    // setTimeout(() => window.SystemPreferences.open(), 500);
});