import * as path from 'node:path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import electron from 'electron';
const { BrowserWindow, ipcMain, session, globalShortcut, screen } = electron;

import * as widgetLib from '../../../widgetLibrairy.js';
const Widget = await widgetLib.init();

let visualizerWindow  = null;
let isOrbFullscreen   = false;  // état plein écran manuel
let savedBounds       = null;   // taille/position avant plein écran
let currentState      = 'idle';
let currentwidgetState;
let Locale;

const widgetFolder    = path.resolve(__dirname, 'assets/widget');
const widgetImgFolder = path.resolve(__dirname, 'assets/images/widget');
let periphInfo        = [];

// ─────────────────────────────────────────────
//  WIDGET METHODS
// ─────────────────────────────────────────────

export async function onClose(widgets) {
  if (Config.modules.visualizer.widget.display === true) {
    await Widget.initVar(widgetFolder, widgetImgFolder, null, Config.modules.visualizer);
    if (widgets) await Widget.saveWidgets(widgets);
  }
}

export async function getWidgetsOnLoad() {
  if (Config.modules.visualizer.widget.display === true) {
    await Widget.initVar(widgetFolder, widgetImgFolder, null, Config.modules.visualizer);
    const widgets = await Widget.getWidgets();
    return { plugin: 'visualizer', widgets: widgets, Config: Config.modules.visualizer };
  }
}

export async function readyToShow() {}

export async function getNewButtonState(arg) {
  return currentwidgetState === true ? 'On' : 'Off';
}

export async function getPeriphInfo() {
  return periphInfo;
}

/**
 * Parse la commande du menu circulaire.
 * "command=cycleOrb" → "cycleOrb"
 * "command=cycleOrb~param1=value1" → "cycleOrb"
 */
function parseCircularCommand(action) {
  if (!action || !action.includes('command=')) return null;
  const match = action.match(/command=([^~]+)/);
  return match ? match[1].trim() : null;
}

export async function widgetAction(even) {
  const act = even?.value?.action || '';

  // Menu circulaire (double-clic) : action au format "command=xxx"
  // IMPORTANT : on traite ce cas AVANT le On/Off et on sort immédiatement.
  const circularCmd = parseCircularCommand(act);
  if (circularCmd) {
    info(`visualizer: menu circulaire → ${circularCmd}`);

    if (circularCmd === 'cycleOrb') {
      const wasOpen = visualizerWindow && !visualizerWindow.isDestroyed();
      const current = Config.modules.visualizer.orbStyle || 1;
      const next = (current % 10) + 1;

      currentwidgetState = true;
      changeOrbStyle(next);

      if (!wasOpen) {
        setTimeout(() => openVisualizerWindow(), 250);
      }
    }

    return;
  }

  // Clic simple uniquement : On / Off
  // Ne pas utiliser desc === 'Off' ici : cela pouvait fermer l'orbe
  // lors de la validation du menu circulaire.
  if (act === 'On') {
    currentwidgetState = true;
    openVisualizerWindow();
    return;
  }

  if (act === 'Off') {
    currentwidgetState = false;
    if (visualizerWindow && !visualizerWindow.isDestroyed()) {
      visualizerWindow.close();
    }
    return;
  }
}

// ─────────────────────────────────────────────
//  ORB WINDOW
// ─────────────────────────────────────────────

function openVisualizerWindow() {
  if (visualizerWindow && !visualizerWindow.isDestroyed()) {
    visualizerWindow.focus();
    return;
  }

  const cfg = Config.modules.visualizer.window || {};

  const allowAudio = (_webContents, permission, callback, details = {}) => {
    const mediaTypes = details && details.mediaTypes ? details.mediaTypes : [];
    const ok = permission === 'media' ||
               permission === 'microphone' ||
               permission === 'audioCapture' ||
               mediaTypes.includes('audio');
    callback(!!ok);
  };

  session.defaultSession.setPermissionRequestHandler(allowAudio);

  if (session.defaultSession.setPermissionCheckHandler) {
    session.defaultSession.setPermissionCheckHandler((_webContents, permission, _origin, details = {}) => {
      const mediaTypes = details && details.mediaTypes ? details.mediaTypes : [];
      return permission === 'media' ||
             permission === 'microphone' ||
             permission === 'audioCapture' ||
             mediaTypes.includes('audio');
    });
  }

  visualizerWindow = new BrowserWindow({
    width:           cfg.width    || 400,
    height:          cfg.height   || 400,
    x:               cfg.x        || 50,
    y:               cfg.y        || 50,
    frame:           false,
    transparent:     true,
    alwaysOnTop:     cfg.alwaysOnTop !== false,
    resizable:       true,
    skipTaskbar:     false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      preload:          path.join(__dirname, 'preload.js')
    },
    title: 'A.V.A.T.A.R Visualizer'
  });

  const orbFile = getOrbFile();
  visualizerWindow.loadFile(path.join(__dirname, orbFile));

  const opacity = Config.modules.visualizer.opacity ?? 0.95;
  visualizerWindow.setOpacity(Math.max(0.1, Math.min(1.0, opacity)));

  visualizerWindow.on('closed', () => {
    visualizerWindow   = null;
    currentwidgetState = false;
    isOrbFullscreen    = false;
    savedBounds        = null;
  });

  visualizerWindow.webContents.on('did-finish-load', () => {
    sendState(currentState);
  });

  ipcMain.removeAllListeners('orb-move-window');
  ipcMain.on('orb-move-window', (_e, { dx, dy }) => {
    if (!visualizerWindow || visualizerWindow.isDestroyed()) return;
    const [x, y] = visualizerWindow.getPosition();
    visualizerWindow.setPosition(x + dx, y + dy);
  });

  ipcMain.removeAllListeners('orb-send-to-back');
  ipcMain.on('orb-send-to-back', () => {
    if (!visualizerWindow || visualizerWindow.isDestroyed()) return;
    visualizerWindow.setAlwaysOnTop(false);
  });

  // ── Plein écran orb4 : IPC depuis la page ──
  ipcMain.removeAllListeners('orb-toggle-fullscreen');
  ipcMain.on('orb-toggle-fullscreen', () => {
    toggleFullscreen();
  });

  currentwidgetState = true;
}

function toggleFullscreen() {
  if (!visualizerWindow || visualizerWindow.isDestroyed()) return;

  if (!isOrbFullscreen) {
    // → Passage en plein écran : sauvegarder bounds et maximiser
    savedBounds = visualizerWindow.getBounds();
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    visualizerWindow.setResizable(true);
    visualizerWindow.setBounds({ x: 0, y: 0, width, height }, true);
    visualizerWindow.setAlwaysOnTop(true);
    isOrbFullscreen = true;
    info('visualizer: plein écran activé');
  } else {
    // → Retour taille normale : restaurer bounds sauvegardés
    const cfg = Config.modules.visualizer.window || {};
    const bounds = savedBounds || {
      x: cfg.x || 50, y: cfg.y || 50,
      width: cfg.width || 400, height: cfg.height || 400
    };
    visualizerWindow.setBounds(bounds, true);
    visualizerWindow.setAlwaysOnTop(cfg.alwaysOnTop !== false);
    isOrbFullscreen = false;
    savedBounds = null;
    info('visualizer: plein écran désactivé');
  }
}

function getOrbFile() {
  const style = Config.modules.visualizer.orbStyle || 1;
  const valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const n = valid.includes(style) ? style : 1;
  return `orb${n}.html`;
}

function sendState(state) {
  currentState = state;
  if (visualizerWindow && !visualizerWindow.isDestroyed()) {
    visualizerWindow.webContents.send('orb-state', state);
  }
}

function changeOrbStyle(newStyle) {
  const valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const n = valid.includes(newStyle) ? newStyle : 1;
  Config.modules.visualizer.orbStyle = n;
  info(`visualizer: changement orbStyle → ${n}`);

  if (visualizerWindow && !visualizerWindow.isDestroyed()) {
    visualizerWindow.close();
    setTimeout(() => openVisualizerWindow(), 200);
  }
}

// ─────────────────────────────────────────────
//  PLUGIN METHODS
// ─────────────────────────────────────────────

export async function action(data, callback) {
  const tblActions = {
    open: () => {
      openVisualizerWindow();
      Avatar.speak(Locale.get('visualizer.opened'), data.client, callback);
    },
    close: () => {
      if (visualizerWindow && !visualizerWindow.isDestroyed()) visualizerWindow.close();
      Avatar.speak(Locale.get('visualizer.closed'), data.client, callback);
    },
    setOrb1: () => {
      changeOrbStyle(1);
      Avatar.speak(Locale.get('visualizer.orbChanged1'), data.client, callback);
    },
    setOrb2: () => {
      changeOrbStyle(2);
      Avatar.speak(Locale.get('visualizer.orbChanged2'), data.client, callback);
    },
    setOrb3: () => {
      changeOrbStyle(3);
      Avatar.speak(Locale.get('visualizer.orbChanged3'), data.client, callback);
    },
    setOrb4: () => {
      changeOrbStyle(4);
      Avatar.speak(Locale.get('visualizer.orbChanged4'), data.client, callback);
    },
    setOrb5: () => {
      changeOrbStyle(5);
      Avatar.speak(Locale.get('visualizer.orbChanged5'), data.client, callback);
    },
    setOrb6: () => {
      changeOrbStyle(6);
      Avatar.speak(Locale.get('visualizer.orbChanged6'), data.client, callback);
    },
    setOrb7: () => {
      changeOrbStyle(7);
      Avatar.speak(Locale.get('visualizer.orbChanged7'), data.client, callback);
    },
    setOrb8: () => {
      changeOrbStyle(8);
      Avatar.speak(Locale.get('visualizer.orbChanged8'), data.client, callback);
    },
    setOrb9: () => {
      changeOrbStyle(9);
      Avatar.speak(Locale.get('visualizer.orbChanged9'), data.client, callback);
    },
    setOrb10: () => {
      changeOrbStyle(10);
      Avatar.speak(Locale.get('visualizer.orbChanged10'), data.client, callback);
    }
  };

  info('visualizer:', data.action.command, Locale.get('plugin.from'), data.client);

  if (tblActions[data.action.command]) {
    tblActions[data.action.command]();
  } else {
    callback();
  }
}

export async function init() {
  Locale = await Avatar.lang.addPluginPak('visualizer');
  if (!Locale) return error('visualizer: unable to load language pak files');

  info('visualizer: plugin initialisé.');

  periphInfo.push({
    Buttons: [{
      name:       'Visualizer',
      value_type: 'button',
      usage_name: 'Button_visualizer',
      periph_id:  '927413',
      notes:      'Ouvre ou ferme le visualiseur A.V.A.T.A.R'
    }]
  });

  if (Config.modules.visualizer.autoOpen) {
    openVisualizerWindow();
  }
}
