const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  title: String,
  station: String,
});

module.exports = mongoose.model("File", fileSchema);