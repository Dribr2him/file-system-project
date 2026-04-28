// ===== Packages =====
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const SECRET = "mysecretkey"; // غيرها بعدين
// ===== App Config =====
const app = express();

//ربط االسيرفر 
// const File = require("./models/File");

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


// ===== Auth Middleware =====
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ===== Routes =====

// 🟢 Register (مرة واحدة بس)
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
      isAdmin: true // 🔥 مهم
    });

    await user.save();

    res.json({ message: "User created" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Register error" });
  }
});
// 🟢 Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      SECRET
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login error" });
  }
});


// 🟢 Upload (محمي)
app.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const newFile = new File({
      title: req.file.originalname,
      type: req.file.mimetype,
      url: req.file.path
    });

    await newFile.save();
    res.json(newFile);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload error" });
  }
});

// 🟢 Stetion
app.get("/files/:station", async (req, res) => {
  try {
    const station = req.params.station;

    const files = await File.find({ station });

    res.json(files);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
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