/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50727
 Source Host           : localhost:3306
 Source Schema         : construct

 Target Server Type    : MySQL
 Target Server Version : 50727
 File Encoding         : 65001

 Date: 07/03/2020 12:01:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for components
-- ----------------------------
DROP TABLE IF EXISTS `components`;
CREATE TABLE `components` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nameCh` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `nameEn` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `image` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `description` varchar(510) CHARACTER SET utf8mb4 DEFAULT '',
  `defaultProps` varchar(2400) CHARACTER SET utf8mb4 DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
