// calendar.js - macOS Calendar App
class CalendarApp {
    constructor() {
        this.window = null;
        this.isOpen = false;
        this.currentView = 'month'; // month, week, day, year
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.calendars = [
            { id: 'personal', name: 'Personal', color: '#007AFF', visible: true },
            { id: 'work', name: 'Work', color: '#FF3B30', visible: true },
            { id: 'family', name: 'Family', color: '#34C759', visible: true },
            { id: 'holidays', name: 'Holidays', color: '#FF9500', visible: true }
        ];
        this.eventModal = null;
        this.notificationTimeout = null;
        
        this.init();
    }
    
    init() {
        this.createWindow();
        this.loadSampleEvents();
        this.setupEventListeners();
        this.renderCalendar();
        console.log('📅 Calendar initialized');
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.className = 'window calendar-window';
        this.window.style.cssText = `
            position: fixed;
            top: 100px;
            left: 150px;
            width: 1100px;
            height: 750px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 10px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
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
                <div class="window-title">Calendar</div>
            </div>
            
            <div class="calendar-container">
                <!-- Sidebar -->
                <div class="calendar-sidebar">
                    <div class="calendar-mini">
                        <div class="mini-header">
                            <span class="mini-title" id="miniMonthYear">March 2026</span>
                            <div class="mini-nav">
                                <button class="mini-nav-btn" id="miniPrevBtn">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="mini-nav-btn" id="miniNextBtn">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="mini-weekdays">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                        
                        <div class="mini-days" id="miniDays"></div>
                    </div>
                    
                    <div class="calendars-section">
                        <div class="section-title">My Calendars</div>
                        <div id="calendarsList">
                            ${this.calendars.map(cal => `
                                <div class="calendar-item active" data-calendar="${cal.id}">
                                    <div class="calendar-color" style="background: ${cal.color};"></div>
                                    <span class="calendar-name">${cal.name}</span>
                                    <div class="calendar-checkbox">
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="quick-actions">
                        <div class="action-link" id="showTodayBtn">
                            <i class="fas fa-calendar-day"></i>
                            <span>Show Today</span>
                        </div>
                        <div class="action-link" id="newEventBtn">
                            <i class="fas fa-plus-circle"></i>
                            <span>New Event</span>
                        </div>
                        <div class="action-link" id="addCalendarBtn">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Add Calendar</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: auto; padding: 15px;">
                        <div style="font-size: 11px; color: #999; margin-bottom: 5px;">
                            <i class="fas fa-cloud"></i> iCloud
                        </div>
                        <div style="font-size: 12px; color: #333;">
                            ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="calendar-main">
                    <!-- Toolbar -->
                    <div class="calendar-toolbar">
                        <div class="toolbar-group">
                            <button class="toolbar-btn" id="todayBtn" title="Today">
                                Today
                            </button>
                            <button class="toolbar-btn" id="prevBtn" title="Previous">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="toolbar-btn" id="nextBtn" title="Next">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <div class="view-controls">
                            <button class="view-btn ${this.currentView === 'month' ? 'active' : ''}" data-view="month">Month</button>
                            <button class="view-btn ${this.currentView === 'week' ? 'active' : ''}" data-view="week">Week</button>
                            <button class="view-btn ${this.currentView === 'day' ? 'active' : ''}" data-view="day">Day</button>
                            <button class="view-btn ${this.currentView === 'year' ? 'active' : ''}" data-view="year">Year</button>
                        </div>
                        
                        <div class="date-display" id="dateDisplay">March 2026</div>
                        
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="search-input" placeholder="Search" id="searchInput">
                        </div>
                        
                        <button class="toolbar-btn" id="settingsBtn" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                    
                    <!-- Calendar Views -->
                    <div class="calendar-content">
                        <!-- Month View -->
                        <div class="month-view ${this.currentView === 'month' ? 'active' : ''}" id="monthView">
                            <div class="month-header">
                                <span>Sunday</span><span>Monday</span><span>Tuesday</span><span>Wednesday</span>
                                <span>Thursday</span><span>Friday</span><span>Saturday</span>
                            </div>
                            <div class="month-grid" id="monthGrid"></div>
                        </div>
                        
                        <!-- Week View -->
                        <div class="week-view ${this.currentView === 'week' ? 'active' : ''}" id="weekView">
                            <div class="week-header" id="weekHeader"></div>
                            <div class="week-grid" id="weekGrid"></div>
                        </div>
                        
                        <!-- Day View -->
                        <div class="day-view ${this.currentView === 'day' ? 'active' : ''}" id="dayView">
                            <div class="day-header" id="dayHeader"></div>
                            <div class="day-timeline" id="dayTimeline"></div>
                        </div>
                        
                        <!-- Year View -->
                        <div class="year-view ${this.currentView === 'year' ? 'active' : ''}" id="yearView">
                            <div class="year-header">
                                <h1 class="year-title" id="yearTitle">2026</h1>
                            </div>
                            <div class="year-months" id="yearMonths"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Event Modal -->
            <div class="event-modal" id="eventModal">
                <div class="modal-header">
                    <h3 class="modal-title" id="modalTitle">New Event</h3>
                    <button class="modal-close" id="closeModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" id="eventTitle" placeholder="Meeting, task, etc.">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Calendar</label>
                        <select class="calendar-select" id="eventCalendar">
                            ${this.calendars.map(cal => `
                                <option value="${cal.id}" style="color: ${cal.color};">${cal.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Starts</label>
                        <div class="datetime-group">
                            <input type="date" class="form-input" id="eventStartDate">
                            <input type="time" class="form-input" id="eventStartTime" value="09:00">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Ends</label>
                        <div class="datetime-group">
                            <input type="date" class="form-input" id="eventEndDate">
                            <input type="time" class="form-input" id="eventEndTime" value="10:00">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="allDayCheck"> All-day
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" id="eventLocation" placeholder="Add location">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="form-input" id="eventNotes" rows="3" placeholder="Add notes..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <div class="color-options" id="colorOptions">
                            <div class="color-option selected" style="background: #007AFF;" data-color="#007AFF"></div>
                            <div class="color-option" style="background: #FF3B30;" data-color="#FF3B30"></div>
                            <div class="color-option" style="background: #34C759;" data-color="#34C759"></div>
                            <div class="color-option" style="background: #FF9500;" data-color="#FF9500"></div>
                            <div class="color-option" style="background: #AF52DE;" data-color="#AF52DE"></div>
                            <div class="color-option" style="background: #FF2D55;" data-color="#FF2D55"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-secondary" id="deleteEventBtn" style="display: none;">Delete</button>
                    <button class="modal-btn modal-btn-secondary" id="cancelEventBtn">Cancel</button>
                    <button class="modal-btn modal-btn-primary" id="saveEventBtn">Save</button>
                </div>
            </div>
            
            <!-- Notifications Container -->
            <div id="notificationsContainer"></div>
        `;
        
        document.body.appendChild(this.window);
        this.eventModal = this.window.querySelector('#eventModal');
    }
    
    setupEventListeners() {
        // Window controls
        this.window.querySelector('.window-close').addEventListener('click', () => this.close());
        this.window.querySelector('.window-minimize').addEventListener('click', () => this.minimize());
        this.window.querySelector('.window-zoom').addEventListener('click', () => this.zoom());
        
        // Navigation
        this.window.querySelector('#todayBtn').addEventListener('click', () => this.goToToday());
        this.window.querySelector('#prevBtn').addEventListener('click', () => this.navigatePrev());
        this.window.querySelector('#nextBtn').addEventListener('click', () => this.navigateNext());
        this.window.querySelector('#showTodayBtn').addEventListener('click', () => this.goToToday());
        
        // Mini calendar navigation
        this.window.querySelector('#miniPrevBtn').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateMiniCalendar();
        });
        
        this.window.querySelector('#miniNextBtn').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateMiniCalendar();
        });
        
        // View controls
        this.window.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
        
        // Calendar items
        this.window.querySelectorAll('.calendar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.calendar-checkbox')) {
                    item.classList.toggle('active');
                    const calendarId = item.dataset.calendar;
                    const calendar = this.calendars.find(c => c.id === calendarId);
                    if (calendar) {
                        calendar.visible = item.classList.contains('active');
                        this.renderCalendar();
                    }
                }
            });
        });
        
        // New event button
        this.window.querySelector('#newEventBtn').addEventListener('click', () => this.showEventModal());
        this.window.querySelector('#addCalendarBtn').addEventListener('click', () => this.addNewCalendar());
        
        // Modal buttons
        this.window.querySelector('#closeModalBtn').addEventListener('click', () => this.hideEventModal());
        this.window.querySelector('#cancelEventBtn').addEventListener('click', () => this.hideEventModal());
        this.window.querySelector('#saveEventBtn').addEventListener('click', () => this.saveEvent());
        
        // Color options
        this.window.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                this.window.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // All-day checkbox
        const allDayCheck = this.window.querySelector('#allDayCheck');
        const startTime = this.window.querySelector('#eventStartTime');
        const endTime = this.window.querySelector('#eventEndTime');
        
        allDayCheck.addEventListener('change', () => {
            if (allDayCheck.checked) {
                startTime.disabled = true;
                endTime.disabled = true;
                startTime.value = '';
                endTime.value = '';
            } else {
                startTime.disabled = false;
                endTime.disabled = false;
                startTime.value = '09:00';
                endTime.value = '10:00';
            }
        });
        
        // Search
        this.window.querySelector('#searchInput').addEventListener('input', (e) => {
            this.searchEvents(e.target.value);
        });
        
        // Settings
        this.window.querySelector('#settingsBtn').addEventListener('click', () => {
            this.showNotification('Settings would open here', 'info');
        });
        
        // Make window draggable
        this.makeDraggable();
    }
    
    loadSampleEvents() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        this.events = [
            {
                id: '1',
                title: 'Team Meeting',
                calendar: 'work',
                start: new Date(today.setHours(10, 0, 0, 0)),
                end: new Date(today.setHours(11, 0, 0, 0)),
                location: 'Conference Room A',
                notes: 'Weekly sync with the team',
                color: '#FF3B30'
            },
            {
                id: '2',
                title: 'Lunch with Sarah',
                calendar: 'personal',
                start: new Date(today.setHours(12, 30, 0, 0)),
                end: new Date(today.setHours(13, 30, 0, 0)),
                location: 'Cafe Milano',
                notes: 'Catch up over lunch',
                color: '#007AFF'
            },
            {
                id: '3',
                title: 'Project Deadline',
                calendar: 'work',
                start: new Date(tomorrow.setHours(17, 0, 0, 0)),
                end: new Date(tomorrow.setHours(18, 0, 0, 0)),
                location: 'Office',
                notes: 'Submit final deliverables',
                color: '#FF3B30'
            },
            {
                id: '4',
                title: 'Birthday Party',
                calendar: 'family',
                start: new Date(nextWeek.setHours(19, 0, 0, 0)),
                end: new Date(nextWeek.setHours(23, 0, 0, 0)),
                location: 'Home',
                notes: "Mom's 60th birthday",
                color: '#34C759'
            },
            {
                id: '5',
                title: 'Doctor Appointment',
                calendar: 'personal',
                start: new Date(today.setHours(15, 0, 0, 0)),
                end: new Date(today.setHours(16, 0, 0, 0)),
                location: 'Medical Center',
                notes: 'Annual checkup',
                color: '#FF9500'
            }
        ];
    }
    
    renderCalendar() {
        this.updateDateDisplay();
        this.updateMiniCalendar();
        
        switch(this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
            case 'year':
                this.renderYearView();
                break;
        }
    }
    
    renderMonthView() {
        const grid = this.window.querySelector('#monthGrid');
        if (!grid) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        grid.innerHTML = '';
        
        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = cellDate.getMonth() === month;
            const isToday = this.isSameDay(cellDate, new Date());
            const isSelected = this.isSameDay(cellDate, this.selectedDate);
            
            const cellEvents = this.getEventsForDate(cellDate);
            const visibleEvents = cellEvents.slice(0, 3);
            const remainingCount = cellEvents.length - 3;
            
            const cell = document.createElement('div');
            cell.className = `month-cell ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
            cell.dataset.date = cellDate.toISOString();
            
            cell.innerHTML = `
                <div class="cell-header">
                    <span class="cell-date">${cellDate.getDate()}</span>
                    <button class="add-event-btn" title="Add event">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cell-events">
                    ${visibleEvents.map(event => `
                        <div class="cell-event" style="background: ${event.color};" data-event-id="${event.id}">
                            ${event.title}
                        </div>
                    `).join('')}
                    ${remainingCount > 0 ? `<div class="event-more">+${remainingCount} more</div>` : ''}
                </div>
            `;
            
            // Add event button
            cell.querySelector('.add-event-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEventModal(cellDate);
            });
            
            // Event click
            cell.querySelectorAll('.cell-event').forEach(eventEl => {
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const eventId = e.currentTarget.dataset.eventId;
                    this.editEvent(eventId);
                });
            });
            
            // Cell click
            cell.addEventListener('click', () => {
                this.selectedDate = cellDate;
                this.renderCalendar();
            });
            
            grid.appendChild(cell);
        }
    }
    
    renderWeekView() {
        const header = this.window.querySelector('#weekHeader');
        const grid = this.window.querySelector('#weekGrid');
        if (!header || !grid) return;
        
        const startOfWeek = this.getStartOfWeek(this.currentDate);
        
        // Render header
        header.innerHTML = `
            <div class="week-header-cell"></div>
            ${Array.from({ length: 7 }, (_, i) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const isToday = this.isSameDay(date, new Date());
                return `
                    <div class="week-header-cell">
                        <div class="week-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div class="week-date ${isToday ? 'today' : ''}">${date.getDate()}</div>
                    </div>
                `;
            }).join('')}
        `;
        
        // Render time grid
        grid.innerHTML = '';
        
        // Time column
        const timeColumn = document.createElement('div');
        timeColumn.className = 'time-column';
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = hour === 0 ? '12 AM' : 
                                 hour < 12 ? `${hour} AM` : 
                                 hour === 12 ? '12 PM' : `${hour - 12} PM`;
            timeColumn.appendChild(timeSlot);
        }
        grid.appendChild(timeColumn);
        
        // Day columns
        for (let day = 0; day < 7; day++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + day);
            
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            dayColumn.dataset.date = date.toISOString();
            
            for (let hour = 0; hour < 24; hour++) {
                const slot = document.createElement('div');
                slot.className = 'day-slot';
                slot.dataset.hour = hour;
                slot.dataset.date = date.toISOString();
                
                slot.addEventListener('click', () => {
                    const eventDate = new Date(date);
                    eventDate.setHours(hour, 0, 0, 0);
                    this.showEventModal(eventDate);
                });
                
                dayColumn.appendChild(slot);
            }
            
            // Add events for this day
            const dayEvents = this.getEventsForDate(date);
            dayEvents.forEach(event => {
                const startHour = event.start.getHours();
                const duration = (event.end - event.start) / (1000 * 60 * 60); // hours
                const top = startHour * 60; // 60px per hour
                const height = duration * 60;
                
                const eventEl = document.createElement('div');
                eventEl.className = 'week-event';
                eventEl.style.cssText = `
                    top: ${top}px;
                    height: ${height}px;
                    background: ${event.color};
                `;
                eventEl.textContent = event.title;
                eventEl.dataset.eventId = event.id;
                
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editEvent(event.id);
                });
                
                dayColumn.appendChild(eventEl);
            });
            
            grid.appendChild(dayColumn);
        }
    }
    
    renderDayView() {
        const header = this.window.querySelector('#dayHeader');
        const timeline = this.window.querySelector('#dayTimeline');
        if (!header || !timeline) return;
        
        const date = this.selectedDate;
        const isToday = this.isSameDay(date, new Date());
        
        header.innerHTML = `
            <h2 class="day-title">${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            <p class="day-subtitle">${isToday ? 'Today' : ''}</p>
        `;
        
        timeline.innerHTML = '';
        
        const dayEvents = this.getEventsForDate(date);
        
        for (let hour = 0; hour < 24; hour++) {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'timeline-hour';
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'hour-label';
            timeLabel.textContent = hour === 0 ? '12 AM' : 
                                   hour < 12 ? `${hour} AM` : 
                                   hour === 12 ? '12 PM' : `${hour - 12} PM`;
            
            const eventsDiv = document.createElement('div');
            eventsDiv.className = 'hour-events';
            
            // Add events at this hour
            const hourEvents = dayEvents.filter(event => 
                event.start.getHours() === hour || 
                (event.start.getHours() < hour && event.end.getHours() > hour)
            );
            
            hourEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'day-event';
                eventEl.style.background = event.color;
                eventEl.dataset.eventId = event.id;
                
                eventEl.innerHTML = `
                    <div class="event-time">
                        ${event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                        ${event.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div class="event-title">${event.title}</div>
                    ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
                `;
                
                eventEl.addEventListener('click', () => this.editEvent(event.id));
                
                eventsDiv.appendChild(eventEl);
            });
            
            hourDiv.appendChild(timeLabel);
            hourDiv.appendChild(eventsDiv);
            timeline.appendChild(hourDiv);
        }
    }
    
    renderYearView() {
        const yearMonths = this.window.querySelector('#yearMonths');
        if (!yearMonths) return;
        
        const year = this.currentDate.getFullYear();
        this.window.querySelector('#yearTitle').textContent = year;
        
        yearMonths.innerHTML = '';
        
        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'year-month';
            
            const firstDay = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            monthDiv.innerHTML = `
                <h3 class="year-month-name" data-month="${month}">
                    ${firstDay.toLocaleDateString('en-US', { month: 'long' })}
                </h3>
                <div class="year-month-days">
                    <span class="year-weekday">S</span>
                    <span class="year-weekday">M</span>
                    <span class="year-weekday">T</span>
                    <span class="year-weekday">W</span>
                    <span class="year-weekday">T</span>
                    <span class="year-weekday">F</span>
                    <span class="year-weekday">S</span>
                </div>
            `;
            
            const daysGrid = document.createElement('div');
            daysGrid.className = 'year-month-days';
            
            // Add empty cells for days before month starts
            const startDay = firstDay.getDay();
            for (let i = 0; i < startDay; i++) {
                daysGrid.appendChild(document.createElement('div'));
            }
            
            // Add days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const isToday = this.isSameDay(date, new Date());
                const hasEvents = this.getEventsForDate(date).length > 0;
                
                const dayEl = document.createElement('div');
                dayEl.className = `year-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`;
                dayEl.textContent = day;
                dayEl.dataset.date = date.toISOString();
                
                dayEl.addEventListener('click', () => {
                    this.selectedDate = date;
                    this.currentDate = date;
                    this.switchView('month');
                    this.renderCalendar();
                });
                
                daysGrid.appendChild(dayEl);
            }
            
            monthDiv.appendChild(daysGrid);
            
            // Click on month name
            monthDiv.querySelector('.year-month-name').addEventListener('click', () => {
                this.currentDate = new Date(year, month, 1);
                this.switchView('month');
                this.renderCalendar();
            });
            
            yearMonths.appendChild(monthDiv);
        }
    }
    
    updateMiniCalendar() {
        const miniDays = this.window.querySelector('#miniDays');
        const miniMonthYear = this.window.querySelector('#miniMonthYear');
        if (!miniDays || !miniMonthYear) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        miniMonthYear.textContent = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        miniDays.innerHTML = '';
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = this.isSameDay(date, new Date());
            const isSelected = this.isSameDay(date, this.selectedDate);
            const hasEvents = this.getEventsForDate(date).length > 0;
            
            const dayEl = document.createElement('div');
            dayEl.className = `mini-day ${isCurrentMonth ? '' : 'other-month'} 
                              ${isToday ? 'today' : ''} 
                              ${isSelected ? 'selected' : ''}
                              ${hasEvents ? 'has-events' : ''}`;
            dayEl.textContent = date.getDate();
            dayEl.dataset.date = date.toISOString();
            
            dayEl.addEventListener('click', () => {
                this.selectedDate = date;
                this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
                this.updateMiniCalendar();
                this.renderCalendar();
            });
            
            miniDays.appendChild(dayEl);
        }
    }
    
    updateDateDisplay() {
        const display = this.window.querySelector('#dateDisplay');
        if (!display) return;
        
        switch(this.currentView) {
            case 'month':
                display.textContent = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                break;
            case 'week':
                const startOfWeek = this.getStartOfWeek(this.currentDate);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                display.textContent = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                break;
            case 'day':
                display.textContent = this.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                break;
            case 'year':
                display.textContent = this.currentDate.getFullYear();
                break;
        }
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active view button
        this.window.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        const views = ['monthView', 'weekView', 'dayView', 'yearView'];
        views.forEach(viewId => {
            const element = this.window.querySelector(`#${viewId}`);
            if (element) {
                element.classList.toggle('active', viewId === `${view}View`);
            }
        });
        
        this.renderCalendar();
    }
    
    navigatePrev() {
        switch(this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() - 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() - 1);
                this.selectedDate = new Date(this.currentDate);
                break;
            case 'year':
                this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
                break;
        }
        this.renderCalendar();
    }
    
    navigateNext() {
        switch(this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                this.selectedDate = new Date(this.currentDate);
                break;
            case 'year':
                this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
                break;
        }
        this.renderCalendar();
    }
    
    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.renderCalendar();
    }
    
    showEventModal(date = null) {
        const modal = this.eventModal;
        if (!modal) return;
        
        // Reset form
        this.window.querySelector('#eventTitle').value = '';
        this.window.querySelector('#eventLocation').value = '';
        this.window.querySelector('#eventNotes').value = '';
        this.window.querySelector('#allDayCheck').checked = false;
        this.window.querySelector('#eventStartTime').disabled = false;
        this.window.querySelector('#eventEndTime').disabled = false;
        this.window.querySelector('#deleteEventBtn').style.display = 'none';
        
        // Set dates
        const startDate = date || new Date();
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);
        
        this.window.querySelector('#eventStartDate').value = this.formatDateForInput(startDate);
        this.window.querySelector('#eventEndDate').value = this.formatDateForInput(endDate);
        this.window.querySelector('#eventStartTime').value = this.formatTimeForInput(startDate);
        this.window.querySelector('#eventEndTime').value = this.formatTimeForInput(endDate);
        
        // Reset color selection
        this.window.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        this.window.querySelector('.color-option').classList.add('selected');
        
        modal.classList.add('active');
        this.window.querySelector('#eventTitle').focus();
    }
    
    hideEventModal() {
        this.eventModal.classList.remove('active');
    }
    
    saveEvent() {
        const title = this.window.querySelector('#eventTitle').value;
        if (!title) {
            this.showNotification('Please enter an event title', 'error');
            return;
        }
        
        const calendar = this.window.querySelector('#eventCalendar').value;
        const startDate = this.window.querySelector('#eventStartDate').value;
        const endDate = this.window.querySelector('#eventEndDate').value;
        const startTime = this.window.querySelector('#eventStartTime').value;
        const endTime = this.window.querySelector('#eventEndTime').value;
        const allDay = this.window.querySelector('#allDayCheck').checked;
        const location = this.window.querySelector('#eventLocation').value;
        const notes = this.window.querySelector('#eventNotes').value;
        const selectedColor = this.window.querySelector('.color-option.selected');
        const color = selectedColor ? selectedColor.dataset.color : '#007AFF';
        
        const start = new Date(`${startDate}T${allDay ? '00:00' : startTime}`);
        const end = new Date(`${endDate}T${allDay ? '23:59' : endTime}`);
        
        const newEvent = {
            id: 'event_' + Date.now(),
            title,
            calendar,
            start,
            end,
            location,
            notes,
            color
        };
        
        this.events.push(newEvent);
        this.hideEventModal();
        this.renderCalendar();
        this.showNotification('Event created successfully', 'success');
    }
    
    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        const modal = this.eventModal;
        
        this.window.querySelector('#modalTitle').textContent = 'Edit Event';
        this.window.querySelector('#eventTitle').value = event.title;
        this.window.querySelector('#eventCalendar').value = event.calendar;
        this.window.querySelector('#eventLocation').value = event.location || '';
        this.window.querySelector('#eventNotes').value = event.notes || '';
        
        this.window.querySelector('#eventStartDate').value = this.formatDateForInput(event.start);
        this.window.querySelector('#eventEndDate').value = this.formatDateForInput(event.end);
        this.window.querySelector('#eventStartTime').value = this.formatTimeForInput(event.start);
        this.window.querySelector('#eventEndTime').value = this.formatTimeForInput(event.end);
        
        // Set color
        this.window.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.color === event.color);
        });
        
        // Show delete button
        const deleteBtn = this.window.querySelector('#deleteEventBtn');
        deleteBtn.style.display = 'inline-block';
        deleteBtn.onclick = () => this.deleteEvent(event.id);
        
        // Save button
        this.window.querySelector('#saveEventBtn').onclick = () => this.updateEvent(event.id);
        
        modal.classList.add('active');
    }
    
    updateEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        event.title = this.window.querySelector('#eventTitle').value;
        event.calendar = this.window.querySelector('#eventCalendar').value;
        event.location = this.window.querySelector('#eventLocation').value;
        event.notes = this.window.querySelector('#eventNotes').value;
        
        const startDate = this.window.querySelector('#eventStartDate').value;
        const endDate = this.window.querySelector('#eventEndDate').value;
        const startTime = this.window.querySelector('#eventStartTime').value;
        const endTime = this.window.querySelector('#eventEndTime').value;
        const allDay = this.window.querySelector('#allDayCheck').checked;
        
        event.start = new Date(`${startDate}T${allDay ? '00:00' : startTime}`);
        event.end = new Date(`${endDate}T${allDay ? '23:59' : endTime}`);
        
        const selectedColor = this.window.querySelector('.color-option.selected');
        event.color = selectedColor ? selectedColor.dataset.color : event.color;
        
        this.hideEventModal();
        this.renderCalendar();
        this.showNotification('Event updated successfully', 'success');
    }
    
    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.hideEventModal();
            this.renderCalendar();
            this.showNotification('Event deleted', 'info');
        }
    }
    
    addNewCalendar() {
        const name = prompt('Enter calendar name:');
        if (!name) return;
        
        const colors = ['#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#FF2D55'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const newCalendar = {
            id: 'cal_' + Date.now(),
            name,
            color,
            visible: true
        };
        
        this.calendars.push(newCalendar);
        
        // Refresh calendars list
        const calendarsList = this.window.querySelector('#calendarsList');
        calendarsList.innerHTML += `
            <div class="calendar-item active" data-calendar="${newCalendar.id}">
                <div class="calendar-color" style="background: ${newCalendar.color};"></div>
                <span class="calendar-name">${newCalendar.name}</span>
                <div class="calendar-checkbox">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        `;
        
        // Add event listener
        const newItem = calendarsList.lastElementChild;
        newItem.addEventListener('click', (e) => {
            if (e.target.closest('.calendar-checkbox')) {
                newItem.classList.toggle('active');
                newCalendar.visible = newItem.classList.contains('active');
                this.renderCalendar();
            }
        });
        
        this.showNotification(`Calendar "${name}" created`, 'success');
    }
    
    searchEvents(query) {
        if (!query) {
            this.renderCalendar();
            return;
        }
        
        const filteredEvents = this.events.filter(event => 
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.location?.toLowerCase().includes(query.toLowerCase()) ||
            event.notes?.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredEvents.length === 0) {
            this.showNotification('No events found', 'info');
        } else {
            this.showNotification(`Found ${filteredEvents.length} events`, 'success');
        }
    }
    
    getEventsForDate(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        return this.events.filter(event => {
            const calendar = this.calendars.find(c => c.id === event.calendar);
            return calendar && calendar.visible && 
                   ((event.start >= startOfDay && event.start <= endOfDay) ||
                    (event.end >= startOfDay && event.end <= endOfDay) ||
                    (event.start <= startOfDay && event.end >= endOfDay));
        }).sort((a, b) => a.start - b.start);
    }
    
    getStartOfWeek(date) {
        const result = new Date(date);
        const day = result.getDay();
        result.setDate(result.getDate() - day);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    formatTimeForInput(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    showNotification(message, type = 'info') {
        const container = this.window.querySelector('#notificationsContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    open() {
        console.log('📅 Opening Calendar');
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

// Initialize Calendar App
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing Calendar App...');
    try {
        window.CalendarApp = new CalendarApp();
        console.log('✅ Calendar App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Calendar App:', error);
    }
}); 