const remote = require('electron').remote
const main = remote.require('./main.js')
var mysqlCon        = require('./mysql-con.js');

// let button = document.createElement('button')
// button.textContent = "Open Window"
// document.body.appendChild(button)

// button.addEventListener('click', () => {
// 	main.openWindow()
// })

// $(function(){

// 	main.openConnection()

	let query = "SELECT * FROM cat_producto WHERE NOT RUTA_IMAGEN = '' limit 10"

	mysqlCon.connect().then(function(con){
		console.log('connected!');
		mysql = con;
		mysql.on('error', function (err, result) {
			console.log('error occurred. Reconneting...'.purple);
			reconnect();
		});
		mysql.query(query, function (err, rows, fields) {
			if(err) 
				console.log('err',err);
			console.log('Works bro ',rows);
			llenarDatos(rows);
		});
	});

	function reconnect(){
		mysqlCon.connect().then(function(con){
			console.log("connected. getting new reference");
			mysql = con;
			mysql.on('error', function (err, result) {
				reconnect();
			});
		}, function (error) {
			console.log("try again");
			setTimeout(reconnect, 2000);
		});
	};

	function llenarDatos(rows) {
		for (var row in rows){
			$('.stats').append('<br>Nombre: <span>' + rows[row].DESC_PRODUCTO + '</span> <img style="display:block; width:100px;height:100px;" id="base64image" src="data:image/jpeg;base64, ' + rows[row].RUTA_IMAGEN + ' " />')
		}
	}

// 	main.connection.query(query, function(err, rows, fields){
// 		if (err)
// 		{
// 			console.log("Error: Consulta PRUEBA")
// 			console.log(err)
// 			return
// 		}

// 		for (var row in rows){
// 			$('.stats').append('<br>Nombre: <span>' + rows[row].DESC_PRODUCTO + '</span> <img style="display:block; width:100px;height:100px;" id="base64image" src="data:image/jpeg;base64, ' + rows[row].RUTA_IMAGEN + ' " />')
// 		}

// 		// let row = rows[0]
// 		// $('.stats').append('Nombre: <span>' + row.NOMBRE + '</span>')
// 		// $('.stats').append('Almacen: <span>' + row.Almacen + '</span>')
// 		main.closeConnection()

// 	})


// 	const os = require('os')
// 	const prettyBytes = require('pretty-bytes')

// 	$('.stats').append('Numero de procesadores: <span>' + os.cpus().length + '</span>')
// 	$('.stats').append('Memoria: <span>' + prettyBytes(os.freemem()) + '</span>')
	
// });

// let myNotification = new Notification('Title', {
//   body: 'Lorem Ipsum Dolor Sit Amet'
// })

// myNotification.onclick = () => {
//   console.log('Notification clicked')
// }