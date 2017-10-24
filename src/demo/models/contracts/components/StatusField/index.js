import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

const messages = {
  en: {
    "model.field.statusId.pending": "pending",
    "model.field.statusId.new": "new",
    "model.field.statusId.changed": "changed",
    "model.field.statusId.confirmed": "confirmed",
    "model.field.statusId.deleted": "deleted"
  },
  ru: {
    "model.field.statusId.pending": "на рассмотрении",
    "model.field.statusId.new": "новый",
    "model.field.statusId.changed": "изменен",
    "model.field.statusId.confirmed": "подтвержден",
    "model.field.statusId.deleted": "удален",
  }
}

const StatusField = ({ value, onChange, onBlur, readOnly }, { i18n }) => {
  i18n.register('StatusField', messages);

  const getStatusText = status => i18n.getMessage(`model.field.statusId.${status}`)

  return (<FormControl
    componentClass='select'
    value={value || value === 0 ? value : ''}
    onChange={({ target: { value } }) => onChange &&
      onChange(Number(value) === parseInt(value, 10) ? Number(value) : null)}
    onBlur={onBlur}
    disabled={readOnly}
  >
    <option value={''}></option>
    <option value={0}>0 ({getStatusText('pending')})</option>
    <option value={100}>100 ({getStatusText('new')})</option>
    <option value={105}>105 ({getStatusText('changed')})</option>
    <option value={400}>400 ({getStatusText('confirmed')})</option>
    <option value={800}>800 ({getStatusText('deleted')})</option>
  </FormControl>)
};

StatusField.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool
}

StatusField.contextTypes = {
  i18n: PropTypes.object
};

export default StatusField;
