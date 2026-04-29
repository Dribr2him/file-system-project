// ===== Packages =====
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const SECRET = "mysecretkey";
const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Create uploads folder =====
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===== Database =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ===== Models =====
const File = mongoose.model("File", {
  filename: String,
  title: String,
  station: String
});

const User = require("./models/User");

// ===== Multer =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ===== Auth Middleware =====
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ===== Role Middleware =====
const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Not allowed" });
  }
  next();
};

// ===== Register =====
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const count = await User.countDocuments();

    const user = new User({
      username,
      password: hashed,
      role: count === 0 ? "owner" : "user" // 👑 أول واحد owner
    });

    await user.save();

    res.json({ message: "User created", role: user.role });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Register error" });
  }
});

// ===== Login =====
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
      { id: user._id, role: user.role },
      SECRET
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login error" });
  }
});

// ===== Upload =====
app.post(
  "/upload",
  auth,
  requireRole(["admin", "owner"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, station } = req.body;

      console.log("TITLE:", title);
      console.log("STATION:", station);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileDoc = new File({
        filename: req.file.filename,
        title,
        station
      });

      await fileDoc.save();

      res.json({ message: "Uploaded successfully" });

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// ===== Get files by station =====
app.get("/files/:station", async (req, res) => {
  try {
    const files = await File.find({ station: req.params.station });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Error fetching files" });
  }
});

// ===== Delete file =====
app.delete(
  "/delete/:id",
  auth,
  requireRole(["admin", "owner"]),
  async (req, res) => {
    try {
      await File.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===== Change Roles =====
app.put("/make-admin/:id", auth, requireRole(["owner"]), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: "admin" });
  res.json({ message: "User is now admin" });
});

app.put("/make-user/:id", auth, requireRole(["owner"]), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: "user" });
  res.json({ message: "User is now user" });
});

// ===== Serve uploaded files =====
app.use("/uploads", express.static("uploads"));

// ===== Serve React =====
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ===== Start Server =====
app.listen(5000, () => {
  console.log("Server running 🚀");
});