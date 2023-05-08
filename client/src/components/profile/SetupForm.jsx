import { useState } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { sendUserInfo } from "../../api/api";
import { validToken } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LockClockIcon from "@mui/icons-material/LockClock";
import WarningIcon from '@mui/icons-material/Warning';
import CallIcon from "@mui/icons-material/Call";
import CheckIcon from "@mui/icons-material/Check";
import style from "./Profile.module.css";

const SetupForm = (props) => {
  const { token, userId } = getUserData();
  const [authenticationEnabled, setAuthenticationEnabled] = useState(props.authenticationEnabled);
  const [isSent, setIsSent] = useState(false);

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: authenticationEnablingToken,
    isValid: authenticationEnablingTokenIsValid,
    error: authenticationEnablingTokenError,
    changeValue: changeAuthenticationEnablingToken,
    blur: blurAuthenticationEnablingToken,
    resetValue: resetAuthenticationEnablingToken
  } = useInput(validToken);

  const completeManagement = (data) => {
    resetAuthenticationEnablingToken();
    setAuthenticationEnabled(data);
  };

  const manage = (type, event) => {
    event.preventDefault();
    if (type && !authenticationEnablingTokenIsValid) {
      return;
    }

    let body;
    if (type) {
      body = JSON.stringify({ userId, authenticationEnabled: type, authenticationEnablingToken });
    } else {
      const confirmed = window.confirm("Do you want to disable 2fa authentication?");
      if (confirmed) {
        body = JSON.stringify({ userId, authenticationEnabled: type });
      } else {
        return;
      }
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/setAuthentication`,
        method: "PUT",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body
      },
      completeManagement
    );
  };

  const requestAuthenticationEnablingToken = async () => {
    const data = {
      isLoggedIn: true,
      url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/sendAuthenticationEnablingToken`,
      method: "PUT",
      body: { userId }
    }
    setIsSent(await sendUserInfo(data));
  };

  return (
    <>
      <div className={style.authentication}>
        {authenticationEnabled ? (
          <Chip color="primary" label="Enabled" className={`${style.chip} ${style.width}`} />
        ) : (
          <Chip color="error" label="Disabled" className={`${style.chip} ${style.width}`} />
        )}
      </div>
      {isSent && (
        <MessageLayout type="success" closeable onClose={() => setIsSent(false)}>
          <div>Authentication token has been sent to your mobile phone!</div>
          <div>Please insert the token and enable the authentication!</div>
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      {authenticationEnabled ? (
        <div className={style.content}>
          <div>
            Disable 2fa authentication.<br />
            SMS authentication will not be required, when logging in.
          </div>
          <Button type="button" variant="contained" color="error" className={style.margin} endIcon={<WarningIcon />} onClick={(event) => manage(false, event)}>Disable</Button>
        </div>
      ) : (
        <div className={style.content}>
          <div>
            Enable 2fa authentication.<br />
            SMS authentication will be required, when logging in.
          </div>
          <div className={style.token}>
            <Button type="button" variant="contained" color="secondary" className={style.margin} endIcon={<CallIcon />} onClick={requestAuthenticationEnablingToken}>Send token</Button>
          </div>
          <form onSubmit={(event) => manage(true, event)} noValidate>
            <TextLayout type="text" value={authenticationEnablingToken} label="Token" error={authenticationEnablingTokenError} onChange={changeAuthenticationEnablingToken} onBlur={blurAuthenticationEnablingToken} required>
              <LockClockIcon />
            </TextLayout>
            <Button type="submit" variant="contained" className={`${style.rightButton} ${style.action}`} endIcon={<CheckIcon />} disabled={!authenticationEnablingTokenIsValid || isLoading}>{isLoading ? "Sending..." : "Enable"}</Button>
          </form>
        </div>
      )}
    </>
  );
};

export default SetupForm;
