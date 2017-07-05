import React from 'react';

export default function(props) {
  const {
    entryName,
    formEntry,
    searchResult,
  } = props;

  return (
    <div>
      <h1>Search {entryName}</h1>

      {formEntry}

      {searchResult}
    </div>
  );
}