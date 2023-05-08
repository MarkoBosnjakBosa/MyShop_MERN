import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LaunchIcon from "@mui/icons-material/Launch";
import style from "./Actions.module.css";

const Link = (props) => {
  const page = props.page;
  const isButton = props.isButton;
  const navigate = useNavigate();

  const openPage = () => {
    navigate(page);
  };

  return (
    <>
      {isButton ? (
        <Button type="button" variant="contained" className={style.action} endIcon={<LaunchIcon />} onClick={openPage}>Open</Button>
      ) : (
        <LaunchIcon className={style.action} onClick={openPage} />
      )}
    </>
  );
};

export default Link;
