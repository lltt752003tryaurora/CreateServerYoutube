import express from "express";
import {
  getAllUser,
  getInforUser,
  updateInforUser,
  uploadAvatar,
} from "../controllers/userController.js";
import upload from "../config/upload.js";

const userRoutes = express.Router();

userRoutes.get("/get-all-user", getAllUser);

// API update info user
userRoutes.put("/update-info", updateInforUser);

// API get info user
userRoutes.get("/get-info", getInforUser);

// Việc upload sẽ diễn ra ở middleware FE gửi lên và BE nhận được, ở giữa biến domain và controller, ta sẽ thêm middleware với key, key này FE phải tuân thủ theo -> upload.single("avatar")
// upload.single("avatar") xử lý storage
userRoutes.post("/upload-avatar", upload.single("avatar"), uploadAvatar);
export default userRoutes;
