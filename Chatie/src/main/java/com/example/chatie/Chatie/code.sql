-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chatie
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user1_id` bigint NOT NULL,
  `user2_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_message_id` bigint DEFAULT NULL,
  `last_message_at` datetime DEFAULT NULL,
  `last_message_preview` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user1_last_read_at` datetime(6) DEFAULT NULL,
  `user2_last_read_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_chat_user_pair` (`user1_id`,`user2_id`),
  KEY `idx_chat_user1` (`user1_id`),
  KEY `idx_chat_user2` (`user2_id`),
  KEY `idx_chat_last_message_at` (`last_message_at`),
  KEY `fk_chat_last_message` (`last_message_id`),
  CONSTRAINT `fk_chat_last_message` FOREIGN KEY (`last_message_id`) REFERENCES `message` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_chat_user1` FOREIGN KEY (`user1_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_chat_user2` FOREIGN KEY (`user2_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,6,7,'2025-08-26 13:21:26','2025-12-07 09:14:34',42,'2025-12-07 09:14:34','grhtjykul',NULL,NULL),(2,6,8,'2025-08-26 13:31:36','2025-08-26 13:31:36',NULL,NULL,NULL,NULL,NULL),(4,5,16,'2025-11-20 10:30:40','2025-11-20 10:30:51',37,'2025-11-20 10:30:51','Hi',NULL,NULL),(5,5,6,'2025-12-05 14:21:37','2025-12-05 14:21:37',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_pinned_message`
--

DROP TABLE IF EXISTS `chat_pinned_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_pinned_message` (
  `pinned_at` datetime(6) NOT NULL,
  `chat_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `pinned_by` bigint NOT NULL,
  PRIMARY KEY (`chat_id`,`message_id`),
  KEY `FKmxw6o8oue50m1lu2u28oe9srm` (`message_id`),
  KEY `FKtlh7nd4ocd3lp2g9rdakatjl7` (`pinned_by`),
  CONSTRAINT `FK3yfl6ec0jho9gb9ay1irop5o3` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`),
  CONSTRAINT `FKmxw6o8oue50m1lu2u28oe9srm` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`),
  CONSTRAINT `FKtlh7nd4ocd3lp2g9rdakatjl7` FOREIGN KEY (`pinned_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_pinned_message`
--

LOCK TABLES `chat_pinned_message` WRITE;
/*!40000 ALTER TABLE `chat_pinned_message` DISABLE KEYS */;
INSERT INTO `chat_pinned_message` VALUES ('2025-12-05 16:41:18.378897',1,29,6);
/*!40000 ALTER TABLE `chat_pinned_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `owner_id` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_user_id` bigint NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contact_owner_email` (`owner_id`,`email`),
  UNIQUE KEY `UKkpa2e5lyo46t3b03lq3xgw18` (`owner_id`,`email`),
  KEY `fk_contact_user` (`contact_user_id`),
  KEY `ix_contact_owner` (`owner_id`),
  KEY `ix_contact_email` (`email`),
  CONSTRAINT `fk_contact_owner` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_contact_user` FOREIGN KEY (`contact_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,6,'sasha@example.com',5,'New Contact',NULL,'2025-08-24 11:20:52','2025-08-24 11:20:52'),(2,6,'alex@example.com',7,'Friend',NULL,'2025-08-24 11:40:29','2025-08-24 11:40:29'),(3,6,'bella@example.com',8,'Colleague',NULL,'2025-08-24 11:40:54','2025-08-24 11:40:54');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chat_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `reply_to_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_msg_chat_id` (`chat_id`),
  KEY `idx_msg_chat_id_id` (`chat_id`,`id`),
  KEY `idx_msg_sender_id` (`sender_id`),
  KEY `idx_msg_reply_to` (`reply_to_id`),
  CONSTRAINT `fk_msg_chat` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_reply` FOREIGN KEY (`reply_to_id`) REFERENCES `message` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,1,6,'TEXT','Some message',NULL,'2025-08-27 11:44:47',NULL,'2025-08-27 13:32:39'),(2,1,6,'IMAGE','',NULL,'2025-08-27 11:45:37',NULL,NULL),(3,1,6,'FILE','Document',NULL,'2025-08-27 11:48:18',NULL,NULL),(4,1,6,'IMAGE','lion',NULL,'2025-08-27 12:18:37',NULL,NULL),(5,1,6,'TEXT','Text message',NULL,'2025-08-27 12:28:13',NULL,NULL),(6,1,6,'IMAGE','Photo message with lion',NULL,'2025-08-27 12:28:36',NULL,NULL),(7,1,6,'FILE','Some file',NULL,'2025-08-27 12:29:30',NULL,NULL),(8,1,6,'VIDEO','',NULL,'2025-08-27 12:30:22',NULL,NULL),(9,1,6,'IMAGE','Some mosaic',NULL,'2025-08-27 12:41:38',NULL,NULL),(10,1,6,'TEXT','Some reply',7,'2025-08-27 13:14:43',NULL,NULL),(11,1,6,'TEXT','Hi',NULL,'2025-08-28 11:10:07',NULL,NULL),(12,1,6,'TEXT','test socket backend',NULL,'2025-08-28 13:13:23',NULL,NULL),(13,1,6,'TEXT','test',NULL,'2025-08-28 14:11:22',NULL,NULL),(14,1,6,'TEXT','test socket fullstack',NULL,'2025-08-28 14:12:28',NULL,NULL),(15,1,6,'TEXT','test 2.0',NULL,'2025-08-28 14:33:21',NULL,NULL),(16,1,6,'TEXT','test 2.0',NULL,'2025-08-28 14:33:44',NULL,NULL),(17,1,6,'TEXT','teseeest',NULL,'2025-08-28 14:37:31',NULL,NULL),(18,1,6,'TEXT','pleeease, work',NULL,'2025-08-28 15:18:48',NULL,'2025-08-28 15:20:02'),(19,1,6,'TEXT','new messages',NULL,'2025-08-28 15:35:03',NULL,NULL),(20,1,6,'TEXT','please work i beg you',NULL,'2025-08-28 15:42:36',NULL,'2025-08-28 15:42:50'),(21,1,6,'TEXT','messg',NULL,'2025-08-28 15:49:52',NULL,'2025-08-28 15:52:03'),(22,1,6,'TEXT','Message',NULL,'2025-08-28 15:52:10',NULL,NULL),(23,1,6,'IMAGE','',NULL,'2025-08-28 15:52:26',NULL,NULL),(24,1,6,'IMAGE','messagew',NULL,'2025-08-28 15:52:50',NULL,NULL),(25,1,6,'IMAGE','Few messages',NULL,'2025-08-28 15:53:07',NULL,NULL),(26,1,7,'TEXT','Helo there',NULL,'2025-08-30 12:42:21',NULL,NULL),(27,1,6,'TEXT','cześć',NULL,'2025-09-25 07:21:55',NULL,NULL),(28,1,6,'IMAGE','',NULL,'2025-09-25 07:22:09',NULL,NULL),(29,1,6,'IMAGE','photos',NULL,'2025-09-25 07:22:31',NULL,NULL),(30,1,6,'TEXT','cześć',NULL,'2025-09-25 07:22:46',NULL,NULL),(31,1,6,'IMAGE','',NULL,'2025-09-25 07:27:57',NULL,NULL),(32,1,6,'IMAGE','',NULL,'2025-09-25 07:28:14',NULL,NULL),(33,1,6,'IMAGE','',NULL,'2025-09-25 07:28:20',NULL,NULL),(34,1,6,'TEXT','Cześć',NULL,'2025-09-25 11:00:59',NULL,NULL),(35,1,6,'IMAGE','',NULL,'2025-09-25 11:01:31',NULL,NULL),(36,1,7,'TEXT','cześć',30,'2025-09-25 11:02:56',NULL,NULL),(37,4,16,'TEXT','Hi',NULL,'2025-11-20 10:30:51',NULL,NULL),(38,1,6,'TEXT','siemanko',NULL,'2025-12-05 10:11:07','2025-12-05 14:51:24',NULL),(39,1,6,'TEXT','lol',29,'2025-12-05 14:22:52',NULL,NULL),(40,1,6,'TEXT','lol',29,'2025-12-05 14:23:58',NULL,NULL),(41,1,6,'TEXT','hee',NULL,'2025-12-05 14:35:41',NULL,NULL),(42,1,6,'TEXT','grhtjykul',NULL,'2025-12-07 09:14:34',NULL,NULL);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_attachment`
--

DROP TABLE IF EXISTS `message_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_attachment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `duration_sec` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `mime` varchar(255) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `position` int NOT NULL,
  `size_bytes` bigint DEFAULT NULL,
  `url` text NOT NULL,
  `width` int DEFAULT NULL,
  `message_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjy2qr5ok9lfr6m7nss2fywqjn` (`message_id`),
  CONSTRAINT `FKjy2qr5ok9lfr6m7nss2fywqjn` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_attachment`
--

LOCK TABLES `message_attachment` WRITE;
/*!40000 ALTER TABLE `message_attachment` DISABLE KEYS */;
INSERT INTO `message_attachment` VALUES (1,NULL,NULL,'image/jpeg','lion.jpg',0,33864,'https://example.com/uploads/1756295136612-0-lion.jpg',NULL,2),(2,NULL,NULL,'application/pdf','Oleksandr Lutsiuk - Fullstack Junior Developer Resume.pdf',0,41175,'https://example.com/uploads/1756295298334-0-Oleksandr%20Lutsiuk%20-%20Fullstack%20Junior%20Developer%20Resume.pdf',NULL,3),(3,NULL,NULL,'image/jpeg','lion.jpg',0,33864,'https://example.com/uploads/1756297116546-0-lion.jpg',NULL,4),(4,NULL,628,'image/jpeg','lion.jpg',0,33864,'https://res.cloudinary.com/diil2xjow/image/upload/v1756297718/chats/1/uploads/6/file_kqpclm.jpg',1200,6),(5,NULL,841,'application/pdf','Wyk_07_MySQL+PHP 3Tabele (1).pdf',0,226235,'https://res.cloudinary.com/diil2xjow/image/upload/v1756297772/chats/1/uploads/6/file_qzqi5c.pdf',595,7),(6,56,1080,'video/mp4','Cuisine and Type User Side.mp4',0,3682018,'https://res.cloudinary.com/diil2xjow/video/upload/v1756297823/chats/1/uploads/6/file_uyboe2.mp4',1920,8),(7,NULL,450,'image/png','technologies_cta_mockup.png',0,18547,'https://res.cloudinary.com/diil2xjow/image/upload/v1756298494/chats/1/uploads/6/file_zkhpof.png',1600,9),(8,NULL,1000,'image/png','projects_case_overview.png',1,192634,'https://res.cloudinary.com/diil2xjow/image/upload/v1756298496/chats/1/uploads/6/file_gatbxj.png',1800,9),(9,NULL,2900,'image/png','portfolio_full_mock_v2.png',2,415313,'https://res.cloudinary.com/diil2xjow/image/upload/v1756298497/chats/1/uploads/6/file_hzgaj0.png',1440,9),(10,NULL,2000,'image/png','lutsiu_case.png',3,189466,'https://res.cloudinary.com/diil2xjow/image/upload/v1756298499/chats/1/uploads/6/file_srb51j.png',1200,9),(11,NULL,132,'image/png','logo png.png',0,27028,'https://res.cloudinary.com/diil2xjow/image/upload/v1756396348/chats/1/uploads/6/file_esrqtb.png',346,23),(12,NULL,2800,'image/png','about_page_mock.png',0,367936,'https://res.cloudinary.com/diil2xjow/image/upload/v1756396372/chats/1/uploads/6/file_lshlkw.png',1500,24),(13,NULL,2600,'image/png','case_study_enhanced_mock.png',0,386476,'https://res.cloudinary.com/diil2xjow/image/upload/v1756396388/chats/1/uploads/6/file_essnnb.png',1500,25),(14,NULL,2800,'image/png','about_page_mock.png',1,367936,'https://res.cloudinary.com/diil2xjow/image/upload/v1756396389/chats/1/uploads/6/file_dddgiz.png',1500,25),(15,NULL,1986,'image/png','chatie-backend-architecture.png',0,562243,'https://res.cloudinary.com/diil2xjow/image/upload/v1758784929/chats/1/uploads/6/file_pmyr6x.png',3179,28),(16,NULL,257,'image/png','backend_architecture.png',1,86705,'https://res.cloudinary.com/diil2xjow/image/upload/v1758784931/chats/1/uploads/6/file_cleyrc.png',1827,28),(17,NULL,900,'image/png','backend-warstwy-clean.png',0,74724,'https://res.cloudinary.com/diil2xjow/image/upload/v1758784950/chats/1/uploads/6/file_r8rkgl.png',1400,29),(18,NULL,1986,'image/png','chatie-backend-architecture.png',1,562243,'https://res.cloudinary.com/diil2xjow/image/upload/v1758784951/chats/1/uploads/6/file_nhdndf.png',3179,29),(19,NULL,621,'image/png','backend_architecture_academic.png',2,64931,'https://res.cloudinary.com/diil2xjow/image/upload/v1758784953/chats/1/uploads/6/file_u2jb9x.png',733,29),(20,NULL,900,'image/png','backend-warstwy-clean.png',0,74724,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785279/chats/1/uploads/6/file_kft3mv.png',1400,31),(21,NULL,820,'image/png','backend-warstwy-pl-clean.png',0,55091,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785289/chats/1/uploads/6/file_nvhtcy.png',1200,32),(22,NULL,900,'image/png','backend-warstwy-clean.png',1,74724,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785290/chats/1/uploads/6/file_nnegrc.png',1400,32),(23,NULL,1986,'image/png','chatie-backend-architecture.png',2,562243,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785292/chats/1/uploads/6/file_qymda4.png',3179,32),(24,NULL,621,'image/png','backend_architecture_academic.png',3,64931,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785293/chats/1/uploads/6/file_gse6vg.png',733,32),(25,NULL,257,'image/png','backend_architecture.png',4,86705,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785295/chats/1/uploads/6/file_emvekx.png',1827,32),(26,NULL,820,'image/png','backend-warstwy-pl-clean.png',0,55091,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785296/chats/1/uploads/6/file_ohmuct.png',1200,33),(27,NULL,900,'image/png','backend-warstwy-clean.png',1,74724,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785298/chats/1/uploads/6/file_i2ws3v.png',1400,33),(28,NULL,1986,'image/png','chatie-backend-architecture.png',2,562243,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785299/chats/1/uploads/6/file_xtorxb.png',3179,33),(29,NULL,621,'image/png','backend_architecture_academic.png',3,64931,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785301/chats/1/uploads/6/file_hglbca.png',733,33),(30,NULL,257,'image/png','backend_architecture.png',4,86705,'https://res.cloudinary.com/diil2xjow/image/upload/v1758785302/chats/1/uploads/6/file_pfszed.png',1827,33),(31,NULL,2000,'image/png','lutsiu_case.png',0,189466,'https://res.cloudinary.com/diil2xjow/image/upload/v1758798091/chats/1/uploads/6/file_eckazq.png',1200,35),(32,NULL,2000,'image/png','intercode_case.png',1,199149,'https://res.cloudinary.com/diil2xjow/image/upload/v1758798092/chats/1/uploads/6/file_mkdotx.png',1200,35);
/*!40000 ALTER TABLE `message_attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_picture_url` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  `last_seen_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `about` varchar(140) DEFAULT NULL,
  `password_updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'john@example.com','johnny','John','Smith',NULL,'2025-05-29 08:45:02','2025-05-29 09:12:52','$2a$10$XAv9Dl20W.ybu/un7yW97uwawY.oXSG1TZ6ObG8U5nV2jXvCQzrVa',NULL,NULL,0,1,NULL,NULL,NULL),(2,'john1@example.com','johnny2','John','Doe',NULL,'2025-05-29 08:53:51','2025-08-21 12:35:36','$2a$10$MnPZWA.QEepkVdmuWKBWqOF.JyqoLHxskzJVMA2mNKSiqqNO7wARy',NULL,NULL,0,1,NULL,NULL,NULL),(3,'john31@example.com','johnny23','John','Doe',NULL,'2025-05-29 09:11:49','2025-08-21 12:35:36','$2a$10$eNTEqVIwrB.wmsZKp7Jt0unvPjQIeT9hvYem1P3wTlFLSRM36YtkO',NULL,NULL,0,1,NULL,NULL,NULL),(5,'sasha@example.com','sasha','Sasha','K',NULL,'2025-08-21 11:01:00','2025-08-21 11:01:00','$2a$10$0vPN0e.GaYtLD3KDpHJXduzD5GueU8M42wAKx/OpzYmnt.e.VfOje',NULL,NULL,0,0,NULL,'2025-08-21 11:01:00',NULL),(6,'sasha1@example.com','sasha1','Oleksandrergerwgerg','Lutsiuk1','https://res.cloudinary.com/diil2xjow/image/upload/v1756556933/users/6/avatar/avatar.png','2025-08-21 11:01:22','2025-12-07 08:14:20','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,'2025-12-07 08:14:20',0,1,'My bio','2025-08-21 11:01:22',NULL),(7,'alex@example.com','alex','Alex','Brown','https://res.cloudinary.com/diil2xjow/image/upload/v1756035552/users/7/avatar/avatar.jpg','2025-08-24 11:37:46','2025-09-25 09:00:48','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,'2025-09-25 09:00:48',1,1,'Coffee-powered dev.','2025-08-24 11:37:46',NULL),(8,'bella@example.com','bella','Bella','Green','https://res.cloudinary.com/diil2xjow/image/upload/v1756035602/users/8/avatar/avatar.webp','2025-08-24 11:37:46','2025-08-24 09:39:57','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,'2025-08-24 09:39:33',1,1,'Design + cats + matcha.','2025-08-24 11:37:46',NULL),(9,'carlos@example.com','carlos','Carlos','Diaz',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'Full-stack tinkerer.','2025-08-24 11:37:46',NULL),(10,'diana@example.com','diana','Diana','Stone',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'PM who ships.','2025-08-24 11:37:46',NULL),(11,'elena@example.com','elena','Elena','Kovacs',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'Rust enjoyer.','2025-08-24 11:37:46',NULL),(12,'frank@example.com','frank','Frank','Lee',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'APIs & BBQ.','2025-08-24 11:37:46',NULL),(13,'grace@example.com','grace','Grace','Wu',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'Frontend minimalist.','2025-08-24 11:37:46',NULL),(14,'henry@example.com','henry','Henry','Miller',NULL,'2025-08-24 11:37:46','2025-08-24 11:37:46','$2a$10$yqb2INLKSmvALhPK3Ul4O.gLBk7QgmCFuaVd236TT.mxmeGqIPpgK',NULL,NULL,1,1,'Testing is caring.','2025-08-24 11:37:46',NULL),(15,'email@gmail.com','email','Ol',NULL,NULL,'2025-11-17 13:20:00','2025-11-17 13:20:00','$2a$10$mNahLsvVSrPPJ30eQEoQoOdqYBIX/vD/kJUJSP3dIXDC6wun7PKsi',NULL,NULL,0,1,NULL,'2025-11-17 13:20:00',NULL),(16,'new@new.com','new','Ol',NULL,NULL,'2025-11-20 09:30:20','2025-11-20 09:30:20','$2a$10$Ushf4/3KUYRdSHLoCigfM.9K2Ykcefj24VN9UXeAh6que/Fsgwj1.',NULL,NULL,0,1,NULL,'2025-11-20 09:30:20',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-16 16:49:09
