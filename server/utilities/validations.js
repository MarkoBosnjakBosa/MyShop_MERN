export const validUsername = (username) => username && /^[a-z0-9_.-]*$/.test(username);

export const validEmail = (email) => email && /\S+@\S+\.\S+/.test(email);

export const validPassword = (password) => password && /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

export const validName = (name) => name && name.trim().length;

export const validMobileNumber = (mobileNumber) => mobileNumber && /^[1-9]\d*$/.test(mobileNumber);

export const validStreet = (street) => street && street.trim().length;

export const validHouseNumber = (houseNumber) => houseNumber && /^[0-9]\d*$/.test(houseNumber);

export const validCity = (city) => city && city.trim().length;

export const validZipCode = (zipCode) => zipCode && /^[0-9]\d*$/.test(zipCode);

export const validCountry = (country) => country && country.trim().length;

export const validReCaptcha = async (reCaptchaVerificationUrl) => {
  const response = await fetch(reCaptchaVerificationUrl);
  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  return data.success;
};

export const validToken = (token) => token && /^\d{6}$/.test(token);

export const validOption = (option) => option && ((option === "password") || (option === "username") || (option === "confirmationEmail"));

export const validTitle = (title) => title && title.trim().length;

export const validIcon = (icon) => icon && icon.trim().length;

export const validDescription = (description) => description && description.trim().length;

export const validPrice = (price) => price && /^[1-9]\d*\.[0-9]{2}$/.test(price);

export const validQuantity = (quantity) => /^[0-9]\d*$/.test(quantity);

export const validPrimaryImage = (primaryImage) => primaryImage && Object.keys(primaryImage).length && primaryImage.filename && primaryImage.mimetype;

export const isModified = (image) => image && /_\d/g.test(image);

export const validRating = (rating) => rating && rating > 0 && rating < 6;

export const validCoordinate = (coordinate) => !isNaN(coordinate) && !isNaN(parseFloat(coordinate));

export const validObjectId = (objectId) => objectId && /^[a-fA-F0-9]{24}$/.test(objectId);

export const validProducts = (line_items) => line_items && line_items.length;

export const validPaymentType = (paymentType) => paymentType && ((paymentType === "Credit card") || (paymentType === "PayPal"));

export const isEmpty = (object) => !object || Object.keys(object).length === 0;
