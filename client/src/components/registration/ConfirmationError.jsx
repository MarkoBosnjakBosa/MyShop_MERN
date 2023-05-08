import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendUserInfo } from "../../api/api";
import Navigation from "../navigation/Navigation";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import style from "./Registration.module.css";

const ConfirmationError = () => {
  const [isSent, setIsSent] = useState(false);
  const [search] = useSearchParams();
  const userId = search.get("userId");

  const requestConfirmationEmail = async () => {
    const data = {
      isLoggedIn: false,
      url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/sendConfirmationEmail`,
      method: "PUT",
      body: { userId }
    }
    setIsSent(await sendUserInfo(data));
  };

  return (
    <>
      <Navigation />
      <div className={style.confirmation}>
        {isSent && (
          <MessageLayout type="success">
            Confirmation email sent!
          </MessageLayout>
        )}
        {!isSent && (
          <MessageLayout type="error">
            <div>Your registration could not be confirmed!</div>
            <div>Please request a new confirmation email!</div>
          </MessageLayout>
        )}
        <Button type="button" variant="contained" color="secondary" endIcon={<EmailIcon />} onClick={requestConfirmationEmail}>Send confirmation email</Button>
      </div>
    </>
  );
};

export default ConfirmationError;
