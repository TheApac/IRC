CREATE DATABASE IF NOT EXISTS `irc` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `irc`;

DROP TABLE IF EXISTS `Message`;
DROP TABLE IF EXISTS `Connection`;
DROP TABLE IF EXISTS `Channel`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Role`;

CREATE TABLE IF NOT EXISTS `User`
(
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(30) NOT NULL,
  `Password` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`Id`)
)ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Channel`
(
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`Id`)
)ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Role`
(
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(20) NOT NULL,
  `RenamingChannel` BOOLEAN,
  `DeletingChannel` BOOLEAN,
  PRIMARY KEY (`Id`),
  UNIQUE (`Name`)
)ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Message`
(
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Content` VARCHAR(300) NOT NULL,
  `PublicationDate` DATE NOT NULL,
  `ChannelId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`ChannelId`) REFERENCES `Channel`(`Id`)
)ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Connection`
(
  `User` INT NOT NULL,
  `Role` INT NOT NULL,
  `Channel` INT NOT NULL,
  PRIMARY KEY (`User`, `Channel`),
  FOREIGN KEY (`User`) REFERENCES `User`(`Id`),
  FOREIGN KEY (`Role`) REFERENCES `Role`(`Id`),
  FOREIGN KEY (`Channel`) REFERENCES `Channel`(`Id`)
)ENGINE=MyISAM DEFAULT CHARSET=latin1;
