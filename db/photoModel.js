const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // user tham chiếu đến Users
});

const photoSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  comments: [commentSchema],
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;