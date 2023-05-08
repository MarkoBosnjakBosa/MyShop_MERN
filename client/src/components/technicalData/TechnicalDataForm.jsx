import { useState } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validTitle } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import CheckIcon from "@mui/icons-material/Check";
import style from "./TechnicalData.module.css";

const TechnicalDataForm = (props) => {
  const { token } = getUserData();
  const [isCreated, setIsCreated] = useState(false);

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: title,
    isValid: titleIsValid,
    error: titleError,
    changeValue: changeTitle,
    blur: blurTitle,
    resetValue: resetTitle
  } = useInput(validTitle);

  const completeCreation = (newTechnicalInformation) => {
    resetTitle();
    props.onCompleteCreation(newTechnicalInformation);
    setIsCreated(true);
  };

  const createTechnicalInformation = (event) => {
    event.preventDefault();
    if (!titleIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/createTechnicalInformation`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      },
      completeCreation
    );
  };

  return (
    <>
      {isCreated && (
        <MessageLayout type="success" closeable onClose={() => setIsCreated(false)}>
          Technical information has been successfully created!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={createTechnicalInformation} noValidate>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextLayout type="text" value={title} label="Title" error={titleError} onChange={changeTitle} onBlur={blurTitle} required>
                <SubtitlesIcon />
              </TextLayout>
            </Grid>
            <Grid item xs={6} className={style.create}>
              <Button type="submit" variant="contained" endIcon={<CheckIcon />} disabled={!titleIsValid || isLoading}>{isLoading ? "Sending..." : "Create"}</Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </>
  );
};

export default TechnicalDataForm;
