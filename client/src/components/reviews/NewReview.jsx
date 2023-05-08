import { useState } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import { validDescription } from "../../utilities/validations";
import Rating from "./Rating";
import TextLayout from "../layouts/TextLayout";
import NotificationLayout from "../layouts/NotificationLayout";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import NotesIcon from "@mui/icons-material/Notes";
import style from "./Reviews.module.css";

const NewReview = (props) => {
  const productId = props.productId;
  const rating = props.rating;
  const total = props.total;
  const { token, userId, username } = getUserData();
  const [userRating, setUserRating] = useState(rating.usersRatings.filter((userRating) => userRating.userId === userId).map((userRating) => userRating.rating) || 0);
  const [displayed, setDisplayed] = useState("");

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: text,
    isValid: textIsValid,
    error: textError,
    changeValue: changeText,
    blur: blurText,
    resetValue: resetText
  } = useInput(validDescription);

  const completeWriting = () => {
    resetText();
    setDisplayed("review");
    props.onLoadReviews(1);
  };

  const writeReview = (event) => {
    event.preventDefault();
    if (!textIsValid) {
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/writeReview`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId, username, text })
      },
      completeWriting
    );
  };

  const rateProduct = async (rating) => {
    const confirmed = window.confirm(`Rate this product with a ${rating}?`);
    if (confirmed) {
      const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/rateProduct`;
      const method = "PUT";
      const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { productId, userId, rating };
      const data = { url, method, headers, body }; 
      const newRating = await sendRequestData(data);
      setDisplayed("rating");
      setUserRating(rating);
      props.onRateProduct(newRating);
    }
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={style.left}><strong>Write review</strong></Typography>
          <Typography className={style.right}>Total: {total}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Rating rating={userRating} onRate={rateProduct} />
          </Typography>
          <form onSubmit={writeReview} noValidate>
            <TextLayout type="text" value={text} label="Text" error={textError} multiline onChange={changeText} onBlur={blurText} required>
              <NotesIcon />
            </TextLayout>
            <Button type="submit" variant="contained" startIcon={<CheckIcon />} disabled={!textIsValid || isLoading}>{isLoading ? "Sending..." : "Write"}</Button>
          </form>
        </AccordionDetails>
      </Accordion>
      {displayed && (
        <NotificationLayout onClose={() => setDisplayed("")}>
          {(displayed === "rating") && (
            <>The product has been successfully rated.</>
          )}
          {(displayed === "review") && (
            <>The review has been successfully written.</>
          )}
        </NotificationLayout>
      )}
      {error && (
        <NotificationLayout isError>
          {error}
        </NotificationLayout>
      )}
    </>
  );
};

export default NewReview;
