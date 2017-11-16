 CREATE TABLE `cliente` (
  `rut` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `factura` (
  `id_Factura` int(9) NOT NULL AUTO_INCREMENT,
  `Fecha` datetime NOT NULL,
  `Costo` int(50) NOT NULL,
  `Iva` int(2) NOT NULL,
  `Ready` tinyint(1) NOT NULL,
  `Bultos` int(11) NOT NULL,
  `Rut_Proveedor` int(11) NOT NULL,
  PRIMARY KEY (`id_Factura`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8


CREATE TABLE `producto` (
  `id_producto` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cantidadtotal` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `productofactura` (
  `id_producto` int(10) NOT NULL,
  `id_factura` int(9) NOT NULL,
  `indice_bulto` int(2) NOT NULL,
  `precio` int(11) NOT NULL,
  `cantidad` int(3) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_factura`,`indice_bulto`),
  KEY `idProducto` (`id_producto`),
  KEY `idFactura` (`id_factura`),
  CONSTRAINT `idFactura` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_Factura`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idProducto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `proveedor` (
  `Rut_proveedor` int(7) NOT NULL,
  `Nombre_proveedor` varchar(45) NOT NULL,
  `Telefono` int(15) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Mail` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`Rut_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `tagproducto` (
  `tag` varchar(45) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`tag`,`id_producto`),
  KEY `idProducto` (`id_producto`),
  KEY `Tag` (`tag`),
  CONSTRAINT `id_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `tag` FOREIGN KEY (`tag`) REFERENCES `tags` (`tag`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `tags` (
  `tag` varchar(30) NOT NULL,
  PRIMARY KEY (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `usuario` (
  `nombre` varchar(45) NOT NULL,
  `contrasenna` varchar(45) NOT NULL,
  PRIMARY KEY (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `vendedor` (
  `rut` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `venta` (
  `id_venta` int(10) NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `rut_vendedor` int(11) DEFAULT NULL,
  `rut_cliente` int(11) DEFAULT NULL,
  `pago` varchar(20) NOT NULL,
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `ventaproducto` (
  `id_venta` int(11) NOT NULL,
  `codigo_producto` varchar(16) NOT NULL COMMENT 'codigo completo de 16 digitos ',
  `precio` int(11) NOT NULL,
  PRIMARY KEY (`id_venta`,`codigo_producto`),
  KEY `idVenta` (`id_venta`),
  KEY `idProducto` (`codigo_producto`),
  CONSTRAINT `id_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8