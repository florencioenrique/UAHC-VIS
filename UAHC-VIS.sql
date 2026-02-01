-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 31, 2026 at 04:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uahc-vis`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL COMMENT 'Primary key',
  `username` varchar(255) NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL DEFAULT '0',
  `device_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `device_id`) VALUES
(1, 'admin', 'admin', NULL),
(3, 'admin', '12345', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `emergency`
--

CREATE TABLE `emergency` (
  `id` int(11) NOT NULL,
  `emergency_id` varchar(50) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency`
--

INSERT INTO `emergency` (`id`, `emergency_id`, `user_id`, `name`, `phone`) VALUES
(7, 'EMRCK0LN', 'USR2AA5U2', 'Renz Gozo', '09366709531'),
(15, 'EMRZIHES', 'USRI1RPRU', 'Rosita Tamayo Enrique', '09078556862');

-- --------------------------------------------------------

--
-- Table structure for table `owner`
--

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

--
-- Dumping data for table `owner`
--

INSERT INTO `owner` (`id`, `user_id`, `last_name`, `first_name`, `middle_name`, `phone`, `birthday`, `gender`, `civil_status`, `profile_pic`, `license_id`, `status`, `region`, `province`, `municipality`, `barangay`, `b_country`, `b_region`, `b_province`, `b_municipality`, `b_barangay`) VALUES
(7, 'USR2AA5U2', 'Gozo', 'Renz', 'Miñeza', '9366709531', '2003-02-05', 'Male', 'Single', 'USR2AA5U2_IMG_4006.jpeg', 'USR2AA5U2_IMG_3619.jpeg', 'active', 'Western Visayas', 'Antique', 'San Jose', 'Maybato Sur', 'Philippines', 'Western Visayas', 'Antique', 'San Jose', 'Maybato Sur'),
(15, 'USRI1RPRU', 'Enrique', 'Florencio', 'Tamayo', '0907855686', '2001-02-11', 'Male', 'Single', 'USRI1RPRU_1677711337391.jpg', 'USRI1RPRU_image_0.jpg', 'active', 'Western Visayas', 'Antique', 'Hamtic', 'Poblacion 5', 'Philippines', 'Western Visayas', 'Antique', 'Hamtic', 'Poblacion 5');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

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

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `report_id`, `vehicle_id`, `user_id`, `violation`, `image`, `status`, `date`, `reporter_contact`, `reporter_name`) VALUES
(1, 'b60b1fbf-b2ae-481a-a72c-597fb2996f60', 'VHCVOGKNAR6T', 'USRKN9ANO', 'Sec', '8de15a19-9183-4e88-935c-3966519044bf.jpg', 'APPROVED', '2026-01-25', '', ''),
(2, '646941d0-ed07-4662-8d7e-6ed09d3c585b', 'VHCGUYBP1BZC', 'USRTJJ6PX', 'Illegal Parking', 'e7ada7f5-5831-47da-961a-065be2672532.jfif,eb9a3a01-5e70-47ba-bf27-2d9128f86bf4.jfif,7b4f168f-4fb8-452f-af24-9daec15dab97.jfif', 'PENDING', '2026-01-25', '', ''),
(3, '209b3bd9-3d3a-480c-be03-eaa8211ff0c3', 'VHC61QPPEZ2P', 'USREVBHU8', 'Illegal parking', '93f50c27-791a-4120-9255-d09fe340011c.jpg', 'PENDING', '2026-01-26', '', ''),
(4, '603c409c-9275-4e62-be20-201ab6c92698', 'VHCVOGKNAR6T', 'USRKN9ANO', 'Illegal parking', 'a7a420ab-bf70-4478-bb2a-30cbae24a3e0.jpg', 'APPROVED', '2026-01-28', '', ''),
(5, 'd2bd0b39-81a4-4794-8ca8-1c4195c9b6b1', 'VHCVOGKNAR6T', 'USRKN9ANO', 'Illegal Parking', '7164359a-4b84-46b5-b847-4cccc2320aa2.png', 'PENDING', '2026-01-28', 'florencioenrique@gmail.com', 'Florencio Enrique Jr'),
(6, '478eb8ef-f9b2-4862-9a87-be14054214ec', 'VHCA8FOCHB12', 'USR2AA5U2', 'illegal parking', 'e59d28ea-1a9b-4621-a7fa-f30887dacf8d.png,f0586ce2-906b-469d-9e83-7e141ec2724a.png,44c6f39c-23c5-4beb-908e-1018ca7159a7.png,747e6e06-9650-4325-a549-6383ec8c169c.png', 'PENDING', '2026-01-28', 'renzgozo24@gmail.com', 'Renz Goo'),
(7, '95d98e76-534e-4de0-b014-9b105754fd9a', 'VHCVOGKNAR6T', 'USRKN9ANO', 'Illegal Parking', 'c98fd357-a434-405d-9718-e75cdd13eff7.jpg,607d39ad-edaa-4b19-a82c-2dc7ff515160.jpg', 'PENDING', '2026-01-28', 'florencioenrique@gmail.com', 'Florencio Enrique Jr'),
(8, 'b0a1f95e-d612-4500-99e9-1ab80d04bc1b', 'VHCVOGKNAR6T', 'USRKN9ANO', 'Sample Report 2026', '20410f10-a3fd-4b62-8c7a-40442879bc80.jpg', 'PENDING', '2026-01-28', 'florencioenrique@gmail.com', 'Florencio Enrique Jr'),
(9, '21cb0c0e-0580-4e0a-87e2-6f5d44c82d27', 'VHCA8FOCHB12', 'USR2AA5U2', 'Illegal parking', 'e8151018-e3c5-42ab-b8b0-10c3cce43cbb.jpg,d23c87b7-4843-401d-acb4-906a79a07814.jpeg', 'PENDING', '2026-01-31', 'florencioenrique69@gmail.com', 'Florencio Enrique Jr'),
(10, '852e51ca-4f4e-4456-a0e6-2a29a60ce2a9', 'VHCIX7G46YQS', 'USRDE18M6', 'Illegal parking', '29c4b0c2-e7ea-4d56-ab84-f821a4499c88.png', 'PENDING', '2026-01-31', 'enriqueflorencio@sac.edu.ph', 'Florencio Enrique Jr');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

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

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`id`, `vehicle_id`, `user_id`, `gate_pass`, `license_number`, `expiry`, `license_type`, `vehicle_type`, `color`, `brand`, `plate_number`, `franchise_no`, `association`, `expiration_date`, `status`) VALUES
(7, 'VHCA8FOCHB12', 'USR2AA5U2', 'GP025', '123445', '', 'Non-Professional', 'motorcycle', 'Black', 'Suzuki', '0987', NULL, '', '2026-02-01', 'Active'),
(15, 'VHCNU1ZW0VPY', 'USRI1RPRU', 'GP052', 'LN01-001', '', 'Professional', 'SUV', 'Black', 'Honda', 'PN000-001', 'FN01-002', 'University Of Antique', '2027-01-31', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_log`
--

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

--
-- Dumping data for table `vehicle_log`
--

INSERT INTO `vehicle_log` (`id`, `log_id`, `user_id`, `vehicle_id`, `date`, `time_in`, `time_out`, `status`) VALUES
(1, 'LOG20260125-0921-0001', 'USRNBQMYX', 'VHCP9929GXA6', '2026-01-25', '09:21 AM', '09:22 AM', 'Exited'),
(3, 'LOG20260125-1354-0003', 'USRTJJ6PX', 'VHCGUYBP1BZC', '2026-01-25', '01:54 PM', '01:56 PM', 'Exited'),
(4, 'LOG20260125-2020-0003', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-25', '08:20 PM', '08:21 PM', 'Exited'),
(5, 'LOG20260125-2022-0004', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-25', '08:22 PM', '08:22 PM', 'Exited'),
(6, 'LOG20260125-2026-0005', 'USRTJJ6PX', 'VHCGUYBP1BZC', '2026-01-25', '08:26 PM', NULL, 'Entered'),
(7, 'LOG20260126-1412-0006', 'USREVBHU8', 'VHC61QPPEZ2P', '2026-01-26', '02:12 PM', NULL, 'Entered'),
(8, 'LOG20260126-1920-0007', 'USRKN9ANO', 'VHCVOGKNAR6T', '2026-01-26', '07:20 PM', NULL, 'Entered'),
(9, 'LOG20260126-1920-0008', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-26', '07:20 PM', NULL, 'Entered'),
(10, 'LOG20260128-1213-0009', 'USRKN9ANO', 'VHCVOGKNAR6T', '2026-01-28', '12:13 PM', '12:14 PM', 'Exited'),
(11, 'LOG20260128-1213-0010', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-28', '12:13 PM', '12:14 PM', 'Exited'),
(12, 'LOG20260128-1214-0011', 'USRKN9ANO', 'VHCVOGKNAR6T', '2026-01-28', '12:14 PM', '12:16 PM', 'Exited'),
(13, 'LOG20260131-1132-0012', 'USRKN9ANO', 'VHCVOGKNAR6T', '2026-01-31', '11:32 AM', '11:32 AM', 'Exited'),
(14, 'LOG20260131-1132-0013', 'USRKN9ANO', 'VHCVOGKNAR6T', '2026-01-31', '11:32 AM', NULL, 'Entered'),
(16, 'LOG20260131-2206-0015', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-31', '10:06 PM', '10:07 PM', 'Exited'),
(17, 'LOG20260131-2207-0016', 'USRI1RPRU', 'VHCNU1ZW0VPY', '2026-01-31', '10:07 PM', '10:22 PM', 'Exited'),
(18, 'LOG20260131-2208-0017', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-31', '10:08 PM', '10:09 PM', 'Exited'),
(19, 'LOG20260131-2209-0018', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-31', '10:09 PM', '10:12 PM', 'Exited'),
(20, 'LOG20260131-2222-0018', 'USRI1RPRU', 'VHCNU1ZW0VPY', '2026-01-31', '10:22 PM', '10:23 PM', 'Exited'),
(21, 'LOG20260131-2223-0019', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-31', '10:23 PM', '10:23 PM', 'Exited'),
(22, 'LOG20260131-2248-0020', 'USR2AA5U2', 'VHCA8FOCHB12', '2026-01-31', '10:48 PM', NULL, 'Entered');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emergency`
--
ALTER TABLE `emergency`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicle_log`
--
ALTER TABLE `vehicle_log`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `emergency`
--
ALTER TABLE `emergency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `owner`
--
ALTER TABLE `owner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `vehicle_log`
--
ALTER TABLE `vehicle_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
