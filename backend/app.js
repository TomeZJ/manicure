const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { storage } = require("./config/memoryStorage");

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api", routes);

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log("内存数据初始化完成");
  console.log(`管理员账号: admin / 123456`);
  console.log(`门店数量: ${storage.stores.length}`);
  console.log(`技师数量: ${storage.technicians.length}`);
  console.log(`项目数量: ${storage.projects.length}`);
  console.log(`时间段数量: ${storage.timeSlots.length}`);
});
