import superagent from 'superagent'
import DateRangeCellRender from './DateRangeCellRender';
import StatusField from './StatusField';

const VIEW_CREATE = 'create';
const VIEW_EDIT = 'edit';
const VIEW_SHOW = 'show';

export default {
  model: {
    name: 'Contract',
    idField: 'contractId',
    fields: {
      'contractBoilerplates': {'type': 'collection', 'constraints': {'required': false}},
      'hierarchyCode': {'type': 'string', 'constraints': {'max': 100, 'required': false}},
      'termsOfPaymentId': {'type': 'string', 'constraints': {'max': 20, 'required': false}},
      'description': {'type': 'string', 'constraints': {'max': 100, 'required': false}},
      'termsOfDeliveryId': {'type': 'string', 'constraints': {'max': 20, 'required': false}},
      'freeShippingBoundary': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}},
      'createdOn': {'type': 'date', 'constraints': {'required': true}},
      'changedOn': {'type': 'date', 'constraints': {'required': true}},
      'contractedCatalogs': {'type': 'collection', 'constraints': {'required': false}},
      'minOrderValueRequired': {'type': 'boolean', 'constraints': {'required': false}},
      'contractedClassificationGroups': {'type': 'collection', 'constraints': {'required': false}},
      'extContractId': {'type': 'string', 'constraints': {'max': 10, 'required': false}},
      'children': {'type': 'collection', 'constraints': {'required': false}},
      'changedBy': {'type': 'string', 'constraints': {'required': true}},
      'translations': {'type': 'collection', 'constraints': {'required': false}},
      'usages': {'type': 'collection', 'constraints': {'required': false}},
      'currencyId': {'type': 'string', 'constraints': {'max': 3, 'required': false}},
      'isFrameContract': {'type': 'boolean', 'constraints': {'required': false}},
      'totalContractedAmount': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}},
      'smallVolumeSurcharge': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}},
      'provisionings': {'type': 'collection', 'constraints': {'required': false}},
      'isOffer': {'type': 'boolean', 'constraints': {'required': false}},
      'maxOrderValue': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}},
      'validRange': {'type': 'com.jcatalog.core.DateRange', 'constraints': {'required': false}},
      'isPreferred': {'type': 'boolean', 'constraints': {'required': false}},
      'isInternal': {'type': 'boolean', 'constraints': {'required': false}},
      'contractCategory': {'type': 'com.jcatalog.contract.ContractCategory', 'constraints': {'required': false}},
      'freightSurcharge': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}},
      'isStandard': {'type': 'boolean', 'constraints': {'required': false}},
      'statusId': {'type': 'string', 'constraints': {'max': 20, 'required': true}},
      'createdBy': {'type': 'string', 'constraints': {'required': true}},
      'extContractLineId': {'type': 'string', 'constraints': {'max': 10, 'required': false}},
      'contractId': {'type': 'string', 'constraints': {'max': 100, 'required': true}},
      'parentContract': {'type': 'com.jcatalog.contract.Contract', 'constraints': {'required': false}},
      'minOrderValue': {'type': 'number', 'constraints': {'min': 0, 'max': 999999999, 'required': false}}
    }
  },
  api: {
    get(id) {
      console.log('Making API-get call');
      return superagent.
        get('/api/contracts/' + encodeURIComponent(id)).
        accept('json').
        then(({ body }) => body);
    },
    search({ filter, sort, order, offset, max }) {
      console.log('Making API-search call');
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
    delete(ids) {
      console.log('Making API-delete call');
      return superagent.
        del('/api/contracts').
        send(ids).
        accept('json').
        then(({ body: deletedCount }) => deletedCount);
    },
    create(instance) {
      console.log('Making API-create call');
      return superagent.
        post('/api/contracts').
        send(instance).
        accept('json');
    },
    update(instance) {
      console.log('Making API-update call');
      const {contractId} = instance;
      return superagent.
        put('/api/contracts/' + encodeURIComponent(contractId)).
        send(instance).
        accept('json');
    }
  },
  ui: {
    search: _ => ({
      searchableFields: [
        { name: 'contractId', },
        { name: 'description' },
        { name: 'extContractId' },
        { name: 'extContractLineId' },
        { name: 'statusId', Component: StatusField }
      ],
      resultFields: [
        { name: 'contractId', sortable: true },
        { name: 'description', sortable: true },
        { name: 'extContractId', sortable: true },
        { name: 'extContractLineId', sortable: true },
        { name: 'validRange', Component: DateRangeCellRender }]
    }),
    createEditShow: viewName => ({
      instanceDescription: instance => viewName === VIEW_EDIT && instance ? instance._objectLabel : '',
      formLayout: instance => [
        {
          tab: 'general',
          entries: [
            { field: 'contractId', mode: viewName === VIEW_CREATE ? 'writable' : 'readonly' },
            { field: 'description' },
            //{ field: 'translations', Component: TranslatableTextEditor },
            { field: 'statusId', Component: StatusField },
            //{ field: 'parentContract', Component: ContractReferenceSearch },
            //{ field: 'currencyId', Component: CurrencyField },
            {
              section: 'auditable',
              mode: viewName === VIEW_CREATE ? 'hidden' : 'visible',
              entries: [
                { field: 'createdBy', mode: 'readonly' },
                { field: 'createdOn', mode: 'readonly' },
                { field: 'changedBy', mode: 'readonly' },
                { field: 'changedOn', mode: 'readonly' }
              ]
            }
          ],
        },
        { tab: 'catalogs' },
        { tab: 'customer' },
        { tab: 'boilerplates' },
        { tab: 'supplier' },
        { tab: 'groups' },
        {
          tab: 'additional',
          mode: viewName === VIEW_EDIT ? 'enabled' : 'disabled',
          entries: [
            {
              section: 'order',
              entries: [
                { field: 'minOrderValue' },
                { field: 'minOrderValueRequired' },
                { field: 'maxOrderValue' },
                { field: 'freeShippingBoundary' },
                { field: 'freightSurcharge' },
                { field: 'smallVolumeSurcharge' },
                { field: 'totalContractedAmount' }
              ]
            },
            {
              section: 'type',
              entries: [
                { field: 'isStandard' },
                { field: 'isPreferred' },
                { field: 'isFrameContract' },
                { field: 'isInternal' },
                { field: 'isOffer' }
              ]
            }
          ]
        }
      ]
    })
  }
};
