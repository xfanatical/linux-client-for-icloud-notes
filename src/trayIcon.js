import helpers from './helpers';
import path from 'path';

const {
    app, Tray, Menu, ipcMain, nativeImage,
} = require('electron');

const {getTrayIcon} = helpers;

function createTrayIcon(mainWindow) {
    const iconPath = getTrayIcon();
    const nimage = nativeImage.createFromPath(iconPath);
    const tray = new Tray(nimage);

    const onClick = () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    };

    // const onNewNote = () => {
    //     if (!mainWindow.isVisible()) {
    //         mainWindow.show();
    //     }
    //
    //     console.info('sending renderer process a command of creating a new note');
    //     mainWindow.webContents.send('new-note');
    // };

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open iCloud Notes',
            click: onClick,
        },
        // {
        //     label: 'New Note',
        //     click: onNewNote,
        // },
        {
            label: 'Quit',
            click: app.exit,
        },
    ]);

    tray.on('click', onClick);

    mainWindow.on('show', () => {
        tray.setHighlightMode('always');
    });

    mainWindow.on('hide', () => {
        tray.setHighlightMode('never');
    });

    tray.setContextMenu(contextMenu);
    return tray;
}

export default createTrayIcon;
