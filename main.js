const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch'); // Se der erro no require, instale: npm install node-fetch@2

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('search-book', async (_event, query) => {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return { ok: true, data: data.docs.slice(0, 5) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

app.whenReady().then(createWindow);
