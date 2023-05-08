import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import style from "./FieldLayout.module.css";

const SelectLayout = (props) => {
  const changeValue = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <Box className={`${style.field} ${style.select}`}>
      <FormControl fullWidth>
        <InputLabel id="select">{props.label}</InputLabel>
        <Select 
          value={props.value || ""}
          labelId="select"
          label={props.label}
          error={props.error ? true : false}
          onChange={changeValue}
        >
          {props.options.map((option) => 
            <MenuItem key={option._id} value={option}>{option.title}</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectLayout;
