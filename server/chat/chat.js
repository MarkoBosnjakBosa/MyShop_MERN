import User from "../models/user.js";
import Message from "../models/message.js";
import { validUsername, validDescription, validObjectId, isEmpty } from "../utilities/validations.js";

const chat = (io) => {
  let administrator = {};
  let users = [];

  io.on("connection", (socket) => {
    socket.on("connecting", async ({ userId, hasPermission, username }) => {
      if (validObjectId(userId) && validUsername(username)) {
        if (hasPermission) {
          if (!isEmpty(administrator)) {
            socket.broadcast.to(administrator.socketId).emit("closeTab");
          }
          administrator = { socketId: socket.id, userId, username };
          users.forEach((user) => socket.broadcast.to(user.socketId).emit("administratorOnline", { hasPermission: false }));
        }
        const { chatId } = socket.handshake.query;
        if (validObjectId(chatId)) {
          const user = await User.findById(chatId);
          if (!isEmpty(user)) {
            const query = { chatId };
            const messages = await Message.find(query);
            if (hasPermission) {
              socket.emit("administratorOnline", { hasPermission: true, users, messages });
            } else {
              let isAdministratorOnline = false;
              if (!isEmpty(administrator)) {
                isAdministratorOnline = true;
              }
              socket.emit("userOnline", { hasPermission: false, isAdministratorOnline, messages });
              const foundIndex = users.findIndex((user) => user.userId === userId);
              if (foundIndex > -1) {
                socket.broadcast.to(users[foundIndex].socketId).emit("closeTab");
                users[foundIndex].socketId = socket.id;
                socket.broadcast.emit("userOnline", { hasPermission: true, user: users[foundIndex] });
              } else {
                const user = { socketId: socket.id, userId, username };
                users = [...users, user];
                socket.broadcast.emit("userOnline", { hasPermission: true, user });
              }
            }
          } else {
            socket.emit("closeTab");
          }
        } else {
          if (chatId && chatId !== "null") {
            socket.emit("closeTab");
          } else {
            if (hasPermission) {
              socket.emit("administratorOnline", { hasPermission, users });
            } else {
              socket.emit("closeTab");
            }
          }
        }
      } else {
        socket.emit("closeTab");
      }
    });

    socket.on("sendMessage", async ({ chatId, userId, username, hasPermission, text }) => {
      if (validObjectId(chatId) && validObjectId(userId) && validUsername(username) && validDescription(text)) {
        const date = new Date().getTime();
        const newMessage = new Message({ chatId, userId, username, text, date });
        const message = await newMessage.save();
        if (hasPermission) {
          const foundIndex = users.findIndex((user) => user.userId === chatId);
          if (foundIndex > -1) {
            socket.broadcast.to(users[foundIndex].socketId).emit("messageSent", { currentChatId: chatId, message });
          }
          socket.emit("messageSent", { currentChatId: chatId, message });
        } else {
          if (!isEmpty(administrator)) {
            socket.broadcast.to(administrator.socketId).emit("messageSent", { currentChatId: chatId, message });
          }
          socket.emit("messageSent", { currentChatId: chatId, message });
        }
      }
    });

    socket.on("deleteMessage", async ({ chatId, hasPermission, messageId }) => {
      if (validObjectId(chatId) && validObjectId(messageId)) {
        const query = { _id: messageId, chatId };
        const message = await Message.findOneAndDelete(query);
        if (!isEmpty(message)) {
          if (hasPermission) {
            const foundIndex = users.findIndex((user) => user.userId === chatId);
            if (foundIndex > -1) {
              socket.broadcast.to(users[foundIndex].socketId).emit("messageDeleted", { currentChatId: chatId, messageId });
            }
            socket.emit("messageDeleted", { currentChatId: chatId, messageId });
          } else {
            if (!isEmpty(administrator)) {
              socket.broadcast.to(administrator.socketId).emit("messageDeleted", { currentChatId: chatId, messageId });
            }
            socket.emit("messageDeleted", { currentChatId: chatId, messageId });
          }
        }
      }
    });

    socket.on("startTyping", ({ chatId, hasPermission, username }) => {
      if (validObjectId(chatId) && validUsername(username)) {
        const foundIndex = users.findIndex((user) => user.userId === chatId);
        if (foundIndex > -1) {
          if (hasPermission) {
            socket.broadcast.to(users[foundIndex].socketId).emit("typingStarted", { currentChatId: chatId, username });
          } else {
            socket.broadcast.to(administrator.socketId).emit("typingStarted", { currentChatId: chatId, username });
          }
        }
      }
    });

    socket.on("stopTyping", ({ chatId, hasPermission }) => {
      if (validObjectId(chatId)) {
        const foundIndex = users.findIndex((user) => user.userId === chatId);
        if (foundIndex > -1) {
          if (hasPermission) {
            socket.broadcast.to(users[foundIndex].socketId).emit("typingStopped", { currentChatId: chatId });
          } else {
            socket.broadcast.to(administrator.socketId).emit("typingStopped", { currentChatId: chatId });
          }
        }
      }
    });

    socket.on("userLeaving", () => socket.disconnect());

    socket.on("disconnect", () => {
      if (administrator.socketId === socket.id) {
        administrator = {};
        users.forEach((user) => socket.broadcast.to(user.socketId).emit("administratorOffline"));
      } else {
        const offlineUser = users.filter((user) => user.socketId === socket.id)[0];
        users = users.filter((user) => user.socketId !== socket.id);
        if (!isEmpty(administrator) && !isEmpty(offlineUser)) {
          socket.broadcast.to(administrator.socketId).emit("userOffline", { userId: offlineUser.userId });
        }
      }
    });
  });
};

export default chat;

export const searchUser = async (request, response) => {
  const { username } = request.params;
  const query = { "account.username": username };
  const user = await User.findOne(query);
  if (!isEmpty(user)) {
    const { _id } = user;
    return response.status(200).json({ userId: _id }).end();
  } else {
    return response.status(400).json({ errors: ["Username"] }).end();
  }
};
