import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { login } from "../../utilities/authentication";
import { getRememberMe, remember, forget } from "../../utilities/rememberMe";
import { validUsername, validPassword } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import CheckboxLayout from "../layouts/CheckboxLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import style from "./LoginForm.module.css";

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: username,
    isValid: usernameIsValid,
    error: usernameError,
    changeValue: changeUsername,
    initializeValue: initializeUsername,
    blur: blurUsername,
    resetValue: resetUsername
  } = useInput(validUsername);
  const {
    value: password,
    isValid: passwordIsValid,
    error: passwordError,
    changeValue: changePassword,
    blur: blurPassword,
    resetValue: resetPassword
  } = useInput(validPassword);

  useEffect(() => {
    const rememberMe = getRememberMe();
    const { username } = rememberMe;
    if (validUsername(username)) {
      setRememberMe(true);
      initializeUsername(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formIsValid = usernameIsValid && passwordIsValid;

  const completeLogin = (data) => {
    const { authentication, token, userId, username } = data;
    if (rememberMe) {
      remember(username);
    } else {
      forget();
    }
    login(token, userId, username);
    resetUsername();
    resetPassword();
    if (authentication) {
      navigate("/authentication");
    } else {
      navigate("/home");
    }
  };

  const loginUser = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      },
      completeLogin
    );
  };

  const changeRememberMe = (event) => {
    setRememberMe(event.target.checked);
  };

  const openCredentials = () => {
    navigate("/credentials");
  };

  return (
    <>
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={loginUser} noValidate>
        <TextLayout type="text" value={username} label="Username" error={usernameError} onChange={changeUsername} onBlur={blurUsername} required>
          <PersonIcon />
        </TextLayout>
        <TextLayout type="password" value={password} label="Password" error={passwordError} onChange={changePassword} onBlur={blurPassword} required>
          <LockIcon />
        </TextLayout>
        <div className={style.rememberMe}>
          <CheckboxLayout checked={rememberMe} label="Remember me?" onChange={changeRememberMe} />
        </div>
        <div className={style.credentials} onClick={openCredentials}>Forgot credentials?</div>
        <Button type="submit" variant="contained" className={`${style.submit} ${style.action}`} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Login"}</Button>
      </form>
    </>
  );
};

export default LoginForm;
