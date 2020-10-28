import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Section from '../EditSection';
import Field from '../EditField';

const DEFAULT_COLUMNS_COUNT = 1;

const formGrid = ({ model, toggledFieldErrors, toggleFieldErrors }) => {
  let uniqueKey = 1;

  const buildRow = (fields, columnsCnt) => {
    const rowsCnt = Math.ceil(fields.length / columnsCnt);
    const colSize = Math.floor(12 / columnsCnt);

    // list element id in matrix with 'columnsCnt' columns
    // indexes start from 0
    const elIdx = ({ rowIdx, columnIdx }) => columnsCnt * rowIdx + columnIdx;

    return (
      <Row key={'row-' + ++uniqueKey}>
        <Col>
          {
            [...Array(rowsCnt).keys()].map(rowIdx => (
              <Row key={'row-' + uniqueKey + '-' + rowIdx}>
                {
                  [...Array(columnsCnt).keys()].map(columnIdx => {
                    const fieldIdx = elIdx({ rowIdx, columnIdx });

                    // if fieldIdx exceeds fields length then field gonna be undefined
                    const field = fields[fieldIdx];

                    return (
                      <Col
                        sm={colSize}
                        key={'column-' + uniqueKey + '-' + rowIdx + '-' + columnIdx}
                      >
                        {
                          field ? (
                            <Field
                              model={model}
                              toggledFieldErrors={toggledFieldErrors}
                              toggleFieldErrors={toggleFieldErrors}
                              columns={columnsCnt}
                              entry={{
                                name: field.field,
                                readOnly: field.readOnly,
                                component: field.render.component,
                                valuePropName: field.render.value.propName
                              }}
                            />
                          ) : null // grid may have empty elements in the end if fields.length < rowCnt * columnsCnt
                        }

                      </Col>
                    )
                  })
                }
              </Row>
            ))
          }
        </Col>
      </Row>
    )
  };

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
            value: PropTypes.shape({
              type: PropTypes.string,
              propName: PropTypes.string,
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
