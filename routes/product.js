
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
      var codigo = input.codigo;
      var id_producto;
      req.session.preciobulto = input.precio_bulto;
      var ind_bundle = parseInt(input.indice_bulto);
	  req.getConnection(function (err, connection) {
				var dataProduct = {
					id_producto: parseInt(codigo),
					nombre: 	input.nombre,
					cantidadTotal:   cant
				};	
				var dataProductFacture = {
					id_producto: parseInt(codigo),
					id_factura:  input.id_factura,
					precio:   precioxunidad,
					cantidad:   cant
				}
                 //INSERT INTO `openmind`.`producto` (`id_producto`, `nombre`, `cantidadtotal`) VALUES ('65465', 'lays', '5');

					console.log("INSERTANDO");
					console.log(dataProduct);
					console.log(dataProductFacture);
					connection.query('SELECT * FROM producto WHERE id_producto = ?', [dataProduct.id_producto], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						if(rows.length > 0 ){
							console.log("Ya  existe el producto");
							connection.query('INSERT INTO productofactura SET ?', [dataProductFacture], function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
										connection.query('UPDATE producto SET cantidadTotal = cantidadTotal+'+cant+' WHERE id_producto = ?', [dataProduct.id_producto],function(err, rows){
											if(err)
												console.log("Error Selecting : %s", err);
								
											res.redirect('/render_table/'+ input.id_factura );

										});
							});
						}
						else{
							console.log("NO existe producto");
							connection.query('INSERT INTO producto SET ?', [dataProduct],function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
								
									connection.query('INSERT INTO productofactura SET ?', [dataProductFacture], function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									dataProduct = null;
									dataProductFacture = null;
									res.redirect('/render_table/'+ input.id_factura);
							    
							    });
							});
						}
					});

	});
}
exports.buscar_info = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", [input.codigo], function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			if(rows.length > 0){
				res.send(rows[0]);
			}
			else{
				res.send("no");
			}
		});

	});
}
exports.create_producto = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", [input.id_producto], function(err, isProducto){
			if(err){console.log("Error Selecting : %s", err);}
			if(isProducto.length > 0){
				var dataPF = {
					id_producto: input.id_producto,
					id_factura: input.id_factura,
					precio: input.precio,
					cantidad: input.cantidad
				};
				console.log("Ingresando datos del producto");
				console.log(dataPF);
				connection.query("UPDATE producto SET cantidadtotal = cantidadtotal + ? WHERE id_producto = ?", [input.cantidad, input.id_producto],function(err, rows){
					if(err){console.log("Error Selecting : %s", err);}
					connection.query("UPDATE producto SET precioactual = ? WHERE id_producto = ?",[input.precio, input.id_producto], function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
						connection.query("INSERT INTO productofactura SET ?", [dataPF] ,function(err, rows){});
							if(err){console.log("Error Selecting : %s", err);}
							res.redirect("/tabla_factura/"+input.id_factura);
					});
				});
			}
			else{
				var dataPF = {
					id_producto: input.id_producto,
					id_factura: input.id_factura,
					precio: input.precio,
					cantidad: input.cantidad
				};

				var dataP = {
					id_producto: input.id_producto,
					nombre: input.nombre,
					cantidadtotal: input.cantidad,
					precioactual: input.precio
				};

				console.log("Ingresando datos del producto");
				console.log(dataPF);
				console.log(dataP);
				var query1 = "INSERT INTO producto (id_producto, nombre, cantidadtotal, precioactual) VALUES ('"+dataP.id_producto+"','"+ dataP.nombre+"','"+ dataP.cantidadtotal+"','"+dataP.precioactual+"')";
				console.log(query1);
				connection.query(query1,function(err, rows){
					if(err){console.log("Error Selecting : %s", err);}
					connection.query("INSERT INTO productofactura (id_producto, id_factura, precio, cantidad) VALUES (?, ?, ?, ?)", [dataPF.id_producto, dataPF.id_factura, dataPF.precio, dataPF.cantidad] ,function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
						res.redirect("/tabla_factura/"+input.id_factura);
					});		
				});
			}	
		});
	});
}
exports.eraseProduct = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id_factura = input.id_factura;
	var id_producto = input.id_producto;
	var cantidad = input.cantidad;
	req.getConnection(function(err, connection){
		connection.query('DELETE FROM productofactura WHERE id_factura = ? AND id_producto = ?', [id_factura, id_producto],function(err, prodfact){
			if(err){console.log("Error Selecting : %s", err);}
			connection.query("UPDATE producto SET cantidadtotal = cantidadtotal - ? WHERE id_producto = ?", [cantidad, id_producto], function(err, update){
				if(err){console.log("Error Selecting : %s", err);}
				res.redirect("/tabla_factura/"+id_factura);
			});
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
	console.log("RENDERIZANDO STOCK DE PRODUCTOS");
	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM producto',function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								//console.log(rows);	
								res.render('stock_table', {data: rows});				
						 });
				});

}



exports.list = function(req, res){

	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM producto',function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								//console.log(rows);	
								//res.render('stock_table', {data: rows});				
						 		res.render('stock_list',{page_title:"Stock de productos", data: rows, login_admin: req.session.login_admin});				

						 });
				});
}




//OUTPUT: 	res.render('table_products', {thisBundle: req.session.thisBundle, codFactura: req.session.codFactura, datos: rows, Sumcantidad: req.session.CantidadTotal, precioBulto: req.session.preciobulto, nextbundle: req.session.nextBundle});				
exports.forBundle = function(req, res){
	var input = req.params;
	console.log(req.session.codFactura);
	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM productofactura  LEFT JOIN producto ON productofactura.id_producto = producto.id_producto WHERE id_factura = ?', [req.session.codFactura] ,function(err,rows)
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

exports.renderTableFactura = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("Renderizando tabla de productos");
	console.log(input);
	req.getConnection(function(err,connection){
					 connection.query('SELECT * FROM productofactura  LEFT JOIN producto ON productofactura.id_producto = producto.id_producto WHERE id_factura = ?', [input.id_factura] ,function(err,rows)
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
	var array = input.NombreProduct;
	var query = "SELECT * FROM producto WHERE ";
	query += "nombre LIKE '%"+array+"%'";	
	/*for(var i = 0; i<array.length; i++){
		query += "nombre LIKE '%"+array[i]+"%'";
		if(i!=array.length-1){
			query += " AND ";
		}
	}*/
	console.log(query);
	res.render('stock_table_nombre', {page_title: "Stock de Productos", busqueda: array ,login_admin: req.session.login_admin});
}

exports.buscar_nombre_render = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var array = input.NombreProduct;
	var query = "SELECT * FROM producto WHERE ";
	query += "nombre LIKE '%"+array+"%'";	
	/*for(var i = 0; i<array.length; i++){
		query += "nombre LIKE '%"+array[i]+"%'";
		if(i!=array.length-1){
			query += " AND ";
		}
	}*/
	console.log(query);
	req.getConnection(function(err, connection){
		//SELECT * FROM belita2.producto WHERE producto.nombre LIKE '%poleron%' AND producto.nombre LIKE '%hombre%';
		connection.query(query, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('stock_table_nombre_render', {page_title: "Stock de Productos", busqueda: array ,data: rows});
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




exports.pull_data = function(req, res){
	var input = req.params.id_producto;
	//console.log(input);
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?",[input], function(err, rows){
			if(err){
				console.log("Error Selecting : %s", err);
			}
			if(rows.length > 0){
				var info = rows[0].nombre+"&"+rows[0].cantidadtotal+"&"+rows[0].precioactual;
				//console.log(info);
				res.send(info);
			}
		});
	});
}


exports.editar = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	var codigo = input.codigo;
	var nombre = input.nombre;
	var stock = input.stock;
	var precio = input.precio;
	req.getConnection(function(err, connection){
		if(err){console.log("Error de conexion!");}
		connection.query("UPDATE producto SET nombre=?, cantidadtotal=?, precioactual=? WHERE id_producto=?", [nombre, stock, precio, codigo],function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			res.redirect('/show_product');
		});
	});


}



exports.search_nombre = function(req, res){
	console.log(req.params);
	var nombre = req.params.nombre;
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE nombre LIKE '%"+nombre+"%'", function(err, productos){
			if(err){console.log("Error Selecting : %s", err);}
			res.render('show_product_found', {prod: productos});
		});
	});
}


exports.inventory_product = function(req, res){
	req.session.arrayInventory = [];
	res.render('inventory_product' , {page_title: 'Ingresar productos'});
}

exports.regist_product = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.session.arrayInventory[req.session.arrayInventory.length] = input;
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", input.id_producto, function(err, prod){
			if(err){console.log("Error Selecting : %s", err);}
			if(prod.length > 0){
				console.log("UPDATE");
				connection.query("UPDATE producto SET nombre=?, cantidadtotal=cantidadtotal + ?, precioactual=? WHERE id_producto=?",[input.nombre, input.cantidad, input.precio, input.id_producto],
					function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
						res.redirect('/tabla_inventory');
					});
			}
			else{
				console.log("INSERT");
				var objeto = {
					id_producto: input.id_producto,
					nombre: input.nombre,
					cantidadtotal: input.cantidad,
					precioactual: input.precio,
					tipo: input.tipo
				}
				connection.query("INSERT INTO producto SET ?", objeto, function(err, rows){
					if(err){console.log("Error Selecting : %s", err);}
					res.redirect('/tabla_inventory');					
				});
			}
		});
	});
	
}


exports.remove_product_inventory = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.session.arrayInventory[input.indice] = null;
	req.getConnection(function(err, connection){
		connection.query("UPDATE producto SET cantidadtotal = cantidadtotal - ? WHERE id_producto = ?", [input.cantidad, input.id_producto],function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			res.redirect('/tabla_inventory');	
		});
	});
}


exports.tabla_inventory = function(req, res){
	console.log("renderizando tabla");
	console.log(req.session.arrayInventory);
	res.render('tabla_inventory', {data: req.session.arrayInventory});
}

exports.guardar_inventory = function(req, res){
	delete req.session.arrayInventory;
	res.redirect('/inventory_product');
}


exports.notif_stock = function(req, res){
	/*var productos = req.session.saleProduct;
	var query = '';
	for(var t=0; t<productos.length; t++){
		query += "SELECT * FROM producto WHERE id_producto="+productos[i].codigo_producto;
	}*/
	req.getConnection(function(err, connection){
		if(err){console.log("Error Selecting : %s", err);}
		connection.query("UPDATE producto SET cantidadtotal = 0 WHERE nombre ='pan'", function(err, updata){
			if(err){console.log("Error Selecting : %s", err);}
			console.log(updata);
			res.redirect('new_sale');
		});
	});
	//res.redirect('/new_sale');
}