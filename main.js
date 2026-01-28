const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let mainWindow = null;

// Create icon if it doesn't exist
function ensureIconExists() {
  const iconPath = path.join(__dirname, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    // Purple star icon as base64 PNG
    const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKFSURBVFiF7ZY9aBRBFMd/s3t3l8vlPq6IWqggaBMbQbCxEMFCEGysLBQsbNTKQrCxEOxEK8XCRrBIIUKKIBYhWCgiFpJCMYUgiIVEcrl47y6X25358FjMbm72crdnYeFf7M7svP//zJuZXfifrDLK4IHzC+4B0y2KnQdGgS/Ac+DjXxXwo7m1BkN4Tg94BrwF5hfSYa0KuJWpj+AqPfAbeBWYF9gF9LVQsT5gV2B+5Hn0tFABWNnCGLsF3gEvgAXAJWnHBXYH7N8vPMJ+gT+TqwRvfwCsB8YE7gUa/gMHJI4G+lUJTwJvJZ4EPoTqXwv09QYGVQnPAK8l3gJ0h+pfCvT1BwZVCc8Cb0K1twCdofq3AH0DgUFVwvPA24l3AO2h+ncC/UOBQVXC88C7kbcBHaH6dwP9w4FBVcLzwPuQtzfQFqq/DxgYCQyqEp4HPox8PdAaqr8fGBwNDKoSngM+inwT0BKqvwsYGgsMqhKeAz6OfAPQHKq/FxgeGwsMqhKeAT6LfCPQFKq/BxgdHwsMqhKeBj6PfD3QGKq/AxgfD+kPlPAs8EXkmwMDofq9wIT6pD+Q/9+Xic8F+nwfMPEH+v25o3cLawXs1MnhqSSe8O1bAAYBD/gBbPHt+zZJvgMYA2aAH77OewAbgHngE7DJ1/9OSb4HmAZmfZ33ArPAHLDZ1/2MJN8HTAL6N/Q+8Ldh3wNf5y0S+BQA6J/hewX+ErgJvMR3wNP5hCQ+C4D62wZ+F/w18BC4iy9f5zOSeBYA69sG/hL8DfAQ+Ee+fF3OSeJFAPRvG/hL8HfAY+A/+fJ1OSOJ1wJg3zbwR+AfgUf48nW5IIn3AjBvJfgT8E/BY9+nPwGX05r//6P/BAAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(iconBase64, 'base64');
    fs.writeFileSync(iconPath, buffer);
  }
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Hide window when it loses focus
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  // Prevent window from being destroyed, just hide it
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  // Create a minimal 16x16 PNG programmatically
  // This is a 1x1 black pixel PNG, which we'll resize
  const minimalPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  // PNG signature
    0x00, 0x00, 0x00, 0x0D,  // IHDR chunk length
    0x49, 0x48, 0x44, 0x52,  // IHDR chunk type
    0x00, 0x00, 0x00, 0x01,  // Width: 1
    0x00, 0x00, 0x00, 0x01,  // Height: 1
    0x08, 0x00, 0x00, 0x00, 0x00,  // 8-bit grayscale
    0x3A, 0x7E, 0x9B, 0x55,  // CRC
    0x00, 0x00, 0x00, 0x0A,  // IDAT chunk length
    0x49, 0x44, 0x41, 0x54,  // IDAT chunk type
    0x08, 0x1D, 0x01, 0x02, 0x00, 0xFD, 0xFF, 0x00, 0x00, 0x02,  // Compressed data
    0x00, 0x01,  // CRC placeholder
    0x00, 0x00, 0x00, 0x00,  // IEND chunk length
    0x49, 0x45, 0x4E, 0x44,  // IEND chunk type
    0xAE, 0x42, 0x60, 0x82   // IEND CRC
  ]);

  console.log('Creating tray with minimal PNG');

  try {
    let icon = nativeImage.createFromBuffer(minimalPNG);

    // If buffer creation fails, try creating empty and setting title
    if (icon.isEmpty()) {
      console.log('Icon is empty, using tray title instead');
      icon = nativeImage.createEmpty();
    } else {
      console.log('Icon created successfully, size:', icon.getSize());
      if (process.platform === 'darwin') {
        icon.setTemplateImage(true);
      }
    }

    tray = new Tray(icon);
    // Use title as fallback for visibility
    tray.setTitle('⚡');  // Lightning bolt emoji
    tray.setToolTip('Prompt Amplifier');
    console.log('Tray created successfully');
  } catch (e) {
    console.error('Error creating tray:', e);
  }

  // Click tray icon to show/hide window
  tray.on('click', (event, bounds) => {
    toggleWindow(bounds);
  });

  // Optional: Right-click for quit menu only
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);
    tray.popUpContextMenu(contextMenu);
  });
}

function toggleWindow(trayBounds) {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    // Always position near tray when showing
    positionWindowNearTray(trayBounds);
    mainWindow.show();
    mainWindow.focus();
  }
}

function positionWindowNearTray(trayBounds) {
  const windowBounds = mainWindow.getBounds();
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  // Calculate position (near tray icon)
  let x, y;

  if (process.platform === 'darwin') {
    // macOS: tray is at top
    x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    y = Math.round(trayBounds.y + trayBounds.height + 4);
  } else {
    // Windows/Linux: tray could be at bottom or top
    x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

    if (trayBounds.y > screenHeight / 2) {
      // Tray is at bottom
      y = Math.round(trayBounds.y - windowBounds.height - 4);
    } else {
      // Tray is at top
      y = Math.round(trayBounds.y + trayBounds.height + 4);
    }
  }

  // Keep window on screen
  x = Math.max(0, Math.min(x, screenWidth - windowBounds.width));
  y = Math.max(0, Math.min(y, screenHeight - windowBounds.height));

  mainWindow.setPosition(x, y, false);
}

// App ready
app.whenReady().then(() => {
  ensureIconExists();
  createWindow();
  createTray();

  // Hide dock icon on macOS (tray-only app)
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});

// Handle second instance
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

// IPC handlers for renderer process
ipcMain.on('hide-window', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.on('quit-app', () => {
  app.isQuitting = true;
  app.quit();
});
