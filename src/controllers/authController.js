import { responseData } from "../config/response.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

import bcrypt from "bcrypt";
import {
  checkRefreshToken,
  checkToken,
  createRefreshToken,
  createToken,
  decodeToken,
} from "../config/jwt.js";

let model = initModels(sequelize);

export const login = async (req, res) => {
  try {
    let { email, pass_word } = req.body;
    console.log({email, pass_word});

    // check email có trong table users ko ?
    let checkUser = await model.users.findOne({
      where: {
        email: email,
      },
    });
    if (checkUser) {
      if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
        console.log(checkUser); //trả về một object, ta phải xem để truy xuất ra thuộc tính để dùng, do cấu trúc sử dụng của sequelize của hàm findOne trả về

        // Trường key sẽ giúp chúng ta ngăn chặn cho những ai ăn cắp được token, kẻ cắp sẽ dùng được token ban đầu cho đến khi nó hết hạn => refresh token xuất hiện => check token ăn cắp có key giống key của refresh token ko => nếu ko thì p login lại
        let key = new Date().getTime(); // trả về dữ liệu liệu milisecond chạy từ ngày 1/1/1970 cho đến nay

        // tạo token
        let token = createToken({ user_id: checkUser.user_id, key });

        // KHỞI TẠO refesh_token
        let refToken = createRefreshToken({
          user_id: checkUser.user_id,
          key,
        });

        // lưu refresh token vào table user
        // cách hiểu: lúc đăng nhập vào thì table user cập nhật thông tin tài khoản và mật khẩu rồi cập nhật refresh token
        // hàm update chứa 2 tham số, tham số đầu là thông tin muốn cập nhật của user đó vào table (nếu có thì thêm, ko có thì null). Tham số thứ 2: nơi chính xác để cập nhật thông tin của tham số 1

        // thêm trường dữ liệu refresh_token cho checkUser bằng spread operator
        // let newcheckUser = { ...checkUser.dataValues, refresh_token: refToken };
        await model.users.update(
          { ...checkUser.dataValues, refresh_token: refToken },
          {
            where: { user_id: checkUser.user_id },
          }
        );

        responseData(res, "Login thành công", token, 200);
      } else {
        responseData(res, "Mật khẩu không đúng", "", 400);
        return;
      }
    } else {
      responseData(res, "Email không đúng", "", 400);
      return;
    }
  } catch (err) {
    console.log(err);
    responseData(res, "Lỗi...", err.message, 500);
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

// refresh token
export const tokenRefresh = async (req, res) => {
  try {
    // B1: lấy token cũ đã hết hạn lại để lấy user_id
    // cấu trúc token:  {data: {user_id}}
    let { token } = req.headers;

    // B2: tăng tính bảo mật, thì ngăn cho ai cũng gọi api refresh token thì check token gửi xuống có hợp lệ ko
    let checkTokenVerify = checkToken(token);
    console.log("checkTokenVerify", checkTokenVerify);
    if (
      checkTokenVerify != null &&
      checkTokenVerify.name != "TokenExpiredError"
    ) {
      // token không hợp lệ
      res.status(401).send(checkTokenVerify.name);
      return;
    }

    // giải mã token
    let accessToken = decodeToken(token);

    // B3: lấy thông tin user trong table user đang hết hạn token
    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    // B4: check refresh token,kiểm tra refresh token còn hạn hay ko
    let checkRef = checkRefreshToken(getUser.refresh_token);
    if (checkRef != null) {
      // token không hợp lệ
      res.status(401).send("token refresh expried" + checkRef.name);
      return;
    }

    // B5: check token và refresh token có hợp lệ không (để tránh kẻ cắp lợi dụng khi cướp được token trong thời gian thực, sau một thời gian token đó hết hạn thì kẻ cắp ko dùng được nữa)
    let refreshToken = decodeToken(getUser.refresh_token);
    // check nếu khác key của refresh token khác với token
    if (accessToken.data.key != refreshToken.data.key) {
      res.status(401).send("token hết hạn, đừng cố cướp nữa");
      return;
    }

    // B6: tạo mới access token
    let newToken = createToken({
      user_id: getUser.user_id,
      key: refreshToken.data.key,
    });

    responseData(res, "Successfully refresh token", newToken, 200);
  } catch (err) {
    responseData(res, "Failed to refresh token", "tokenRefresh", 500);
  }
};

export const logout = async (req, res) => {
  try {
    // lấy token để biết được user nào
    let { token } = req.headers;

    // giải mã
    let accessToken = decodeToken(token);

    // từ token đang logout lấy user đó ra
    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    // update lại bảng user sao khi xóa refreshtoken (cho về rỗng)
    await model.users.update(
      { ...getUser.dataValues, refreshToken: "" },
      {
        where: {
          user_id: getUser.user_id,
        },
      }
    );

    responseData(res, "Successfully logout", newToken, 200);
  } catch (err) {
    responseData(res, "Failed logout", err.message, 500);
  }
};
