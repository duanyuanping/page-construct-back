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

 Date: 07/03/2020 12:01:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for pages
-- ----------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `name` varchar(255) CHARACTER SET utf8mb4 DEFAULT '',
  `url` varchar(255) CHARACTER SET utf8mb4 DEFAULT '',
  `status` int(1) NOT NULL DEFAULT '0',
  `updateTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `createTime` datetime DEFAULT NULL,
  `onlineTime` datetime DEFAULT NULL,
  `offlineTime` datetime DEFAULT NULL,
  `content` varchar(2400) CHARACTER SET utf8mb4 DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
