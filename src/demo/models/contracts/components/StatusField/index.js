import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

const messages = {
  en: {
    "customComponents.statusId.pending": "pending",
    "customComponents.statusId.new": "new",
    "customComponents.statusId.changed": "changed",
    "customComponents.statusId.confirmed": "confirmed",
    "customComponents.statusId.deleted": "deleted"
  },
  ru: {
    "customComponents.statusId.pending": "на рассмотрении",
    "customComponents.statusId.new": "новый",
    "customComponents.statusId.changed": "изменен",
    "customComponents.statusId.confirmed": "подтвержден",
    "customComponents.statusId.deleted": "удален",
  }
}

const StatusField = ({ value, onChange, onBlur, readOnly }, { i18n }) => {
  i18n.register('StatusField', messages);

  const getStatusText = status => i18n.getMessage(`customComponents.statusId.${status}`)

  return (<FormControl
    componentClass='select'
    value={value || value === 0 ? value : ''}
    onChange={({ target: { value } }) => {
      const v = Number(value) === parseInt(value, 10) ? Number(value) : null;
      return onChange && onChange(v)
    }}
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
