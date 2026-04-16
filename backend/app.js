const express = require("express");
const cors = require("cors");
const routes = require("./routes");

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`管理员账号: admin / 123456`);
});
