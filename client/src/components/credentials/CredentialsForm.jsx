import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { validEmail, validOption } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import style from "./Credentials.module.css";

const CredentialsForm = () => {
  const navigate = useNavigate();
  const [option, setOption] = useState("password");
  const [isSent, setIsSent] = useState(false);

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: email,
    isValid: emailIsValid,
    error: emailError,
    changeValue: changeEmail,
    blur: blurEmail,
    resetValue: resetEmail
  } = useInput(validEmail);

  const formIsValid = emailIsValid && validOption(option);

  const completeEmailSending = () => {
    setOption("password");
    resetEmail();
    setIsSent(true);
  };

  const sendEmail = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/credentials`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option, email })
      },
      completeEmailSending
    );
  };

  const openLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {isSent && (
        <MessageLayout type="success" closeable onClose={() => setIsSent(false)}>
          Please visit your inbox and follow suggested steps!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={sendEmail} noValidate>
        <FormControl>
          <FormLabel id="options" className={style.options}>Forgot:</FormLabel>
          <RadioGroup aria-labelledby="options" name="option" value={option} onChange={(event) => setOption(event.target.value)}>
            <FormControlLabel value="password" control={<Radio />} label="Password" />
            <FormControlLabel value="username" control={<Radio />} label="Username" />
            <FormControlLabel value="confirmationEmail" control={<Radio />} label="Confirmation email" />
          </RadioGroup>
        </FormControl>
        <TextLayout type="text" value={email} label="Email" error={emailError} onChange={changeEmail} onBlur={blurEmail} required>
          <EmailIcon />
        </TextLayout>
        <Button type="button" variant="contained" color="secondary" className={`${style.login} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={openLogin}>Login</Button>
        <Button type="submit" variant="contained" className={`${style.submit} ${style.action}`} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Submit"}</Button>
      </form>
    </>
  );
};

export default CredentialsForm;
