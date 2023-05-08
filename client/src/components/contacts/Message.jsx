import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utilities/authentication";
import "@fortawesome/fontawesome-free/css/all.css";
import style from "./Contacts.module.css";

const Message = (props) => {
  const mobileNumber = props.mobileNumber;
  const { userId } = getUserData();
  const navigate = useNavigate();

  const openChat = () => {
    navigate(`/chat/${userId}`);
  };

  const openApplication = (application) => {
    const link = (application === "whatsApp") ? "https://api.whatsapp.com/send?phone=" : "viber://chat?number=+";
    window.open(`${link}${mobileNumber}`, "_blank");
  };

  return (
    <>
      <i title="Chat" className={`fa-regular fa-comment fa-2x ${style.message} ${style.chat}`} onClick={openChat} />
      <i title="WhatsApp" className={`fa-brands fa-whatsapp fa-2x ${style.message} ${style.whatsApp}`} onClick={() => openApplication("whatsApp")} />
      <i title="Viber" className={`fa-brands fa-viber fa-2x ${style.message} ${style.viber}`} onClick={() => openApplication("viber")} />
    </>
  );
};

export default Message;
