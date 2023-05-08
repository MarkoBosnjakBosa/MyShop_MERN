import { useState } from "react";
import constants from "../../utilities/constants";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import style from "./FieldLayout.module.css";

const TextLayout = (props) => {
  const [type, setType] = useState(props.type);

  const togglePassword = () => {
    setType((previousType) => {
      if (previousType === "password") {
        return "text";
      } else {
        return "password";
      }
    });
  };

  const checkForbiddenNumberSymbols = (event) => {
    if (type === "number") {
      if (constants.FORBIDDEN_NUMBER_SYMBOLS.includes(event.key)) {
        event.preventDefault();
      }
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <TextField
        type={type}
        value={props.value}
        label={props.label}
        helperText={props.error ? `Please provide a valid ${props.label.toLowerCase()}!` : ""}
        error={props.error ? true : false}
        multiline={props.multiline}
        InputProps={(props.label.toLowerCase() === "password") ? {
          startAdornment: (
            <InputAdornment position="start">
              {props.children}
            </InputAdornment>
          ),
          endAdornment: (
            <Tooltip title="Password has to have at least 8 characters, including uppercase and lowercase letters, digits and special characters.">
              <InputAdornment position="end">
                <IconButton onClick={togglePassword} onMouseDown={(event) => event.preventDefault()}>
                  {type === "password" ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            </Tooltip>
          )
        } : {
          startAdornment: (
            <InputAdornment position="start">
              {props.children}
              {(props.label.toLowerCase() === "mobile number") && (<AddIcon />)}
            </InputAdornment>
          )
        }}
        variant="standard"
        className={style.field}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onKeyDown={checkForbiddenNumberSymbols}
        disabled={props.disabled}
        required={props.required}
      />
    </Box>
  );
};

export default TextLayout;
