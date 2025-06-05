const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Add check authentication route
router.get("/check", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const User = require("../db/userModel");
    const models = require("../modelData/models");
    let user;

    try {
      user = await User.findById(token);
      if (!user) {
        throw new Error("User not found");
      }
    } catch (err) {
      console.log("MongoDB lỗi, lấy dữ liệu từ models.js...");
      const users = models.userListModel();
      user = users.find(u => u._id === token);
      if (!user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng" });
      }
    }

    // Return complete user information
    res.json({
      message: "Đã đăng nhập",
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        login_name: user.login_name,
        location: user.location || "",
        description: user.description || "",
        occupation: user.occupation || ""
      }
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const User = require("../db/userModel");
    const models = require("../modelData/models");
    let users;

    try {
      users = await User.find({}, "_id first_name last_name login_name");
    } catch (err) {
      console.log("MongoDB lỗi, lấy dữ liệu từ models.js...");
      users = models.userListModel().map(user => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        login_name: user.login_name
      }));
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng nào." });
    }

    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error.message);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng: " + error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ." });
    }

    const User = require("../db/userModel");
    const models = require("../modelData/models");
    let user;

    try {
      user = await User.findById(userId, "_id first_name last_name login_name location description occupation");
    } catch (err) {
      console.log("MongoDB lỗi, lấy dữ liệu từ models.js...");
      user = models.userModel(userId);
      if (user) {
        user = {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          login_name: user.login_name,
          location: user.location,
          description: user.description,
          occupation: user.occupation
        };
      }
    }

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error.message);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng: " + error.message });
  }
});

router.get("/:id/photos", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ." });
    }

    const Photo = require("../db/photoModel");
    const models = require("../modelData/models");
    let photos;

    try {
      photos = await Photo.find({ user_id: userId })
        .populate("comments.user", "_id first_name last_name")
        .select("_id user_id comments file_name date_time");
    } catch (err) {
      console.log("MongoDB lỗi, lấy dữ liệu từ models.js...");
      photos = models.photoOfUserModel(userId);
    }

    if (!photos || photos.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy ảnh nào cho người dùng này." });
    }

    res.json(photos);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ảnh:", error.message);
    res.status(500).json({ message: "Lỗi khi lấy danh sách ảnh: " + error.message });
  }
});

module.exports = router;
