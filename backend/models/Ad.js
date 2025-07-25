const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

let adsCollection;

async function initAdCollection() {
  if (!adsCollection) {
    const db = await connectDB();
    adsCollection = db.collection("ads");
    console.log("ads coll ", adsCollection);
  }
  return adsCollection;
}

class Ad {
  constructor(image, description, link, seen = false, order = null) {
    this.image = Buffer.from(image).toString("base64");
    this.description = description;
    this.link = link;
    this.seen = seen;
    this.order = order;
  }

  toDict() {
    return {
      image: this.image,
      description: this.description,
      link: this.link,
      seen: this.seen,
      order: this.order,
    };
  }

  static async getAllAds() {
    const collection = await initAdCollection();
    return await collection.find().sort({ order: 1 }).toArray();
  }

  static async insertAd(adData) {
    const collection = await initAdCollection();
    try {
      const result = await collection.insertOne(adData);
      return result.insertedId;
    } catch (e) {
      console.error("Database Insert Error:", e);
      throw e;
    }
  }

  static async updateAd(adId, adData) {
    const collection = await initAdCollection();
    delete adData._id;
    await collection.updateOne({ _id: new ObjectId(adId) }, { $set: adData });
  }

  static async deleteAd(adId) {
    const collection = await initAdCollection();
    await collection.deleteOne({ _id: new ObjectId(adId) });
  }

  static async getAd(adId) {
    const collection = await initAdCollection();
    return await collection.findOne({ _id: new ObjectId(adId) });
  }

  static async updateOrder(adId, newOrder) {
    const collection = await initAdCollection();
    try {
      const currentAd = await collection.findOne({ _id: new ObjectId(adId) });
      if (!currentAd) throw new Error("Ad not found");

      const currentOrder = currentAd.order;
      if (currentOrder === newOrder) return;

      if (currentOrder < newOrder) {
        await collection.updateMany(
          { order: { $gt: currentOrder, $lte: newOrder } },
          { $inc: { order: -1 } }
        );
      } else {
        await collection.updateMany(
          { order: { $gte: newOrder, $lt: currentOrder } },
          { $inc: { order: 1 } }
        );
      }

      await collection.updateOne(
        { _id: new ObjectId(adId) },
        { $set: { order: newOrder } }
      );
    } catch (e) {
      console.error("Error updating ad order:", e);
      throw e;
    }
  }

  static async save(adData) {
    const collection = await initAdCollection();
    delete adData._id;
    await collection.insertOne(adData);
  }

  static async swapOrder(currentId, targetOrder) {
    const collection = await initAdCollection();
    try {
      const currentAd = await collection.findOne({
        _id: new ObjectId(currentId),
      });
      if (!currentAd) throw new Error("Current ad not found");

      const currentOrder = currentAd.order;
      const targetAd = await collection.findOne({ order: targetOrder });

      if (!targetAd) {
        await collection.updateOne(
          { _id: new ObjectId(currentId) },
          { $set: { order: targetOrder } }
        );
        return true;
      }

      await collection.updateOne(
        { _id: new ObjectId(currentId) },
        { $set: { order: targetOrder } }
      );
      await collection.updateOne(
        { _id: targetAd._id },
        { $set: { order: currentOrder } }
      );
      return true;
    } catch (e) {
      console.error("Error swapping ad order:", e);
      throw e;
    }
  }
}

module.exports = Ad;
