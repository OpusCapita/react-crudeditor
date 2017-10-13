import React from 'react';
import PropTypes from 'prop-types';

function date2str(arg) {
  const date = typeof arg === 'string' ?
    new Date(Date.parse(arg)) :
    arg;

  return [date.getDate(), date.getMonth(), date.getFullYear()].join('/');
}

const DateRangeCellRender = ({ name, instance }) => {
  const value = instance[name];

  return value ?
    (
      <span>
        {
          `${value.from ? date2str(value.from) : '...'} - ${value.to ? date2str(value.to) : '...'}`
        }
      </span>
    ) :
    null
};

DateRangeCellRender.propTypes = {
  name: PropTypes.string,
  instance: PropTypes.object
}

export default DateRangeCellRender;
