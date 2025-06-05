const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const models = require("../modelData/models");
const router = express.Router();

// API 1: GET /photo/user/:id - lấy ảnh theo user id
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("❌ ID người dùng không hợp lệ.");
    }

    const photos = await Photo.find({ user_id: userId })
      .populate("comments.user", "_id first_name last_name")
      .select("_id user_id comments file_name date_time");

    if (!photos.length) {
      console.log("Không có ảnh trong MongoDB, lấy từ models.js...");
      const modelPhotos = models.photoOfUserModel(userId);
      if (!modelPhotos.length) return res.status(404).send("❌ Không tìm thấy ảnh nào cho người dùng này.");
      return res.json(modelPhotos);
    }

    res.json(photos);
  } catch (error) {
    const modelPhotos = models.photoOfUserModel(req.params.id);
    if (!modelPhotos.length) return res.status(404).send("❌ Không tìm thấy ảnh nào cho người dùng này.");
    res.json(modelPhotos);
  }
});

// API 2: POST /photo/user/:id - thêm ảnh mới cho user (không cần nữa vì đã có /photos/new)
// router.post("/user/:id", async (req, res) => { ... });

module.exports = router;