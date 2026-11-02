-- ==============================================================================
-- PrestoDental Platform: Live Server Database Migration & Schema Update
-- Safe for Production: Uses IF NOT EXISTS and IF NOT EXISTS syntax
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create Wallets Table
CREATE TABLE IF NOT EXISTS `wallets` (
  `wallet_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_no` varchar(100) DEFAULT NULL,
  `transaction_type` varchar(50) DEFAULT 'credit',
  `credit_amount` decimal(10,2) DEFAULT 0.00,
  `debit_amount` decimal(10,2) DEFAULT 0.00,
  `amount` decimal(10,2) DEFAULT 0.00,
  `wallet_balance` decimal(10,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`wallet_id`),
  KEY `wallets_customer_id_idx` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Cart Table
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cart_qty` int(11) NOT NULL DEFAULT 1,
  `cart_subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cart_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cart_status` varchar(20) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  KEY `cart_user_id_idx` (`user_id`),
  KEY `cart_session_id_idx` (`session_id`),
  KEY `cart_product_id_idx` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Cart Logs Table
CREATE TABLE IF NOT EXISTS `cart_logs` (
  `cart_log_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `variation_id` varchar(50) DEFAULT NULL,
  `cart_qty` varchar(20) DEFAULT NULL,
  `cart_subtotal` varchar(20) DEFAULT NULL,
  `cart_total` varchar(20) DEFAULT NULL,
  `cart_log_message` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Draft Table
CREATE TABLE IF NOT EXISTS `draft` (
  `draft_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `draft_status` varchar(20) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`draft_id`),
  KEY `draft_user_id_idx` (`user_id`),
  KEY `draft_session_id_idx` (`session_id`),
  KEY `draft_product_id_idx` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Draft Logs Table
CREATE TABLE IF NOT EXISTS `draft_logs` (
  `draft_log_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `draft_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `draft_log_message` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`draft_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create Product Rating Table
CREATE TABLE IF NOT EXISTS `product_rating` (
  `rating_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `product_rating` decimal(3,2) NOT NULL DEFAULT 5.00,
  `product_review` text DEFAULT NULL,
  `review_title` varchar(255) DEFAULT NULL,
  `review_description` text DEFAULT NULL,
  `review_image1` varchar(255) DEFAULT NULL,
  `review_image2` varchar(255) DEFAULT NULL,
  `review_image3` varchar(255) DEFAULT NULL,
  `review_image4` varchar(255) DEFAULT NULL,
  `review_video` varchar(255) DEFAULT NULL,
  `review_status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  KEY `product_rating_product_id_idx` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Create User Addresses Table
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `address_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_mobile` varchar(50) DEFAULT NULL,
  `user_address` text DEFAULT NULL,
  `user_town` varchar(255) DEFAULT NULL,
  `user_city` varchar(255) DEFAULT NULL,
  `user_state` varchar(255) DEFAULT NULL,
  `user_pincode` varchar(50) DEFAULT NULL,
  `address_type` varchar(50) DEFAULT 'Home',
  `default_address` varchar(10) DEFAULT '0',
  `address_status` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `user_addresses_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Create Point Transactions Table
CREATE TABLE IF NOT EXISTS `point_transactions` (
  `pt_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `variation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `points` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pt_id`),
  KEY `point_tx_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Create Flash Sales & Flash Sale Price Tables
CREATE TABLE IF NOT EXISTS `flash_sales` (
  `flash_sales_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `flash_price` bigint(20) UNSIGNED DEFAULT NULL,
  `flash_sale_price` decimal(10,2) DEFAULT NULL,
  `flash_start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `flash_end_date` datetime DEFAULT NULL,
  `flash_sale_status` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`flash_sales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `flash_sale_price` (
  `flash_price_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `flash_sale_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_label` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`flash_price_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Create Order Logs Table
CREATE TABLE IF NOT EXISTS `order_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) NOT NULL,
  `order_status` varchar(100) NOT NULL,
  `order_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_logs_order_id_idx` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Create Banners Table
CREATE TABLE IF NOT EXISTS `banners` (
  `banner_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` bigint(20) UNSIGNED DEFAULT NULL,
  `banner_image` varchar(255) NOT NULL DEFAULT '',
  `heading` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `banner_title` varchar(255) DEFAULT NULL,
  `banner_link` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `banner_order` int(11) DEFAULT 0,
  `banner_status` int(11) NOT NULL DEFAULT 1,
  `is_delete` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`banner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Create Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `noti_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `read_status` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`noti_id`),
  KEY `notifications_customer_id_idx` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Create Shorts Video Table
CREATE TABLE IF NOT EXISTS `shorts_video` (
  `video_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `video_title` varchar(255) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `video_thumbnail` varchar(500) DEFAULT NULL,
  `video_status` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Create Referral Tables
CREATE TABLE IF NOT EXISTS `referral_points` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `referral_points` decimal(10,2) NOT NULL DEFAULT 50.00,
  `bonus_points` decimal(10,2) NOT NULL DEFAULT 50.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `referrals` (
  `ref_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `referrer_id` bigint(20) UNSIGNED NOT NULL,
  `referred_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `points_awarded` decimal(10,2) DEFAULT 0.00,
  `bonus_awarded` decimal(10,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ref_id`),
  KEY `referrals_referrer_id_idx` (`referrer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `referral_logs` (
  `ref_log_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ref_id` bigint(20) UNSIGNED NOT NULL,
  `referrer_id` bigint(20) UNSIGNED NOT NULL,
  `referred_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `points_awarded` decimal(10,2) DEFAULT 0.00,
  `bonus_awarded` decimal(10,2) DEFAULT 0.00,
  `ref_log_message` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ref_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Create Razorpay Orders Table
CREATE TABLE IF NOT EXISTS `razorpay_orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `app_order_number` varchar(100) DEFAULT NULL,
  `razorpay_order_id` varchar(255) NOT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount_in_paise` bigint(20) NOT NULL DEFAULT 0,
  `currency` varchar(20) DEFAULT 'INR',
  `payment_method` varchar(50) DEFAULT 'online',
  `wallet_used` decimal(10,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'created',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `razorpay_orders_user_id_idx` (`user_id`),
  KEY `razorpay_orders_order_id_idx` (`razorpay_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Create Shipping Charges Table
CREATE TABLE IF NOT EXISTS `shipping_charges` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bill_from_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bill_to_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_charges` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Seed Essential Default Records
INSERT INTO `referral_points` (`id`, `referral_points`, `bonus_points`) 
VALUES (1, 50.00, 50.00) 
ON DUPLICATE KEY UPDATE `referral_points` = 50.00;

INSERT INTO `shipping_charges` (`id`, `bill_from_amt`, `bill_to_amt`, `shipping_charge`, `shipping_charges`) 
VALUES (1, 0.00, 500.00, 50.00, 50.00), (2, 500.01, 100000.00, 0.00, 0.00) 
ON DUPLICATE KEY UPDATE `shipping_charge` = VALUES(`shipping_charge`), `shipping_charges` = VALUES(`shipping_charges`);

INSERT INTO `flash_sale_price` (`flash_price_id`, `flash_sale_price`, `price_label`, `status`) 
VALUES (1, 99.00, 'Flash Sale Offer', 1) 
ON DUPLICATE KEY UPDATE `status` = 1;

SET FOREIGN_KEY_CHECKS = 1;
