const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('new-note', (event, arg) => {
    console.info(`received a message from main process ${event}`)
    // $('div.compose.cw-button').click();
});
