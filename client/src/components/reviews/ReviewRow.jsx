import { getUserData } from "../../utilities/authentication";
import constants from "../../utilities/constants";
import Delete from "../actions/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import style from "./Reviews.module.css";

const ReviewRow = (props) => {
  const review = props.review;
  const isLoggedIn = props.isLoggedIn;
  const { userId } = getUserData();

  const completeDeletion = () => {
    props.onLoadReviews(1);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={`${style.left} ${style.text}`}><i>{review.username}</i></Typography>
        <Typography className={style.right}>{new Date(review.date).toLocaleString("de-DE", constants.DATE_TIME_FORMAT)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className={style.text}>{review.text}</Typography>
        {(isLoggedIn && (review.userId === userId)) && (
          <Typography className={`${style.delete} ${style.center}`}>
            <Delete route={`/deleteReview/${review._id}/${userId}`} message="Delete selected review?" onCompleteDeletion={completeDeletion} />
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ReviewRow;
