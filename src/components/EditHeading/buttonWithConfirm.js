import React from 'react';
import PropTypes from 'prop-types';

import { Button, Glyphicon } from 'react-bootstrap';
import ConfirmDialog from '../ConfirmDialog';

const makeButtonWithConfirm = ({ glyph, handleFunc, ...props }) => (
  <ConfirmDialog
    trigger='click'
    onConfirm={handleFunc}
    {...props}
  >
    <Button disabled={!handleFunc}><Glyphicon glyph={glyph}/></Button>
  </ConfirmDialog>
);

makeButtonWithConfirm.propTypes = {
  handleFunc: PropTypes.func,
  glyph: PropTypes.string
};

export default makeButtonWithConfirm;
