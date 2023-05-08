import { useState, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validCoordinate, validStreet, validHouseNumber, validCity, validZipCode, validCountry, validEmail, validMobileNumber } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ExploreIcon from "@mui/icons-material/Explore";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import style from "./Contacts.module.css";

const ContactSettings = (props) => {
  const contactSettings = props.contactSettings;
  const { token } = getUserData();
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [contactSettingsId, setContactSettingsId] = useState(contactSettings._id);
  const [isSaved, setIsSaved] = useState(false);

  const { isLoading, error, sendRequest } = useHttp();
  const { 
    value: street,
    isValid: streetIsValid,
    error: streetError,
    changeValue: changeStreet,
    initializeValue: initializeStreet,
    blur: blurStreet
  } = useInput(validStreet);
  const {
    value: houseNumber,
    isValid: houseNumberIsValid,
    error: houseNumberError,
    changeValue: changeHouseNumber,
    initializeValue: initializeHouseNumber,
    blur: blurHouseNumber
  } = useInput(validHouseNumber);
  const {
    value: city,
    isValid: cityIsValid,
    error: cityError,
    changeValue: changeCity,
    initializeValue: initializeCity,
    blur: blurCity
  } = useInput(validCity);
  const {
    value: zipCode,
    isValid: zipCodeIsValid,
    error: zipCodeError,
    changeValue: changeZipCode,
    initializeValue: initializeZipCode,
    blur: blurZipCode
  } = useInput(validZipCode);
  const {
    value: country,
    isValid: countryIsValid,
    error: countryError,
    changeValue: changeCountry,
    initializeValue: initializeCountry,
    blur: blurCountry
  } = useInput(validCountry);
  const {
    value: email,
    isValid: emailIsValid,
    error: emailError,
    changeValue: changeEmail,
    initializeValue: initializeEmail,
    blur: blurEmail
  } = useInput(validEmail);
  const {
    value: mobileNumber,
    isValid: mobileNumberIsValid,
    error: mobileNumberError,
    changeValue: changeMobileNumber,
    initializeValue: initializeMobileNumber,
    blur: blurMobileNumber
  } = useInput(validMobileNumber);

  useEffect(() => {
    setCoordinates(contactSettings.coordinates);
    initializeStreet(contactSettings.street);
    initializeHouseNumber(contactSettings.houseNumber);
    initializeCity(contactSettings.city);
    initializeZipCode(contactSettings.zipCode);
    initializeCountry(contactSettings.country);
    initializeEmail(contactSettings.email);
    initializeMobileNumber(contactSettings.mobileNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formIsValid = streetIsValid && houseNumberIsValid && cityIsValid && zipCodeIsValid && countryIsValid && emailIsValid && mobileNumberIsValid;

  const completeSaving = (data) => {
    setContactSettingsId(data._id);
    setIsSaved(true);
  };

  const saveContactSettings = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    if (!validCoordinate(coordinates.lat)) {
      coordinates.lat = 0;
      changeCoordinates("lat", 0);
    }
    if (!validCoordinate(coordinates.lng)) {
      coordinates.lng = 0;
      changeCoordinates("lng", 0);
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/saveContactSettings`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ contactSettingsId, coordinates, street, houseNumber, zipCode, city, country, email, mobileNumber })
      },
      completeSaving
    );
  };

  const changeCoordinates = (type, value) => {
    setCoordinates((previousCoordinates) => {
      return { ...previousCoordinates, [type]: value };
    });
  };

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        changeCoordinates("lat", position.coords.latitude);
        changeCoordinates("lng", position.coords.longitude);
      });
    }
  };

  return (
    <div className={`${style.settings} ${style.position} ${style.center}`}>
      <h1>Contact settings</h1>
      {isSaved && (
        <MessageLayout type="success" closeable onClose={() => setIsSaved(false)}>
          Contact settings have been successfully saved!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={saveContactSettings} noValidate>
        <TextLayout type="text" value={coordinates.lat} label="Latitude" onChange={(event) => changeCoordinates("lat", event.target.value)}>
          <KeyboardDoubleArrowRightIcon />
        </TextLayout>
        <TextLayout type="text" value={coordinates.lng} label="Longitude" onChange={(event) => changeCoordinates("lng", event.target.value)}>
          <KeyboardDoubleArrowUpIcon />
        </TextLayout>
        <TextLayout type="text" value={street} label="Street" error={streetError} onChange={changeStreet} onBlur={blurStreet} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={houseNumber} label="House number" error={houseNumberError} onChange={changeHouseNumber} onBlur={blurHouseNumber} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={city} label="City" error={cityError} onChange={changeCity} onBlur={blurCity} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={zipCode} label="ZIP code" error={zipCodeError} onChange={changeZipCode} onBlur={blurZipCode} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={country} label="Country" error={countryError} onChange={changeCountry} onBlur={blurCountry} required>
          <CreateIcon />
        </TextLayout>
        <TextLayout type="text" value={email} label="Email" error={emailError} onChange={changeEmail} onBlur={blurEmail} required>
          <EmailIcon />
        </TextLayout>
        <TextLayout type="text" value={mobileNumber} label="Mobile number" error={mobileNumberError} onChange={changeMobileNumber} onBlur={blurMobileNumber} required>
          <CallIcon />
        </TextLayout>
        <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action}`} endIcon={<ExploreIcon />} onClick={getCoordinates}>Coordinates</Button>
        <Button type="submit" variant="contained" className={`${style.rightButton} ${style.action}`}  endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Save"}</Button>
      </form>
    </div>
  );
};

export default ContactSettings;
