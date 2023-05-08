import { useEffect } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validStreet, validHouseNumber, validCity, validZipCode, validCountry } from "../../utilities/validations";
import constants from "../../utilities/constants";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import style from "./Profile.module.css";

const AddressForm = (props) => {
  const address = props.address;
  const { token, userId } = getUserData();

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

  useEffect(() => {
    initializeStreet(address.street);
    initializeHouseNumber(address.houseNumber);
    initializeCity(address.city);
    initializeZipCode(address.zipCode);
    initializeCountry(address.country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formIsValid = streetIsValid && houseNumberIsValid && cityIsValid && zipCodeIsValid && countryIsValid;

  const completeEdit = () => {
    props.onCompleteEdit({ type: constants.ADDRESS, address: { street, houseNumber, city, zipCode, country } });
  };

  const editAddress = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/editAddress`,
        method: "PUT",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ userId, address: { street, houseNumber, city, zipCode, country } })
      },
      completeEdit
    );
  };

  const switchForm = () => {
    props.onSwitchForm(0);
  };

  return (
    <>
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <h1>Address</h1>
      <form onSubmit={editAddress} noValidate>
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
        <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action}`} startIcon={<ArrowBackIosIcon />} onClick={switchForm}>Account</Button>
        <Button type="submit" variant="contained" className={`${style.rightButton} ${style.action}`} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Edit"}</Button>
      </form>
    </>
  );
};

export default AddressForm;
