import * as mongoose from "mongoose";

const categoryScheme = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }
});

const Category = mongoose.model("Category", categoryScheme);

export default Category;
