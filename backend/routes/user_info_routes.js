// --- user-info.routes.js ---
const express = require("express");
const userRouter = express.Router();
const { ObjectId } = require("mongodb");

const UserInfo = require("../models/UserInfo");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const SocialLink = require("../models/SocialLink");
const Contact = require("../models/Contact");

userRouter.get("/api/basic-info", async (req, res) => {
  try {
    const infoUsers = await UserInfo.find();
    if (!infoUsers.length)
      return res.status(404).json({ error: "No user info found" });
    const user = infoUsers[0];
    res.status(200).json({
      _id: user._id.toString(),
      name: user.name || "",
      photo: user.photo || "",
      title: user.title || "",
      description: user.description || "",
    });
  } catch (err) {
    console.error("Error in /api/basic-info:", err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.post("/api/basic-info", async (req, res) => {
  try {
    const data = req.body;
    const users = await UserInfo.find();
    if (users.length) {
      const existing = users[0];
      await UserInfo.updateOne({ _id: existing._id }, data);
      res.status(200).json({
        message: "Basic info updated successfully",
        id: existing._id.toString(),
      });
    } else {
      const newUser = await UserInfo.create(data);
      res.status(201).json({
        message: "Basic info saved successfully",
        id: newUser.insertedId,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/api/user-info", async (req, res) => {
  try {
    const infoUsers = await UserInfo.find();
    console.log("calling infoUsers api", infoUsers);
    if (!infoUsers.length)
      return res.status(404).json({ error: "No user info found" });
    const user = infoUsers[0];
    const userId = user._id.toString();

    const [education, experience, projects, skills, social_links, contacts] =
      await Promise.all([
        Education.find({ userId }),
        Experience.find({ userId }),
        Project.find({ userId }),
        Skill.find({ userId }),
        SocialLink.find({ userId }),
        Contact.find({ userId }),
      ]);

    res.status(200).json({
      user_info: {
        _id: userId,
        name: user.name || "",
        photo: user.photo || "",
        title: user.title || "",
        description: user.description || "",
      },
      education,
      experience,
      projects,
      skills,
      social_links: social_links,
      contacts,
    });
  } catch (err) {
    console.error("Error in /api/user-info:", err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.post("/api/user-info", async (req, res) => {
  try {
    const data = req.body;
    const userData = data.user_info || {};
    const infoUsers = await UserInfo.find();
    let userId;

    if (infoUsers.length) {
      const existing = infoUsers[0];
      await UserInfo.updateOne({ _id: existing._id }, { $set: userData });
      userId = existing._id.toString();
    } else {
      const newUser = await UserInfo.create(userData);
      userId = newUser.insertedId.toString();
    }

    await Education.replaceAll(userId, data.education || []);
    await Experience.replaceAll(userId, data.experience || []);
    await Project.replaceAll(userId, data.projects || []);
    await Skill.replaceAll(userId, data.skills || []);
    await SocialLink.replaceAll(userId, data.social_links || []);
    await Contact.replaceAll(userId, data.contacts || []);

    res
      .status(201)
      .json({ message: "User information saved successfully", id: userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = userRouter;
