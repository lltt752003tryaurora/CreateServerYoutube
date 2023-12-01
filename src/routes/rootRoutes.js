// loại bỏ cách gọi app.user nhiều lần và xử lí endpoint nếu bị trùng ở các file controllers

import express from "express";
import videoRoutes from "./videoRoutes.js";
import authRoutes from "./authRoutes.js";

const rootRoute = express.Router();

rootRoute.use("/video", videoRoutes);
rootRoute.use("/auth", authRoutes);

export default rootRoute;
