import Category from "../models/category.js";
import Product from "../models/product.js";
import { isEmpty } from "../utilities/validations.js";

export const getCategories = async (request, response) => {
  const categories = await Category.find();
  return response.status(200).json(categories).end();
};

export const createCategory = async (request, response) => {
  const { title, icon } = request.body;
  const newCategory = new Category({ title, icon });
  const category = await newCategory.save();
  return response.status(200).json(category).end();
};

export const editCategory = async (request, response) => {
  const { _id: categoryId, title, icon } = request.body;
  const update = { title, icon };
  const options = { new: true };
  const category = await Category.findByIdAndUpdate(categoryId, update, options);
  if (!isEmpty(category)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided category does not exist!" }).end();
  }
};

export const deleteCategory = async (request, response) => {
  const { categoryId } = request.params;
  const query = { categoryId };
  const products = await Product.find(query);
  if (products.length) {
    return response.status(400).json({ errors: "There are existing products in the selected category!" }).end();
  } else {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!isEmpty(category)) {
      return response.status(200).send(true).end();
    } else {
      return response.status(400).json({ errors: "The provided category does not exist!" }).end();
    }
  }
};
