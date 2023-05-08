import ejs from "ejs";
import * as fs from "fs";
import path from "path";
import * as pdf from "html-pdf";
import * as json2csv from "json2csv";
import constants from "./constants.js";
const directory = path.resolve();

export const select = (type, search, categoryId, orderBy) => {
  let sort = {};
  switch (orderBy) {
    case "titleAsc":
      sort = { title: 1 };
      break;
    case "titleDesc":
      sort = { title: -1 };
      break;
    case "priceAsc":
      sort = { price: 1 };
      break;
    case "priceDesc":
      sort = { price: -1 };
      break;
    case "quantityAsc":
      sort = { quantity: 1 };
      break;
    case "quantityDesc":
      sort = { quantity: -1 };
      break;
    case "ratingAsc":
      sort = { "rating.averageRating": 1 };
      break;
    case "ratingDesc":
      sort = { "rating.averageRating": -1 };
      break;
    case "dateAsc":
      sort = { date: 1 };
      break;
    case "dateDesc":
      sort = { date: -1 };
      break;
    case "usernameAsc":
      sort = { "account.username": 1 };
      break;
    case "usernameDesc":
      sort = { "account.username": -1 };
      break;
    case "emailAsc":
      sort = { "account.email": 1 };
      break;
    case "emailDesc":
      sort = { "account.email": -1 };
      break;
    case "orderNumberAsc":
      sort = { orderNumber: 1};
      break;
    case "orderNumberDesc":
      sort = { orderNumber: -1 };
      break;
    case "paymentTypeAsc":
      sort = { paymentType: 1 };
      break;
    case "paymentTypeDesc":
      sort = { paymentType: -1 };
      break;
    case "dispatchedAsc":
      sort = { dispatched: 1 };
      break;
    case "dispatchedDesc":
      sort = { dispatched: -1 };
      break;
    default:
      sort = { date : -1 };
  }
  const collation = { locale: "en_US", numericOrdering: true };
  let query = {};
  let categoryQuery = {};
  switch (type) {
    case constants.PRODUCTS:
      categoryQuery = categoryId ? { categoryId } : {};
      query = search ? { $and: [categoryQuery, { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }] } : categoryQuery;    
      break;
    case constants.USERS:
      query = search ? { $and: [{ "account.hasPermission": false }, { $or: [{ "account.username": { $regex: search, $options: "i" } }, { "account.email": { $regex: search, $options: "i" } }, { "account.mobileNumber": { $regex: search, $options: "i" } }, { "account.firstName": { $regex: search, $options: "i" } }, { "account.lastName": { $regex: search, $options: "i" } }] }] } : { "account.hasPermission": false };
      break;
    case constants.CONTACTS:
      query = search ? { $or: [{ firstName: { $regex: search, $options: "i" }}, { lastName: { $regex: search, $options: "i" }}, { email: { $regex: search, $options: "i" }}, { message: { $regex: search, $options: "i" } }] } : {};
      break;
    case constants.ORDERS:
      switch(categoryId) {
        case "dispatched":
          categoryQuery = { dispatched: { $gt: 0 } };
          break;
        case "notDispatched":
          categoryQuery = { dispatched: 0 };
          break;
        case "creditCard":
          categoryQuery = { paymentType: "Credit card" };
          break;
        case "payPal":
          categoryQuery = { paymentType: "PayPal" };
          break;
        default:
          categoryQuery = {};
        }
      if (isNaN(search)) {
        query = search ? { $and: [categoryQuery, { $or: [{ "user.account.username": { $regex: search, $options: "i" } }, { "user.account.email": { $regex: search, $options: "i" } }, { "user.account.firstName": { $regex: search, $options: "i" } }, { "user.account.lastName": { $regex: search, $options: "i" } }, { "user.account.mobileNumber": { $regex: search, $options: "i" } }] }] } : categoryQuery;
      } else {
        query = search ? { $and: [categoryQuery, { orderNumber: search }] } : categoryQuery;
      }
      break;
    default:
      query = {};
  }
  return { query, sort, collation };
};

export const createImageObject = (image) => {
  const readImage = fs.readFileSync(image.path);
  const encodedImage = readImage.toString("base64");
  return { name: image.filename, mimeType: image.mimetype, buffer: Buffer.from(encodedImage, "base64") };
};

export const formatPrice = (number) => {
  return `${Number(number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } €`;
};

export const createPdf = async (order) => {
  const { orderNumber } = order;
  const products = order.products.map((product) => ({
    title: product.title,
    price: formatPrice(product.price),
    selectedQuantity: product.selectedQuantity,
    totalPrice: formatPrice(product.price * product.selectedQuantity)
  }));
  order = { ...order.toObject(), products, totalPrice: formatPrice(order.totalPrice) };
  const htmlCompiled = ejs.compile(fs.readFileSync(`${directory}/templates/invoice/invoice.html`, "UTF-8"));
  const html = htmlCompiled({ order });
  const filePath = `${directory}/temporary/Invoice_${orderNumber}.pdf`;
  await new Promise((resolve, reject) => {
    pdf.create(html).toFile(filePath, () => {
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch (error) {}
      }, Number(process.env.FILE_EXPIRATION_TIME));
      resolve(`Invoice_${orderNumber}.pdf`);
    });
  });
  return `Invoice_${orderNumber}.pdf`;
};

export const createCsv = (type, values, fields) => {
  if (type && values && fields) {
    const csv = json2csv.parse(values, { fields });
    const timestamp = new Date().getTime();
    const filePath = `${directory}/temporary/${type}_${timestamp}.csv`;
    fs.writeFileSync(filePath, csv);
    setTimeout(() => {
      try { fs.unlinkSync(filePath); } catch (error) {}
    }, Number(process.env.FILE_EXPIRATION_TIME));
    return `${type}_${timestamp}.csv`;
  } else {
    return "";
  }
};
