import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import style from "./MessageLayout.module.css";

const MessageLayout = (props) => {
  const closeable = props.closeable;
  const type = props.type;

  const closeMessage = () => {
    props.onClose();
  };

  return (
    <>
      {closeable ? (
        <Alert severity={type} onClose={closeMessage} className={style.message}>
          <AlertTitle><strong>{type === "success" ? "Success" : "Error"}</strong></AlertTitle>
          {props.children}
        </Alert>
      ) : (
        <Alert severity={type} className={style.message}>
          <AlertTitle><strong>{type === "success" ? "Success" : "Error"}</strong></AlertTitle>
          {props.children}
        </Alert>
      )}
    </>
  );
};

export default MessageLayout;
