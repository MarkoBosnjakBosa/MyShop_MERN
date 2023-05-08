import constants from "../utilities/constants.js";
import { EventEmitter } from "events";
import ejs from "ejs";
import * as fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
const directory = path.resolve();

export const emailEvents = new EventEmitter();
emailEvents.on(constants.CONFIRMATION_EMAIL_EVENT, (email, userId, firstName, username, confirmationToken) => {
  sendEmail("confirmation", email, { userId, firstName, username, confirmationToken }); 
});
emailEvents.on(constants.RESET_PASSWORD_EMAIL_EVENT, (email, userId, firstName, username, resetPasswordToken) => {
  sendEmail("resetPassword", email, { userId, firstName, username, resetPasswordToken });
});
emailEvents.on(constants.USERNAME_EMAIL_EVENT, (email, firstName, username) => {
  sendEmail("username", email, { firstName, username }); 
});
emailEvents.on(constants.INVOICE_EMAIL_EVENT, (email, firstName, orderNumber) => {
  sendEmail("invoice", email, { firstName }, orderNumber); 
});
emailEvents.on(constants.ORDER_DISPATCHED_EMAIL_EVENT, (email, firstName, orderNumber, orderId) => {
  sendEmail("orderDispatched", email, { firstName, orderNumber, orderId }, orderNumber); 
});
emailEvents.on(constants.CONTACT_EMAIL_EVENT, (email, firstName) => {
  sendEmail("contact", email, { firstName });
});

const sendEmail = (type, email, data, orderNumber = null) => {
  const emailData = getEmailData(type, orderNumber);
  const { path, subject } = emailData;
  const compiledHtml = ejs.compile(fs.readFileSync(`${directory}${path}`, "UTF-8"));
  const html = compiledHtml(data);
  const options = { from: process.env.EMAIL_USERNAME, to: email, subject, html };
  if (type === "invoice") options.attachments = [{ filename: `Invoice_${orderNumber}`, path: `${directory}/temporary/Invoice_${orderNumber}.pdf`, contentType: "application/pdf" }];
  const transporter = nodemailer.createTransport({ service: process.env.EMAIL_SERVICE, auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });
  transporter.sendMail(options);
};

const getEmailData = (type, orderNumber = null) => {
  switch (type) {
    case "confirmation":
      return { subject: "MyShop - Confirm registration", path: "/templates/email/confirmation.html" };
    case "resetPassword":
      return { subject: "MyShop - Reset password", path: "/templates/email/resetPassword.html" };
    case "username":
      return { subject: "MyShop - Retrieve username", path: "/templates/email/username.html" };
    case "invoice":
      return { subject: `MyShop - Invoice #${orderNumber}`, path: "/templates/email/invoice.html" };
    case "orderDispatched":
      return { subject: `MyShop - Order #${orderNumber} dispatched`, path: "/templates/email/orderDispatched.html" };
    case "contact":
      return { subject: "MyShop - Contact", path: "/templates/email/contact.html" };
    default:
      return;
  }
};
