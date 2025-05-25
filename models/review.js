//review is related to listing so it is database relation topic
//it is a 1 to n type of relation--we can associate an array of reviews in listing.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author:{
    type: Schema.Types.ObjectId ,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);