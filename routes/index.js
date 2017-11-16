exports.index = function(req, res){
    res.render('index', { title: 'Call Service' });
}

exports.to_login = function(req, res){
	res.render('admin_login', {page_title: 'Ingreso de Administrador', login: ''});
}

exports.codes = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	res.render('BarCodes', {page_title: 'Imprimir codigos', precio: input.Precio, nombre: input.Nombre.replace(',',' '), codeProduct: parseInt(input.idP), Cantidad: parseInt(input.Cant), codFactura: parseInt(input.idF), Indice_Bulto: parseInt(input.indice_bulto), fontSize: parseInt(input.fontSize) });	
}


exports.rutCodes = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	res.render('RutCodes', {page_title: 'Imprimir codigos', nombre: input.nombre, rut: input.rut});
}


exports.changePass = function(req, res){
	res.render('changePass', {page_title: 'Cambiar contraseña'});
}



/*var jre = require('node-jre');
 
	var output = jre.spawnSync(  // call synchronously 
	    ['../java'],                // add the relative directory 'java' to the class-path 
	    'impresora',                 // call main routine in class 'Hello' 
	    [],               // pass 'World' as only parameter 
	    { encoding: 'utf8' }     // encode output as string 
	  ).stdout.trim();           // take output from stdout as trimmed String 
	*/