import { responseData } from "../config/response.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

import bcrypt from "bcrypt";
import { decodeToken } from "../config/jwt.js";

let model = initModels(sequelize);

export const getAllUser = async (req, res) => {
  try {
    let data = await model.users.findAll();
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

export const updateInforUser = async (req, res) => {
  try {
    let { token } = req.headers;
    let accessToken = decodeToken(token);

    // tách upload avatar riêng, chỉ lấy thông tin full_name, pass_word để cập nhật
    let { full_name, pass_word } = req.body; // ko nên lấy email (thông tin nhạy cảm xác định người dùng, ko cập nhật)

    // lấy user cần cần nhật ra
    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    // mã hóa password để giống với password cần cập nhật
    getUser.pass_word = bcrypt.hashSync(pass_word, 10);
    // gán full_name cập nhật
    getUser.full_name = full_name;

    // phải chấm đến dataValues vì sequelize findOne trả về cấu trúc như vậy
    await model.users.update(getUser.dataValues, {
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    responseData(res, "Update info success", "", 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

export const getInforUser = async (req, res) => {
  try {
    // lấy token thay vì params để tránh việc user này có thể vào sửa thông tin của user khác
    let { token } = req.headers;
    let accessToken = decodeToken(token);

    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    console.log(getUser);

    // check user có tồn tại ko
    if (!getUser) {
      responseData(res, "user ko tồn tại", "", 404);
      return;
    }
    responseData(res, "get info success", getUser, 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

// FS (file system): để phục vụ việc băng ảnh ra để lưu trữ theo đường link, có thể thao tác copy, xóa, tạo hay chuyển file (phạm vị hoạt động là trong file BE này)
import fs from "fs";
// giảm chất lượng hình ảnh
import compress_images from "compress-images";
// yarn add pngquant-bin@6.0.1
// yarn add gifsicle@5.2.1
import path from "path";

export const uploadAvatar = async (req, res) => {
  // các dạng dữ liệu tài nguyên thì sẽ truyền theo dạng form data (test postman để biết)
  let { file } = req;

  // tối ưu hình ảnh
  compress_images(
    path.join(process.cwd(), "/public/img/" + file.filename), // truy cập tới
    path.join(process.cwd(), "/public/video/"), // nơi lưu hình
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");
    }
  );

  let { email, hoTen } = req.body;

  let { token } = req.headers;
  let accessToken = decodeToken(token);

  let { user_id } = accessToken.data;

  let getUser = await model.users.findOne({
    where: {
      user_id,
    },
  });

  getUser.avatar = file.filename;
  await model.users.update(getUser.dataValues, {
    where: {
      user_id,
    },
  });
  res.send(file.filename);
  // tạo file testFile.txt: thinh dep trai
  // fs.writeFile(
  //   path.join(process.cwd(), "/public/file/testFile.txt"),
  //   "thinh dep trai", // nội dung file
  //   () => {} // cái này để trả về lỗi thôi
  // );

  // Cách băm bẳng: tốn ổ cứng, bộ nhớ, tạo ảnh và băm
  // fs.readFile(
  //   path.join(process.cwd(), "/public/img/" + file.filename),
  //   (error, data) => {
  //     // data là tấm hình up lên
  //     // băm tấm hình ra để lưu, dạng dữ liệu trả về là buffer
  //     let newName = `data:${file.mimetype};base64,${Buffer.from(data).toString(
  //       "base64"
  //     )}`;
  //     res.send(newName);
  //     return;
  //   }
  // );

  // fs.rename();
  // fs.copyFile();
  // fs.unlink(); // xóa file

  // lưu đường dẫn ${file.filename} -> ko lưu localhost:6969 do khi thay đổi thì sửa mệt
  // res.send(file);
};

// để upload nhiều file thì làm cách sau
// userRoutes.post("/upload-avatar", upload.array("avatar"), (req, res) => {
//   // các dạng dữ liệu tài nguyên thì sẽ truyền theo dạng form data (test postman để biết)
//   let { files } = req;
//   let { email, hoTen } = req.body;
//   res.send(file);
// });
