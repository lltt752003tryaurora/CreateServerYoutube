// API upload avatar, dùng thư viện yarn add multer

import multer from "multer";
import path from "path";
// FS (file system): để phục vụ việc băng ảnh ra để lưu trữ theo đường link, có thể thao tác copy, xóa, tạo hay chuyển file (phạm vị hoạt động là trong file BE này)
import fs from "fs";

// process.cwd(); // trả về đường dẫn góc của source, giúp khi ta thay đổi vị trí cấu trúc file thì đường dẫn sẽ thay đổi tương ứng

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let destinationPath = path.join(process.cwd(), "./public/img"); // nơi định nghĩa nơi lưu hình, path.join để đảm bảo đường dẫn đúng trên mọi hệ điều hành
    callback(null, destinationPath); // null để truyền lỗi vào ở đây
  },
  filename: (req, file, callback) => {
    // fieldname là tên tấm hình, mimetype là tên đuôi mở rộng
    try {
      let newName =
        new Date().getTime() + "_" + file.originalname.replace(/\s/g, "_"); // `date`_meo1.jpg, thay thế tên nếu có khoảng trắng thành dấu "_"
      // tham số thứ 2 là tên mặc định tấm hình được upload
      // callback(null, "abc.jpg");
      callback(null, newName);
    } catch (e) {
      callback(e.message);
    }
  }, // đổi tên hình theo ngày, tránh việc trùng các hình ảnh gửi lên
});

let upload = multer({ storage: storage });

// let upload = multer({ dest: path.join(process.cwd(), "./public/img") }); // cách khác để lưu file ảnh nhưng không có đuôi mở rộng (tự thêm đuôi mở rộng)

// Việc upload sẽ diễn ra ở middleware FE gửi lên và BE nhận được, ở giữa biến domain và controller, ta sẽ thêm middleware với key, key này FE phải tuân thủ theo -> upload.single("avatar")
// upload.single("avatar") xử lý storage

export default upload;
