// quản lý thực hiện chức năng
// import Video from "../models/videoTest.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import Sequelize from "sequelize";
import { responseData } from "../config/response.js";
import { decodeToken } from "../config/jwt.js";

let model = initModels(sequelize);
let Op = Sequelize.Op; // để thực hiện điều kiện where LIKE

export const getVideoPage = async (req, res) => {
  try {
    let { page } = req.params; // lấy page từ đường đẫn FE
    let pageSize = 3;
    let index = (page - 1) * pageSize; // tham số đầu của hàm limit

    let sumVideo = await model.video.count(); // tổng số video

    let totalPage = Math.ceil(sumVideo / pageSize); // tổng số video trên 1 page

    // SELECT * from video LIMIT index,pageSize
    let data = await model.video.findAll({
      offset: index,
      limit: pageSize,
    });
    responseData(res, "Thành công", { data, totalPage }, 200);
  } catch (error) {
    responseData(res, "Lỗi...", error.message, 500);
  }
};

export const getVideoByType = async (req, res) => {
  try {
    let { typeId } = req.params; // lấy id
    let data = await model.video.findAll({
      where: {
        video_id: typeId,
      },
    });
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

export const getVideo = async (req, res) => {
  // bất đồng bộ khi kết nối đến cơ sở dữ liệu (FE và BE độc lập với nhau) => sử dụng async await, then, catch để xử lý bất đồng bộ

  try {
    // c1: gọi truy vấn dữ liệu thông thường
    // connect.query("SELECT * FROM video", (error, result) => {
    //     res.status(200).send(result);
    // });

    // c2:gọi truy vấn bằng sequelize lấy hết data trong table video, tương ứng SELECT * FROM video

    // PHẢI XỬ LÍ BẤT ĐỒNG BỘ

    // let data = await Video.findAll();

    // SELECT video_id,video_name FROM video WHERE video_id = 3 and video_name like %gaming%
    // let data = await model.video.findAll({
    //     where: {
    //         video_id: 3,
    //         video_name: {
    //             [Op.like]: "%gaming%",
    //         },
    //         attribute: ["video_id", "video_name"]
    //     }
    // });
    let data = await model.video.findAll();
    // res.status(200).send(data);
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

export const getVideoType = async (req, res) => {
  try {
    let data = await model.video_type.findAll();
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi ...", error.message, 500);
  }
};

export const getVideoLike = async (req, res) => {
  const sql = "SELECT * FROM video_like";
  const video_like = await connect.promise().query(sql);
  res.send(video_like);
};

export const getVideoId = async (req, res) => {
  try {
    let { videoId } = req.params;
    // dùng findOne, findPK thay vì findAll
    let data = await model.video.findOne({
      where: {
        video_id: videoId,
      },
      // join với bảng user thông qua user_id để lấy ra tên người dùng (nhìn vào file init-models.js hoặc bảng tableplus)
      include: ["user", "type"],
      // include: [model.users,model.video_type], cách này phải xóa tên đặt ở file initModels.js (as ...)
    });

    // dùng thêm join user_id để lấy tên trong bảng khác
    let dataPk = await model.video.findByPk(videoId, {
      include: ["user", "type"],
    });
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi...", error.message, 500);
  }
};
/*
+ findOne(): Trả về đối tượng video đầu tiên tìm thấy khớp với điều kiện tìm kiếm. Ở đây chỉ cần lấy ra 1 video dựa trên video_id duy nhất.
+ findAll(): Trả về một mảng chứa tất cả các đối tượng video khớp với điều kiện tìm kiếm. Nếu dùng findAll() ở đây sẽ trả về một mảng chứa các video, nhưng thực tế chỉ cần 1 video duy nhất.
+ Video_id là duy nhất cho mỗi video, nên kết quả trả về chỉ có 1 video tương ứng. Do đó findOne() được sử dụng để lấy ra chính xác 1 đối tượng cần thiết, tránh lãng phí tài nguyên và thời gian xử lý.
+ findPK() là một method của Sequelize giúp tìm kiếm một đối tượng dựa trên khóa chính (primary key).

Nếu video_id là khóa chính của bảng video, thì có thể viết lại đoạn code như sau:

*/

export const getCommentVideoId = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video_comment.findAll({
    where: {
      video_id: videoId,
    },
    include: ["user"],
  });
  try {
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi...", error.message, 500);
  }
};

export const commentVideo = async (req, res) => {
  try {
    let { token } = req.headers;
    // giải mã token => object giống bên trang jwt.io
    let dToken = decodeToken(token);

    let { user_id } = dToken;
    let { video_id, content } = req.body;

    let newData = {
      user_id,
      video_id,
      content,
      date_create: new Date(),
      reply_list: "",
      timestamp: new Date(),
    };

    await model.video_comment.create(newData);

    responseData(res, "Thành công", { token, user_id, video_id, content }, 200);
  } catch (error) {
    responseData(res, "Lỗi...", error.message, 500);
  }
};

// like làm tương tự
