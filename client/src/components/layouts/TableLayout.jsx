import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TableLayout = (props) => {
  const labels = props.labels;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: "650px" }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>#</strong></TableCell>
            {labels.map((label) => (
              <TableCell key={label} align="right"><strong>{label}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.children}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableLayout;
