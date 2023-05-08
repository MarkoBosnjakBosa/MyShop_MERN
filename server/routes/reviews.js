import Product from "../models/product.js";
import Review from "../models/review.js";
import { isEmpty } from "../utilities/validations.js";

export const rateProduct = async (request, response) => {
  const { productId, userId } = request.body;
  const rating = Number(request.body.rating);
  const product = await Product.findById(productId);
  if (!isEmpty(product)) {
    let votes = Number(product.rating.votes);
    let totalRating = Number(product.rating.totalRating);
    let usersRatings = product.rating.usersRatings;
    const foundIndex = usersRatings.findIndex((userRating) => userRating.userId === userId);
    if (foundIndex > -1) {
      totalRating = totalRating - Number(usersRatings[foundIndex].rating) + rating;
      usersRatings[foundIndex].rating = rating;
    } else {
      votes = votes + 1;
      totalRating += rating;
      usersRatings = [...usersRatings, { userId, rating }]; 
    }
    const averageRating = Math.round(totalRating / votes);
    const update = { rating: { votes, totalRating, averageRating, usersRatings } };
    const options = { new: true };
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, options);
    return response.status(200).json(updatedProduct.rating).end();
  } else {
    return response.status(400).json({ errors: "The provided product does not exist!" }).end();
  }
};

export const getReviews = async (request, response) => {
  const { productId } = request.body;
  const query = { productId };
  const page = Number(request.body.page) - 1;
  const limit = 5;
  const skip = page * limit;
  const sort = { date: -1 };
  const reviewsQuery = Review.find(query).sort(sort).skip(skip).limit(limit);
  const totalQuery = Review.find(query).countDocuments();
  const queries = [reviewsQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ reviews: results[0], total, pagesNumber }).end();
};

export const writeReview = async (request, response) => {
  const { productId, userId, username, text } = request.body;
  const date = new Date().getTime();
  const newReview = new Review({ productId, userId, username, text, date });
  await newReview.save();
  return response.status(200).send(true).end();
};

export const deleteReview = async (request, response) => {
  const { reviewId, userId } = request.params;
  const query = { _id: reviewId, userId };
  const review = await Review.findOneAndDelete(query);
  if (!isEmpty(review)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided review does not exist!" }).end();
  }
};
