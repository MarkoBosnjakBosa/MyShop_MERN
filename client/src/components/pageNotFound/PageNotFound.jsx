import { Link } from "react-router-dom";
import MessageLayout from "../layouts/MessageLayout";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import style from "./PageNotFound.module.css";

const PageNotFound = (props) => {
  return (
    <div className={style.message}>
      <MessageLayout type="error">
        {props.children}
      </MessageLayout>
      <Link to="/home" className={style.link}>
        <Button type="button" variant="contained" endIcon={<HomeIcon />}>Home</Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
