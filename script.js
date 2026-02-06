function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop .icon');
    
    icons.forEach(icon => {
        icon.addEventListener('dblclick', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert(`Opening ${this.querySelector('span').textContent}`);
            }, 100);
        });
        
        icon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.log('Right clicked:', this.querySelector('span').textContent);
        });
    });
}

function initSystem() {
    updateTime();
    setInterval(updateTime, 60000);
    
    initDesktopIcons();
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            console.log('Lock screen activated');
        }
    });
    
    console.log('macOS Web Emulator initialized');
}

document.addEventListener('DOMContentLoaded', initSystem);