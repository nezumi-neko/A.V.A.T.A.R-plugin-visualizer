'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('avatarBridge', {
  // État orbe (idle / listen / speak)
  onState: (callback) => {
    ipcRenderer.on('orb-state', (_e, state) => callback(state));
  },
  // Drag fenêtre
  moveWindow: (dx, dy) => {
    ipcRenderer.send('orb-move-window', { dx, dy });
  },
  // Arrière-plan au blur
  sendToBack: () => {
    ipcRenderer.send('orb-send-to-back');
  },
  // Bascule plein écran (orb4 Matrix)
  toggleFullscreen: () => {
    ipcRenderer.send('orb-toggle-fullscreen');
  }
});
