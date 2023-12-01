import { responseData } from "../config/response.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

import bcrypt from "bcrypt";
import { createToken, decodeToken } from "../config/jwt.js";

let model = initModels(sequelize);

export const login = async (req, res) => {
  try {
    let { email, pass_word } = req.body;

    // check email có trong table users ko ?
    let checkUser = await model.users.findOne({
      where: {
        email: email,
      },
    });

    if (checkUser) {
      if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
        console.log(checkUser); //trả về một object, ta phải xem để truy xuất ra thuộc tính để dùng, do cấu trúc sử dụng của sequelize của hàm findOne trả về

        // tạo token
        let token = createToken({ user_id: checkUser.user_id });
        // let token = createToken({
        //   tenLop: "thinhdeptrai",
        //   HetHanString: "15/05/2024",
        //   HetHanTime: "1715558400000",
        // });

        responseData(res, "Login thành công", token, 200);
      } else {
        responseData(res, "Mật khẩu không đúng", "", 400);
      }
    } else {
      responseData(res, "Email không đúng", "", 400);
    }
  } catch (err) {
    responseData(res, "Lỗi...", err, 500);
  }
};

export const signup = async (req, res) => {
  try {
    // req.body: lấy dữ liệu từ user khi user nhập
    let { full_name, email, pass_word } = req.body;

    // check trùng email
    let check_email = await model.users.findOne({
      where: {
        email,
      },
    });

    if (check_email) {
      responseData(res, "Email đã tồn tại", "", 400);
      return;
    }

    // tạo lại biến mới để khớp với dữ liệu lưu trong bảng user
    let newData = {
      email, // dùng để login
      full_name,
      pass_word: bcrypt.hashSync(pass_word, 10),
      // 10 là số lượng vòng lặp để tạo salt => càng nhiều vòng lặp thì mã hóa càng phức tạp, quá trình mã hóa sẽ chậm
      avatar: "",
      face_app_id: "",
      role: "user",
    };

    // Create user, thêm data của user vào bảng users
    await model.users.create(newData);

    // Đăng ký thành công
    responseData(res, "Thành công tạo tài khoản", "", 201);
  } catch (err) {
    responseData(res, "Lỗi...", err, 500);
  }
};

export const loginFacebook = async (req, res) => {
  try {
    let { faceAppId, full_name } = req.body;

    // kiểm tra face app id
    let checkFacebook = await model.users.findOne({
      where: {
        face_app_id: faceAppId,
      },
    });

    if (!checkFacebook) {
      // nếu chưa tồn tại => tạo tài khoản
      let newData = {
        email: "", // dùng để login
        full_name,
        pass_word: "",
        avatar: "",
        face_app_id: faceAppId,
        role: "user",
      };

      // Create new user
      await model.users.create(newData);
    }
    responseData(res, "Login thành công", "token", 200);
  } catch (err) {
    responseData(res, "Lỗi...", err, 500);
  }
};
