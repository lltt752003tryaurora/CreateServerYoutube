// biến toàn cục quản lý tất cả hệ thống máy
// lưu trữ các giá trị ít khi thay đổi và bảo mật => nên thường ở trong .gitignore

// yarn add dotenv: giúp ta thêm biến môi trường của ta vào đối tượng process.env (biến môi trường hệ thống)

import dotenv from "dotenv";
dotenv.config();

export default {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  pass: process.env.DB_PASS,
  user: process.env.DB_USER,
  dialect: process.env.DB_DIALECT,
};

// console.log(process.env); // biến môi trường của hệ thống

// muốn tạo ra biến môi trường do chính mình quản lý thì => .env
