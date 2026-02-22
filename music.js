// music.js - FIXED VERSION WITH PROPER FILE PATHS
class MusicApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentView = 'library';
        this.audioPlayer = new Audio();
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.currentSongIndex = 0;
        this.shuffle = false;
        this.repeat = 'none';
        this.visualizer = null;
        this.visualizerType = 'bars';
        
        this.library = this.createMusicLibrary();
        this.playlists = {
            'favorites': { name: 'Favorites', songs: [] },
            'chill': { name: 'Chill Vibes', songs: [] },
            'workout': { name: 'Workout', songs: [] }
        };
        
        this.queue = [];
        this.init();
    }
    
    createMusicLibrary() {
        // FIXED: Using encodeURIComponent for file paths with spaces
        return [
            {
                id: 1,
                title: 'God is',
                artist: 'Kanye West',
                album: 'Jesus is King',
                duration: '3:23',
                file: 'music/God%20is.mp3', // URL encoded
                albumArt: 'album-art/69.jpg',
                genre: 'Gospel Rap',
                year: 2019,
                favorite: true,
                color: '#FFD700'
            },
            {
                id: 2,
                title: 'Out of Time',
                artist: 'The Weeknd',
                album: 'Dawn FM',
                duration: '3:34',
                file: 'music/Out%20of%20time.mp3', // URL encoded
                albumArt: 'album-art/88.jpg',
                genre: 'Synthwave',
                year: 2022,
                favorite: true,
                color: '#00BFFF'
            },
            {
                id: 3,
                title: 'From Time',
                artist: 'Drake ft. Jhené Aiko',
                album: 'Nothing Was The Same',
                duration: '5:22',
                file: 'music/From%20time.mp3', // URL encoded
                albumArt: 'album-art/55.jpg',
                genre: 'R&B',
                year: 2013,
                favorite: false,
                color: '#8B0000'
            },
            {
                id: 4,
                title: 'Is This Love',
                artist: 'Bob Marley & The Wailers',
                album: 'Kaya',
                duration: '3:52',
                file: 'music/Is%20this%20love.mp3', // URL encoded
                albumArt: 'album-art/66.jpg',
                genre: 'Reggae',
                year: 1978,
                favorite: true,
                color: '#FF4500'
            },
            {
                id: 5,
                title: 'Empire State of Mind',
                artist: 'Jay-Z ft. Alicia Keys',
                album: 'The Blueprint 3',
                duration: '4:36',
                file: 'music/Empire%20state%20of%20mind.mp3', // URL encoded
                albumArt: 'album-art/77.jpg',
                genre: 'Hip Hop',
                year: 2009,
                favorite: true,
                color: '#0000FF'
            }
        ];
    }
    
    init() {
        this.createWindow();
        this.setupAudioPlayer();
        this.setupEventListeners();
        this.loadSongsList();
        console.log('🎵 Music App initialized with', this.library.length, 'songs');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window music-window';
        this.window.style.cssText = `
            position: fixed;
            top: 120px;
            left: 120px;
            width: 1100px;
            height: 750px;
            background: #000;
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
        `;
        
        this.window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">Music</div>
            </div>
            
            <div class="music-container">
                <div class="music-sidebar">
                    <div class="music-logo">
                        <h2>♪ Music</h2>
                        <p style="font-size: 11px; color: #666; margin-top: 5px;">${this.library.length} local songs</p>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-item active" data-view="library">
                            <i class="fas fa-music"></i>
                            <span>Library</span>
                            <span class="count">${this.library.length}</span>
                        </div>
                        <div class="nav-item" data-view="now-playing">
                            <i class="fas fa-play-circle"></i>
                            <span>Now Playing</span>
                        </div>
                        <div class="nav-item" data-view="artists">
                            <i class="fas fa-users"></i>
                            <span>Artists</span>
                            <span class="count">${new Set(this.library.map(s => s.artist)).size}</span>
                        </div>
                        <div class="nav-item" data-view="albums">
                            <i class="fas fa-compact-disc"></i>
                            <span>Albums</span>
                            <span class="count">${new Set(this.library.map(s => s.album)).size}</span>
                        </div>
                    </div>
                    
                    <div class="playlists-section">
                        <div style="padding: 0 20px 10px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
                            Playlists
                        </div>
                        
                        <div class="playlist-item" data-playlist="favorites">
                            <div class="playlist-icon" style="background: linear-gradient(135deg, #FF2D55 0%, #FF9500 100%);">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="playlist-name">Favorites</div>
                            <div class="playlist-count">${this.library.filter(s => s.favorite).length}</div>
                        </div>
                        
                        <div class="playlist-item" data-playlist="all-songs">
                            <div class="playlist-icon" style="background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);">
                                <i class="fas fa-headphones"></i>
                            </div>
                            <div class="playlist-name">All Songs</div>
                            <div class="playlist-count">${this.library.length}</div>
                        </div>
                        
                        <div class="playlist-item" data-playlist="by-genre">
                            <div class="playlist-icon" style="background: linear-gradient(135deg, #34C759 0%, #5AC8FA 100%);">
                                <i class="fas fa-guitar"></i>
                            </div>
                            <div class="playlist-name">By Genre</div>
                            <div class="playlist-count">${new Set(this.library.map(s => s.genre)).size}</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: auto; padding: 20px; border-top: 1px solid #333;">
                        <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
                            <i class="fas fa-hdd"></i> Local Storage
                        </div>
                        <div style="font-size: 12px; color: #1DB954;">
                            <i class="fas fa-check-circle"></i> ${this.library.length} songs loaded
                        </div>
                    </div>
                </div>
                
                <div class="music-main">
                    <div class="library-view" id="libraryView">
                        <div class="library-header">
                            <h1 class="library-title">Your Music Library</h1>
                            <p class="library-subtitle">${this.library.length} local songs • ${this.formatTotalDuration()}</p>
                        </div>
                        
                        <div style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                            <button class="toolbar-btn" id="playAllBtn" style="background: linear-gradient(135deg, #1DB954, #1ED760);">
                                <i class="fas fa-play"></i>
                                Play All
                            </button>
                            <button class="toolbar-btn" id="shuffleAllBtn">
                                <i class="fas fa-random"></i>
                                Shuffle All
                            </button>
                            <button class="toolbar-btn" id="queueAllBtn">
                                <i class="fas fa-list"></i>
                                Add All to Queue
                            </button>
                            <button class="toolbar-btn" id="importMoreBtn">
                                <i class="fas fa-folder-plus"></i>
                                Import More
                            </button>
                        </div>
                        
                        <div class="songs-list">
                            <div class="song-header">
                                <div style="text-align: center;">#</div>
                                <div>Title</div>
                                <div>Artist</div>
                                <div>Album</div>
                                <div style="text-align: center;">Time</div>
                            </div>
                            
                            <div id="songsContainer"></div>
                        </div>
                    </div>
                    
                    <div class="now-playing-view" id="nowPlayingView">
                        <div class="now-playing-art">
                            <div class="album-art-large" id="albumArtLarge">
                                <img src="" alt="Album Art" id="largeAlbumArt" 
                                     onerror="this.src='album-art/default.jpg'; this.onerror=null;">
                                <div class="visualizer-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(transparent, rgba(0,0,0,0.7));"></div>
                            </div>
                            
                            <div class="album-info">
                                <h2 class="album-title" id="nowPlayingTitle">Select a song</h2>
                                <p class="album-details" id="nowPlayingDetails">Click any song to start playing</p>
                                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                                    <span class="genre-tag" id="genreTag" style="background: #333; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Genre</span>
                                    <span class="year-tag" id="yearTag" style="background: #444; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Year</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="visualizer">
                            <canvas class="visualizer-canvas" id="visualizerCanvas" width="800" height="120"></canvas>
                            
                            <div class="visualizer-controls">
                                <button class="visualizer-btn ${this.visualizerType === 'bars' ? 'active' : ''}" data-visualizer="bars">
                                    Bars
                                </button>
                                <button class="visualizer-btn ${this.visualizerType === 'wave' ? 'active' : ''}" data-visualizer="wave">
                                    Wave
                                </button>
                                <button class="visualizer-btn ${this.visualizerType === 'circle' ? 'active' : ''}" data-visualizer="circle">
                                    Circle
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="queue-view" id="queueView">
                        <div class="queue-header">
                            <h3 class="queue-title">Queue</h3>
                            <button class="queue-clear" id="clearQueueBtn">Clear All</button>
                        </div>
                        
                        <div style="font-size: 12px; color: #1DB954; padding: 10px 0; border-bottom: 1px solid #333;">
                            <i class="fas fa-info-circle"></i> Next up: <span id="nextSongInfo">None</span>
                        </div>
                        
                        <div id="queueContainer">
                            <div style="text-align: center; color: #666; padding: 40px 20px;">
                                <i class="fas fa-list" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                                <p>Queue is empty</p>
                                <p style="font-size: 12px; margin-top: 5px;">Add songs from your library</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="now-playing-bar">
                <div class="now-playing-info">
                    <div class="album-art-small">
                        <img src="" alt="Album Art" id="smallAlbumArt" 
                             onerror="this.src='album-art/default.jpg'; this.onerror=null;">
                    </div>
                    
                    <div class="track-info">
                        <h4 class="track-title" id="trackTitle">Music</h4>
                        <p class="track-artist" id="trackArtist">Ready to play your local songs</p>
                    </div>
                    
                    <button class="action-btn" id="likeBtn" title="Add to Favorites">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                
                <div class="player-controls">
                    <div class="control-buttons">
                        <button class="control-btn" id="shuffleBtn" title="Shuffle">
                            <i class="fas fa-random"></i>
                        </button>
                        
                        <button class="control-btn" id="prevBtn" title="Previous">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        
                        <button class="control-btn play-pause" id="playPauseBtn" title="Play">
                            <i class="fas fa-play"></i>
                        </button>
                        
                        <button class="control-btn" id="nextBtn" title="Next">
                            <i class="fas fa-step-forward"></i>
                        </button>
                        
                        <button class="control-btn" id="repeatBtn" title="Repeat">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="progress-container">
                        <span class="time-current" id="timeCurrent">0:00</span>
                        <div class="progress-bar" id="progressBar">
                            <div class="progress" id="progress"></div>
                        </div>
                        <span class="time-total" id="timeTotal">0:00</span>
                    </div>
                </div>
                
                <div class="extra-controls">
                    <button class="control-btn" id="queueToggleBtn" title="Show Queue">
                        <i class="fas fa-list"></i>
                        <span id="queueCount" style="font-size: 10px; margin-left: 2px;">0</span>
                    </button>
                    
                    <div class="volume-container">
                        <i class="fas fa-volume-up volume-icon"></i>
                        <input type="range" min="0" max="1" step="0.01" value="${this.volume}" 
                               class="volume-slider" id="volumeSlider">
                    </div>
                    
                    <button class="control-btn" id="fileInfoBtn" title="File Info">
                        <i class="fas fa-file-audio"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        this.loadSongsList();
    }
    
    setupAudioPlayer() {
        this.audioPlayer.volume = this.volume;
        this.audioPlayer.preload = 'metadata';
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.currentTime = this.audioPlayer.currentTime;
            this.duration = this.audioPlayer.duration || 0;
            this.updateProgress();
        });
        
        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updateNowPlayingUI();
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.nextSong();
        });
        
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.duration = this.audioPlayer.duration;
            this.updateTimeDisplay();
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            const currentSong = this.library[this.currentSongIndex];
            if (currentSong) {
                console.log('Failed to load:', currentSong.file);
            }
        });
    }
    
    setupEventListeners() {
        this.window.querySelector('.window-close')?.addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize')?.addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom')?.addEventListener('click', () => this.zoom());
        
        this.window.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) this.switchView(view);
            });
        });
        
        this.window.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const playlist = e.currentTarget.dataset.playlist;
                if (playlist) this.showPlaylist(playlist);
            });
        });
        
        this.window.querySelector('#playPauseBtn')?.addEventListener('click', () => this.togglePlay());
        this.window.querySelector('#prevBtn')?.addEventListener('click', () => this.prevSong());
        this.window.querySelector('#nextBtn')?.addEventListener('click', () => this.nextSong());
        this.window.querySelector('#shuffleBtn')?.addEventListener('click', () => this.toggleShuffle());
        this.window.querySelector('#repeatBtn')?.addEventListener('click', () => this.toggleRepeat());
        this.window.querySelector('#likeBtn')?.addEventListener('click', () => this.toggleLike());
        
        const progressBar = this.window.querySelector('#progressBar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seekTo(percent);
            });
        }
        
        const volumeSlider = this.window.querySelector('#volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseFloat(e.target.value);
                this.audioPlayer.volume = this.volume;
            });
        }
        
        this.window.querySelector('#queueToggleBtn')?.addEventListener('click', () => this.toggleQueue());
        this.window.querySelector('#playAllBtn')?.addEventListener('click', () => this.playAll());
        this.window.querySelector('#shuffleAllBtn')?.addEventListener('click', () => this.shuffleAll());
        this.window.querySelector('#queueAllBtn')?.addEventListener('click', () => this.queueAll());
        this.window.querySelector('#clearQueueBtn')?.addEventListener('click', () => this.clearQueue());
        this.window.querySelector('#importMoreBtn')?.addEventListener('click', () => this.importMoreMusic());
        this.window.querySelector('#fileInfoBtn')?.addEventListener('click', () => this.showFileInfo());
        
        this.window.querySelectorAll('.visualizer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.visualizer;
                this.setVisualizerType(type);
            });
        });
        
        this.setupKeyboardShortcuts();
        this.makeDraggable();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey) this.nextSong();
                    break;
                case 'ArrowLeft':
                    if (e.ctrlKey) this.prevSong();
                    break;
            }
        });
    }
    
    loadSongsList() {
        const container = this.window.querySelector('#songsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.library.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            if (index === this.currentSongIndex && this.isPlaying) {
                songElement.classList.add('playing');
            }
            
            songElement.innerHTML = `
                <div class="song-number">
                    ${index === this.currentSongIndex && this.isPlaying ? 
                        '<i class="fas fa-volume-up" style="color: #1DB954;"></i>' : 
                        (index + 1)}
                </div>
                <div class="song-title">
                    <div class="song-album-art">
                        <img src="${song.albumArt}" alt="${song.album}" 
                             onerror="this.src='album-art/default.jpg'; this.onerror=null;">
                    </div>
                    <div>
                        <h4 class="song-name">${song.title}</h4>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                </div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${song.duration}</div>
                <div class="song-actions">
                    <button class="action-btn" data-action="play" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="action-btn" data-action="queue" title="Add to Queue">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            
            songElement.querySelector('[data-action="play"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(index);
            });
            
            songElement.querySelector('[data-action="queue"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToQueue(song);
            });
            
            songElement.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.playSong(index);
                }
            });
            
            container.appendChild(songElement);
        });
    }
    
    playSong(index) {
        if (index < 0 || index >= this.library.length) return;
        
        this.currentSongIndex = index;
        const song = this.library[index];
        
        console.log('🎵 Playing:', song.title, 'from:', song.file);
        
        this.audioPlayer.src = song.file;
        this.audioPlayer.play().catch(e => {
            console.error('Play failed:', e);
            alert(`Could not play: ${song.title}\n\nMake sure the file exists at: ${song.file}`);
        });
        
        this.updateNowPlaying(song);
        this.updatePlayButton();
        
        this.window.querySelectorAll('.song-item').forEach((item, i) => {
            item.classList.toggle('playing', i === index && this.isPlaying);
        });
    }
    
    updateNowPlaying(song) {
        const trackTitle = this.window.querySelector('#trackTitle');
        const trackArtist = this.window.querySelector('#trackArtist');
        const smallArt = this.window.querySelector('#smallAlbumArt');
        const nowPlayingTitle = this.window.querySelector('#nowPlayingTitle');
        const nowPlayingDetails = this.window.querySelector('#nowPlayingDetails');
        const largeArt = this.window.querySelector('#largeAlbumArt');
        const genreTag = this.window.querySelector('#genreTag');
        const yearTag = this.window.querySelector('#yearTag');
        const likeBtn = this.window.querySelector('#likeBtn i');
        
        if (trackTitle) trackTitle.textContent = song.title;
        if (trackArtist) trackArtist.textContent = song.artist;
        if (smallArt) smallArt.src = song.albumArt;
        if (nowPlayingTitle) nowPlayingTitle.textContent = song.title;
        if (nowPlayingDetails) nowPlayingDetails.textContent = `${song.artist} • ${song.album} • ${song.year}`;
        if (largeArt) largeArt.src = song.albumArt;
        if (genreTag) {
            genreTag.textContent = song.genre;
            genreTag.style.background = song.color || '#333';
        }
        if (yearTag) yearTag.textContent = song.year;
        if (likeBtn) {
            likeBtn.className = song.favorite ? 'fas fa-heart' : 'far fa-heart';
            likeBtn.style.color = song.favorite ? '#FF3B30' : '';
        }
    }
    
    updateNowPlayingUI() {
        const currentSong = this.library[this.currentSongIndex];
        if (currentSong) this.updateNowPlaying(currentSong);
    }
    
    togglePlay() {
        if (this.audioPlayer.src) {
            if (this.isPlaying) {
                this.audioPlayer.pause();
            } else {
                this.audioPlayer.play();
            }
        } else {
            if (this.library.length > 0) {
                this.playSong(0);
            }
        }
    }
    
    updatePlayButton() {
        const btn = this.window.querySelector('#playPauseBtn');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            btn.title = 'Pause';
            btn.style.background = '#FF3B30';
        } else {
            icon.className = 'fas fa-play';
            btn.title = 'Play';
            btn.style.background = '#1DB954';
        }
    }
    
    prevSong() {
        if (this.shuffle) {
            this.playSong(Math.floor(Math.random() * this.library.length));
        } else {
            const prevIndex = (this.currentSongIndex - 1 + this.library.length) % this.library.length;
            this.playSong(prevIndex);
        }
    }
    
    nextSong() {
        if (this.shuffle) {
            this.playSong(Math.floor(Math.random() * this.library.length));
        } else if (this.repeat === 'one') {
            this.playSong(this.currentSongIndex);
        } else {
            const nextIndex = (this.currentSongIndex + 1) % this.library.length;
            if (nextIndex === 0 && this.repeat === 'none') {
                this.audioPlayer.pause();
                this.isPlaying = false;
                this.updatePlayButton();
            } else {
                this.playSong(nextIndex);
            }
        }
    }
    
    toggleShuffle() {
        this.shuffle = !this.shuffle;
        const btn = this.window.querySelector('#shuffleBtn');
        if (btn) {
            btn.style.color = this.shuffle ? '#1DB954' : '';
            btn.title = `Shuffle: ${this.shuffle ? 'ON' : 'OFF'}`;
        }
    }
    
    toggleRepeat() {
        const modes = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(this.repeat);
        this.repeat = modes[(currentIndex + 1) % modes.length];
        
        const btn = this.window.querySelector('#repeatBtn');
        if (!btn) return;
        
        btn.style.color = this.repeat !== 'none' ? '#1DB954' : '';
        btn.title = `Repeat: ${this.repeat}`;
        
        if (this.repeat === 'one') {
            btn.innerHTML = '<i class="fas fa-redo"></i><sup style="font-size: 8px; position: relative; top: -5px;">1</sup>';
        } else {
            btn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }
    
    toggleLike() {
        const song = this.library[this.currentSongIndex];
        if (song) {
            song.favorite = !song.favorite;
            this.updateNowPlaying(song);
            
            const favCount = this.window.querySelector('[data-playlist="favorites"] .playlist-count');
            if (favCount) {
                favCount.textContent = this.library.filter(s => s.favorite).length;
            }
            
            this.loadSongsList();
        }
    }
    
    updateProgress() {
        const progress = this.window.querySelector('#progress');
        const currentTime = this.window.querySelector('#timeCurrent');
        const totalTime = this.window.querySelector('#timeTotal');
        
        if (this.duration > 0 && progress && currentTime && totalTime) {
            const percent = (this.currentTime / this.duration) * 100;
            progress.style.width = `${percent}%`;
            
            currentTime.textContent = this.formatTime(this.currentTime);
            totalTime.textContent = this.formatTime(this.duration);
        }
    }
    
    updateTimeDisplay() {
        const totalTime = this.window.querySelector('#timeTotal');
        if (totalTime) {
            totalTime.textContent = this.formatTime(this.duration);
        }
    }
    
    seekTo(percent) {
        if (this.duration > 0) {
            this.audioPlayer.currentTime = percent * this.duration;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    formatTotalDuration() {
        const totalMinutes = this.library.length * 4;
        if (totalMinutes < 60) {
            return `${totalMinutes} min`;
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours} hr ${minutes} min`;
        }
    }
    
    toggleQueue() {
        const queueView = this.window.querySelector('#queueView');
        if (queueView) {
            queueView.classList.toggle('active');
            this.loadQueue();
        }
    }
    
    loadQueue() {
        const container = this.window.querySelector('#queueContainer');
        const queueCount = this.window.querySelector('#queueCount');
        const nextSongInfo = this.window.querySelector('#nextSongInfo');
        
        if (!container) return;
        
        if (queueCount) {
            queueCount.textContent = this.queue.length > 0 ? this.queue.length : '';
            queueCount.style.display = this.queue.length > 0 ? 'inline' : 'none';
        }
        
        if (nextSongInfo) {
            nextSongInfo.textContent = this.queue.length > 0 ? this.queue[0].title : 'None';
        }
        
        if (this.queue.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px 20px;">
                    <i class="fas fa-list" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                    <p>Queue is empty</p>
                    <p style="font-size: 12px; margin-top: 5px;">Add songs from your library</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.queue.forEach((song, index) => {
            const isCurrent = index === 0 && this.isPlaying;
            
            const queueItem = document.createElement('div');
            queueItem.className = `queue-item ${isCurrent ? 'playing' : ''}`;
            
            queueItem.innerHTML = `
                <div class="queue-art">
                    <img src="${song.albumArt}" alt="${song.album}" 
                         onerror="this.src='album-art/default.jpg'; this.onerror=null;">
                </div>
                <div class="queue-info">
                    <h4 class="queue-song">${song.title}</h4>
                    <p class="queue-artist">${song.artist} • ${song.duration}</p>
                </div>
                <button class="action-btn" data-action="remove" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            queueItem.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.playFromQueue(index);
                }
            });
            
            queueItem.querySelector('[data-action="remove"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromQueue(index);
            });
            
            container.appendChild(queueItem);
        });
    }
    
    addToQueue(song) {
        this.queue.push(song);
        this.loadQueue();
    }
    
    playFromQueue(index) {
        if (index >= 0 && index < this.queue.length) {
            const song = this.queue[index];
            const libraryIndex = this.library.findIndex(s => s.id === song.id);
            if (libraryIndex !== -1) {
                this.playSong(libraryIndex);
            }
            this.queue.splice(index, 1);
            this.loadQueue();
        }
    }
    
    removeFromQueue(index) {
        if (index >= 0 && index < this.queue.length) {
            this.queue.splice(index, 1);
            this.loadQueue();
        }
    }
    
    playAll() {
        this.queue = [...this.library];
        this.playFromQueue(0);
        this.toggleQueue();
    }
    
    shuffleAll() {
        this.queue = [...this.library].sort(() => Math.random() - 0.5);
        this.playFromQueue(0);
        this.toggleQueue();
    }
    
    queueAll() {
        this.queue = [...this.library];
        this.loadQueue();
        this.toggleQueue();
    }
    
    clearQueue() {
        this.queue = [];
        this.loadQueue();
    }
    
    switchView(view) {
        this.currentView = view;
        
        this.window.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });
        
        const libraryView = this.window.querySelector('#libraryView');
        const nowPlayingView = this.window.querySelector('#nowPlayingView');
        
        if (libraryView && nowPlayingView) {
            if (view === 'library') {
                libraryView.style.display = 'block';
                nowPlayingView.style.display = 'none';
            } else if (view === 'now-playing') {
                libraryView.style.display = 'none';
                nowPlayingView.style.display = 'flex';
                this.updateNowPlayingUI();
            }
        }
    }
    
    showPlaylist(playlistId) {
        if (playlistId === 'favorites') {
            const favSongs = this.library.filter(s => s.favorite);
            alert(`🎵 Favorites Playlist\n\n${favSongs.map(s => `• ${s.title} - ${s.artist}`).join('\n')}`);
        } else if (playlistId === 'all-songs') {
            alert(`🎵 All Songs (${this.library.length})\n\n${this.library.map(s => `• ${s.title} - ${s.artist}`).join('\n')}`);
        } else if (playlistId === 'by-genre') {
            const genres = [...new Set(this.library.map(s => s.genre))];
            alert(`🎵 Genres\n\n${genres.map(g => `• ${g}: ${this.library.filter(s => s.genre === g).length} songs`).join('\n')}`);
        }
    }
    
    importMoreMusic() {
        alert('To add more music:\n\n1. Add MP3 files to your "music/" folder\n2. Add album art to "album-art/" folder\n3. Refresh the Music app');
    }
    
    showFileInfo() {
        const currentSong = this.library[this.currentSongIndex];
        if (currentSong) {
            alert(`📁 File Information:\n\n• File: ${currentSong.file}\n• Album Art: ${currentSong.albumArt}\n• Format: MP3`);
        } else {
            alert('No song currently playing');
        }
    }
    
    setVisualizerType(type) {
        this.visualizerType = type;
        this.window.querySelectorAll('.visualizer-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.visualizer === type);
        });
    }
    
    open() {
        console.log('🎵 Opening Music window');
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
        return true;
    }
    
    close() {
        this.window.style.display = 'none';
        this.isOpen = false;
        this.audioPlayer.pause();
    }
    
    minimize() {
        this.window.style.transform = 'translateY(100vh)';
        this.window.style.opacity = '0';
        setTimeout(() => {
            this.window.style.display = 'none';
            this.isOpen = false;
        }, 300);
    }
    
    zoom() {
        if (this.window.style.width === '90vw') {
            this.window.style.width = '1100px';
            this.window.style.height = '750px';
        } else {
            this.window.style.width = '90vw';
            this.window.style.height = '90vh';
        }
    }
    
    bringToFront() {
        const windows = document.querySelectorAll('.window');
        let maxZ = 100;
        windows.forEach(w => {
            const z = parseInt(window.getComputedStyle(w).zIndex) || 100;
            if (z > maxZ) maxZ = z;
        });
        this.window.style.zIndex = maxZ + 1;
    }
    
    makeDraggable() {
        const titlebar = this.window.querySelector('.window-titlebar');
        if (!titlebar) return;
        
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

// Initialize Music App with proper error handling
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing Music App...');
    try {
        window.MusicApp = new MusicApp();
        console.log('✅ Music App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Music App:', error);
    }
});

// Also try to initialize if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.MusicApp) {
            console.log('🔄 Late initialization of Music App...');
            window.MusicApp = new MusicApp();
        }
    }, 100);
} 