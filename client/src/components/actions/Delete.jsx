import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "./Actions.module.css";

const Delete = (props) => {
  const route = props.route;
  const message = props.message;
  const isButton = props.isButton;
  const { token } = getUserData();

  const deleteValue = async () => {
    const confirmed = window.confirm(message);
    if (confirmed) {
      const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}${route}`;
      const method = "DELETE";
      const headers = { Authentication: `Bearer ${token}` };
      const data = { url, method, headers };
      const response = await sendRequestData(data);
      if (response.errors) {
        window.alert(response.errors);
      } else {
        props.onCompleteDeletion();
      }
    }
  };

  return (
    <>
      {isButton ? (
        <Button type="button" variant="contained" color="error" className={style.action} endIcon={<DeleteIcon />} onClick={deleteValue}>Delete</Button>
      ) : (
        <DeleteIcon className={style.action} onClick={deleteValue} />
      )}
    </>
  );
};

export default Delete;
