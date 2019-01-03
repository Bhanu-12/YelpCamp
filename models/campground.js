var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
});
// Refusing to install package with name "mongodb" under a package
module.exports = mongoose.model("campGround", campgroundSchema);