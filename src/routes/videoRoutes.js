// quản lý API đối tượng

import express from "express";
import {
  commentVideo,
  getCommentVideoId,
  getVideo,
  getVideoByType,
  getVideoId,
  getVideoLike,
  getVideoPage,
  getVideoType,
} from "../controllers/videoControllers.js";
import { checkToken, verifyToken } from "../config/jwt.js";

// userRoute thay vì app để các file khác được sử dụng API của tất cả đối tượng
const videoRoutes = express.Router();

// API lấy video pagination, check khóa bí mật bằng middleware, chặn người dùng
videoRoutes.get("/get-video-page/:page", verifyToken, getVideoPage);

// tạo phương thức để lấy dữ liệu
videoRoutes.get("/get-video", getVideo);
videoRoutes.get("/get-video-like", getVideoLike);
videoRoutes.get("/get-video-type", getVideoType);
// API lấy video theo type id
videoRoutes.get("/get-video-by-type/:typeId", getVideoByType);

// API lấy video id
videoRoutes.get("/get-video-id/:videoId", getVideoId);

// API lấy comment video
videoRoutes.get("/get-comment-video/:videoId", getCommentVideoId);

// API đưa comment video lên BE
videoRoutes.post("/comment-video", commentVideo);

export default videoRoutes;
