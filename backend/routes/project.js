const express = require('express');
const router = express.Router();
const { storage, generateId } = require('../config/memoryStorage');
const { adminAuth } = require('../middleware/auth');

// 获取项目列表
router.get('/', (req, res) => {
  try {
    const { category, status } = req.query;
    let projects = storage.projects;
    
    if (category) {
      projects = projects.filter(p => p.category === category);
    }
    
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    
    res.json(projects);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取项目详情
router.get('/:id', (req, res) => {
  try {
    const project = storage.projects.find(p => p.id === parseInt(req.params.id));
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建项目（管理员）
router.post('/', adminAuth, (req, res) => {
  try {
    const { name, category, price, duration, image, description, status } = req.body;
    
    const project = {
      id: generateId(storage.projects),
      name,
      category,
      price,
      duration,
      image,
      description,
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.projects.push(project);
    
    res.status(201).json({
      message: '创建成功',
      project
    });
  } catch (error) {
    console.error('创建项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新项目（管理员）
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { name, category, price, duration, image, description, status } = req.body;
    const project = storage.projects.find(p => p.id === parseInt(req.params.id));
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    project.name = name || project.name;
    project.category = category || project.category;
    project.price = price || project.price;
    project.duration = duration || project.duration;
    project.image = image || project.image;
    project.description = description || project.description;
    project.status = status || project.status;
    project.updatedAt = new Date();
    
    res.json({
      message: '更新成功',
      project
    });
  } catch (error) {
    console.error('更新项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除项目（管理员）
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const projectIndex = storage.projects.findIndex(p => p.id === parseInt(req.params.id));
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    storage.projects.splice(projectIndex, 1);
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
