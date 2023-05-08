import { useState } from "react";
import constants from "../../utilities/constants";
import AccountForm from "./AccountForm";
import AddressForm from "./AddressForm";
import MessageLayout from "../layouts/MessageLayout";

const Profile = (props) => {
  const data = props.data;
  const [account, setAccount] = useState(data.account);
  const [address, setAddress] = useState(data.address);
  const [form, setForm] = useState(0);
  const [edited, setEdited] = useState("");
  const ACCOUNT = constants.ACCOUNT;

  const completeEdit = (data) => {
    const { type } = data;
    if (type === ACCOUNT) {
      setAccount(data.account);
      setEdited(ACCOUNT);
    } else {
      setAddress(data.address);
      setEdited(constants.ADDRESS);
    }
  };

  return (
    <>
      {edited && (
        <MessageLayout type="success" closeable onClose={() => setEdited("")}>
          Your {edited} has been successfully edited!
        </MessageLayout>
      )}
      {(form === 0) && (
        <AccountForm account={account} onCompleteEdit={completeEdit} onSwitchForm={(number) => setForm(number)} />
      )}
      {(form === 1) && (
        <AddressForm address={address} onCompleteEdit={completeEdit} onSwitchForm={(number) => setForm(number)} />
      )}
    </>
  );
};

export default Profile;
