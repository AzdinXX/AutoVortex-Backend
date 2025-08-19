-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 19 أغسطس 2025 الساعة 15:44
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autovortex_bd`
--

-- --------------------------------------------------------

--
-- بنية الجدول `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `price_per_day` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `cars`
--

INSERT INTO `cars` (`id`, `brand`, `model`, `year`, `price_per_day`, `image`, `description`, `available`, `created_at`) VALUES
(5, 'Toyota', 'supra', 2024, 50.00, '1753977070566-721510275.jfif', 'A reliable and fuel-efficient sedan, perfect for daily commutes or long trips.', 0, '2025-07-22 22:00:00'),
(7, 'dasia', 'Supra', 2002, 12.00, '1753788036695-120544064.jfif', 'dasia', 0, '2025-07-27 23:00:00'),
(9, 'Toyota 6', 'Supra 6', 2025, 40.00, '1753788070783-650177836.jfif', 'cool car', 0, '2025-07-27 23:00:00'),
(11, 'Toyota', 'Supra 6', 2023, 40.00, '1753977101477-451459046.jfif', '', 0, '2025-07-30 23:00:00');

-- --------------------------------------------------------

--
-- بنية الجدول `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `comment`, `rating`, `created_at`) VALUES
(4, 10, 'That A Cooooool Page And Cooool Cars', 2, '2025-07-25 15:19:37'),
(5, 10, 'cool', 5, '2025-07-25 15:34:48'),
(6, 33, 'gooood', 5, '2025-07-28 15:15:16'),
(7, 10, 'ccccccccccccl', 5, '2025-07-28 15:47:26'),
(8, 9, 'gooood', 4, '2025-07-28 16:15:17'),
(10, 10, 'good web', 3, '2025-07-31 15:52:17');

-- --------------------------------------------------------

--
-- بنية الجدول `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) NOT NULL,
  `valid_until` date NOT NULL,
  `car_type` varchar(50) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `rating` decimal(3,2) DEFAULT 0.00,
  `review_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `offers`
--

INSERT INTO `offers` (`id`, `title`, `description`, `discount_percentage`, `original_price`, `discounted_price`, `valid_until`, `car_type`, `image_url`, `features`, `rating`, `review_count`, `created_at`) VALUES
(1, 'Weekend Special', 'Get 25% off on all luxury cars for weekend rentals', 25.00, 150.00, 112.50, '2024-12-31', 'Luxury', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', '[\"Free Insurance\",\"24/7 Support\",\"Flexible Pickup\"]', 4.80, 124, '2025-07-29 15:42:44'),
(2, 'Student Discount', 'Special rates for students with valid ID', 30.00, 80.00, 56.00, '2024-11-30', 'Economy', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop', '[\"Student ID Required\",\"Unlimited Mileage\",\"Roadside Assistance\"]', 4.60, 89, '2025-07-29 15:42:44'),
(4, 'new carr', 'toyota', -0.02, 1000.00, 1.00, '2025-07-12', 'Sports', '1753804319207-622374295.jfif', '[\"cool car \"]', 2.01, 12, '2025-07-29 15:51:59'),
(6, 'new carr', 'toyota', -0.02, 1.00, 1.00, '2025-07-12', 'Van', '1753805596757-436281681.jfif', '[\"cool car \"]', 0.00, 0, '2025-07-29 16:13:16'),
(7, 'Weekend Special', 'Get 25% off on all luxury cars for weekend rentals', 25.00, 150.00, 112.50, '2024-12-31', 'Luxury', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', '[\"Free Insurance\",\"24/7 Support\",\"Flexible Pickup\"]', 4.80, 124, '2025-07-31 11:09:01'),
(8, 'Long Term Rental', 'Save big on rentals longer than 7 days', 40.00, 200.00, 120.00, '2024-12-15', 'SUV', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=300&fit=crop', '[\"7+ Days\",\"Free Maintenance\",\"GPS Included\"]', 4.90, 203, '2025-07-31 11:09:01'),
(9, 'Student Discount', 'Special rates for students with valid ID', 30.00, 80.00, 56.00, '2024-11-30', 'Economy', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop', '[\"Student ID Required\",\"Unlimited Mileage\",\"Roadside Assistance\"]', 4.60, 89, '2025-07-31 11:09:01');

-- --------------------------------------------------------

--
-- بنية الجدول `offer_requests`
--

CREATE TABLE `offer_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `admin_reply` text DEFAULT NULL,
  `admin_reply_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `admin_reply` text DEFAULT NULL,
  `admin_reply_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `total_price`, `status`, `message`, `created_at`, `updated_at`, `admin_reply`, `admin_reply_date`) VALUES
(51, 10, 7, '2025-07-31', '2025-08-02', NULL, 'confirmed', 'i want the car', '2025-07-31 15:49:21', '2025-07-31 15:49:52', 'ok', '2025-07-31 15:49:52');

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('client','admin') DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `phone`, `image`) VALUES
(1, 'testuser', 'test@example.com', '$2b$10$HkquANYbnSwmDlyF65oOBu9.6H1uspG5MN8BrPzIwTnKcyP.R2zVy', 'client', '2025-07-15 16:23:47', NULL, NULL),
(3, 'azdin', 'azdin@example.com', '$2b$10$L1B.t2LgNb982S/uWbhecutJorHsvR64Q3xCoZi2bJH/42SJkwjr.', 'client', '2025-07-15 16:28:30', NULL, NULL),
(4, 'azdin', 'hamid@example.com', '$2b$10$O25IvHeT9.N0wzOm9ocNIuU9fLi9x27mpWSv2c/zHp06zRkdDj8NC', 'client', '2025-07-16 08:32:00', NULL, NULL),
(6, 'Hamid', 'hamid@gmail.com', '$2b$10$r1RiqoAD6TCslJnaxKPptOMStvbplvYobGaXwl5W5.u7lqQe/pM2i', 'client', '2025-07-16 10:06:41', NULL, NULL),
(7, 'Hamid', 'hamid5@gmail.com', '$2b$10$AGumIQ4EIIcZSvw2onvFOeUkY01GLHlIXahWhYypPtcf.Y492CSw2', 'client', '2025-07-16 10:14:57', NULL, NULL),
(9, 'Admin', 'Admin@gmail.com', '$2b$10$h3h2ymtXFhw3a2gCg0eb1uMVQacGM1CKq.BZOZApDbv.FdrKcx71K', 'admin', '2025-07-16 15:32:55', '0672550310', '1753780451946-person.webp'),
(10, 'AzdinX', 'azdinaitchatto@gmail.com', '$2b$10$TcfGBXJNUwWlK/GHjDOWFOu.MjPZt7HUD8OK9get71nRy18XTC4x.', 'client', '2025-07-16 16:00:38', '0661248830', '1753720004331-person.webp'),
(11, 'User', 'User0@gmail.com', '$2b$10$65G7TnPGT0xRc0qy4gsEu.YgUGQBW.MlWoU9LsLSv6s9AFBJT6tHC', 'client', '2025-07-22 16:36:31', NULL, NULL),
(13, 'User2', 'bzdinaitchatto@gmail.com', '$2b$10$wqxTMI0dGQpB7U5T4.cZ.u488QD.ojzFk0WuUYVypH6Ful7Cjve/G', 'client', '2025-07-23 10:03:57', '0660523686', NULL),
(14, 'User2', 'czdinaitchatto@gmail.com', '$2b$10$lNt.WcmGtTVtZx.W.9QiQOQlM7XJRFJUKJ59Y8.Q99os5o2cGlH.i', 'client', '2025-07-23 10:04:10', '0660523686', '1753265050027-person.webp'),
(15, 'CatXX', 'Cat303@gmail.com', '$2b$10$kXPN/HPkDy91pkMLG.5UUOTLcY/vwoc5X1TmuVcwrkTZ2goQQziwS', 'client', '2025-07-23 10:43:56', '06060606', '1753375688056-stellar-free-admin-dashboard.png'),
(16, 'User3', 'User3@gmail.com', '$2b$10$mD3oAxLsVRr/HjhcG8hTTOvnokgLZtwl8CqWy7fUtp4eWxVvhPmsO', 'client', '2025-07-24 14:38:13', '0601243799', '1753367893102-person.webp'),
(22, 'User4', 'User4@gmail.com', '$2b$10$GnvjpfMEecBEKwk2DO52ae2eqIq3nBRRiggWuURjwKq8TDgIs5tiu', 'client', '2025-07-24 15:40:09', '0601243795', NULL),
(30, 'User6', 'User6@gmail.com', '$2b$10$prHUAzOTsgf8nNVvlfnKae39biWhHh7qj94a0wR6UCjcjvcx17xTm', 'client', '2025-07-28 09:41:45', '0601243795', '1753695705610-person.webp'),
(33, 'User5', 'User55@gmail.com', '$2b$10$ar21JVZ67zntcQ38MBIwZOmi8KVmaZ/TN8YVQvwr9BckQNL4zdjt.', 'client', '2025-07-28 14:46:21', '0601243794', NULL),
(36, 'User5', 'User5@gmail.com', '$2b$10$.SilswuBvU/7R84rh.L5UeJ2ORFMqZjZUXGXN2CCoB.HcL/TTWDTK', 'client', '2025-07-29 10:50:10', '0601243744', NULL),
(37, 'Rachid', 'Usert7@gmail.com', '$2b$10$/xqESnTRUCfzF67YmucN0.G6nr6CELq3x.dLUlJHxX2j37RI7WdxC', 'client', '2025-07-31 15:47:42', '07235915045', '1753977331120-32612261-Portrait of a confident young smart looking man _ Premium AI-generated image.jfif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_requests`
--
ALTER TABLE `offer_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `offer_id` (`offer_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `offer_requests`
--
ALTER TABLE `offer_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- قيود الجداول `offer_requests`
--
ALTER TABLE `offer_requests`
  ADD CONSTRAINT `offer_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offer_requests_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
