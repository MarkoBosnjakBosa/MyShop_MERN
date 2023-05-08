import TechnicalInformation from "../models/technicalInformation.js";
import Product from "../models/product.js";
import { isEmpty } from "../utilities/validations.js";

export const getTechnicalData = async (request, response) => {
  const technicalData = await TechnicalInformation.find();
  return response.status(200).json(technicalData).end();
};

export const createTechnicalInformation = async (request, response) => {
  const { title } = request.body;
  const newTechnicalInformation = new TechnicalInformation({ title });
  const technicalInformation = await newTechnicalInformation.save();
  return response.status(200).json(technicalInformation).end();
};

export const deleteTechnicalInformation = async (request, response) => {
  const { technicalInformationId } = request.params;
  const query = { "technicalData._id": technicalInformationId };
  const products = await Product.find(query);
  if (products.length) {
    return response.status(400).json({ errors: "There are existing products with the selected technical information!" }).end();
  } else {
    const technicalInformation = await TechnicalInformation.findByIdAndDelete(technicalInformationId);
    if (!isEmpty(technicalInformation)) {
      return response.status(200).send(true).end();
    } else {
      return response.status(400).json({ errors: "The provided technical information does not exist!" }).end();
    }
  }
};
