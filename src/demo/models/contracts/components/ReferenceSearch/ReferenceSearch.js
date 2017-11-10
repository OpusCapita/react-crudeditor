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
import ReferenceSearchService from './service';
import { getFieldText } from '../../../../../components/lib'

const SERVICE_NAME = 'ReferenceSearch';

export default class ReferenceSearch extends PureComponent {
    static propTypes = {
      ...ReferenceInputBaseProps,
      value: PropTypes.string,
      reactSelectSpecificProps: PropTypes.shape(ReactSelectSpecificProps),
      serviceRegistry: isServiceRegistryConfiguredFor(SERVICE_NAME)
    };

    static contextTypes = {
      i18n: PropTypes.object.isRequired
    };

    static defaultProps = {
      serviceRegistry: serviceName => ({ url: 'http://localhost:3000' })
    }

    componentWillMount() {
      this.context.i18n.register('ReferenceSearch', translations)
    }

    render() {
      const { contractId, onBlur, onChange, readOnly } = this.props;

      const { i18n } = this.context;

      console.log('RS this.prop.value: ' + JSON.stringify(this.props.value))

      const referenceSearchProps = {
        contractId,
        onBlur,
        onChange: v => onChange(v.contractId),
        readOnly,
        ...{
          value: { contractId: this.props.value },
          referenceSearchAction: (searchParams, callback) => {
            let referenceSearchService = new ReferenceSearchService(this.props.serviceRegistry(SERVICE_NAME).url);
            return referenceSearchService.getIds(searchParams).then(({ items }) => callback({
              count: items.length,
              items
            }));
          },
          searchFields: [
            {
              name: 'contractId',
              label: getFieldText(i18n, 'contractId')
            }
          ],
          resultFields: [
            {
              name: 'contractId',
              label: getFieldText(i18n, 'contractId')
            }
          ],

          title: i18n.getMessage('crudEditor.search.header', {
            payload: i18n.getMessage('model.field.contractId')
          }),
          labelProperty: 'contractId',
          valueProperty: 'contractId'
        }
      }

      const autocompleteProps = {
        labelProperty: referenceSearchProps.labelProperty,
        valueProperty: referenceSearchProps.valueProperty,
        autocompleteAction: (searchTerm, callback) => {
          let referenceSearchService = new ReferenceSearchService(this.props.serviceRegistry(SERVICE_NAME).url);
          return referenceSearchService.getIds({ contractId: searchTerm }).then(({ items }) => {
            return {
              options: items,
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
