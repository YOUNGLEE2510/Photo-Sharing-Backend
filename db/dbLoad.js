const mongoose = require("mongoose");

const models = require("../modelData/models.js"); // Chứa dữ liệu mẫu
const User = require("../db/userModel.js");
const Photo = require("../db/photoModel.js");
const SchemaInfo = require("../db/schemaInfo.js");

const versionString = "1.0";

async function dbLoad() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is undefined! Please set it in Environment Variables.");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Photo.deleteMany({});
    await SchemaInfo.deleteMany({});
    console.log("Cleared existing data in MongoDB.");

    const userModels = models.userListModel(); // Lấy danh sách user mẫu

    // Map lưu ID cũ sang ID thực MongoDB ObjectId
    const mapFakeId2RealId = {};

    // Thêm users vào DB
    for (const user of userModels) {
      const userObj = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location || "",
        description: user.description || "",
        occupation: user.occupation || "",
        login_name: user.login_name || `${user.first_name.toLowerCase()}${user.last_name.toLowerCase()}`,
        password: user.password || "defaultpassword",
      });

      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;

      console.log("Added user:", user.first_name + " " + user.last_name, "with ID", userObj._id);
    }

    // Lấy tất cả ảnh theo user
    const photoModels = [];
    Object.keys(mapFakeId2RealId).forEach((fakeUserId) => {
      photoModels.push(...models.photoOfUserModel(fakeUserId));
    });

    // Thêm photos, comments (comments là mảng con trong photo)
    for (const photo of photoModels) {
      const photoObj = new Photo({
        file_name: photo.file_name,
        date_time: photo.date_time ? new Date(photo.date_time) : new Date(),
        user_id: mapFakeId2RealId[photo.user_id],
        comments: [],
      });

      // Thêm comment vào photo
      if (photo.comments && photo.comments.length > 0) {
        for (const comment of photo.comments) {
          // Lấy ObjectId user bình luận
          const commentUserId = comment.user?._id ? mapFakeId2RealId[comment.user._id] : null;
          if (!commentUserId) {
            console.warn("Comment user ID not found for comment:", comment.comment);
            continue; // bỏ qua comment không xác định user
          }

          photoObj.comments.push({
            comment: comment.comment,
            date_time: comment.date_time ? new Date(comment.date_time) : new Date(),
            user: commentUserId,
          });

          console.log(`Added comment by user ${commentUserId} to photo ${photo.file_name}`);
        }
      }

      await photoObj.save();
      photo.objectID = photoObj._id;

      console.log("Added photo:", photo.file_name, "for user ID", photo.user_id);
    }

    // Thêm SchemaInfo
    const schemaInfo = new SchemaInfo({
      version: versionString,
      load_date_time: new Date(),
    });
    await schemaInfo.save();

    console.log("SchemaInfo created with version", versionString);

  } catch (error) {
    console.error("Error during DB Load:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

dbLoad();