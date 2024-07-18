// yarn add jsonwebtoken:
/*
1. Mã hóa dữ liệu
2. Kiểm tra token hợp lệ
3. Giải token
*/

import jwt from "jsonwebtoken";

// refresh token: làm mới lại token khi hết hạn sử dụng (lưu ở table)
export const createRefreshToken = (data) => {
  let token = jwt.sign({ data }, process.env.SECRET_TOKEN_REFRESH, {
    algorithm: "HS256",
    expiresIn: "7d", // ko có tháng
  });
  return token;
};

export const checkRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.SECRET_TOKEN_REFRESH,
    (error, decoded) => {
      return error;
    }
  );
};

export const createToken = (data) => {
  // hàm sign có 3 tham số:
  /*
  1. payload: truyền data vào
  2. khóa bí mật: dựa vào thuật toán ở tham số 3 mà tạo ra khóa ko để ai biết
  3. header: nhận ra 1 object, là giải thuật
  VD: thuật toán HMAC SHA256 là một phương pháp mã hóa một chiều và là một trong những lựa chọn phổ biến nhất cho việc ký JWT.
  expiresIn: giá trị là số thì tính ms, còn không thì dùng chuỗi
  */
  let token = jwt.sign({ data }, process.env.SECRET_TOKEN, {
    algorithm: "HS256",
    expiresIn: "5s", // ko có tháng
  });
  return token;
};

export const checkToken = (token) => {
  // kiểm tra khóa bí mật có trùng hay ko
  return jwt.verify(token, process.env.SECRET_TOKEN, (error, decoded) => {
    /* nếu lỗi thì error trả về null, ko thì trả về obj 
    err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
      decode: khi thành công
    */
    return error;
  });
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const verifyToken = (req, res, next) => {
  let { token } = req.headers;

  let checkTokenVerify = checkToken(token);
  console.log("checkTokenVerify", checkTokenVerify);
  if (checkTokenVerify == null) {
    // check token hợp lệ
    next();
  } else {
    // token không hợp lệ
    res.status(401).send(checkTokenVerify.name);
  }
};
