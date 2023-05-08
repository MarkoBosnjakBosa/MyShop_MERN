import * as mongoose from "mongoose";

const homeSettingsScheme = new mongoose.Schema({
  message: { type: String },
  images: [{ name: String, mimeType: String, buffer: Buffer }]
});

const HomeSettings = mongoose.model("HomeSettings", homeSettingsScheme);

export default HomeSettings;
