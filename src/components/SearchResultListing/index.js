import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/lib/Table';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { getFieldLabel } from '../lib';
import SearchResultButtons from './SearchResultButtons';
import './styles.less';

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
      permissions: PropTypes.shape({
        delete: PropTypes.func.isRequired
      }).isRequired,
      actions: PropTypes.objectOf(PropTypes.func).isRequired,
      instanceOperations: PropTypes.func.isRequired,
      bulkOperations: PropTypes.object.isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor(props) {
    super(props);
    this._tableContainerRef = React.createRef();
  }

  handleResort = fieldName => _ => this.props.model.actions.searchInstances({
    sort: fieldName,
    // XXX: sortField and sortOrder must be accessed with this.props.model.data for up-to-date values!
    order: fieldName === this.props.model.data.sortParams.field && this.props.model.data.sortParams.order === 'asc' ?
      'desc' :
      'asc'
  })

  handleToggleSelected = instance => ({
    target: {
      checked: selected
    }
  }) => this.props.model.actions.toggleSelected({ selected, instance })

  handleToggleSelectedAll = ({ target: { checked } }) => this.props.model.actions.toggleSelectedAll(checked)

  render() {
    const {
      data: {
        selectedInstances,
        resultInstances: instances,
        resultFields,
        pageParams: { offset },
        sortParams: {
          field: sortField,
          order: sortOrder
        }
      },
      instanceOperations,
      bulkOperations
    } = this.props.model;

    const { i18n } = this.context;

    const bulkOperationsExist = Object.keys(bulkOperations).length > 0;

    return (
      <div className="crud--search-result-listing__table-container" ref={this._tableContainerRef}>
        <Table condensed={true} className="crud--search-result-listing__table">
          <thead>
            <tr>
              {
                bulkOperationsExist &&
                <th>
                  <Checkbox
                    checked={selectedInstances.length === instances.length && instances.length !== 0}
                    disabled={instances.length === 0}
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
                            getFieldLabel({ i18n, name })
                          }
                          {
                            sortField === name &&
                            <Glyphicon
                              className="crud--search-result-listing__sort-icon"
                              glyph={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            />
                          }
                        </a> :
                        getFieldLabel({ i18n, name })
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
                    bulkOperationsExist &&
                    <td>
                      <Checkbox
                        checked={selectedInstances.indexOf(instance) > -1}
                        onChange={this.handleToggleSelected(instance)}
                      />
                    </td>
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
                            (instance.hasOwnProperty(name) ? format(instance[name], i18n) : '')
                        }
                      </td>
                    ))
                  }
                  <td className="text-right">
                    <SearchResultButtons
                      operations={instanceOperations({
                        instance,
                        offset: offset + index
                      })}
                      parentRef={this._tableContainerRef}
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
