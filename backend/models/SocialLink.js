// models/socialLinkModel.js
const connectDB = require("../config/db");

class SocialLink {
  constructor(user_info_id, platform, url, id = null) {
    this.user_info_id = user_info_id;
    this.platform = platform;
    this.url = url;
    this.id = id;
  }

  async save() {
    const db = await connectDB();
    const result = await db.collection("social_links").updateOne(
      { user_info_id: this.user_info_id, platform: this.platform },
      { $set: { url: this.url } },
      { upsert: true }
    );
    if (result.upsertedId) {
      this.id = result.upsertedId;
    } else {
      const existing = await db.collection("social_links").findOne({
        user_info_id: this.user_info_id,
        platform: this.platform
      });
      this.id = existing?._id;
    }
  }

  toObject() {
    return {
      user_info_id: this.user_info_id,
      platform: this.platform,
      url: this.url
    };
  }

  static async getAll(user_info_id) {
    const db = await connectDB();
    const links = await db.collection("social_links").find({ user_info_id }).toArray();
    return links.map(link => ({
      ...link,
      _id: link._id.toString(),
      user_info_id: String(link.user_info_id)
    }));
  }

  static async deleteAll(user_info_id) {
    const db = await connectDB();
    await db.collection("social_links").deleteMany({ user_info_id });
  }
}

module.exports = SocialLink;
