import * as mongoose from "mongoose";

const messageScheme = new mongoose.Schema({
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Number, required: true }
});

const Message = mongoose.model("Message", messageScheme);

export default Message;
