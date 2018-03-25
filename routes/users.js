exports.login = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM usuario WHERE nombre = ?', input.nombre, function(err, rows){
          if(err)
            console.log('Error Selecting : %s', err);
  
          
          if(rows.length == 0){
            res.render('admin_login', {page_title: 'Ingrese de Administrador', login: 'failed_user'});
          }
          else if(rows[0].contrasenna != input.contrasenna){
            res.render('admin_login', {page_title: 'Ingreso de Administrador', login: 'failed_pass'});
          }
          else{
            console.log(req.session);
            req.session.login_admin = true;
            console.log(req.session);
            if(req.session.sellerData){
              res.redirect('/new_sale');
            }
            else{
              req.session.nexturl = '/new_sale';
              res.redirect('/def_turno');
            }
          }
        });
    });
}
exports.user_login = function(req, res){
    req.session.login_admin = false;
    res.redirect('new_sale');

}

exports.cambiar_contrasena = function(req, res){
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM usuario WHERE nombre = "openmind" AND contrasenna = ?', [input.contraActual], function(err, rows){
      if(err)
        console.log('Error Selecting : %s', err);
      if(rows.length > 0){
          connection.query('UPDATE usuario SET contrasenna = ? WHERE nombre = "opemind"', [input.newPass],function(err, rows){
            if(err)
              console.log("Error Selecting : %s", err);
            res.redirect('/admin_login');
          });
      }
      else{
          res.redirect('/changePass')
      }
    });
  });
}

exports.render_notif = function(req, res){
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM notif WHERE ok = false', function(err, notif){
      if(err)
        console.log('Error Selecting : %s', err);
      //console.log(notif);
      res.render('notificaciones', {notif: notif})
    });
  });
}


exports.check_notif = function(req, res){
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection){
    connection.query('UPDATE notif SET ok = true WHERE idnotif = ?', [input.idnotif] ,function(err, notif){
      if(err)
        console.log('Error Selecting : %s', err);
      res.redirect('/render_notif');
    });
  });
}


exports.inv_notif = function(req, res){
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM notif WHERE idnotif = ?', [input.idnotif] ,function(err, notif){
      if(err)
        console.log('Error Selecting : %s', err);
      if(notif.length>0){
        connection.query("SELECT * FROM producto WHERE id_producto = ?", [notif[0].id_producto], function(err, prod){
          if(err)
            console.log("Error Selecting : %s", err);
          res.send(prod[0]);
        });
      }
    });
  });
}