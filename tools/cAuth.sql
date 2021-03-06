/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo`  (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
--  Table structure for `cUser`
-- ----------------------------
DROP TABLE IF EXISTS `cUser`;
CREATE TABLE `cUser`  (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_in` int(11) NOT NULL,
  `unionid` varchar(100) COLLATE utf8mb4_unicode_ci,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
--  Table structure for `cOrder`
-- ----------------------------
DROP TABLE IF EXISTS `cOrder`;
CREATE TABLE `cOrder` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT, 
    `out_trade_no` varchar(32) NOT NULL, 
    `open_id` varchar(50) NOT NULL, 
    `init_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `unified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `notify_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `state` int(11) ,
    `prepay_id` varchar(100), 
    `order_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`out_trade_no`) ,
    KEY `out_trade_no` (`out_trade_no`) USING BTREE,
    KEY `id` (id) USING BTREE,
    KEY `open_id` (`open_id`) USING BTREE

) 
ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `cMessage`
-- ----------------------------
DROP TABLE IF EXISTS `cMessage`;
CREATE TABLE `cMessage` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT, 
    `msg_id` int(11) NOT NULL, 
    `open_id` varchar(50) NOT NULL, 
    `req_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `rep_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `state` int(11) ,
    `rep_content` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
    `msg_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`msg_id`) ,
    KEY `msg_id` (`msg_id`) USING BTREE,
    KEY `id` (id) USING BTREE,
    KEY `open_id` (`open_id`) USING BTREE

) 
ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

