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
import ReferenceSearchService from './ReferenceSearchService';
import { getFieldLabel } from '../../../../../components/lib';

const SERVICE_NAME = 'ContractReferenceSearch';
const SERVICE_URL = 'http://some-host:some-port/';

/*
 * Parses Content-range header and returns response count
 */
function getTotalCount(response) {
  let range = response.headers['content-range'];
  let index = range.indexOf('/');
  let totalCount = range.substring(index + 1);
  return parseInt(totalCount, 10);
}

export default class ContractReferenceSearch extends PureComponent {
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
    serviceRegistry: serviceName => ({ url: SERVICE_URL })
  }

  componentWillMount() {
    this.context.i18n.register('ContractReferenceSearch', translations)
  }

  render() {
    const { contractId, onBlur, onChange, readOnly } = this.props;

    const { i18n } = this.context;

    const fieldName = 'contractId';
    const fieldLabel = getFieldLabel({ i18n, name: fieldName });

    const referenceSearchProps = {
      contractId,
      onBlur,
      onChange: v => onChange(v ? v.contractId : ''),
      readOnly,
      value: { contractId: this.props.value },
      referenceSearchAction: (searchParams, callback) => {
        const referenceSearchService = new ReferenceSearchService(this.props.serviceRegistry(SERVICE_NAME).url);
        return referenceSearchService.getData(searchParams).then(response => callback({
          count: getTotalCount(response),
          items: response.body
        }));
      },
      searchFields: [
        {
          name: fieldName,
          label: fieldLabel
        }
      ],
      resultFields: [
        {
          name: fieldName,
          label: fieldLabel
        }
      ],
      title: i18n.getMessage('common.CrudEditor.search.header', { payload: fieldLabel }),
      labelProperty: 'contractId',
      valueProperty: 'contractId'
    }

    const autocompleteProps = {
      labelProperty: referenceSearchProps.labelProperty,
      valueProperty: referenceSearchProps.valueProperty,
      autocompleteAction: (searchTerm, callback) => {
        const referenceSearchService = new ReferenceSearchService(this.props.serviceRegistry(SERVICE_NAME).url);
        return referenceSearchService.getData({ contractId: searchTerm }).then(({ body }) => {
          return {
            options: body,
            complete: false
          };
        });
      },
      reactSelectSpecificProps: this.props.reactSelectSpecificProps
    };

    return (
      <ReferenceSearchInput {...referenceSearchProps}>
        <ReferenceAutocomplete {...autocompleteProps} />
      </ReferenceSearchInput>
    );
  }
}
