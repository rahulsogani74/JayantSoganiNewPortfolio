const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ad = require("../models/Ad");

router.get("/api/ads", async (req, res) => {
  console.log("ads ");

  try {
    const ads = await Ad.find();
    console.log("ads ", ads);
    const adsSorted = ads.sort((a, b) => (b.order || 0) - (a.order || 0));
    res.status(200).json(
      adsSorted.map((ad) => ({
        ...ad.toObject(),
        _id: ad._id.toString(),
        image: ad.image,
      }))
    );
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({ error: "Could not fetch ads" });
  }
});

router.post("/api/ads", async (req, res) => {
  try {
    const data = req.body;
    const existingAds = await Ad.find();
    const maxOrder = Math.max(...existingAds.map((a) => a.order || 0), 0);

    const imageBuffer = Buffer.from(data.image.split(",")[1], "base64");

    const ad = await Ad.create({
      image: imageBuffer.toString("base64"),
      description: data.description,
      link: data.link,
      seen: data.seen || false,
      order: maxOrder + 1,
    });

    res.status(201).json({ _id: ad._id.toString() });
  } catch (err) {
    console.error("Error adding ad:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/ads/:adId", async (req, res) => {
  try {
    const { adId } = req.params;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(adId))
      return res.status(400).json({ error: "Invalid ad ID" });

    if (data.image) {
      const decoded = Buffer.from(data.image.split(",")[1], "base64");
      data.image = decoded.toString("base64");
    }

    await Ad.findByIdAndUpdate(adId, data);
    res.status(200).json({ message: "Ad updated successfully" });
  } catch (err) {
    console.error("Error updating ad:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/api/ads/:adId", async (req, res) => {
  try {
    const { adId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adId))
      return res.status(400).json({ error: "Invalid ad ID" });

    await Ad.findByIdAndDelete(adId);
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/ads/reorder", async (req, res) => {
  try {
    const { ads } = req.body;
    if (!ads)
      return res.status(400).json({ error: "Missing required parameters" });

    for (const ad of ads) {
      const { id, newOrder } = ad;
      if (!id || newOrder == null || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      await Ad.findByIdAndUpdate(id, { order: newOrder });
    }

    const updatedAds = await Ad.find();
    const sorted = updatedAds.sort((a, b) => (b.order || 0) - (a.order || 0));
    res.status(200).json(
      sorted.map((ad) => ({
        ...ad.toObject(),
        _id: ad._id.toString(),
        image: ad.image,
      }))
    );
  } catch (err) {
    console.error("Error reordering ads:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/ads/:adId/toggle-seen", async (req, res) => {
  try {
    const { adId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adId))
      return res.status(400).json({ error: "Invalid ad ID" });

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    const newSeen = !ad.seen;
    ad.seen = newSeen;
    await ad.save();

    res.status(200).json({ message: "Seen status updated", seen: newSeen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/ads/seen", async (req, res) => {
  try {
    const ads = await Ad.find();
    const seenAds = ads.filter((ad) => ad.seen);
    const unseenAds = ads.filter((ad) => !ad.seen);
    const sorted = [...seenAds, ...unseenAds].sort(
      (a, b) => (b.order || 0) - (a.order || 0)
    );
    res.status(200).json(
      sorted.map((ad) => ({
        ...ad.toObject(),
        _id: ad._id.toString(),
        image: ad.image,
      }))
    );
  } catch (err) {
    console.error("Error fetching seen ads:", err);
    res.status(500).json({ error: "Could not fetch seen ads" });
  }
});

module.exports = router;
