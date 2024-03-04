import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import FollowTableRow from './FollowTableRow';

export default function FollowTable(props) {
  const { follows } = props;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {`${follows.length} `}
              Following Users:
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {follows.map((id) => (
            <FollowTableRow key={id} userId={id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

FollowTable.propTypes = {
  follows: PropTypes.arrayOf(PropTypes.string).isRequired,
};
