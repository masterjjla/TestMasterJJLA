// JavaScript Document

Disponible = true;
var ID;
var precio;
var valiCampos = 0;
var IdOrden = 0;
var FrmPago;
var costo;
var pago = '';
var algun = 0;
var NombrePago = '';
var FrmPago = '';
var tiempoCompleto = '';
var num = 0;
var Total = 0;
var IdOrden = '';
var saldoClienteCorreo = "";

$(document).ready(function() {
    $('#Ordenar').on('click', function() {
        FrmPago = $('input[type=radio][name=pago]:checked').val();
        if (FrmPago == "0" || FrmPago == 0 || FrmPago == null || FrmPago == "") {
            swal(
                'Error',
                'Por favor, selecciona un método de pago.',
                'error'
            );
        } else {
            if (FrmPago == 6) {
                RegistrarPedido();
            }
            if (FrmPago == 3) {
                Tarjeta();
            } else if (FrmPago != 6 && FrmPago != 3) {
                RegistrarPedido();
                //var box = bootbox.dialog({
                //    size: 'large',
                //    message: '<h3 class="text-center"><strong>Gracias por comprar con nosotros!</strong></h3>'
                //});
                //setTimeout(function () {
                //    box.modal('hide');
                //}, 10000);
                //window.location = "http://www.tododesbloqueo.com/tablero";
                //window.location = "http://www.tododesbloqueo.com/tablero-nuevo/";
            }
        }

    });
    $("#et_pb_contact_submit").click(function() {
        var existeCorreoRegistrado = false;
        var CorreoEscrito = $('#txtCorreo').val();
        if (CorreoEscrito != "") {
            console.log("Entro al correo. " + CorreoEscrito);
            $.ajax({
                type: "POST",
                url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
                async: false,
                data: "op=10&Correo=" + CorreoEscrito,
                dataType: 'json',
                error: function(jqXHR, text_status, strError) {},
                timeout: 600000,
                success: function(data) {
                    var d = $.parseJSON(data);
                    if (d.Existe == "Si") {
                        existeCorreoRegistrado = true;
                        if (window.location.href.indexOf("php") > -1) {
                            var person = prompt("Introduce la contraseña.", "");
                            if (person == "jorgeanaya") {
                                alert("Si");
                            } else {
                                alert("Contraseña incorrecta.");
                                throw new Error("Contraseña incorrecta.");
                            }
                        } else {
                            swal('El e-mail ya está registrado.', "Por favor, inicia sesión.", 'error');
                            throw new Error("El correo ya está registrado, inicia sesión.");
                        }
                    } else {
                        existeCorreoRegistrado = false;
                    }
                    console.log("Existe = " + existeCorreoRegistrado);
                }
            });
        }
        if (CorreoEscrito != "") {
            console.log("Entro al correo.");
            $.ajax({
                type: "POST",
                url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
                async: false,
                data: "op=9&Correo=" + CorreoEscrito,
                dataType: 'json',
                error: function(jqXHR, text_status, strError) {},
                timeout: 600000,
                success: function(data) {
                    var d = $.parseJSON(data);
                    if (d.SaldoActual == "") {
                        saldoClienteCorreo = "0";
                    } else {
                        saldoClienteCorreo = d.SaldoActual;
                    }
                    console.log("Saldo = " + saldoClienteCorreo);
                }
            });
        }
        var estatusActual = document.getElementById("EstatusServicio").innerText;
        if (estatusActual != "Mantenimiento") {
            var Serv = $("#SelectServicios").select2("val");
            var IMEI = $('#txtIMEI').val();
            var IMEIs = $('#txtIMEIs').val();
            //var txtPRD = $('#txtPRD').val();
            //var txtPID = $('#txtPID').val();
            //var Notes = $('#txtNotes').val();
            var CalTiempo = document.getElementById("dvTT").innerHTML;
            var CalHasta = document.getElementById("dvTTHasta").innerHTML;
            //var TiempoEnt = CalTiempo.split(":");
            //var TiempoHasta = CalHasta.split(":");
            var IMEIText = $('input[type=radio][name=rdIMEIType]:checked').val();
            var IMEIs = '';
            var IMs = [];
            var IMEs = [];
            var num = 0;

            if (IMEIText == 'imei') {
                if (IMEI == '') {
                    valiCampos++;
                }
                if (IMEI.length != 15) {
                    valiCampos++;
                    algun++;
                }
            } else {
                IMEIs = $('#txtIMEIs').val();
                if (IMEIs == '') {
                    valiCampos++;
                }
                IMs = IMEIs.split("\n");
                var count = IMs.length;
                for (x = 0; x < count; x++) {
                    if (IMs[x] !== '') {
                        IMEs[num] = IMs[x];
                        if (IMEs[num].length != 15) {
                            valiCampos++;
                            algun++;
                        }
                        num++;
                    }
                }

            }

            if ($("#SelectServicios").select2("val") == '') {
                valiCampos++;
            }
            //if ($('#txtModelo').val() == '') {
            //    valiCampos++;
            //}


            if (valiCampos == 0) {
                FrmPago = $('input[type=radio][name=pago]:checked').val();
                costo = document.getElementById("lblCustPrice").innerHTML;
                precio = costo.split(" ");
                ID = $('#idUser').val();
                //Saldo(ID, precio[1]);
                Saldo(ID, costo);
            } else {
                if (algun >= 1) {

                    if (IMEIText == 'imei') {
                        swal('El IMEI está incompleto.', 'Por favor, completalo.', 'error');
                    } else {
                        swal('Alguno de los IMEI está incompleto.', 'Por favor, completalo.', 'error');
                    }
                    valiCampos = 0;
                    algun = 0;
                } else {
                    swal('Campos incompletos', 'Por favor, completalos.', 'error');
                    valiCampos = 0;
                    algun = 0;
                }

            }
        } else {
            swal('Actualmente el servicio seleccionado está en mantenimiento.', 'Por favor, inténtelo más tarde.', 'error');
        }

    });
    $('input[name=txtIMEI]').keypress(function(e) {
        // var key = e.keyCode || e.which;
        // if(key===8){return;}
        var a = [];
        var k = e.which;
        for (i = 48; i < 58; i++)
            a.push(i);
        a.push(8);
        a.push(9);
        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    });
    $('#finalizar').on('click', function() {
        RegistrarCompra();
    });
    $('#top-header').css('z-index', '100');
    $('#main-header').css('z-index', '100');
});

function obtenerFecha() {
    var fecha = new Date();
    fechaAnio = fecha.getFullYear();
    fechaMes = fecha.getMonth() + 1;
    fechaDia = fecha.getDate();
    fechaMostrar = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    var tiempoExtendido = $('#TiempoExtendidoFinal').text();
    var fechaSumar = tiempoExtendido.charAt(0);
    var myDate = new Date(new Date().getTime() + (fechaSumar * 24 * 60 * 60 * 1000));
    fechaEst = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
    //fechaMostrar = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
}

function Saldo(ID, precio) {
    var CorreoEscrito = $('#txtCorreo').val();
    $.ajax({
        type: "POST",
        url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
        data: "op=2&ID=" + ID + "&Precio=" + precio + "&Correo=" + CorreoEscrito,
        dataType: 'json',
        error: function(jqXHR, text_status, strError) {},
        timeout: 600000,
        success: function(data) {
            var d = $.parseJSON(data);

            if (d.Mensaje == 'Error-Saldo') {
                swal('Hubo un problema con su cuenta.', 'Por favor, contacte con nuestro soporte.', 'warning');
            } else if (d.Mensaje == 'Disponible') {
                var SadoActual = numeral($("#SaldoA").val()).format('0,0.00');
                var CalTiempo = document.getElementById("dvTT").innerHTML;
                var CalHasta = document.getElementById("dvTTHasta").innerHTML;
                var TiempoEnt = CalTiempo.split(":");
                var TiempoHasta = CalHasta.split(":");
                var S2 = $('select').find(':selected');
                var sel = S2.text();
                var value = sel.split("-");
                var SA = $("#SaldoA").val();
                //var SAl = SA[0] + SA[1].split("</small>");
                if (value[0] == 'T') {
                    Nombre = value[0] + '-' + value[1];
                } else
                    Nombre = value[0];
                //var SaldoAct = SAl.split(" ");
                var IMEIText = $('input[type=radio][name=rdIMEIType]:checked').val();
                var IMEIs = '';
                var IMs = [];
                var IMEs = [];
                var num = 0;
                if (IMEIText == 'imei') {
                    IMEs[0] = $('#txtIMEI').val();
                } else {
                    IMEIs = $('#txtIMEIs').val();
                    IMs = IMEIs.split("\n");
                    var count = IMs.length;
                    for (x = 0; x < count; x++) {
                        if (IMs[x] !== '') {
                            IMEs[num] = IMs[x];
                            num++;
                        }
                    }
                }
                var canidad = IMEs.length;
                var floatSaldo = parseFloat(0);
                if (CorreoEscrito == "") {
                    floatSaldo = parseFloat(SA);
                } else {
                    floatSaldo = parseFloat(d.Saldo);
                    SadoActual = floatSaldo;
                }
                var floatPrecio = parseFloat(precio);
                var preciofinal = 0;
                preciofinal = floatPrecio * canidad;
                var SalDisp = floatSaldo - preciofinal;
                var cantidad = numeral(SalDisp).format('0,0.00');
                var precioFloat = numeral(floatPrecio).format('0,0.00');
                var precioFin = numeral(preciofinal).format('0,0.00');

                $("#CompraSaldo").modal();
                var usernomm = $('#User').val();
                if (CorreoEscrito != "" && CorreoEscrito != null) {
                    usernomm = CorreoEscrito;
                }
                var email = $('#email').val();
                Nombre = $('#dvSN').text();
                var imeiModal = $('#txtIMEI').val();

                //document.getElementById('udn').innerText = '' + SAl;
                document.getElementById('udn').innerText = '' + usernomm;
                document.getElementById('saldo').innerText = '$ ' + numeral(SadoActual).format('0,0.00') + " MXN";
                document.getElementById('Servicio').innerText = '' + Nombre;
                document.getElementById('precioUnitario').innerText = '$ ' + precioFloat + ' MXN';
                document.getElementById('precio').innerText = '$ ' + precioFin + ' MXN';
                document.getElementById('NumOrd').innerText = '' + canidad;
                document.getElementById('ImeiModal').innerText = '' + imeiModal;
                document.getElementById('TiempoEnt').innerText = '' + TiempoEnt[1];
                document.getElementById('Pth').innerText = '' + TiempoHasta[1];
                document.getElementById('SaldoDisponile').innerText = '$ ' + cantidad + ' MXN';


            } else if (d.Mensaje == 'NO-Disponible') {
                $("#gridSystemModal").modal();
            }
        }
    });
}

function RegistrarCompra() {
    var Email = $('#email').val();
    if (Email == "" || Email == null) {
        Email = $('#txtCorreo').val();
        if (Email == "" || Email == null) {
            swal('No se encontró un email.', 'Por favor, verifíquelo nuevamente.', 'error');
            throw "Email no encontrado";
        }
    }
    var Modelo = $('#txtNotes').val();
    var txtPRD = $('#txtPRD').val();
    var txtPID = $('#txtPID').val();
    var Notes = $('#txtNotes').val();
    var CalTiempo = document.getElementById("dvTT").innerHTML;
    var CalHasta = document.getElementById("dvTTHasta").innerHTML;
    var TiempoEnt = CalTiempo.split(":");
    var TiempoHasta = CalHasta.split(":");
    var tiempoHastaSplit2 = TiempoHasta[1].split(" ");
    var tiempoExtendido = tiempoHastaSplit2[1];
    var tiempoTipoTitis = tiempoHastaSplit2[2];
    var myDate = new Date();
    if (tiempoTipoTitis == "Minutos")
        myDate.setMinutes(myDate.getMinutes() + parseInt(tiempoExtendido));
    if (tiempoTipoTitis == "Horas")
        myDate.setHours(myDate.getHours() + parseInt(tiempoExtendido));
    if (tiempoTipoTitis == "Días")
        myDate.setDate(myDate.getDate() + parseInt(tiempoExtendido));
    if (tiempoTipoTitis == "Dias")
        myDate.setDate(myDate.getDate() + parseInt(tiempoExtendido));
    var mesExtendido = myDate.getMonth() + 1;
    if (mesExtendido.toString().length == 1) { mesExtendido = "0" + mesExtendido.toString(); }
    var diaExtendido = myDate.getDate();
    if (diaExtendido.toString().length == 1) {
        diaExtendido = "0" + diaExtendido.toString();
    }
    var horitas = myDate.getHours();
    var minutas = myDate.getMinutes();
    var segundas = myDate.getSeconds();
    if (horitas.toString().length == 1) {
        horitas = '0' + horitas;
    }
    if (minutas.toString().length == 1) {
        minutas = '0' + minutas;
    }
    if (segundas.toString().length == 1) {
        segundas = '0' + segundas;
    }
    var fechaEst = myDate.getFullYear() + "-" + mesExtendido + "-" + diaExtendido + "T" + horitas + ":" + minutas;
    var IMEIText = $('input[type=radio][name=rdIMEIType]:checked').val();
    var IMEIs = '';
    var IMs = [];
    var IMEs = [];
    var num = 0;
    if (IMEIText == 'imei') {
        IMEs[0] = $('#txtIMEI').val();
    } else {
        IMEIs = $('#txtIMEIs').val();
        IMs = IMEIs.split("\n");
        var count = IMs.length;
        for (x = 0; x < count; x++) {
            if (IMs[x] !== '') {
                IMEs[num] = IMs[x];
                num++;
            }
        }
    }
    var Serv = $("#SelectServicios").select2("val");
    var S2 = $('select').find(':selected');
    var sel = S2.text();
    var value = Serv.split("-");
    var seleccionado = sel.split("-");
    if (seleccionado[0] == 'T')
        Nombre = seleccionado[0] + '-' + seleccionado[1];
    else
        Nombre = seleccionado[0];
    Nombre = $('#dvSN').text();
    var Id_Servicio = value[0];
    var Id_categoria = value[1];

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1)
        month = '0' + month;
    if (day.toString().length == 1)
        day = '0' + day;
    if (hour.toString().length == 1)
        hour = '0' + hour;
    if (minute.toString().length == 1)
        minute = '0' + minute;
    if (second.toString().length == 1)
        second = '0' + second;
    var idS = $("#ids").val();
    var idC = $("#idc").val();
    var isFrom = idS != "0" && idC != "0" ? "di" : "hpi";
    var dateTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
    var urlMax = "op=3&ID=" + ID + "&Precio=" + precio[0] +
        "&Servicio=" + encodeURIComponent(Nombre) + "&Modelo=" + Modelo + "&PRD=" + txtPRD + "&PID=" + txtPID +
        "&Notes=" + Notes + "&IMEI=" + IMEs + "&TiempoEnt=" + TiempoEnt + "&TiempoHast=" + fechaEst +
        "&FrmPago=17&IdCatego=" + Id_categoria + "&FechaCompra=" + encodeURIComponent(dateTime) + "&Email=" + Email + "&IdServicio=" + Id_Servicio + "&isFrom=" + isFrom;
    var abc = "";
    $.ajax({
        type: "POST",
        async: false,
        url: "https://www.tododesbloqueo.com/control-admin/jquery/ModeloRegistroServicio.php",
        data: "op=12&idServicio=" + Id_Servicio,
        success: function(data) {
            // respuestaServer = data;
            for (x = 0; x < data.length; x++) {
                var d = $.parseJSON(data[x]);
                var precio1Serv = d.Precio;
                var precio2Serv = d.Precio2;
                var precio3Serv = d.Precio3;
                var precio4Serv = d.Precio4;
                var habilitadoServ = d.Habilitado;
                var estatusServ = d.Estatus;
            }
            if (habilitadoServ == "0") {
                alert("El servicio está deshabilitado en estos momentos.");
                throw new Error("Habilitado no");
            }
            if (estatusServ == "Mantenimiento") {
                alert("El servicio está en mantenimiento en estos momentos.");
                throw new Error("Mantenimiento no");
            }
            $.ajax({
                type: "POST",
                url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
                async: false,
                data: "op=3&ID=" + ID + "&Precio=" + precio[0] +
                    "&Servicio=" + encodeURIComponent(Nombre) + "&Modelo=" + Modelo + "&PRD=" + txtPRD + "&PID=" + txtPID +
                    "&Notes=" + encodeURIComponent(Notes) + "&IMEI=" + IMEs + "&TiempoEnt=" + TiempoEnt + "&TiempoHast=" + fechaEst +
                    "&FrmPago=17&IdCatego=" + Id_categoria + "&FechaCompra=" + encodeURIComponent(dateTime) + "&Email=" + Email + "&IdServicio=" + Id_Servicio + "&isFrom=" + isFrom,
                dataType: 'json',
                error: function(jqXHR, text_status, strError) {
                    alert("Ocurrio un error: " + jqXHR + " " + text_status + " " + strError);
                },
                timeout: 600000,
                success: function(data) {
                    var d = $.parseJSON(data);
                    if (d.Mensaje == 'Existe') {
                        alert('El IMEI ya existe con este servicio');
                    } else {
                        if (d.Mensaje == 'Exitoso') {
                            IdOrden = d.IdOrden;
                            $("#CompraSaldo").modal("hide");
                            ID = $('#idUser').val();
                            console.log(ID);
                            if (ID == 0 || ID == "0" || ID == "" || ID == null) {
                                swal('Gracias por su compra.', 'Por favor, revise su email.', 'success');
                            } else {
                                swal({
                                        title: "Pedido realizado correctamente.",
                                        text: "Por favor, revise su email.",
                                        type: "success"
                                    },
                                    function() {
                                        window.location.href = 'http://www.tododesbloqueo.com/tablero-nuevo/';
                                    });
                            }
                            EnviarCorreo();
                        } else {
                            alert("Pedido fallido");
                        }
                    }
                }
            });
        }
    });
}

function RegistrarPedido() {
    var Email = $('#email').val();
    if (Email == "" || Email == null) {
        Email = $('#txtCorreo').val();
        if (Email == "" || Email == null) {
            swal('No se encontró un email.', 'Por favor, verifíquelo nuevamente.', 'error');
            throw new Error("No correo encontrado");
        }
    }
    var Modelo = $('#txtNotes').val();
    var txtPRD = $('#txtPRD').val();
    var txtPID = $('#txtPID').val();
    var Notes = $('#txtNotes').val();
    var CalTiempo = document.getElementById("dvTT").innerHTML;
    var CalHasta = document.getElementById("dvTTHasta").innerHTML;
    var TiempoEnt = CalTiempo.split(":");
    var TiempoHasta = CalHasta.split(":");
    var tiempoHastaSplit2 = TiempoHasta[1].split(" ");
    var tiempoExtendido = tiempoHastaSplit2[1];
    var tiempoTipoTitis = tiempoHastaSplit2[2];
    var myDate = new Date();
    if (tiempoTipoTitis == "Minutos") {
        myDate.setMinutes(myDate.getMinutes() + parseInt(tiempoExtendido));
    }
    if (tiempoTipoTitis == "Horas") {
        myDate.setHours(myDate.getHours() + parseInt(tiempoExtendido));
    }
    if (tiempoTipoTitis == "Días") {
        myDate.setDate(myDate.getDate() + parseInt(tiempoExtendido));
    }
    if (tiempoTipoTitis == "Dias") {
        myDate.setDate(myDate.getDate() + parseInt(tiempoExtendido));
    }
    var mesExtendido = myDate.getMonth() + 1;
    if (mesExtendido.toString().length == 1) {
        mesExtendido = "0" + mesExtendido.toString();
    }
    var diaExtendido = myDate.getDate();
    if (diaExtendido.toString().length == 1) {
        diaExtendido = "0" + diaExtendido.toString();
    }
    var horitas = myDate.getHours();
    var minutas = myDate.getMinutes();
    var segundas = myDate.getSeconds();
    if (horitas.toString().length == 1) {
        horitas = '0' + horitas;
    }
    if (minutas.toString().length == 1) {
        minutas = '0' + minutas;
    }
    if (segundas.toString().length == 1) {
        segundas = '0' + segundas;
    }
    var fechaEst = myDate.getFullYear() + "-" + mesExtendido + "-" + diaExtendido + "T" + horitas + ":" + minutas;
    var FrmPago = $('input[type=radio][name=pago]:checked').val();
    var IMEIText = $('input[type=radio][name=rdIMEIType]:checked').val();
    var IMEIs = '';
    var IMs = [];
    var IMEs = [];
    var num = 0;
    if (IMEIText == 'imei') {
        IMEs[0] = $('#txtIMEI').val();
    } else {
        IMEIs = $('#txtIMEIs').val();
        IMs = IMEIs.split("\n");
        var count = IMs.length;
        for (x = 0; x < count; x++) {
            if (IMs[x] !== '') {
                IMEs[num] = IMs[x];
                num++;
            }
        }
    }
    var Nombre;
    var idS = $("#ids").val();
    var idC = $("#idc").val();
    var isFrom = idS != "0" && idC != "0" ? "di" : "hpi";
    var Serv = $("#SelectServicios").select2("val");
    var S2 = $('select').find(':selected');
    var sel = S2.text();
    var value = Serv.split("-");
    var seleccionado = sel.split("-");
    if (seleccionado[0] == 'T') {
        Nombre = seleccionado[0] + '-' + seleccionado[1];
    } else
        Nombre = value[0];
    Nombre = $('#dvSN').text();
    var Id_Servicio = value[0];
    var Id_categoria = value[1];

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
    var urlMax = "op=5&ID=" + ID + "&Precio=" + precio + "&Servicio=" + encodeURIComponent(Nombre) + "&Modelo=" + encodeURIComponent(Modelo) +
        "&PRD=" + txtPRD + "&PID=" + txtPID + "&Notes=" + encodeURIComponent(Notes) + "&IMEI=" + IMEs + "&TiempoEnt=" + TiempoEnt +
        "&TiempoHast=" + fechaEst + "&FrmPago=" + FrmPago + "&IdCatego=" + Id_categoria + "&FechaCompra=" + encodeURIComponent(dateTime) +
        "&Email=" + Email + "&IdServicio=" + Id_Servicio + "&isFrom=" + isFrom;
    var abc = "";
    $.ajax({
        type: "POST",
        async: false,
        url: "https://www.tododesbloqueo.com/control-admin/jquery/ModeloRegistroServicio.php",
        data: "op=12&idServicio=" + Id_Servicio,
        success: function(data) {
            // respuestaServer = data;
            for (x = 0; x < data.length; x++) {
                var d = $.parseJSON(data[x]);
                var precio1Serv = d.Precio;
                var precio2Serv = d.Precio2;
                var precio3Serv = d.Precio3;
                var precio4Serv = d.Precio4;
                var habilitadoServ = d.Habilitado;
                var estatusServ = d.Estatus;
            }
            if (habilitadoServ == "0") {
                swal('El servicio está deshabilitado en estos momentos.', 'Por favor, inténtelo más tarde.', 'error');
                throw new Error("Habilitado no");
            }
            if (estatusServ == "Mantenimiento") {
                swal('El servicio está en mantenimiento en estos momentos.', 'Por favor, inténtelo más tarde.', 'error');
                throw new Error("Mantenimiento no");
            }
            $.ajax({
                type: "POST",
                async: false,
                url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
                data: "op=5&ID=" + ID + "&Precio=" + precio[0] + "&Servicio=" + encodeURIComponent(Nombre) + "&Modelo=" + encodeURIComponent(Modelo) +
                    "&PRD=" + txtPRD + "&PID=" + txtPID + "&Notes=" + encodeURIComponent(Notes) + "&IMEI=" + IMEs + "&TiempoEnt=" + TiempoEnt +
                    "&TiempoHast=" + fechaEst + "&FrmPago=" + FrmPago + "&IdCatego=" + Id_categoria + "&FechaCompra=" + encodeURIComponent(dateTime) +
                    "&Email=" + Email + "&IdServicio=" + Id_Servicio + "&isFrom=" + isFrom,
                error: function(jqXHR, text_status, strError) {
                    alert("Ocurrio un error: " + jqXHR + " " + text_status + " " + strError);
                },
                timeout: 600000,
                success: function(data) {
                    var d = $.parseJSON(data);
                    if (d.Mensaje == 'Existe') {
                        swal('El IMEI ya existe con este servicio.', 'Por favor, contacte con nuestro soporte.', 'error');
                    } else {
                        if (d.Mensaje == 'Exitoso') {
                            IdOrden = d.IdOrden;
                            $("#gridSystemModal").modal("hide");
                            ID = $('#idUser').val();
                            console.log(ID);
                            if (ID == 0 || ID == "0" || ID == "" || ID == null) {
                                swal('Gracias por su compra.', 'Por favor, revise su email.', 'success');
                            } else {
                                swal({
                                        title: "Pedido realizado correctamente.",
                                        text: "Por favor, revise su email.",
                                        type: "success"
                                    },
                                    function() {
                                        window.location.href = 'http://www.tododesbloqueo.com/tablero-nuevo/';
                                    });
                            }
                            EnviarCorreo();
                            if (FrmPago == 6) {
                                PaypalCompra();
                            }
                        } else {
                            swal('Pedido fallido.', 'Por favor, contacte con nuestro soporte.', 'error');
                        }
                    }
                }
            });
        }
    });
    //alert('TU');
}

function EnviarCorreo() {
    var Email = $('#email').val();
    if (Email == "" || Email == null) {
        Email = $('#txtCorreo').val();
    }
    var idS = $("#ids").val();
    var idC = $("#idc").val();

    var whereIs = idS != "" && idC != "" ? "di" : "hpi";
    var Nombre = '';
    var S2 = $('select').find(':selected');
    var sel = S2.text();
    var value = sel.split("-");
    if (value[0] == 'T') {
        Nombre = value[0] + '-' + value[1];
    } else
        Nombre = value[0];
    var Notes = $('#txtNotes').val();
    var IMEIText = $('input[type=radio][name=rdIMEIType]:checked').val();
    var IMEIs = '';
    var IMs = [];
    var IMEs = '';
    var num = 0;
    if (IMEIText == 'imei') {
        IMEs = $('#txtIMEI').val();
        num++;
    } else {
        IMEIs = $('#txtIMEIs').val();
        IMs = IMEIs.split("\n");
        var count = IMs.length;
        for (x = 0; x < count; x++) {
            if (IMs[x] !== '') {
                IMEs = IMEs + "-" + IMs[x];
                num++;
            }
        }
    }
    var CalTiempo = document.getElementById("dvTT").innerHTML;
    var TiempoHasta = document.getElementById("dvTTHasta").innerHTML;
    var TiempoEnt = CalTiempo.split(":");
    tiempoCompleto = TiempoEnt[1] + "," + TiempoHasta;
    FrmPago = $('input[type=radio][name=pago]:checked').val();
    FormaDePago(FrmPago);
    if (FrmPago == undefined || FrmPago == '' || FrmPago == null) {
        FrmPago = '17';
        NombrePago = 'Saldo Disponible';
    }
    if (FrmPago == 1) {
        NombrePago = 'Pago Oxxo/7 Eleven';
    }
    if (FrmPago == 2) {
        NombrePago = 'Deposito ventanilla';
    }
    if (FrmPago == 3) {
        NombrePago = 'Tranferencia bancaria visa/MasterCard';
    }
    if (FrmPago == 4) {
        NombrePago = 'Tranferencia bancaria visa/MasterCard';
    }
    if (FrmPago == 5) {
        NombrePago = 'Banco Coppel';
    }
    if (FrmPago == 7) {
        NombrePago = 'Banco Azteca';
    }
    if (FrmPago == 6) {
        NombrePago = 'Paypal';
    }
    FormaDePago(FrmPago);
    var floatPrecio = parseFloat(precio[0]);
    var preciofinal = floatPrecio * num;
    Total = numeral(preciofinal).format('0,0.00');
    Nombre = $('#dvSN').text();
    var urlCheck = "Precio=" + costo + "&Servicio=" + encodeURIComponent(Nombre) + "&Notas=" + encodeURIComponent(Notes) + "&IMEI=" + IMEs +
        "&Tiempo=" + tiempoCompleto + "&MetodoPago=" + FrmPago + "&Email=" + Email + "&Forma=" +
        NombrePago + "&Pago=" + pago + "&PrecioTotal=$ " + Total + " MXN&Ordenes=" + num + "&Orden=" + IdOrden;
    $.ajax({
        type: "POST",
        url: "https://www.tododesbloqueo.com/NotiEmail/ma-td-reg-cliente.php",
        data: "Precio=" + costo + "&Servicio=" + encodeURIComponent(Nombre) + "&Notas=" + encodeURIComponent(Notes) + "&IMEI=" + IMEs +
            "&Tiempo=" + tiempoCompleto + "&MetodoPago=" + FrmPago + "&Email=" + Email + "&Forma=" +
            NombrePago + "&Pago=" + pago + "&PrecioTotal=$ " + Total + " MXN&Ordenes=" + num + "&Orden=" + IdOrden,
        dataType: 'json',
        error: function(jqXHR, text_status, strError) {},
        timeout: 600000,
        success: function(data) {
            var d = $.parseJSON(data);
            if (d.m == 'si') {
                //alert("correo");
                if (ID == 0 || ID == "0" || ID == "" || ID == null) {

                } else {
                    window.location.href = 'http://www.tododesbloqueo.com/tablero-nuevo/';
                }
            }
        }
    });
    num = 0;
}
//"Precio=$ 94.00 MXN&Servicio=ALCATEL%20WORLDWIDE%20-%202009-2012%20PROVIDER%20ID%20Y%20COMPA%C3%91IA%20NECESARIO&Notas=PRUEBA
//&IMEI=001000000000100&Tiempo= 1-2 Días hábiles,Puede tardar hasta: 4 Días hábiles&MetodoPago=17&Email=jjla195@hotmail.com
//&Forma=Saldo Disponible&Pago=Saldo a favor que el cliente tiene.&PrecioTotal=$ 94.00 MXN&Ordenes=1&Orden=4088"
function FormaDePago(FrmPago) {

    $.ajax({
        type: "POST",
        url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
        data: "op=6&FrmPago=" + FrmPago,
        async: false,
        dataType: 'json',
        error: function(jqXHR, text_status, strError) {},
        timeout: 600000,
        success: function(data) {
            var d = $.parseJSON(data);
            pago = d.Pago;
        }
    });

}

function PaypalCompra() {
    // alert("Hola soy Paypal, gracias por escogerme como tu forma de pago.");
    costo = document.getElementById("lblCustPrice").innerHTML;
    precio = costo.split(" ");
    var servicio = document.getElementById("dvSN").innerHTML;
    var idServicioAntesSplit = $('#SelectServicios').val();
    var idServicioSplit = idServicioAntesSplit.split("-");
    var pay = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=soporte@tododesbloqueo.com&item_name=" + servicio + "&item_number=" + idServicioSplit[0] + "&amount=" + precio[0] + "&currency_code=MXN&tax_rate=5";
    window.location = pay;
}

function Tarjeta() {
    var cantidadPago = parseFloat(precio[0]);
    var cantidadPagoIVA = (cantidadPago + (cantidadPago * .0241)).toFixed(2);
    $.ajax({
        type: "POST",
        url: "https://www.tododesbloqueo.com/Datos-tablero-cliente.php",
        data: 'op=4',
        error: function(jqXHR, text_status, strError, error, result) {},
        timeout: 600000,
        success: function(data) {
            var d = $.parseJSON(data);
            IdOrden = d.Id;
            $.ajax({
                type: "POST",
                url: "https://www.tododesbloqueo.com/API2.php",
                data: 'id=' + IdOrden + '&precio=' + cantidadPagoIVA,
                error: function(jqXHR, text_status, strError, error, result) {},
                timeout: 600000,
                success: function(data) {
                    var valorJSON = data.replace("true", "");
                    var f = $.parseJSON(valorJSON);
                    var sessionId = f.session.id;
                    var Nombre = $('#dvSN').text();
                    var imeiEnter = $('#txtIMEI').val();
                    var descriptionProd = Nombre + " " + imeiEnter;
                    Checkout.configure({
                        session: {
                            id: sessionId,
                        },
                        merchant: 1060908,
                        order: {
                            amount: cantidadPagoIVA,
                            currency: 'MXN',
                            description: descriptionProd,
                            id: IdOrden
                        },
                        interaction: {
                            merchant: {
                                name: 'TodoDesbloqueo',
                                address: {
                                    line1: '',
                                    line2: ''
                                },
                                email: 'ventas@tododesbloqueo.com',
                                phone: '044 899 353 42 65',
                                logo: 'https://www.tododesbloqueo.com/wp-content/uploads/2017/06/Tododesbloqueo_Logo_2017_800x156.png'
                            }
                        }
                    });
                    Checkout.showLightbox();
                }
            });
        }
    });
}

function errorCallback(error) {
    console.log(JSON.stringify(error));
}

function cancelCallback() {
    console.log('Payment cancelled');
}

function completeCallback(resultIndicator, sessionVersion) {
    ID = $('#idUser').val();
    console.log(ID);
    if (ID == 0 || ID == "0" || ID == "" || ID == null) {
        swal('Gracias por su compra.', 'Por favor, revise su email.', 'success');
    } else {
        swal({
                title: "Pedido realizado correctamente.",
                text: "Por favor, revise su email.",
                type: "success"
            },
            function() {
                window.location.href = 'http://www.tododesbloqueo.com/tablero-nuevo/';
            });
    }
    RegistrarPedido();
}