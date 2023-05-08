import ContactSettings from "../models/contactSettings.js";
import Contact from "../models/contact.js";
import { emailEvents } from "../events/emailEvents.js";
import { select } from "../utilities/scripts.js";
import { validObjectId, isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const getContactSettings = async (request, response) => {
  const contactSettings = await ContactSettings.findOne();
  if (!isEmpty(contactSettings)) {
    return response.status(200).json(contactSettings).end();
  } else {
    return response.status(200).json({ _id: "", coordinates: { lat: 0, lng: 0 }, street: "", houseNumber: 0, city: "", zipCode: 0, country: "", email: "", mobileNumber: "" }).end();
  }
};

export const saveContactSettings = async (request, response) => {
  const { contactSettingsId, coordinates, street, houseNumber, city, zipCode, country, email, mobileNumber } = request.body;
  if (validObjectId(contactSettingsId)) {
    const update = { coordinates, street, houseNumber, city, zipCode, country, email, mobileNumber };
    const options = { new: true };
    const contactSettings = await ContactSettings.findByIdAndUpdate(contactSettingsId, update, options);
    if (!isEmpty(contactSettings)) {
      return response.status(200).json({ _id: contactSettingsId }).end();
    } else {
      return response.status(400).json({ errors: "The provided contact settings do not exist!" }).end();
    }
  } else {
    const foundContactSettings = await ContactSettings.find();
    if (!foundContactSettings.length) {
      const newContactSettings = new ContactSettings({ coordinates, street, houseNumber, city, zipCode, country, email, mobileNumber });
      const contactSettings = await newContactSettings.save();
      const { _id } = contactSettings;
      return response.status(200).json({ _id }).end();
    } else {
      return response.status(409).json({ errors: "Contact settings" }).end();
    }
  }
};

export const getContacts = async (request, response) => {
  const { search, orderBy } = request.body;
  const page = Number(request.body.page) - 1;
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort } = select(constants.CONTACTS, search, null, orderBy);
  const contactsQuery = Contact.find(query).sort(sort).skip(skip).limit(limit);
  const totalQuery = Contact.find(query).countDocuments();
  const queries = [contactsQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ contacts: results[0], total, pagesNumber }).end();
};

export const saveContact = async (request, response) => {
  const { firstName, lastName, email, mobileNumber, message } = request.body;
  const date = new Date().getTime();
  const newContact = new Contact({ firstName, lastName, email, mobileNumber, message, date });
  await newContact.save();
  emailEvents.emit(constants.CONTACT_EMAIL_EVENT, email, firstName);
  return response.status(200).send(true).end();
};

export const deleteContact = async (request, response) => {
  const { contactId } = request.params;
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!isEmpty(contact)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided contact does not exist!" }).end();
  }
};
