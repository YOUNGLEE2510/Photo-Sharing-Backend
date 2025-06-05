const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const models = require("../modelData/models");
const router = express.Router();

router.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("❌ ID người dùng không hợp lệ.");
    }

    const photos = await Photo.find({ "comments.user": userId })
      .select("_id file_name comments")
      .populate("comments.user", "_id first_name last_name");

    const comments = [];
    photos.forEach((photo) => {
      photo.comments.forEach((comment) => {
        if (comment.user && comment.user._id.toString() === userId) {
          comments.push({
            photo_id: photo._id,
            photo_thumbnail: photo.file_name,
            comment: comment.comment,
            date_time: comment.date_time,
            user: {
              _id: comment.user._id,
              first_name: comment.user.first_name,
              last_name: comment.user.last_name,
            },
          });
        }
      });
    });

    if (comments.length === 0) {
      console.log(
        "Không tìm thấy bình luận trong MongoDB, lấy từ models.js..."
      );
      const modelPhotos = models.photoOfUserModel();
      modelPhotos.forEach((photo) => {
        photo.comments.forEach((comment) => {
          if (comment.user && comment.user._id.toString() === userId) {
            comments.push({
              photo_id: photo._id,
              photo_thumbnail: photo.file_name,
              comment: comment.comment,
              date_time: comment.date_time,
              user: {
                _id: comment.user._id,
                first_name: comment.user.first_name,
                last_name: comment.user.last_name,
              },
            });
          }
        });
      });
    }

    res.json(comments);
  } catch (error) {
    console.log("MongoDB lỗi, lấy dữ liệu từ models.js...");
    const modelPhotos = models.photoOfUserModel();
    const comments = [];
    modelPhotos.forEach((photo) => {
      photo.comments.forEach((comment) => {
        if (
          comment.user &&
          comment.user._id.toString() === req.params.user_id
        ) {
          comments.push({
            photo_id: photo._id,
            photo_thumbnail: photo.file_name,
            comment: comment.comment,
            date_time: comment.date_time,
            user: {
              _id: comment.user._id,
              first_name: comment.user.first_name,
              last_name: comment.user.last_name,
            },
          });
        }
      });
    });
    res.json(comments);
  }
});

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  try {
    const photoId = req.params.photo_id;
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      return res.status(400).send("❌ ID ảnh không hợp lệ.");
    }

    const { comment } = req.body;
    if (!comment || comment.trim() === "") {
      return res.status(400).send("❌ Bình luận không được để trống.");
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).send("❌ Không tìm thấy ảnh.");
    }

    const newComment = {
      comment,
      user: req.session.userId,
      date_time: new Date().toISOString(),
    };

    photo.comments.push(newComment);
    await photo.save();

    const updatedPhoto = await Photo.findById(photoId)
      .populate("comments.user", "_id first_name last_name")
      .exec();

    const addedComment =
      updatedPhoto.comments[updatedPhoto.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    console.error(
      "Lỗi khi thêm bình luận cho ảnh ID",
      req.params.photo_id,
      ":",
      error.message
    );
    res.status(500).send("❌ Lỗi khi thêm bình luận: " + error.message);
  }
});

module.exports = router;
