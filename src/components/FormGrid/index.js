import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Section from '../EditSection';
import Field from '../EditField';

const DEFAULT_COLUMNS_COUNT = 1;

const formGrid = ({ model, toggledFieldErrors, toggleFieldErrors }) => {
  let uniqueKey = 1;

  const buildRow = (fields, columnsCnt) => (
    <Row key={'row-' + ++uniqueKey}>
      {
        // Iterating over array [0..(columnsCnt - 1)]
        [...Array(columnsCnt).keys()].map(columnIndex => (
          <Col
            sm={Math.floor(12 / columnsCnt)}
            key={'column-' + uniqueKey + '-' + columnIndex}
          >
            {
              fields.
                filter((_, fieldIndex) => fieldIndex % columnsCnt === columnIndex).
                map((field, fieldIndex) => (
                  <Field
                    model={model}
                    toggledFieldErrors={toggledFieldErrors}
                    toggleFieldErrors={toggleFieldErrors}
                    columns={columnsCnt}
                    key={'field-' + uniqueKey + '-' + columnIndex + '-' + fieldIndex}
                    entry={{
                      name: field.field,
                      readOnly: field.readOnly,
                      component: field.render.component,
                      valuePropName: field.render.valueProp.name
                    }}
                  />
                ))
            }
          </Col>
        ))
      }
    </Row>
  );

  const buildGrid = (entries, tabColumns) => {
    if (!entries.length) {
      return [];
    }

    if (entries[0].section) {
      const [section, ...rest] = entries;

      return [
        <Section title={section.section} model={model} key={'section-' + ++uniqueKey}>
          {
            buildRow(section, section.columns)
          }
        </Section>,
        ...buildGrid(rest, tabColumns)
      ];
    }

    let nextIndex = 1; // Next index after last sequential field.

    while (nextIndex < entries.length && entries[nextIndex].field) {
      nextIndex++;
    }

    return [
      buildRow(entries.slice(0, nextIndex), tabColumns),
      ...buildGrid(entries.slice(nextIndex), tabColumns)
    ]
  }

  return (
    <div>
      {
        buildGrid(model.data.activeEntries, model.data.activeEntries.columns || DEFAULT_COLUMNS_COUNT)
      }
    </div>
  );
}

formGrid.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      activeEntries: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.shape({
          field: PropTypes.string,
          readOnly: PropTypes.bool,
          validate: PropTypes.func,
          render: PropTypes.shape({
            component: PropTypes.func,
            props: PropTypes.object,
            valueProp: PropTypes.shape({
              type: PropTypes.string,
              name: PropTypes.string,
              converter: PropTypes.shape({
                format: PropTypes.func,
                parse: PropTypes.func
              })
            })
          })
        }),
        PropTypes.array
      ]))
    })
  }),
  toggledFieldErrors: PropTypes.object,
  toggleFieldErrors: PropTypes.func
}

export default formGrid;
