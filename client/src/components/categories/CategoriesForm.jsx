import { useState } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { validTitle, validIcon } from "../../utilities/validations";
import TextLayout from "../layouts/TextLayout";
import MessageLayout from "../layouts/MessageLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import CheckIcon from "@mui/icons-material/Check";
import ImageIcon from "@mui/icons-material/Image";
import style from "./Categories.module.css";

const CategoriesForm = (props) => {
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
  const {
    value: icon,
    isValid: iconIsValid,
    error: iconError,
    changeValue: changeIcon,
    blur: blurIcon,
    resetValue: resetIcon
  } = useInput(validIcon);

  const formIsValid = titleIsValid && iconIsValid;

  const completeCreation = (newCategory) => {
    resetTitle();
    resetIcon();
    props.onCompleteCreation(newCategory);
    setIsCreated(true);
  };

  const createCategory = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/createCategory`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title, icon })
      },
      completeCreation
    );
  };

  return (
    <>
      {isCreated && (
        <MessageLayout type="success" closeable onClose={() => setIsCreated(false)}>
          Category has been successfully created!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <form onSubmit={createCategory} noValidate>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextLayout type="text" value={title} label="Title" error={titleError} onChange={changeTitle} onBlur={blurTitle} required>
                <SubtitlesIcon />
              </TextLayout>
            </Grid>
            <Grid item xs={6}>
              <TextLayout type="text" value={icon} label="Icon" error={iconError} onChange={changeIcon} onBlur={blurIcon} required>
                <ImageIcon />
              </TextLayout>
            </Grid>
          </Grid>
          <div className={`${style.create} ${style.center}`}>
            <Button type="submit" variant="contained" endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : "Create"}</Button>
          </div>
        </Box>
      </form>
    </>
  );
};

export default CategoriesForm;
