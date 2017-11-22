import api from './api';
import DateRangeCellRender from './components/DateRangeCellRender';
import StatusField from './components/StatusField';
import translations from './i18n';
import CustomSpinner from './components/CustomSpinner';
import ContractReferenceSearch from './components/ContractReferenceSearch';
import CustomTabComponent from './components/CustomTabComponent';

const VIEW_CREATE = 'create';
const VIEW_EDIT = 'edit';
const VIEW_SHOW = 'show';

const searchableFields = [
  { name: 'contractId' },
  { name: 'description' },
  { name: 'extContractId' },
  { name: 'extContractLineId' },
  { name: 'parentContract', render: { Component: ContractReferenceSearch } },
  { name: 'statusId', render: { Component: StatusField, valueProp: { type: 'number' } } },
  { name: 'maxOrderValue' },
  // { name: 'testNumberTypeField' },
  { name: 'createdOn' }
];

export const fields = {
  'testNumberTypeField': {
    'type': 'number',
    'constraints': {
      'required': false,
      'max': Number.MAX_SAFE_INTEGER
    }
  },
  'contractBoilerplates': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'hierarchyCode': {
    'type': 'string',
    'constraints': {
      'max': 100,
      'required': false
    }
  },
  'termsOfPaymentId': {
    'type': 'string',
    'constraints': {
      'max': 20,
      'required': false
    }
  },
  'description': {
    'type': 'string',
    'constraints': {
      'max': 100,
      'required': false
    }
  },
  'termsOfDeliveryId': {
    'type': 'string',
    'constraints': {
      'max': 20,
      'required': false
    }
  },
  'freeShippingBoundary': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'createdOn': {
    'type': 'stringDate',
    'constraints': {
      'required': true
    }
  },
  'changedOn': {
    'type': 'stringDate',
    'constraints': {
      'required': true
    }
  },
  'contractedCatalogs': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'minOrderValueRequired': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'contractedClassificationGroups': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'extContractId': {
    'type': 'string',
    'constraints': {
      'max': 10,
      'required': false
    }
  },
  'children': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'changedBy': {
    'type': 'string',
    'constraints': {
      'required': true
    }
  },
  'translations': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'usages': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'currencyId': {
    'type': 'string',
    'constraints': {
      'max': 3,
      'required': false
    }
  },
  'isFrameContract': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'totalContractedAmount': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'smallVolumeSurcharge': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'provisionings': {
    'type': 'collection',
    'constraints': {
      'required': false
    }
  },
  'isOffer': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'maxOrderValue': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'validRange': {
    'type': 'com.jcatalog.core.DateRange',
    'constraints': {
      'required': false
    }
  },
  'isPreferred': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'isInternal': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'contractCategory': {
    'type': 'com.jcatalog.contract.ContractCategory',
    'constraints': {
      'required': false
    }
  },
  'freightSurcharge': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'isStandard': {
    'type': 'boolean',
    'constraints': {
      'required': false
    }
  },
  'statusId': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 800,
      'integer': true,
      'required': false
    }
  },
  'createdBy': {
    'type': 'string',
    'constraints': {
      'required': true
    }
  },
  'extContractLineId': {
    'type': 'string',
    'constraints': {
      'max': 10,
      'required': false
    }
  },
  'contractId': {
    unique: true,
    'type': 'string',
    'constraints': {
      'max': 100,
      'required': true
    }
  },
  'parentContract': {},
  'minOrderValue': {
    'type': 'stringNumber',
    'constraints': {
      'min': 0,
      'max': 999999999,
      'integer': true,
      'required': false
    }
  }
};

const buildFormLayout = viewName => ({ tab, section, field }) => instance => [
  tab({ name: 'general', columns: 2 }, // Best look with N = 2, 3, 4 (default is 1)
    field({ name: 'contractId', readOnly: viewName !== VIEW_CREATE }),
    field({ name: 'description' }),
    // field({ name: 'translations', render: { Component: TranslatableTextEditor }}),
    field({ name: 'statusId', render: { Component: StatusField, valueProp: { type: 'number' } } }),
    field({ name: 'parentContract', render: { Component: ContractReferenceSearch } }),
    // field({ name: 'currencyId', render: { Component: CurrencyField }}),
    viewName !== VIEW_CREATE && section({ name: 'auditable', columns: 2 },
      field({ name: 'createdBy', readOnly: true }),
      field({ name: 'createdOn', readOnly: true }),
      field({ name: 'changedOn', readOnly: true }),
      field({ name: 'changedBy', readOnly: true })
    )
  ),
  tab({ name: 'catalogs' }),
  tab({ name: 'customer' }),
  tab({ name: 'boilerplates' }),
  tab({ name: 'supplier' }),
  tab({ name: 'groups' }),
  tab({ name: 'additional', disabled: viewName === VIEW_CREATE },
    section({ name: 'test' },
      field({ name: 'testNumberTypeField' })
    ),
    section({ name: 'order', columns: 3 },
      field({ name: 'minOrderValue' }),
      field({ name: 'maxOrderValue' }),
      field({ name: 'freeShippingBoundary' }),
      field({ name: 'freightSurcharge' }),
      field({ name: 'smallVolumeSurcharge' }),
      field({ name: 'totalContractedAmount' }),
      field({ name: 'minOrderValueRequired' })
    ),
    section({ name: 'type', columns: 4 },
      field({ name: 'isStandard' }),
      field({ name: 'isPreferred' }),
      field({ name: 'isFrameContract' }),
      field({ name: 'isInternal' }),
      field({ name: 'isOffer' })
    )
  ),
  tab({ name: 'custom', Component: CustomTabComponent, disabled: viewName === VIEW_CREATE })
];

export default {
  model: {
    name: 'Contracts', // unique for each model used in your app; used to distinguish translations
    translations,
    fields,
    validate(instance) {
      if (instance.minOrderValueRequired && instance.minOrderValue === null) {
        const err = [{
          code: 400,
          id: 'requiredFieldMissing',
          message: 'minOrderValue must be set when minOrderValueRequired is true'
        }];

        throw err;
      }

      return true;
    }
  },
  permissions: {
    crudOperations: {
      create: true,
      edit: true,
      delete: false,
      view: true
    }
  },
  api,
  ui: {
    search: _ => ({
      searchableFields,
      resultFields: [
        { name: 'contractId', sortable: true },
        { name: 'description', sortable: true },
        { name: 'extContractId', sortable: true },
        { name: 'extContractLineId', sortable: true },
        { name: 'validRange', Component: DateRangeCellRender }]
    }),
    instanceLabel: instance => instance._objectLabel || '',
    create: {
      defaultNewInstance: ({ filter }) => Object.keys(filter).reduce(
        (rez, fieldName) => {
          let isRange;

          searchableFields.some(fieldMeta => {
            if (fieldMeta.name === fieldName) {
              isRange = fieldMeta.render && fieldMeta.render.isRange;
              return true;
            }
            /* istanbul ignore next */
            return false;
          });

          return isRange || filter[fieldName] === null ?
            rez :
            {
              ...rez,
              [fieldName]: filter[fieldName]
            };
        },
        {}
      ),
      formLayout: buildFormLayout(VIEW_CREATE)
    },
    edit: {
      formLayout: buildFormLayout(VIEW_EDIT)
    },
    show: {
      formLayout: buildFormLayout(VIEW_SHOW)
    },
    Spinner: CustomSpinner
  }
};
