import {createEditor} from '../crud';

import Joi from 'joi-browser';

import superagent from 'superagent'

const TranslatableTextEditor = function(props) {
  return null;
};

const DateRangeField = function (props) {
  return null;
};

const DateField = function (props) {
  return null;
};

const StatusField = function(props) {
  const {id, value, onChange, onBlur} = props;
  return (
    <select id={id} className="form-control" value={value}
            onChange={(target: {value}) => {
              onChange(value);
            }} onBlur={onBlur}>
      <option value="100">100 (new)</option>
      <option value="105">105 (changed)</option>
      <option value="400">400 (confirmed)</option>
      <option value="800">800 (deleted)</option>
    </select>
  );
};

const DateRangeCellRender = function(props) {
  const {name, object} = props;
  const value = object[name] || {};

  return `${value.from || '...'} - ${value.to || '...'}`;
};

const schema = Joi.schema({
  contractId:  Joi.string().required(),
  description:  Joi.string(),
  descLong:  Joi.string(),
  statusId:  Joi.string()
});

/**
 * You can use the editor as
 *
 * {/*edit contract/*}
 * <ContractEditor view="edit" initState={{id: contractId}}/>
 */
export default createEditor({
  /**
   * Unique identity of editor, [EntryName]
   */
  name: 'contract',
  /**
   * Provide API, to common CRUD editor operations
   * edit,
   * delete,
   * search,
   * load
   *
   * Should return Promise object
   */
  api: {
    /**
     * Load object on edit page
     *
     * @param id - identity key
     *
     * note: the {id} parameter should be any Type {String|Object}
     *
     * @returns {Promise}
     */
    get(id) {
      return superagent.get('/api/contracts/' + encodeURIComponent(id));
    },

    /**
     * Search by contract
     *
     * @param filter - filter params (object from search form)
     *
     * @param resultOptions - in depends on to result output
     * @param resultOptions.offset - offset
     * @param resultOptions.max - max result
     * @param resultOptions.sort - sort field name
     * @param resultOptions.order - one of [asc, desc] value
     *
     * @returns {Promise}
     */
    search(filter, resultOptions) {
      const {sort, order, offset, max} = resultOptions;

      return superagent.get('/api/contracts').query({filter, sort, order, offset, max});
    },
    /**
     * Delete selected items
     *
     * @param selected - selected
     *
     * @returns {Promise}
     */
    deleteSelected(selected) {
      return superagent.del('/api/contracts').send({selected});
    },
    /**
     * Create new object
     *
     * @param object - object to create new
     *
     * @returns {Promise}
     */
    create(object) {
      return superagent.post('/api/contracts').send(object);
    },
    /**
     * Save exists object
     *
     * @param object - object to save
     */
    save(object) {
      const {contractId} = object;
      return superagent.put('/api/contracts/' + encodeURIComponent(contractId)).send(object);
    }
  },
  /**
   * Search form field config
   *
   * where entry:
   *
   * entry.name - <String>(REQUIRED) field name
   * entry.type - <String>(OPTIONAL) - input type, one of ['date', 'string', 'number', 'boolean'], (by default 'string')
   * entry.readOnly - <Boolean>(OPTIONAL) - render input as read only ?(need to check this use case)?
   * entry.component - <ReactComponent>(OPTIONAL) - override default Input component
   *
   */
  searchableFields: [
    {
      name: 'contractId'
    },
    {
      name: 'description'
    },
    {
      name: 'extContractId'
    },
    {
      name: 'extContractLineId'
    },
    {
      name: 'statusId',
      component: StatusField
    },
  ],
  /**
   * Search result field config
   *
   * where entry:
   *
   * entry.name - <String>(REQUIRED) field name
   * entry.sortable - <Boolean>(OPTIONAL) - sortable field if is true (false by default)
   * entry.type - <String>(OPTIONAL) - cell type, one of ['date', 'string', 'number', 'boolean'], (by default 'string')
   * entry.component - <ReactComponent>(OPTIONAL) - override default Cell render with custom react component
   *
   * field entry for example:
   *  {
   *    title: 'Date Range',
   *    component: function(props) {
   *      const {name, object} = props;
   *      const value = object[name] || {};
   *
   *      return `${value.from || '...'} - ${value.to || '...'}`
   *    }
   *  }
   */
  searchResultFields: [
    {
      name: 'contractId',
      sortable: true,
    },
    {
      name: 'description',
      sortable: true,
    },
    {
      name: 'extContractId',
      sortable: true,
    },
    {
      name: 'extContractLineId',
      sortable: true
    },
    {
      name: 'validRange',
      component: DateRangeCellRender
    }
  ],
  /**
   * Get editable fields
   *
   * @param object - the object to edit
   * @param options - editable options
   * @param options.mode - edit mode [create|edit|view]
   *
   * @returns list of editable fields
   *
   * where entry:
   *
   * entry.name - <String>(REQUIRED) field name
   * entry.type - <String>(OPTIONAL) - field type, one of ['date', 'string', 'number', 'boolean'], (by default 'string')
   * entry.readOnly - <Boolean>(OPTIONAL) read only state for the field
   * entry.component - <ReactComponent>(OPTIONAL) - override default Cell render with custom react component
   * entry.section - <String>(OPTIONAL) - group by section key
   * entry.tab - <String>(OPTIONAL) - group by tab key (by default 'general')
   */
  getEditableFields(object, options) {
    const {mode} = options;

    const result = [
      /**
       * ============================
       * tab = [General]
       * ============================
       */
      {
        name: 'contractId',
        readOnly: mode !== 'create',
      },
      {
        name: 'description',
      },
      {
        name: 'descLong',
        component: TranslatableTextEditor
      },
      {
        name: 'statusId',
        component: StatusField
      },
      /**
       * ============================
       * tab = [Additional]
       * ============================
       */
      /**
       * ----------------------------
       * section = [Order]
       * ----------------------------
       */
      {
        name: 'minOrderValue',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'minOrderValueRequired',
        type: 'boolean',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'maxOrderValue',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'freeShippingBoundary',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'freightSurcharge',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'smallVolumeSurcharge',
        tab: 'additional',
        section: 'order'
      },
      {
        name: 'totalContractedAmount',
        tab: 'additional',
        section: 'order'
      },
      /**
       * ----------------------------
       * section = [Type]
       * ----------------------------
       */
      {
        name: 'isStandard',
        type: 'boolean',
        tab: 'additional',
        section: 'type'
      },
      {
        name: 'isPreferred',
        type: 'boolean',
        tab: 'additional',
        section: 'type'
      },
      {
        name: 'isFrameContract',
        type: 'boolean',
        tab: 'additional',
        section: 'type'
      },
      {
        name: 'isInternal',
        type: 'boolean',
        tab: 'additional',
        section: 'type'
      },
      {
        name: 'isOffer',
        type: 'boolean',
        tab: 'additional',
        section: 'type'
      }
    ];

    if (mode !== 'create') {
      result.push({
        name: 'createdBy',
        section: 'auditable',
        readOnly: true
      });

      result.push({
        name: 'createdOn',
        section: 'auditable',
        readOnly: true,
        component: DateField
      });

      result.push({
        name: 'changedBy',
        section: 'auditable',
        readOnly: true
      });

      result.push({
        name: 'changedOn',
        section: 'auditable',
        readOnly: true,
        component: DateField
      });
    }

    return result;
  },
  /**
   * Validate function
   *
   * @param object - checked object to validate
   * @param onErrors - handler to result errors (object is valid if value is undefined)
   * @param options - specified validate config
   * @param options.field - validate only for field
   * @param options.mode - context mode variable
   */
  validate(object, onErrors, options) {
    const {field, mode} = options;

    Joi.validate(object, schema, {
      abortEarly: false,
      allowUnknown: true
    }, function(errors) {
      onErrors(errors);
    });
  },
});