//  file này để tạo đối tượng DAO ánh xạ với table video (ko dùng câu lệnh của sequelize để tạo table video)

import { Model, DataTypes } from "sequelize";
import sequelize from "./connect.js";

class Video extends Model {

}

// DAO tương ứng với table
// tham số 1: định nghĩa lại tất cả column của table
// tham số 2: kết nối class với table
Video.init({
    // kết nối column
    video_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    videoName: {
        type: DataTypes.STRING,
        // nếu ko muốn tên trùng với tên trong table, thì dùng thuộc tính field
        field: "video_name",
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    source: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    type_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // created_at: {},
    // updated_at: {}
}, {
    sequelize: sequelize, // khai báo chuỗi kết nối csdl
    modelName: "video2", // khai báo tên model
    tableName: "video", // kết nối table
    timestamps: false, // thêm để khỏi cần khao báo created_at và updated_at
})

export default Video;