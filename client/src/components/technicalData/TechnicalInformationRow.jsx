import Delete from "../actions/Delete";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const TechnicalInformationRow = (props) => {
  const technicalInformation = props.technicalInformation;
  const index = props.index;

  const completeDeletion = () => {
    props.onCompleteDeletion(technicalInformation._id);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell align="right">{technicalInformation.title}</TableCell>
      <TableCell align="right">
        <Delete route={`/deleteTechnicalInformation/${technicalInformation._id}`} message={`Delete technical information ${technicalInformation.title}?`} onCompleteDeletion={completeDeletion} />
      </TableCell>
    </TableRow>
  );
};

export default TechnicalInformationRow;
