// authentication: xác thực
// authenrization: ủy quyền

import express from "express";
import { login, loginFacebook, signup } from "../controllers/authController.js";

const authRoutes = express.Router();

// login
authRoutes.post("/login", login);
// signup
authRoutes.post("/signup", signup);
// login Facebook
authRoutes.post("/login-facebook", loginFacebook);

export default authRoutes;
/* 
thư viện: yarn add bcrypt
mã hóa password để bảo mật hơn và so sánh dữ liệu thô để dữ liệu mã hóa
Lưu ý: quá trình mã hóa Bcrypt là một chiều và ko thể giải mã mật khẩu đã mã hóa
*/