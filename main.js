const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const ipcMain = require('electron').ipcMain
const Store = require('electron-store');
const store = new Store();

let win = null
let unreadCount

function createWindow () {	
	win = new BrowserWindow({
		width: 1280, 
		height: 800,
		'minHeight': 600,
		'minWidth': 960,
		show: false,
		titleBarStyle: 'hidden'
	})

	const menu = Menu.buildFromTemplate(menubar)
	Menu.setApplicationMenu(menu)

	unreadCount = 0
	       
	win.loadURL(
		isDev ? "http://localhost:8080" : `file://${path.join(__dirname, '/build/index.html')}`
	)

	win.once('ready-to-show', () => {
		win.show()
	})
	  
	win.on('closed', function () {
		win = null
	})
}

function createLoginWindow() {
	let window = new BrowserWindow({
		width: 600, 
		height: 800,
	});

	window.loadURL("https://cloud.feedly.com/v3/auth/auth?response_type=code&client_id=feedlydev&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=https%3A%2F%2Fcloud.feedly.com%2Fsubscriptions")
}

function setBadge(num) {
	let dock = app.dock

	dock.setBadge('' + num)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
	if (win === null) createWindow()
})

ipcMain.on('asynchronous-message', (event, arg) => {
	let integrationState = store.get('integrateWithFeedly')

	switch(integrationState) {
		case false:
			event.sender.send('asynchronous-reply', 'not integrated')
			break
		case true:
			event.sender.send('asynchronous-reply', 'integrated')
			break
		default:
			event.sender.send('asynchronous-reply', 'init')
			break
	}
})

ipcMain.on('feedly-integration', (event, arg) => {
	win.reload()
})

ipcMain.on('refresh', (event, arg) => {
	win.reload()
})

ipcMain.on('unread-count', (event, arg) => {
	unreadCount = arg

	setBadge(unreadCount)
})

ipcMain.on('decrease-unread-count', (event, arg) => {
	setBadge(unreadCount--)
})

let menubar = [
	...(process.platform === 'darwin' ? [{
	  label: "Simple RSS Reader",
	  submenu: [
		{ role: 'about' },      
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
	{
	  label: 'File',
	  submenu: [
		{ label: 'Open Feedly Sign-In Window', click() { createLoginWindow() } },
		{ type: 'separator' },
		{ label: 'Return Home', click() { win.loadURL(isDev ? "http://localhost:8080" : `file://${path.join(__dirname, '/build/index.html')}`) } },
		{ type: 'separator' },
		process.platform === 'darwin' ? 
		{ role: 'close' } : { role: 'quit' }
	  ]
	},
	{
	  label: 'Edit',
	  submenu: [
		{ role: 'undo' },
		{ role: 'redo' },
		{ type: 'separator' },
		{ role: 'cut' },
		{ role: 'copy' },
		{ role: 'paste' },
		...(process.platform === 'darwin' ? [
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
	{
	  label: 'Window',
	  submenu: [
		{ role: 'minimize' },
		{ role: 'zoom' },
		...(process.platform === 'darwin' ? [
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
	  submenu: [
		{
		  label: 'Learn More',
		  click: async () => {
			const { shell } = require('electron')
			await shell.openExternal('https://electronjs.org')
		  }
		}
	  ]
	}
]