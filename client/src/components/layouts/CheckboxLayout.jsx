import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const CheckboxLayout = (props) => {
  const checked = props.checked;
  const label = props.label;

  return (
    <FormControlLabel control={<Checkbox checked={checked} />} label={label} onChange={props.onChange} />
  );
};

export default CheckboxLayout;
