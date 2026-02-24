// messages.js - Simple Chat using MQTT (Actually Works!)
class MessagesApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.activeConversation = null;
        this.client = null;
        this.username = 'User' + Math.floor(Math.random() * 1000);
        this.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        this.onlineUsers = [];
        this.messages = {};
        
        this.loadMQTT();
        this.init();
    }
    
    loadMQTT() {
        // Load MQTT library
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/mqtt@4.3.7/dist/mqtt.min.js';
        script.onload = () => this.connectMQTT();
        document.head.appendChild(script);
    }
    
    connectMQTT() {
        // Connect to free public MQTT broker (no auth needed!)
        this.client = mqtt.connect('wss://broker.hivemq.com:8000/mqtt', {
            clientId: this.userId,
            keepalive: 60,
            clean: true
        });
        
        this.client.on('connect', () => {
            console.log('✅ Connected to MQTT broker');
            
            // Subscribe to presence topic
            this.client.subscribe('chat/presence', () => {
                // Announce presence
                this.client.publish('chat/presence', JSON.stringify({
                    id: this.userId,
                    name: this.username,
                    status: 'online',
                    timestamp: Date.now()
                }));
            });
            
            // Subscribe to personal messages
            this.client.subscribe('chat/msg/' + this.userId);
            
            // Listen for messages
            this.client.on('message', (topic, message) => {
                const data = JSON.parse(message.toString());
                
                if (topic === 'chat/presence') {
                    this.handlePresence(data);
                } else if (topic === 'chat/msg/' + this.userId) {
                    this.handleMessage(data);
                }
            });
            
            // Broadcast presence every 30 seconds
            setInterval(() => {
                this.client.publish('chat/presence', JSON.stringify({
                    id: this.userId,
                    name: this.username,
                    status: 'online',
                    timestamp: Date.now()
                }));
            }, 30000);
        });
        
        this.client.on('offline', () => {
            console.log('❌ MQTT offline');
        });
    }
    
    handlePresence(data) {
        // Ignore self
        if (data.id === this.userId) return;
        
        // Update or add user
        const existingIndex = this.onlineUsers.findIndex(u => u.id === data.id);
        
        if (existingIndex >= 0) {
            this.onlineUsers[existingIndex].lastSeen = data.timestamp;
        } else {
            this.onlineUsers.push({
                id: data.id,
                name: data.name,
                online: true,
                lastSeen: data.timestamp,
                messages: []
            });
            
            // Auto-select if this is the only user
            if (this.onlineUsers.length === 1 && this.window && this.isOpen) {
                setTimeout(() => this.selectUser(this.onlineUsers[0]), 500);
            }
        }
        
        // Clean up old users (offline for > 60 seconds)
        this.onlineUsers = this.onlineUsers.filter(u => Date.now() - u.lastSeen < 70000);
        
        this.updateUserList();
    }
    
    handleMessage(data) {
        // Find sender
        const sender = this.onlineUsers.find(u => u.id === data.from);
        if (!sender) return;
        
        // Store message
        if (!sender.messages) sender.messages = [];
        sender.messages.push({
            text: data.text,
            time: data.time,
            sender: 'them'
        });
        
        // If active conversation, display it
        if (this.activeConversation && this.activeConversation.id === data.from) {
            this.displayMessage({
                text: data.text,
                time: data.time,
                sender: 'them'
            });
        }
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('💬 MQTT Chat initialized');
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
                    Messages
                </div>
            </div>
            
            <div class="messages-container">
                <div class="messages-sidebar">
                    <div class="messages-search" style="padding: 16px;">
                        <div style="background: rgba(10,132,255,0.15); padding: 12px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5);">YOU ARE</div>
                            <div style="font-weight: bold; color: #0a84ff; font-size: 16px;">${this.username}</div>
                        </div>
                    </div>
                    
                    <div class="online-header" style="padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <i class="fas fa-circle" style="color: #30d158; font-size: 10px;"></i> Online Now
                        <span id="onlineCount" style="margin-left: 8px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 12px; font-size: 11px;">0</span>
                    </div>
                    
                    <div class="conversations-list" id="onlineUsersList">
                        <div style="padding: 40px 20px; text-align: center; color: rgba(255,255,255,0.2);">
                            <i class="fas fa-wifi fa-spin" style="font-size: 32px; margin-bottom: 12px;"></i>
                            <div>Waiting for others...</div>
                            <div style="font-size: 11px; margin-top: 8px;">Share this app with friends!</div>
                        </div>
                    </div>
                </div>
                
                <div class="messages-chat" id="chatArea">
                    <div class="no-conversation">
                        <i class="fas fa-comment-dots"></i>
                        <span>Select someone to chat</span>
                        <div style="font-size: 12px; margin-top: 16px; color: rgba(255,255,255,0.3);">
                            <i class="fas fa-globe"></i> Anyone online appears automatically!
                        </div>
                    </div>
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
    
    updateUserList() {
        const listDiv = this.window.querySelector('#onlineUsersList');
        const countSpan = this.window.querySelector('#onlineCount');
        
        if (!listDiv) return;
        
        if (countSpan) {
            countSpan.textContent = this.onlineUsers.length;
        }
        
        if (this.onlineUsers.length === 0) {
            listDiv.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: rgba(255,255,255,0.2);">
                    <i class="fas fa-user-slash" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <div>No one online</div>
                    <div style="font-size: 11px; margin-top: 8px;">Tell friends to open the app!</div>
                </div>
            `;
            return;
        }
        
        listDiv.innerHTML = this.onlineUsers.map(user => `
            <div class="conversation-item ${this.activeConversation?.id === user.id ? 'active' : ''}" data-user-id="${user.id}" data-user-name="${user.name}">
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
        
        // Add click handlers
        listDiv.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = item.dataset.userId;
                const userName = item.dataset.userName;
                const user = this.onlineUsers.find(u => u.id === userId);
                if (user) this.selectUser(user);
            });
        });
    }
    
    selectUser(user) {
        this.activeConversation = user;
        
        const chatArea = this.window.querySelector('#chatArea');
        chatArea.innerHTML = this.createChatHTML(user);
        
        // Display existing messages
        const messagesDiv = this.window.querySelector('#chatMessages');
        if (user.messages && user.messages.length > 0) {
            messagesDiv.innerHTML = '';
            user.messages.forEach(msg => this.displayMessage(msg));
        }
        
        this.setupChatListeners();
        
        // Update active state
        this.window.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.userId === user.id) {
                item.classList.add('active');
            }
        });
    }
    
    createChatHTML(user) {
        return `
            <div class="chat-header">
                <div class="chat-header-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="chat-header-info">
                    <h3>${user.name}</h3>
                    <div class="chat-header-status">
                        <span class="status-dot">🟢</span> Online
                    </div>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div style="text-align: center; color: rgba(255,255,255,0.2); padding: 20px;">
                    <i class="fas fa-arrow-up"></i>
                    <div>Send a message to start</div>
                </div>
            </div>
            
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="messageInput" placeholder="Type a message...">
                <button class="chat-send-btn" id="sendMessageBtn" disabled>
                    <i class="fas fa-arrow-up"></i>
                </button>
            </div>
        `;
    }
    
    setupChatListeners() {
        const input = this.window.querySelector('#messageInput');
        const sendBtn = this.window.querySelector('#sendMessageBtn');
        
        if (!input || !sendBtn) return;
        
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    sendMessage() {
        const input = this.window.querySelector('#messageInput');
        const text = input.value.trim();
        
        if (!text || !this.activeConversation || !this.client) return;
        
        const message = {
            from: this.userId,
            to: this.activeConversation.id,
            text: text,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        
        // Store locally
        if (!this.activeConversation.messages) {
            this.activeConversation.messages = [];
        }
        this.activeConversation.messages.push({
            text: text,
            time: message.time,
            sender: 'me'
        });
        
        // Display
        this.displayMessage({
            text: text,
            time: message.time,
            sender: 'me'
        });
        
        // Send via MQTT
        this.client.publish('chat/msg/' + this.activeConversation.id, JSON.stringify(message));
        
        // Clear input
        input.value = '';
        this.window.querySelector('#sendMessageBtn').disabled = true;
    }
    
    displayMessage(message) {
        const messagesDiv = this.window.querySelector('#chatMessages');
        if (!messagesDiv) return;
        
        // Remove empty state
        if (messagesDiv.children.length === 1 && messagesDiv.children[0].querySelector('.fa-arrow-up')) {
            messagesDiv.innerHTML = '';
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender === 'me' ? 'outgoing' : 'incoming'}`;
        messageEl.innerHTML = `
            ${message.sender !== 'me' ? `<div class="message-avatar">${this.activeConversation.name.charAt(0).toUpperCase()}</div>` : ''}
            <div class="message-bubble">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setupEventListeners() {
        // Nothing needed
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        return true;
    }
    
    close() {
        // Announce offline
        if (this.client) {
            this.client.publish('chat/presence', JSON.stringify({
                id: this.userId,
                name: this.username,
                status: 'offline',
                timestamp: Date.now()
            }));
            this.client.end();
        }
        
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
    console.log('💬 Initializing MQTT Chat...');
    window.MessagesApp = new MessagesApp();
});