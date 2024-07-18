import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient(); // hỗ trợ cả việc bất đồng bộ khi ko dùng async await

export const resolver = {
  getVideo: async () => {
    // phải định nghĩa đúng tên, đúng kiểu dữ liệu video ở trong resolver
    let data = await prisma.video.findMany({
      include: {
        users: true,
        video_type: true,
      },
    });
    return data;
  },

  // bóc tách userId từ hàm getUserId
  getUserId: ({ userId }) => {
    let bien = {
      id: userId,
      userName: "das",
      age: 2,
      email: "das@gmail.com",
      product: {
        productId: 1,
        productName: "das",
      },
    };
    return bien;
  },
  // getUser: () => {
  //   let bien = {
  //     id: 1,
  //     userName: "das",
  //     age: 2,
  //     email: "das@gmail.com",
  //     product: {
  //       productId: 1,
  //       productName: "das",
  //     },
  //   };
  //   return bien;
  // },
  createUser: () => {},
};
