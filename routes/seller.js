exports.check = function(req, res){
	var input = req.params.codigoVendedor;
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM vendedor WHERE rutVendedor = ?",[input], function(err, sell){
			if(err){console.log("Error Selecting : %s", err);}
			if(sell.length > 0){
				res.send('ok');
			}
			else{
				res.send('error');
			}
		});
	});
}
exports.list = function(req, res){
	res.render('seller_list', {page_title: 'Vendedores'});
	/*req.getConnection(function(err, connection){
		connection.query("SELECT * FROM vendedor",function(err,rows){
			if(err)
				console.log("Error inserting : %s", err);
			res.render('seller_list', {page_title: 'Vendedores', data: rows});
		});
	});*/
}

exports.find = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM vendedor WHERE rutVendedor = ?", input.find_rut, function(err, rows){
			if(err)
				console.log("Error inserting : %s", err);

			
			console.log(rows);
			res.send(rows);			
		});
	});
}


exports.new = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		data = {rutVendedor: input.rut, nombreVendedor: input.nombre};
		connection.query("INSERT INTO vendedor SET ?", data, function(err, rows){
			if (err)
				console.log("Error inserting : %s ",err );
			else{
				console.log(data);
				res.redirect('/render_seller');	
			}
		});
	});
}


exports.erase = function(req, res){
	req.getConnection(function(err,connection){
					 	var input = JSON.parse(JSON.stringify(req.body));
					 	var rut = input.rut;
					 	console.log(rut);
						connection.query('DELETE FROM vendedor WHERE rutVendedor = ?', [rut],function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );

								console.log(rows);
								res.redirect('/render_seller');	
						});//SE BORRA EL PROVEEDOR
						
				});
}


exports.render = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor', function(err, rows){
			if(err)
				console.log("Error Selecting : %s ", err);
			res.render('render_seller', {data: rows});
		});
	});
}

exports.details = function(req, res){
	var input = req.params;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor RIGHT JOIN venta ON (vendedor.rutVendedor = venta.rut_vendedor) WHERE vendedor.rutVendedor = ?', [input.rutVendedor], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('sale_seller_details', {page_title: 'Detalles de ventas', data: rows, login_admin: req.session.login_admin});

		});
	});
}



exports.def_turno = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor', function(err, rows){
			if(err)
			console.log("Error Selecting : %s", err);
			res.render('def_turno', {page_title: 'Definir turno', data: rows, login_admin: req.session.login_admin, before: req.session.before});
		});
	});
}

exports.set_turno = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	input.fecha = new Date().toLocaleDateString();
	delete input.before;
	req.getConnection(function(err, connection){
		connection.query('INSERT INTO caja SET ?', [input], function(err, rows){
			if(err) throw err;

			connection.query("UPDATE vendedor SET active = 0 WHERE active = 1", function(err, rows){
					if(err) throw err;
				connection.query("UPDATE vendedor SET active = 1 WHERE rutVendedor = ?", [input.codturno], function(err, rows){
					if(err) throw err;	
					connection.query("SELECT * FROM vendedor WHERE active = 1", function(err, seller){
						if(err) throw err;
						req.session.sellerData = seller[0];
						res.redirect(req.session.nexturl);
				
					});	
				});
			});		
		});
	});
}