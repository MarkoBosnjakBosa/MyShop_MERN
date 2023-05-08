import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validPassword } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Credentials.module.css";

const ResetPasswordForm = (props) => {
  const data = props.data;
  const { isLoggedIn } = data;
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: password,
    isValid: passwordIsValid,
    error: passwordError,
    changeValue: changePassword,
    blur: blurPassword,
    resetValue: resetPassword
  } = useInput(validPassword);

  const completePasswordEdit = () => {
    resetPassword();
    setIsReset(true);
  };

  const editPassword = (event) => {
    event.preventDefault();
    if (!passwordIsValid) {
      return;
    }

    let url;
    let body;
    let headers;
    if (isLoggedIn) {
      url = "resetPasswordLoggedIn";
      const { userId, token } = getUserData();
      headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
      body = JSON.stringify({ userId, password });
    } else {
      url = "resetPasswordLoggedOut";
      headers = { "Content-Type": "application/json" };
      body = JSON.stringify({ userId: data.userId, resetPasswordToken: data.resetPasswordToken, password });
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/${url}`,
        method: "PUT",
        headers,
        body
      },
      completePasswordEdit
    );
  };

  const openLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {isReset && (
        <MessageLayout type="success" closeable onClose={() => setIsReset(false)}>
          Your password has been successfully reset!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={editPassword} noValidate>
        <TextLayout type="password" value={password} label="Password" error={passwordError} onChange={changePassword} onBlur={blurPassword} required>
          <LockIcon />
        </TextLayout>
        <Button type="submit" variant="contained" className={`${style.submit} ${style.action}`} endIcon={<CheckIcon />} disabled={!passwordIsValid || isLoading}>{isLoading ? "Sending..." : "Reset"}</Button>
        {!isLoggedIn && (
          <Button type="button" variant="contained" color="secondary" className={`${style.login} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={openLogin}>Login</Button>
        )}
      </form>
    </>
  );
};

export default ResetPasswordForm;
