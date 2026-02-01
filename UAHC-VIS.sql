-- This is your OFFICIAL DATABASE FILE. Do NOT delete!
-- UAHC-VIS Database

CREATE TABLE `admin` (
  `id` int(11) NOT NULL COMMENT 'Primary key',
  `username` varchar(255) NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL DEFAULT '0',
  `device_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `emergency` (
  `id` int(11) NOT NULL,
  `emergency_id` varchar(50) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `owner` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `birthday` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `civil_status` varchar(255) NOT NULL,
  `profile_pic` varchar(255) NOT NULL,
  `license_id` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `b_country` varchar(255) DEFAULT NULL,
  `b_region` varchar(255) DEFAULT NULL,
  `b_province` varchar(255) DEFAULT NULL,
  `b_municipality` varchar(255) DEFAULT NULL,
  `b_barangay` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `report_id` varchar(255) NOT NULL,
  `vehicle_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `violation` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `reporter_contact` varchar(255) DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `vehicle_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `gate_pass` varchar(255) NOT NULL,
  `license_number` varchar(50) NOT NULL DEFAULT '',
  `expiry` varchar(50) NOT NULL DEFAULT '',
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `plate_number` varchar(255) NOT NULL,
  `franchise_no` varchar(50) DEFAULT NULL,
  `association` varchar(255) DEFAULT NULL,
  `expiration_date` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vehicle_log` (
  `id` int(11) NOT NULL,
  `log_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `vehicle_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time_in` varchar(255) NOT NULL,
  `time_out` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `emergency`
  ADD PRIMARY KEY (`id`) USING BTREE;

ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `vehicle_log`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=4;

ALTER TABLE `emergency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `owner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `vehicle_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;