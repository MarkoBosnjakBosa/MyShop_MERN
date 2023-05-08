import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "./Products.module.css";

const TechnicalInformationRow = (props) => {
  const technicalInformation = props.technicalInformation;
  const index = props.index;

  const changeTechnicalInformation = (event) => {
    props.onChange(technicalInformation._id, event.target.value);
  };

  const removeTechnicalInformation = () => {
    props.onRemove(technicalInformation._id);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell align="right">{technicalInformation.title}</TableCell>
      <TableCell align="right"><input type="text" value={technicalInformation.value} className={style.field} onChange={changeTechnicalInformation} /></TableCell>
      <TableCell align="right"><DeleteIcon onClick={removeTechnicalInformation} className={style.pointer}/></TableCell>
    </TableRow>
  );
};

export default TechnicalInformationRow;
