import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ReactSelectSpecificProps,
  ReferenceAutocomplete,
  ReferenceSearchInput,
  isServiceRegistryConfiguredFor,
  ReferenceInputBaseProps
} from '@opuscapita/react-reference-select';
import translations from './i18n';
import service from './service';

const SERVICE_NAME = 'ReferenceSearch';

export default class ReferenceSearch extends PureComponent {

    static propTypes = {
      ...ReferenceInputBaseProps,
      reactSelectSpecificProps: React.PropTypes.shape(ReactSelectSpecificProps),
      serviceRegistry: isServiceRegistryConfiguredFor(SERVICE_NAME)
    };

    static contextTypes = {
      i18n: React.PropTypes.object.isRequired
    };

    static defaultProps = {
      serviceRegistry = serviceName => ({ url: 'http://localhost:3000' })
    }

    componentWillMount() {
      this.context.i18n.register('ReferenceSearch', translations)
    }

    render() {
      let referenceSearchProps = lodash.extend(
        // copy this properties
        lodash.pick(this.props, ['id', 'name', 'onBlur', 'onFocus', 'onChange', 'multiple', 'disabled', 'readOnly']),
        // add custom properties
        {
          value: this.props.value,
          referenceSearchAction: (searchParams, callback) => {
            let exampleService = new ExampleService(this.props.serviceRegistry(SERVICE_NAME).url);
            return exampleService.getExamples(searchParams).then((response) => {
              return callback(
                {
                  count: getTotalCount(response),
                  items: response.body
                }
              )
            });
          },
          searchFields: [
            {
              name: 'contractId',
              label: this.context.i18n.getMessage('ReferenceSearch.id')
            }
          ],
          resultFields: [
            {
              name: 'contractId',
              label: this.context.i18n.getMessage('ReferenceSearch.id')
            }
          ],

          title: this.context.i18n.getMessage('ReferenceSearch.dialogTitle'),
          labelProperty: '_objectLabel',
          valueProperty: 'id'
        }
      );

      let autocompleteProps = {
        labelProperty: referenceSearchProps.labelProperty,
        valueProperty: referenceSearchProps.valueProperty,
        autocompleteAction: (searchTerm, callback) => {
          let exampleService = new ExampleService(this.props.serviceRegistry(SERVICE_NAME).url);
          return exampleService.getExamples({ q: searchTerm }).then((response) => {
            return {
              options: response.body,
              complete: false
            };
          });
        },
        reactSelectSpecificProps: this.props.reactSelectSpecificProps
      };

      return (
        <ReferenceSearchInput {...referenceSearchProps}>
          <ReferenceAutocomplete {...autocompleteProps}/>
        </ReferenceSearchInput>
      );
    }
  }