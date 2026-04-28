// ===== Packages =====
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// ===== App Config =====
const app = express();

// إنشاء فولدر uploads لو مش موجود
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== Database =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ===== Models =====
const File = mongoose.model("File", {
  title: String,
  type: String,
  url: String
});

const User = require("./models/User");

// ===== Multer Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ===== Auth Config =====
const SECRET = "mysecretkey";

// ===== Auth Middleware =====
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ===== Routes =====

// 🟢 Register (مرة واحدة بس)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashed
  });

  await user.save();
  res.json({ message: "User created" });
});

// 🟢 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({ token });
});

// 🟢 Upload (محمي)
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newFile = new File({
      title: req.file.originalname,
      type: req.file.mimetype,
      url: req.file.path
    });

    await newFile.save();

    res.json(newFile);

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// 🟢 Add Link
app.post("/add-link", async (req, res) => {
  const { title, url } = req.body;

  const newFile = new File({
    title,
    type: "link",
    url
  });

  await newFile.save();
  res.json(newFile);
});

// 🟢 Get Files
const fs = require("fs");

app.get("/files", async (req, res) => {
  try {
    const files = await File.find();

    // فلترة الملفات اللي موجودة بس
    const validFiles = files.filter(f => {
      if (f.type === "link") return true;
      return fs.existsSync(f.url);
    });

    res.json(validFiles);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Delete File =====
app.delete("/delete/:id", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===== Start Server =====
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});