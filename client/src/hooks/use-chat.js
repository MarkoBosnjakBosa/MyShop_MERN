import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../utilities/authentication";
import socketIOClient from "socket.io-client";

const useChat = (hasPermission, chatId = null) => {
  const { userId, username } = getUserData();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAdministratorOnline, setIsAdministratorOnline] = useState(false);
  const [typing, setTyping] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = socketIOClient(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`, { query: { chatId } });
    socketRef.current.emit("connecting", { userId, hasPermission, username });

    socketRef.current.on("administratorOnline", (data) => {
      const { hasPermission } = data;
      if (hasPermission) {
        const { users, messages = [] } = data;
        setUsers(users);
        setMessages(messages);
      } else {
        setIsAdministratorOnline(true);
      }
    });

    socketRef.current.on("userOnline", (data) => {
      const { hasPermission } = data;
      if (hasPermission) {
        const { user } = data;
        setUsers((previousUsers) => {
          const foundIndex = previousUsers.findIndex((previousUser) => previousUser.userId === user.userId);
          if (foundIndex > -1) {
            previousUsers[foundIndex].socketId = user.socketId;
          } else {
            previousUsers = [...previousUsers, user];
          }
          return [...previousUsers];
        });
      } else {
        const { isAdministratorOnline, messages } = data;
        setMessages(messages);
        setIsAdministratorOnline(isAdministratorOnline);
      }
    });

    socketRef.current.on("administratorOffline", () => {
      setTyping("");
      setIsAdministratorOnline(false);
    });

    socketRef.current.on("userOffline", (data) => {
      setTyping("");
      const { userId } = data;
      setUsers((previousUsers) => {
        previousUsers = previousUsers.filter((user) => user.userId !== userId);
        return [...previousUsers];
      });
    });

    socketRef.current.on("messageSent", (data) => {
      const { currentChatId, message } = data;
      if (currentChatId === chatId) {
        setMessages((previousMessages) => {
          return [...previousMessages, message];
        });
      }
    });

    socketRef.current.on("messageDeleted", (data) => {
      const { currentChatId, messageId } = data;
      if (currentChatId === chatId) {
        setMessages((previousMessages) => {
          previousMessages = previousMessages.filter((message) => message._id !== messageId);
          return [...previousMessages];
        });
      }
    });

    socketRef.current.on("typingStarted", (data) => {
      const { currentChatId, username } = data;
      if (currentChatId === chatId) {
        setTyping(username);
      }
    });

    socketRef.current.on("typingStopped", (data) => {
      const { currentChatId } = data;
      if (currentChatId === chatId) {
        setTyping("");
      }
    });

    socketRef.current.on("closeTab", () => {
      navigate("/pageNotFound");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId, userId, username, hasPermission, navigate]);

  const sendMessage = (text) => {
    socketRef.current.emit("sendMessage", { chatId, userId, username, hasPermission, text });
  };

  const deleteMessage = (messageId) => {
    socketRef.current.emit("deleteMessage", { chatId, hasPermission, messageId });
  };

  const startTyping = () => {
    socketRef.current.emit("startTyping", { chatId, hasPermission, username });
  };

  const stopTyping = () => {
    socketRef.current.emit("stopTyping", { chatId, hasPermission });
  };

  return {
    users,
    messages,
    isAdministratorOnline,
    typing,
    sendMessage,
    deleteMessage,
    startTyping,
    stopTyping
  };
};

export default useChat;
