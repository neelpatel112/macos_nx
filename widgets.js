// widgets.js - macOS Style Desktop Widgets with Analog Clock
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
        // Add your actual music files here
        this.musicLibrary = [
            {
                title: "Bohemian Rhapsody",
                artist: "Queen",
                file: "music/bohemian-rhapsody.mp3",
                artwork: null
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                file: "music/shape-of-you.mp3",
                artwork: null
            },
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                file: "music/blinding-lights.mp3",
                artwork: null
            },
            {
                title: "Rolling in the Deep",
                artist: "Adele",
                file: "music/rolling-in-the-deep.mp3",
                artwork: null
            }
        ];
    }
    
    renderWidgets() {
        this.container.innerHTML = `
            <!-- Analog Clock Widget -->
            <div class="widget widget-clock" id="clockWidget">
                <div class="analog-clock" id="analogClock">
                    <!-- Hour markers -->
                    <div class="marker-12">12</div>
                    <div class="marker-3">3</div>
                    <div class="marker-6">6</div>
                    <div class="marker-9">9</div>
                    
                    <!-- Minute markers container -->
                    <div class="minute-markers" id="minuteMarkers"></div>
                    
                    <!-- Clock hands -->
                    <div class="clock-hand hour-hand" id="hourHand"></div>
                    <div class="clock-hand minute-hand" id="minuteHand"></div>
                    <div class="clock-hand second-hand" id="secondHand"></div>
                    
                    <!-- Center dot -->
                    <div class="clock-center"></div>
                </div>
                
                <!-- Digital date below the clock -->
                <div class="analog-date" id="analogDate"></div>
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
            
            <!-- Trash Widget -->
            <div class="widget widget-trash" id="trashWidget">
                <i class="fas fa-trash trash-icon"></i>
                <span class="trash-text">Trash</span>
                <span class="trash-count">0</span>
            </div>
        `;
        
        // Generate minute markers after container is created
        setTimeout(() => this.generateMinuteMarkers(), 100);
    }
    
    generateMinuteMarkers() {
        const markersContainer = document.getElementById('minuteMarkers');
        if (!markersContainer) return;
        
        // Clear existing markers
        markersContainer.innerHTML = '';
        
        // Generate 60 minute markers
        for (let i = 0; i < 60; i++) {
            const marker = document.createElement('div');
            marker.className = 'minute-marker';
            
            // Rotate each marker
            const rotation = i * 6; // 360° / 60 = 6° per minute
            marker.style.transform = `rotate(${rotation}deg)`;
            
            // Make every 5th marker (hour markers) slightly longer
            if (i % 5 === 0) {
                marker.style.height = '10px';
                marker.style.background = 'rgba(255, 255, 255, 0.6)';
                marker.style.top = '5px';
            }
            
            markersContainer.appendChild(marker);
        }
    }
    
    startClock() {
        const updateClock = () => {
            const now = new Date();
            
            // Get time components
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const milliseconds = now.getMilliseconds();
            
            // Calculate hand rotations (smooth movements)
            const hourRotation = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5/60);
            const minuteRotation = minutes * 6 + seconds * 0.1;
            const secondRotation = (seconds + milliseconds/1000) * 6;
            
            // Apply rotations
            const hourHand = document.getElementById('hourHand');
            const minuteHand = document.getElementById('minuteHand');
            const secondHand = document.getElementById('secondHand');
            
            if (hourHand) hourHand.style.transform = `rotate(${hourRotation}deg)`;
            if (minuteHand) minuteHand.style.transform = `rotate(${minuteRotation}deg)`;
            if (secondHand) secondHand.style.transform = `rotate(${secondRotation}deg)`;
            
            // Update digital date
            const dateElement = document.getElementById('analogDate');
            if (dateElement) {
                const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
                const month = now.toLocaleDateString('en-US', { month: 'short' });
                const day = now.getDate();
                
                dateElement.innerHTML = `<span class="weekday">${weekday}</span> ${month} ${day}`;
            }
        };
        
        updateClock();
        setInterval(updateClock, 50); // Update every 50ms for smooth second hand
    }
    
    fetchWeather() {
        // Mock weather data for demo
        this.mockWeatherData();
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
        const prevBtn = document.getElementById('musicPrev');
        const nextBtn = document.getElementById('musicNext');
        const playPauseBtn = document.getElementById('musicPlayPause');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
        if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.togglePlay());
        
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
            const playBtn = document.querySelector('#musicPlayPause i');
            if (playBtn) playBtn.className = 'fas fa-play';
        } else {
            this.audioElement.play();
            const playBtn = document.querySelector('#musicPlayPause i');
            if (playBtn) playBtn.className = 'fas fa-pause';
        }
        
        this.isPlaying = !this.isPlaying;
    }
    
    loadTrack(index) {
        const track = this.musicLibrary[index];
        if (!track) return;
        
        document.getElementById('musicTitle').textContent = track.title;
        document.getElementById('musicArtist').textContent = track.artist;
        document.getElementById('musicDuration').textContent = '3:45'; // Placeholder
        
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
            const progressBar = document.getElementById('musicProgress');
            if (progressBar) progressBar.style.width = `${progress}%`;
            
            const currentMin = Math.floor(this.audioElement.currentTime / 60);
            const currentSec = Math.floor(this.audioElement.currentTime % 60).toString().padStart(2, '0');
            const currentTimeEl = document.getElementById('musicCurrentTime');
            if (currentTimeEl) currentTimeEl.textContent = `${currentMin}:${currentSec}`;
        }
    }
    
    updateDuration() {
        if (this.audioElement.duration) {
            const durationMin = Math.floor(this.audioElement.duration / 60);
            const durationSec = Math.floor(this.audioElement.duration % 60).toString().padStart(2, '0');
            const durationEl = document.getElementById('musicDuration');
            if (durationEl) durationEl.textContent = `${durationMin}:${durationSec}`;
        }
    }
}

// Initialize widgets
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Initializing Desktop Widgets...');
    window.DesktopWidgets = new DesktopWidgets();
});