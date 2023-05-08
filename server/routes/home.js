import * as fs from "fs";
import HomeSettings from "../models/homeSettings.js";
import { createImageObject } from "../utilities/scripts.js";
import { validObjectId, isEmpty } from "../utilities/validations.js";

export const getHomeSettings = async (request, response) => {
  const homeSettings = await HomeSettings.findOne();
  if (!isEmpty(homeSettings)) {
    return response.status(200).json(homeSettings).end();
  } else {
    return response.status(200).json({ _id: "", message: "", images: [] }).end();
  }
};

export const saveHomeSettings = async (request, response) => {
  const { homeSettingsId, message } = request.body;
  const images = request.files;
  let imagesObjects = [];
  if (images && images.length && images.length < 5) {
    images.forEach((image) => {
      const imageObject = createImageObject(image);
      try { fs.unlinkSync(image.path); } catch (error) {}
      imagesObjects = [...imagesObjects, imageObject];
    });
  }
  if (validObjectId(homeSettingsId)) {
    const update = { message, images: imagesObjects };
    const options = { new: true };
    const homeSettings = await HomeSettings.findByIdAndUpdate(homeSettingsId, update, options);
    if (!isEmpty(homeSettings)) {
      return response.status(200).json({ _id: homeSettingsId }).end();
    } else {
      return response.status(400).json({ errors: "The provided home settings do not exist!" }).end();
    }
  } else {
    const foundHomeSettings = await HomeSettings.find();
    if (!foundHomeSettings.length) {
      const newHomeSettings = new HomeSettings({ message, images: imagesObjects });
      const homeSettings = await newHomeSettings.save();
      const { _id } = homeSettings;
      return response.status(200).json({ _id }).end();
    } else {
      return response.status(409).json({ errors: "Home settings" }).end();
    }
  }
};
