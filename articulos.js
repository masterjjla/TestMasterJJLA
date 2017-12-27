const remote = require('electron').remote
const main = remote.require('./main.js')
var mysqlCon        = require('./mysql-con.js');

$(document).ready(function() {
	$("#modal_articulo").modal();

	var once = true;
	let sqlvar = "SELECT CASE WHEN P.ID_PRODUCTO IS NULL THEN MA.Clave ELSE P.ID_PRODUCTO END AS ID_PRODUCTO, P.DESC_PRODUCTO, "+
	" P.PRECIO1IVA, P.PRECIO2IVA, P.PRECIO3IVA, P.PRECIO4IVA, P.PRECIO5IVA, P.PRECIO6IVA, P.PRECIO7IVA, P.PRECIO8IVA, P.PRECIOEIVA, P.ULTIMOCAMB, P.FECHAREG," +
	" CAP.DESC_PROVEEDOR AS PROVEEDOR, P.FAMILIA, EX.ACTUAL, CASE WHEN EX.ALMACEN IS NULL THEN MA.ID_ALMACEN ELSE EX.ALMACEN END AS ALMACEN, P.COSTO_COMPRA, CASE WHEN MA.Mostrar IS NULL "+
	"THEN TRUE ELSE MA.Mostrar END AS MOSTRAR FROM CAT_PRODUCTO P LEFT JOIN EXISTENCIAS EX ON P.ID_PRODUCTO = EX.CLAVE LEFT JOIN CAT_PROVEEDOR CAP ON  P.CVE_PROVEEDOR=CAP.ID_PROVEEDOR "+
	"LEFT JOIN (SELECT idMostrarArticulos, ID_ALMACEN, Clave, Almacen, Mostrar FROM mostrar_articulos INNER JOIN cat_almacen ON mostrar_articulos.Almacen = cat_almacen.DESC_ALMACEN) MA ON"+
	" EX.Almacen = MA.ID_ALMACEN AND EX.Clave = MA.Clave AND P.ID_PRODUCTO = MA.Clave UNION SELECT CASE WHEN P.ID_PRODUCTO IS NULL THEN MA.Clave ELSE P.ID_PRODUCTO END AS ID_PRODUCTO, "+
	"P.DESC_PRODUCTO, P.PRECIO1IVA, P.PRECIO2IVA, P.PRECIO3IVA, P.PRECIO4IVA, P.PRECIO5IVA, "+
	"P.PRECIO6IVA, P.PRECIO7IVA, P.PRECIO8IVA, P.PRECIOEIVA, P.ULTIMOCAMB, P.FECHAREG, CAP.DESC_PROVEEDOR AS PROVEEDOR, P.FAMILIA, EX.ACTUAL, CASE WHEN EX.ALMACEN IS NULL THEN MA.ID_ALMACEN "+
	"ELSE EX.ALMACEN END AS ALMACEN, P.COSTO_COMPRA, CASE WHEN MA.Mostrar IS NULL THEN TRUE ELSE MA.Mostrar END AS MOSTRAR FROM CAT_PRODUCTO P LEFT JOIN EXISTENCIAS EX ON P.ID_PRODUCTO = "+
	"EX.CLAVE LEFT JOIN CAT_PROVEEDOR CAP ON  P.CVE_PROVEEDOR=CAP.ID_PROVEEDOR right JOIN (SELECT idMostrarArticulos, ID_ALMACEN, Clave, Almacen, Mostrar FROM mostrar_articulos INNER JOIN "+
	"cat_almacen ON mostrar_articulos.Almacen = cat_almacen.DESC_ALMACEN) MA ON EX.Almacen = MA.ID_ALMACEN AND EX.Clave = MA.Clave AND P.ID_PRODUCTO = MA.Clave ORDER BY CONVERT(ID_PRODUCTO,"+
	" UNSIGNED INTEGER) ASC, DESC_PRODUCTO DESC"

	mysqlCon.connect().then(function(con){
		console.log('connected!');
		mysql = con;
		mysql.on('error', function (err, result) {
			console.log('error occurred. Reconneting...'.purple);
			reconnect();
		});
		mysql.query(sqlvar, function (err, rows, fields) {
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

	function llenarDatos(rows)
	{
		var lineas = "";
		var claveAnterior = "";
		var posicionNueva = 0;
		var articulo = [];
		var cantidadArticulo = 0;
		once = true;
		$('#dataTable_articulo').DataTable().destroy();
		for (var row in rows){
			var id = rows[row].ID_PRODUCTO;
			var name = rows[row].DESC_PRODUCTO;
			var costo = rows[row].COSTO_COMPRA;
			var pre1 = rows[row].PRECIO1IVA;
			if (pre1 == null || pre1 === null)
				pre1 = 0;
			var pre2 = rows[row].PRECIO2IVA;
			if (pre2 == null || pre2 === null)
				pre2 = 0;
			var pre3 = rows[row].PRECIO3IVA;
			if (pre3 == null || pre3 === null)
				pre3 = 0;
			var pre4 = rows[row].PRECIO4IVA;
			if (pre4 == null || pre4 === null)
				pre4 = 0;
			var pre5 = rows[row].PRECIO5IVA;
			if (pre5 == null || pre5 === null)
				pre5 = 0;
			var pre6 = rows[row].PRECIO6IVA;
			if (pre6 == null || pre6 === null)
				pre6 = 0;
			var pre7 = rows[row].PRECIO7IVA;
			if (pre7 == null || pre7 === null)
				pre7 = 0;
			var pre8 = rows[row].PRECIO8IVA;
			if (pre8 == null || pre8 === null)
				pre8 = 0;
			var preE = rows[row].PRECIOEIVA;
			if (preE == null || preE === null)
				preE = 0;
			var familia = rows[row].FAMILIA;
			var prov = rows[row].PROVEEDOR;
			if (prov == "null" || prov == null)
				prov = "INDEFINIDO";
			var fec = rows[row].FECHAREG;
			var ultcam = rows[row].ULTIMOCAMB;
			var actual = rows[row].ACTUAL;
			var almacen = rows[row].ALMACEN;
			if (actual == null || actual === null)
				actual = 0;
			if (claveAnterior == id)
			{
				var primeraParteValor = "";
				if (actual > 9)
					primeraParteValor = '<span class="label label-success">';
				else if (actual < 10 && actual > 0)
					primeraParteValor = '<span class="label label-warning">';
				else if (actual < 1)
					primeraParteValor = '<span class="label label-danger">';
				var idReynosa = id + "_2";
				var idRioBravo = id + "_3";
				var idMatamoros = id + "_11";
				var valorInsert = primeraParteValor + actual + "</span>";
				if (almacen == "2" || almacen == 2)
					articulo[cantidadArticulo] = {id:idReynosa, valor:valorInsert};
				else if (almacen == "3" || almacen == 3)
					articulo[cantidadArticulo] ={id:idRioBravo, valor:valorInsert};
				else if (almacen == "11" || almacen == 11)
					articulo[cantidadArticulo] ={id:idMatamoros, valor:valorInsert};
				if (almacen == "12" || almacen == 12)
				{

				}
				else
					cantidadArticulo++;
			}
			else
			{
				lineas += '<tr>';
				lineas += '<th>' + id + '</th>';
				lineas += '<th>' + name + '</th>';
				lineas += '<th>' + costo + '</th>';
				lineas += '<th>' + pre1 + '</th>';
				lineas += '<th>' + pre2 + '</th>';
				lineas += '<th>' + pre3 + '</th>';
				lineas += '<th>' + pre4 + '</th>';
				lineas += '<th>' + pre5 + '</th>';
				lineas += '<th>' + pre6 + '</th>';
				lineas += '<th>' + pre7 + '</th>';
				lineas += '<th>' + pre8 + '</th>';
				lineas += '<th>' + preE + '</th>';
				lineas += '<th>' + familia + '</th>';
				lineas += '<th id="' + id + '_2" class="hidden-xs"><span class="label label-danger">0</span></th>';
				lineas += '<th id="' + id + '_3" class="hidden-xs"><span class="label label-danger">0</span></th>';
				lineas += '<th id="' + id + '_11" class="hidden-xs"><span class="label label-danger">0</span></th>';
				lineas += '<th>' + prov + '</th>';
				lineas += '<th>' + fec + '</th>';
				lineas += '<th>' + ultcam + '</th>';
				lineas += '<th>';
				lineas += '<div class="action-buttons"><a class="table-actions" onclick="content_update('+ id +');" href="#"><i class="fas fa-pencil-alt"></i></a>';
				lineas += '<a class="table-actions" onclick="content_delete('+ id +');" href="#"><i class="fas fa-trash-alt"></i></a></div>';
				lineas += '</th>';
				lineas += "</tr>";
				var primeraParteValor = "";
				if (actual > 9)
					primeraParteValor = '<span class="label label-success">';
				else if (actual < 10 && actual > 0)
					primeraParteValor = '<span class="label label-warning">';
				else if (actual < 1)
					primeraParteValor = '<span class="label label-danger">';
				var idReynosa = id + "_2";
				var idRioBravo = id + "_3";
				var idMatamoros = id + "_11";
				var valorInsert = primeraParteValor + actual + "</span>";
				if (almacen == "2" || almacen == 2)
					articulo[cantidadArticulo] = {id:idReynosa, valor:valorInsert};
				else if (almacen == "3" || almacen == 3)
					articulo[cantidadArticulo] ={id:idRioBravo, valor:valorInsert};
				else if (almacen == "11" || almacen == 11)
					articulo[cantidadArticulo] ={id:idMatamoros, valor:valorInsert};
				if (almacen == "12" || almacen == 12)
				{

				}
				else
					cantidadArticulo++;
				claveAnterior = id;
			}
		}
		$("#loader").css("display", "none");
		$("#hidden-items").css("display", "block");
		$('#tablaarticulosbody').html(lineas);
		for (var i = 0; i < articulo.length; i++)
		{
			if (articulo[i] === null || typeof articulo[i] === 'undefined'){

			}
			else
				$("#" + articulo[i].id).html(articulo[i].valor);
		}
		var table_articulo = $('#dataTable_articulo').DataTable({
			'fnDrawCallback': function (oSettings) {
				$('.dataTables_filter').each(function () {
					if (once)
					{
						$(this).append('<input type="search" class="form-control input-sm" id="inputClave" placeholder="Buscar por Clave"><select id="selectProveedor" class="form-control input-sm select2able" style="width:100%"><option value="">Todos los Proveedores</option></select>');
						$("#selectProveedor").select2({
							theme: "bootstrap"
						});

					}
					once = false;
				});
			},
			"sPaginationType": "full_numbers",     
			"oLanguage": {
				"sProcessing":     "Procesando...",
				"sLengthMenu":     "Mostrar _MENU_ registros",
				"sZeroRecords":    "No se encontraron resultados",
				"sEmptyTable":     "Ningún dato disponible en esta tabla",
				"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
				"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
				"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
				"sInfoPostFix":    "",
				"sSearch":         "Buscar:",
				"sUrl":            "",
				"sInfoThousands":  ",",
				"sLoadingRecords": "Cargando...",
				"oPaginate": {
					"sFirst":    "Primero",
					"sLast":     "Último",
					"sNext":     "Siguiente",
					"sPrevious": "Anterior"
				},
				"oAria": {
					"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
					"sSorthescending": ": Activar para ordenar la columna de manera descendente"
				}
			}
		});

		var select_proveedor = $('#selectProveedor').on( 'change', function () {
			table_articulo.columns(16).search( this.value ).draw();
		});

		table_articulo.column(16).data().unique().sort().each( function ( d, j ) {
			select_proveedor.append( '<option value="'+d+'">'+d+'</option>' )
		});

		$('#inputClave').keyup(function () {
			table_articulo.columns(0).search( this.value ).draw();
		});
	}

});

function content_update(id){
	alert("Actualizar " + id);
}

function content_delete(id){
	alert("Eliminar " + id);
}