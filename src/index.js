const { ventanaInicio, nuevoMenu } = require('./main');
const { app } = require('electron');
const { is } = require('electron-util');


console.log("Running Electron :) ");
console.log("Is windows?: ", is.windows);
console.log("Is Main / Backend: ", is.main);

app.whenReady().then(ventanaInicio).then(nuevoMenu);