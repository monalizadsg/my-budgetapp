import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

const fields = ["Date", "Description", "Amount"];

const TransactionsTable = (props) => {
  const classes = useStyles();

  console.log(props.rows);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='spanning table'>
        <TableHead>
          <TableRow>
            {fields.map((item) => (
              <TableCell
                key={item}
                style={{
                  position: "sticky",
                  zIndex: 1,
                }}
              >
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell align='left'>{row.description}</TableCell>
              <TableCell align='left'>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
