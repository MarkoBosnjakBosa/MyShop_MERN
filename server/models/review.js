import * as mongoose from "mongoose";

const reviewScheme = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Number, required: true }
});

const Review = mongoose.model("Review", reviewScheme);

export default Review;
