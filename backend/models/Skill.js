// models/skillModel.js
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

class Skill {
  constructor(user_info_id, name, id = null) {
    this.user_info_id = user_info_id;
    this.name = name;
    this.id = id;
  }

  async save() {
    const db = await connectDB();
    if (this.id) {
      await db.collection("skills").updateOne(
        { _id: new ObjectId(this.id) },
        { $set: this.toObject() }
      );
    } else {
      const result = await db.collection("skills").insertOne(this.toObject());
      this.id = result.insertedId;
    }
  }

  toObject() {
    return {
      user_info_id: this.user_info_id,
      name: this.name
    };
  }

  static async getAll(user_info_id) {
    const db = await connectDB();
    try {
      const skills = await db.collection("skills").find({ user_info_id }).toArray();
      return skills.map(s => ({
        ...s,
        _id: s._id.toString(),
        user_info_id: String(s.user_info_id)
      }));
    } catch (e) {
      console.error("Error fetching skills:", e);
      return [];
    }
  }

  static async deleteAll(user_info_id) {
    const db = await connectDB();
    try {
      await db.collection("skills").deleteMany({ user_info_id });
    } catch (e) {
      console.error(`Error deleting skills for user ${user_info_id}:`, e);
    }
  }
}

module.exports = Skill;
