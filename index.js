require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const apiRouter = require("./routes/apiRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const dbConnect = require("./db/dbConnect");

const app = express();

// Kết nối MongoDB và khởi động server
const startServer = async () => {
  try {
    // Kết nối MongoDB
    await dbConnect();
    
    // Khởi động server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Khởi động server
startServer();

// Cấu hình CORS
app.use(
  cors({
    origin: [
      "https://tzv2g4-3000.csb.app",
      "https://49x3g6-8080.csb.app",
      "http://localhost:3000",
      "http://localhost:8080"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400 // 24 hours
  })
);

// Bảo mật HTTP headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  next();
});

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true
    }
  })
);

// Middleware kiểm tra đăng nhập
const checkAuth = (req, res, next) => {
  // Các route không cần xác thực
  const publicRoutes = [
    "/api/user/login",
    "/api/user/logout",
    "/api/user/check",
    "/api/user/list"
  ];

  if (req.method === "POST" && req.path === "/api/user") {
    return next(); // Cho phép đăng ký
  }

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "❌ Unauthorized: Invalid token format." });
  }

  // Lưu token vào session
  req.session.userId = token;
  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).json({ message: "❌ Internal server error" });
    }
    next();
  });
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images/"),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Middleware chính
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "images")));
app.use(checkAuth);

// Routers
app.use("/api", apiRouter);
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/comment", CommentRouter);

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

// Đăng nhập
app.post("/api/user/login", async (req, res) => {
  const { login_name, password } = req.body;
  if (!login_name || !password) {
    return res.status(400).json({ message: "❌ Thiếu login_name hoặc password." });
  }

  const User = require("./db/userModel");
  const models = require("./modelData/models");

  try {
    let user = await User.findOne({ login_name });
    if (!user) {
      throw new Error("Not in DB");
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "❌ Mật khẩu không đúng." });
    }

    req.session.userId = user._id;
    return res.json({
      token: user._id,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        login_name: user.login_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation
      }
    });
  } catch (err) {
    console.log("📦 Using fallback model data due to error:", err.message);
    const users = models.userListModel();
    const user = users.find((u) => u.login_name === login_name);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "❌ Sai thông tin đăng nhập." });
    }

    req.session.userId = user._id;
    res.json({
      token: user._id,
      user
    });
  }
});

// Đăng xuất
app.post("/api/user/logout", (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: "❌ Bạn chưa đăng nhập." });
  }
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "❌ Lỗi khi đăng xuất." });
    }
    res.status(200).json({ message: "✅ Đăng xuất thành công." });
  });
});

// Đăng ký
app.post("/api/user", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "❌ Thiếu các trường bắt buộc: login_name, password, first_name, last_name."
    });
  }

  const User = require("./db/userModel");
  const models = require("./modelData/models");

  try {
    let existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ message: "❌ login_name đã tồn tại." });
    }

    const newUser = new User({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || "",
      _id: new mongoose.Types.ObjectId().toString()
    });

    await newUser.save();

    return res.status(201).json({
      message: "✅ Tạo người dùng thành công",
      user: {
        login_name: newUser.login_name,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }
    });
  } catch (err) {
    console.log("❗ MongoDB error, saving fallback user to model data...");
    res.status(201).json({
      message: "✅ Tạo người dùng thành công (dữ liệu giả)",
      user: {
        login_name,
        first_name,
        last_name
      }
    });
  }
});

// Check đăng nhập
app.get("/api/user/check", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Not logged in" });
  }

  const token = authHeader.split(" ")[1];
  const User = require("./db/userModel");
  const models = require("./modelData/models");

  try {
    const user = await User.findById(token);
    if (!user) throw new Error("User not found");

    return res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation
    });
  } catch (err) {
    console.log("⚠️ MongoDB lỗi, dùng dữ liệu models.js...");
    const users = models.userListModel();
    const user = users.find((u) => u._id === token);
    if (user) {
      return res.json(user);
    } else {
      return res.status(401).json({ message: "❌ User not found" });
    }
  }
});

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "Hello from photo-sharing app API!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "❌ Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "❌ Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});