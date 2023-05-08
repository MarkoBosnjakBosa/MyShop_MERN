import { useState, useEffect, useCallback } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { validObject, validName, validEmail, validMobileNumber, validDescription } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import Button from "@mui/material/Button";
import CreateIcon from "@mui/icons-material/Create";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import MessageIcon from "@mui/icons-material/Message";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Contacts.module.css";

const Contact = (props) => {
  const contactSettings = props.contactSettings;
  const account = props.account;
  const { isLoaded } = useJsApiLoader({ id: "googleMaps", googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
  const [isSaved, setIsSaved] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [tab, setTab] = useState(0);

  const { isLoading, error, sendRequest } = useHttp();
  const { 
    value: firstName,
    isValid: firstNameIsValid,
    error: firstNameError,
    changeValue: changeFirstName,
    initializeValue: initializeFirstName,
    blur: blurFirstName,
    resetValue: resetFirstName
  } = useInput(validName);
  const {
    value: lastName,
    isValid: lastNameIsValid,
    error: lastNameError,
    changeValue: changeLastName,
    initializeValue: initializeLastName,
    blur: blurLastName,
    resetValue: resetLastName
  } = useInput(validName);
  const {
    value: email,
    isValid: emailIsValid,
    error: emailError,
    changeValue: changeEmail,
    initializeValue: initializeEmail,
    blur: blurEmail,
    resetValue: resetEmail
  } = useInput(validEmail);
  const {
    value: mobileNumber,
    isValid: mobileNumberIsValid,
    error: mobileNumberError,
    changeValue: changeMobileNumber,
    initializeValue: initializeMobileNumber,
    blur: blurMobileNumber,
    resetValue: resetMobileNumber
  } = useInput(validMobileNumber);
  const {
    value: message,
    isValid: messageIsValid,
    error: messageError,
    changeValue: changeMessage,
    blur: blurMessage,
    resetValue: resetMessage
  } = useInput(validDescription);

  useEffect(() => {
    if (validObject(account)) {
      initializeFirstName(account.firstName);
      initializeLastName(account.lastName);
      initializeEmail(account.email);
      initializeMobileNumber(account.mobileNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const formIsValid = firstNameIsValid && lastNameIsValid && emailIsValid && mobileNumberIsValid && messageIsValid;

  const completeSaving = () => {
    if (!validObject(account)) {
      resetFirstName();
      resetLastName();
      resetEmail();
      resetMobileNumber();
    }
    resetMessage();
    setIsSaved(true);
  };

  const saveContact = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/saveContact`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, mobileNumber, message })
      },
      completeSaving
    );
  };

  const loadGoogleMaps = useCallback((map) => {
    map.setZoom(10);
    setTimeout(() => {
      const removableElements = document.querySelectorAll("#map div[style*='background-color: white']");
      removableElements.forEach((removableElement) => removableElement.remove());
    }, Number(process.env.REACT_APP_GOOGLE_MAPS_EXPIRATION_TIME));
  }, []);

  return (
    <>
      <h1 className={style.center}>Contact</h1>
      {(tab === 0) && (
        <div className={`${style.form} ${style.position}`}>
          {isSaved && (
            <MessageLayout type="success" closeable onClose={() => setIsSaved(false)}>
              Your message has been successfully submitted!
            </MessageLayout>
          )}
          {error && (
            <MessageLayout type="error">
              <div>Request failed!</div>
              <strong>{error}</strong>
            </MessageLayout>
          )}
          <form onSubmit={saveContact} noValidate>
            <TextLayout type="text" value={firstName} label="First name" error={firstNameError} onChange={changeFirstName} onBlur={blurFirstName} required>
              <CreateIcon />
            </TextLayout>
            <TextLayout type="text" value={lastName} label="Last name" error={lastNameError} onChange={changeLastName} onBlur={blurLastName} required>
              <CreateIcon />
            </TextLayout>
            <TextLayout type="text" value={email} label="Email" error={emailError} onChange={changeEmail} onBlur={blurEmail} required>
              <EmailIcon />
            </TextLayout>
            <TextLayout type="text" value={mobileNumber} label="Mobile number" error={mobileNumberError} onChange={changeMobileNumber} onBlur={blurMobileNumber} required>
              <CallIcon />
            </TextLayout>
            <TextLayout type="text" value={message} label="Message" error={messageError} multiline onChange={changeMessage} onBlur={blurMessage} required>
              <MessageIcon />
            </TextLayout>
            <Button type="submit" variant="contained" className={`${style.leftButton} ${style.action}`} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Save"}</Button>
            <Button type="button" variant="contained" color="secondary" className={`${style.rightButton} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(1)}>Next</Button>
          </form>
        </div>
      )}
      {((tab === 1) && isLoaded) && (
        <div className={`${style.contact} ${style.position} ${style.center}`}>
          <div id="map">
            <GoogleMap center={contactSettings.coordinates} mapContainerStyle={{ height: "500px", maxWidth: "800px" }} onLoad={loadGoogleMaps}>
              <Marker position={contactSettings.coordinates} title={(contactSettings.street && contactSettings.houseNumber && contactSettings.city && contactSettings.zipCode && contactSettings.country) ? `${contactSettings.street} ${contactSettings.houseNumber}, ${contactSettings.zipCode} ${contactSettings.city}, ${contactSettings.country}`: "MyShop"} onClick={() => setIsDisplayed(true)} />
              {isDisplayed && (
                <InfoWindow position={contactSettings.coordinates}>
                  <div onClick={() => setIsDisplayed(false)}>
                    <style dangerouslySetInnerHTML={{ __html: "button.gm-ui-hover-effect { visibility: hidden }"}} />
                    <h3 className={style.center}>MyShop</h3>
                    {(contactSettings.street && contactSettings.houseNumber && contactSettings.city && contactSettings.zipCode && contactSettings.country) && (
                      `${contactSettings.street} ${contactSettings.houseNumber}, ${contactSettings.zipCode} ${contactSettings.city}, ${contactSettings.country}`
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
          <div>
            <h3>MyShop</h3>
            {(contactSettings.street && contactSettings.houseNumber && contactSettings.city && contactSettings.zipCode && contactSettings.country) && (
              <div className={style.space}>
                Address: <strong>{contactSettings.street} {contactSettings.houseNumber}, {contactSettings.zipCode} {contactSettings.city}, {contactSettings.country}</strong>
              </div>
            )}
            {contactSettings.email && (
              <div className={style.space}>
                Email: <strong><a href={`mailto:${contactSettings.email}`} className={style.link}>{contactSettings.email}</a></strong>
              </div>
            )}
            {contactSettings.mobileNumber && (
              <div className={style.space}>
                Mobile number: <strong><a href={`tel:+${contactSettings.mobileNumber}`} className={style.link}>+{contactSettings.mobileNumber}</a></strong>
              </div>
            )}
          </div>
          <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action}`} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(0)}>Back</Button>
        </div>
      )}
    </>
  );
};

export default Contact;
