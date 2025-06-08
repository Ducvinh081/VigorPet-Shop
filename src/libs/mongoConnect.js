import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error("Please define the MONGO_URL environment variable in .env.local");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      // (Bạn có thể thêm các option ở đây nếu cần)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
