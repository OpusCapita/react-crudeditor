import React from 'react';

function date2str(date) {
  if (typeof date === 'string') {
    date = new Date(Date.parse(date));
  }

  return [date.getDate(), date.getMonth(), date.getFullYear()].join('/');
}

export default ({ name, instance }) => {
  const value = instance[name];

  return (
    <span>
      {
        `${value.from ? date2str(value.from) : '...'} - ${value.to ? date2str(value.to) : '...'}`
      }
    </span>
  );
};
