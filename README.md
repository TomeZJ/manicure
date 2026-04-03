# 美甲预约系统

一套完整的美甲预约管理系统，包含用户端H5和商家PC管理端，前后端分离架构。

## 技术栈

- **前端**：
  - 用户端 H5：Vue3 + Vite + Tailwind CSS
  - 商家 PC 端：Vue3 + Vite + Ant Design Vue
  - 前端工程化：monorepo，pnpm workspace

- **后端**：
  - 框架：Node.js + Express
  - 数据库：MySQL
  - 接口：RESTful API
  - 身份验证：JWT

## 功能特性

### 用户端 H5
- 手机号登录（无需密码）
- 首页展示热门项目
- 项目列表与详情
- 完整预约流程（选择项目、门店、技师、时间）
- 我的预约管理
- 个人中心

### 商家 PC 管理端
- 管理员登录
- 控制台数据统计
- 预约管理（查看、修改状态、删除）
- 项目管理（增删改查）
- 技师管理（增删改查）
- 门店管理（增删改查）
- 时间设置（管理可预约时间段）

## 快速开始

### 1. 环境准备

- Node.js 16+
- MySQL 5.7+
- pnpm 8+

### 2. 数据库设置

1. 执行数据库建表语句：

```bash
mysql -u root -p < database.sql
```

2. 数据库初始化完成后，会自动创建以下表：
   - users（用户表）
   - admins（管理员表）
   - projects（美甲项目表）
   - technicians（技师表）
   - stores（门店表）
   - time_slots（可预约时间段表）
   - appointments（预约表）

3. 初始化数据包含：
   - 管理员账号：admin / 123456
   - 2个门店
   - 3个技师
   - 5个美甲项目
   - 每个门店10个时间段

### 3. 后端服务

1. 进入后端目录：

```bash
cd backend
```

2. 安装依赖：

```bash
pnpm install
```

3. 配置环境变量（.env文件）：

```
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=manicure_system

# JWT配置
JWT_SECRET=manicure_secret_key_2024
JWT_EXPIRES_IN=7d
```

4. 启动后端服务：

```bash
# 开发模式
pnpm dev

# 生产模式
pnpm start
```

后端服务默认运行在 http://localhost:3001

### 4. 前端服务

1. 进入前端目录：

```bash
cd frontend
```

2. 安装依赖：

```bash
pnpm install
```

3. 启动用户端 H5：

```bash
pnpm dev:user
```

用户端 H5 默认运行在 http://localhost:3000

4. 启动商家 PC 管理端：

```bash
pnpm dev:admin
```

商家 PC 管理端 默认运行在 http://localhost:3002

## 测试账号

### 管理员账号
- 用户名：admin
- 密码：123456

### 用户账号
- 手机号：任意11位手机号（无需密码，直接登录）

## 项目结构

```
├── backend/            # 后端服务
│   ├── config/         # 配置文件
│   ├── middleware/     # 中间件
│   ├── models/         # 数据库模型
│   ├── routes/         # API路由
│   ├── app.js          # 应用入口
│   ├── package.json    # 依赖配置
│   └── .env            # 环境变量
├── frontend/           # 前端应用
│   ├── packages/       # 子应用
│   │   ├── user-app/   # 用户端 H5
│   │   └── admin-app/  # 商家 PC 管理端
│   └── package.json    # 依赖配置
├── database.sql        # 数据库建表语句
└── README.md           # 项目说明
```

## API 接口

### 用户相关
- POST /api/user/login - 用户登录
- GET /api/user/profile - 获取用户信息
- PUT /api/user/profile - 更新用户信息

### 管理员相关
- POST /api/admin/login - 管理员登录
- GET /api/admin/profile - 获取管理员信息

### 项目相关
- GET /api/project - 获取项目列表
- GET /api/project/:id - 获取项目详情
- POST /api/project - 创建项目
- PUT /api/project/:id - 更新项目
- DELETE /api/project/:id - 删除项目

### 技师相关
- GET /api/technician - 获取技师列表
- GET /api/technician/:id - 获取技师详情
- POST /api/technician - 创建技师
- PUT /api/technician/:id - 更新技师
- DELETE /api/technician/:id - 删除技师

### 门店相关
- GET /api/store - 获取门店列表
- GET /api/store/:id - 获取门店详情
- POST /api/store - 创建门店
- PUT /api/store/:id - 更新门店
- DELETE /api/store/:id - 删除门店
- POST /api/store/:id/time-slots - 添加时间段
- PUT /api/store/:id/time-slots/:slotId - 更新时间段
- DELETE /api/store/:id/time-slots/:slotId - 删除时间段

### 预约相关
- POST /api/appointment - 创建预约
- GET /api/appointment/user - 获取用户预约列表
- PUT /api/appointment/:id/cancel - 取消预约
- GET /api/appointment/admin - 获取所有预约列表
- PUT /api/appointment/:id/status - 更新预约状态
- GET /api/appointment/:id - 获取预约详情
- DELETE /api/appointment/:id - 删除预约
- GET /api/appointment/available-slots/:storeId - 获取可预约时间段

## 注意事项

1. 确保 MySQL 服务正在运行
2. 确保后端服务先于前端服务启动
3. 前端服务通过代理访问后端 API，配置在 vite.config.js 中
4. 首次使用时，建议先登录商家管理端，检查并完善项目、技师、门店等信息

## 部署建议

### 生产环境
1. 后端使用 PM2 管理进程
2. 前端构建后部署到静态文件服务器
3. 配置 Nginx 反向代理
4. 数据库使用生产环境配置

### 安全建议
1. 更改 JWT_SECRET 为随机字符串
2. 数据库密码使用环境变量，不硬编码
3. 生产环境关闭开发模式
4. 配置 HTTPS
