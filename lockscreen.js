function updateLockScreenTime() {
    const now = new Date();
    
    // Date: Thursday, May 23
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('ls-date').innerText = now.toLocaleDateString('en-US', dateOptions);
    
    // Time: 8:30
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };
    document.getElementById('ls-time').innerText = now.toLocaleTimeString('en-US', timeOptions);
}

// Check for Enter key to "Login"
document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const lockScreen = document.getElementById('lock-screen');
        lockScreen.classList.add('unlocked');
        
        // Remove from DOM after transition so it doesn't block clicks
        setTimeout(() => {
            lockScreen.style.display = 'none';
        }, 800);
    }
});

// Update every second
setInterval(updateLockScreenTime, 1000);
updateLockScreenTime(); 