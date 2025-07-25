// models/educationModel.js
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

class Education {
  constructor(user_info_id, degree, institution, description, year, id = null) {
    this.user_info_id = user_info_id;
    this.degree = degree;
    this.institution = institution;
    this.description = description;
    this.year = year;
    this.id = id;
  }

  async save() {
    const db = await connectDB();
    const document = {
      user_info_id: this.user_info_id,
      degree: this.degree,
      institution: this.institution,
      description: this.description,
      year: this.year,
    };

    if (this.id) {
      await db.collection("education").updateOne(
        { _id: new ObjectId(this.id) },
        { $set: document }
      );
    } else {
      const result = await db.collection("education").insertOne(document);
      this.id = result.insertedId;
    }
  }

  static async getAll(user_info_id) {
    const db = await connectDB();
    const education = await db.collection("education").find({ user_info_id }).toArray();
    return education.map((edu) => ({
      ...edu,
      _id: edu._id.toString(),
      user_info_id: edu.user_info_id.toString(),
    }));
  }

  static async deleteAll(user_info_id) {
    await db.collection("education").deleteMany({ user_info_id });
  }
}

module.exports = Education;
