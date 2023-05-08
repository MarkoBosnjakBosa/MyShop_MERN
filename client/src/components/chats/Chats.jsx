import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/use-chat";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validUsername, validObject } from "../../utilities/validations";
import MessageLayout from "../layouts/MessageLayout";
import TextLayout from "../layouts/TextLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "./Chats.module.css";

const Chats = (props) => {
  const hasPermission = props.hasPermission;
  const { token } = getUserData();
  const [user, setUser] = useState({});
  const { users } = useChat(hasPermission);
  const navigate = useNavigate();

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: username,
    isValid: usernameIsValid,
    error: usernameError,
    changeValue: changeUsername,
    blur: blurUsername,
    resetValue: resetUsername
  } = useInput(validUsername);

  const completeSearch = (data) => {
    const { userId } = data;
    setUser({ userId, username });
    resetUsername();
  };

  const searchUser = (event) => {
    event.preventDefault();
    if (!usernameIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/searchUser/${username}`,
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" }
      },
      completeSearch
    );
  };

  const resetSearch = () => {
    setUser({});
    resetUsername();
  };

  const openChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className={style.chats}>
      <h1 className={style.center}>Chats</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <h3 className={style.center}>Online:</h3>
            <List>
              {users.map((user) => (
                <ListItem key={user.userId} secondaryAction={<LaunchIcon />} className={`${style.user} ${style.cursor} ${style.margin}`} onClick={() => openChat(user.userId)}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <h3 className={style.center}>Search:</h3>
            {error && (
              <MessageLayout type="error">
                <div>Request failed!</div>
                <strong>{error}</strong>
              </MessageLayout>
            )}
            <form onSubmit={searchUser} noValidate>
              <TextLayout type="text" value={username} label="Username" error={usernameError} onChange={changeUsername} onBlur={blurUsername} required>
                <SearchIcon />
              </TextLayout>
              <div className={style.center}>
                <Button type="submit" variant="contained" endIcon={<SearchIcon />} disabled={!usernameIsValid || isLoading}>{isLoading ? "Sending..." : "Search"}</Button>
                <Button type="button" variant="contained" color="error" className={style.space} endIcon={<DeleteIcon />} onClick={resetSearch}>Reset</Button>
              </div>
            </form>
            {(validObject(user) > 0) && (
              <ListItem secondaryAction={<LaunchIcon />} className={`${style.user} ${style.cursor} ${style.margin}`} onClick={() => openChat(user.userId)}>
                <ListItemText primary={user.username} />
              </ListItem>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Chats;
