const { Sequelize } = require("sequelize");
require("dotenv").config();

// 使用内存数据库
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

// 测试数据库连接
sequelize
  .authenticate()
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((err) => {
    console.error("数据库连接失败:", err);
  });

module.exports = sequelize;
