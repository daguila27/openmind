

exports.generate_voucher = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var f = new Date();
	var providerName = "";
	var total = parseInt(input.costo) + (parseInt(input.iva)/100)*parseInt(input.costo);
	var fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
	

		req.getConnection(function (err, connection) {
				var data = {
					Fecha 	: f,
					Costo   : input.costo,
					Iva		: input.iva,
					Ready   : false,
					Rut_Proveedor : input.id_proveedor
				};
				var query = connection.query("INSERT INTO factura SET ? ", data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );
					var numFactura = rows.insertId;	
					connection.query('SELECT * FROM proveedor WHERE Rut_Proveedor = ?', [input.id_proveedor],function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								
								providerName = rows[0].Nombre_proveedor;
								/*var jre = require('node-jre');
								var output = jre.spawnSync(   
								    ['routes/java'],           
								    'impresora',                 
								    [input.costo, input.iva, fecha, providerName, numFactura, total],            
								    { encoding: 'utf8' }     
								  ).stdout.trim();*/



		 						  /*var printer = require("node-thermal-printer");
									printer.init({
									  type: 'epson',
									  interface: '/dev/usb/lp0'
									});
									printer.alignCenter();
									printer.println("Hello world");
									printer.printImage('./assets/img/belitaicon.png', function(done){
									  printer.cut();
									  printer.execute(function(err){
									    if (err) {
									      console.error("Print failed", err);
									    } else {
									     console.log("Print done");
									    }
									  });
									});*/
								res.redirect('/facture_list');
						 });	
					

				});
		});
}


exports.voucher_sale = function(req, res){
	var detalles = req.session.saleProducts;
	var Costo = req.session.CostoTotal;
	var details = ""; 
	var jre = require('node-jre');
	var f = new Date();
	var fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
	
	for(var i=0; i<detalles.length; i++){
		if(detalles[i]!=null){
			var ite = 30 - parseInt(detalles[i].nombre.length);
			var space = ""; 
			for(var j=0; j<ite; j++){
				space += " ";
			}
			if(detalles[i].precioFinal || detalles[i].precioFinal == 0){
				details += "   " + detalles[i].nombre.replace(',',' ') + space+"$"+ detalles[i].precioFinal+ "\n";
			}
			else{
				details += "   " + detalles[i].nombre.replace(',',' ') + space+"$"+ detalles[i].precio+ "\n";	
			}
		}
	}
	/*var output = jre.spawnSync( 
	    ['routes/java'],                 
	    'impresoraSale',                  
	    [details, Costo, fecha, req.session.codVenta, req.session.nameSeller], 
	    { encoding: 'utf8' }      
	  ).stdout.trim();*/
		

		/*var printer = require("node-thermal-printer");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0'
});
printer.alignCenter();
printer.println("Hello world");
printer.printImage('./assets/img/belitaicon.png', function(done){
  	printer.cut();
  	printer.execute(function(err){
	    if (err) {
	      console.error("Print failed", err);
	    } else {
	     console.log("Print done");
	    }
	  });
	});*/
	console.log(output);
	console.log(details);
	console.log(req.session.nameSeller);
	res.redirect('/new_sale');	
}

	