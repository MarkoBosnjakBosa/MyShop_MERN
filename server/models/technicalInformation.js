import * as mongoose from "mongoose";

const technicalInformationScheme = new mongoose.Schema({
  title: { type: String, required: true }
});

const TechnicalInformation = mongoose.model("TechnicalInformation", technicalInformationScheme);

export default TechnicalInformation;
