 CREATE DATABASE openmind;

 USE openmind;


 
 CREATE TABLE `cliente` (
  `rutCliente` int(11) NOT NULL,
  `nombreCliente` varchar(45) NOT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `mail` varchar(60) DEFAULT NULL,
  `fecha_nacimiento` varchar(20) DEFAULT NULL,
  `monedero` int(11) NOT NULL,
  PRIMARY KEY (`rutCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `factura` (
  `id_Factura` int(9) NOT NULL AUTO_INCREMENT,
  `Fecha` datetime NOT NULL,
  `Costo` int(50) NOT NULL,
  `Iva` int(2) NOT NULL,
  `Ready` tinyint(1) NOT NULL,
  `Rut_Proveedor` int(11) NOT NULL,
  PRIMARY KEY (`id_Factura`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;


CREATE TABLE `producto` (
  `id_producto` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cantidadtotal` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `productofactura` (
  `id_producto` int(10) NOT NULL,
  `id_factura` int(9) NOT NULL,
  `precio` int(11) NOT NULL,
  `cantidad` int(3) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_factura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `proveedor` (
  `Rut_proveedor` int(11) NOT NULL,
  `Nombre_proveedor` varchar(45) NOT NULL,
  `Telefono` int(15) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Mail` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`Rut_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




CREATE TABLE `usuario` (
  `nombre` varchar(45) NOT NULL,
  `contrasenna` varchar(45) NOT NULL,
  PRIMARY KEY (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `vendedor` (
  `rutVendedor` int(11) NOT NULL,
  `nombreVendedor` varchar(45) NOT NULL,
  PRIMARY KEY (`rutVendedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `venta` (
  `id_venta` int(10) NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `rut_vendedor` int(11) DEFAULT NULL,
  `rut_cliente` int(11) DEFAULT NULL,
  `pago` varchar(20) NOT NULL,
  `monto` int(11) NOT NULL,
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `ventaproducto` (
  `id_venta` int(11) NOT NULL,
  `codigo_producto` varchar(16) NOT NULL COMMENT 'codigo completo de 16 digitos ',
  `precio` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`id_venta`,`codigo_producto`),
  KEY `idVenta` (`id_venta`),
  KEY `idProducto` (`codigo_producto`),
  CONSTRAINT `id_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
