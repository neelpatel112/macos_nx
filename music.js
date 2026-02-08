// SUPER SIMPLE music.js - TEST VERSION
console.log("🎵 music.js LOADED!");

window.MusicApp = class MusicApp {
    constructor() {
        console.log("🎵 MusicApp constructor called");
        this.isOpen = false;
        this.window = null;
        this.createWindow();
    }
    
    createWindow() {
        console.log("🎵 Creating window...");
        this.window = document.createElement('div');
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 800px;
            height: 600px;
            background: #000;
            color: white;
            border-radius: 10px;
            z-index: 1000;
            padding: 20px;
            display: none;
        `;
        this.window.innerHTML = `
            <h1>🎵 MUSIC APP - IT WORKS!</h1>
            <p>Your music app is now working!</p>
            <button onclick="window.MusicApp.close()" style="margin-top: 20px;">Close</button>
        `;
        document.body.appendChild(this.window);
    }
    
    open() {
        console.log("🎵 MusicApp.open() called");
        this.isOpen = true;
        this.window.style.display = 'block';
        console.log("✅ Window should be visible now!");
        alert("🎵 Music App OPENED!\n\nCheck console for details.");
        return true;
    }
    
    close() {
        this.isOpen = false;
        this.window.style.display = 'none';
    }
};

console.log("🎵 MusicApp class ready to use!");
console.log("🎵 Type 'new MusicApp().open()' in console to test"); 