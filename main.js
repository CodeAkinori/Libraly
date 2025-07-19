const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

ipcMain.handle('search-book', async (_event, query) => {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    // Retorna os 5 primeiros livros
    return { ok: true, data: data.docs.slice(0, 5) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('open-link', async (_event, url) => {
  try {
    await shell.openExternal(url);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

app.whenReady().then(createWindow);
