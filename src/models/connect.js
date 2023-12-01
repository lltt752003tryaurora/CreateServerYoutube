// kết nối CSDL (chỗ khai bao kết nối CSDL)

import { Sequelize } from "sequelize";
import config from "../config/config.js";

// const connect = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "1234",
//     port: "3306",
//     database: "db_youtube",
// });

const sequelize = new Sequelize(config.database, config.user, config.pass, {
  host: config.host,
  port: config.port,
  dialect: config.dialect, // tên csdl đang sử dụng
});

export default sequelize;

//  test chạy sequelize thành công hay không
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (err) {
  console.error("Unable to connect to the database:", err);
}
