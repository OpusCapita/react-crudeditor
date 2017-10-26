import api from './api';
import DateRangeCellRender from './components/DateRangeCellRender';
import StatusField from './components/StatusField';
import translations from './i18n';

const VIEW_CREATE = 'create';
const VIEW_EDIT = 'edit';
const VIEW_SHOW = 'show';

const searchableFields = [
  { name: 'contractId' },
  { name: 'description' },
  { name: 'extContractId' },
  { name: 'extContractLineId' },
  { name: 'statusId', render: { Component: StatusField, valueProp: { type: 'number' } } },
  { name: 'maxOrderValue' },
  { name: 'testNumberTypeField' },
  { name: 'createdOn' }
];

export const fields = {
  'testNumberTypeField': {
    'type': 'number',
    'constraints': {
      'required': false,
      'max': Number.MAX_VALUE
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
    'type': 'stringNumber', // TBD was stringNumber
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
  'parentContract': {
    'type': 'com.jcatalog.contract.Contract',
    'constraints': {
      'required': false
    }
  },
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
  tab({ name: 'general' },
    field({ name: 'contractId', readOnly: viewName !== VIEW_CREATE }),
    field({ name: 'description' }),
    // field({ name: 'translations', render: { Component: TranslatableTextEditor }}),
    field({ name: 'statusId', render: { Component: StatusField, valueProp: { type: 'number' } } }),
    // field({ name: 'parentContract', render: { Component: ContractReferenceSearch }}),
    // field({ name: 'currencyId', render: { Component: CurrencyField }}),
    viewName !== VIEW_CREATE && section({ name: 'auditable' },
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
    section({ name: 'order' },
      field({ name: 'minOrderValue' }),
      field({ name: 'minOrderValueRequired' }),
      field({ name: 'maxOrderValue' }),
      field({ name: 'freeShippingBoundary' }),
      field({ name: 'freightSurcharge' }),
      field({ name: 'smallVolumeSurcharge' }),
      field({ name: 'totalContractedAmount' })
    ),
    section({ name: 'type' },
      field({ name: 'isStandard' }),
      field({ name: 'isPreferred' }),
      field({ name: 'isFrameContract' }),
      field({ name: 'isInternal' }),
      field({ name: 'isOffer' })
    )
  )
];

export default {
  model: {
    name: 'Contract', // TODO remove when it is safe
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
    }
  }
};
