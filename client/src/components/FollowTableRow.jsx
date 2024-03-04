import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import {
  TableCell, TableRow,
} from '@mui/material';
import { getProfileById } from '../api/user';

export default function FollowTableRow(props) {
  const { userId } = props;
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      getProfileById(userId).then((res) => {
        const temp = `${res.firstName} ${res.lastName}`;
        setName(temp);
      });
    } catch (err) {
      setName('');
    }
  }, [name]);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
    </TableRow>
  );
}

FollowTableRow.propTypes = {
  userId: PropTypes.string.isRequired,
};
