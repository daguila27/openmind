
var express = require('express');//SE CARGA EL MODULO EXPRESS EN UNA VARIABLE
var routes = require('./routes');
var path = require('path');//PATH ES UN MODULO DE GESTION DE RUTAS DE NODEJS
var http = require('http');

/*ESTAS VARIABLES NOS PERMITEN TENER ACCESO A LA FUNCIONES
CORRESPONDIENTES AL MODULO QUE HAYAMOS INVOCADO EN REQUIRE('...')*/


var app = express();//SE CREA EL OBJETO SERVIDOR

var flash = require('connect-flash');
var connection  = require('express-myconnection');
var mysql = require('mysql');

var index = require('./routes/index');
var provider = require('./routes/provider');
var facture = require('./routes/facture');


var product = require('./routes/product');
//var product = require('./routes/productfor4O');


var voucher = require('./routes/voucher');


var tag = require('./routes/tags');


var sale = require('./routes/sale');


var seller = require('./routes/seller');
var client = require('./routes/client');
var user = require('./routes/users');
var test = require('./routes/test');


// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.methodOverride());
app.use(flash());
app.use(express.cookieParser('isLogged'));
app.use(express.cookieSession());

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.use(connection(mysql, {
  host: '127.0.0.1',
  user: 'root',
  password: 'gallardo27',
  port: 3306,
  database: 'openmind'
}, 'pool'));



	
app.get('/', index.index);
app.post('/barCodes', index.codes);
app.post('/rutCodes', index.rutCodes);
app.get('/admin_login', index.to_login);
app.get('/changePass', index.changePass);
app.get('/setPrecio', index.setPrecio);
app.get('/setPrecioB', index.setPrecioB);



app.post('/login', user.login);
app.get('/guest_login', user.user_login);
app.post('/cambiar_contrasena', user.cambiar_contrasena);


app.get('/providers', provider.list);
app.post('/save_provider', provider.save_provider);
app.post('/delete_provider', provider.delete);
app.get('/render_provider', provider.render);

app.post('/new_inventory', facture.new_inventory);
app.get('/facture_list', facture.list);
app.post('/saved_facture', facture.save);
app.post('/next_step', facture.next);
app.get('/delete_all_facture', facture.delete_all);
app.get('/table_facture', facture.table_render);



app.post('/make_inventory', facture.make_inventory);
app.get('/tabla_factura/:id_factura', facture.tabla_factura);
app.post('/guardar_factura', facture.saveFactura);


app.post('/details_factura', facture.details);
app.get("/new_facture", facture.new_voucher);


app.get("/voucher_sale", voucher.voucher_sale);
app.post("/generate_voucher", voucher.generate_voucher);
app.get("/testprinter", voucher.testprinter);




//app.get("/search_producto/:codigo", product.searchProducto);


app.post("/delete_producto", product.eraseProduct);
app.post("/create_producto", product.create_producto);
app.post("/buscar_info", product.buscar_info);


app.post('/new_product', product.new_product);
app.post('/delete_product', product.delete);
app.post('/find_product', product.find);
app.post('/find_product_sale', product.findForSale);

app.post('/findProduct', product.findForSale);
app.get('/stock_list', product.list);
app.post('/render_table', product.renderTableFactura);
//app.get('/render_table/:id_facture', product.forBundle);
app.post('/saveBundle', product.save_bundle);
app.get('/show_product', product.show);
app.get('/returns', product.devolucion);
app.post('/colect_product', product.colect);
app.get('/traspaso', product.traspaso);
app.get('/export_product', product.export);
app.get('/import_product', product.import);
app.get('/descuentos', product.descuentos);
app.get('/LiquidarCod', product.liqCod);
app.post('/registLiq', product.registrar_liquidacion);
app.get('/render_liquidaciones', product.render_liquidaciones);
app.post('/product_details', product.details);
app.post('/removeLiq', product.removeLiq);
app.post('/import_add', product.addImport);
app.post('/export_add', product.addExport);
app.get('/render_import', product.renderImport);
app.post('/buscar_nombre', product.buscar_nombre);

app.post('/find_import', product.findImport);



app.get('/pull_data_product/:id_producto', product.pull_data);

app.post('/editar_producto', product.editar);




app.post('/search_tag', tag.search);
app.post('/add_tag', tag.add);
app.get('/saveConnection', tag.saveConnection);
app.post('/saveTags', tag.saveTags);
app.get('/tags_list', tag.list);
app.get('/render_list', tag.render);
app.post('/render_list_like', tag.render_like);
app.post('/info_tag', tag.info_tag);
app.get('/LiquidarTag', tag.liqTag);
app.post('/registTagLiq', tag.addTagLiq);
app.get('/table_liquidaciontags', tag.renderLiq);

app.post('/remove_tagLiquidacion', tag.removeLiq);


app.get('/new_sale', sale.new);
app.get('/render_sale', sale.sale);

app.post('/check_product', sale.check);

app.post('/add_product', sale.add_product);
app.post('/add_product_other', sale.add_product_other);

app.post('/remove_product', sale.remove_product);
app.post('/finish_sale', sale.finish_sale);
app.post('/refreshData', sale.refresh);
app.get('/sale_estadisticas', sale.estadisticas);
app.get('/sale_details', sale.details);
app.get('/fill_seller', sale.fillSeller);
app.get('/fill_date', sale.fillDate);
app.post('/table_saleDate', sale.tableDate);
app.post('/find_sale', sale.find);
app.post('/delete_for_sale', sale.deleteProduct);
app.post('/remove_sale', sale.remove);
app.post('/reSaldo', sale.calculateDif);

app.get('/cambiarTabla', sale.cambiarTabla);
app.get('/actualizarTabla', sale.actualizarTabla);
app.post('/sessionSeller', sale.sessionSeller);

app.post('/range_sale', sale.range_sale);


app.post('/refreshTabla', sale.refreshTabla);

app.get('/caja', sale.cierreCaja);
app.post('/cajaQuery', sale.cajaQuery);







app.get('/check_seller/:codigoVendedor', seller.check);
app.get('/seller_list', seller.list);
app.post('/find_seller', seller.find);
app.post('/new_seller', seller.new);
app.post('/erase_seller', seller.erase);
app.get('/render_seller', seller.render);
app.get('/details_seller/:rutVendedor', seller.details);

app.post('/find_client', client.find);
app.get('/client_list', client.list);
app.get('/render_client', client.render);
app.post('/new_client', client.new);
app.post('/erase_client', client.erase);
app.get('/createMoney', client.createMoney);





app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Ingrese en su navegador a http://localhost:' + app.get('port'));
});




	
	/*var output = jre.spawnSync( 
	    ['routes/java'],                 
	    'impresoraSale',                  
	    [details, Costo, fecha, req.session.codVenta, req.session.nameSeller], 
	    { encoding: 'utf8' }      
	  ).stdout.trim();            
	console.log(output);*/



	//COMISION DE VENDEDORES
