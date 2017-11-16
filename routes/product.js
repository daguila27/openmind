
/*exports.new_product = function(req, res){
      var input = JSON.parse(JSON.stringify(req.body));
      var cant = input.cantidad;
      req.session.preciobulto = input.precio_bulto;
      var ind_bundle = parseInt(input.indice_bulto);
		req.getConnection(function (err, connection) {
				var data = {
					id_factura:  input.id_factura,
					indice_bulto: ind_bundle,
					cantidad:   cant,
					nombre: 	input.nombre,
					precio:   0 
				};
				
				req.session.Productos[req.session.Productos.length] = data;
				connection.query("INSERT INTO producto SET ? ", data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );
					var ID = rows.insertId;
					var tags = data.nombre.split(',');
					var query = "INSERT INTO tags (tag) VALUES ";
					var query2 = "INSERT INTO tagproducto (tag, id_producto) VALUES ";
					for(var i=0; i<tags.length; i++){
						query += "('" + UpperWord(tags[i]) + "')";
						query2 += "('" + UpperWord(tags[i]) + "', '" + ID + "')"
						if(i != tags.length-1){
							query += ",";
							query2 += ",";
						}
					}
					console.log(query);				
					req.session.idProducto = rows.insertId;
					connection.query(query, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
					});
					connection.query(query2, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);						
					});
					res.redirect('/render_table/'+ input.id_factura + '/' + ind_bundle);
					
				});
		});
}*/
exports.new_product = function(req, res){
      var input = JSON.parse(JSON.stringify(req.body));
      console.log(input);
      var cant = input.cantidad;
      var nombre = input.nombre;
      var precioxunidad = input.precio;
      var id_producto;
      req.session.preciobulto = input.precio_bulto;
      var ind_bundle = parseInt(input.indice_bulto);
	  req.getConnection(function (err, connection) {
				var dataProduct = {
					id_producto: input.codigo,
					cantidadTotal:   cant,
					nombre: 	input.nombre,
				};	
				var dataProductFacture = {
					id_producto: input.codigo,
					id_factura:  input.id_factura,
					precio:   precioxunidad,
					cantidad:   cant
				}
					connection.query('SELECT * FROM producto WHERE id_producto = ?', [input.codigo], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						if(rows.length > 0 ){

						connection.query('INSERT INTO productofactura SET ?', [dataProductFacture], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
									connection.query('UPDATE producto SET cantidadTotal = cantidadTotal+'+cant+' WHERE id_producto = ?', codigo,function(err, rows){
										if(err)
											console.log("Error Selecting : %s", err);
							
										res.redirect('/render_table/'+ input.id_factura );

									});
						});
						}
						else{
							connection.query('INSERT INTO productofactura SET ?', [dataProductFacture], function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
									connection.query('INSERT INTO producto SET ?', [dataProduct],function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);

									res.redirect('/render_table/'+ input.id_factura);
							    
							    });
							});
						}
					});

	});
}


function UpperWord(word){
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
}


exports.delete = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		var id_producto = input.id_producto;
		var id_factura = input.id_factura;
		//var indice_bulto = input.indice_bulto;
		var cantidad = parseInt(input.cantidad);
		connection.query('UPDATE producto SET cantidadtotal = cantidadtotal-'+cantidad+' WHERE id_producto = ?', [id_producto],function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
		});
		var query = connection.query("DELETE FROM productofactura WHERE id_producto = ? AND id_factura = ?", [id_producto, id_factura], function(err, rows)
		{
			if(err)
				console.log("Error inserting : %s", err);
			res.redirect('/render_table/'+ input.id_factura /*+ '/' + parseInt(input.indice_bulto)*/);
		})
	});
}

exports.find = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var code = input.find_code;
	// 00 00006 000294 000
	
	var indice_bulto = parseInt(code.substring(0,2));
	var id_factura = parseInt(code.substring(3,7));
	var id_producto = parseInt(code.substring(8,13));
	var cantidad = parseInt(code.substring(14,16));
	console.log(id_producto);

	console.log(cantidad);
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", id_producto, function(err, rows){
			if(err)
				console.log("Error inserting : %s", err);
			else{
				if(rows.length == 0){
					res.render('notFound_product');
				}
				else{
					res.render('stock_table', {data: rows});
				}
			}				
		});
	});
}
exports.findForSale = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var code = input.find_code;
	//00 00006 000294 000
	
	var indice_bulto = parseInt(code.substring(0,2));
	var id_factura = parseInt(code.substring(3,7));
	var id_producto = parseInt(code.substring(8,13));
	var cantidad = parseInt(code.substring(14,16));
	var id_basedatos = parseInt(code.toString().substring(13,14));
	//console.log(id_basedatos);

	//ESTA PARTE DEBE ESTAR AL REVES EN LOS DISTINTOS COMPUTADORES
	if(id_basedatos == 0){
		console.log("producto con origen en 4 oriente");
		var mysql = require('mysql');
		var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
		connection.getConnection(function(err, connection){
			connection.query("SELECT * FROM productofactura WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto, id_factura, indice_bulto], function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				else{
					if(rows.length == 0){
						connection.release();
						res.send('nope');
					}
					else{
						connection.release();
						res.send('ok-externo');
					}
			}	
			});
		});
	}
	else if(id_basedatos == 1){
		console.log("producto con origen en San antonio");
		req.getConnection(function(err, connection){
		connection.query("SELECT * FROM productofactura WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto, id_factura, indice_bulto], function(err, rows){
			console.log(rows);
			if(err)
				console.log("Error inserting : %s", err);
			else{
				if(rows.length == 0){
					res.send('nope');
				}
				else{
					res.send('ok');
				}
			}				
			});
		});
	}	
	
}
exports.show = function(req, res){
	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM producto',function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								console.log(rows);	
								res.render('stock_table', {data: rows});				
						 });
				});

}



exports.list = function(req, res){
	res.render('stock_list',{page_title:"Stock de productos", login_admin: req.session.login_admin});				
}



/*exports.forBundle = function(req, res){
	var input = req.params;

	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM productofactura WHERE id_factura = ?', [input.id_facture, parseInt(input.indice_bulto)] ,function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );

								req.session.Productos = rows;
								console.log("PRODUCTOS EN SESSION:");
				 				console.log(req.session.Productos);
									req.session.CantidadTotal = 0;
									for(var i=0; i<rows.length; i++){
										if(rows[i].indice_bulto == parseInt(input.indice_bulto)){
											req.session.CantidadTotal += rows[i].cantidad;
										}
									}		
								res.render('table_products', {thisBundle: req.session.thisBundle, codFactura: req.session.codFactura, datos: rows, Sumcantidad: req.session.CantidadTotal, precioBulto: req.session.preciobulto, nextbundle: req.session.nextBundle});				
						 });
				});	
}*/
//OUTPUT: 	res.render('table_products', {thisBundle: req.session.thisBundle, codFactura: req.session.codFactura, datos: rows, Sumcantidad: req.session.CantidadTotal, precioBulto: req.session.preciobulto, nextbundle: req.session.nextBundle});				
exports.forBundle = function(req, res){
	var input = req.params;

	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM productofactura  LEFT JOIN producto ON productofactura.id_producto = producto.id_producto WHERE id_factura = ?', [input.id_facture] ,function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
									req.session.CantidadTotal = 0;
									console.log(rows);
									for(var i=0; i<rows.length; i++){
											req.session.CantidadTotal += rows[i].cantidad;
									}
									res.render('table_products', {codFactura: req.session.codFactura, datos: rows, Sumcantidad: req.session.CantidadTotal});				
						 		
						});
									
				});	
}




exports.save_bundle = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body)).idprecio;
	console.log(input);
	req.getConnection(function(err,connection){
		for(var i=0; i<input.length; i++){
			connection.query('UPDATE productofactura SET precio = ? WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?', [input[i].precio, input[i].id, req.session.codFactura, parseInt(req.session.thisBundle)], function(err, connection){
					if(err)
						console.log('Error Selecting : %s', err);
			});
		}
	});
}



exports.devolucion = function(req, res){
	res.render('returns_modules', {page_title: 'Devoluciones'})
}


exports.colect = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var arrayProduct = [];
	req.getConnection(function(err, connection){
		connection.query('select * from ventaproducto right join producto on (ventaproducto.id_producto = producto.id_producto) where id_venta = ?', input.idVenta, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('details_product_sale', {data: rows, type: input.type});
		});
	});
}


exports.traspaso = function(req, res){
	res.render('traspaso_prendas', {page_title: 'Traspaso de prendas'})
}


exports.export = function(req, res){
	res.render('export_product');
}

exports.import = function(req, res){
	res.render('import_product');
}



exports.descuentos = function(req, res){
	res.render('descuentos_liquidaciones', {page_title: 'Descuentos y Liquidaciones'});
}

exports.liqCod = function(req, res){
	res.render('liqCod');
}

exports.registrar_liquidacion = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		data = {
			codigo_producto_liquidacion: input.codigo,
			precio_liquidacion: input.precio
		};
		connection.query("INSERT INTO liquidaciones SET ?", data, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.redirect('/render_liquidaciones');
		});
	});
}
exports.render_liquidaciones = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciones', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('table_liquidaciones', {data: rows});
		});
	});
}

exports.details = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = input.idProducto;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM factura LEFT JOIN productofactura ON (factura.id_factura = productofactura.id_factura) RIGHT JOIN producto ON (productofactura.id_producto = producto.id_producto) RIGHT JOIN proveedor ON (factura.Rut_Proveedor = proveedor.Rut_Proveedor) WHERE productofactura.id_producto = ?',[id], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(req.session.login_admin);
			console.log(rows);
			res.render('detalle_producto', {page_title: 'Detalles del producto', data: rows, login_admin: req.session.login_admin});
		});
	});
}


exports.removeLiq = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('DELETE FROM liquidaciones WHERE codigo_producto_liquidacion = ?', [input.codigo], function(err, rows){
			if(err)
				console.log('Error Selecting : %s', err)
			res.redirect('/render_liquidaciones');
		});
	});
}



exports.addImport = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var codigo = input.codigo;
	var indice_bulto = parseInt(codigo.substring(0,2));
	var id_factura = parseInt(codigo.substring(3,7));
	var id_producto = parseInt(codigo.substring(8,13));
	var cantidad = input.cantidad;
	//INGRESAMOS A LA OTRA BASE DE DATOS PARA OBTENER EL NOMBRE Y EL PRECIO DEL PRODUCTO
	var mysql = require('mysql');
	var connection2 = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3306, 
    		database:'belita3'});
	connection2.getConnection(function(err, connection){
		connection.query('SELECT * FROM productofactura LEFT JOIN producto ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? and productofactura.id_factura = ? and productofactura.indice_bulto = ?', [id_producto, id_factura, indice_bulto], function(err, rows){
			if(err){console.log('Error Selecting : %s', err);}
			console.log(rows);
			if(!rows){
				res.send('invalido');
			}
			else{
				var datosProducto = rows[0];
				//connection.release();
				req.getConnection(function(err, connection){
					var data = {
						id_producto_importacion: datosProducto.id_producto,
						id_factura_importacion: datosProducto.id_factura,
						indice_bulto_importacion: datosProducto.indice_bulto,
						nombre_importacion: datosProducto.nombre,
						precio_importacion: datosProducto.precio,
						cantidad_importacion: cantidad
					}
					connection.query('INSERT INTO importaciones SET ?', data, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						res.redirect('/render_import');
					});
				});
			}
		});
	});
}

exports.addExport = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.substring(0,2));
	var id_factura = parseInt(input.codigo.substring(3,7));
	var id_producto = parseInt(input.codigo.substring(8,13));
	var cantidad = parseInt(input.cantidad);
	req.getConnection(function(err, connection){
		connection.query('UPDATE producto SET cantidadtotal=cantidadtotal-'+cantidad+' WHERE id_producto = ?', [id_producto], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			connection.query('UPDATE productofactura SET cantidad=cantidad-'+cantidad+' WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?', [id_producto, id_factura, indice_bulto], function(err, rows){
				if(err){
					console.log("Error Selecting : %s", err);
					res.send('nope');
				}
				else{
					res.send('ok');
				}
			});
		});
	});

}

exports.renderImport = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM importaciones', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('render_import', {data: rows});
		});
	});
}








exports.buscar_nombre = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var array = input.NombreProduct.split(',');
	var query = "SELECT * FROM producto WHERE ";
	for(var i = 0; i<array.length; i++){
		query += "nombre LIKE '%"+array[i]+"%'";
		if(i!=array.length-1){
			query += " AND ";
		}
	}
	console.log(query);
	req.getConnection(function(err, connection){
		//SELECT * FROM belita2.producto WHERE producto.nombre LIKE '%poleron%' AND producto.nombre LIKE '%hombre%';
		connection.query(query, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('stock_table_nombre', {page_title: "Stock de Productos", data: rows, login_admin: req.session.login_admin});
		});
	});
}




exports.findImport = function(req, res){
	var code = JSON.parse(JSON.stringify(req.body)).codigo;
	//00 00006 000294 000
	
	var indice_bulto = parseInt(code.substring(0,2));
	var id_factura = parseInt(code.substring(3,7));
	var id_producto = parseInt(code.substring(8,13));
	var cantidad = parseInt(code.substring(14,16));
	var id_basedatos = parseInt(code.toString().substring(13,14));
	if(id_basedatos == 1){
		console.log("producto con origen en San antonio");
		req.getConnection(function(err, connection){
		connection.query("SELECT * FROM productofactura right join producto ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND productofactura.id_factura = ? AND productofactura.indice_bulto = ?", [id_producto, id_factura, indice_bulto], function(err, rows){
			console.log(rows);
			if(err)
				console.log("Error inserting : %s", err);
			else{
				if(rows.length == 0){
						res.render('nombre_producto', {success: 'false', data: rows});
				}
				else{
						res.render('nombre_producto', {success: 'true', data: rows});
				}
			}				
			});
		});
	}
	else{
		console.log("producto con origen en 4 oriente");
		var mysql = require('mysql');
		var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
		connection.getConnection(function(err, connection){
			connection.query("SELECT * FROM productofactura right join producto ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND productofactura.id_factura = ? AND productofactura.indice_bulto = ?", [id_producto, id_factura, indice_bulto], function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				else{
					if(rows.length == 0){
						connection.release();
						res.render('nombre_producto', {success: 'false', data: rows});
				}
					else{
						connection.release();
						res.render('nombre_producto', {success: 'true',data: rows});
					}
			}	
			});
		});
	}
}