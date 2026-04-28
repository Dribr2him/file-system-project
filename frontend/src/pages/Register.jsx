app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check لو موجود
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }

    // تشفير الباسورد
    const hashed = await bcrypt.hash(password, 10);

    // 🔥 تحديد الرول
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