import ReactDOM from "react-dom";
import { getImage } from "../../utilities/scripts";
import Box from "@mui/material/Box";
import style from "./Modal.module.css";

const Backdrop = (props) => {
  return (
    <div className={`${style.backdrop} ${style.fixed}`} onClick={props.onManage} />
  );
};

const Image = (props) => {
  return (
    <Box src={getImage(props.image)} alt={props.title} component="img" className={`${style.image} ${style.fixed}`} />
  );
};

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onManage={props.onManage} />, document.getElementById("backdrop"))}
      {ReactDOM.createPortal(<Image image={props.image} title={props.title} />, document.getElementById("image"))}
    </>
  );
};

export default Modal;
