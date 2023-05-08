import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  );
});

const NotificationLayout = (props) => {
  const isError = props.isError;

  const closeNotification = () => {
    props.onClose();
  };

  return (
    <Snackbar open anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      {isError ? (
        <Alert severity="error" sx={{ width: "100%" }}>
          {props.children}
        </Alert>
      ) : (
        <Alert severity="success" sx={{ width: "100%" }} onClose={closeNotification}>
          {props.children}
        </Alert>
      )}
    </Snackbar>
  );
};

export default NotificationLayout;
