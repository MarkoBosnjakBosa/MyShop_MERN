import { useState } from "react";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import { validTitle, validIcon } from "../../utilities/validations";
import Delete from "../actions/Delete";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "@fortawesome/fontawesome-free/css/all.css";
import style from "./Categories.module.css";

const CategoryRow = (props) => {
  const initialCategory = props.category;
  const index = props.index;
  const { token } = getUserData();
  const [category, setCategory] = useState(props.category);
  const [isEditing, setIsEditing] = useState(false);

  const changeCategory = (type, event) => {
    setCategory((previousCategory) => {
      return { ...previousCategory, [type]: event.target.value };
    });
  };

  const editCategory = async () => {
    if (validTitle(category.title) && validIcon(category.icon)) {
      const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/editCategory`;
      const method = "PUT";
      const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
      const data = { url, method, headers, body: category }; 
      const isEdited = await sendRequestData(data);
      if (isEdited) {
        props.onCompleteEdit(category);
        setIsEditing(false);
      }
    }
  };

  const completeDeletion = () => {
    props.onCompleteDeletion(category._id);
  };

  const manageEditing = (type) => {
    setIsEditing(type);
    if (type === false) {
      setCategory(initialCategory);
    }
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell align="right">
        {isEditing ? (
          <input type="text" value={category.title} className={style.field} onChange={(event) => changeCategory("title", event)} />
        ) : (
          category.title
        )}
      </TableCell>
      <TableCell align="right">
        {isEditing ? (
          <input type="text" value={category.icon} className={style.field} onChange={(event) => changeCategory("icon", event)} />
        ) : (
          <i className={category.icon} />
        )}
      </TableCell>
      <TableCell align="right">
        {isEditing ? (
          <>
            <CheckCircleOutlineIcon className={`${style.edit} ${style.action}`} onClick={editCategory} />
            <HighlightOffIcon className={`${style.disable} ${style.action}`} onClick={() => manageEditing(false)} />
          </>
        ) : (
          <>
            <EditIcon className={style.action} onClick={() => manageEditing(true)} />
            <Delete route={`/deleteCategory/${category._id}`} message={`Delete category ${category.title}?`} onCompleteDeletion={completeDeletion} />
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default CategoryRow;
