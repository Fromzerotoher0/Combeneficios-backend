-- MySQL Script generated by MySQL Workbench
-- Wed Nov  3 09:12:02 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema combeneficios_test
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema combeneficios_test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `combeneficios_test` DEFAULT CHARACTER SET utf8 ;
USE `combeneficios_test` ;

-- -----------------------------------------------------
-- Table `combeneficios_test`.`tipo_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`tipo_usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`parentesco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`parentesco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parentesco` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo_id` VARCHAR(45) NOT NULL,
  `nro_documento` INT NOT NULL,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `sexo` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `imgUrl` VARCHAR(255) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `departamento` VARCHAR(45) NOT NULL,
  `ciudad` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `parentesco_id` INT NOT NULL,
  `tipo_usuario` INT NOT NULL,
  `titular_id` INT NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_tipo_usuario1_idx` (`tipo_usuario` ASC) ,
  INDEX `fk_users_paretesco1_idx` (`parentesco_id` ASC) ,
  INDEX `fk_users_users1_idx` (`titular_id` ASC) ,
  CONSTRAINT `fk_users_tipo_usuario1`
    FOREIGN KEY (`tipo_usuario`)
    REFERENCES `combeneficios_test`.`tipo_usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_paretesco1`
    FOREIGN KEY (`parentesco_id`)
    REFERENCES `combeneficios_test`.`parentesco` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_users1`
    FOREIGN KEY (`titular_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`municipios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`municipios` (
  `id_municipio` INT NOT NULL,
  `municipio` VARCHAR(45) NOT NULL,
  `estado` INT NOT NULL,
  `departamento_id` INT NOT NULL,
  PRIMARY KEY (`id_municipio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`departamentos` (
  `id_departamento` INT NOT NULL,
  `departamento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_departamento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`especializaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`especializaciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`medico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`medico` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `nombres` VARCHAR(255) NOT NULL,
  `apellidos` VARCHAR(255) NOT NULL,
  `documento` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `especializaciones_id` INT NOT NULL,
  `modalidad_cita` VARCHAR(45) NOT NULL,
  `imgUrl` VARCHAR(255) NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_medico_users1_idx` (`users_id` ASC) ,
  INDEX `fk_medico_especializaciones1_idx` (`especializaciones_id` ASC) ,
  CONSTRAINT `fk_medico_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medico_especializaciones1`
    FOREIGN KEY (`especializaciones_id`)
    REFERENCES `combeneficios_test`.`especializaciones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`agenda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`agenda` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `especialidad` VARCHAR(45) NOT NULL,
  `medico_id` INT NOT NULL,
  `tarifa` DOUBLE NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_agenda_medico1_idx` (`medico_id` ASC) ,
  CONSTRAINT `fk_agenda_medico1`
    FOREIGN KEY (`medico_id`)
    REFERENCES `combeneficios_test`.`medico` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`cita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `agenda_id` INT NOT NULL,
  `beneficiario_id` INT NOT NULL,
  `medico_id` INT NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_cita_agenda1_idx` (`agenda_id` ASC) ,
  INDEX `fk_cita_users1_idx` (`beneficiario_id` ASC) ,
  INDEX `fk_cita_medico1_idx` (`medico_id` ASC) ,
  CONSTRAINT `fk_cita_agenda1`
    FOREIGN KEY (`agenda_id`)
    REFERENCES `combeneficios_test`.`agenda` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cita_users1`
    FOREIGN KEY (`beneficiario_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cita_medico1`
    FOREIGN KEY (`medico_id`)
    REFERENCES `combeneficios_test`.`medico` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`tipo_estudio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`tipo_estudio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo_estudio` VARCHAR(45) NOT NULL,
  `created_at` DATE NOT NULL,
  `updated_At` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`estudios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`estudios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `fecha_obtencion` DATE NOT NULL,
  `universidad` VARCHAR(255) NOT NULL,
  `tipo_estudio` INT NOT NULL,
  `medico_id` INT NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_estudios_tipo_estudio1_idx` (`tipo_estudio` ASC) ,
  INDEX `fk_estudios_medico1_idx` (`medico_id` ASC) ,
  CONSTRAINT `fk_estudios_tipo_estudio1`
    FOREIGN KEY (`tipo_estudio`)
    REFERENCES `combeneficios_test`.`tipo_estudio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estudios_medico1`
    FOREIGN KEY (`medico_id`)
    REFERENCES `combeneficios_test`.`medico` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`credencial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`credencial` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `beneficiario_id` INT NOT NULL,
  `fecha_vencimiento` DATE NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `updated_at` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_credencial_users1_idx` (`beneficiario_id` ASC) ,
  CONSTRAINT `fk_credencial_users1`
    FOREIGN KEY (`beneficiario_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`solicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`solicitud` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(255) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `documento` VARCHAR(45) NOT NULL,
  `universidad` VARCHAR(255) NOT NULL,
  `modalidad` VARCHAR(255) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `users_id` INT NOT NULL,
  `especializaciones_id` INT NOT NULL,
  `asunto` VARCHAR(255) NOT NULL,
  `created_at` DATE NOT NULL,
  `updated_at` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_solicitud_users1_idx` (`users_id` ASC) ,
  INDEX `fk_solicitud_especializaciones1_idx` (`especializaciones_id` ASC) ,
  CONSTRAINT `fk_solicitud_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_especializaciones1`
    FOREIGN KEY (`especializaciones_id`)
    REFERENCES `combeneficios_test`.`especializaciones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `combeneficios_test`.`solicitud_estudio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `combeneficios_test`.`solicitud_estudio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `nombres` VARCHAR(255) NOT NULL,
  `apellidos` VARCHAR(255) NOT NULL,
  `documento` VARCHAR(255) NOT NULL,
  `medico_id` INT NOT NULL,
  `especializaciones_id` INT NOT NULL,
  `imgUrl` VARCHAR(255) NOT NULL,
  `universidad` VARCHAR(255) NOT NULL,
  `fecha_obtencion` DATE NOT NULL,
  `created_at` DATE NOT NULL,
  `updated_at` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  INDEX `fk_table1_medico1_idx` (`medico_id` ASC) ,
  PRIMARY KEY (`id`),
  INDEX `fk_solicitud_estudio_especializaciones1_idx` (`especializaciones_id` ASC) ,
  INDEX `fk_solicitud_estudio_users1_idx` (`users_id` ASC) ,
  CONSTRAINT `fk_table1_medico1`
    FOREIGN KEY (`medico_id`)
    REFERENCES `combeneficios_test`.`medico` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_estudio_especializaciones1`
    FOREIGN KEY (`especializaciones_id`)
    REFERENCES `combeneficios_test`.`especializaciones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_estudio_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `combeneficios_test`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
