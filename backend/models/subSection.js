const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  resources: [
    {
      name: { type: String },
      url: { type: String },
    },
  ],
});
module.exports =
  mongoose.models.SubSection || mongoose.model("SubSection", subSectionSchema);
