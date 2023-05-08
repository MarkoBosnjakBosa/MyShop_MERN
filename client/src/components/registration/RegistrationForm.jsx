import { useState, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { validUsername, validEmail, validPassword, validName, validMobileNumber } from "../../utilities/validations";
import { loadScript } from "../../utilities/scripts";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CallIcon from "@mui/icons-material/Call";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import style from "./Registration.module.css";

const RegistrationForm = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    loadScript(`https://www.google.com/recaptcha/api.js`);
  }, []);

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: username,
    isValid: usernameIsValid,
    error: usernameError,
    changeValue: changeUsername,
    blur: blurUsername,
    resetValue: resetUsername
  } = useInput(validUsername);
  const {
    value: email,
    isValid: emailIsValid,
    error: emailError,
    changeValue: changeEmail,
    blur: blurEmail,
    resetValue: resetEmail
  } = useInput(validEmail);
  const {
    value: password,
    isValid: passwordIsValid,
    error: passwordError,
    changeValue: changePassword,
    blur: blurPassword,
    resetValue: resetPassword
  } = useInput(validPassword);
  const {
    value: firstName,
    isValid: firstNameIsValid,
    error: firstNameError,
    changeValue: changeFirstName,
    blur: blurFirstName,
    resetValue: resetFirstName
  } = useInput(validName);
  const {
    value: lastName,
    isValid: lastNameIsValid,
    error: lastNameError,
    changeValue: changeLastName,
    blur: blurLastName,
    resetValue: resetLastName
  } = useInput(validName);
  const {
    value: mobileNumber,
    isValid: mobileNumberIsValid,
    error: mobileNumberError,
    changeValue: changeMobileNumber,
    blur: blurMobileNumber,
    resetValue: resetMobileNumber
  } = useInput(validMobileNumber);

  const formIsValid = usernameIsValid && emailIsValid && passwordIsValid && firstNameIsValid && lastNameIsValid && mobileNumberIsValid;

  const completeRegistration = () => {
    resetUsername();
    resetEmail();
    resetPassword();
    resetFirstName();
    resetLastName();
    resetMobileNumber();
    window.grecaptcha.reset();
    setIsRegistered(true);
  };

  const registerUser = (event) => {
    event.preventDefault();
    const reCaptchaToken = window.grecaptcha.getResponse();
    if (!formIsValid || !reCaptchaToken) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/registration`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: { username, email, password, firstName, lastName, mobileNumber }, reCaptchaToken })
      },
      completeRegistration
    );
  };

  return (
    <>
      {isRegistered && (
        <MessageLayout type="success" closeable onClose={() => setIsRegistered(false)}>
          <div>User has been successfully registered!</div>
          <div>Please visit your inbox and confirm the registration!</div>
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={registerUser} noValidate>
        <TextLayout type="text" value={username} label="Username" error={usernameError} onChange={changeUsername} onBlur={blurUsername} required>
          <PersonIcon />
        </TextLayout>
        <TextLayout type="text" value={email} label="Email" error={emailError} onChange={changeEmail} onBlur={blurEmail} required>
          <EmailIcon />
        </TextLayout>
        <TextLayout type="password" value={password} label="Password" error={passwordError} onChange={changePassword} onBlur={blurPassword} required>
          <LockIcon />
        </TextLayout>
        <TextLayout type="text" value={firstName} label="First name" error={firstNameError} onChange={changeFirstName} onBlur={blurFirstName} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={lastName} label="Last name" error={lastNameError} onChange={changeLastName} onBlur={blurLastName} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={mobileNumber} label="Mobile number" error={mobileNumberError} onChange={changeMobileNumber} onBlur={blurMobileNumber} required>
          <CallIcon />
        </TextLayout>
        <div>
          <div className={`g-recaptcha ${style["g-recaptcha"]}`} data-sitekey={process.env.REACT_APP_RECAPTCHA_v2_SITE_KEY} />
        </div>
        <Button type="submit" variant="contained" className={style.action} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Register"}</Button>
      </form>
    </>
  );
};

export default RegistrationForm;
