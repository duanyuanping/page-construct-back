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

 Date: 07/03/2020 12:01:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for props
-- ----------------------------
DROP TABLE IF EXISTS `props`;
CREATE TABLE `props` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `componentId` int(11) DEFAULT NULL COMMENT '该属性属于某个组件的一级属性',
  `child` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `propId` int(11) DEFAULT NULL COMMENT '该属性属于某个属性的一级属性',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
