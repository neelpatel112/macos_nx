// Save this as windows.js - Core window management
class WindowManager {
    constructor() {
        this.windows = [];
        this.zIndexCounter = 100;
        this.init();
    }
    
    init() {
        // Make desktop icons draggable
        this.makeIconsDraggable();
        
        // Setup global shortcuts
        this.setupShortcuts();
        
        console.log('Window Manager initialized');
    }
    
    createWindow(appName, options = {}) {
        const windowId = `window_${Date.now()}`;
        const defaultOptions = {
            width: 800,
            height: 600,
            title: appName,
            resizable: true,
            minimizable: true,
            closable: true,
            ...options
        };
        
        const windowObj = {
            id: windowId,
            app: appName,
            ...defaultOptions,
            element: null,
            isMinimized: false,
            isMaximized: false
        };
        
        this.windows.push(windowObj);
        return windowObj;
    }
    
    bringToFront(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window && window.element) {
            this.zIndexCounter++;
            window.element.style.zIndex = this.zIndexCounter;
        }
    }
    
    makeIconsDraggable() {
        const icons = document.querySelectorAll('.desktop .icon');
        
        icons.forEach(icon => {
            let isDragging = false;
            let offsetX, offsetY;
            
            icon.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // Only left click
                if (e.target.tagName === 'SPAN') return; // Don't drag from text
                
                isDragging = true;
                const rect = icon.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                icon.style.transition = 'none';
                icon.style.zIndex = '1000';
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            
            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                
                icon.style.left = `${x}px`;
                icon.style.top = `${y}px`;
            };
            
            const onMouseUp = () => {
                isDragging = false;
                icon.style.transition = 'transform 0.2s';
                icon.style.zIndex = '';
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                // Save position (could use localStorage)
                console.log(`Icon moved to: ${icon.style.left}, ${icon.style.top}`);
            };
        });
    }
    
    setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + N: New Finder window
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                console.log('New window shortcut');
            }
            
            // Cmd/Ctrl + W: Close window
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                const topWindow = this.getTopWindow();
                if (topWindow) {
                    this.closeWindow(topWindow.id);
                }
            }
            
            // Cmd/Ctrl + M: Minimize window
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                const topWindow = this.getTopWindow();
                if (topWindow) {
                    this.minimizeWindow(topWindow.id);
                }
            }
            
            // F3: Mission Control
            if (e.key === 'F3') {
                e.preventDefault();
                this.showMissionControl();
            }
        });
    }
    
    getTopWindow() {
        if (this.windows.length === 0) return null;
        
        let topWindow = this.windows[0];
        let topZ = parseInt(topWindow.element?.style.zIndex || 0);
        
        this.windows.forEach(w => {
            const z = parseInt(w.element?.style.zIndex || 0);
            if (z > topZ) {
                topZ = z;
                topWindow = w;
            }
        });
        
        return topWindow;
    }
    
    closeWindow(windowId) {
        const index = this.windows.findIndex(w => w.id === windowId);
        if (index !== -1) {
            const window = this.windows[index];
            if (window.element) {
                window.element.remove();
            }
            this.windows.splice(index, 1);
        }
    }
    
    minimizeWindow(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window && window.element) {
            window.element.style.transform = 'translateY(100vh)';
            window.element.style.opacity = '0';
            window.isMinimized = true;
            
            setTimeout(() => {
                window.element.style.display = 'none';
            }, 300);
        }
    }
    
    showMissionControl() {
        console.log('Mission Control activated');
        // Implementation would show all windows in a grid
    }
}

// Initialize Window Manager
document.addEventListener('DOMContentLoaded', () => {
    window.WindowManager = new WindowManager();
}); 