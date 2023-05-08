import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { emailEvents } from "../events/emailEvents.js";
import { select, createPdf, createCsv } from "../utilities/scripts.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const getOrders = async (request, response) => {
  const { search, categoryId, orderBy } = request.body;
  const page = Number(request.body.page) - 1; 
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort } = select(constants.ORDERS, search, categoryId, orderBy);
  const ordersQuery = Order.find(query).sort(sort).skip(skip).limit(limit);
  const totalQuery = Order.find(query).countDocuments();
  const queries = [ordersQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ orders: results[0], total, pagesNumber }).end();
};

export const getUserOrders = async (request, response) => {
  const { userId } = request.body;
  const query = { userId };
  const page = Number(request.body.page) - 1;
  const limit = 5;
  const skip = page * limit;
  const sort = { date: -1 };
  const ordersQuery = Order.find(query).sort(sort).skip(skip).limit(limit);
  const totalQuery = Order.find(query).countDocuments();
  const queries = [ordersQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ orders: results[0], total, pagesNumber }).end();
};

export const getOrder = async (request, response) => {
  const { orderId } = request.params;
  const order = await Order.findById(orderId);
  if (!isEmpty(order)) {
    return response.status(200).json(order).end();
  } else {
    return response.status(400).json({ errors: "The provided order does not exist!" }).end();
  }
};

export const createOrder = async (request, response) => {
  const { userId, paymentType, products, totalPrice } = request.body;
  const date = new Date().getTime();
  const dispatched = 0;
  const user = await User.findById(userId);
  const { account, address } = user;
  account.password = null;
  account.hasPermission = null;
  const sort = { orderNumber: -1 };
  const order = await Order.findOne().sort(sort);
  let orderNumber = 1;
  if (!isEmpty(order)) orderNumber += order.orderNumber;
  const newOrder = new Order({ orderNumber, userId, paymentType, products, totalPrice, date, dispatched, user: { account, address } });
  const savedOrder = await newOrder.save();
  for (const product of products) {
    const update = [{ $set: { "quantity": { $cond: [{ $gt: [{ $subtract: ["$quantity", product.selectedQuantity] }, 0] }, { $subtract: ["$quantity", product.selectedQuantity] }, 0] } } }];
    const options = { new: true };
    await Product.findByIdAndUpdate(product._id, update, options);
  }
  await createPdf(savedOrder);
  const { email, firstName } = account;
  emailEvents.emit(constants.INVOICE_EMAIL_EVENT, email, firstName, orderNumber);
  return response.status(200).json({ orderId: savedOrder._id }).end();
};

export const dispatchOrder = async (request, response) => {
  const { orderId } = request.body;
  const dispatched = new Date().getTime();
  const update = { dispatched };
  const options = { new: true };
  const order = await Order.findByIdAndUpdate(orderId, update, options);
  if (!isEmpty(order)) {
    const { _id, orderNumber, user } = order;
    const { email, firstName } = user.account;
    emailEvents.emit(constants.ORDER_DISPATCHED_EMAIL_EVENT, email, firstName, orderNumber, _id);
    return response.status(200).send(String(dispatched)).end();
  } else {
    return response.status(400).send(false).end();
  }
};

export const deleteOrder = async (request, response) => {
  const { orderId } = request.params;
  const order = await Order.findByIdAndDelete(orderId);
  if (!isEmpty(order)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided order does not exist!" }).end();
  }
};

export const downloadInvoice = async (request, response) => {
  const { orderId } = request.params;
  const order = await Order.findById(orderId);
  if (!isEmpty(order)) {
    const fileName = await createPdf(order);
    return response.status(200).json({ fileName }).end();
  } else {
    return response.status(400).json({ errors: "The provided order does not exist!" }).end();
  }
};

export const downloadOrders = async (request, response) => {
  const { search, categoryId, orderBy } = request.body;
  const page = Number(request.body.page) - 1; 
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort } = select(constants.ORDERS, search, categoryId, orderBy);
  const orders = await Order.find(query).sort(sort).skip(skip).limit(limit);
  const fields = constants.ORDERS_FIELDS;
  const fileName = createCsv(constants.CSV_ORDERS, orders, fields);
  if (fileName) {
    return response.status(200).json({ fileName }).end();
  } else {
    return response.status(400).send(false).end();
  };
};
