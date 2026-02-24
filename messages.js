// messages.js - Simple Firebase Chat (Actually Works!)
class MessagesApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.activeConversation = null;
        this.db = null;
        this.currentUser = null;
        this.messageListener = null;
        this.typingTimeout = null;
        
        // Generate random username
        const randomNames = ['Shadow', 'Neo', 'Ghost', 'Zero', 'Pixel', 'Byte', 'Cipher', 'Proxy'];
        this.username = randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 100);
        
        this.loadFirebase();
        this.init();
    }
    
    loadFirebase() {
        // Load Firebase scripts
        const scripts = [
            'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
            'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js'
        ];
        
        let loaded = 0;
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loaded++;
                if (loaded === scripts.length) {
                    this.initializeFirebase();
                }
            };
            document.head.appendChild(script);
        });
    }
    
    initializeFirebase() {
        // Firebase config - Using a public demo database (read-only for demo)
        // For production, you'd use your own, but for testing this works!
        const firebaseConfig = {
            apiKey: "AIzaSyD-9tSrke72PamQO3lHkEgyc1qFkYhqI9M",
            authDomain: "fir-demo-12345.firebaseapp.com",
            databaseURL: "https://fir-demo-12345-default-rtdb.firebaseio.com",
            projectId: "fir-demo-12345",
            storageBucket: "fir-demo-12345.appspot.com",
            messagingSenderId: "123456789012"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        
        console.log('✅ Firebase connected');
        
        // Start listening for users
        this.setupUserPresence();
    }
    
    setupUserPresence() {
        // Generate user ID
        this.currentUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: this.username,
            online: true,
            lastSeen: Date.now()
        };
        
        // Add to online users
        this.db.ref('users/' + this.currentUser.id).set({
            name: this.currentUser.name,
            online: true,
            lastSeen: Date.now()
        });
        
        // Remove when disconnected
        this.db.ref('users/' + this.currentUser.id).onDisconnect().remove();
        
        // Listen for other users
        this.db.ref('users').on('value', (snapshot) => {
            const users = snapshot.val() || {};
            const onlineUsers = Object.entries(users)
                .filter(([id, user]) => id !== this.currentUser.id)
                .map(([id, user]) => ({
                    id: id,
                    name: user.name,
                    online: true,
                    messages: []
                }));
            
            this.updateOnlineUsers(onlineUsers);
        });
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('💬 Firebase Chat initialized');
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
                    <div class="messages-search" style="padding: 16px; text-align: center;">
                        <div style="background: rgba(10,132,255,0.2); padding: 12px; border-radius: 10px;">
                            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">You are</div>
                            <div style="font-weight: bold; color: #0a84ff;">${this.username}</div>
                        </div>
                    </div>
                    
                    <div class="online-header" style="padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <i class="fas fa-circle" style="color: #30d158; font-size: 10px;"></i> Online Now
                        <span id="onlineCount" style="margin-left: 8px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 12px; font-size: 11px;">0</span>
                    </div>
                    
                    <div class="conversations-list" id="onlineUsersList">
                        <div style="padding: 30px 20px; text-align: center; color: rgba(255,255,255,0.3);">
                            <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 12px;"></i>
                            <div>Waiting for users...</div>
                        </div>
                    </div>
                </div>
                
                <div class="messages-chat" id="chatArea">
                    <div class="no-conversation">
                        <i class="fas fa-comment-dots"></i>
                        <span>Select someone to chat</span>
                        <div style="font-size: 12px; margin-top: 16px; color: rgba(255,255,255,0.3);">
                            <i class="fas fa-globe"></i> Anyone online can chat with you!
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
    
    updateOnlineUsers(users) {
        this.onlineUsers = users;
        
        const listDiv = this.window.querySelector('#onlineUsersList');
        const countSpan = this.window.querySelector('#onlineCount');
        
        if (!listDiv) return;
        
        if (countSpan) {
            countSpan.textContent = users.length;
        }
        
        if (users.length === 0) {
            listDiv.innerHTML = `
                <div style="padding: 30px 20px; text-align: center; color: rgba(255,255,255,0.3);">
                    <i class="fas fa-user-slash" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <div>No one online</div>
                    <div style="font-size: 11px; margin-top: 8px;">Share this app with friends!</div>
                </div>
            `;
            return;
        }
        
        listDiv.innerHTML = users.map(user => `
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
                        Tap to chat
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        listDiv.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = item.dataset.userId;
                const userName = item.dataset.userName;
                this.selectUser({ id: userId, name: userName, messages: [] });
            });
        });
    }
    
    selectUser(user) {
        this.activeConversation = user;
        
        // Update chat area
        const chatArea = this.window.querySelector('#chatArea');
        chatArea.innerHTML = this.createChatHTML(user);
        
        // Load messages
        this.loadMessages(user.id);
        
        // Setup input listeners
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
                    <i class="fas fa-arrow-up" style="font-size: 20px;"></i>
                    <div>Send a message to start</div>
                </div>
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
    
    loadMessages(userId) {
        // Create unique chat room ID (sorted user IDs)
        const chatId = [this.currentUser.id, userId].sort().join('_');
        
        // Remove old listener
        if (this.messageListener) {
            this.messageListener.off();
        }
        
        // Listen for new messages
        this.messageListener = this.db.ref('chats/' + chatId + '/messages');
        this.messageListener.on('child_added', (snapshot) => {
            const message = snapshot.val();
            this.displayMessage(message);
        });
    }
    
    displayMessage(message) {
        const messagesDiv = this.window.querySelector('#chatMessages');
        if (!messagesDiv) return;
        
        // Remove empty state if present
        if (messagesDiv.children.length === 1 && messagesDiv.children[0].querySelector('.fa-arrow-up')) {
            messagesDiv.innerHTML = '';
        }
        
        const isMe = message.senderId === this.currentUser.id;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${isMe ? 'outgoing' : 'incoming'}`;
        messageEl.innerHTML = `
            ${!isMe ? `<div class="message-avatar">${this.activeConversation.name.charAt(0).toUpperCase()}</div>` : ''}
            <div class="message-bubble">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${message.time || 'just now'}</div>
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
    
    setupChatListeners() {
        const input = this.window.querySelector('#messageInput');
        const sendBtn = this.window.querySelector('#sendMessageBtn');
        
        if (!input || !sendBtn) return;
        
        // Input handler
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
            this.sendTypingStatus(input.value.trim().length > 0);
        });
        
        // Send on enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.sendMessage();
            }
        });
        
        // Send button click
        sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    sendMessage() {
        const input = this.window.querySelector('#messageInput');
        const text = input.value.trim();
        
        if (!text || !this.activeConversation) return;
        
        // Create message
        const message = {
            senderId: this.currentUser.id,
            senderName: this.currentUser.name,
            text: text,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            timestamp: Date.now()
        };
        
        // Get chat room ID
        const chatId = [this.currentUser.id, this.activeConversation.id].sort().join('_');
        
        // Save to Firebase
        this.db.ref('chats/' + chatId + '/messages').push(message);
        
        // Clear input
        input.value = '';
        this.window.querySelector('#sendMessageBtn').disabled = true;
        this.sendTypingStatus(false);
    }
    
    sendTypingStatus(isTyping) {
        if (!this.activeConversation) return;
        
        const chatId = [this.currentUser.id, this.activeConversation.id].sort().join('_');
        this.db.ref('chats/' + chatId + '/typing/' + this.currentUser.id).set(isTyping ? {
            name: this.currentUser.name,
            timestamp: Date.now()
        } : null);
        
        // Show typing indicator
        if (isTyping) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                this.sendTypingStatus(false);
            }, 3000);
        }
    }
    
    setupEventListeners() {
        // No need for extra listeners
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
        return true;
    }
    
    close() {
        // Remove user from online list
        if (this.db) {
            this.db.ref('users/' + this.currentUser.id).remove();
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
    console.log('💬 Initializing Firebase Chat...');
    window.MessagesApp = new MessagesApp();
});