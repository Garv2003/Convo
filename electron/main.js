const { app, BrowserWindow, protocol, Menu } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
            event.preventDefault();
            const newPath = path.join(__dirname, 'dist', 'index.html');
            mainWindow.loadFile(newPath);
        }
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173').catch(err => {
            console.error('Error loading dev server:', err);
        });
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        console.log('Loading production path:', indexPath);

        mainWindow.loadFile(indexPath).catch(err => {
            console.error('Error loading index.html:', err);
            console.error('Current directory:', __dirname);
            console.error('Attempted path:', indexPath);
        });
        Menu.setApplicationMenu(null);
    }

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const filePath = request.url.replace('file:///', '');
        try {
            return callback(filePath);
        } catch (error) {
            console.error('ERROR:', error);
            return callback(path.join(__dirname, 'dist', 'index.html'));
        }
    });

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('web-contents-created', (e, contents) => {
    contents.on('will-navigate', (event, url) => {
        if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
            event.preventDefault();
            const newPath = path.join(__dirname, 'dist', 'index.html');
            contents.loadFile(newPath);
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
