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






exports.setPrecio = function(req, res){
	req.session.prod = [];
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto", function(err, productos){
			if(err){console.log("Error Selecting: %s", err);}
			req.session.prod = productos;
			res.redirect('/setPrecioB');
		});
	});

}


exports.setPrecioB = function(req, res){
	//console.log(req.session.prod);
	req.getConnection(function(err, connection){
			insertPrecio(connection, 0, req.session.prod, res);
	});
}

function insertPrecio(connection, indice, productos, res){
	connection.query("SELECT * FROM productofactura WHERE id_producto = ?", [productos[indice].id_producto], function(err, producto){
		if(err){console.log("Error Selecting :%s", err);}
			if(producto.length > 0){
				var codigo = producto[producto.length-1].id_producto;
				var precio = producto[producto.length-1].precio
				console.log("CODIGO: "+codigo);
				console.log("Precio: "+precio);
				connection.query("UPDATE producto SET precioactual = ? WHERE id_producto = ?", [precio, codigo],function(err, update){
					if(err){console.log("Error Selecting :%s", err);}
					if(indice == productos.length-1){
						res.redirect("/");
					}
					else{
						indice = indice + 1;
						insertPrecio(connection, indice, productos, res);
					}
				});
			}
			else{
				if(indice == productos.length-1){
					res.redirect("/");
				}
				else{
					indice = indice + 1;
					insertPrecio(connection, indice, productos, res);
				}
			}
	});
}


/*var jre = require('node-jre');
 
	var output = jre.spawnSync(  // call synchronously 
	    ['../java'],                // add the relative directory 'java' to the class-path 
	    'impresora',                 // call main routine in class 'Hello' 
	    [],               // pass 'World' as only parameter 
	    { encoding: 'utf8' }     // encode output as string 
	  ).stdout.trim();           // take output from stdout as trimmed String 
	*/