// models/projectModel.js
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

class Project {
  constructor(user_info_id, name, description, technologies, link, image, id = null) {
    this.user_info_id = user_info_id;
    this.name = name;
    this.description = description;
    this.technologies = technologies;
    this.link = link;
    this.image = image;
    this.id = id;
  }

  async save() {
    const db = await connectDB();
    if (this.id) {
      await db.collection("projects").updateOne(
        { _id: new ObjectId(this.id) },
        { $set: this.toObject() }
      );
    } else {
      const result = await db.collection("projects").insertOne(this.toObject());
      this.id = result.insertedId;
    }
  }

  toObject() {
    return {
      user_info_id: this.user_info_id,
      name: this.name,
      description: this.description,
      technologies: this.technologies,
      link: this.link,
      image: this.image
    };
  }

  static async getAll(user_info_id) {
    const db = await connectDB();
    const projects = await db.collection("projects").find({ user_info_id }).toArray();
    return projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      user_info_id: String(p.user_info_id)
    }));
  }

  static async deleteAll(user_info_id) {
    const db = await connectDB();
    try {
      await db.collection("projects").deleteMany({ user_info_id });
    } catch (e) {
      console.error(`Error deleting projects for user ${user_info_id}:`, e);
    }
  }
}

module.exports = Project;
