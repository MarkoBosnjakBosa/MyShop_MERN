import constants from "../../utilities/constants";
import Email from "../actions/Email";
import Call from "../actions/Call";
import Delete from "../actions/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import style from "./Contacts.module.css";

const ContactRow = (props) => {
  const contact = props.contact;
  const DATE_TIME_FORMAT = constants.DATE_TIME_FORMAT;

  const completeDeletion = () => {
    props.onCompleteDeletion(contact._id);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={`${style.left} ${style.text}`}><i>{contact.email}</i></Typography>
        <Typography className={style.right}>{new Date(contact.date).toLocaleString("de-DE", DATE_TIME_FORMAT)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <Typography><strong>{contact.firstName} {contact.lastName}</strong>
      </Typography>
        <Typography className={`${style.text} ${style.space}`}>{contact.message}</Typography>
        <Typography className={style.center}>
          <Email email={contact.email} name={`${contact.firstName} ${contact.lastName}`} date={new Date(contact.date).toLocaleString("de-DE", DATE_TIME_FORMAT)} />
          <Call mobileNumber={contact.mobileNumber} />
          <Delete route={`/deleteContact/${contact._id}`} message={`Delete contact ${contact.email}?`} isButton onCompleteDeletion={completeDeletion} />
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactRow;
