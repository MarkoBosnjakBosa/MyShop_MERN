import TextLayout from "./TextLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import CreateIcon from "@mui/icons-material/Create";

const AccountLayout = (props) => {
  const account = props.account;

  return (
    <>
      <TextLayout type="text" value={account.username} label="Username" disabled>
        <PersonIcon />
      </TextLayout>
      <TextLayout type="text" value={account.email} label="Email" disabled>
        <EmailIcon />
      </TextLayout>
      <TextLayout type="text" value={account.firstName} label="First name" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={account.lastName} label="Last name" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={account.mobileNumber} label="Mobile number" disabled>
        <CallIcon />
      </TextLayout>
    </>
  );
};

export default AccountLayout;
