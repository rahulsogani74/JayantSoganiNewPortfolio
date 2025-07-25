// models/contactModel.js
const connectDB = require("../config/db");

class Contact {
  constructor(user_info_id, type, value, id = null) {
    this.user_info_id = user_info_id;
    this.type = type;
    this.value = value;
    this.id = id;
  }

  async save() {
    const db = await connectDB();

    if (this.id) {
      await db
        .collection("contacts")
        .updateOne({ _id: new ObjectId(this.id) }, { $set: this.toDict() });
    } else {
      const result = await db.collection("contacts").insertOne(this.toDict());
      this.id = result.insertedId;
    }
  }

  toDict() {
    return {
      user_info_id: this.user_info_id,
      type: this.type,
      value: this.value,
    };
  }

  static async getAll(user_info_id) {
    const db = await connectDB();

    const contacts = await db
      .collection("contacts")
      .find({ user_info_id })
      .toArray();
    return contacts.map((c) => ({
      ...c,
      _id: c._id.toString(),
      user_info_id: c.user_info_id.toString(),
    }));
  }

  static async deleteAll(user_info_id) {
    try {
      await db.collection("contacts").deleteMany({ user_info_id });
    } catch (e) {
      console.error("Error deleting contacts:", e);
    }
  }
}

module.exports = Contact;
