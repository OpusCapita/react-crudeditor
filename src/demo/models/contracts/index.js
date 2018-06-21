import api from './api';
import DateRangeCellRender from './components/DateRangeCellRender';
import StatusField from './components/StatusField';
import translations from './i18n';
import CustomSpinner from './components/CustomSpinner';
import ContractReferenceSearch from './components/ContractReferenceSearch';
import CustomTabComponent from './components/CustomTabComponent';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_STRING_DATE,

  UI_TYPE_INTEGER,

  // BUILTIN_INPUT,
  // BUILTIN_RANGE_INPUT,

  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_SEARCH
} from '../../../crudeditor-lib';

export const fields = {
  'contractId': {
    unique: true,
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 100,
      'required': true
    }
  },
  'description': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 100,
      'required': false,
      validate: /* istanbul ignore next */ (value, instance) => {
        if ((value || '').toLowerCase().indexOf('booo') !== -1) {
          const err = [{
            code: 400,
            // `id` is used to find translations for this particular error
            // define translations with the following key structure:
            // model.field.FIELD_NAME.error.ERROR_ID, where ERROR_ID is `id` defined below
            id: 'forbiddenWord',
            // `message` is a default message in case translation is not found
            message: 'Description cannot contain `booo`!',
            // optional `payload` for error translations
            // here you can define props which you use in i18n messages
            // example: for i18n message `Hello {name}! This field cannot exceed {maxValue}`
            // define `name` and `maxValue` props
            args: {
              forbiddenWord: 'BOOO'
            }
          }];

          throw err;
        }

        return true;
      }
    }
  },
  'testNumberTypeField': {
    'type': FIELD_TYPE_DECIMAL,
    'constraints': {
      'required': false,
      'max': 9999999
    }
  },
  'email': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      email: true
    }
  },
  'url': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      url: true
    }
  },
  'testRegexp': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      matches: /^hello/i
    }
  },
  // 'contractBoilerplates': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'hierarchyCode': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 100,
      'required': false
    }
  },
  'termsOfPaymentId': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 20,
      'required': false
    }
  },
  'termsOfDeliveryId': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 20,
      'required': false
    }
  },
  'freeShippingBoundary': {
    'type': FIELD_TYPE_INTEGER,
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'createdOn': {
    'type': FIELD_TYPE_STRING_DATE,
    'constraints': {
      'required': true
    }
  },
  'changedOn': {
    'type': FIELD_TYPE_STRING_DATE,
    'constraints': {
      'required': true
    }
  },
  // 'contractedCatalogs': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'minOrderValueRequired': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  // 'contractedClassificationGroups': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'extContractId': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 10,
      'required': false
    }
  },
  // 'children': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'changedBy': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'required': true
    }
  },
  // 'translations': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  // 'usages': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'currencyId': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 3,
      'required': false
    }
  },
  'isFrameContract': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  'totalContractedAmount': {
    'type': FIELD_TYPE_INTEGER,
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'smallVolumeSurcharge': {
    'type': FIELD_TYPE_DECIMAL,
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  // 'provisionings': {
  //   'type': 'collection',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'isOffer': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  'maxOrderValue': {
    'type': FIELD_TYPE_INTEGER,
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  // 'validRange': {
  //   'type': 'com.jcatalog.core.DateRange',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'isPreferred': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  'isInternal': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  // 'contractCategory': {
  //   'type': 'com.jcatalog.contract.ContractCategory',
  //   'constraints': {
  //     'required': false
  //   }
  // },
  'freightSurcharge': {
    'type': FIELD_TYPE_DECIMAL,
    'constraints': {
      'min': 0,
      'max': 999999999,
      'required': false
    }
  },
  'isStandard': {
    'type': FIELD_TYPE_BOOLEAN,
    'constraints': {
      'required': false
    }
  },
  'statusId': {
    'type': 'com.opuscapita.hexadecimal',
    'constraints': {
      'min': 0,
      'max': "800",
      'required': false
    }
  },
  'createdBy': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'required': true
    }
  },
  'extContractLineId': {
    'type': FIELD_TYPE_STRING,
    'constraints': {
      'max': 10,
      'required': false
    }
  },
  'parentContract': {},
  'minOrderValue': {
    'type': FIELD_TYPE_INTEGER,
    'constraints': {
      'min': 0,
      'max': 99,
      'required': false
    }
  }
};

const buildFormLayout = /* istanbul ignore next */ viewName => ({ tab, section, field }) => instance => [
  tab({ name: 'general', columns: 2 }, // Best look with N = 2, 3, 4 (default is 1)
    field({ name: 'contractId', readOnly: viewName !== VIEW_CREATE }),
    field({ name: 'description' }),
    // field({ name: 'translations', render: { component: TranslatableTextEditor }}),
    field({ name: 'statusId', render: { component: StatusField, value: { converter: {
      format: value => value || value === 0 ? parseInt(value, 16) : null,
      parse: value => value || value === 0 ? value.toString(16) : null
    } } } }),
    field({ name: 'parentContract', render: { component: ContractReferenceSearch } }),
    // field({ name: 'currencyId', render: { component: CurrencyField }}),
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
      field({ name: 'testNumberTypeField' }),
      field({ name: 'email' }),
      field({ name: 'url' }),
      field({ name: 'testRegexp' }),
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
  tab({ name: 'custom', component: CustomTabComponent, disabled: viewName === VIEW_CREATE })
];

export default {
  model: {
    name: 'Contracts', // unique for each model used in your app; used to distinguish translations
    translations,
    fields,
    validate: /* istanbul ignore next */ ({ formInstance }) => {
      if (formInstance.minOrderValueRequired && formInstance.minOrderValue === null) {
        const err = [{
          code: 400,
          id: 'requiredFieldMissing',
          message: 'minOrderValue must be set when minOrderValueRequired is true',
          args: {
            contractId: formInstance.contractId
          }
        }];

        throw err;
      }

      return true;
    }
  },
  permissions: {
    crudOperations: {
      create: _ => true,
      edit: ({ instance } = {}) => {
        if (instance) {
          return (instance.description || '').indexOf('of') > -1;
        }
        return true;
      },
      delete: ({ instance } = {}) => {
        if (instance) {
          return (instance.contractId || '').toLowerCase().indexOf('abd') === -1;
        }
        return true;
      },
      view: true
    }
  },
  api,
  ui: {
    search: /* istanbul ignore next */ _ => ({
      searchableFields: [
        { name: 'contractId' },
        { name: 'description' },
        { name: 'extContractId' },
        { name: 'extContractLineId' },
        { name: 'parentContract', render: { component: ContractReferenceSearch } },
        { name: 'statusId', render: { component: StatusField, value: { converter: {
          format: value => value || value === 0 ? parseInt(value, 16) : null,
          parse: value => value || value === 0 ? value.toString(16) : null
        } } } },
        { name: 'maxOrderValue' },
        // THE SAME CAN BE ACHIEVED WITH THE FOLLOWING
        // EXAMPLE OF USING BUILT-IN RANGE INPUT COMPONENT:
        // { name: 'maxOrderValue', render: { component: BUILTIN_RANGE_INPUT, props: { type: 'integer' } } },
        { name: 'createdOn' }
      ],
      resultFields: [
        { name: 'contractId', sortable: true },
        { name: 'description', sortable: true },
        { name: 'extContractId', sortable: true },
        { name: 'extContractLineId', sortable: true },
        { name: 'validRange', component: DateRangeCellRender }
      ]
    }),
    instanceLabel: /* istanbul ignore next */ instance => instance._objectLabel || instance.contractId || '',
    create: {
      defaultNewInstance: /* istanbul ignore next */ ({ filter } = {}) => Object.keys(filter || {}).reduce(
        (rez, fieldName) => {
          const isRange = ['maxOrderValue', 'createdOn'].indexOf(fieldName) !== -1;

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
    spinner: CustomSpinner,
    customOperations: /* istanbul ignore next */ instance => [{
      handler: _ => ({
        name: VIEW_CREATE,
        state: {
          predefinedFields: {
            parentContract: instance.contractId
          }
        }
      }),
      ui: ({
        name: viewName,
        state: viewState
      }) => ({
        title: _ => 'createChild',
        show: viewName !== VIEW_CREATE,
        dropdown: viewName === VIEW_SEARCH
      })
    }, {
      handler: _ => ({
        name: VIEW_CREATE,
        state: {
          predefinedFields: Object.keys(instance).
            filter(key => [
              'contractId',
              'createdBy',
              'createdOn',
              'changedBy',
              'changedOn'
            ].indexOf(key) === -1).
            reduce((obj, key) => ({ ...obj, [key]: instance[key] }), {})
        }
      }),
      ui: ({
        name: viewName,
        state: viewState
      }) => ({
        title: _ => 'duplicate',
        show: viewName !== VIEW_CREATE,
        dropdown: true
      })
    }]
  }
};
