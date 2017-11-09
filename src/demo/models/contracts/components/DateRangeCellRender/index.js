import React from 'react';
import PropTypes from 'prop-types';

function date2str(arg, i18n) {
  const date = typeof arg === 'string' ?
    new Date(Date.parse(arg)) :
    arg;

  return i18n.formatDate(date)
}

const DateRangeCellRender = ({ name, instance }, { i18n }) => {
  const value = instance[name];

  return value ?
    (
      <span>
        {
          `${value.from ? date2str(value.from, i18n) : '...'} - ${value.to ? date2str(value.to, i18n) : '...'}`
        }
      </span>
    ) :
    null
};

DateRangeCellRender.propTypes = {
  name: PropTypes.string,
  instance: PropTypes.object
}

DateRangeCellRender.contextTypes = {
  i18n: PropTypes.object.isRequired
}

export default DateRangeCellRender;
