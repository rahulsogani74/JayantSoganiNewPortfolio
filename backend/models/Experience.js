// models/experienceModel.js
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

class Experience {
  constructor(
    user_info_id,
    year,
    description,
    position,
    company,
    title = null,
    id = null
  ) {
    this.user_info_id = user_info_id;
    this.year = year;
    this.description = description;
    this.position = position;
    this.company = company;
    this.title = title;
    this.id = id;
  }

  async save() {
    const db = await connectDB();
    try {
      if (this.id) {
        await db
          .collection("experiences")
          .updateOne({ _id: new ObjectId(this.id) }, { $set: this.toObject() });
      } else {
        const result = await db
          .collection("experiences")
          .insertOne(this.toObject());
        this.id = result.insertedId;
      }
    } catch (e) {
      console.error("Error saving experience:", e);
    }
  }

  toObject() {
    return {
      user_info_id: this.user_info_id,
      year: this.year,
      position: this.position,
      company: this.company,
      description: this.description,
      title: this.title,
    };
  }

  static async getAll(user_info_id) {
    const db = await connectDB();
    try {
      const experiences = await db
        .collection("experiences")
        .find({ user_info_id })
        .toArray();
      return experiences.map((exp) => ({
        ...exp,
        _id: exp._id.toString(),
        user_info_id: String(exp.user_info_id),
      }));
    } catch (e) {
      console.error("Error fetching experiences:", e);
      return [];
    }
  }

  static async deleteAll(user_info_id) {
    const db = await connectDB();
    try {
      await db.collection("experiences").deleteMany({ user_info_id });
    } catch (e) {
      console.error("Error deleting experiences:", e);
    }
  }
}

module.exports = Experience;
