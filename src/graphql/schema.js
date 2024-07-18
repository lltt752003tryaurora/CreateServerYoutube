import { buildSchema } from "graphql";
//middleware, truyền endpoint để hiển thị truy vấn với graphql

// thêm model, tên hàm vào schemaGraphql
// product sẽ mang kiểu dữ liệu là đối tượng chứa {productId, productName}
export const schemaGraphql = buildSchema(`
  type User {
    user_id: ID 
    full_name: String 
    email: String 
    avatar: String
    pass_word: String
    face_app_id: String
    role: String
    refresh_token: String
  }

  type VideoType {
    type_id: ID
    type_name: String
    icon: String
  }

  type Video {
    video_id:      Int          
    video_name:   String      
    thumbnail:     String       
    description:   String     
    views:         Int
    source:        String       
    user_id:       Int
    type_id:       Int 
    users:          User
    video_type:     VideoType
  }

  type Product {
    productId: ID
    productName: String
  }

  type RootQuery {
    getUser: User
    getUserId(userId:Int,email:String,hoTen:String): User
    getVideo: [Video]
  }

  type RootMutation {
    createUser: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`);
