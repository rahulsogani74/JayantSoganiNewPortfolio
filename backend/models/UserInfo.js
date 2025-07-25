// models/userInfoModel.js
const connectDB = require("../config/db");

class UserInfo {
  constructor(name, photo, title, description) {
    this.name = name;
    this.photo = photo;
    this.title = title;
    this.description = description;
  }

  async save() {
    const db = await connectDB();
    const result = await db.collection("userInfo").insertOne({
      name: this.name,
      photo: this.photo,
      title: this.title,
      description: this.description,
    });
    this.id = result.insertedId;
  }

  static async getAll() {
    const db = await connectDB();
    return await db.collection("userInfo").find().toArray();
  }

  static async updateOne(filter, update) {
    const db = await connectDB();
    return await db.collection("userInfo").updateOne(filter, update);
  }
}

module.exports = UserInfo;
