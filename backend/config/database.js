const { Sequelize } = require("sequelize");
require("dotenv").config();

// 使用MySQL数据库
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
