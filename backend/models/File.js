const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: String,
  station: String
});

module.exports = mongoose.model("File", fileSchema);