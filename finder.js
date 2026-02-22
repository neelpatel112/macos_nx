// finder.js - macOS Finder Clone (FIXED VERSION)
class FinderApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentView = 'icon';
        this.currentPath = ['Macintosh HD', 'Users', 'Guest'];
        this.selectedItems = new Set();
        this.clipboard = [];
        this.clipboardOperation = null;
        this.searchQuery = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.showPreview = false;
        this.showTags = true;
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        this.loadInitialContent();
        console.log('📁 Finder initialized successfully');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window finder-window';
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 1000px;
            height: 700px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
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
                <div class="window-title">Finder</div>
            </div>
            
            <div class="finder-container">
                <div class="finder-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-title">Favorites</div>
                        <button class="sidebar-item active" data-path="home">
                            <i class="fas fa-home icon-home"></i>
                            <span>Home</span>
                            <span class="badge favorites">★</span>
                        </button>
                        <button class="sidebar-item" data-path="desktop">
                            <i class="fas fa-desktop icon-desktop"></i>
                            <span>Desktop</span>
                        </button>
                        <button class="sidebar-item" data-path="documents">
                            <i class="fas fa-folder icon-folder"></i>
                            <span>Documents</span>
                            <span class="badge">12</span>
                        </button>
                        <button class="sidebar-item" data-path="downloads">
                            <i class="fas fa-download icon-downloads"></i>
                            <span>Downloads</span>
                            <span class="badge">3</span>
                        </button>
                        <button class="sidebar-item" data-path="pictures">
                            <i class="fas fa-images icon-image"></i>
                            <span>Pictures</span>
                        </button>
                        <button class="sidebar-item" data-path="music">
                            <i class="fas fa-music icon-music"></i>
                            <span>Music</span>
                        </button>
                        <button class="sidebar-item" data-path="movies">
                            <i class="fas fa-film icon-video"></i>
                            <span>Movies</span>
                        </button>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-title">iCloud</div>
                        <button class="sidebar-item" data-path="icloud">
                            <i class="fas fa-cloud icon-cloud"></i>
                            <span>iCloud Drive</span>
                            <span class="badge icloud">iCloud</span>
                        </button>
                        <button class="sidebar-item" data-path="shared">
                            <i class="fas fa-users icon-users"></i>
                            <span>Shared</span>
                        </button>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-title">Locations</div>
                        <button class="sidebar-item" data-path="macintosh-hd">
                            <i class="fas fa-hdd icon-disk"></i>
                            <span>Macintosh HD</span>
                        </button>
                        <button class="sidebar-item" data-path="network">
                            <i class="fas fa-network-wired"></i>
                            <span>Network</span>
                        </button>
                        <button class="sidebar-item" data-path="trash">
                            <i class="fas fa-trash icon-trash"></i>
                            <span>Trash</span>
                            <span class="badge">7</span>
                        </button>
                    </div>
                    
                    ${this.showTags ? `
                    <div class="sidebar-section sidebar-tags">
                        <div class="sidebar-title">Tags</div>
                        <div class="tag-item" data-tag="red">
                            <div class="tag-color" style="background: #FF3B30;"></div>
                            <div class="tag-name">Important</div>
                            <div class="tag-count">5</div>
                        </div>
                        <div class="tag-item" data-tag="orange">
                            <div class="tag-color" style="background: #FF9500;"></div>
                            <div class="tag-name">Work</div>
                            <div class="tag-count">8</div>
                        </div>
                        <div class="tag-item" data-tag="yellow">
                            <div class="tag-color" style="background: #FFD60A;"></div>
                            <div class="tag-name">Personal</div>
                            <div class="tag-count">3</div>
                        </div>
                        <div class="tag-item" data-tag="green">
                            <div class="tag-color" style="background: #34C759;"></div>
                            <div class="tag-name">Projects</div>
                            <div class="tag-count">12</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="finder-main">
                    <div class="finder-toolbar">
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Back" id="backBtn">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="toolbar-btn" title="Forward" id="forwardBtn">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            <button class="toolbar-btn" title="Up" id="upBtn">
                                <i class="fas fa-chevron-up"></i>
                            </button>
                        </div>
                        
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="View" id="viewBtn">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="toolbar-btn" title="Arrange" id="arrangeBtn">
                                <i class="fas fa-sort"></i>
                            </button>
                            <button class="toolbar-btn" title="Share" id="shareBtn">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="toolbar-btn" title="Tags" id="tagsBtn">
                                <i class="fas fa-tag"></i>
                            </button>
                        </div>
                        
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="New Folder" id="newFolderBtn">
                                <i class="fas fa-folder-plus"></i>
                            </button>
                            <button class="toolbar-btn dropdown" title="Actions" id="actionsBtn">
                                <i class="fas fa-ellipsis"></i>
                            </button>
                        </div>
                        
                        <div class="path-bar" id="pathBar"></div>
                        
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="search-input" placeholder="Search" id="searchInput">
                        </div>
                        
                        <div class="view-controls">
                            <button class="view-btn ${this.currentView === 'icon' ? 'active' : ''}" data-view="icon" title="Icon View">
                                <i class="fas fa-th-large"></i>
                            </button>
                            <button class="view-btn ${this.currentView === 'list' ? 'active' : ''}" data-view="list" title="List View">
                                <i class="fas fa-list"></i>
                            </button>
                            <button class="view-btn ${this.currentView === 'column' ? 'active' : ''}" data-view="column" title="Column View">
                                <i class="fas fa-columns"></i>
                            </button>
                        </div>
                        
                        <button class="toolbar-btn" title="Preview" id="previewToggleBtn">
                            <i class="fas fa-sidebar"></i>
                        </button>
                    </div>
                    
                    <div class="finder-content">
                        <div class="column-view ${this.currentView === 'column' ? 'active' : ''}" id="columnView">
                            <div class="column" data-level="0">
                                <div class="column-header">Macintosh HD</div>
                                <div class="column-items" data-path="macintosh-hd"></div>
                            </div>
                        </div>
                        
                        <div class="icon-view ${this.currentView === 'icon' ? 'active' : ''}" id="iconView">
                            <div class="icon-grid" id="iconGrid"></div>
                        </div>
                        
                        <div class="list-view ${this.currentView === 'list' ? 'active' : ''}" id="listView">
                            <div class="list-header">
                                <div class="list-column" data-sort="icon">Name <i class="fas fa-sort"></i></div>
                                <div class="list-column" data-sort="date">Date Modified <i class="fas fa-sort"></i></div>
                                <div class="list-column" data-sort="size">Size <i class="fas fa-sort"></i></div>
                                <div class="list-column" data-sort="kind">Kind <i class="fas fa-sort"></i></div>
                            </div>
                            <div class="list-items" id="listItems"></div>
                        </div>
                    </div>
                    
                    <div class="preview-panel ${this.showPreview ? 'active' : ''}" id="previewPanel">
                        <div class="preview-header">
                            <h3 class="preview-title" id="previewTitle">No Selection</h3>
                            <p class="preview-subtitle" id="previewSubtitle">Select an item to preview</p>
                        </div>
                        
                        <div class="preview-image" id="previewImage">
                            <i class="fas fa-file"></i>
                        </div>
                        
                        <div class="preview-info">
                            <div class="info-section">
                                <div class="info-title">Information</div>
                                <div class="info-item">
                                    <span class="info-label">Kind:</span>
                                    <span class="info-value" id="infoKind">—</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Size:</span>
                                    <span class="info-value" id="infoSize">—</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Created:</span>
                                    <span class="info-value" id="infoCreated">—</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Modified:</span>
                                    <span class="info-value" id="infoModified">—</span>
                                </div>
                            </div>
                            
                            <div class="info-section">
                                <div class="info-title">More Info</div>
                                <div class="info-item">
                                    <span class="info-label">Where:</span>
                                    <span class="info-value" id="infoWhere">—</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Tags:</span>
                                    <span class="info-value" id="infoTags">—</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="preview-actions">
                            <button class="action-btn" id="previewOpenBtn">
                                <i class="fas fa-external-link-alt"></i>
                                Open
                            </button>
                            <button class="action-btn" id="previewShareBtn">
                                <i class="fas fa-share-alt"></i>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="finder-statusbar">
                <div class="status-info">
                    <span id="itemCount">0 items</span>
                    <span id="selectedCount">0 selected</span>
                    <span id="diskSpace">45.2 GB available</span>
                </div>
                <div>
                    <button class="toolbar-btn" style="font-size: 11px; padding: 2px 8px;" id="quickLookBtn">
                        <i class="fas fa-search"></i>
                        Quick Look
                    </button>
                </div>
            </div>
            
            <div class="context-menu" id="contextMenu">
                <div class="menu-item" data-action="open">
                    <i class="fas fa-folder-open"></i>
                    Open
                </div>
                <div class="menu-item" data-action="quicklook">
                    <i class="fas fa-search"></i>
                    Quick Look
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item" data-action="cut">
                    <i class="fas fa-cut"></i>
                    Cut
                </div>
                <div class="menu-item" data-action="copy">
                    <i class="fas fa-copy"></i>
                    Copy
                </div>
                <div class="menu-item" data-action="paste">
                    <i class="fas fa-paste"></i>
                    Paste
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item" data-action="rename">
                    <i class="fas fa-i-cursor"></i>
                    Rename
                </div>
                <div class="menu-item" data-action="duplicate">
                    <i class="fas fa-clone"></i>
                    Duplicate
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item" data-action="compress">
                    <i class="fas fa-file-archive"></i>
                    Compress
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item" data-action="trash" style="color: #FF3B30;">
                    <i class="fas fa-trash"></i>
                    Move to Trash
                </div>
            </div>
            
            <div class="drag-overlay" id="dragOverlay">
                <i class="fas fa-arrow-down"></i>
                <span style="margin-left: 10px;">Drop to move here</span>
            </div>
            
            <div class="quick-look" id="quickLook">
                <div class="quick-look-header">
                    <h2 class="quick-look-title" id="quickLookTitle">Quick Look</h2>
                    <button class="toolbar-btn" id="closeQuickLookBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="quick-look-content" id="quickLookContent"></div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        this.updatePathBar();
        this.loadFolder('home');
    }
    
    setupEventListeners() {
        this.window.querySelector('.window-close')?.addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize')?.addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom')?.addEventListener('click', () => this.zoom());
        
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const path = e.currentTarget.dataset.path;
                this.navigateTo(path);
            });
        });
        
        this.window.querySelector('#backBtn')?.addEventListener('click', () => this.goBack());
        this.window.querySelector('#forwardBtn')?.addEventListener('click', () => this.goForward());
        this.window.querySelector('#upBtn')?.addEventListener('click', () => this.goUp());
        this.window.querySelector('#newFolderBtn')?.addEventListener('click', () => this.createNewFolder());
        this.window.querySelector('#viewBtn')?.addEventListener('click', () => this.showViewOptions());
        this.window.querySelector('#arrangeBtn')?.addEventListener('click', () => this.showArrangeOptions());
        this.window.querySelector('#shareBtn')?.addEventListener('click', () => this.shareSelected());
        this.window.querySelector('#tagsBtn')?.addEventListener('click', () => this.toggleTags());
        this.window.querySelector('#actionsBtn')?.addEventListener('click', () => this.showActionsMenu());
        this.window.querySelector('#previewToggleBtn')?.addEventListener('click', () => this.togglePreview());
        this.window.querySelector('#quickLookBtn')?.addEventListener('click', () => this.showQuickLook());
        this.window.querySelector('#closeQuickLookBtn')?.addEventListener('click', () => this.hideQuickLook());
        
        this.window.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
        
        const searchInput = this.window.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterContent();
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.searchQuery = '';
                    this.filterContent();
                }
            });
        }
        
        this.window.querySelectorAll('.list-column').forEach(col => {
            col.addEventListener('click', (e) => {
                const sortBy = e.currentTarget.dataset.sort;
                this.sortContent(sortBy);
            });
        });
        
        document.addEventListener('click', () => this.hideContextMenu());
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.finder-content') || e.target.closest('.sidebar-item')) {
                e.preventDefault();
                this.showContextMenu(e.clientX, e.clientY);
            }
        });
        
        this.setupKeyboardShortcuts();
        this.setupDragAndDrop();
        this.makeDraggable();
    }
    
    loadInitialContent() {
        console.log('Loading initial content...');
        this.loadFolder('home');
    }
    
    getFolderContents(folder) {
        const folders = {
            'home': {
                name: 'Home',
                path: ['Users', 'Guest'],
                items: [
                    { name: 'Desktop', type: 'folder', icon: 'desktop', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Documents', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: ['Work'] },
                    { name: 'Downloads', type: 'folder', icon: 'downloads', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Pictures', type: 'folder', icon: 'image', size: '—', date: 'Today', kind: 'Folder', tags: ['Personal'] },
                    { name: 'Music', type: 'folder', icon: 'music', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Movies', type: 'folder', icon: 'video', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Applications', type: 'folder', icon: 'application', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Public', type: 'folder', icon: 'users', size: '—', date: 'Today', kind: 'Folder', tags: [] }
                ]
            },
            'desktop': {
                name: 'Desktop',
                path: ['Users', 'Guest', 'Desktop'],
                items: [
                    { name: 'Screenshot.jpg', type: 'image', icon: 'image', size: '2.4 MB', date: 'Today', kind: 'JPEG image', tags: [] },
                    { name: 'Project Report.pdf', type: 'document', icon: 'document', size: '1.8 MB', date: 'Yesterday', kind: 'PDF document', tags: ['Work', 'Important'] },
                    { name: 'Presentation.key', type: 'document', icon: 'document', size: '5.2 MB', date: '2 days ago', kind: 'Keynote presentation', tags: ['Work'] },
                    { name: 'Vacation Photos', type: 'folder', icon: 'folder', size: '—', date: '1 week ago', kind: 'Folder', tags: ['Personal'] },
                    { name: 'To Do.txt', type: 'document', icon: 'document', size: '2 KB', date: 'Today', kind: 'Plain text', tags: [] },
                    { name: 'System Preferences', type: 'application', icon: 'application', size: '15.2 MB', date: 'Today', kind: 'Application', tags: [] }
                ]
            },
            'documents': {
                name: 'Documents',
                path: ['Users', 'Guest', 'Documents'],
                items: [
                    { name: 'Work', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: ['Work'] },
                    { name: 'Personal', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: ['Personal'] },
                    { name: 'Resume.pdf', type: 'document', icon: 'document', size: '245 KB', date: 'Yesterday', kind: 'PDF document', tags: ['Important'] },
                    { name: 'Budget.xlsx', type: 'document', icon: 'document', size: '45 KB', date: '3 days ago', kind: 'Excel spreadsheet', tags: ['Work'] },
                    { name: 'Notes.md', type: 'document', icon: 'document', size: '12 KB', date: 'Today', kind: 'Markdown', tags: [] },
                    { name: 'Archive.zip', type: 'archive', icon: 'archive', size: '52 MB', date: '1 week ago', kind: 'Zip archive', tags: [] }
                ]
            },
            'downloads': {
                name: 'Downloads',
                path: ['Users', 'Guest', 'Downloads'],
                items: [
                    { name: 'Chrome.dmg', type: 'application', icon: 'application', size: '85 MB', date: 'Today', kind: 'Disk image', tags: [] },
                    { name: 'Wallpaper.jpg', type: 'image', icon: 'image', size: '3.1 MB', date: 'Today', kind: 'JPEG image', tags: [] },
                    { name: 'Song.mp3', type: 'music', icon: 'music', size: '4.2 MB', date: 'Yesterday', kind: 'MP3 audio', tags: [] },
                    { name: 'Receipt.pdf', type: 'document', icon: 'document', size: '125 KB', date: '2 days ago', kind: 'PDF document', tags: [] }
                ]
            },
            'pictures': {
                name: 'Pictures',
                path: ['Users', 'Guest', 'Pictures'],
                items: [
                    { name: 'Screenshot 2024-01-15.png', type: 'image', icon: 'image', size: '1.8 MB', date: 'Today', kind: 'PNG image', tags: [] },
                    { name: 'Vacation', type: 'folder', icon: 'folder', size: '—', date: '1 week ago', kind: 'Folder', tags: ['Personal'] },
                    { name: 'Profile.jpg', type: 'image', icon: 'image', size: '450 KB', date: '2 weeks ago', kind: 'JPEG image', tags: [] },
                    { name: 'Wallpapers', type: 'folder', icon: 'folder', size: '—', date: '1 month ago', kind: 'Folder', tags: [] }
                ]
            },
            'music': {
                name: 'Music',
                path: ['Users', 'Guest', 'Music'],
                items: [
                    { name: 'Playlists', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Artists', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Albums', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: [] },
                    { name: 'Songs', type: 'folder', icon: 'folder', size: '—', date: 'Today', kind: 'Folder', tags: [] }
                ]
            },
            'trash': {
                name: 'Trash',
                path: ['.Trash'],
                items: [
                    { name: 'Old Document.docx', type: 'document', icon: 'document', size: '1.2 MB', date: '2 weeks ago', kind: 'Word document', tags: [] },
                    { name: 'Temporary Files', type: 'folder', icon: 'folder', size: '—', date: '1 week ago', kind: 'Folder', tags: [] },
                    { name: 'Screenshot (old).png', type: 'image', icon: 'image', size: '2.1 MB', date: '1 month ago', kind: 'PNG image', tags: [] }
                ]
            }
        };
        
        return folders[folder] || folders['home'];
    }
    
    loadFolder(folderName) {
        const folder = this.getFolderContents(folderName);
        this.currentPath = folder.path;
        this.updatePathBar();
        this.updateSidebarSelection(folderName);
        
        let items = [...folder.items];
        
        if (this.searchQuery) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                item.kind.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
        
        items = this.sortItems(items, this.sortBy, this.sortOrder);
        
        this.window.querySelector('#itemCount').textContent = `${items.length} items`;
        this.window.querySelector('#selectedCount').textContent = `${this.selectedItems.size} selected`;
        
        this.selectedItems.clear();
        this.updatePreview();
        this.loadViewContent(items);
    }
    
    loadViewContent(items) {
        const iconGrid = this.window.querySelector('#iconGrid');
        const listItems = this.window.querySelector('#listItems');
        const columnView = this.window.querySelector('#columnView');
        
        if (iconGrid) iconGrid.innerHTML = '';
        if (listItems) listItems.innerHTML = '';
        if (columnView) columnView.innerHTML = '';
        
        if (items.length === 0) {
            this.showEmptyState();
            return;
        }
        
        switch(this.currentView) {
            case 'icon':
                this.loadIconView(items);
                break;
            case 'list':
                this.loadListView(items);
                break;
            case 'column':
                this.loadColumnView(items);
                break;
        }
    }
    
    loadIconView(items) {
        const grid = this.window.querySelector('#iconGrid');
        if (!grid) return;
        
        items.forEach((item, index) => {
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';
            iconItem.dataset.index = index;
            iconItem.dataset.type = item.type;
            iconItem.dataset.name = item.name;
            
            iconItem.innerHTML = `
                <div class="icon-container">
                    <i class="fas fa-${item.icon} icon-${item.type}"></i>
                </div>
                <div class="name">${item.name}</div>
            `;
            
            iconItem.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    this.clearSelection();
                }
                this.selectItem(index, iconItem);
            });
            
            iconItem.addEventListener('dblclick', () => {
                if (item.type === 'folder') {
                    this.navigateTo(item.name.toLowerCase());
                } else {
                    this.openItem(item);
                }
            });
            
            iconItem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!this.selectedItems.has(index)) {
                    this.clearSelection();
                    this.selectItem(index, iconItem);
                }
                this.showContextMenu(e.clientX, e.clientY);
            });
            
            grid.appendChild(iconItem);
        });
    }
    
    loadListView(items) {
        const listContainer = this.window.querySelector('#listItems');
        if (!listContainer) return;
        
        items.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.dataset.index = index;
            listItem.dataset.type = item.type;
            listItem.dataset.name = item.name;
            
            listItem.innerHTML = `
                <div class="list-icon">
                    <i class="fas fa-${item.icon} icon-${item.type}"></i>
                </div>
                <div class="list-name">${item.name}</div>
                <div class="list-date">${item.date}</div>
                <div class="list-size">${item.size}</div>
                <div class="list-kind">${item.kind}</div>
            `;
            
            listItem.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    this.clearSelection();
                }
                this.selectItem(index, listItem);
            });
            
            listItem.addEventListener('dblclick', () => {
                if (item.type === 'folder') {
                    this.navigateTo(item.name.toLowerCase());
                } else {
                    this.openItem(item);
                }
            });
            
            listItem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!this.selectedItems.has(index)) {
                    this.clearSelection();
                    this.selectItem(index, listItem);
                }
                this.showContextMenu(e.clientX, e.clientY);
            });
            
            listContainer.appendChild(listItem);
        });
    }
    
    loadColumnView(items) {
        const columnView = this.window.querySelector('#columnView');
        if (!columnView) return;
        
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.level = '0';
        
        const columnHeader = document.createElement('div');
        columnHeader.className = 'column-header';
        columnHeader.textContent = 'Macintosh HD';
        
        const columnItems = document.createElement('div');
        columnItems.className = 'column-items';
        columnItems.dataset.path = 'macintosh-hd';
        
        items.forEach((item, index) => {
            const columnItem = document.createElement('div');
            columnItem.className = 'column-item';
            columnItem.dataset.index = index;
            columnItem.dataset.type = item.type;
            columnItem.dataset.name = item.name;
            
            columnItem.innerHTML = `
                <div class="icon">
                    <i class="fas fa-${item.icon} icon-${item.type}"></i>
                </div>
                <div class="name">${item.name}</div>
                <div class="date">${item.date}</div>
            `;
            
            columnItem.addEventListener('click', () => {
                this.clearSelection();
                this.selectItem(index, columnItem);
                
                if (item.type === 'folder') {
                    this.showNextColumn(item);
                }
            });
            
            columnItem.addEventListener('dblclick', () => {
                if (item.type === 'folder') {
                    this.navigateTo(item.name.toLowerCase());
                } else {
                    this.openItem(item);
                }
            });
            
            columnItems.appendChild(columnItem);
        });
        
        column.appendChild(columnHeader);
        column.appendChild(columnItems);
        columnView.appendChild(column);
    }
    
    showEmptyState() {
        const emptyHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>Empty Folder</h3>
                <p>This folder contains no items.</p>
            </div>
        `;
        
        const iconGrid = this.window.querySelector('#iconGrid');
        const listItems = this.window.querySelector('#listItems');
        
        if (iconGrid) iconGrid.innerHTML = emptyHTML;
        if (listItems) listItems.innerHTML = emptyHTML;
    }
    
    selectItem(index, element) {
        if (this.selectedItems.has(index)) {
            this.selectedItems.delete(index);
            element.classList.remove('selected');
        } else {
            this.selectedItems.add(index);
            element.classList.add('selected');
        }
        
        this.updateSelectionCount();
        this.updatePreview();
    }
    
    clearSelection() {
        this.selectedItems.clear();
        
        this.window.querySelectorAll('.icon-item.selected, .list-item.selected, .column-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.updateSelectionCount();
        this.updatePreview();
    }
    
    updateSelectionCount() {
        const selectedCount = this.window.querySelector('#selectedCount');
        if (selectedCount) {
            selectedCount.textContent = `${this.selectedItems.size} selected`;
        }
    }
    
    updatePreview() {
        const panel = this.window.querySelector('#previewPanel');
        if (!panel) return;
        
        const selectedCount = this.selectedItems.size;
        
        if (selectedCount === 0) {
            this.window.querySelector('#previewTitle').textContent = 'No Selection';
            this.window.querySelector('#previewSubtitle').textContent = 'Select an item to preview';
            this.window.querySelector('#previewImage').innerHTML = '<i class="fas fa-file"></i>';
            
            ['Kind', 'Size', 'Created', 'Modified', 'Where', 'Tags'].forEach(id => {
                const el = this.window.querySelector(`#info${id}`);
                if (el) el.textContent = '—';
            });
            
            return;
        }
        
        const items = this.getCurrentFolderItems();
        const selectedIndex = Array.from(this.selectedItems)[0];
        const item = items[selectedIndex];
        
        if (!item) return;
        
        this.window.querySelector('#previewTitle').textContent = item.name;
        this.window.querySelector('#previewSubtitle').textContent = selectedCount > 1 ? 
            `${selectedCount} items selected` : item.kind;
        
        const previewImage = this.window.querySelector('#previewImage');
        if (previewImage) {
            previewImage.innerHTML = `<i class="fas fa-${item.icon} icon-${item.type}" style="font-size: 48px;"></i>`;
        }
        
        const infoKind = this.window.querySelector('#infoKind');
        const infoSize = this.window.querySelector('#infoSize');
        const infoCreated = this.window.querySelector('#infoCreated');
        const infoModified = this.window.querySelector('#infoModified');
        const infoWhere = this.window.querySelector('#infoWhere');
        const infoTags = this.window.querySelector('#infoTags');
        
        if (infoKind) infoKind.textContent = item.kind;
        if (infoSize) infoSize.textContent = item.size;
        if (infoCreated) infoCreated.textContent = item.date;
        if (infoModified) infoModified.textContent = item.date;
        if (infoWhere) infoWhere.textContent = this.currentPath.join(' → ');
        if (infoTags) infoTags.textContent = item.tags.join(', ') || 'None';
    }
    
    navigateTo(path) {
        this.loadFolder(path);
        
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        const target = this.window.querySelector(`[data-path="${path}"]`);
        if (target) {
            target.classList.add('active');
        }
    }
    
    updatePathBar() {
        const pathBar = this.window.querySelector('#pathBar');
        if (!pathBar) return;
        
        pathBar.innerHTML = '';
        
        this.currentPath.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = `path-segment ${index === this.currentPath.length - 1 ? 'current' : ''}`;
            segmentElement.textContent = segment;
            segmentElement.dataset.index = index;
            
            segmentElement.addEventListener('click', () => {
                console.log('Navigate to:', this.currentPath.slice(0, index + 1).join(' → '));
            });
            
            pathBar.appendChild(segmentElement);
            
            if (index < this.currentPath.length - 1) {
                const separator = document.createElement('div');
                separator.className = 'path-separator';
                separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                pathBar.appendChild(separator);
            }
        });
    }
    
    updateSidebarSelection(folderName) {
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.path === folderName) {
                item.classList.add('active');
            }
        });
    }
    
    goBack() { console.log('Go back'); }
    goForward() { console.log('Go forward'); }
    goUp() { console.log('Go up one level'); }
    
    switchView(view) {
        this.currentView = view;
        
        this.window.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        const views = ['iconView', 'listView', 'columnView'];
        views.forEach(viewId => {
            const element = this.window.querySelector(`#${viewId}`);
            if (element) {
                element.classList.toggle('active', viewId === `${view}View`);
            }
        });
        
        const currentFolder = this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home';
        this.loadFolder(currentFolder);
    }
    
    togglePreview() {
        this.showPreview = !this.showPreview;
        const panel = this.window.querySelector('#previewPanel');
        const btn = this.window.querySelector('#previewToggleBtn');
        
        if (panel) panel.classList.toggle('active', this.showPreview);
        if (btn) btn.classList.toggle('active', this.showPreview);
        
        if (this.showPreview && this.selectedItems.size > 0) {
            this.updatePreview();
        }
    }
    
    createNewFolder() {
        const folderName = prompt('New folder name:', 'Untitled Folder');
        if (folderName) {
            console.log('Creating folder:', folderName);
            this.loadFolder(this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home');
        }
    }
    
    showViewOptions() { alert('View options would appear here'); }
    showArrangeOptions() { alert('Arrange options would appear here'); }
    
    shareSelected() {
        if (this.selectedItems.size === 0) {
            alert('Select items to share');
            return;
        }
        alert(`Sharing ${this.selectedItems.size} selected items`);
    }
    
    toggleTags() {
        this.showTags = !this.showTags;
        const tagsSection = this.window.querySelector('.sidebar-tags');
        const btn = this.window.querySelector('#tagsBtn');
        
        if (tagsSection) {
            tagsSection.style.display = this.showTags ? 'block' : 'none';
        }
        if (btn) btn.classList.toggle('active', this.showTags);
    }
    
    showActionsMenu() { alert('Actions menu would appear here'); }
    
    openItem(item) {
        alert(`Opening: ${item.name}\n\nType: ${item.kind}\n\nThis would open the appropriate application.`);
    }
    
    showContextMenu(x, y) {
        const menu = this.window.querySelector('#contextMenu');
        if (!menu) return;
        
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.display = 'flex';
        
        const hasSelection = this.selectedItems.size > 0;
        
        menu.querySelectorAll('.menu-item').forEach(item => {
            const action = item.dataset.action;
            
            if (action === 'paste') {
                item.style.display = this.clipboard.length > 0 ? 'flex' : 'none';
            } else if (action === 'open' || action === 'quicklook') {
                item.style.display = hasSelection ? 'flex' : 'none';
            } else {
                item.style.display = 'flex';
            }
            
            item.onclick = (e) => {
                e.stopPropagation();
                this.handleContextAction(action);
            };
        });
    }
    
    hideContextMenu() {
        const menu = this.window.querySelector('#contextMenu');
        if (menu) menu.style.display = 'none';
    }
    
    handleContextAction(action) {
        this.hideContextMenu();
        
        switch(action) {
            case 'open':
                const items = this.getSelectedItems();
                if (items.length === 1) this.openItem(items[0]);
                break;
            case 'quicklook': this.showQuickLook(); break;
            case 'cut': this.cutSelected(); break;
            case 'copy': this.copySelected(); break;
            case 'paste': this.pasteClipboard(); break;
            case 'rename': this.renameSelected(); break;
            case 'duplicate': this.duplicateSelected(); break;
            case 'compress': this.compressSelected(); break;
            case 'trash': this.moveToTrash(); break;
        }
    }
    
    showQuickLook() {
        if (this.selectedItems.size === 0) {
            alert('Select an item to use Quick Look');
            return;
        }
        
        const items = this.getSelectedItems();
        const item = items[0];
        const quickLook = this.window.querySelector('#quickLook');
        const title = this.window.querySelector('#quickLookTitle');
        const content = this.window.querySelector('#quickLookContent');
        
        if (!quickLook || !title || !content) return;
        
        title.textContent = item.name;
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-${item.icon}" style="font-size: 96px; color: #007AFF; margin-bottom: 30px;"></i>
                <h3 style="margin-bottom: 10px;">${item.name}</h3>
                <p style="color: #666; margin-bottom: 20px;">${item.kind} • ${item.size}</p>
                <p style="color: #999;">Quick Look preview would appear here</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">Press spacebar to close</p>
            </div>
        `;
        
        quickLook.classList.add('active');
    }
    
    hideQuickLook() {
        const quickLook = this.window.querySelector('#quickLook');
        if (quickLook) quickLook.classList.remove('active');
    }
    
    cutSelected() {
        const items = this.getSelectedItems();
        this.clipboard = [...items];
        this.clipboardOperation = 'cut';
        console.log('Cut items:', items.map(i => i.name));
    }
    
    copySelected() {
        const items = this.getSelectedItems();
        this.clipboard = [...items];
        this.clipboardOperation = 'copy';
        console.log('Copied items:', items.map(i => i.name));
    }
    
    pasteClipboard() {
        if (this.clipboard.length === 0) return;
        console.log(`Pasting ${this.clipboard.length} items (${this.clipboardOperation})`);
        alert(`Would ${this.clipboardOperation} ${this.clipboard.length} items to this location`);
    }
    
    renameSelected() {
        if (this.selectedItems.size !== 1) {
            alert('Select exactly one item to rename');
            return;
        }
        
        const items = this.getCurrentFolderItems();
        const selectedIndex = Array.from(this.selectedItems)[0];
        const item = items[selectedIndex];
        
        const newName = prompt('Rename:', item.name);
        if (newName && newName !== item.name) {
            console.log(`Renaming "${item.name}" to "${newName}"`);
            this.loadFolder(this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home');
        }
    }
    
    duplicateSelected() {
        const count = this.selectedItems.size;
        if (count === 0) return;
        console.log(`Duplicating ${count} items`);
        alert(`Would create copies of ${count} selected items`);
    }
    
    compressSelected() {
        const count = this.selectedItems.size;
        if (count === 0) return;
        console.log(`Compressing ${count} items into archive.zip`);
        alert(`Would compress ${count} items into an archive`);
    }
    
    moveToTrash() {
        const count = this.selectedItems.size;
        if (count === 0) return;
        
        if (confirm(`Move ${count} item${count !== 1 ? 's' : ''} to Trash?`)) {
            console.log(`Moved ${count} items to Trash`);
            this.clearSelection();
            this.loadFolder(this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home');
        }
    }
    
    getCurrentFolderItems() {
        const currentFolder = this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home';
        const folder = this.getFolderContents(currentFolder);
        return folder.items;
    }
    
    getSelectedItems() {
        const items = this.getCurrentFolderItems();
        return Array.from(this.selectedItems).map(index => items[index]).filter(Boolean);
    }
    
    sortItems(items, sortBy, order) {
        return [...items].sort((a, b) => {
            let aValue, bValue;
            
            switch(sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'date':
                    aValue = this.parseDate(a.date);
                    bValue = this.parseDate(b.date);
                    break;
                case 'size':
                    aValue = this.parseSize(a.size);
                    bValue = this.parseSize(b.size);
                    break;
                case 'kind':
                    aValue = a.kind.toLowerCase();
                    bValue = b.kind.toLowerCase();
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }
            
            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }
    
    sortContent(sortBy) {
        if (this.sortBy === sortBy) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = sortBy;
            this.sortOrder = 'asc';
        }
        
        this.window.querySelectorAll('.list-column i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });
        
        const currentColumn = this.window.querySelector(`[data-sort="${this.sortBy}"] i`);
        if (currentColumn) {
            currentColumn.className = `fas fa-sort-${this.sortOrder === 'asc' ? 'up' : 'down'}`;
        }
        
        const currentFolder = this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home';
        this.loadFolder(currentFolder);
    }
    
    filterContent() {
        const currentFolder = this.window.querySelector('.sidebar-item.active')?.dataset.path || 'home';
        this.loadFolder(currentFolder);
    }
    
    parseDate(dateStr) {
        if (dateStr === 'Today') return Date.now();
        if (dateStr === 'Yesterday') return Date.now() - 86400000;
        return new Date(dateStr).getTime() || Date.now();
    }
    
    parseSize(sizeStr) {
        if (sizeStr === '—') return 0;
        
        const match = sizeStr.match(/([\d.]+)\s*(\w+)/);
        if (!match) return 0;
        
        const num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        
        const units = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
        return num * (units[unit] || 1);
    }
    
    setupDragAndDrop() {
        const dragOverlay = this.window.querySelector('#dragOverlay');
        if (!dragOverlay) return;
        
        this.window.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragOverlay.classList.add('active');
        });
        
        this.window.addEventListener('dragleave', () => {
            dragOverlay.classList.remove('active');
        });
        
        this.window.addEventListener('drop', (e) => {
            e.preventDefault();
            dragOverlay.classList.remove('active');
            console.log('Files dropped:', e.dataTransfer.files);
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.clearSelection();
                    this.hideQuickLook();
                    this.hideContextMenu();
                    break;
                case ' ':
                    if (this.selectedItems.size > 0) {
                        e.preventDefault();
                        this.showQuickLook();
                    }
                    break;
                case 'a':
                case 'A':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        this.selectAll();
                    }
                    break;
                case 'Backspace':
                case 'Delete':
                    if (this.selectedItems.size > 0) {
                        e.preventDefault();
                        this.moveToTrash();
                    }
                    break;
                case 'c':
                case 'C':
                    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
                        e.preventDefault();
                        this.copySelected();
                    }
                    break;
                case 'x':
                case 'X':
                    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
                        e.preventDefault();
                        this.cutSelected();
                    }
                    break;
                case 'v':
                case 'V':
                    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
                        e.preventDefault();
                        this.pasteClipboard();
                    }
                    break;
                case 'n':
                case 'N':
                    if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
                        e.preventDefault();
                        this.createNewFolder();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        const view = e.key === '1' ? 'icon' : e.key === '2' ? 'list' : 'column';
                        this.switchView(view);
                    }
                    break;
            }
        });
    }
    
    selectAll() {
        const items = this.getCurrentFolderItems();
        items.forEach((_, index) => {
            this.selectedItems.add(index);
        });
        
        this.window.querySelectorAll('.icon-item, .list-item, .column-item').forEach((item, index) => {
            item.classList.add('selected');
        });
        
        this.updateSelectionCount();
        this.updatePreview();
    }
    
    open() {
        console.log('📁 Opening Finder window');
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

// Initialize Finder App with proper error handling
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing Finder App...');
    try {
        window.FinderApp = new FinderApp();
        console.log('✅ Finder App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Finder App:', error);
    }
});

// Also try to initialize if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.FinderApp) {
            console.log('🔄 Late initialization of Finder App...');
            window.FinderApp = new FinderApp();
        }
    }, 100);
} 