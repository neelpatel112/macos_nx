// widgets.js - macOS Style Desktop Widgets
class DesktopWidgets {
    constructor() {
        this.container = null;
        this.weatherData = null;
        this.currentMusic = null;
        this.musicInterval = null;
        this.audioElement = null;
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.musicLibrary = [];
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.loadMusicLibrary();
        this.renderWidgets();
        this.startClock();
        this.fetchWeather();
        this.setupMusicListeners();
        console.log('📊 Desktop Widgets initialized');
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'widgets-container';
        document.body.appendChild(this.container);
    }
    
    loadMusicLibrary() {
        // Load music from /music directory
        // You can add your actual music files here
        this.musicLibrary = [
            {
                title: "Bohemian Rhapsody",
                artist: "Queen",
                file: "music/Out of time.mp3",
                artwork: null
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                file: "music/Empire state of mind.mp3",
                artwork: null
            },
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                file: "music/From time.mp3",
                artwork: null
            },
            {
                title: "Rolling in the Deep",
                artist: "Adele",
                file: "music/Is this love.mp3",
                artwork: null
            }
        ];
        
        // If you have actual files, uncomment and modify this:
        // this.loadMusicFiles();
    }
    
    loadMusicFiles() {
        // This would scan your music directory
        // For now, using placeholder data
        console.log("🎵 To add actual music files, place .mp3 files in /music folder");
    }
    
    renderWidgets() {
        this.container.innerHTML = `
            <!-- Digital Clock Widget -->
            <div class="widget widget-clock" id="clockWidget">
                <div class="clock-time" id="clockTime">--:--:--</div>
                <div class="clock-date" id="clockDate">--- --- --, ----</div>
                <div class="clock-weekday" id="clockWeekday">-----</div>
            </div>
            
            <!-- Weather Widget -->
            <div class="widget widget-weather" id="weatherWidget">
                <div class="weather-header">
                    <span class="weather-location">
                        <i class="fas fa-location-dot"></i>
                        <span id="weatherCity">Loading...</span>
                    </span>
                    <span id="weatherUpdated">just now</span>
                </div>
                <div class="weather-main">
                    <div class="weather-icon" id="weatherIcon">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <div class="weather-temp" id="weatherTemp">--°</div>
                </div>
                <div class="weather-condition" id="weatherCondition">Loading weather...</div>
                <div class="weather-details" id="weatherDetails">
                    <div class="weather-detail-item">
                        <i class="fas fa-droplet"></i>
                        <span id="weatherHumidity">--%</span>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-wind"></i>
                        <span id="weatherWind">-- km/h</span>
                    </div>
                </div>
            </div>
            
            <!-- Music Widget -->
            <div class="widget widget-music" id="musicWidget">
                <div class="music-header">
                    <div class="music-header-left">
                        <i class="fas fa-music"></i>
                        <span>Now Playing</span>
                    </div>
                    <span id="musicSource">Local Library</span>
                </div>
                
                <div class="music-artwork default" id="musicArtwork">
                    <i class="fas fa-headphones"></i>
                </div>
                
                <div class="music-info">
                    <div class="music-title" id="musicTitle">No music playing</div>
                    <div class="music-artist" id="musicArtist">Select a song</div>
                </div>
                
                <div class="music-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="musicProgress" style="width: 0%"></div>
                    </div>
                    <div class="time-info">
                        <span id="musicCurrentTime">0:00</span>
                        <span id="musicDuration">-:--</span>
                    </div>
                </div>
                
                <div class="music-controls">
                    <button class="music-control-btn" id="musicPrev">
                        <i class="fas fa-backward"></i>
                    </button>
                    <button class="music-control-btn play-pause" id="musicPlayPause">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="music-control-btn" id="musicNext">
                        <i class="fas fa-forward"></i>
                    </button>
                </div>
            </div>
            
            <!-- Trash Widget (optional) -->
            <div class="widget widget-trash" id="trashWidget">
                <i class="fas fa-trash trash-icon"></i>
                <span class="trash-text">Trash</span>
                <span class="trash-count">0</span>
            </div>
        `;
    }
    
    startClock() {
        const updateClock = () => {
            const now = new Date();
            
            // Time
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            document.getElementById('clockTime').textContent = `${hours}:${minutes}:${seconds}`;
            
            // Date
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('clockDate').textContent = now.toLocaleDateString('en-US', options);
            
            // Weekday
            const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
            document.getElementById('clockWeekday').textContent = weekday;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    fetchWeather() {
        // Using OpenWeatherMap free API (you'll need to sign up for a free API key)
        // For demo, using mock data
        this.mockWeatherData();
        
        // If you want real weather, uncomment this:
        // this.getRealWeather();
    }
    
    mockWeatherData() {
        const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Clear'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * 25) + 10; // 10-35°C
        
        const weatherIcons = {
            'Sunny': 'fa-sun',
            'Cloudy': 'fa-cloud',
            'Partly Cloudy': 'fa-cloud-sun',
            'Rainy': 'fa-cloud-rain',
            'Clear': 'fa-moon'
        };
        
        document.getElementById('weatherCity').textContent = 'Ahmedabad';
        document.getElementById('weatherIcon').innerHTML = `<i class="fas ${weatherIcons[randomCondition]}"></i>`;
        document.getElementById('weatherTemp').textContent = `${temp}°`;
        document.getElementById('weatherCondition').textContent = randomCondition;
        document.getElementById('weatherHumidity').textContent = `${Math.floor(Math.random() * 50) + 40}%`;
        document.getElementById('weatherWind').textContent = `${Math.floor(Math.random() * 20) + 5} km/h`;
    }
    
    setupMusicListeners() {
        document.getElementById('musicPrev').addEventListener('click', () => this.prevTrack());
        document.getElementById('musicNext').addEventListener('click', () => this.nextTrack());
        document.getElementById('musicPlayPause').addEventListener('click', () => this.togglePlay());
        
        // Create audio element
        this.audioElement = new Audio();
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioElement.addEventListener('ended', () => this.nextTrack());
    }
    
    togglePlay() {
        if (!this.musicLibrary.length) return;
        
        if (!this.audioElement.src) {
            this.loadTrack(this.currentTrackIndex);
        }
        
        if (this.isPlaying) {
            this.audioElement.pause();
            document.querySelector('#musicPlayPause i').className = 'fas fa-play';
        } else {
            this.audioElement.play();
            document.querySelector('#musicPlayPause i').className = 'fas fa-pause';
        }
        
        this.isPlaying = !this.isPlaying;
    }
    
    loadTrack(index) {
        const track = this.musicLibrary[index];
        if (!track) return;
        
        // In a real implementation, you'd have actual MP3 files
        // For demo, we'll simulate playback
        document.getElementById('musicTitle').textContent = track.title;
        document.getElementById('musicArtist').textContent = track.artist;
        
        // Simulate duration for demo
        document.getElementById('musicDuration').textContent = '3:45';
        
        // If you have actual files:
        // this.audioElement.src = track.file;
        // this.audioElement.load();
    }
    
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicLibrary.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.audioElement.play();
        }
    }
    
    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.musicLibrary.length) % this.musicLibrary.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.audioElement.play();
        }
    }
    
    updateProgress() {
        if (this.audioElement.duration) {
            const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            document.getElementById('musicProgress').style.width = `${progress}%`;
            
            const currentMin = Math.floor(this.audioElement.currentTime / 60);
            const currentSec = Math.floor(this.audioElement.currentTime % 60).toString().padStart(2, '0');
            document.getElementById('musicCurrentTime').textContent = `${currentMin}:${currentSec}`;
        }
    }
    
    updateDuration() {
        if (this.audioElement.duration) {
            const durationMin = Math.floor(this.audioElement.duration / 60);
            const durationSec = Math.floor(this.audioElement.duration % 60).toString().padStart(2, '0');
            document.getElementById('musicDuration').textContent = `${durationMin}:${durationSec}`;
        }
    }
    
    getRealWeather() {
        // You'll need a free API key from OpenWeatherMap
        const API_KEY = 'YOUR_API_KEY';
        const city = 'Ahmedabad'; // Change to your city
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('weatherCity').textContent = data.name;
                document.getElementById('weatherTemp').textContent = `${Math.round(data.main.temp)}°`;
                document.getElementById('weatherCondition').textContent = data.weather[0].main;
                document.getElementById('weatherHumidity').textContent = `${data.main.humidity}%`;
                document.getElementById('weatherWind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
                
                // Weather icon mapping
                const iconMap = {
                    'Clear': 'fa-sun',
                    'Clouds': 'fa-cloud',
                    'Rain': 'fa-cloud-rain',
                    'Snow': 'fa-snowflake',
                    'Thunderstorm': 'fa-cloud-bolt',
                    'Drizzle': 'fa-cloud-rain',
                    'Mist': 'fa-smog'
                };
                
                document.getElementById('weatherIcon').innerHTML = 
                    `<i class="fas ${iconMap[data.weather[0].main] || 'fa-cloud'}"></i>`;
            })
            .catch(error => {
                console.error('Weather fetch failed:', error);
                this.mockWeatherData();
            });
    }
}

// Initialize widgets
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Initializing Desktop Widgets...');
    window.DesktopWidgets = new DesktopWidgets();
}); 