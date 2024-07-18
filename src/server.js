//package.json => yarn init

// framework: yarn add express (tạo node_modules)

// import framework express vào
import express from "express";
import cors from "cors";
import rootRoute from "./routes/rootRoutes.js";

// socket.io
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
// cho phép FE sử dụng API của BE, mở chặn browser
app.use(
  cors({
    origin: "*", // tất cả domain dùng được api của be
    // origin: [
    //   "www.google.com",
    //   "facebook.com",
    //   "http://localhost:3000",
    //   "http://youtube-gamma-eight.vercel.app",
    // ], // chỉ những cái cho phép ở đây mới xài được BE này, để chặn những trang khác mà ta ko muốn dùng data từ BE. Lưu ý: nếu mà dùng "https://" thì sẽ bị chặn
  })
);

// chèn middleware để custom lại body từ dạng text sang json trong postman
app.use(express.json());
// middle ware định vị thư mục load tài nguyên (hình ảnh, video, ...)
app.use(express.static("."));

// thiết lập socket.io
const httpServer = createServer(app);
// đối tượng socket server
export const io = new Server(httpServer, {
  cors: {
    // cũng mở cho FE sử dụng BE nhưng có thêm dùng tính năng realtime
    origin: "*",
  },
});

let number = 0;

// on: nhận vào key connection (mặc định), và dữ liệu
io.on("connection", (socket) => {
  console.log(socket.id);
  // emit gửi dữ liệu đi với key tự định nghĩa => vd: fe-connect
  io.emit("fe-connect", socket.id); // server gửi đi tất cả cho client
  // nhận dữ liệu từ FE trả về
  socket.on("number-from-fe", () => {
    // khi nhận được tín hiệu phản hồi từ FE thì thực hiện gửi dữ liệu tăng number lên
    io.emit("fe-number", number++); // nếu thay io thành socket thì chỉ có 1 đối tượng thao tác client hiện tại thay đổi thôi
  });
});

// graphl
import { graphqlHTTP } from "express-graphql";
import { resolver } from "./graphql/resolver.js";
import { schemaGraphql } from "./graphql/schema.js";

//localhost:6969/api
app.use(
  "/api",
  graphqlHTTP({
    rootValue: resolver, // gắn dữ liệu vào các hàm được khai báo ở schema
    schema: schemaGraphql, // nơi khai báo đối tượng (model, tên hàm)
    graphiql: true,
  })
);

//  khởi tạo server BE node chạy port 6969
// app.listen(6969);
   httpServer.listen(6969); // dùng socket.io

// khởi động server BE node => node server.js

// yarn add nodemon: giúp khi thay đổi code thì auto start lại luôn

// sau khi thêm "start": "nodemon server.js" trong  scripts ở package.json thì yarn start sẽ giúp auto cập nhật code

// tạo ra api: GET => url: localhost:8080/demoGET
// nhận vào rest params
//  có 2 tham số chính: tham số 1: tên endpoint(viết thường và cách nhau bằng dấu "-"), tham số 2: arrow function

// app.get("/demoGET", (request, response) => {
//   /*
//     từ FE gửi đến BE: request
//     Có 2 cách:
//     C1: Lấy từ URL: http://localhost:8080 (cách này chỉ khi mà tham số ít từ 2 trở xuống còn từ 3 thì dùng c2 )
//     Lưu ý: cách này truyền bằng browser được
//         - Query string: /demoGET?id=123&email=thinh@gmail.com (?: bđầu cho việc khai báo các biến, nhiều biến thì dùng &)
//         - Query parameters: /demoGET/123/thinh@gmail.com
//         (dùng dấu : để truyền dữ liệu động. VD: /demoGET/:id2/:email2)
//         app.get("/demoGET/:id2/:email2", (request, response)
//     // cách lấy
//   */
//   // query string: /demoGET
//   //let { id, email } = request.query;
//   // query params: /demoGET/:id2/:email2
//   //let { id2, email2 } = request.params;

//   /*
//     C2: Lấy từ json
//     Lưu ý: không truyền được bằng browser => sử dụng postman
//   */
//   let { idT, userName, emailT, phone, sex } = request.body;

//   // từ BE trả về FE: response
//   // response.send("Hello GET"); // BE trả dữ liệu về FE
//   //   response.send({ id, email, id2, email2 }); // BE trả dữ liệu về FE
//   response.status(231).send({ idT, userName, emailT, phone, sex }); // BE trả dữ liệu về FE
//   // Lưu ý: dữ liệu gửi: tất cả trừ number do nếu là number thì sẽ xung đột với status(hiểu nhầm)
// });

// 100-199: trong Postman thì sẽ báo lỗi vì chúng không phải là các mã trạng thái chuẩn.
/*
100 (Continue): Yêu cầu máy khách tiếp tục yêu cầu
101 (Switching Protocols): Đổi giao thức
102-199: Chưa được sử dụng

- Phương thức response.status() trong Express.js cho phép đặt mã trạng thái HTTP tùy ý từ 100 đến 599. Một số mã trạng thái HTTP thông dụng:

100-199: Thông tin
200-299: Thành công
300-399: Điều hướng
400-499: Lỗi client
500-599: Lỗi server

- Các mã phổ biến là:

200 (OK): Yêu cầu thành công
201 (Created): Tạo dữ liệu thành công
400 (Bad Request): Yêu cầu không hợp lệ
404 (Not Found): Không tìm thấy dữ liệu
500 (Internal Server Error): Lỗi máy chủ (lỗi BE)

*/

//  Đế kết nối với csdl: yarn add mysql2

// kết nối csdl - bước này đã kết nối trong file connect.js
// const connect = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "1234",
//   port: "3306",
//   database: "db_youtube",
// });

// app.use("/api", videoRoutes); //localhost:8080/api/video/get-video
app.use(rootRoute); //localhost:8080/video/get-video

/* vì sao phải có router ?
để điều hướng các endpoint theo 1 đối tượng cụ thể
video -> get-video : localhost:8080/video/get-video
user -> get-user, create-user
*/

// lỗi CORS do bảo mật của BACKEND => chặn hết tất cả domain nào kết nối vào BE này. Vậy phải cần mở chặn để cho FE dùng được => cài thư viện CORS => yarn add cors (cho phép FE gọi API từ BE)

// ORM: thư viện sequelize tránh thao tác trực tiếp với database => ko cần viết lệnh SQL dài dòng

// Quy trình đi: server => route => controller  ()

// Khi cài yarn add sequelize (ta phải cài thêm thư viện của CSDL, đó song song với sequelize: do đã cài trước đó thư viện npm install --save mysql2)

/*  Cài đặt các thư viện swagger:
yarn add swagger-ui-express swagger-jsdoc
*/
// const swaggerUi = require("swagger-ui-express"); import kiểu dạng comnmon js
// const swaggerJsDoc = require("swagger-jsdoc"); import kiểu dạng comnmon js
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    info: {
      title: "api của thịnh",
      version: "1.0.0.0.0.0.0.0.0.0",
    },
  },
  apis: ["src/swagger/index.js"], // để load api ở file index.js ở thư mục swagger -> viết theo js. Để load api thì cần phương thức và endpoint
};

const specs = swaggerJsDoc(options);

// http://localhost:6969/swaggerThinh
app.use("/swaggerThinh", swaggerUi.serve, swaggerUi.setup(specs));

// phương thức GET/HEAD ko có body request
