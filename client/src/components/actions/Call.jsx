import Button from "@mui/material/Button";
import CallIcon from "@mui/icons-material/Call";
import style from "./Actions.module.css";

const Call = (props) => {
  const mobileNumber = props.mobileNumber;  

  return (
    <Button type="button" href={`tel:+${mobileNumber}`} variant="contained" color="success" className={style.action} endIcon={<CallIcon />}>+{mobileNumber}</Button>
  );
};

export default Call;
