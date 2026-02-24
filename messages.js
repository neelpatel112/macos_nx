// messages.js - Real P2P Chat using PeerJS with Public Server
class MessagesApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.activeConversation = null;
        this.peer = null;
        this.connections = {};
        this.myPeerId = null;
        this.username = 'User' + Math.floor(Math.random() * 1000);
        this.onlineUsers = [];
        this.messageCounter = 0;
        
        // Load PeerJS library
        this.loadPeerJS();
        this.init();
    }
    
    loadPeerJS() {
        // Check if PeerJS is already loaded
        if (window.Peer) {
            this.initializePeer();
            return;
        }
        
        // Load PeerJS from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
        script.onload = () => this.initializePeer();
        document.head.appendChild(script);
    }
    
    initializePeer() {
        // Generate random peer ID
        this.myPeerId = 'user-' + Math.random().toString(36).substr(2, 9);
        
        // Create peer connection with FREE public server
        this.peer = new Peer(this.myPeerId, {
            host: 'peerjs-server.herokuapp.com',  // Free public server
            port: 443,
            secure: true,
            path: '/',
            config: {
                'iceServers': [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:stun3.l.google.com:19302' },
                    { urls: 'stun:stun4.l.google.com:19302' },
                    {
                        urls: 'turn:openrelay.metered.ca:80',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    },
                    {
                        urls: 'turn:openrelay.metered.ca:443',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    }
                ]
            },
            debug: 3
        });
        
        this.peer.on('open', (id) => {
            console.log('✅ Connected to P2P network with ID:', id);
            this.myPeerId = id;
            this.addSelfToOnlineUsers();
            
            // Update UI with peer ID
            this.updatePeerIdDisplay();
        });
        
        this.peer.on('connection', (conn) => {
            console.log('📞 Incoming connection from:', conn.peer);
            
            conn.on('open', () => {
                console.log('🔌 Connection opened with:', conn.peer);
                this.handleNewConnection(conn);
            });
            
            conn.on('data', (data) => {
                console.log('📨 Received data:', data);
                this.handleIncomingData(conn.peer, data);
            });
            
            conn.on('close', () => {
                console.log('🔒 Connection closed:', conn.peer);
                this.handleDisconnect(conn.peer);
            });
            
            conn.on('error', (err) => {
                console.error('Connection error:', err);
            });
        });
        
        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
            alert('Connection error: ' + err.type + '. Make sure you have internet connection!');
        });
        
        this.peer.on('disconnected', () => {
            console.log('📴 Disconnected from server. Reconnecting...');
            this.peer.reconnect();
        });
    }
    
    addSelfToOnlineUsers() {
        this.onlineUsers.push({
            id: this.myPeerId,
            name: this.username + ' (You)',
            isMe: true,
            online: true
        });
    }
    
    updatePeerIdDisplay() {
        if (!this.window) return;
        
        const idDisplay = this.window.querySelector('#myPeerIdDisplay');
        const idInput = this.window.querySelector('#myPeerIdInput');
        
        if (idDisplay) idDisplay.textContent = this.myPeerId;
        if (idInput) idInput.value = this.myPeerId;
    }
    
    handleNewConnection(conn) {
        this.connections[conn.peer] = conn;
        
        // Check if user already exists
        const existingUser = this.onlineUsers.find(u => u.id === conn.peer);
        if (!existingUser) {
            this.onlineUsers.push({
                id: conn.peer,
                name: 'User-' + conn.peer.substr(0, 4),
                online: true,
                messages: []
            });
            
            this.updateOnlineUsersList();
        }
    }
    
    handleIncomingData(peerId, data) {
        if (data.type === 'message') {
            this.receiveMessage(peerId, data);
        } else if (data.type === 'typing') {
            this.showTypingIndicator(peerId, data.isTyping);
        }
    }
    
    handleDisconnect(peerId) {
        // Remove from online users
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== peerId);
        delete this.connections[peerId];
        
        // If this was active conversation, clear it
        if (this.activeConversation && this.activeConversation.id === peerId) {
            this.activeConversation = null;
        }
        
        this.updateOnlineUsersList();
        this.updateChatArea();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('💬 P2P Messages App initialized');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window messages-window';
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 150px;
            width: 900px;
            height: 650px;
            background: rgba(30, 30, 35, 0.95);
            border-radius: 12px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: windowAppear 0.3s ease;
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        this.window.innerHTML = `
            <div class="window-titlebar" style="background: rgba(30, 30, 35, 0.9); color: white; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="window-controls">
                    <button class="window-close" title="Close"></button>
                    <button class="window-minimize" title="Minimize"></button>
                    <button class="window-zoom" title="Zoom"></button>
                </div>
                <div class="window-title">
                    <i class="fas fa-comment" style="margin-right: 8px; color: #0a84ff;"></i>
                    Messages (P2P)
                </div>
            </div>
            
            <div class="messages-container">
                <div class="messages-sidebar">
                    <div class="messages-search">
                        <input type="text" id="myPeerIdInput" placeholder="Your ID" readonly style="background: rgba(0,0,0,0.5); color: #0a84ff; font-weight: bold;">
                    </div>
                    
                    <div class="connect-section" style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="margin-bottom: 12px; text-align: center;">
                            <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">YOUR ID</div>
                            <div id="myPeerIdDisplay" style="background: #0a84ff20; padding: 8px; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all;">${this.myPeerId || 'loading...'}</div>
                        </div>
                        
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <input type="text" id="peerIdInput" placeholder="Enter friend's ID..." style="flex:1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                            <button id="connectBtn" style="padding: 10px 16px; background: #0a84ff; border: none; border-radius: 8px; color: white; cursor: pointer;">
                                <i class="fas fa-plug"></i> Connect
                            </button>
                        </div>
                    </div>
                    
                    <div class="online-header" style="padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <i class="fas fa-circle" style="color: #30d158; font-size: 10px;"></i> Online Users
                        <span id="onlineCount" style="margin-left: 8px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 12px; font-size: 11px;">0</span>
                    </div>
                    
                    <div class="conversations-list" id="onlineUsersList">
                        ${this.renderOnlineUsers()}
                    </div>
                </div>
                
                <div class="messages-chat" id="chatArea">
                    ${this.renderChatArea()}
                </div>
            </div>
        `;
        
        document.body.appendChild(this.window);
        
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        this.makeDraggable();
    }
    
    renderOnlineUsers() {
        const onlineOthers = this.onlineUsers.filter(u => !u.isMe);
        
        if (onlineOthers.length === 0) {
            return `
                <div style="padding: 30px 20px; text-align: center; color: rgba(255,255,255,0.3);">
                    <i class="fas fa-user-slash" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <div>No one online yet</div>
                    <div style="font-size: 12px; margin-top: 8px;">Share your ID to connect!</div>
                </div>
            `;
        }
        
        return onlineOthers.map(user => `
            <div class="conversation-item ${this.activeConversation?.id === user.id ? 'active' : ''}" data-user-id="${user.id}">
                <div class="conversation-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                    <span class="online-indicator" style="background: #30d158;"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">
                        <span>${user.name}</span>
                    </div>
                    <div class="conversation-lastmsg">
                        Click to chat
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderChatArea() {
        if (!this.activeConversation) {
            return `
                <div class="no-conversation">
                    <i class="fas fa-comment-dots"></i>
                    <span>Select a user to start P2P chat</span>
                    <div style="font-size: 12px; margin-top: 16px; color: rgba(255,255,255,0.3);">
                        <i class="fas fa-shield-alt"></i> Direct connection • No messages saved
                    </div>
                </div>
            `;
        }
        
        const user = this.activeConversation;
        return `
            <div class="chat-header">
                <div class="chat-header-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="chat-header-info">
                    <h3>${user.name}</h3>
                    <div class="chat-header-status" id="connectionStatus">
                        <span class="status-dot">🟢</span> Connected (Direct P2P)
                    </div>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                ${this.renderConversationHistory()}
            </div>
            
            <div class="typing-indicator" id="typingIndicator" style="display: none;">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <span style="margin-left: 8px; font-size: 12px; color: rgba(255,255,255,0.5);">${user.name} is typing...</span>
            </div>
            
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="messageInput" placeholder="Type a message...">
                <button class="chat-send-btn" id="sendMessageBtn" disabled>
                    <i class="fas fa-arrow-up"></i>
                </button>
            </div>
        `;
    }
    
    renderConversationHistory() {
        if (!this.activeConversation.messages || this.activeConversation.messages.length === 0) {
            return '<div style="text-align: center; color: rgba(255,255,255,0.2); padding: 40px 20px;">No messages yet. Say hi! 👋</div>';
        }
        
        return this.activeConversation.messages.map(msg => this.renderMessage(msg)).join('');
    }
    
    renderMessage(msg) {
        const isMe = msg.sender === 'me';
        return `
            <div class="message ${isMe ? 'outgoing' : 'incoming'}">
                ${!isMe ? `<div class="message-avatar">${this.activeConversation.name.charAt(0).toUpperCase()}</div>` : ''}
                <div class="message-bubble">
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        setTimeout(() => {
            // Connect button
            const connectBtn = this.window.querySelector('#connectBtn');
            const peerIdInput = this.window.querySelector('#peerIdInput');
            
            if (connectBtn && peerIdInput) {
                connectBtn.addEventListener('click', () => {
                    const targetId = peerIdInput.value.trim();
                    if (targetId) {
                        this.connectToPeer(targetId);
                        peerIdInput.value = ''; // Clear input
                    } else {
                        alert('Please enter a friend ID!');
                    }
                });
                
                peerIdInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        connectBtn.click();
                    }
                });
            }
            
            // Online users click
            const userItems = this.window.querySelectorAll('.conversation-item');
            userItems.forEach(item => {
                item.addEventListener('click', () => {
                    const userId = item.dataset.userId;
                    if (userId && userId !== this.myPeerId) {
                        this.selectUser(userId);
                    }
                });
            });
            
            // Message input
            const messageInput = this.window.querySelector('#messageInput');
            const sendBtn = this.window.querySelector('#sendMessageBtn');
            
            if (messageInput && sendBtn) {
                messageInput.addEventListener('input', () => {
                    sendBtn.disabled = !messageInput.value.trim();
                    this.sendTypingStatus(messageInput.value.trim().length > 0);
                });
                
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && messageInput.value.trim()) {
                        this.sendMessage();
                    }
                });
                
                sendBtn.addEventListener('click', () => this.sendMessage());
            }
        }, 100);
    }
    
    connectToPeer(peerId) {
        if (!this.peer) {
            alert('Peer connection not ready yet. Please wait...');
            return;
        }
        
        if (peerId === this.myPeerId) {
            alert("Can't connect to yourself!");
            return;
        }
        
        console.log('🔌 Connecting to:', peerId);
        
        // Check if already connected
        if (this.connections[peerId]) {
            this.selectUser(peerId);
            return;
        }
        
        const conn = this.peer.connect(peerId, {
            reliable: true,
            serialization: 'json'
        });
        
        conn.on('open', () => {
            console.log('✅ Connected to:', peerId);
            this.connections[peerId] = conn;
            
            // Add to online users
            const newUser = {
                id: peerId,
                name: 'User-' + peerId.substr(0, 4),
                online: true,
                messages: []
            };
            
            this.onlineUsers.push(newUser);
            this.updateOnlineUsersList();
            this.selectUser(peerId);
            
            // Send initial greeting
            setTimeout(() => {
                if (this.activeConversation?.id === peerId) {
                    // Optional: send auto greeting
                }
            }, 500);
        });
        
        conn.on('data', (data) => {
            this.handleIncomingData(peerId, data);
        });
        
        conn.on('close', () => {
            this.handleDisconnect(peerId);
        });
        
        conn.on('error', (err) => {
            console.error('Connection error:', err);
            alert('Failed to connect. Make sure the ID is correct and the user is online!');
        });
    }
    
    selectUser(userId) {
        const user = this.onlineUsers.find(u => u.id === userId);
        if (user) {
            this.activeConversation = user;
            if (!user.messages) user.messages = [];
            
            // Update chat area
            const chatArea = this.window.querySelector('#chatArea');
            if (chatArea) {
                chatArea.innerHTML = this.renderChatArea();
                this.setupEventListeners();
                
                // Scroll to bottom
                setTimeout(() => {
                    const messagesDiv = this.window.querySelector('#chatMessages');
                    if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 100);
            }
            
            // Update active state in user list
            this.window.querySelectorAll('.conversation-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.userId === userId) {
                    item.classList.add('active');
                }
            });
        }
    }
    
    sendMessage() {
        const input = this.window.querySelector('#messageInput');
        const messageText = input.value.trim();
        
        if (!messageText || !this.activeConversation) return;
        
        const message = {
            type: 'message',
            text: messageText,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            sender: 'me'
        };
        
        // Store and display locally
        if (!this.activeConversation.messages) {
            this.activeConversation.messages = [];
        }
        this.activeConversation.messages.push(message);
        this.displayMessage(message);
        
        // Send to peer
        const conn = this.connections[this.activeConversation.id];
        if (conn && conn.open) {
            conn.send({
                type: 'message',
                text: messageText,
                time: message.time
            });
        } else {
            alert('Connection lost. Reconnecting...');
            this.connectToPeer(this.activeConversation.id);
        }
        
        // Clear input
        input.value = '';
        this.window.querySelector('#sendMessageBtn').disabled = true;
        this.sendTypingStatus(false);
    }
    
    receiveMessage(peerId, data) {
        const user = this.onlineUsers.find(u => u.id === peerId);
        if (user) {
            const message = {
                type: 'message',
                text: data.text,
                time: data.time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                sender: 'them'
            };
            
            if (!user.messages) user.messages = [];
            user.messages.push(message);
            
            // If this is the active conversation, display it
            if (this.activeConversation && this.activeConversation.id === peerId) {
                this.displayMessage(message);
            }
        }
    }
    
    displayMessage(message) {
        const messagesDiv = this.window.querySelector('#chatMessages');
        if (!messagesDiv) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender === 'me' ? 'outgoing' : 'incoming'}`;
        messageEl.innerHTML = `
            ${message.sender !== 'me' ? `<div class="message-avatar">${this.activeConversation.name.charAt(0).toUpperCase()}</div>` : ''}
            <div class="message-bubble">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    sendTypingStatus(isTyping) {
        if (!this.activeConversation) return;
        
        const conn = this.connections[this.activeConversation.id];
        if (conn && conn.open) {
            conn.send({
                type: 'typing',
                isTyping: isTyping
            });
        }
    }
    
    showTypingIndicator(peerId, isTyping) {
        if (this.activeConversation && this.activeConversation.id === peerId) {
            const indicator = this.window.querySelector('#typingIndicator');
            if (indicator) {
                indicator.style.display = isTyping ? 'flex' : 'none';
            }
        }
    }
    
    updateOnlineUsersList() {
        const listDiv = this.window.querySelector('#onlineUsersList');
        const countSpan = this.window.querySelector('#onlineCount');
        
        if (listDiv) {
            listDiv.innerHTML = this.renderOnlineUsers();
        }
        
        if (countSpan) {
            const onlineCount = this.onlineUsers.filter(u => !u.isMe).length;
            countSpan.textContent = onlineCount;
        }
    }
    
    updateChatArea() {
        const chatArea = this.window.querySelector('#chatArea');
        if (chatArea) {
            chatArea.innerHTML = this.renderChatArea();
            this.setupEventListeners();
        }
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        
        // Update the ID display
        this.updatePeerIdDisplay();
        
        return true;
    }
    
    close() {
        // Close all connections
        Object.values(this.connections).forEach(conn => {
            if (conn.open) conn.close();
        });
        
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
            this.window.style.width = '900px';
            this.window.style.height = '650px';
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

// Initialize Messages App
window.addEventListener('DOMContentLoaded', () => {
    console.log('💬 Initializing P2P Messages App...');
    window.MessagesApp = new MessagesApp();
});