import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

export default function FollowerTable(props) {
  const { followers } = props;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              {`${followers.length} `}
              Followers:
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {followers.map((name) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

FollowerTable.propTypes = {
  followers: PropTypes.arrayOf(PropTypes.string).isRequired,
};
