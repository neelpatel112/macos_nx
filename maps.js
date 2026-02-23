// maps.js - Maps App for macOS Web Emulator using Leaflet + OpenStreetMap
class MapsApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.map = null;
        this.markers = [];
        this.searchHistory = [];
        this.currentLocation = { lat: 20.5937, lng: 78.9629 }; // Default: India
        this.currentZoom = 5;
        
        // Map tile providers (completely free)
        this.tileProviders = {
            street: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            },
            satellite: {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                maxZoom: 18
            },
            terrain: {
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> | Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18
            }
        };
        this.currentTileType = 'street';
        
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        this.loadLeaflet();
        console.log('🗺️ Maps App initialized');
    }
    
    loadLeaflet() {
        // Check if Leaflet is already loaded
        if (window.L) {
            this.leafletLoaded = true;
            return;
        }
        
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
        
        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
            this.leafletLoaded = true;
            console.log('✅ Leaflet loaded');
            if (this.isOpen) {
                this.initializeMap();
            }
        };
        document.head.appendChild(script);
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window maps-window';
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 150px;
            width: 1000px;
            height: 700px;
            background: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: windowAppear 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        this.window.innerHTML = `
            <div class="window-titlebar" style="background: rgba(30, 30, 30, 0.9); color: white; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">
                    <i class="fas fa-map" style="margin-right: 8px; color: #34a853;"></i>
                    Maps (OpenStreetMap)
                </div>
                <div class="window-search" style="flex: 1; max-width: 400px; margin: 0 20px;">
                    <div style="display: flex; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 4px;">
                        <input type="text" id="mapSearchInput" placeholder="Search locations..." 
                               style="flex: 1; background: transparent; border: none; padding: 6px 12px; color: white; outline: none;">
                        <button id="mapSearchBtn" style="background: transparent; border: none; padding: 6px 12px; color: #34a853; cursor: pointer;">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="maps-toolbar" style="background: rgba(40, 40, 40, 0.9); padding: 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="maps-toolbar-btn" data-tile="street" style="background: #34a853; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-map"></i> Street
                </button>
                <button class="maps-toolbar-btn" data-tile="satellite" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-satellite"></i> Satellite
                </button>
                <button class="maps-toolbar-btn" data-tile="terrain" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-mountain"></i> Terrain
                </button>
                <div style="flex: 1;"></div>
                <button id="myLocationBtn" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-location-dot"></i> My Location
                </button>
                <button id="fullscreenMapBtn" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            
            <div class="maps-container" id="mapsContainer" style="flex: 1; position: relative; background: #1a1a1a;">
                <div id="map" style="width: 100%; height: 100%;"></div>
                <div class="map-loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Loading map...
                </div>
            </div>
            
            <div class="maps-statusbar" style="background: rgba(40, 40, 40, 0.9); padding: 4px 16px; border-top: 1px solid rgba(255,255,255,0.1); color: #aaa; font-size: 12px; display: flex; justify-content: space-between;">
                <span id="mapCoordinates">🌍 20.5937° N, 78.9629° E</span>
                <span id="mapZoomLevel">🔍 Zoom: 5</span>
                <span id="mapAttribution" style="color: #888;">OpenStreetMap</span>
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Search functionality
        this.window.querySelector('#mapSearchBtn').addEventListener('click', () => this.searchLocation());
        this.window.querySelector('#mapSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchLocation();
        });
        
        // Toolbar buttons for tile switching
        this.window.querySelectorAll('.maps-toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tileType = e.currentTarget.dataset.tile;
                this.switchTileProvider(tileType);
                
                // Update button styles
                this.window.querySelectorAll('.maps-toolbar-btn').forEach(b => {
                    b.style.background = 'transparent';
                    b.style.border = '1px solid rgba(255,255,255,0.2)';
                });
                e.currentTarget.style.background = '#34a853';
                e.currentTarget.style.border = 'none';
            });
        });
        
        // My location button
        this.window.querySelector('#myLocationBtn').addEventListener('click', () => this.goToMyLocation());
        
        // Fullscreen button
        this.window.querySelector('#fullscreenMapBtn').addEventListener('click', () => this.toggleFullscreen());
        
        this.makeDraggable();
    }
    
    initializeMap() {
        if (!this.leafletLoaded || !window.L) return;
        
        const mapContainer = this.window.querySelector('#map');
        
        // Initialize map [citation:10]
        this.map = L.map(mapContainer).setView(
            [this.currentLocation.lat, this.currentLocation.lng], 
            this.currentZoom
        );
        
        // Add tile layer [citation:10]
        this.addTileLayer(this.currentTileType);
        
        // Add scale control
        L.control.scale({ imperial: false, metric: true }).addTo(this.map);
        
        // Map event listeners
        this.map.on('moveend', () => {
            const center = this.map.getCenter();
            this.window.querySelector('#mapCoordinates').innerHTML = 
                `🌍 ${center.lat.toFixed(4)}° N, ${center.lng.toFixed(4)}° E`;
        });
        
        this.map.on('zoomend', () => {
            const zoom = this.map.getZoom();
            this.window.querySelector('#mapZoomLevel').innerHTML = `🔍 Zoom: ${zoom}`;
        });
        
        // Add default marker
        this.addMarker(this.currentLocation.lat, this.currentLocation.lng, 'Default location');
    }
    
    addTileLayer(type) {
        // Remove existing tile layer
        this.map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });
        
        const provider = this.tileProviders[type];
        if (provider) {
            L.tileLayer(provider.url, {
                attribution: provider.attribution,
                maxZoom: provider.maxZoom
            }).addTo(this.map);
            
            this.window.querySelector('#mapAttribution').innerHTML = 
                type.charAt(0).toUpperCase() + type.slice(1);
        }
    }
    
    switchTileProvider(type) {
        this.currentTileType = type;
        if (this.map) {
            this.addTileLayer(type);
        }
    }
    
    addMarker(lat, lng, title) {
        const marker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup(title);
        this.markers.push(marker);
        return marker;
    }
    
    searchLocation() {
        const query = this.window.querySelector('#mapSearchInput').value;
        if (!query) return;
        
        // Use OpenStreetMap Nominatim API for geocoding (free, no key required)
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    
                    // Fly to location
                    this.map.flyTo([lat, lon], 14);
                    
                    // Add marker
                    this.addMarker(lat, lon, result.display_name);
                    
                    // Add to search history
                    this.searchHistory.unshift({
                        query: query,
                        location: { lat, lon },
                        name: result.display_name
                    });
                } else {
                    alert('Location not found!');
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                alert('Error searching location');
            });
    }
    
    goToMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    this.map.flyTo([pos.lat, pos.lng], 15);
                    
                    // Add custom marker for current location
                    const marker = L.marker([pos.lat, pos.lng], {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>'
                        })
                    }).addTo(this.map).bindPopup('Your location');
                    
                    this.markers.push(marker);
                },
                () => {
                    alert('Error: Unable to get your location. Make sure location access is enabled.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.window.requestFullscreen();
            this.window.querySelector('#fullscreenMapBtn i').className = 'fas fa-compress';
        } else {
            document.exitFullscreen();
            this.window.querySelector('#fullscreenMapBtn i').className = 'fas fa-expand';
        }
    }
    
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
    
    setupEventListeners() {
        // Additional event listeners if needed
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Initialize map if Leaflet is loaded
        if (this.leafletLoaded && !this.map) {
            setTimeout(() => this.initializeMap(), 100);
        }
        
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
            this.window.style.transform = '';
            this.window.style.opacity = '';
        }, 300);
    }
    
    zoom() {
        if (this.window.style.width === '100vw') {
            this.window.style.width = '1000px';
            this.window.style.height = '700px';
            this.window.style.top = '100px';
            this.window.style.left = '150px';
            this.window.style.borderRadius = '12px';
        } else {
            this.window.style.width = '100vw';
            this.window.style.height = '100vh';
            this.window.style.top = '0';
            this.window.style.left = '0';
            this.window.style.borderRadius = '0';
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
            if (e.target.closest('.window-controls') || e.target.closest('input') || e.target.closest('button')) return;
            
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

// Initialize Maps App
window.addEventListener('DOMContentLoaded', () => {
    console.log('🗺️ Initializing Maps App...');
    try {
        window.MapsApp = new MapsApp();
        console.log('✅ Maps App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Maps App:', error);
    }
}); 