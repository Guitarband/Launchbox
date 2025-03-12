// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
	sendRequest: (request) => {
		ipcRenderer.invoke('sendRequest', request);
	},
	onApiResponse: (callback) => {
		ipcRenderer.on('responseReceived', (event, response) => {
			callback(response);
		});
	},
	saveFile: (details) => {
		ipcRenderer.invoke('saveFile', details);
	},
}

contextBridge.exposeInMainWorld('indexBridge', indexBridge);