/* Código de Electron. */
const { BrowserWindow, ipcMain, Menu, MenuItem, shell, globalShortcut } = require('electron');
const url = require('url');
const path = require('path');
const { is, electronVersion, centerWindow, openUrlMenuItem, showAboutWindow } = require('electron-util');
const contextMenu = require('electron-context-menu');
// const express = require('express');
const isMac = process.platform === 'darwin';

/* ELECTRON UNHANDLED: puede ser usado en ambos procesos, main y renderer. */
const unhandled = require('electron-unhandled');

/* ipcMain escucha/recibe todos los eventos que vienen desde las ventanas. como el que le envio desde ipcRenderer en app.js */
let ventanaInicial;

unhandled();

function ventanaInicio() {

    const argumentos = { data: 'Alejandro Gallego.' };
    ventanaInicial = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            spellcheck: true
        },
        title: 'Inicio'

    });
    //ventanaInicial.loadFile('src/index.html');
    const indexUrl = url.format({ protocol: 'file', slashes: true, pathname: path.join(__dirname, 'index.html'), hash: encodeURIComponent(JSON.stringify(argumentos)) })
    ventanaInicial.loadURL(indexUrl);

    ventanaInicial.once('ready-to-show', () => {
        ventanaInicial.show();
        cargarContextMenu();
    });

    ventanaInicial.on('close', () => {
        ventanaInicial = null;
    });

    console.log("Is windows?: ", is.windows);
    console.log("Is Main / Backend: ", is.main);

    console.log("Electron Version:", electronVersion);

    centerWindow({ window: ventanaInicial, animated: true });

    ipcMain.on('load', (evento, args) => {
        evento.reply("loaded", { desdeload: "Hola desde el proceso main.js" });
    });

    /* Registrar un accelerator,  */
    globalShortcut.register('CommandOrControl+0', () => {
        mostrarAbout();
    });





}

function cargarContextMenu() {
    contextMenu({
        prepend: (defaultActions, parametros, ventanaInicial) => [{
                label: 'Guardar Imagen como perso',
                visible: parametros.mediaType === 'image',
                click: () => {
                    defaultActions.saveImageAs;
                }

            },
            {
                label: 'Guardar Imagen',
                visible: parametros.mediaType === 'image'

            },
            {
                label: 'Buscar en Google “{selection}”',
                visible: parametros.selectionText.trim().length > 0,
                click: () => {
                    shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parametros.selectionText)}`);
                }
            }
        ],
        // menu: (actions, props, browserWindow, dictionarySuggestions) => [
        //     ...dictionarySuggestions,
        //     actions.separator(),
        //     actions.copyLink({
        //         transform: content => `modified_link_${content}`
        //     }),
        //     actions.separator(),
        //     {
        //         label: 'Unicorn'
        //     },
        //     actions.separator(),
        //     actions.copy({
        //         transform: content => `modified_copy_${content}`
        //     }),
        //     {
        //         label: 'Invisible',
        //         visible: false
        //     },
        //     actions.paste({
        //         transform: content => `modified_paste_${content}`
        //     })
        // ],
        labels: {
            copy: 'Copiar',
            copyImageAddress: 'Copiar dirección de imagen',
            saveImage: 'Guardar imagen',
            saveImageAs: 'Guardar imagen como…',
            lookUpSelection: 'Consultar “{selection}”'
        },
        showSearchWithGoogle: true,
        showCopyImage: true,
        showSaveImage: true,
        showSaveImageAs: true,
        showSaveLinkAs: true,
        showCopyImageAddress: true

    })
}

function cargarHTML(ruta) {
    /* Función para cargar diferentes htmls en la misma ventana. ventanaInicial. */


    const indexUrl = url.format({ protocol: 'file', slashes: true, pathname: path.join(__dirname, ruta) })
    ventanaInicial.loadURL(indexUrl);

    ventanaInicial.once('ready-to-show', () => {
        ventanaInicial.show();
    });
}


function mostrarAbout() {
    showAboutWindow({
        icon: path.join(__dirname, 'static/iconos/icono.png'),
        copyright: 'Copyright © Compañia',
        text: 'Información acerca de Compañia.',
        title: 'Compañia'
    })
}

/* Menu totalmente personalizado: */
// function nuevoMenu() {
//     const menu = Menu.buildFromTemplate([{
//         label: 'Personalizado',
//         submenu: [
//             openUrlMenuItem({
//                 label: 'Sitio web',
//                 url: 'https://github.com/'
//             })
//         ]
//     }])

//     Menu.setApplicationMenu(menu);
// }

/* Nuevo item de menu, averiguar: */
// function nuevoMenu() {
//     const menuItem = new MenuItem({
//         role: 'appMenu',
//         type: 'normal',
//         label: 'Herramientas de desarrollo',
//         enabled: true,
//         visible: true,
//         id: 'devtools_menu_item',
//         click() { console.log('Developer tools toggleado.') }
//     })

//     const actualMenu = Menu.getApplicationMenu();
//     // actualMenu.insert(5, menuItem);
//     actualMenu.items.push(menuItem);
// }

/* Menu totalmente personalizado: */
function nuevoMenu() {
    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about', label: 'Acerca de' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'Archivo',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                {
                    label: 'Abrir second',
                    click: function() {
                        cargarHTML("second.html");
                        console.log("guardado");

                    }
                },
                {
                    label: 'Abrir third',
                    click: function() {
                        cargarHTML("third.html");

                    }
                }
            ]
        },
        {
            label: '0. Acerca de',
            accelerator: 'CommandOrControl+0',
            registerAccelerator: true,
            click: function() {
                mostrarAbout();
            }
        },
        // { role: 'editMenu' }
        {
            label: 'Editar',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            label: 'Ayuda',
            submenu: [{
                label: 'Aprender mas',
                click: async() => {
                    await shell.openExternal('https://electronjs.org')
                }
            }, {
                label: 'Menu item personalizado',
                click: async() => {
                    await shell.openExternal('https://wearematterkind.com/');
                }
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}


module.exports = { ventanaInicio, nuevoMenu }