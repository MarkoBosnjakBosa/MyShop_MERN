import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/use-chat";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { getRequestData } from "../../api/api";
import { getImage } from "../../utilities/scripts";
import { validDescription, validObject } from "../../utilities/validations";
import constants from "../../utilities/constants";
import Modal from "../modals/Modal";
import TextLayout from "../layouts/TextLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import LoaderLayout from "../layouts/LoaderLayout";
import avatarImage from "../../assets/images/AvatarImage.jpg";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import style from "./Chats.module.css";

const Chat = (props) => {
  const chatId = props.chatId;
  const hasPermission = props.hasPermission;
  const { userId } = getUserData();
  const [title, setTitle] = useState("administrator");
  const [avatar, setAvatar] = useState({});
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isLoading, setIsLoading] = useState(hasPermission ? true : false);
  const { users, messages, isAdministratorOnline, typing, sendMessage, deleteMessage, startTyping, stopTyping } = useChat(hasPermission, chatId);
  const isUserOnline = hasPermission ? Boolean(users.find((user) => user.userId === chatId)) : false;
  const navigate = useNavigate();

  const {
    value: text,
    isValid: textIsValid,
    error: textError,
    changeValue: changeText,
    blur: blurText,
    resetValue: resetText
  } = useInput(validDescription);

  useEffect(() => {
    const loadData = async () => {
      const profile = await loader(chatId);
      if (validObject(profile)) {
        const { account, avatar } = profile;
        const { username } = account;
        setTitle(username);
        setAvatar(avatar);
        setIsLoading(false);
      } else {
        navigate("/pageNotFound");
      }
    };
    if (hasPermission) {
      loadData();
    }
  }, [chatId, hasPermission, navigate]);

  useEffect(() => {
    if (validDescription(text)) {
      startTyping();
    } else {
      stopTyping();
    }
  }, [text, startTyping, stopTyping]);

  useEffect(() => {
    scroll();
  }, [messages]);

  const newMessage = (event) => {
    event.preventDefault();
    if (!textIsValid) {
      return;
    }

    sendMessage(text);
    resetText();
  };

  const removeMessage = (messageId) => {
    const confirmed = window.confirm("Delete selected message?");
    if (confirmed) {
      deleteMessage(messageId);
    }
  };

  const openUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  const getDateAndTime = (date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const messageDay = new Date(date).setHours(0, 0, 0, 0);
    if (today === messageDay) {
      return new Date(date).toLocaleTimeString("de-DE", constants.TIME_FORMAT);
    } else {
      return new Date(date).toLocaleString("de-DE", constants.DATE_TIME_FORMAT);
    }
  };

  const scroll = () => {
    const messages = document.getElementById("messages");
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  };

  return (
    <>
      {(hasPermission && isLoading) ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        <>
          {isDisplayed && (
            <Modal image={avatar} title={avatar.name} onManage={() => setIsDisplayed(false)} />
          )}
          <div className={style.chats}>
            {title && (
              <h1 className={style.center}>
                {hasPermission ? (
                  validObject(avatar) ? (
                    <Box src={getImage(avatar)} alt={avatar.name} component="img" className={`${style.avatar} ${style.cursor}`} onClick={() => setIsDisplayed(true)} />
                  ) : (
                    <img src={avatarImage} alt="Avatar" className={style.avatar} />
                  )
                ) : (
                  "Chat with:"
                )} {title}
              </h1>
            )}
            <p className={style.center}>
              {hasPermission ? (
                <>
                  <span className={isUserOnline ? `${style.circle} ${style.online}` : `${style.circle} ${style.offline}`} />
                  <span className={style.space}><strong>{isUserOnline ? "Online" : "Offline"}</strong></span>
                </>
              ) : (
                <>
                  <span className={isAdministratorOnline ? `${style.circle} ${style.online}` : `${style.circle} ${style.offline}`} />
                  <span className={style.space}><strong>{isAdministratorOnline ? "Online" : "Offline"}</strong></span>
                </>
              )}
            </p>
            <div id="messages" className={style.messages}>
              {messages.length ? (
                messages.map((message) => (
                  <div key={message._id} className={(message.userId === userId) ? `${style.message} ${style.myself} ${style.right} ${style.arrowRight}` : `${style.message} ${style.left} ${style.arrowLeft}`}>
                    {hasPermission ? (
                      (message.userId === userId) ? (
                        <div className={`${style.username} ${style.position}`}><i>{message.username}</i></div>
                      ) : (
                        <div className={style.username} onClick={() => openUser(message.userId)}><i className={style.cursor}>{message.username}</i></div>
                      )
                    ) : (
                      <div className={(message.userId === userId) ? `${style.username} ${style.position}` : style.username}><i>{message.username}</i></div>
                    )}
                    <hr />
                    <p className={style.text}>{message.text}</p>
                    <hr />
                    {(message.userId === userId) && (
                      <div className={`${style.date} ${style.left}`}>
                        <HighlightOffIcon className={`${style.delete} ${style.cursor}`} onClick={() => removeMessage(message._id)} />
                      </div>
                    )}
                    <div className={(message.userId === userId) ? `${style.date} ${style.right}` : `${style.date} ${style.left}`}>{getDateAndTime(message.date)}</div>
                  </div>
                ))
              ) : (
                <EmptyValuesLayout message="No messages found!" />
              )}
            </div>
            {typing && (
              <div className={`${style.margin} ${style.center}`}>
                <strong>{typing}</strong> is typing...
              </div>
            )}
            {(hasPermission || (!hasPermission && isAdministratorOnline)) && (
              <>
                <hr />
                <form onSubmit={newMessage} noValidate>
                  <TextLayout type="text" value={text} label="Text" error={textError} multiline onChange={changeText} onBlur={blurText} required>
                    <DescriptionIcon />
                  </TextLayout>
                  <div className={style.center}>
                    <Button type="submit" variant="contained" endIcon={<CheckIcon />} disabled={!textIsValid}>Send</Button>
                    <Button type="button" variant="contained" color="secondary" className={style.space} endIcon={<ArrowDownwardIcon />} onClick={scroll}>Scroll</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Chat;

const loader = async (chatId) => {
  const { token } = getUserData();
  return await getRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getProfile/${chatId}`, headers: { Authentication: `Bearer ${token}` } });
};
