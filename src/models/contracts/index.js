import superagent from 'superagent';
import DateRangeCellRender from './DateRangeCellRender';
import StatusField from './StatusField';

const VIEW_CREATE = 'create';
const VIEW_EDIT = 'edit';
const VIEW_SHOW = 'show';

const searchableFields = [
  { name: 'contractId' },
  { name: 'description' },
  { name: 'extContractId' },
  { name: 'extContractLineId' },
  { name: 'statusId', render: { Component: StatusField, valueProp: { type: 'number' } } }
];

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
  tab({ name: 'additional', disabled: viewName !== VIEW_EDIT },
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
    name: 'Contract',
    fields: {
      'contractBoilerplates': { 'type': 'collection', 'constraints': { 'required': false } },
      'hierarchyCode': { 'type': 'string', 'constraints': { 'max': 100, 'required': false } },
      'termsOfPaymentId': { 'type': 'string', 'constraints': { 'max': 20, 'required': false } },
      'description': { 'type': 'string', 'constraints': { 'max': 100, 'required': false } },
      'termsOfDeliveryId': { 'type': 'string', 'constraints': { 'max': 20, 'required': false } },
      'freeShippingBoundary': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 999999999, 'required': false } },
      'createdOn': { 'type': 'dateString', 'constraints': { 'required': true } },
      'changedOn': { 'type': 'dateString', 'constraints': { 'required': true } },
      'contractedCatalogs': { 'type': 'collection', 'constraints': { 'required': false } },
      'minOrderValueRequired': { 'type': 'boolean', 'constraints': { 'required': false } },
      'contractedClassificationGroups': { 'type': 'collection', 'constraints': { 'required': false } },
      'extContractId': { 'type': 'string', 'constraints': { 'max': 10, 'required': false } },
      'children': { 'type': 'collection', 'constraints': { 'required': false } },
      'changedBy': { 'type': 'string', 'constraints': { 'required': true } },
      'translations': { 'type': 'collection', 'constraints': { 'required': false } },
      'usages': { 'type': 'collection', 'constraints': { 'required': false } },
      'currencyId': { 'type': 'string', 'constraints': { 'max': 3, 'required': false } },
      'isFrameContract': { 'type': 'boolean', 'constraints': { 'required': false } },
      'totalContractedAmount': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 999999999, 'required': false } },
      'smallVolumeSurcharge': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 999999999, 'required': false } },
      'provisionings': { 'type': 'collection', 'constraints': { 'required': false } },
      'isOffer': { 'type': 'boolean', 'constraints': { 'required': false } },
      'maxOrderValue': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 999999999, 'required': true } },
      'validRange': { 'type': 'com.jcatalog.core.DateRange', 'constraints': { 'required': false } },
      'isPreferred': { 'type': 'boolean', 'constraints': { 'required': false } },
      'isInternal': { 'type': 'boolean', 'constraints': { 'required': false } },
      'contractCategory': { 'type': 'com.jcatalog.contract.ContractCategory', 'constraints': { 'required': false } },
      'freightSurcharge': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 999999999, 'required': false } },
      'isStandard': { 'type': 'boolean', 'constraints': { 'required': false } },
      'statusId': { 'type': 'numberString', 'constraints': { 'min': 0, 'max': 800, 'integer': true, 'required': false } },
      'createdBy': { 'type': 'string', 'constraints': { 'required': true } },
      'extContractLineId': { 'type': 'string', 'constraints': { 'max': 10, 'required': false } },
      'contractId': { unique: true, 'type': 'string', 'constraints': { 'max': 100, 'required': true } },
      'parentContract': { 'type': 'com.jcatalog.contract.Contract', 'constraints': { 'required': false } },
      'minOrderValue': {
        'type': 'numberString',
        'constraints': {
          'min': 0,
          'max': 999999999,
          'integer': true,
          'required': false
        }
      }
    },
    validate(instance) {
      if (instance.minOrderValueRequired && instance.minOrderValue === null) {
        throw [{
          code: 400,
          id: 'requiredFieldMissing',
          message: 'minOrderValue must be set when minOrderValueRequired is true'
        }];
      }

      return true;
    }
  },
  api: {
    get({ instance }) {
      console.log('Making API-get call', JSON.stringify(instance));
      return superagent.
        get('/api/contracts/').
        query({ instance }).
        accept('json').
        then(({ body: instance }) => instance).
        catch(({ status, response: { body } }) => Promise.reject({
          code: body && body.code || status,
          payload: body ?
            (body.message ? body.message : body) :
            undefined
        }));
    },
    search({ filter, sort, order, offset, max }) {
      console.log('Making API-search call', JSON.stringify({ filter, sort, order, offset, max }));
      return superagent.
        get('/api/contracts').
        query({ filter, sort, order, offset, max }).
        accept('json').
        then(({
          header: {
            'content-range': contentRange
          },
          body: instances
        }) => ({
          totalCount: Number(contentRange.substring(contentRange.indexOf('/') + 1)),
          instances
        }));
    },
    delete({ instances }) {
      console.log('Making API-delete call');
      return superagent.
        del('/api/contracts').
        send(instances).
        accept('json').
        then(({ body: deletedCount }) => deletedCount);
    },
    create({ instance }) {
      console.log('Making API-create call');
      return superagent.
        post('/api/contracts').
        send(instance).
        accept('json');
    },
    update({ instance }) {
      console.log('Making API-update call', JSON.stringify(instance));
      const { contractId } = instance;
      return superagent.
        put('/api/contracts/' + encodeURIComponent(contractId)).
        send(instance).
        accept('json').
        then(({ body: instance }) => instance);
    }
  },
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
      defaultNewInstance: (({ filter }) => Object.keys(filter).reduce(
        (rez, fieldName) => {
          let isRange;

          searchableFields.some(fieldMeta => {
            if (fieldMeta.name === fieldName) {
              isRange = fieldMeta.render.isRange;
              return true;
            }
          });

          return isRange || filter[fieldName] === null ?
            rez : {
              ...rez,
              [fieldName]: filter[fieldName]
            };
        },
        {}
      )),
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
