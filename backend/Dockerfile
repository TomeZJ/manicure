# 1. 使用官方 Node 镜像作为基础
FROM node:18-alpine

# 2. 设置工作目录（容器内）
WORKDIR /app

# 3. 复制依赖文件，利用 Docker 缓存加速构建
COPY package*.json ./

# 4. 安装依赖（生产环境加 --only=production）
RUN npm install

# 5. 复制所有项目文件
COPY . .

# 6. 暴露端口（和 Node 里的端口一致）
EXPOSE 3000

# 7. 启动命令
CMD ["node", "app.js"]