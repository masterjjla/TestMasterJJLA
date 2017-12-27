const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url = require('url')

let win

// const mysql = require('mysql')

// const connection = mysql.createConnection({
// 	host	 : '192.168.1.101',
// 	port 	 : '3306',
// 	user	 : 'sa',
// 	password : 'AbC123*-',
// 	database : 'posmercado'
// })

// connection.connect(function(err){
// 	if (err)
// 	{
// 		console.log(err.code)
// 		console.log(err.fatal)
// 	}
// 	if (err.fatal) {	
//     	console.trace('fatal error: ' + err.message);
//   	}
// })

// exports.connection = connection

// exports.openConnection = () => {
// 	connection.connect(function(err){
// 		if (err)
// 		{
// 			console.log(err.code)
// 			console.log(err.fatal)
// 		}
// 	})
// }

// exports.closeConnection = () => {
	 
// 	connection.end(function(){
// 		// cerrar conexion
// 	})
// }

function createWindow(){
	win = new BrowserWindow({width: 1600, height: 900, icon:__dirname + '/build/icon.ico'})
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}))

	win.maximize()
	win.webContents.openDevTools()
}

/*exports.openWindow = () => {
	let newWin = new BrowserWindow ({width: 400, height:200})
	newWin.loadURL(url.format({
		pathname: path.join(__dirname, 'tododesbloqueo.html'),
		protocol: 'file',
		slashes: true
	}))
}*/

app.on('ready', createWindow)