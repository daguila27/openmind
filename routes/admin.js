
//Vista lista de usuarios.
exports.list = function(req, res){
	if(req.session.isAdminLogged){
		req.getConnection(function(err,connection){
					 
						connection.query('SELECT * FROM user',function(err,rows)
						{
								
								if(err)
										console.log("Error Selecting : %s ",err );
				 
								res.render('user',{page_title:"Stats",data:rows});
										
						 });
						 //console.log(query.sql);
				});
		}
		else res.redirect('/bad_login');  
};

//Vista agregar usuario.
exports.add = function(req, res){
	if(req.session.isAdminLogged){
		res.render('add_user',{page_title:"Agregar usuario"});
		}
		else res.redirect('/bad_login');
};
// Logica agregar user.
exports.save = function(req,res){
	if(req.session.isAdminLogged){
		var input = JSON.parse(JSON.stringify(req.body));
		req.getConnection(function (err, connection) {

				var data = {

						username   : input.username,
						password   : input.password,
						tipo	   : input.tipo

				};

				var query = connection.query("INSERT INTO user SET ? ",data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );

					res.redirect('/user');

				});

			 // console.log(query.sql); get raw query

		});
		}
		else res.redirect('/bad_login');
};

//Vista editar usuario.
exports.edit = function(req, res){
	
	if(req.session.isAdminLogged){
		var username = req.params.username;
		
		req.getConnection(function(err,connection){
				var query = connection.query('SELECT * FROM user WHERE username = ?',[username],function(err,rows)
				{
						
						if(err)
								console.log("Error Selecting : %s ",err );
		 
						res.render('edit_user',{page_title:"Edit Users",data:rows});
								
					 
				 });
				 
				 //console.log(query.sql);
		}); 
		}
		else res.redirect('/bad_login');
};

//Logica editar usuario.
exports.save_edit = function(req,res){

	if(req.session.isAdminLogged){
		var input = JSON.parse(JSON.stringify(req.body));
		var username = req.params.username;
		
		req.getConnection(function (err, connection) {
				
				var data = {

						username   : input.username,
						password   : input.password 
				
				};
				
				connection.query("UPDATE user set ? WHERE username = ? ",[data,username], function(err, rows)
				{
	
					if (err)
							console.log("Error Updating : %s ",err );
				 
					res.redirect('/user');
					
				});
		});
		}
		else res.redirect('/bad_login');
};

//Borrar usuario.
exports.delete_user = function(req,res){

	if(req.session.isAdminLogged){
		 var username = req.params.username;
		
		 req.getConnection(function (err, connection) {
				
				connection.query("DELETE FROM user WHERE username = ? ",[username], function(err, rows)
				{
						
						 if(err)
								 console.log("Error deleting : %s ",err );
						
						 res.redirect('/user');
						 
				});
				
		 });
		}
		else res.redirect('/bad_login');
};