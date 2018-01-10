import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Table, Glyphicon, Checkbox } from 'react-bootstrap';
import { getModelMessage, titleCase } from '../lib';
import SearchResultButtons from './SearchResultButtons';
import './SearchResultListing.less';

class SearchResultListing extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        resultInstances: PropTypes.arrayOf(PropTypes.object),
        selectedInstances: PropTypes.arrayOf(PropTypes.object),
        resultFields: PropTypes.arrayOf(PropTypes.object),
        sortParams: PropTypes.object,
        isLoading: PropTypes.bool,
        pageParams: PropTypes.shape({
          offset: PropTypes.number.isRequired
        })
      }),
      actions: PropTypes.objectOf(PropTypes.func).isRequired,
      operations: PropTypes.shape({
        internal: PropTypes.func.isRequired,
        external: PropTypes.arrayOf(PropTypes.object).isRequired
      })
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    const {
      toggleSelected,
      showInstance,
      editInstance,
      deleteInstances,
      searchInstances
    } = this.props.model.actions;

    this.handleToggleSelected = instance => ({
      target: {
        checked: selected
      }
    }) => toggleSelected({ selected, instance });

    if (showInstance) {
      this.handleShow = (instance, index) => _ => showInstance({
        instance,
        offset: this.props.model.data.pageParams.offset + index
      });
    }

    if (editInstance) {
      this.handleEdit = (instance, index) => _ => editInstance({
        instance,
        offset: this.props.model.data.pageParams.offset + index
      });
    }

    if (deleteInstances) {
      this.handleDelete = instance => _ => deleteInstances([instance]);
    }

    this.handleResort = fieldName => _ => searchInstances({
      sort: fieldName,
      // XXX: sortField and sortOrder must be accessed with this.props.model.data for up to date values!
      order: fieldName === this.props.model.data.sortParams.field && this.props.model.data.sortParams.order === 'asc' ?
        'desc' :
        'asc'
    });
  }

  componentDidMount() {
    this._myRef = findDOMNode(this)
  }

  handleToggleSelectedAll = ({ target: { checked } }) => this.props.model.actions.toggleSelectedAll(checked)

  render() {
    const {
      data: {
        selectedInstances,
        resultInstances: instances,
        resultFields,
        sortParams: {
          field: sortField,
          order: sortOrder
        },
        standardOperations
      },
      operations: {
        internal: internalOperations,
        external: externalOperations
      }
    } = this.props.model;

    const { i18n } = this.context;

    return (
      <div className="crud--search-result-listing__table-container">
        <Table condensed={true} className="crud--search-result-listing__table">
          <thead>
            <tr>
              { this.handleDelete &&
                <th>
                  <input
                    type="checkbox"
                    checked={selectedInstances.length === instances.length && instances.length !== 0}
                    onChange={this.handleToggleSelectedAll}
                  />
                </th>
              }

              {
                resultFields.map(({ name, sortable }) => (
                  <th key={`th-${name}`}>
                    {
                      sortable ?
                        <a
                          className="crud--search-result-listing__sort-button"
                          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                          onClick={this.handleResort(name)}
                        >
                          {
                            getModelMessage({
                              i18n,
                              key: `model.field.${name}.label`,
                              defaultMessage: titleCase(name)
                            })
                          }
                          {
                            sortField === name &&
                            <Glyphicon
                              className="crud--search-result-listing__sort-icon"
                              glyph={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            />
                          }
                        </a> :
                        getModelMessage({
                          i18n,
                          key: `model.field.${name}.label`,
                          defaultMessage: titleCase(name)
                        })
                    }
                  </th>
                ))
              }

              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>

            {
              instances.map((instance, index) => (
                <tr key={`tr-${JSON.stringify(instance)}`}>
                  {
                    this.handleDelete && (<td>
                      <Checkbox
                        checked={selectedInstances.indexOf(instance) > -1}
                        onChange={this.handleToggleSelected(instance)}
                      />
                    </td>)
                  }
                  {
                    resultFields.map(({ name, component: Component, textAlignment, format }) => (
                      <td
                        key={`td-${name}`}
                        className={
                          textAlignment === 'right' && 'text-right' ||
                        textAlignment === 'center' && 'text-center' ||
                        'text-left'
                        }
                      >
                        {
                          Component ?
                            <Component name={name} instance={instance} /> :
                            format({ value: instance[name], i18n })
                        }
                      </td>
                    ))
                  }
                  <td className="text-right">
                    <SearchResultButtons
                      standardOperations={
                        Object.keys(standardOperations || {}).reduce((ops, opName) => ({
                          ...ops,
                          [opName]: standardOperations[opName](instance)
                        }), {})
                      }
                      internalOperations={internalOperations(instance)}
                      externalOperations={externalOperations.map(({ handler, ...rest }) => ({
                        ...rest,
                        handler: _ => handler(instance)
                      }))}
                      {...{
                        ...(
                          this.handleShow && {
                            onShow: this.handleShow(instance, index)
                          }
                        ),
                        ...(
                          this.handleEdit && {
                            onEdit: this.handleEdit(instance, index)
                          }
                        ),
                        ...(
                          this.handleDelete && {
                            onDelete: this.handleDelete(instance)
                          }
                        )
                      }}
                      index={index}
                      parentRef={this._myRef}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}


export default SearchResultListing;
