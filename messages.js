// messages.js - macOS Style Messages App (Fully Functional Demo)
class MessagesApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.activeConversation = null;
        this.typingTimeout = null;
        this.messageCounter = 0;
        
        // Demo conversations
        this.conversations = [
            {
                id: 1,
                name: "John Doe",
                avatar: "JD",
                online: true,
                lastMessage: "Hey, how's the macOS project going?",
                time: "10:30 AM",
                unread: 2,
                messages: [
                    { id: 1, text: "Hey! How's the macOS project going?", sender: "them", time: "10:30 AM" },
                    { id: 2, text: "It's going great! Just added a messages app 😎", sender: "me", time: "10:31 AM" },
                    { id: 3, text: "No way! That's awesome. Can we chat here?", sender: "them", time: "10:31 AM" },
                    { id: 4, text: "Yeah bro, type something and I'll reply!", sender: "me", time: "10:32 AM" }
                ]
            },
            {
                id: 2,
                name: "Sarah Smith",
                avatar: "SS",
                online: false,
                lastMessage: "When will the UI be ready?",
                time: "Yesterday",
                unread: 0,
                messages: [
                    { id: 1, text: "Love the new design!", sender: "them", time: "Yesterday" },
                    { id: 2, text: "Thanks! When will the UI be ready?", sender: "them", time: "Yesterday" },
                    { id: 3, text: "Almost done! Just polishing some details", sender: "me", time: "Yesterday" }
                ]
            },
            {
                id: 3,
                name: "Mike Johnson",
                avatar: "MJ",
                online: true,
                lastMessage: "Check out this bug I found",
                time: "2:15 PM",
                unread: 1,
                messages: [
                    { id: 1, text: "Bro, check out this bug I found", sender: "them", time: "2:15 PM" },
                    { id: 2, text: "What bug? Where?", sender: "me", time: "2:16 PM" },
                    { id: 3, text: "The windows aren't draggable properly", sender: "them", time: "2:16 PM" }
                ]
            },
            {
                id: 4,
                name: "Alex Chen",
                avatar: "AC",
                online: false,
                lastMessage: "Can you review my PR?",
                time: "Yesterday",
                unread: 0,
                messages: [
                    { id: 1, text: "Hey! Can you review my PR?", sender: "them", time: "Yesterday" },
                    { id: 2, text: "Sure, send it over!", sender: "me", time: "Yesterday" },
                    { id: 3, text: "Just created it. Let me know what you think", sender: "them", time: "Yesterday" }
                ]
            }
        ];
        
        // Demo responses
        this.demoResponses = [
            "Nice! 😎",
            "LOL that's funny",
            "how tf did you find me?",
            "This macOS emulator is insane!",
            "Can't believe this works on phone too",
            "Bro you're a legend",
            "When's the next feature coming?",
            "🔥🔥🔥",
            "Send memes pls",
            "404: Brain not found"
        ];
        
        this.init();
    }
    
    init() {
        this.createWindow();
        this.setupEventListeners();
        console.log('💬 Messages App initialized');
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
                    <div class="messages-search">
                        <input type="text" placeholder="Search conversations..." id="messageSearch">
                    </div>
                    <div class="conversations-list" id="conversationsList">
                        ${this.renderConversations()}
                    </div>
                    <div class="demo-banner">
                        <i class="fas fa-info-circle"></i>
                        <span>Demo Mode: Chat with yourself!</span>
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
    
    renderConversations() {
        return this.conversations.map(conv => `
            <div class="conversation-item ${this.activeConversation?.id === conv.id ? 'active' : ''}" data-conv-id="${conv.id}">
                <div class="conversation-avatar">
                    ${conv.avatar}
                    ${conv.online ? '<span class="online-indicator"></span>' : ''}
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">
                        <span>${conv.name}</span>
                        <span class="conversation-time">${conv.time}</span>
                    </div>
                    <div class="conversation-lastmsg">
                        ${conv.lastMessage}
                    </div>
                </div>
                ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
            </div>
        `).join('');
    }
    
    renderChatArea() {
        if (!this.activeConversation) {
            return `
                <div class="no-conversation">
                    <i class="fas fa-comment-dots"></i>
                    <span>Select a conversation to start chatting</span>
                </div>
            `;
        }
        
        const conv = this.activeConversation;
        return `
            <div class="chat-header">
                <div class="chat-header-avatar">${conv.avatar}</div>
                <div class="chat-header-info">
                    <h3>${conv.name}</h3>
                    <div class="chat-header-status">
                        ${conv.online ? '🟢 Online' : '⚪ Offline'}
                    </div>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                ${conv.messages.map(msg => this.renderMessage(msg)).join('')}
            </div>
            
            <div class="typing-indicator" id="typingIndicator" style="display: none;">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <span style="margin-left: 8px; font-size: 12px; color: rgba(255,255,255,0.5);">${conv.name} is typing...</span>
            </div>
            
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="messageInput" placeholder="Type a message...">
                <button class="chat-send-btn" id="sendMessageBtn" disabled>
                    <i class="fas fa-arrow-up"></i>
                </button>
            </div>
        `;
    }
    
    renderMessage(msg) {
        const isMe = msg.sender === 'me';
        return `
            <div class="message ${isMe ? 'outgoing' : 'incoming'}">
                ${!isMe ? `<div class="message-avatar">${this.activeConversation.avatar}</div>` : ''}
                <div class="message-bubble">
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Conversation click handler
        setTimeout(() => {
            const conversations = this.window.querySelectorAll('.conversation-item');
            conversations.forEach(conv => {
                conv.addEventListener('click', () => {
                    const convId = parseInt(conv.dataset.convId);
                    this.switchConversation(convId);
                });
            });
            
            // Search functionality
            const searchInput = this.window.querySelector('#messageSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.searchConversations(e.target.value));
            }
            
            // Message input
            const messageInput = this.window.querySelector('#messageInput');
            const sendBtn = this.window.querySelector('#sendMessageBtn');
            
            if (messageInput && sendBtn) {
                messageInput.addEventListener('input', () => {
                    sendBtn.disabled = !messageInput.value.trim();
                    this.simulateTyping();
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
    
    switchConversation(convId) {
        this.activeConversation = this.conversations.find(c => c.id === convId);
        
        // Mark as read
        if (this.activeConversation) {
            this.activeConversation.unread = 0;
        }
        
        // Re-render chat area
        const chatArea = this.window.querySelector('#chatArea');
        if (chatArea) {
            chatArea.innerHTML = this.renderChatArea();
            // Scroll to bottom
            setTimeout(() => {
                const messagesDiv = this.window.querySelector('#chatMessages');
                if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 100);
        }
        
        // Re-setup listeners
        this.setupEventListeners();
    }
    
    searchConversations(query) {
        const items = this.window.querySelectorAll('.conversation-item');
        items.forEach(item => {
            const name = item.querySelector('.conversation-name span').textContent.toLowerCase();
            if (name.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    simulateTyping() {
        if (!this.activeConversation || !this.activeConversation.online) return;
        
        const indicator = this.window.querySelector('#typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
            
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }
    
    sendMessage() {
        const input = this.window.querySelector('#messageInput');
        const messageText = input.value.trim();
        
        if (!messageText || !this.activeConversation) return;
        
        // Add message
        const newMessage = {
            id: this.messageCounter++,
            text: messageText,
            sender: 'me',
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        
        this.activeConversation.messages.push(newMessage);
        this.activeConversation.lastMessage = messageText;
        this.activeConversation.time = 'Just now';
        
        // Update last message in sidebar
        const convItem = this.window.querySelector(`[data-conv-id="${this.activeConversation.id}"] .conversation-lastmsg`);
        if (convItem) {
            convItem.textContent = messageText;
            const timeSpan = this.window.querySelector(`[data-conv-id="${this.activeConversation.id}"] .conversation-time`);
            if (timeSpan) timeSpan.textContent = 'Just now';
        }
        
        // Add message to chat
        const messagesDiv = this.window.querySelector('#chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message outgoing';
        messageEl.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${messageText}</div>
                <div class="message-time">${newMessage.time}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Clear input
        input.value = '';
        this.window.querySelector('#sendMessageBtn').disabled = true;
        
        // Hide typing indicator
        const indicator = this.window.querySelector('#typingIndicator');
        if (indicator) indicator.style.display = 'none';
        
        // Simulate reply after delay
        this.simulateReply();
    }
    
    simulateReply() {
        if (!this.activeConversation || !this.activeConversation.online) return;
        
        setTimeout(() => {
            // Show typing indicator
            const indicator = this.window.querySelector('#typingIndicator');
            if (indicator) indicator.style.display = 'flex';
            
            setTimeout(() => {
                if (!this.activeConversation) return;
                
                // Hide typing indicator
                if (indicator) indicator.style.display = 'none';
                
                // Random reply
                const randomResponse = this.demoResponses[Math.floor(Math.random() * this.demoResponses.length)];
                const replyMessage = {
                    id: this.messageCounter++,
                    text: randomResponse,
                    sender: 'them',
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                };
                
                this.activeConversation.messages.push(replyMessage);
                this.activeConversation.lastMessage = randomResponse;
                
                // Add message to chat
                const messagesDiv = this.window.querySelector('#chatMessages');
                const messageEl = document.createElement('div');
                messageEl.className = 'message incoming';
                messageEl.innerHTML = `
                    <div class="message-avatar">${this.activeConversation.avatar}</div>
                    <div class="message-bubble">
                        <div class="message-text">${randomResponse}</div>
                        <div class="message-time">${replyMessage.time}</div>
                    </div>
                `;
                
                messagesDiv.appendChild(messageEl);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 2000);
        }, 1000);
    }
    
    open() {
        this.window.style.display = 'flex';
        this.isOpen = true;
        this.bringToFront();
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
    console.log('💬 Initializing Messages App...');
    window.MessagesApp = new MessagesApp();
}); 