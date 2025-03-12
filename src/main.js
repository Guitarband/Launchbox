import { app, BrowserWindow, ipcMain, net } from 'electron';
import started from 'electron-squirrel-startup';
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('sendRequest', async (event, request) => {
  const startTime = Date.now();
  const req = net.request(request);

  if (request['headers']) {
    for (const [key, value] of Object.entries(request['headers'])) {
      req.setHeader(key, value);
    }
  }

  req.on('response', (response) => {
    const data = []
    response.on('data', (chunk) => {
      data.push(chunk)
    })
    response.on('end', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let json = {}
      try {
        json = JSON.parse(Buffer.concat(data).toString());
      } catch (e) {
        json = Buffer.concat(data).toString();
      }

      const res = {
        responseTime: responseTime,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        headers: response.headers,
        data: json
      }
      event.sender.send('responseReceived', res)
    })

  })
  req.on('error', (err) => {
    console.error('Request failed:', err);
    event.sender.send('responseReceived', { error: 'Request failed', details: err });
  });
  req.end()
});

ipcMain.handle('saveFile', async (event, details) => {
  fs.writeFileSync('src/data/restApis.json', JSON.stringify(details, null, 2), 'utf8');
})