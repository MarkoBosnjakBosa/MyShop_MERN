import { useEffect } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validEmail, validName, validMobileNumber } from "../../utilities/validations";
import constants from "../../utilities/constants";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Profile.module.css";

const AccountForm = (props) => {
  const account = props.account;
  const { token, userId, username } = getUserData();

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: email,
    isValid: emailIsValid,
    error: emailError,
    changeValue: changeEmail,
    initializeValue: initializeEmail,
    blur: blurEmail
  } = useInput(validEmail);
  const {
    value: firstName,
    isValid: firstNameIsValid,
    error: firstNameError,
    changeValue: changeFirstName,
    initializeValue: initializeFirstName,
    blur: blurFirstName
  } = useInput(validName);
  const {
    value: lastName,
    isValid: lastNameIsValid,
    error: lastNameError,
    changeValue: changeLastName,
    initializeValue: initializeLastName,
    blur: blurLastName
  } = useInput(validName);
  const {
    value: mobileNumber,
    isValid: mobileNumberIsValid,
    error: mobileNumberError,
    changeValue: changeMobileNumber,
    initializeValue: initializeMobileNumber,
    blur: blurMobileNumber
  } = useInput(validMobileNumber);

  useEffect(() => {
    initializeEmail(account.email);
    initializeFirstName(account.firstName);
    initializeLastName(account.lastName);
    initializeMobileNumber(account.mobileNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formIsValid = emailIsValid && firstNameIsValid && lastNameIsValid && mobileNumberIsValid;

  const completeEdit = () => {
    props.onCompleteEdit({ type: constants.ACCOUNT, account: { email, firstName, lastName, mobileNumber } });
  };

  const editAccount = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/editAccount`,
        method: "PUT",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ userId, account: { email, firstName, lastName, mobileNumber } })
      },
      completeEdit
    );
  };

  const switchForm = () => {
    props.onSwitchForm(1);
  };

  return (
    <>
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <h1>Account</h1>
      <form onSubmit={editAccount} noValidate>
        <TextLayout type="text" value={username || ""} label="Username" disabled>
          <PersonIcon />
        </TextLayout>
        <TextLayout type="text" value={email} label="Email" error={emailError} onChange={changeEmail} onBlur={blurEmail} required>
          <EmailIcon />
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
        <Button type="submit" variant="contained" className={`${style.leftButton} ${style.action}`} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Edit"}</Button>
        <Button type="button" variant="contained" color="secondary" className={`${style.rightButton} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={switchForm}>Address</Button>
      </form>
    </>
  );
};

export default AccountForm;
