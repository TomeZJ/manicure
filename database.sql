-- 数据库表结构设计
-- 美甲预约系统

-- 创建数据库
CREATE DATABASE IF NOT EXISTS manicure_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE manicure_system;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(11) NOT NULL UNIQUE,
    name VARCHAR(50) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 美甲项目表
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL COMMENT '服务时长（分钟）',
    cover_image VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 技师表
CREATE TABLE IF NOT EXISTS technicians (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    specialties TEXT DEFAULT NULL,
    status ENUM('working', 'rest') DEFAULT 'working',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 门店表
CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    opening_hours VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 可预约时间段表
CREATE TABLE IF NOT EXISTS time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL DEFAULT 5,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    technician_id INT DEFAULT NULL,
    project_ids VARCHAR(255) NOT NULL COMMENT '项目ID，逗号分隔',
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL COMMENT '预约时间段',
    customer_name VARCHAR(50) NOT NULL,
    customer_phone VARCHAR(11) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL
);

-- 初始化数据
-- 管理员账号：admin，密码：123456
INSERT INTO admins (username, password, name) VALUES ('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '管理员');

-- 初始化门店
INSERT INTO stores (name, address, phone, opening_hours) VALUES 
('美甲旗舰店', '北京市朝阳区建国路88号', '13800138001', '10:00-20:00'),
('美甲中心店', '上海市静安区南京西路1268号', '13800138002', '10:00-20:00');

-- 初始化可预约时间段
INSERT INTO time_slots (store_id, start_time, end_time, max_capacity) VALUES
(1, '10:00:00', '11:00:00', 5),
(1, '11:00:00', '12:00:00', 5),
(1, '12:00:00', '13:00:00', 5),
(1, '13:00:00', '14:00:00', 5),
(1, '14:00:00', '15:00:00', 5),
(1, '15:00:00', '16:00:00', 5),
(1, '16:00:00', '17:00:00', 5),
(1, '17:00:00', '18:00:00', 5),
(1, '18:00:00', '19:00:00', 5),
(1, '19:00:00', '20:00:00', 5),
(2, '10:00:00', '11:00:00', 5),
(2, '11:00:00', '12:00:00', 5),
(2, '12:00:00', '13:00:00', 5),
(2, '13:00:00', '14:00:00', 5),
(2, '14:00:00', '15:00:00', 5),
(2, '15:00:00', '16:00:00', 5),
(2, '16:00:00', '17:00:00', 5),
(2, '17:00:00', '18:00:00', 5),
(2, '18:00:00', '19:00:00', 5),
(2, '19:00:00', '20:00:00', 5);

-- 初始化技师
INSERT INTO technicians (name, avatar, specialties, status) VALUES
('小丽', 'https://via.placeholder.com/100', '纯色、款式', 'working'),
('小红', 'https://via.placeholder.com/100', '延长、护理', 'working'),
('小美', 'https://via.placeholder.com/100', '款式、延长', 'working');

-- 初始化美甲项目
INSERT INTO projects (name, category, price, duration, cover_image, description, status) VALUES
('纯色美甲', '纯色', 88.00, 30, 'https://via.placeholder.com/300x300', '基础纯色美甲，多种颜色可选', 'active'),
('款式美甲', '款式', 168.00, 60, 'https://via.placeholder.com/300x300', '时尚款式美甲，包含简单图案', 'active'),
('延长美甲', '延长', 268.00, 90, 'https://via.placeholder.com/300x300', '甲片延长，打造修长指甲', 'active'),
('手部护理', '护理', 98.00, 45, 'https://via.placeholder.com/300x300', '深层滋养手部肌肤', 'active'),
('足部护理', '护理', 128.00, 60, 'https://via.placeholder.com/300x300', '足部去角质，滋润护理', 'active');
