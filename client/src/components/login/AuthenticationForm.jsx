import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { login } from "../../utilities/authentication";
import { sendUserInfo } from "../../api/api";
import { validToken } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import LockClockIcon from "@mui/icons-material/LockClock";
import CallIcon from "@mui/icons-material/Call";
import CheckIcon from "@mui/icons-material/Check";
import style from "./LoginForm.module.css";

const AuthenticationForm = (props) => {
  const userId = props.userId;
  const [isSent, setIsSent] = useState(null);
  const navigate = useNavigate();

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: authenticationToken,
    isValid: authenticationTokenIsValid,
    error: authenticationTokenError,
    changeValue: changeAuthenticationToken,
    blur: blurAuthenticationToken,
    resetValue: resetAuthenticationToken
  } = useInput(validToken);

  const completeAuthentication = (data) => {
    const { token, username } = data;
    login(token, userId, username);
    resetAuthenticationToken();
    navigate("/home");
  };

  const authenticate = (event) => {
    event.preventDefault();
    if (!authenticationTokenIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/authenticate`,
        method: "POST",
        headers: { "x-otp" : authenticationToken, "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      },
      completeAuthentication
    );
  };

  const requestAuthenticationToken = async () => {
    const data = {
      isLoggedIn: false,
      url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/sendAuthenticationToken`,
      method: "PUT",
      body: { userId }
    }
    resetAuthenticationToken();
    setIsSent(await sendUserInfo(data));
  };

  return (
    <>
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      {isSent && (
        <MessageLayout type="success" closeable onClose={() => setIsSent()}>
          The authentication token has been sccessfully sent!
        </MessageLayout>
      )}
      {(isSent === false) && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>The authentication token could not be sent!</strong>
        </MessageLayout>
      )}
      <form onSubmit={authenticate} noValidate>
        <TextLayout type="text" value={authenticationToken} label="Token" error={authenticationTokenError} onChange={changeAuthenticationToken} onBlur={blurAuthenticationToken} required>
          <LockClockIcon />
        </TextLayout>
        <Button type="button" variant="contained" color="secondary" className={`${style.token} ${style.action}`} endIcon={<CallIcon />} onClick={requestAuthenticationToken}>{isLoading ? "Sending..." : "Send token"}</Button>
        <Button type="submit" variant="contained" className={`${style.submit} ${style.action}`} endIcon={<CheckIcon />} disabled={!authenticationTokenIsValid || isLoading}>{isLoading ? "Sending..." : "Submit"}</Button>
      </form>
    </>
  );
};

export default AuthenticationForm;
