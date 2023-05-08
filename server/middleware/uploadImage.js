import multer from "multer";
import { isModified } from "../utilities/validations.js";

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "temporary");
  },
  filename: (request, file, callback) => {
    let fileName = file.originalname;
    const modified = isModified(fileName);
    if (!modified) {
      const fileArray = fileName.split(".");
      fileName = `${fileArray[0]}_${Date.now()}.${fileArray[1]}`;
    }
    callback(null, fileName);
  }
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match("image.*")) {
      callback(null, true);
    } else {
      request.extensionValidationError = true;
      return callback(null, false, request.extensionValidationError);
    }
  }
});

export default uploadImage;
