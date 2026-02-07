// photos.js - BUILT FOR YOUR EXACT FILE STRUCTURE
class PhotosApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentView = 'grid';
        this.selectedPhotos = new Set();
        this.currentAlbum = 'all';
        this.currentPhotoIndex = 0;
        
        // Your exact album structure
        this.albums = {
            'all': { name: 'All Photos', count: 0, icon: 'fas fa-images' },
            'recents': { name: 'Recents', count: 9, icon: 'fas fa-clock' },
            'favorites': { name: 'Favorites', count: 4, icon: 'fas fa-heart' },
            'vacation': { name: 'Vacation', count: 4, icon: 'fas fa-umbrella-beach' },
            'nature': { name: 'Nature', count: 4, icon: 'fas fa-tree' },
            'portraits': { name: 'Portraits', count: 3, icon: 'fas fa-user' }
        };
        
        // ALL YOUR PHOTOS WITH EXACT PATHS
        this.photos = this.createPhotoDatabase();
        
        this.init();
    }
    
    // Creates the complete photo database with your exact file names
    createPhotoDatabase() {
        const allPhotos = [];
        let photoId = 1;
        
        // ====== RECENTS ALBUM ======
        // photos/recents/ - 9 photos
        const recentsFiles = ['10.jpg', '11.jpg', '12.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg'];
        recentsFiles.forEach(fileName => {
            allPhotos.push({
                id: `photo_${photoId++}`,
                name: `Recent ${fileName.split('.')[0]}`,
                fileName: fileName,
                folder: 'photos/recents/',
                album: 'recents',
                date: this.getRandomDate(),
                size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} MB`,
                dimensions: '4032 × 3024',
                location: 'Various',
                favorite: Math.random() > 0.7,
                url: 'photos/recents/' + fileName
            });
        });
        
        // ====== FAVORITES ALBUM ======
        // photos/favorites/ - 4 photos
        const favoritesFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
        favoritesFiles.forEach(fileName => {
            allPhotos.push({
                id: `photo_${photoId++}`,
                name: `Favorite ${fileName.split('.')[0]}`,
                fileName: fileName,
                folder: 'photos/favorites/',
                album: 'favorites',
                date: this.getRandomDate(),
                size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} MB`,
                dimensions: '4032 × 3024',
                location: 'Special Moments',
                favorite: true, // All are favorites!
                url: 'photos/favorites/' + fileName
            });
        });
        
        // ====== VACATION ALBUM ======
        // photos/albums/vacation/ - 4 photos
        const vacationFiles = ['12.jpg', '3.jpg', '4.jpg', '5.jpg'];
        vacationFiles.forEach(fileName => {
            allPhotos.push({
                id: `photo_${photoId++}`,
                name: `Vacation ${fileName.split('.')[0]}`,
                fileName: fileName,
                folder: 'photos/albums/vacation/',
                album: 'vacation',
                date: this.getRandomDate(),
                size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} MB`,
                dimensions: '4032 × 3024',
                location: 'Beach Resort',
                favorite: Math.random() > 0.7,
                url: 'photos/albums/vacation/' + fileName
            });
        });
        
        // ====== NATURE ALBUM ======
        // photos/albums/nature/ - 4 photos
        const natureFiles = ['1.jpg', '11.jpg', '2.jpg', '8.jpg'];
        natureFiles.forEach(fileName => {
            allPhotos.push({
                id: `photo_${photoId++}`,
                name: `Nature ${fileName.split('.')[0]}`,
                fileName: fileName,
                folder: 'photos/albums/nature/',
                album: 'nature',
                date: this.getRandomDate(),
                size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} MB`,
                dimensions: '4032 × 3024',
                location: 'Forest & Mountains',
                favorite: Math.random() > 0.7,
                url: 'photos/albums/nature/' + fileName
            });
        });
        
        // ====== PORTRAITS ALBUM ======
        // photos/albums/portraits/ - 3 photos
        const portraitsFiles = ['10.jpg', '7.jpg', '9.jpg'];
        portraitsFiles.forEach(fileName => {
            allPhotos.push({
                id: `photo_${photoId++}`,
                name: `Portrait ${fileName.split('.')[0]}`,
                fileName: fileName,
                folder: 'photos/albums/portraits/',
                album: 'portraits',
                date: this.getRandomDate(),
                size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} MB`,
                dimensions: '4032 × 3024',
                location: 'Studio',
                favorite: Math.random() > 0.7,
                url: 'photos/albums/portraits/' + fileName
            });
        });
        
        console.log(`✅ Created database with ${allPhotos.length} photos from your folders`);
        return allPhotos;
    }
    
    getRandomDate() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[Math.floor(Math.random() * months.length)];
        const day = Math.floor(Math.random() * 28) + 1;
        const year = 2024;
        return `${month} ${day}, ${year}`;
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('📸 Photos App initialized with your exact photos');
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
                        <div class="sidebar-item active" data-view="all">
                            <i class="fas fa-images"></i>
                            <span>All Photos</span>
                            <span class="count">${this.photos.length}</span>
                        </div>
                        <div class="sidebar-item" data-view="recents">
                            <i class="fas fa-clock"></i>
                            <span>Recents</span>
                            <span class="count">9</span>
                        </div>
                        <div class="sidebar-item" data-view="favorites">
                            <i class="fas fa-heart"></i>
                            <span>Favorites</span>
                            <span class="count">4</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-section albums-section">
                        <div class="sidebar-header">
                            <h3>Albums</h3>
                        </div>
                        
                        <div class="album-item" data-album="vacation">
                            <div class="album-thumb" style="background: linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%);">
                                <i class="fas fa-umbrella-beach"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Vacation</div>
                                <div class="album-count">4 photos</div>
                            </div>
                        </div>
                        
                        <div class="album-item" data-album="nature">
                            <div class="album-thumb" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                                <i class="fas fa-tree"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Nature</div>
                                <div class="album-count">4 photos</div>
                            </div>
                        </div>
                        
                        <div class="album-item" data-album="portraits">
                            <div class="album-thumb" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="album-info">
                                <div class="album-name">Portraits</div>
                                <div class="album-count">3 photos</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-section" style="margin-top: auto; padding-top: 20px; border-top: 1px solid #404040;">
                        <button class="sidebar-item" id="refreshBtnSidebar" style="color: #34C759;">
                            <i class="fas fa-sync-alt"></i>
                            <span>Refresh Library</span>
                        </button>
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
                        
                        <button class="toolbar-btn" id="slideshowBtn">
                            <i class="fas fa-play"></i>
                            Slideshow
                        </button>
                        
                        <button class="toolbar-btn" id="addToAlbumBtn">
                            <i class="fas fa-folder-plus"></i>
                            Add to Album
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
                            <input type="text" class="search-box" placeholder="Search by name (e.g., 'Nature 1')..." id="searchInput">
                        </div>
                    </div>
                    
                    <!-- Photos Grid View -->
                    <div class="photos-grid-container" id="gridView">
                        <div class="grid-header">
                            <h2 class="grid-title" id="gridTitle">All Photos</h2>
                            <p class="grid-subtitle" id="gridSubtitle">${this.photos.length} photos from your library</p>
                        </div>
                        
                        <div class="photos-grid" id="photosGrid">
                            <!-- Photos will load here -->
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
                                <span class="photo-title" id="photoTitle">Photo</span>
                                <span class="photo-counter" id="photoCounter" style="margin-left: 10px; color: #999; font-size: 12px;">1 of ${this.photos.length}</span>
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
                                <button class="toolbar-btn" id="downloadBtn">
                                    <i class="fas fa-external-link-alt"></i>
                                    Open
                                </button>
                            </div>
                        </div>
                        
                        <div class="photo-view-content">
                            <div class="photo-loading" id="photoLoading" style="color: #666; text-align: center; padding: 40px;">
                                <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
                                <p>Loading your photo...</p>
                            </div>
                            <img src="" alt="Photo" class="photo-full" id="fullPhoto" style="display: none;"
                                 onerror="this.onerror=null; this.style.display='none'; document.getElementById('photoLoading').innerHTML='<i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size:48px; color:#FF9500; margin-bottom:20px;\\'></i><h3>Photo not found</h3><p>Check if file exists: ' + this.src + '</p>';">
                        </div>
                    </div>
                </div>
                
                <!-- Info Panel -->
                <div class="info-panel" id="infoPanel" style="display: none;">
                    <div class="info-section">
                        <h4>Photo Details</h4>
                        <div class="info-item">
                            <div class="info-label">File Name</div>
                            <div class="info-value" id="infoFileName">1.jpg</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Folder Path</div>
                            <div class="info-value" id="infoFolder" style="font-size: 11px; word-break: break-all;">photos/recents/</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Album</div>
                            <div class="info-value" id="infoAlbum">Recents</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date Added</div>
                            <div class="info-value" id="infoDate">Jan 15, 2024</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">File Size</div>
                            <div class="info-value" id="infoSize">3.2 MB</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value" id="infoStatus" style="color: #34C759;">✓ Available</div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Quick Actions</h4>
                        <button class="info-action-btn" id="revealInFolderBtn">
                            <i class="fas fa-folder-open"></i>
                            Reveal in Folder
                        </button>
                        <button class="info-action-btn" id="copyPathBtn">
                            <i class="fas fa-copy"></i>
                            Copy File Path
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="window-statusbar">
                <span id="statusInfo">Ready - ${this.photos.length} photos loaded</span>
                <span style="margin-left: auto; color: #999; font-size: 11px;">
                    <i class="fas fa-hdd"></i> Local Storage
                </span>
            </div>
        `;
        
        document.body.appendChild(this.window);
        this.loadPhotos(); // Load photos immediately
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
        this.window.querySelector('#slideshowBtn').addEventListener('click', () => this.startSlideshow());
        this.window.querySelector('#addToAlbumBtn').addEventListener('click', () => this.addToAlbum());
        this.window.querySelector('#shareBtn').addEventListener('click', () => this.sharePhoto());
        this.window.querySelector('#deleteBtn').addEventListener('click', () => this.deletePhotos());
        this.window.querySelector('#backBtn').addEventListener('click', () => this.showGridView());
        this.window.querySelector('#favoriteBtn').addEventListener('click', () => this.toggleFavorite());
        this.window.querySelector('#infoBtn').addEventListener('click', () => this.toggleInfoPanel());
        this.window.querySelector('#downloadBtn').addEventListener('click', () => this.openPhoto());
        this.window.querySelector('#refreshBtnSidebar').addEventListener('click', () => this.refreshLibrary());
        this.window.querySelector('#revealInFolderBtn').addEventListener('click', () => this.revealInFolder());
        this.window.querySelector('#copyPathBtn').addEventListener('click', () => this.copyFilePath());
        
        // Photo navigation
        this.window.querySelector('#prevBtn').addEventListener('click', () => this.prevPhoto());
        this.window.querySelector('#nextBtn').addEventListener('click', () => this.nextPhoto());
        
        // Search
        this.window.querySelector('#searchInput').addEventListener('input', (e) => {
            this.searchPhotos(e.target.value);
        });
        
        // Make window draggable
        this.makeDraggable();
    }
    
    loadPhotos() {
        const grid = this.window.querySelector('#photosGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filteredPhotos = this.getFilteredPhotos();
        
        if (filteredPhotos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                    <i class="fas fa-images" style="font-size: 48px; margin-bottom: 20px; color: #404040;"></i>
                    <h3>No photos found</h3>
                    <p>Try selecting a different album or check your photos folder</p>
                </div>
            `;
            return;
        }
        
        filteredPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.dataset.id = photo.id;
            photoElement.dataset.index = index;
            
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="${photo.name}" class="photo-image" 
                     onerror="this.style.opacity='0.5'; this.nextElementSibling.innerHTML='<span style=\\'color:#FF3B30; font-size:11px;\\'>Missing: ${photo.fileName}</span>';">
                <div class="photo-info">
                    <h4 class="photo-name">${photo.name}</h4>
                    <p class="photo-date">${photo.date} • ${photo.album}</p>
                </div>
                <div class="photo-actions">
                    <button class="action-btn favorite-btn" title="${photo.favorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                        <i class="${photo.favorite ? 'fas' : 'far'} fa-heart" style="${photo.favorite ? 'color: #FF3B30;' : ''}"></i>
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
        
        this.updateGridHeader();
    }
    
    getFilteredPhotos() {
        if (this.currentAlbum === 'all') return this.photos;
        return this.photos.filter(photo => photo.album === this.currentAlbum);
    }
    
    updateGridHeader() {
        const filteredPhotos = this.getFilteredPhotos();
        const title = this.window.querySelector('#gridTitle');
        const subtitle = this.window.querySelector('#gridSubtitle');
        
        if (title && subtitle) {
            title.textContent = this.albums[this.currentAlbum]?.name || 'Photos';
            subtitle.textContent = `${filteredPhotos.length} photo${filteredPhotos.length !== 1 ? 's' : ''} from your library`;
        }
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
        this.window.querySelector('#infoPanel').style.display = 'none';
        
        // Show loading
        const loading = this.window.querySelector('#photoLoading');
        const fullPhoto = this.window.querySelector('#fullPhoto');
        loading.style.display = 'block';
        fullPhoto.style.display = 'none';
        
        // Load photo
        fullPhoto.src = photo.url;
        fullPhoto.alt = photo.name;
        
        // Update title and counter
        this.window.querySelector('#photoTitle').textContent = photo.name;
        this.window.querySelector('#photoCounter').textContent = `${index + 1} of ${filteredPhotos.length}`;
        
        // Update favorite button
        const favoriteBtn = this.window.querySelector('#favoriteBtn');
        favoriteBtn.innerHTML = `<i class="${photo.favorite ? 'fas' : 'far'} fa-heart"></i> ${photo.favorite ? 'Favorited' : 'Favorite'}`;
        
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
            
            // Update UI in grid
            const photoElement = this.window.querySelector(`[data-id="${photoId}"]`);
            if (photoElement) {
                const heartIcon = photoElement.querySelector('.favorite-btn i');
                heartIcon.className = photo.favorite ? 'fas fa-heart' : 'far fa-heart';
                heartIcon.style.color = photo.favorite ? '#FF3B30' : '';
                photoElement.querySelector('.favorite-btn').title = 
                    photo.favorite ? 'Remove from Favorites' : 'Add to Favorites';
            }
            
            // Update favorites count
            const favoritesCount = this.photos.filter(p => p.favorite).length;
            this.albums.favorites.count = favoritesCount;
            
            const favoritesItem = this.window.querySelector('[data-view="favorites"] .count');
            if (favoritesItem) {
                favoritesItem.textContent = favoritesCount;
            }
            
            // Update current view if needed
            if (this.currentAlbum === 'favorites') {
                this.loadPhotos();
            }
            
            // Update favorite button in single view
            if (this.currentView === 'single') {
                const currentPhoto = this.getFilteredPhotos()[this.currentPhotoIndex];
                if (currentPhoto && currentPhoto.id === photoId) {
                    const favoriteBtn = this.window.querySelector('#favoriteBtn');
                    favoriteBtn.innerHTML = `<i class="${photo.favorite ? 'fas' : 'far'} fa-heart"></i> ${photo.favorite ? 'Favorited' : 'Favorite'}`;
                }
            }
            
            // Update status bar
            this.window.querySelector('#statusInfo').textContent = 
                photo.favorite ? `✓ Added "${photo.name}" to Favorites` : `✓ Removed "${photo.name}" from Favorites`;
        }
    }
    
    toggleFavorite() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                this.togglePhotoFavorite(photo.id);
            }
        }
    }
    
    showPhotoInfo(photo) {
        this.updateInfoPanel(photo);
        this.window.querySelector('#infoPanel').style.display = 'block';
    }
    
    updateInfoPanel(photo) {
        this.window.querySelector('#infoFileName').textContent = photo.fileName;
        this.window.querySelector('#infoFolder').textContent = photo.folder;
        this.window.querySelector('#infoAlbum').textContent = this.albums[photo.album]?.name || photo.album;
        this.window.querySelector('#infoDate').textContent = photo.date;
        this.window.querySelector('#infoSize').textContent = photo.size;
        this.window.querySelector('#infoStatus').textContent = '✓ Available';
        this.window.querySelector('#infoStatus').style.color = '#34C759';
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
    
    // ====== APP FUNCTIONALITY ======
    
    startSlideshow() {
        const filteredPhotos = this.getFilteredPhotos();
        if (filteredPhotos.length === 0) {
            alert('No photos to show in slideshow!');
            return;
        }
        
        alert(`Starting slideshow with ${filteredPhotos.length} photos from ${this.albums[this.currentAlbum].name}`);
        // In a full implementation, this would start an actual slideshow
    }
    
    addToAlbum() {
        if (this.selectedPhotos.size === 0) {
            alert('Select photos first (click on them)');
            return;
        }
        
        alert(`Would add ${this.selectedPhotos.size} photos to an album`);
    }
    
    sharePhoto() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                alert(`Sharing: ${photo.name} (${photo.fileName})`);
            }
        } else if (this.selectedPhotos.size > 0) {
            alert(`Sharing ${this.selectedPhotos.size} selected photos`);
        } else {
            alert('Select photos or open a photo to share');
        }
    }
    
    openPhoto() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                // Try to open in new tab
                window.open(photo.url, '_blank');
                this.window.querySelector('#statusInfo').textContent = `Opened ${photo.name} in new tab`;
            }
        }
    }
    
    deletePhotos() {
        if (this.selectedPhotos.size === 0) {
            alert('Select photos to delete (click on them in grid view)');
            return;
        }
        
        if (confirm(`Permanently delete ${this.selectedPhotos.size} selected photo${this.selectedPhotos.size !== 1 ? 's' : ''}?`)) {
            // Remove from photos array
            this.photos = this.photos.filter(photo => !this.selectedPhotos.has(photo.id));
            
            // Update album counts
            this.updateAlbumCounts();
            
            // Clear selection
            this.selectedPhotos.clear();
            
            // Reload photos
            this.loadPhotos();
            
            this.window.querySelector('#statusInfo').textContent = `Deleted ${this.selectedPhotos.size} photos`;
            console.log('Photos deleted from database');
        }
    }
    
    updateAlbumCounts() {
        // Recalculate counts
        const counts = {
            all: this.photos.length,
            recents: this.photos.filter(p => p.album === 'recents').length,
            favorites: this.photos.filter(p => p.favorite).length,
            vacation: this.photos.filter(p => p.album === 'vacation').length,
            nature: this.photos.filter(p => p.album === 'nature').length,
            portraits: this.photos.filter(p => p.album === 'portraits').length
        };
        
        // Update UI
        Object.keys(counts).forEach(albumId => {
            const countElement = this.window.querySelector(`[data-view="${albumId}"] .count`);
            if (countElement) {
                countElement.textContent = counts[albumId];
            }
            
            const albumItem = this.window.querySelector(`[data-album="${albumId}"] .album-count`);
            if (albumItem && albumId !== 'all' && albumId !== 'favorites' && albumId !== 'recents') {
                albumItem.textContent = `${counts[albumId]} photo${counts[albumId] !== 1 ? 's' : ''}`;
            }
        });
        
        this.albums.all.count = counts.all;
        this.albums.recents.count = counts.recents;
        this.albums.favorites.count = counts.favorites;
        this.albums.vacation.count = counts.vacation;
        this.albums.nature.count = counts.nature;
        this.albums.portraits.count = counts.portraits;
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
    
    refreshLibrary() {
        // Simulate refreshing
        this.window.querySelector('#statusInfo').textContent = 'Refreshing photo library...';
        setTimeout(() => {
            this.window.querySelector('#statusInfo').textContent = `Ready - ${this.photos.length} photos loaded`;
            alert('Photo library refreshed!');
        }, 800);
    }
    
    revealInFolder() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                alert(`Would reveal in folder: ${photo.folder}`);
            }
        }
    }
    
    copyFilePath() {
        if (this.currentView === 'single') {
            const filteredPhotos = this.getFilteredPhotos();
            const photo = filteredPhotos[this.currentPhotoIndex];
            if (photo) {
                // Copy to clipboard
                navigator.clipboard.writeText(photo.folder + photo.fileName).then(() => {
                    this.window.querySelector('#statusInfo').textContent = `Copied path: ${photo.fileName}`;
                });
            }
        }
    }
    
    // ====== WINDOW MANAGEMENT ======
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Reset animation
        this.window.style.animation = 'none';
        setTimeout(() => {
            this.window.style.animation = 'windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
        }, 10);
        
        console.log('📸 Photos app opened with your exact file structure');
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