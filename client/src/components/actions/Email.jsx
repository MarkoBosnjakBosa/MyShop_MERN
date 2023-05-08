import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";

const Email = (props) => {
  const email = props.email;
  const name = props.name;
  const date = props.date;

  return (
    <Button type="button" href={`mailto:${email}?subject=MyShop - Answer to ${name} (${date})`} variant="contained" endIcon={<EmailIcon />}>Email</Button>
  );
};

export default Email;
