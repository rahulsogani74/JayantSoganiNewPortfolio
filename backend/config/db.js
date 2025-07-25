// config/db.js
const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://rahulsogani:8440031383@cluster0.ye8bzqh.mongodb.net/jayantDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose connected to MongoDB");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
