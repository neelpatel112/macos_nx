// Safari Browser Functionality - Self-Contained Version
document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const apiKey = 'bd514e2f99d5c0cf816f65642456550e8f61a825'; // Your Serper.dev API Key
    const searchEndpoint = 'https://google.serper.dev/search';

    // --- Create Safari Window HTML ---
    function createSafariWindow() {
        // Check if it already exists
        if (document.querySelector('.safari-window')) return;
        
        const safariHTML = `
            <div class="window safari-window" data-window="safari" style="width: 900px; height: 600px; display: none; position: absolute;">
                <div class="window-header">
                    <div class="window-controls">
                        <span class="window-close"></span>
                        <span class="window-minimize"></span>
                        <span class="window-zoom"></span>
                    </div>
                    <div class="window-title">Safari</div>
                </div>
                <div class="safari-toolbar">
                    <button class="toolbar-button" id="safari-back" disabled>←</button>
                    <button class="toolbar-button" id="safari-forward" disabled>→</button>
                    <button class="toolbar-button" id="safari-refresh">↻</button>
                    <div class="url-bar-container">
                        <input type="text" id="safari-url-input" placeholder="Search or enter website name" value="https://macosnx.vercel.app">
                    </div>
                    <button class="toolbar-button" id="safari-search">Go</button>
                </div>
                <div class="safari-content" id="safari-content">
                    <div class="welcome-message">
                        <h2>Welcome to Safari</h2>
                        <p>Enter a search term in the address bar above to get started.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', safariHTML);
    }
    
    // Create the window
    createSafariWindow();

    // --- DOM Elements ---
    const safariWindow = document.querySelector('.safari-window');
    const urlInput = document.getElementById('safari-url-input');
    const searchButton = document.getElementById('safari-search');
    const backButton = document.getElementById('safari-back');
    const forwardButton = document.getElementById('safari-forward');
    const refreshButton = document.getElementById('safari-refresh');
    const contentArea = document.getElementById('safari-content');

    // --- State Management ---
    let historyStack = [];
    let currentHistoryIndex = -1;

    // --- Helper Functions ---
    function updateNavButtons() {
        if (backButton) backButton.disabled = currentHistoryIndex <= 0;
        if (forwardButton) forwardButton.disabled = currentHistoryIndex >= historyStack.length - 1;
    }

    function addToHistory(queryOrUrl) {
        if (currentHistoryIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(0, currentHistoryIndex + 1);
        }
        historyStack.push(queryOrUrl);
        currentHistoryIndex = historyStack.length - 1;
        updateNavButtons();
    }

    function navigateToHistory(index) {
        if (index >= 0 && index < historyStack.length) {
            currentHistoryIndex = index;
            const item = historyStack[index];
            performSearch(item);
            if (urlInput) urlInput.value = item;
            updateNavButtons();
        }
    }

    // --- Core Search Function ---
    async function performSearch(query) {
        if (!query.trim()) return;

        contentArea.innerHTML = '<div class="loading-indicator">Searching...</div>';
        if (urlInput) urlInput.value = query;

        try {
            const response = await fetch(searchEndpoint, {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ q: query })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            displayResults(data, query);

            if (historyStack[currentHistoryIndex] !== query) {
                addToHistory(query);
            }

        } catch (error) {
            console.error('Search failed:', error);
            contentArea.innerHTML = `<div class="error-message" style="color: red; text-align: center; padding: 20px;">
                <h3>Search Failed</h3>
                <p>${error.message}. Please check your API key or try again later.</p>
            </div>`;
        }
    }

    // --- Display Results ---
    function displayResults(data, query) {
        if (!data.organic || data.organic.length === 0) {
            contentArea.innerHTML = `<p style="text-align: center; padding: 40px;">No results found for "${query}".</p>`;
            return;
        }

        let resultsHtml = `<h2 style="margin-top: 0;">Search results for: "${query}"</h2>`;
        resultsHtml += `<p style="color: #666; margin-bottom: 20px;">About ${data.searchParameters?.totalResults || 'many'} results</p>`;

        data.organic.forEach(result => {
            resultsHtml += `
                <div class="search-result">
                    <a href="#" class="search-result-title" data-url="${result.link}">${result.title}</a>
                    <div class="search-result-link">${result.link}</div>
                    <div class="search-result-snippet">${result.snippet}</div>
                </div>
            `;
        });

        contentArea.innerHTML = resultsHtml;

        document.querySelectorAll('.search-result-title').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = e.target.getAttribute('data-url');
                if (url) window.open(url, '_blank');
            });
        });
    }

    // --- Event Listeners ---
    if (searchButton) {
        searchButton.addEventListener('click', () => performSearch(urlInput?.value));
    }

    if (urlInput) {
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(urlInput.value);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => navigateToHistory(currentHistoryIndex - 1));
    }

    if (forwardButton) {
        forwardButton.addEventListener('click', () => navigateToHistory(currentHistoryIndex + 1));
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            if (historyStack[currentHistoryIndex]) {
                performSearch(historyStack[currentHistoryIndex]);
            } else {
                contentArea.innerHTML = `<div class="welcome-message"><h2>Welcome to Safari</h2><p>Enter a search term in the address bar above to get started.</p></div>`;
            }
        });
    }

    // --- Safari App Controller (matches your other apps) ---
    class SafariApp {
        constructor() {
            this.isOpen = false;
            this.windowElement = document.querySelector('.safari-window');
            this.windowId = 'safari';
            this.zIndex = 100;
        }
        
        open() {
            if (!this.windowElement) return;
            
            this.windowElement.style.display = 'flex';
            this.isOpen = true;
            
            const left = (window.innerWidth - 900) / 2;
            const top = (window.innerHeight - 600) / 2;
            
            this.windowElement.style.left = `${left}px`;
            this.windowElement.style.top = `${top}px`;
            
            this.bringToFront();
            this.windowElement.style.animation = 'windowAppear 0.3s ease-out';
        }
        
        close() {
            if (!this.windowElement) return;
            this.windowElement.style.display = 'none';
            this.isOpen = false;
        }
        
        bringToFront() {
            if (!this.windowElement) return;
            this.zIndex = window.WindowManager ? ++window.WindowManager.zIndexCounter : ++this.zIndex;
            this.windowElement.style.zIndex = this.zIndex;
        }
    }

    // Initialize Safari app
    window.SafariApp = new SafariApp();

    // Window controls
    if (safariWindow) {
        const closeBtn = safariWindow.querySelector('.window-close');
        const minimizeBtn = safariWindow.querySelector('.window-minimize');
        const zoomBtn = safariWindow.querySelector('.window-zoom');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => window.SafariApp.close());
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                safariWindow.style.transform = 'translateY(100vh)';
                safariWindow.style.opacity = '0';
                setTimeout(() => {
                    safariWindow.style.display = 'none';
                    safariWindow.style.transform = '';
                    safariWindow.style.opacity = '';
                }, 300);
            });
        }
        
        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => {
                if (safariWindow.classList.contains('maximized')) {
                    safariWindow.classList.remove('maximized');
                    safariWindow.style.width = '900px';
                    safariWindow.style.height = '600px';
                    safariWindow.style.left = 'calc(50% - 450px)';
                    safariWindow.style.top = 'calc(50% - 300px)';
                } else {
                    safariWindow.classList.add('maximized');
                    safariWindow.style.width = '100%';
                    safariWindow.style.height = 'calc(100% - 24px)';
                    safariWindow.style.left = '0';
                    safariWindow.style.top = '24px';
                }
            });
        }
    }
});