// Terminal App - Complete Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create terminal window HTML
    function createTerminalWindow() {
        if (document.querySelector('.terminal-window')) return;
        
        const terminalHTML = `
            <div class="window terminal-window" data-window="terminal" style="width: 800px; height: 500px; display: none; position: absolute;">
                <div class="window-header">
                    <div class="window-controls">
                        <span class="window-close"></span>
                        <span class="window-minimize"></span>
                        <span class="window-zoom"></span>
                    </div>
                    <div class="window-title">Terminal</div>
                </div>
                <div class="terminal-content" id="terminal-content">
                    <div class="terminal-line">
                        <span class="terminal-prompt terminal-prompt-user">user@macosnx:~$</span>
                        <span>Welcome to macOS Terminal v1.0</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-prompt terminal-prompt-user">user@macosnx:~$</span>
                        <span>Type 'help' for available commands</span>
                    </div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt terminal-prompt-user" id="terminal-current-prompt">user@macosnx:~$</span>
                        <input type="text" id="terminal-input" class="terminal-input" autofocus>
                        <span class="terminal-cursor"></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', terminalHTML);
    }
    
    createTerminalWindow();

    // --- Terminal State ---
    const Terminal = {
        element: document.querySelector('.terminal-window'),
        content: document.getElementById('terminal-content'),
        input: document.getElementById('terminal-input'),
        prompt: document.getElementById('terminal-current-prompt'),
        
        history: [],
        historyIndex: -1,
        currentDirectory: '/home/user',
        username: 'user',
        hostname: 'macosnx',
        theme: 'default',
        
        // File system simulation
        filesystem: {
            '/': {
                type: 'dir',
                children: ['home', 'usr', 'bin', 'etc', 'var', 'tmp', 'Applications']
            },
            '/home': {
                type: 'dir',
                children: ['user']
            },
            '/home/user': {
                type: 'dir',
                children: ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos', '.hidden']
            },
            '/home/user/Desktop': { type: 'dir', children: [] },
            '/home/user/Documents': { type: 'dir', children: ['notes.txt', 'project.md'] },
            '/home/user/Downloads': { type: 'dir', children: [] },
            '/home/user/Music': { type: 'dir', children: ['song.mp3'] },
            '/home/user/Pictures': { type: 'dir', children: ['photo.jpg'] },
            '/home/user/.hidden': { type: 'dir', children: ['secret.txt'] },
            '/home/user/Documents/notes.txt': { type: 'file', content: 'Remember to buy milk' },
            '/home/user/Documents/project.md': { type: 'file', content: '# Project Plan\n\n1. Build terminal\n2. Add features\n3. Profit' },
            '/home/user/Music/song.mp3': { type: 'file', content: 'MP3 data would be here' },
            '/home/user/Pictures/photo.jpg': { type: 'file', content: 'JPG data would be here' }
        },
        
        // Processes
        processes: [
            { pid: 1, name: 'init', cpu: '0.1%', mem: '0.1%' },
            { pid: 2, name: 'terminal', cpu: '1.2%', mem: '2.3%' }
        ],
        
        // Environment variables
        env: {
            PATH: '/usr/local/bin:/usr/bin:/bin',
            HOME: '/home/user',
            USER: 'user',
            SHELL: '/bin/bash'
        },
        
        // ASCII arts collection
        asciiArts: {
            logo: [
                "                   ╔══════════════════════════════╗",
                "                  ║  macOS Terminal Emulator    ║",
                "                   ╚══════════════════════════════╝",
                "                                 ",
                "        ███╗   ███╗ █████╗  ██████╗ ██████╗ ███████╗",
                "        ████╗ ████║██╔══██╗██╔══██╗██╔══██╗██╔════╝",
                "        ██╔████╔██║███████║██║  ██║██████╔╝███████╗",
                "        ██║╚██╔╝██║██╔══██║██║  ██║██╔══██╗╚════██║",
                "        ██║ ╚═╝ ██║██║  ██║██████╔╝██████╔╝███████║",
                "        ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝",
                "                                 ",
                "        Welcome to the macOS Terminal!"
            ],
            
            cow: [
                "        _______________________",
                "       < Hello from the cow! >",
                "        -----------------------",
                "               \\   ^__^",
                "                \\  (oo)\\_______",
                "                   (__)\\       )\\/\\",
                "                       ||----w |",
                "                       ||     ||"
            ],
            
            dragon: [
                "                       __====-_  _-====__",
                "          _--^^^#####//      \\\\#####^^^--_",
                "       _-^##########// (    ) \\\\##########^-_",
                "      -############//  |\\^^/|  \\\\############-",
                "    _/############//   (@::@)   \\\\############\\_",
                "   /#############((     \\\\//     ))#############\\",
                "  -###############\\\\    (oo)    //###############-",
                " -#################\\\\  / UUU \\  //#################-",
                " -###################\\\\/  (_)  \\//###################-",
                " _#/|##########/\\#####(   / )#####/\\##########|\\#_",
                " |/ |#/\\#/\\#/\\/  \\#/\\##\\ ! Y ! /##/\\#/  \\/\\#/\\#/\\| \\|"
            ],
            
            matrix: [
                "01001110 01100101 01101111 01101110",
                "01010100 01100101 01100011 01101000",
                "01010100 01100101 01100001 01101101",
                "01001001 01110011 00100000 01001100",
                "01101001 01100110 01100101 00101110",
                "00101110 00101110 00100000 01010111",
                "01100001 01101011 01100101 00100000",
                "01110101 01110000 00101110"
            ]
        },
        
        // Easter eggs
        easterEggs: {
            '42': 'The answer to life, the universe, and everything.',
            'unix': 'Unix is simple. It just takes a genius to understand its simplicity.',
            'sudo': 'Nice try. This is just an emulator, but you feel powerful, right?',
            'matrix': 'Follow the white rabbit. 🐰',
            'hello world': 'Hello, human. I\'ve been expecting you.',
            'hack': 'INITIATING HACK... Just kidding, this is just a demo!',
            'coffee': '☕ Here\'s a virtual coffee. Drink responsibly.',
            'beer': '🍺 Cheers! Don\'t drink and code.',
            'love': '❤️ Love is in the air... or is that just the smell of code?',
            'secret': 'You found the secret command! The treasure was the friends we made along the way.',
            'conjure': '✨ *poof* You are now a wizard. Wear the hat with pride.',
            'dance': '💃 🕺 Terminal is now dancing!'
        }
    };

    // --- Command Handlers ---
    const Commands = {
        // Basic commands
        help: (args) => {
            const commands = [
                '=== Available Commands ===',
                '',
                'File Operations:',
                '  ls [path]           - List directory contents',
                '  cd [path]           - Change directory',
                '  pwd                 - Print working directory',
                '  cat [file]          - Display file contents',
                '  touch [file]        - Create empty file',
                '  mkdir [dir]         - Create directory',
                '  rm [file]           - Remove file',
                '  cp [src] [dest]     - Copy file',
                '  mv [src] [dest]     - Move file',
                '',
                'System Info:',
                '  whoami              - Display current user',
                '  hostname            - Display system hostname',
                '  date                - Show current date/time',
                '  uptime              - Show how long terminal has been open',
                '  uname [-a]          - Print system information',
                '  df                  - Show disk usage',
                '  ps                  - List processes',
                '  kill [pid]          - Kill process (just for fun)',
                '',
                'Fun Commands:',
                '  fortune             - Display a random fortune',
                '  cowsay [text]       - Make a cow say something',
                '  matrix               - Enter the matrix',
                '  ascii [logo|cow|dragon] - Show ASCII art',
                '  weather              - Display fake weather',
                '  hack                 - Look like a hacker',
                '  roll [sides]         - Roll a dice',
                '  flip                 - Flip a coin',
                '',
                'Terminal Controls:',
                '  clear               - Clear terminal screen',
                '  theme [green|amber|white|hacker] - Change theme',
                '  color               - Cycle through text colors',
                '  exit                - Close terminal',
                '  echo [text]         - Print text',
                '  export [VAR=value]  - Set environment variable',
                '  env                 - Show environment variables',
                '',
                'Easter Eggs:',
                '  Type "42", "unix", "sudo", "secret", "dance"',
                '',
                '=== Type any command to begin ==='
            ];
            return commands.join('\n');
        },

        ls: (args) => {
            const showAll = args.includes('-a');
            const path = args.filter(a => !a.startsWith('-'))[0] || '.';
            const fullPath = Terminal.resolvePath(path);
            
            const dir = Terminal.filesystem[fullPath];
            if (!dir || dir.type !== 'dir') {
                return { error: `ls: ${path}: No such directory` };
            }
            
            let files = dir.children || [];
            if (!showAll) {
                files = files.filter(f => !f.startsWith('.'));
            }
            
            // Add file type indicators
            const output = files.map(file => {
                const filePath = fullPath === '/' ? fullPath + file : fullPath + '/' + file;
                const fileObj = Terminal.filesystem[filePath];
                if (fileObj && fileObj.type === 'dir') {
                    return file + '/';
                } else if (fileObj && fileObj.executable) {
                    return file + '*';
                }
                return file;
            }).join('    ');
            
            return output || '(empty)';
        },

        cd: (args) => {
            const path = args[0] || '/home/user';
            const newPath = Terminal.resolvePath(path);
            
            const dir = Terminal.filesystem[newPath];
            if (!dir || dir.type !== 'dir') {
                return { error: `cd: ${path}: No such directory` };
            }
            
            Terminal.currentDirectory = newPath;
            Terminal.updatePrompt();
            return null; // No output for cd
        },

        pwd: () => {
            return Terminal.currentDirectory;
        },

        cat: (args) => {
            if (!args[0]) return { error: 'cat: missing file operand' };
            
            const filePath = Terminal.resolvePath(args[0]);
            const file = Terminal.filesystem[filePath];
            
            if (!file) return { error: `cat: ${args[0]}: No such file` };
            if (file.type === 'dir') return { error: `cat: ${args[0]}: Is a directory` };
            
            return file.content || '(empty file)';
        },

        touch: (args) => {
            if (!args[0]) return { error: 'touch: missing file operand' };
            
            const filePath = Terminal.resolvePath(args[0]);
            if (Terminal.filesystem[filePath]) {
                return `touch: ${args[0]}: File already exists`;
            }
            
            Terminal.filesystem[filePath] = { type: 'file', content: '' };
            
            // Add to parent directory's children
            const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
            const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
            const parent = Terminal.filesystem[parentPath];
            if (parent && parent.children) {
                parent.children.push(fileName);
                parent.children.sort();
            }
            
            return null;
        },

        mkdir: (args) => {
            if (!args[0]) return { error: 'mkdir: missing operand' };
            
            const dirPath = Terminal.resolvePath(args[0]);
            if (Terminal.filesystem[dirPath]) {
                return { error: `mkdir: ${args[0]}: File exists` };
            }
            
            Terminal.filesystem[dirPath] = { type: 'dir', children: [] };
            
            const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/'));
            const dirName = dirPath.substring(dirPath.lastIndexOf('/') + 1);
            const parent = Terminal.filesystem[parentPath];
            if (parent && parent.children) {
                parent.children.push(dirName);
                parent.children.sort();
            }
            
            return null;
        },

        rm: (args) => {
            if (!args[0]) return { error: 'rm: missing operand' };
            
            const filePath = Terminal.resolvePath(args[0]);
            if (!Terminal.filesystem[filePath]) {
                return { error: `rm: ${args[0]}: No such file` };
            }
            
            delete Terminal.filesystem[filePath];
            
            const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
            const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
            const parent = Terminal.filesystem[parentPath];
            if (parent && parent.children) {
                const index = parent.children.indexOf(fileName);
                if (index > -1) parent.children.splice(index, 1);
            }
            
            return null;
        },

        whoami: () => {
            return Terminal.username;
        },

        hostname: () => {
            return Terminal.hostname;
        },

        date: () => {
            return new Date().toString();
        },

        uptime: () => {
            const uptime = Math.floor((Date.now() - Terminal.startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;
            return `up ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        uname: (args) => {
            if (args.includes('-a')) {
                return 'Darwin macOS-NX 21.6.0 Darwin Kernel Version 21.6.0: x86_64';
            }
            return 'Darwin';
        },

        df: () => {
            return [
                'Filesystem     Size   Used  Avail Capacity  Mounted on',
                '/dev/disk1s1  256G   120G   136G    47%    /'
            ].join('\n');
        },

        ps: () => {
            let output = '  PID  %CPU %MEM     COMMAND\n';
            Terminal.processes.forEach(p => {
                output += `${p.pid.toString().padStart(5)} ${p.cpu.padStart(4)} ${p.mem.padStart(4)}     ${p.name}\n`;
            });
            return output;
        },

        kill: (args) => {
            if (!args[0]) return { error: 'kill: usage: kill [-s sigspec] pid' };
            
            const pid = parseInt(args[0]);
            const index = Terminal.processes.findIndex(p => p.pid === pid);
            
            if (index === -1) return { error: `kill: (${pid}) - No such process` };
            
            if (pid === 2) return { error: 'kill: terminal: Operation not permitted' };
            
            Terminal.processes.splice(index, 1);
            return `Process ${pid} terminated`;
        },

        echo: (args) => {
            return args.join(' ') || '';
        },

        export: (args) => {
            if (args.length === 0) return Commands.env();
            
            const arg = args[0];
            if (arg.includes('=')) {
                const [key, value] = arg.split('=');
                Terminal.env[key] = value;
                return null;
            }
            return { error: 'export: usage: export VAR=value' };
        },

        env: () => {
            let output = '';
            for (let [key, value] of Object.entries(Terminal.env)) {
                output += `${key}=${value}\n`;
            }
            return output;
        },

        clear: () => {
            Terminal.clearScreen();
            return null;
        },

        theme: (args) => {
            const theme = args[0] || 'default';
            const terminalWindow = document.querySelector('.terminal-window');
            const terminalContent = document.getElementById('terminal-content');
            
            // Remove existing theme classes
            terminalWindow.classList.remove('terminal-theme-green', 'terminal-theme-amber', 
                                          'terminal-theme-white', 'terminal-theme-hacker');
            
            switch(theme) {
                case 'green':
                    terminalWindow.classList.add('terminal-theme-green');
                    break;
                case 'amber':
                    terminalWindow.classList.add('terminal-theme-amber');
                    break;
                case 'white':
                    terminalWindow.classList.add('terminal-theme-white');
                    break;
                case 'hacker':
                    terminalWindow.classList.add('terminal-theme-hacker');
                    break;
                default:
                    return `Available themes: green, amber, white, hacker`;
            }
            
            return `Theme changed to ${theme}`;
        },

        color: () => {
            const colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white'];
            const currentIndex = Terminal.colorIndex || 0;
            const nextColor = colors[(currentIndex + 1) % colors.length];
            
            const terminalContent = document.getElementById('terminal-content');
            terminalContent.style.color = `var(--color-${nextColor})`;
            
            Terminal.colorIndex = (currentIndex + 1) % colors.length;
            return `Color changed to ${nextColor}`;
        },

        fortune: () => {
            const fortunes = [
                "You will have a great day coding!",
                "A bug is never just a mistake. It represents something bigger.",
                "Today's special: 0% bugs, 100% coffee.",
                "Your code will compile on the first try. (Just kidding!)",
                "The best error message is the one that never shows up.",
                "42 is the answer. You just have to find the right question.",
                "A journey of a thousand miles begins with a single step.",
                "To understand recursion, you must first understand recursion."
            ];
            return fortunes[Math.floor(Math.random() * fortunes.length)];
        },

        cowsay: (args) => {
            const text = args.join(' ') || 'Moo!';
            const bubble = [
                ' ' + '_'.repeat(text.length + 2),
                '< ' + text + ' >',
                ' ' + '-'.repeat(text.length + 2)
            ];
            
            const cow = [
                '       \\   ^__^',
                '        \\  (oo)\\_______',
                '           (__)\\       )\\/\\',
                '               ||----w |',
                '               ||     ||'
            ];
            
            return [...bubble, ...cow].join('\n');
        },

        ascii: (args) => {
            const art = args[0] || 'logo';
            if (Terminal.asciiArts[art]) {
                return Terminal.asciiArts[art].join('\n');
            }
            return { error: `ASCII art '${art}' not found. Available: logo, cow, dragon, matrix` };
        },

        matrix: () => {
            Terminal.theme = 'matrix';
            Commands.theme(['hacker']);
            return Terminal.asciiArts.matrix.join('\n') + '\n\nWelcome to the Matrix...';
        },

        weather: () => {
            const conditions = ['☀️ Sunny', '☁️ Cloudy', '🌧️ Rainy', '⛈️ Stormy', '❄️ Snowy', '🌈 Rainbow'];
            const temps = [65, 72, 78, 85, 90, 68, 75, 82];
            
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const temp = temps[Math.floor(Math.random() * temps.length)];
            
            return `Location: ${Terminal.currentDirectory}\nCondition: ${condition}\nTemperature: ${temp}°F\nHumidity: ${Math.floor(Math.random() * 50 + 30)}%`;
        },

        hack: () => {
            const hackingLines = [
                'INITIATING HACK SEQUENCE...',
                '[████████░░░░░░░░░░░░] 25% - Bypassing firewall...',
                '[████████████░░░░░░░░] 50% - Cracking encryption...',
                '[████████████████░░░░] 75% - Accessing mainframe...',
                '[████████████████████] 100% - Access granted!',
                '',
                '╔══════════════════════════════════════╗',
                '║  SYSTEM BREACH DETECTED              ║',
                '║  Just kidding! This is just a demo.   ║',
                '║  You are not actually hacking.        ║',
                '╚══════════════════════════════════════╝',
                '',
                '👉 Pro tip: Real hacking requires learning, not movie magic!'
            ];
            
            // Animate the hack
            Terminal.clearScreen();
            hackingLines.forEach((line, index) => {
                setTimeout(() => {
                    Terminal.printLine(line, 'hack');
                }, index * 200);
            });
            
            return null;
        },

        roll: (args) => {
            const sides = parseInt(args[0]) || 6;
            if (sides < 2) return { error: 'Dice must have at least 2 sides' };
            if (sides > 100) return { error: 'Dice too large. Max 100 sides' };
            
            const result = Math.floor(Math.random() * sides) + 1;
            
            // ASCII dice for 6-sided
            if (sides === 6) {
                const diceArt = [
                    '┌───────┐',
                    `│   ${result}   │`,
                    '└───────┘'
                ];
                return diceArt.join('\n') + `\nYou rolled a ${result}!`;
            }
            
            return `You rolled a ${result} (d${sides})!`;
        },

        flip: () => {
            const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
            const coinArt = [
                '    ╔══════╗',
                result === 'HEADS' ? '    ║ HEAD ║' : '    ║ TAIL ║',
                '    ╚══════╝'
            ];
            return coinArt.join('\n');
        },

        exit: () => {
            window.TerminalApp.close();
            return null;
        },

        // Easter eggs
        '42': () => {
            return Terminal.easterEggs['42'];
        },

        unix: () => {
            return Terminal.easterEggs['unix'];
        },

        sudo: () => {
            return Terminal.easterEggs['sudo'];
        },

        secret: () => {
            return Terminal.asciiArts.dragon.join('\n') + '\n\n' + Terminal.easterEggs['secret'];
        },

        dance: () => {
            const dancers = [
                '♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪',
                '♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪',
                '♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪'
            ];
            
            let count = 0;
            const interval = setInterval(() => {
                Terminal.printLine(dancers[count % dancers.length], 'dance');
                count++;
                if (count > 10) clearInterval(interval);
            }, 200);
            
            return '💃 Terminal party started!';
        },

        coffee: () => {
            return Terminal.easterEggs['coffee'];
        },

        love: () => {
            return Terminal.easterEggs['love'];
        },

        conjure: () => {
            return [
                '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨',
                '  You are now a wizard!',
                '🧙‍♂️ Here is your wizard hat:',
                '       _____',
                '     /     \\',
                '    |  ()  |',
                '     \\_____/',
                '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨'
            ].join('\n');
        },

        // Launch other apps
        safari: () => {
            if (window.SafariApp) {
                window.SafariApp.open();
                return 'Launching Safari...';
            }
            return { error: 'Safari app not found' };
        },

        photos: () => {
            if (window.PhotosApp) {
                window.PhotosApp.open();
                return 'Launching Photos...';
            }
            return { error: 'Photos app not found' };
        },

        music: () => {
            if (window.MusicApp) {
                window.MusicApp.open();
                return 'Launching Music...';
            }
            return { error: 'Music app not found' };
        },

        calendar: () => {
            if (window.CalendarApp) {
                window.CalendarApp.open();
                return 'Launching Calendar...';
            }
            return { error: 'Calendar app not found' };
        },

        finder: () => {
            if (window.FinderApp) {
                window.FinderApp.open();
                return 'Launching Finder...';
            }
            return { error: 'Finder app not found' };
        },

        system: () => {
            if (window.SystemPreferences) {
                window.SystemPreferences.open();
                return 'Opening System Preferences...';
            }
            return { error: 'System Preferences not found' };
        }
    };

    // --- Terminal Methods ---
    Terminal.startTime = Date.now();
    Terminal.colorIndex = 0;

    Terminal.resolvePath = (path) => {
        if (path.startsWith('/')) return path;
        if (path === '.' || path === './') return Terminal.currentDirectory;
        if (path === '..') {
            const parts = Terminal.currentDirectory.split('/');
            parts.pop();
            return parts.join('/') || '/';
        }
        
        // Handle relative paths
        const base = Terminal.currentDirectory === '/' ? '' : Terminal.currentDirectory;
        return base + '/' + path;
    };

    Terminal.updatePrompt = () => {
        if (Terminal.prompt) {
            const path = Terminal.currentDirectory.replace('/home/user', '~');
            Terminal.prompt.textContent = `${Terminal.username}@${Terminal.hostname}:${path}$`;
        }
    };

    Terminal.clearScreen = () => {
        const lines = Terminal.content.querySelectorAll('.terminal-line, .command-output');
        lines.forEach(line => line.remove());
    };

    Terminal.printLine = (text, className = '') => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (className) line.classList.add(className);
        
        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt terminal-prompt-user';
        const path = Terminal.currentDirectory.replace('/home/user', '~');
        promptSpan.textContent = `${Terminal.username}@${Terminal.hostname}:${path}$`;
        
        const outputSpan = document.createElement('span');
        outputSpan.style.whiteSpace = 'pre-wrap';
        outputSpan.textContent = ' ' + text;
        
        line.appendChild(promptSpan);
        line.appendChild(outputSpan);
        
        Terminal.content.insertBefore(line, Terminal.content.lastElementChild);
        Terminal.content.scrollTop = Terminal.content.scrollHeight;
    };

    Terminal.printOutput = (output, isError = false) => {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'command-output';
        if (isError) outputDiv.classList.add('error-text');
        
        outputDiv.style.whiteSpace = 'pre-wrap';
        outputDiv.textContent = output;
        
        Terminal.content.insertBefore(outputDiv, Terminal.content.lastElementChild);
        Terminal.content.scrollTop = Terminal.content.scrollHeight;
    };

    Terminal.processCommand = (input) => {
        if (!input.trim()) return;
        
        // Save to history
        Terminal.history.push(input);
        Terminal.historyIndex = Terminal.history.length;
        
        // Parse command
        const parts = input.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Check for easter eggs first
        if (Terminal.easterEggs[input]) {
            Terminal.printLine(input);
            Terminal.printOutput(Terminal.easterEggs[input]);
            return;
        }
        
        // Execute command
        Terminal.printLine(input);
        
        if (Commands[cmd]) {
            const result = Commands[cmd](args);
            if (result && result.error) {
                Terminal.printOutput(result.error, true);
            } else if (result) {
                Terminal.printOutput(result);
            }
        } else {
            Terminal.printOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, true);
        }
    };

    // --- Event Listeners ---
    if (Terminal.input) {
        Terminal.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = Terminal.input.value;
                Terminal.processCommand(input);
                Terminal.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (Terminal.historyIndex > 0) {
                    Terminal.historyIndex--;
                    Terminal.input.value = Terminal.history[Terminal.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (Terminal.historyIndex < Terminal.history.length - 1) {
                    Terminal.historyIndex++;
                    Terminal.input.value = Terminal.history[Terminal.historyIndex];
                } else {
                    Terminal.historyIndex = Terminal.history.length;
                    Terminal.input.value = '';
                }
            } else if (e.key === 'c' && e.ctrlKey) {
                Terminal.printLine('^C');
                Terminal.input.value = '';
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                Commands.clear();
            }
        });

        // Focus input when clicking anywhere in terminal
        Terminal.content.addEventListener('click', () => {
            Terminal.input.focus();
        });
    }

    // --- Terminal App Controller ---
    class TerminalApp {
        constructor() {
            this.isOpen = false;
            this.windowElement = document.querySelector('.terminal-window');
            this.windowId = 'terminal';
            this.zIndex = 100;
        }
        
        open() {
            if (!this.windowElement) return;
            
            this.windowElement.style.display = 'flex';
            this.isOpen = true;
            
            const left = (window.innerWidth - 800) / 2;
            const top = (window.innerHeight - 500) / 2;
            
            this.windowElement.style.left = `${left}px`;
            this.windowElement.style.top = `${top}px`;
            
            this.bringToFront();
            this.windowElement.style.animation = 'windowAppear 0.3s ease-out';
            
            // Focus input
            setTimeout(() => Terminal.input?.focus(), 100);
            
            // Print welcome message
            Commands.ascii(['logo']);
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

    // Initialize Terminal app
    window.TerminalApp = new TerminalApp();

    // Window controls
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        const closeBtn = terminalWindow.querySelector('.window-close');
        const minimizeBtn = terminalWindow.querySelector('.window-minimize');
        const zoomBtn = terminalWindow.querySelector('.window-zoom');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => window.TerminalApp.close());
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                terminalWindow.style.transform = 'translateY(100vh)';
                terminalWindow.style.opacity = '0';
                setTimeout(() => {
                    terminalWindow.style.display = 'none';
                    terminalWindow.style.transform = '';
                    terminalWindow.style.opacity = '';
                }, 300);
            });
        }
        
        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => {
                if (terminalWindow.classList.contains('maximized')) {
                    terminalWindow.classList.remove('maximized');
                    terminalWindow.style.width = '800px';
                    terminalWindow.style.height = '500px';
                    terminalWindow.style.left = 'calc(50% - 400px)';
                    terminalWindow.style.top = 'calc(50% - 250px)';
                } else {
                    terminalWindow.classList.add('maximized');
                    terminalWindow.style.width = '100%';
                    terminalWindow.style.height = 'calc(100% - 24px)';
                    terminalWindow.style.left = '0';
                    terminalWindow.style.top = '24px';
                }
            });
        }
    }

    // Update dock.js to include terminal
    // Add this to your dock.js launchApp method:
    // if (appId === 'terminal') {
    //     if (window.TerminalApp) {
    //         if (!window.TerminalApp.isOpen) window.TerminalApp.open();
    //         else window.TerminalApp.bringToFront();
    //     }
    // }
}); 