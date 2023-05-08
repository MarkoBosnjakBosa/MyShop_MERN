import { getRating } from "../../utilities/scripts";
import StarRateIcon from "@mui/icons-material/StarRate";
import style from "./Reviews.module.css";

const Rating = (props) => {
  const rating = props.rating;
  const disabled = props.disabled;

  const getStyle = (star, rating) => {
    const rated = getRating(star, rating);
    if (rated) {
      if (!disabled) return `${style.icon} ${style.checked}`;
      else return style.checked;
    } else {
      if (!disabled) return style.icon;
      else return "";
    }
  };

  const rate = (rating) => {
    if (!disabled) {
      props.onRate(rating);
    }
  };

  return (
    <>
      <StarRateIcon className={getStyle(1, rating)} onClick={() => rate(1)} />
      <StarRateIcon className={getStyle(2, rating)} onClick={() => rate(2)} />
      <StarRateIcon className={getStyle(3, rating)} onClick={() => rate(3)} />
      <StarRateIcon className={getStyle(4, rating)} onClick={() => rate(4)} />
      <StarRateIcon className={getStyle(5, rating)} onClick={() => rate(5)} />
    </>
  );
};

export default Rating;
