import constants from "../utilities/constants.js";
import { EventEmitter } from "events";
import { Vonage } from "@vonage/server-sdk";

export const smsEvents = new EventEmitter();
smsEvents.on(constants.AUTHENTICATION_TOKEN_SMS_EVENT, (mobileNumber, firstName, authenticationToken) => {
  const text = `Dear ${firstName}, thank you for using MyShop. Your authentication token is: ${authenticationToken}. The authentication token is valid for the next 5 minutes.`;
  sendSms(mobileNumber, text);
});
smsEvents.on(constants.AUTHENTICATION_ENABLING_TOKEN_SMS_EVENT, (mobileNumber, firstName, authenticationEnablingToken) => {
  const text = `Dear ${firstName}, thank you for using MyShop. In order to enable authentication, please insert the following authentication token: ${authenticationEnablingToken}. The authentication token is valid for the next 5 minutes.`;
  sendSms(mobileNumber, text);
});

const sendSms = async (to, text) => {
  const from = "MyShop";
  const vonage = new Vonage({ apiKey: process.env.VONAGE_API_KEY, apiSecret: process.env.VONAGE_API_SECRET });
  await vonage.sms.send({ to, from, text });
};
