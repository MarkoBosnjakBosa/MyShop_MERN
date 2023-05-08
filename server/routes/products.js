import * as fs from "fs";
import Product from "../models/product.js";
import { select, createImageObject, createCsv } from "../utilities/scripts.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const getProducts = async (request, response) => {
  const { search, categoryId, orderBy } = request.body;
  const page = Number(request.body.page) - 1; 
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort, collation } = select(constants.PRODUCTS, search, categoryId, orderBy);
  const productsQuery = Product.find(query).collation(collation).sort(sort).skip(skip).limit(limit);
  const totalQuery = Product.find(query).countDocuments();
  const queries = [productsQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ products: results[0], total, pagesNumber }).end();
};

export const getProduct = async (request, response) => {
  const { productId } = request.params;
  const product = await Product.findById(productId);
  if (!isEmpty(product)) {
    return response.status(200).json(product).end();
  } else {
    return response.status(400).json({ errors: "The provided product does not exist!" }).end();
  }
};

export const createProduct = async (request, response) => {
  const { title, description, price, quantity, categoryId } = request.body;
  const technicalData = JSON.parse(request.body.technicalData);
  const primaryImage = request.files["primaryImage"][0];
  const primaryImageObject = createImageObject(primaryImage);
  const images = request.files["images"];
  let imagesObjects = [];
  if (images && images.length && images.length < 5) {
    images.forEach((image) => {
      const imageObject = createImageObject(image);
      try { fs.unlinkSync(image.path); } catch (error) {}
      imagesObjects = [...imagesObjects, imageObject];
    });
  }
  try { fs.unlinkSync(primaryImage.path); } catch (error) {}
  const rating = { votes: 0, totalRating: 0, averageRating: 0, usersRatings: [] };
  const date = new Date().getTime();
  const newProduct = new Product({ title, description, price, quantity, categoryId, technicalData, primaryImage: primaryImageObject, images: imagesObjects, rating, date });
  const product = await newProduct.save();
  return response.status(200).json({ _id: product._id }).end();
};

export const editProduct = async (request, response) => {
  const { _id: productId, title, description, price, quantity, categoryId } = request.body;
  const technicalData = JSON.parse(request.body.technicalData);
  const primaryImage = request.files["primaryImage"][0];
  const primaryImageObject = createImageObject(primaryImage);
  const images = request.files["images"];
  let imagesObjects = [];
  if (images && images.length && images.length < 5) {
    images.forEach((image) => {
      const imageObject = createImageObject(image);
      try { fs.unlinkSync(image.path); } catch (error) {}
      imagesObjects = [...imagesObjects, imageObject];
    });
  }
  try { fs.unlinkSync(primaryImage.path); } catch (error) {}
  const update = { title, description, price, quantity, categoryId, technicalData, primaryImage: primaryImageObject, images: imagesObjects };
  const options = { new: true };
  const product = await Product.findByIdAndUpdate(productId, update, options);
  if (!isEmpty(product)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided product does not exist!" }).end();
  }
};

export const deleteProduct = async (request, response) => {
  const { productId } = request.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!isEmpty(product)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided product does not exist!" }).end();
  }
};

export const downloadProducts = async (request, response) => {
  const { search, categoryId, orderBy } = request.body;
  const page = Number(request.body.page) - 1; 
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort, collation } = select(constants.PRODUCTS, search, categoryId, orderBy);
  const products = await Product.find(query).collation(collation).sort(sort).skip(skip).limit(limit);
  const fields = constants.PRODUCTS_FIELDS;
  const fileName = createCsv(constants.CSV_PRODUCTS, products, fields);
  if (fileName) {
    return response.status(200).json({ fileName }).end();
  } else {
    return response.status(400).send(false).end();
  }
};
