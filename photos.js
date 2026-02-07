// photos.js - macOS Photos App
class PhotosApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentView = 'grid'; // 'grid' or 'single'
        this.selectedPhotos = new Set();
        this.currentAlbum = 'recents';
        this.currentPhotoIndex = 0;
        this.albums = {
            recents: { name: 'Recents', count: 10, icon: 'fas fa-clock' },
            favorites: { name: 'Favorites', count: 4, icon: 'fas fa-heart' },
            vacation: { name: 'Vacation', count: 4, icon: 'fas fa-umbrella-beach' },
            nature: { name: 'Nature', count: 4, icon: 'fas fa-tree' },
            portraits: { name: 'Portraits', count: 3, icon: 'fas fa-user' }
        };
        this.photos = this.generateSamplePhotos();
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        this.loadPhotos();
        console.log('📸 Photos App initialized');
    }
    
    generateSamplePhotos() {
        // Generate sample photo data
        const photos = [];
        const locations = ['Beach', 'Mountain', 'Forest', 'City', 'Lake', 'Sunset'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Recent photos
        for (let i = 1; i <= 10; i++) {
            photos.push({
                id: `photo_${i}`,
                name: `Photo ${i}`,
                album: 'recents',
                date: `${months[Math.floor(Math.random() * 12)]} ${Math.floor(Math.random() * 28) + 1}, 2024`,
                size: `${Math.floor(Math.random() * 5) + 2} MB`,
                dimensions: `${Math.floor(Math.random() * 1000) + 2000} × ${Math.floor(Math.random() * 800) + 1500}`,
                location: locations[Math.floor(Math.random() * locations.length)],
                favorite: i <= 4
            });
        }
        
        // Album photos
        ['vacation', 'nature', 'portraits'].forEach(album => {
            const count = album === 'portraits' ? 3 : 4;
            for (let i = 1; i <= count; i++) {
                photos.push({
                    id: `${album}_${i}`,
                    name: `${album.charAt(0).toUpperCase() + album.slice(1)} ${i}`,
                    album: album,
                    date: `${months[Math.floor(Math.random() * 12)]} ${Math.floor(Math.random() * 28) + 1}, 2024`,
                    size: `${Math.floor(Math.random() * 5) + 2} MB`,
                    dimensions: `${Math.floor(Math.random() * 1000) + 2000} × ${Math.floor(Math.random() * 800) + 1500}`,
                    location: album === 'vacation' ? 'Beach' : album === 'nature' ? 'Mountain' : 'Studio',
                    favorite: false
                });
            }
        });
        
        return photos;
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window photos-window';
        this.window.style.cssText = `
            position: fixed;
            top: 150px;
            left: 150px;
            width: 1000px;
            height: 700px;
            background: #1a1a1a;
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
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
                <div class="window-title">Photos</div>
            </div>
            
            <div class="photos-container">
                <!-- Sidebar -->
                <div class="photos-sidebar">
                    <div class="sidebar-header">
                        <h3>Library</h3>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-item active" data-view="recents">
                            <i class="fas fa-clock"></i>
                            <span>Recents</span>
                            <span class="count">10</span>
                        </div>
                        <div class="sidebar-item" data-view="favorites">
                            <i class="fas fa-heart"></i>
                            <span>Favorites</span>
                            <span class="count">4</span>
                        </div>
                        <div class="sidebar-item" data-view="all">
                            <i class="fas fa-images"></i>
                            <span>All Photos</span>
                            <span class="count">21</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-section albums-section">
                        <div class="sidebar-header">
                            <h3>Albums</h3>
                        </div>
                        
                        <div class="album-item" data-album="vacation">
                            <div class="album-thumb">
                                <i class="fas fa-umbrella-beach"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Vacation</div>
                                <div class="album-count">4 photos</div>
                            </div>
                        </div>
                        
                        <div class="album-item" data-album="nature">
                            <div class="album-thumb">
                                <i class="fas fa-tree"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Nature</div>
                                <div class="album-count">4 photos</div>
                            </div>
                        </div>
                        
                        <div class="album-item" data-album="portraits">
                            <div class="album-thumb">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Portraits</div>
                                <div class="album-count">3 photos</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="photos-main">
                    <!-- Toolbar -->
                    <div class="photos-toolbar">
                        <button class="toolbar-btn" id="backBtn" style="display: none;">
                            <i class="fas fa-arrow-left"></i>
                            Back
                        </button>
                        
                        <button class="toolbar-btn" id="importBtn">
                            <i class="fas fa-plus"></i>
                            Import
                        </button>
                        
                        <button class="toolbar-btn" id="editBtn">
                            <i class="fas fa-sliders-h"></i>
                            Edit
                        </button>
                        
                        <button class="toolbar-btn" id="shareBtn">
                            <i class="fas fa-share"></i>
                            Share
                        </button>
                        
                        <button class="toolbar-btn" id="deleteBtn">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                        
                        <div class="toolbar-search">
                            <input type="text" class="search-box" placeholder="Search photos...">
                        </div>
                    </div>
                    
                    <!-- Edit Tools (Hidden by default) -->
                    <div class="edit-tools" id="editTools">
                        <div class="edit-section">
                            <h4>Adjustments</h4>
                            <div style="margin-bottom: 15px;">
                                <label style="color: #999; font-size: 12px; display: block; margin-bottom: 5px;">Brightness</label>
                                <input type="range" min="0" max="100" value="50" class="edit-slider" id="brightnessSlider">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="color: #999; font-size: 12px; display: block; margin-bottom: 5px;">Contrast</label>
                                <input type="range" min="0" max="100" value="50" class="edit-slider" id="contrastSlider">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="color: #999; font-size: 12px; display: block; margin-bottom: 5px;">Saturation</label>
                                <input type="range" min="0" max="100" value="50" class="edit-slider" id="saturationSlider">
                            </div>
                            
                            <h4>Filters</h4>
                            <div class="edit-presets">
                                <button class="edit-preset" data-filter="none">None</button>
                                <button class="edit-preset" data-filter="vintage">Vintage</button>
                                <button class="edit-preset" data-filter="bw">B&W</button>
                                <button class="edit-preset" data-filter="dramatic">Dramatic</button>
                                <button class="edit-preset" data-filter="warm">Warm</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Photos Grid View -->
                    <div class="photos-grid-container" id="gridView">
                        <div class="grid-header">
                            <h2 class="grid-title" id="gridTitle">Recents</h2>
                            <p class="grid-subtitle" id="gridSubtitle">10 photos</p>
                        </div>
                        
                        <div class="photos-grid" id="photosGrid">
                            <!-- Photos will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Single Photo View -->
                    <div class="photo-view" id="singleView">
                        <div class="photo-view-toolbar">
                            <div class="photo-nav">
                                <button class="photo-nav-btn" id="prevBtn">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="photo-nav-btn" id="nextBtn">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                <span class="photo-title" id="photoTitle">Photo 1</span>
                            </div>
                            
                            <div>
                                <button class="toolbar-btn" id="favoriteBtn">
                                    <i class="far fa-heart"></i>
                                    Favorite
                                </button>
                                <button class="toolbar-btn" id="infoBtn">
                                    <i class="fas fa-info-circle"></i>
                                    Info
                                </button>
                            </div>
                        </div>
                        
                        <div class="photo-view-content">
                            <img src="" alt="Photo" class="photo-full" id="fullPhoto">
                        </div>
                    </div>
                </div>
                
                <!-- Info Panel -->
                <div class="info-panel" id="infoPanel" style="display: none;">
                    <div class="info-section">
                        <h4>Photo Info</h4>
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value" id="infoName">Photo 1</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date</div>
                            <div class="info-value" id="infoDate">Jan 15, 2024</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Size</div>
                            <div class="info-value" id="infoSize">3.2 MB</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Dimensions</div>
                            <div class="info-value" id="infoDimensions">4032 × 3024</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Location</div>
                            <div class="info-value" id="infoLocation">Beach</div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Edit History</h4>
                        <div class="info-item">
                            <div class="info-label">Last edited</div>
                            <div class="info-value">2 days ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'photos.css';
        document.head.appendChild(link);
    }
    
    setupEventListeners() {
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Sidebar navigation
        this.window.querySelectorAll('.sidebar-item, .album-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view || e.currentTarget.dataset.album;
                if (view) {
                    this.switchView(view);
                }
            });
        });
        
        // Toolbar buttons
        this.window.querySelector('#importBtn').addEventListener('click', () => this.importPhotos());
        this.window.querySelector('#editBtn').addEventListener('click', () => this.toggleEditTools());
        this.window.querySelector('#shareBtn').addEventListener('click', () => this.sharePhoto());
        this.window.querySelector('#deleteBtn').addEventListener('click', () => this.deletePhotos());
        this.window.querySelector('#backBtn').addEventListener('click', () => this.showGridView());
        this.window.querySelector('#favoriteBtn').addEventListener('click', () => this.toggleFavorite());
        this.window.querySelector('#infoBtn').addEventListener('click', () => this.toggleInfoPanel());
        
        // Photo navigation
        this.window.querySelector('#prevBtn').addEventListener('click', () => this.prevPhoto());
        this.window.querySelector('#nextBtn').addEventListener('click', () => this.nextPhoto());
        
        // Search
        this.window.querySelector('.search-box').addEventListener('input', (e) => {
            this.searchPhotos(e.target.value);
        });
        
        // Edit sliders
        ['brightnessSlider', 'contrastSlider', 'saturationSlider'].forEach(id => {
            this.window.querySelector(`#${id}`).addEventListener('input', (e) => {
                this.applyEdit(e.target.id, e.target.value);
            });
        });
        
        // Filters
        this.window.querySelectorAll('.edit-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.applyFilter(filter);
            });
        });
        
        // Make window draggable
        this.makeDraggable();
    }
    
    loadPhotos() {
        const grid = this.window.querySelector('#photosGrid');
        grid.innerHTML = '';
        
        const filteredPhotos = this.photos.filter(photo => {
            if (this.currentAlbum === 'recents') return photo.album === 'recents';
            if (this.currentAlbum === 'favorites') return photo.favorite;
            if (this.currentAlbum === 'all') return true;
            return photo.album === this.currentAlbum;
        });
        
        filteredPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.dataset.id = photo.id;
            photoElement.dataset.index = index;
            
            // Try to load actual photo, fallback to placeholder
            const photoPath = this.getPhotoPath(photo);
            
            photoElement.innerHTML = `
                <img src="${photoPath}" alt="${photo.name}" class="photo-image" onerror="this.src='https://images.unsplash.com/photo-${index + 1}?w=400&h=300&fit=crop&auto=format'}">
                <div class="photo-info">
                    <h4 class="photo-name">${photo.name}</h4>
                    <p class="photo-date">${photo.date}</p>
                </div>
                <div class="photo-actions">
                    <button class="action-btn favorite-btn" title="Favorite">
                        <i class="${photo.favorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="action-btn info-btn" title="Info">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            `;
            
            // Click to view
            photoElement.querySelector('.photo-image').addEventListener('click', (e) => {
                e.stopPropagation();
                this.viewPhoto(index);
            });
            
            // Favorite button
            photoElement.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePhotoFavorite(photo.id);
            });
            
            // Info button
            photoElement.querySelector('.info-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPhotoInfo(photo);
            });
            
            // Select photo
            photoElement.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.togglePhotoSelection(photo.id, photoElement);
                }
            });
            
            grid.appendChild(photoElement);
        });
        
        // Update counts
        this.window.querySelector('#gridTitle').textContent = 
            this.currentAlbum.charAt(0).toUpperCase() + this.currentAlbum.slice(1);
        this.window.querySelector('#gridSubtitle').textContent = 
            `${filteredPhotos.length} photo${filteredPhotos.length !== 1 ? 's' : ''}`;
    }
    
    getPhotoPath(photo) {
        // Try to load from your photos folder
        if (photo.album === 'recents') {
            return `photos/recents/photo_${photo.id.split('_')[1]}.jpg`;
        } else if (['vacation', 'nature', 'portraits'].includes(photo.album)) {
            return `photos/albums/${photo.album}/${photo.album}_${photo.id.split('_')[1]}.jpg`;
        } else if (photo.album === 'favorites') {
            return `photos/favorites/fav_${photo.id.split('_')[1]}.jpg`;
        }
        
        // Fallback to Unsplash if file doesn't exist
        const photoId = parseInt(photo.id.split('_')[1]) || 1;
        return `https://images.unsplash.com/photo-${photoId}?w=400&h=300&fit=crop&auto=format`;
    }
    
    switchView(view) {
        this.currentAlbum = view;
        
        // Update active state
        this.window.querySelectorAll('.sidebar-item, .album-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = this.window.querySelector(`[data-view="${view}"], [data-album="${view}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        this.loadPhotos();
        this.showGridView();
    }
    
    viewPhoto(index) {
        this.currentPhotoIndex = index;
        const filteredPhotos = this.getFilteredPhotos();
        const photo = filteredPhotos[index];
        
        if (!photo) return;
        
        // Show single view
        this.window.querySelector('#gridView').style.display = 'none';
        this.window.querySelector('#singleView').classList.add('active');
        this.window.querySelector('#backBtn').style.display = 'flex';
        this.window.querySelector('#editTools').classList.remove('active');
        
        // Update photo
        const photoPath = this.getPhotoPath(photo);
        const fullPhoto = this.window.querySelector('#fullPhoto');
        fullPhoto.src = photoPath;
        fullPhoto.alt = photo.name;
        
        // Update title
        this.window.querySelector('#photoTitle').textContent = photo.name;
        
        // Update favorite button
        const favoriteBtn = this.window.querySelector('#favoriteBtn');
        favoriteBtn.innerHTML = `<i class="${photo.favorite ? 'fas' : 'far'} fa-heart"></i> ${photo.favorite ? 'Favorited' : 'Favorite'}`;
        
        // Update info panel if open
        if (this.window.querySelector('#infoPanel').style.display !== 'none') {
            this.updateInfoPanel(photo);
        }
        
        this.currentView = 'single';
    }
    
    showGridView() {
        this.window.querySelector('#gridView').style.display = 'block';
        this.window.querySelector('#singleView').classList.remove('active');
        this.window.querySelector('#backBtn').style.display = 'none';
        this.window.querySelector('#infoPanel').style.display = 'none';
        this.currentView = 'grid';
    }
    
    prevPhoto() {
        const filteredPhotos = this.getFilteredPhotos();
        if (filteredPhotos.length === 0) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        this.viewPhoto(this.currentPhotoIndex);
    }
    
    nextPhoto() {
        const filteredPhotos = this.getFilteredPhotos();
        if (filteredPhotos.length === 0) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % filteredPhotos.length;
        this.viewPhoto(this.currentPhotoIndex);
    }
    
    getFilteredPhotos() {
        return this.photos.filter(photo => {
            if (this.currentAlbum === 'recents') return photo.album === 'recents';
            if (this.currentAlbum === 'favorites') return photo.favorite;
            if (this.currentAlbum === 'all') return true;
            return photo.album === this.currentAlbum;
        });
    }
    
    togglePhotoSelection(photoId, element) {
        if (this.selectedPhotos.has(photoId)) {
            this.selectedPhotos.delete(photoId);
            element.classList.remove('selected');
        } else {
            this.selectedPhotos.add(photoId);
            element.classList.add('selected');
        }
        
        // Update delete button text
        const deleteBtn = this.window.querySelector('#deleteBtn');
        if (this.selectedPhotos.size > 0) {
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Delete (${this.selectedPhotos.size})`;
        } else {
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Delete`;
        }
    }
    
    togglePhotoFavorite(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (photo) {
            photo.favorite = !photo.favorite;
            
            // Update UI
            const photoElement = this.window.querySelector(`[data-id="${photoId}"]`);
            if (photoElement) {
                const heartIcon = photoElement.querySelector('.favorite-btn i');
                heartIcon.className = photo.favorite ? 'fas fa-heart' : 'far fa-heart';
            }
            
            // Update favorites count
            const favoritesCount = this.photos.filter(p => p.favorite).length;
            const favoritesItem = this.window.querySelector('[data-view="favorites"] .count');
            if (favoritesItem) {
                favoritesItem.textContent = favoritesCount;
            }
            
            // Update current view if needed
            if (this.currentAlbum === 'favorites') {
                this.loadPhotos();
            }
        }
    }
    
    toggleFavorite() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                this.togglePhotoFavorite(photo.id);
                
                // Update button
                const favoriteBtn = this.window.querySelector('#favoriteBtn');
                favoriteBtn.innerHTML = `<i class="${photo.favorite ? 'fas' : 'far'} fa-heart"></i> ${photo.favorite ? 'Favorited' : 'Favorite'}`;
            }
        }
    }
    
    showPhotoInfo(photo) {
        this.updateInfoPanel(photo);
        this.window.querySelector('#infoPanel').style.display = 'block';
    }
    
    updateInfoPanel(photo) {
        this.window.querySelector('#infoName').textContent = photo.name;
        this.window.querySelector('#infoDate').textContent = photo.date;
        this.window.querySelector('#infoSize').textContent = photo.size;
        this.window.querySelector('#infoDimensions').textContent = photo.dimensions;
        this.window.querySelector('#infoLocation').textContent = photo.location;
    }
    
    toggleInfoPanel() {
        const panel = this.window.querySelector('#infoPanel');
        if (panel.style.display === 'none') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                this.updateInfoPanel(photo);
                panel.style.display = 'block';
            }
        } else {
            panel.style.display = 'none';
        }
    }
    
    toggleEditTools() {
        const editTools = this.window.querySelector('#editTools');
        editTools.classList.toggle('active');
    }
    
    applyEdit(type, value) {
        const fullPhoto = this.window.querySelector('#fullPhoto');
        if (!fullPhoto) return;
        
        let filter = '';
        
        switch(type) {
            case 'brightnessSlider':
                filter = `brightness(${value}%)`;
                break;
            case 'contrastSlider':
                filter = `contrast(${value}%)`;
                break;
            case 'saturationSlider':
                filter = `saturate(${value}%)`;
                break;
        }
        
        fullPhoto.style.filter = filter;
    }
    
    applyFilter(filter) {
        const fullPhoto = this.window.querySelector('#fullPhoto');
        if (!fullPhoto) return;
        
        let filterValue = '';
        switch(filter) {
            case 'vintage':
                filterValue = 'sepia(0.5) contrast(1.2) brightness(0.9)';
                break;
            case 'bw':
                filterValue = 'grayscale(100%)';
                break;
            case 'dramatic':
                filterValue = 'contrast(1.5) saturate(1.2)';
                break;
            case 'warm':
                filterValue = 'sepia(0.3) saturate(1.3)';
                break;
            default:
                filterValue = 'none';
        }
        
        fullPhoto.style.filter = filterValue;
    }
    
    importPhotos() {
        console.log('Import photos clicked');
        // In a real app, this would open a file dialog
        alert('In a real app, this would open a file dialog to import photos!');
    }
    
    sharePhoto() {
        console.log('Share photo clicked');
        alert('Sharing feature would be implemented here!');
    }
    
    deletePhotos() {
        if (this.selectedPhotos.size === 0) {
            alert('Select photos to delete');
            return;
        }
        
        if (confirm(`Delete ${this.selectedPhotos.size} selected photo${this.selectedPhotos.size !== 1 ? 's' : ''}?`)) {
            // Remove from photos array
            this.photos = this.photos.filter(photo => !this.selectedPhotos.has(photo.id));
            
            // Clear selection
            this.selectedPhotos.clear();
            
            // Reload photos
            this.loadPhotos();
            
            console.log('Photos deleted');
        }
    }
    
    searchPhotos(query) {
        const grid = this.window.querySelector('#photosGrid');
        const items = grid.querySelectorAll('.photo-item');
        
        if (!query.trim()) {
            items.forEach(item => item.style.display = 'block');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        items.forEach(item => {
            const name = item.querySelector('.photo-name').textContent.toLowerCase();
            item.style.display = name.includes(lowerQuery) ? 'block' : 'none';
        });
    }
    
    // Window management
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Reset animation
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
        console.log('📸 Photos app opened');
        return true;
    }
    
    close() {
        this.window.style.display = 'none';
        this.isOpen = false;
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
            this.window.style.width = '1000px';
            this.window.style.height = '700px';
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

// Initialize Photos App
window.addEventListener('DOMContentLoaded', () => {
    window.PhotosApp = new PhotosApp();
}); 