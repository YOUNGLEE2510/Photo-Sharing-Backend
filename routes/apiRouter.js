const express = require("express");
const router = express.Router();

// Import các router con
const userRouter = require("./UserRouter");
const photoRouter = require("./PhotoRouter");
const commentRouter = require("./CommentRouter");

// Mount các router con
router.use("/user", userRouter);        // Xử lý /user/... và /user/:id/photos
router.use("/photo", photoRouter);      // Xử lý /photo/user/:id
router.use("/comment", commentRouter);  // Xử lý comment APIs

module.exports = router;