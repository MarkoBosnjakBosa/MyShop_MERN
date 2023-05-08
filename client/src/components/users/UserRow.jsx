import Link from "../actions/Link";
import Delete from "../actions/Delete";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const UserRow = (props) => {
  const user = props.user;
  const index = props.index;
  const { account } = user;

  const completeDeletion = () => {
    props.onCompleteDeletion(user._id);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell align="right">{account.firstName} {account.lastName}</TableCell>
      <TableCell align="right">{account.username}</TableCell>
      <TableCell align="right">{account.email}</TableCell>
      <TableCell align="right">{account.mobileNumber}</TableCell>
      <TableCell align="right">
        <Link page={`/user/${user._id}`} />
        <Delete route={`/deleteUser/${user._id}`} message={`Delete user ${account.username}?`} onCompleteDeletion={completeDeletion} />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
