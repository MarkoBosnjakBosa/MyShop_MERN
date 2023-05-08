import { Link } from "react-router-dom";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Registration.module.css";

const ConfirmationSuccess = () => {
  return (
    <div className={style.confirmation}>
      <MessageLayout type="success">
        Your registration has been confirmed!
      </MessageLayout>
      <Link to="/login" className={style.link}>
        <Button type="button" variant="contained" color="secondary" endIcon={<ArrowForwardIosIcon />}>Login</Button>
      </Link>
    </div>
  );
};

export default ConfirmationSuccess;
