CREATE TABLE IF NOT EXISTS `Proveedor` (
  `Codigo_proveedor` INT(11) NOT NULL AUTO_INCREMENT,
  `Nombre_proveedor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Codigo_proveedor`)
);

CREATE TABLE `belita`.`factura` ( 
	`id_Factura` INT(9) NOT NULL AUTO_INCREMENT , 
	`Fecha` DATE NOT NULL , `Costo` INT NOT NULL , 
	`id_Proveedor` INT NOT NULL , 
	PRIMARY KEY (`id_Factura`)) ENGINE = InnoDB;