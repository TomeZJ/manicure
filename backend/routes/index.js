const express = require('express');
const router = express.Router();

// 导入路由模块
const userRoutes = require('./user');
const adminRoutes = require('./admin');
const projectRoutes = require('./project');
const technicianRoutes = require('./technician');
const storeRoutes = require('./store');
const appointmentRoutes = require('./appointment');

// 注册路由
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/project', projectRoutes);
router.use('/technician', technicianRoutes);
router.use('/store', storeRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router;
