# cài nodejs phiên bản tùy chọn
FROM node:18 

WORKDIR /usr/share/node37_BE

#  Vô package.json để cài node modules trên máy ảo trước
COPY package.json .

RUN yarn install
# sau khi cài xong thì máy ảo có package.json và node modules

# nếu dùng prisma thì cần thêm 2 lệnh này còn nếu dùng sequelize thì ko cần
# sao chép file schema trong prisma vào thư mực ./prisma
COPY prisma ./prisma
# làm mới các table trong prisma
RUN yarn prisma generate

COPY . . 

CMD ["yarn","start"]
# dùng cách khác để start CMD ["node","src/server.js"]


# docker build . -t img-node-youtube
# docker run -d -p 6969:6969 --name cons-node img-node-youtube

# Lưu ý để tránh xung đột thì xóa file nodemodules ròi cài lại sau khi chạy dockerfile này