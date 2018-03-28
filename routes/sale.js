exports.new = function(req, res){
	req.session.saleProducts = [];
	req.session.nameSeller = "";
	req.session.codVenta = 0;
	req.session.CostoTotal = 0;
	console.log(req.session.saleProducts);
	if(req.session.sellerData){
    	res.render('sale', {page_title: 'Nueva Venta', login_admin: req.session.login_admin, vendedor: req.session.sellerData});
	}
    else{
      req.session.nexturl = '/new_sale';
      res.redirect('/def_turno');
    }
}
exports.refresh = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	//req.session.saleProducts[parseInt(input.indice)].precio = parseInt(input.nuevoPrecio);
	req.session.saleProducts[parseInt(input.indice)].precioFinal = parseInt(input.nuevoPrecio);
	req.session.CostoTotal = 0;
	console.log(req.session.saleProducts);
	for(var i=0; i<req.session.saleProducts.length; i++){
		if(req.session.saleProducts[i] != null){
			if(req.session.saleProducts[i].precioFinal || req.session.saleProducts[i].precioFinal == 0){
				req.session.CostoTotal += req.session.saleProducts[i].precioFinal;
			}
			else{
				req.session.CostoTotal += req.session.saleProducts[i].precio;	
			}
		}
	}
	res.render('costo', {costo: req.session.CostoTotal});
}
exports.sale = function(req, res){
	console.log("RENDERIZANDO VENTA");
	console.log(req.session.saleProducts);
	console.log(req.session.CostoTotal);
	res.render('sale_table', {data: req.session.saleProducts, Costo: req.session.CostoTotal});
}




exports.cierreCaja = function(req,res){
	req.getConnection(function(err, connection){
		if(err){console.log("Error al conectar DB : %s",err);}
		connection.query("SELECT * FROM vendedor", function(err, vend){
			if(err){console.log("Error Selecting : %s", err);}
			res.render('select_date', {page_title:'Cierre de caja' ,login_admin: req.session.login_admin, vend: vend});
		});
	});
}


exports.cajaQuery = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	var codigoTurno = input.turno;
	var fecha = input.fecha;
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM vendedor RIGHT JOIN venta ON (vendedor.rutVendedor = venta.rut_vendedor) WHERE vendedor.rutVendedor = ? AND venta.fecha LIKE '%"+fecha+"%'",[codigoTurno],function(err,datos){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(datos);
			res.render('cierreCaja', {page_title: 'Detalles de ventas', data: datos});
		});
	});

}










function interseccion(array1, array2){
	var aux = [];
	for(var i=0; i<array1.length; i++){
		for(var j=0; j<array2.length; j++){
			if(array1[i] == array2[j]){
				aux[j] = array1[i];
				break;
			}
		}
	}
	console.log("INTERSECCION EN ENTRE");
	console.log(array1);
	console.log(array2);
	console.log(aux);
	return aux;
}





function igual(array1, array2){
	if(array1.length != array2.length){
		return false;
	}
	for(var i=0; i<array1.length; i++){
		if(array1[i] != array2[i]){
			return false;
		}
	}
	return true;
}



exports.check = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", [input.codigo], function(err, rows){
			if(err){
				console.log("Error Selecting : %s", err);
				res.send("error");
			}
			if(rows.length > 0){res.send("ok");}
			else{res.send("error");}	
		});
	});
}













exports.add_product = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var codigo = input.codigo;
	req.getConnection(function(err, connection){
		//connection.query("SELECT * FROM productofactura RIGHT JOIN producto ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ?", [codigo], function(err, rows){
		connection.query("SELECT * FROM producto WHERE id_producto = ?", [codigo], function(err, rows){
		
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length>0){
				//console.log(rows);
				var aux = req.session.saleProducts;
				if(aux.length == 0){
					req.session.saleProducts[0] = {
						id_producto: codigo,
						nombre: rows[0].nombre,
						precio: rows[0].precioactual,
						cantidad: 1,
						precioFinal: rows[0].precioactual,
						tipo: rows[0].tipo
					};
					req.session.CostoTotal += rows[0].precioactual;
					res.redirect('/render_sale');
				}
				else{
					for(var i=0; i<aux.length; i++){
						if(aux[i] != null){
							if(aux[i].id_producto == rows[0].id_producto){
								req.session.saleProducts[i].cantidad += 1;
								if(rows[0].tipo == 'unidad'){
									req.session.saleProducts[i].precioFinal += rows[0].precioactual;
								}
								req.session.CostoTotal += rows[0].precioactual;
								res.redirect('/render_sale');
								break;
							}
						}

						
						if(i == aux.length-1){
								var data = {
									id_producto: codigo,
									nombre: rows[0].nombre,
									precio: rows[0].precioactual,
									cantidad: 1,
									precioFinal: rows[0].precioactual,
									tipo: rows[0].tipo
								}
								req.session.saleProducts[i+1] = data;
								req.session.CostoTotal += rows[0].precioactual;
								res.redirect('/render_sale');
								break;
							}	
					}
				}

			}
			else{
				res.redirect('/render_sale');
			}
			
		});
	});
}


exports.refreshTabla = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = input.id_producto;
	var productos = req.session.saleProducts;
	console.log(input);
	if(input.cantidad == ''){input.cantidad=0;}
	var tipo = input.tipo;
	req.session.CostoTotal = 0;
	var precioFinal = 0;
	for(var i=0; i<productos.length; i++){
		if(productos[i]!=null){
			if(productos[i].id_producto == id){
				if(tipo == 'granel'){
					req.session.saleProducts[i].precioFinal = parseInt(input.cantidad);
					precioFinal = parseInt(input.cantidad);
					req.session.CostoTotal += parseInt(input.cantidad);
				}
				else{
					req.session.saleProducts[i].cantidad = input.cantidad;
					req.session.saleProducts[i].precioFinal = input.cantidad*productos[i].precio;
					precioFinal = input.cantidad*productos[i].precio;
					req.session.CostoTotal += parseInt(input.cantidad)*parseInt(productos[i].precio);
				}
				//tipo = req.session.saleProducts[i].tipo;
			}
			else{
				req.session.CostoTotal += productos[i].precioFinal;
			}
		}
		if(i==productos.length-1){
			console.log(req.session.saleProducts);
			var info = req.session.CostoTotal.toString()+"-"+precioFinal.toString()+"-"+tipo;
			res.send(info);
		}
	}
}







/*exports.add_product = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	req.getConnection(function(err, connection){

		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							var data = req.session.saleProducts[req.session.saleProducts.length-1];
							var array = data.nombre.split(',');
								connection.query("SELECT * FROM liquidaciontags", function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									if(rows.length > 0){
										for(var j=0; j<rows.length; j++){
												if(igual(interseccion(array, rows[j].tag_liquidacion.split(',')), rows[j].tag_liquidacion.split(',')) ){
													console.log("LIQUIDACIONES VALIDA");
													if(rows[j].tipo == 'porcentaje'){
														var precio = parseInt(rows[0].descuento)/100;
														precio = req.session.saleProducts[req.session.saleProducts.length-1].precio - precio*req.session.saleProducts[req.session.saleProducts.length-1].precio;
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}
													else{
														var precio = parseInt(rows[0].descuento);
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}		
												};
											}
									}
									else{//EL PRODUCTO NO TIENE LIQUIDACIONES POR SUS TAGS
										req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length-1].precio;
									}
									console.log(req.session.saleProducts);
									res.redirect('/render_sale');
								});						}
					});
			}

		});

	});
}
*/
























































/*

exports.add_product_other = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	var mysql = require('mysql');
	var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
	connection.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							req.session.CostoTotal += rows[0].precio;
							console.log(req.session.saleProducts);
							res.redirect('/render_sale');
						}
					});
			}

		});

	});
}
*/



exports.add_product_other = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	var mysql = require('mysql');
	var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
	connection.getConnection(function(err, connection){

		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							var data = req.session.saleProducts[req.session.saleProducts.length-1];
							var array = data.nombre.split(',');
								connection.query("SELECT * FROM liquidaciontags", function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									if(rows.length > 0){
										for(var j=0; j<rows.length; j++){
												if(igual(interseccion(array, rows[j].tag_liquidacion.split(',')), rows[j].tag_liquidacion.split(',')) ){
													console.log("LIQUIDACIONES VALIDA");
													if(rows[j].tipo == 'porcentaje'){
														var precio = parseInt(rows[0].descuento)/100;
														precio = req.session.saleProducts[req.session.saleProducts.length-1].precio - precio*req.session.saleProducts[req.session.saleProducts.length-1].precio;
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}
													else{
														var precio = parseInt(rows[0].descuento);
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}		
												};
											}
									}
									else{//EL PRODUCTO NO TIENE LIQUIDACIONES POR SUS TAGS
										req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length-1].precio;
									}
									console.log(req.session.saleProducts);
									res.redirect('/render_sale');
								});
						}
					});
			}

		});

	});
}












































exports.remove_product = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("REMOVIENDO PRODUCTO");
	console.log("******INPUT*****");
	console.log(input);
	console.log("*****VARIABLE SESSION (ANTES)*****");
	console.log(req.session.saleProducts);
	console.log("Costo total: "+ req.session.CostoTotal);
	//console.log(req.session.codeProducts);
	var descuentoFinal = req.session.saleProducts[input.indice].precioFinal;
	
	req.session.saleProducts[input.indice] = null;
	
	console.log("*****VARIABLE SESSION (DESPUES)*****");
	//req.session.codeProducts[input.indice] = null;
	console.log(req.session.saleProducts);
	req.session.CostoTotal -= parseInt(descuentoFinal);
	
	console.log("Costo total: "+ req.session.CostoTotal);
	res.redirect('/render_sale');
}


//UPDATE test SET col2 = CASE col1 WHEN 'test1' THEN 1 WHEN 'test2' THEN 3 WHEN 'test3' THEN 5
//UPDATE producto SET precio = ? WHERE id_producto = ? ',
exports.finish_sale = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var pago = input.pago;
	var RutVendedor = input.CodigoVendedor;
	var RutCliente = input.CodigoCliente;
	var fecha = new Date();
	var productos = req.session.saleProducts;
	req.session.tipoPago = pago;
	console.log("PRODUCTOOOOOS");
	console.log(productos);
	var insertId;
	if(RutVendedor == ''){RutVendedor = 0;}
	if(RutCliente == ''){RutCliente = 0;}
	req.getConnection(function(err, connection){
		data = {
			fecha: fecha,
			rut_vendedor: RutVendedor,
			rut_cliente: RutCliente,
			pago: pago,
			monto: req.session.CostoTotal
		};
		connection.query('INSERT INTO venta SET ?', data, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			
			insertId = rows.insertId;
			req.session.codVenta = rows.insertId;
			
			for(var i=0; i<productos.length; i++){
				if(productos[i] != null){
					connection.query('UPDATE producto SET cantidadtotal = cantidadtotal - ? WHERE id_producto = ?', [productos[i].cantidad, productos[i].id_producto], function(err, rows){
							if(err){
								console.log("Error Selecting : %s", err);
							}
						});
					/*connection.query('UPDATE productofactura SET cantidad = cantidad - ? WHERE id_producto = ? AND id_factura = ?', [productos[i].cantidad, productos[i].id_producto, productos[i].id_factura], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);

					});*/
					if(productos[i].tipo == 'unidad'){
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: productos[i].id_producto,
							precio: productos[i].precio,
							cantidad: productos[i].cantidad
						};
					}
					else{
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: productos[i].id_producto,
							precio: productos[i].precioFinal,
							cantidad: 1
						};	
					}
					
					/*if(productos[i].precioFinal || productos[i].precioFinal == 0){
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: productos[i].id_producto,
							precio: productos[i].precioFinal 
						};
					}
					else{
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: productos[i].id_producto,
							precio: productos[i].precio,
							id_producto: productos[i].id_producto
						};
					}*/
					connection.query('INSERT INTO ventaproducto SET ?', dataProduct, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
									
					});
				}
				if(i == productos.length-1){res.redirect('/voucher_sale');}
			}
	});
	});

}


exports.estadisticasxproducto = function(req, res){
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM ventaproducto LEFT JOIN venta ON (ventaproducto.id_venta = venta.id_venta)', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            console.log(rows);
            res.render('estadisticas_ventas', {page_title: 'Estadisticas de Ventas', data: rows});
        });

        
    });
}



exports.estadisticas = function(req, res){
	var datosVendedor; 
    /*req.getConnection(function(err, connection){
        connection.query('select * from venta right join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rut)', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);*/
            res.render('estadisticas_ventas', {page_title: 'Estadisticas de Ventas',  login_admin: req.session.login_admin });

        /*});

        
    });*/

}



exports.details = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from venta left join vendedor on (venta.rut_vendedor = vendedor.rutVendedor)', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('details_sale_table', {data: rows});

		});
	});
}

exports.fillSeller = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from vendedor right join venta on (vendedor.rutVendedor = venta.rut_vendedor) order by vendedor.rutVendedor', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);

			res.render('fill_seller_table', {data: rows});
			
		});
	});
}

exports.fillDate = function(req, res){
			res.render('fill_date_table');
}


exports.cambiarTabla = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM venta', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var datos = rows;
			for(var i=0; i<datos.length; i++){
				connection.query('SELECT * FROM venta LEFT JOIN ventaproducto ON (venta.id_venta = ventaproducto.id_venta) WHERE venta.id_venta = ?', datos[i].id_venta, function(err, rows){
					if(err){console.log("Error Selecting : %s", err);}
					var monto = 0;
					for(var j=0; j<rows.length; j++){
						monto += rows[j].precio;
					}
					console.log(monto);
					connection.query('UPDATE venta SET monto = ' + monto  + ' WHERE id_venta = ? ', rows[0].id_venta, function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
					});
				});
			}
		});
	});
	res.redirect('/');
}


exports.tableDate = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		var date = input.fecha.split('/');
		var fecha = "";
		for(var i=date.length-1; i>=0; i--){
			fecha += date[i];
			if(i != 0){fecha += "-";}
		}
		req.getConnection(function(err, connection){
			connection.query("select * from venta left join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) where venta.fecha like '"+fecha+"%'", function(err, rows){
				if(err){
					console.log("Error Selecting : %s", err);
				}
				res.render('date_table', {data: rows});
			});
		});	
}

exports.find = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('select * from ventaproducto left join venta on ventaproducto.id_venta = venta.id_venta left join producto on ventaproducto.codigo_producto = producto.id_producto left join vendedor on venta.rut_vendedor=vendedor.nombreVendedor where ventaproducto.id_venta = ?', [input.codVenta], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('sale_item', {data: rows, type: input.type, page_title: "Detalles de la venta"});
		});
	});
}



exports.actualizarTabla = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM ventaproducto', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var datos = rows;
			for(var i=0; i<datos.length; i++){
				connection.query('UPDATE ventaproducto SET id_producto = ' + parseInt(datos[i].codigo_producto.substring(7, 13))  + ' WHERE codigo_producto = ? ', datos[i].codigo_producto, function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
				});
			}
		});
	});
	res.redirect('/');
}


exports.deleteProduct = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigoProducto.toString().substring(0,2));
	var id_factura = parseInt(input.codigoProducto.toString().substring(3, 7));
	var id_producto = parseInt(input.codigoProducto.toString().substring(8, 13));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM ventaproducto right join venta ON (ventaproducto.id_venta = venta.id_venta) WHERE codigo_producto = ? AND ventaproducto.id_venta = ? ;', [input.codigoProducto, input.idVenta], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var saldo = rows[0].precio;
			var rutCliente = rows[0].rut_cliente;
			connection.query('UPDATE cliente SET monedero = monedero+'+saldo+' WHERE rutCliente = ?', [rutCliente], function(err, rows){	
				if(err)
					console.log("Error Selecting : %s", err);
				connection.query('DELETE FROM ventaproducto WHERE codigo_producto = ?', [input.codigoProducto], function(err, rows){
					if(err)
						console.log("Error Selecting : %s", err)
					connection.query('UPDATE venta SET monto = monto -' + input.precio  + ' WHERE id_venta = ? ', [input.idVenta], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.query('UPDATE producto SET cantidadtotal = cantidadtotal + 1 WHERE id_producto = ?', [parseInt(input.codigoProducto.substring(7, 13))],function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
							connection.query('UPDATE productofactura SET cantidad = cantidad + 1 WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?', [id_producto, id_factura, indice_bulto], function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);							
								res.send('success');
							});
						});
					});	
				});
			});
		});
});
}


exports.remove = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM ventaproducto WHERE id_venta = ?', [input.id_venta], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var data = rows;
			var query = "UPDATE producto SET cantidadtotal = cantidadtotal + 1 ";
			var query2 = "UPDATE productofactura SET cantidad = cantidad + 1 "; 
			for(var i=0; i<data.length; i++){
				if(i==0){
					query += "WHERE ";
					query2 += "WHERE ";
				}
				query += "id_producto = " + parseInt(data[i].codigo_producto.substring(7, 13));
				query2 += "id_producto = " + parseInt(data[i].codigo_producto.substring(7, 13)) + " AND id_factura="+parseInt(data[i].codigo_producto.substring(3, 7))+" AND indice_bulto="+parseInt(data[i].codigo_producto.substring(0, 2));
				if(i != data.length-1){
					query += " OR ";
					query2 += " OR ";
			} 
			}
			console.log(query);
			connection.query(query, function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				connection.query(query2, function(err, rows){
					if(err)
						console.log("Error Selecting : %s", err);
					connection.query('SELECT * FROM venta WHERE id_venta = ?', [input.id_venta], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						var monto = rows[0].monto;
						var vendedorRut = rows[0].rut_cliente;
						console.log(monto);
						console.log(vendedorRut);
						connection.query('UPDATE cliente SET monedero = monedero + '+monto+' WHERE rutCliente = ?', [vendedorRut], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
							connection.query('DELETE from ventaproducto WHERE id_venta = ?', [input.id_venta], function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
								connection.query('DELETE from venta WHERE id_venta = ?', [input.id_venta], function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									res.send('ok');
								});
							});
						});
					});
				});
			});
		});
	});
}

exports.calculateDif = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var total = req.session.CostoTotal;
	var dif = total - parseInt(input.saldo);
	res.send(' '+dif+' ');
}

exports.sessionSeller = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor WHERE rutVendedor = ?', input.rut, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			req.session.nameSeller = rows[0].nombreVendedor;
			res.send('NOMBRE ALMACENADO');
		});
	});
}





exports.range_sale = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var order = "ORDER BY FIELD (rutVendedor, ";
			for(var i=0; i<rows.length; i++){
				order += '"'+rows[i].rutVendedor+'"';
				if(i == rows.length-1){
					order += ")";
					console.log(order);
					connection.query('select * from vendedor right join venta on (vendedor.rutVendedor = venta.rut_vendedor) WHERE venta.fecha BETWEEN "'+input.desde+'" AND "'+input.hasta+'"  '+order, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						//console.log(rows);
						res.render('range_sale', {data: rows});
					});
				}
				else{order += ","}

			}
		});
	});
}


exports.informeTurno = function(req, res){
	req.getConnection(function(err, connection){
		
			var fecha = new Date().toLocaleString();
			//console.log(fecha);
			/*fecha = fecha.split('-');
			if(fecha[1].length == 1){fecha[1] = "0"+fecha[1];}
			if(fecha[2].length == 1){fecha[2] = "0"+fecha[2];}*/
			//var date = fecha.join('-');
			//var fecha = fecha.getFullYear()+"%"+parseInt(fecha.getMonth()+1).toString()+"%"+parseInt(fecha.getDate()+1).toString();
			//console.log(date);
			console.log(req.session.sellerData);
			connection.query("SELECT caja.*,vendedor.nombreVendedor as nombre FROM caja left join vendedor on caja.codturno=vendedor.rutVendedor  WHERE idcaja=(SELECT MAX(idcaja) FROM caja)", function(err, caja){
				if(err) throw err;
				console.log(fecha)
				console.log(caja[0].fecha.toLocaleString());
				connection.query("SELECT info.codigo_producto, info.fecha, info.precio AS precio_u, producto.nombre, SUM(info.cantidad) as total"
						+"  FROM (SELECT ventaproducto.*, venta.fecha FROM ventaproducto LEFT JOIN venta ON ventaproducto.id_venta = venta.id_venta WHERE venta.rut_vendedor = ? AND venta.pago = 'Efectivo' AND venta.fecha BETWEEN '"+caja[0].fecha.toLocaleString()+"' AND '"+fecha+"' ORDER BY ventaproducto.codigo_producto) as info "
						+"LEFT JOIN producto ON info.codigo_producto = producto.id_producto WHERE producto.tipo='unidad' GROUP BY info.codigo_producto", [req.session.sellerData.rutVendedor], function(err, inf){
							if(err) throw err;
							//console.log(inf);
							connection.query("select ventaproducto.codigo_producto, venta.fecha, producto.nombre, ventaproducto.cantidad as total,sum(ventaproducto.precio) as precio_u from ventaproducto left join venta on ventaproducto.id_venta=venta.id_venta left join producto "
								+"on producto.id_producto = ventaproducto.codigo_producto where venta.rut_vendedor = ? and venta.pago = 'Efectivo' and producto.tipo='granel' "
								+"AND venta.fecha  BETWEEN '"+caja[0].fecha.toLocaleString()+"' AND '"+fecha+"' group by ventaproducto.codigo_producto", [req.session.sellerData.rutVendedor], function(err, granel){
									if(err) throw err;
									connection.query(/*"SELECT * FROM flujo WHERE flujo.inst BETWEEN '"+caja[0].fecha.toLocaleString()+"' AND '"+fecha+"'"*/
										"SELECT * FROM flujo WHERE flujo.idturno=?",[caja[0].idcaja],
										function(err, mov){
											if(err) throw err;
									
											res.render('informe_turno', {page_title: "Informe de Ventas", login_admin: req.session.login_admin, data: inf, data2: granel,caja: caja[0] , flujo: mov});			
										});
								});
							});
			});
	});
}

exports.flujoTurno = function(req, res){
	req.getConnection(function(err, connection){
		
			connection.query("SELECT * FROM flujo", function(err, flu){
				if(err)
					console.log("Error Selecting %s", err);
				res.render('flujo_caja', {page_title: "Flujo de Caja", data:flu, login_admin: req.session.login_admin});

				 
			});
	});
}

exports.cerrarTurno = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var final = input.final;
	var idcaja = input.idcaja;
	req.getConnection(function(err, connection){
			if(err) throw err;
				connection.query("UPDATE caja SET final=? WHERE idcaja=?", [final,idcaja],function(err, caja){
				if(err) throw err;
				delete req.session.sellerData;
				res.redirect('/');
			});
	});
}


exports.quitarSaldo = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var idcaja = input.idcaja;
	var monto = input.monto;
	var detalle = input.detalle;
	var flujo = {
		idturno: idcaja,
		monto: monto,
		inst: new Date().toLocaleString(),
		detalle : detalle
	};
	console.log(flujo);
	req.getConnection(function(err, connection){
			if(err) throw err;
				connection.query("UPDATE caja SET monto = monto-"+monto+" WHERE idcaja=?", [idcaja],function(err, updata){
					if(err) throw err;
					connection.query("INSERT INTO flujo SET ?", [flujo], function(err, insrflujo){
						if(err) throw err;
						connection.query("SELECT * FROM caja WHERE idcaja=?", [idcaja],function(err, caja){
							if(err) throw err;
							console.log(caja);
							res.send(caja[0].monto+'');
						});
					});
			});
	});
}