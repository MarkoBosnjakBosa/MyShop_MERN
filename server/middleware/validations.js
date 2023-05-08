import { validUsername, validEmail, validPassword, validName, validMobileNumber, validStreet, validHouseNumber, validCity, validZipCode, validCountry, validReCaptcha, validToken, validOption, validTitle, validIcon, validDescription, validPrice, validQuantity, validPrimaryImage, validRating, validCoordinate, validProducts, validPaymentType, validObjectId, isEmpty } from "../utilities/validations.js";

const validateRegistration = (request, response, next) => {
  let errors = [];
  const account = request.body.account;
  const reCaptchaToken = request.body.reCaptchaToken;
  if (isEmpty(account)) {
    return response.status(400).json({ errors: ["Username", "Email", "Password", "First name", "Last name", "Mobile number"] }).end();
  }
  const username = account.username;
  if (!validUsername(username)) {
    errors = [...errors, "Username"];
  }
  const email = account.email;
  if (!validEmail(email)) {
    errors = [...errors, "Email"];
  }
  const password = account.password;
  if (!validPassword(password)) {
    errors = [...errors, "Password"];
  }
  const firstName = account.firstName;
  if (!validName(firstName)) {
    errors = [...errors, "First name"];
  }
  const lastName = account.lastName;
  if (!validName(lastName)) {
    errors = [...errors, "Last name"];
  }
  const mobileNumber = account.mobileNumber;
  if (!validMobileNumber(mobileNumber)) {
    errors = [...errors, "Mobile number"];
  }
  if (!reCaptchaToken) {
    errors = [...errors, "ReCaptcha"];
  }
  if (!errors.length) {
    const reCaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_v2_SECRET_KEY}&response=${reCaptchaToken}&remoteip=${request.connection.remoteAddress}`;
    if (validReCaptcha(reCaptchaVerificationUrl)) {
      return next();
    } else {
      errors = [...errors, "ReCaptcha"];
      return response.status(400).json({ errors }).end();
    }
  }
  else return response.status(400).json({ errors }).end();
};

const validateConfirmation = (request, response, next) => {
  const userId = request.query.userId;
  const confirmationToken = request.query.confirmationToken;
  if (validObjectId(userId) && validToken(confirmationToken)) return next();
  else return response.status(401).send(false).end();
};

const validateLogin = (request, response, next) => {
  let errors = [];
  const username = request.body.username;
  if (!validUsername(username)) {
    errors = [...errors, "Username"];
  }
  const password = request.body.password;
  if (!validPassword(password)) {
    errors = [...errors, "Password"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateAuthentication = (request, response, next) => {
  const userId = request.body.userId;
  const authenticationToken = request.headers["x-otp"];
  if (validObjectId(userId) && validToken(authenticationToken)) return next();
  else return response.status(400).json({ errors: ["Token"] }).end();
};

const validateAuthenticationEnabling = (request, response, next) => {
  const userId = request.body.userId;
  const authenticationEnabled = request.body.authenticationEnabled;
  if (validObjectId(userId)) {
    if (authenticationEnabled) {
      const authenticationEnablingToken = request.body.authenticationEnablingToken;
      if (validToken(authenticationEnablingToken)) return next();
      else return response.status(400).json({ errors: ["Token"] }).end();
    } else {
      return next();
    }
  } else {
    return response.status(400).json({ errors: ["Token"] }).end();
  }
};

const validateCredentials = (request, response, next) => {
  const email = request.body.email;
  const option = request.body.option;
  if (validEmail(email) && validOption(option)) return next();
  else return response.status(400).json({ errors: ["Email"] }).end();
};

const validatePasswordReset = (request, response, next) => {
  const userId = request.body.userId;
  const password = request.body.password;
  if (validObjectId(userId) && validPassword(password)) {
    const url = request.url;
    if (url === "/resetPasswordLoggedOut") {
      const resetPasswordToken = request.body.resetPasswordToken;
      if (validToken(resetPasswordToken)) return next();
    } else {
      return next();
    }
  } else {
    return response.status(400).json({ errors: ["Password"] }).end();
  }
};

const validateAccount = (request, response, next) => {
  let errors = [];
  const userId = request.body.userId;
  const account = request.body.account;
  if (isEmpty(account)) {
    return response.status(400).json({ errors: ["Email", "First name", "Last name", "Mobile number"] }).end();
  }
  const email = account.email;
  if (!validObjectId(userId) || !validEmail(email)) {
    errors = [...errors, "Email"];
  }
  const firstName = account.firstName;
  if (!validName(firstName)) {
    errors = [...errors, "First name"];
  }
  const lastName = account.lastName;
  if (!validName(lastName)) {
    errors = [...errors, "Last name"];
  }
  const mobileNumber = account.mobileNumber;
  if (!validMobileNumber(mobileNumber)) {
    errors = [...errors, "Mobile number"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateAddress = (request, response, next) => {
  let errors = [];
  const userId = request.body.userId;
  const address = request.body.address;
  if (isEmpty(address)) {
    return response.status(400).json({ errors: ["Street", "House number", "City", "ZIP code", "Country"] }).end();
  }
  const street = address.street;
  if (!validObjectId(userId) || !validStreet(street)) {
    errors = [...errors, "Street"];
  }
  const houseNumber = address.houseNumber;
  if (!validHouseNumber(houseNumber)) {
    errors = [...errors, "House number"];
  }
  const city = address.city;
  if (!validCity(city)) {
    errors = [...errors, "City"];
  }
  const zipCode = address.zipCode;
  if (!validZipCode(zipCode)) {
    errors = [...errors, "ZIP code"];
  }
  const country = address.country;
  if (!validCountry(country)) {
    errors = [...errors, "Country"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateCategory = (request, response, next) => {
  if (request.method === "PUT") {
    const categoryId = request.body._id;
    if (!validObjectId(categoryId)) return response.status(400).json({ errors: "The provided category does not exist!" }).end();
  }
  let errors = [];
  const title = request.body.title;
  if (!validTitle(title)) {
    errors = [...errors, "Title"];
  }
  const icon = request.body.icon;
  if (!validIcon(icon)) {
    errors = [...errors, "Icon"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateTechnicalInformation = (request, response, next) => {
  const title = request.body.title;
  if (validTitle(title)) return next();
  else return response.status(400).json({ errors: ["Title"] }).end();
};

const validateProduct = (request, response, next) => {
  if (request.method === "PUT") {
    const productId = request.body._id;
    if (!validObjectId(productId)) return response.status(400).json({ errors: "The provided product does not exist!" }).end();
  }
  let errors = [];
  const title = request.body.title;
  if (!validTitle(title)) {
    errors = [...errors, "Title"];
  }
  const description = request.body.description;
  if (!validDescription(description)) {
    errors = [...errors, "Description"];
  }
  const price = request.body.price;
  if (!validPrice(price)) {
    errors = [...errors, "Price"];
  }
  const quantity = request.body.quantity;
  if (!validQuantity(quantity)) {
    errors = [...errors, "Quantity"];
  }
  const categoryId = request.body.categoryId;
  if (!validObjectId(categoryId)) {
    errors = [...errors, "Category"];
  }
  if (request.files["primaryImage"] && request.files["primaryImage"][0]) {
    const primaryImage = request.files["primaryImage"][0];
    if (!validPrimaryImage(primaryImage) || request.extensionValidationError) {
      errors = [...errors, "Primary Image"];
    }
  } else {
    errors = [...errors, "Primary Image"]; 
  }
  const reCaptchaToken = request.body.reCaptchaToken;
  if (!reCaptchaToken) {
    errors = [...errors, "ReCaptcha"];
  }
  if (!errors.length) {
    const reCaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_v3_SECRET_KEY}&response=${reCaptchaToken}&remoteip=${request.connection.remoteAddress}`;
    if (validReCaptcha(reCaptchaVerificationUrl)) {
      return next();
    } else {
      errors = [...errors, "ReCaptcha"];
      return response.status(400).json({ errors }).end();
    }
  }
  else return response.status(400).json({ errors }).end();
};

const validateRating = (request, response, next) => {
  const productId = request.body.productId;
  const userId = request.body.userId;
  const rating = Number(request.body.rating);
  if (validObjectId(productId) && validObjectId(userId) && validRating(rating)) return next();
  else return response.status(400).json({ errors: "The provided product / user / rating does not exist!" }).end();
};

const validateReview = (request, response, next) => {
  const productId = request.body.productId;
  const userId = request.body.userId;
  const username = request.body.username;
  const text = request.body.text;
  if (validObjectId(productId) && validObjectId(userId) && validUsername(username) && validDescription(text)) return next();
  else return response.status(400).json({ errors: ["Text"] }).end();
};

const validateContactSettings = (request,response, next) => {
  let errors = [];
  const coordinates = request.body.coordinates;
  if (isEmpty(coordinates)) {
    return response.status(400).json({ errors: ["Latitude", "Longitude"] }).end();
  }
  const latitude = coordinates.lat;
  if (!validCoordinate(latitude)) {
    errors = [...errors, "Latitude"];
  }
  const longitude = coordinates.lng;
  if (!validCoordinate(longitude)) {
    errors = [...errors, "Longitude"];
  }
  const street = request.body.street;
  if (!validStreet(street)) {
    errors = [...errors, "Street"];
  }
  const houseNumber = request.body.houseNumber;
  if (!validHouseNumber(houseNumber)) {
    errors = [...errors, "House number"];
  }
  const city = request.body.city;
  if (!validCity(city)) {
    errors = [...errors, "City"];
  }
  const zipCode = request.body.zipCode;
  if (!validZipCode(zipCode)) {
    errors = [...errors, "ZIP code"];
  }
  const country = request.body.country;
  if (!validCountry(country)) {
    errors = [...errors, "Country"];
  }
  const email = request.body.email;
  if (!validEmail(email)) {
    errors = [...errors, "Email"];
  }
  const mobileNumber = request.body.mobileNumber;
  if (!validMobileNumber(mobileNumber)) {
    errors = [...errors, "Mobile number"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateContact = (request, response, next) => {
  let errors = [];
  const firstName = request.body.firstName;
  if (!validName(firstName)) {
    errors = [...errors, "First name"];
  }
  const lastName = request.body.lastName;
  if (!validName(lastName)) {
    errors = [...errors, "Last name"];
  }
  const email = request.body.email;
  if (!validEmail(email)) {
    errors = [...errors, "Email"];
  }
  const mobileNumber = request.body.mobileNumber;
  if (!validMobileNumber(mobileNumber)) {
    errors = [...errors, "Mobile number"];
  }
  const message = request.body.message;
  if (!validDescription(message)) {
    errors = [...errors, "Message"];
  }
  if (!errors.length) return next();
  else return response.status(400).json({ errors }).end();
};

const validateCheckoutSession = (request, response, next) => {
  const line_items = request.body.line_items;
  if (validProducts(line_items)) return next();
  else return response.status(400).json({ errors: "The provided line_items do not exist!" }).end();
};

const validatePayment = (request, response, next) => {
  const userId = request.body.userId;
  const paymentType = request.body.paymentType;
  const products = request.body.products;
  const totalPrice = request.body.totalPrice;
  if (validObjectId(userId) && validPaymentType(paymentType) && validProducts(products) && validPrice(totalPrice)) return next();
  else return response.status(400).json({ errors: "The provided payment is not valid!" }).end();
};

const validateObjectId = (request, response, next) => {
  const url = request.url;
  let objectId;
  if (url.includes("/getProfile/") || url.includes("/getAuthentication/") || url.includes("/getAvatar/") || url.includes("/getUser/") || url.includes("/deleteUser/")) {
    objectId = request.params.userId;
  }
  if (url.includes("/saveAvatar") || url.includes("/sendConfirmationEmail") || url.includes("/sendAuthenticationToken") || url.includes("/sendAuthenticationEnablingToken") || url.includes("/getUserOrders")) {
    objectId = request.body.userId;
  }
  if (url.includes("/deleteCategory/")) {
    objectId = request.params.categoryId;
  } 
  if (url.includes("/deleteTechnicalInformation/")) {
    objectId = request.params.technicalInformationId;
  }
  if (url.includes("/getProduct/") || url.includes("/deleteProduct/")) {
    objectId = request.params.productId;
  }
  if (url.includes("/getReviews")) {
    objectId = request.body.productId;
  }
  if (url.includes("/deleteContact/")) {
    objectId = request.params.contactId;
  }
  if (url.includes("/dispatchOrder")) {
    objectId = request.body.orderId;
  }
  if (url.includes("/getOrder/") || url.includes("/downloadInvoice/") || url.includes("/deleteOrder/")) {
    objectId = request.params.orderId;
  }
  if (url.includes("/deleteReview/")) {
    const reviewId = request.params.reviewId;
    const userId = request.params.userId;
    if (validObjectId(reviewId) && validObjectId(userId)) return next();
    else return response.status(400).json({ errors: "The provided review does not exist!" }).end();
  }
  if (validObjectId(objectId)) return next();
  else return response.status(400).json({ errors: "The provided object id does not exist!" }).end();
};

const validations = {
  validateRegistration,
  validateConfirmation,
  validateLogin,
  validateAuthentication,
  validateAuthenticationEnabling,
  validateCredentials,
  validatePasswordReset,
  validateAccount,
  validateAddress,
  validateCategory,
  validateTechnicalInformation,
  validateProduct,
  validateRating,
  validateReview,
  validateContactSettings,
  validateContact,
  validateCheckoutSession,
  validatePayment,
  validateObjectId
};

export default validations;
