import React from 'react';
import PropTypes from 'prop-types';

const date2str = (date, i18n) => i18n.formatDate(typeof date === 'string' ?
  new Date(Date.parse(date)) :
  date
);

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
  name: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired
}

DateRangeCellRender.contextTypes = {
  i18n: PropTypes.object.isRequired
}

export default DateRangeCellRender;
