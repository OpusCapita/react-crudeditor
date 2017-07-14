function security(user) {
  const EDIT_PERMISSION = 2;
  return EDIT_PERMISSION;
}

const general = {
  singularEntityName: 'author',
  pluralEntitiesName: 'authors',
  fields: {
    id: {
      title      : 'ID',
      type       : 'string',
      isUnique   : true,
      isRequired : true,
      validation : value => /^\d+$/.test(value)
    },
    firstName: {
      title      : 'First Name',
      type       : 'string',
      isUnique   : false,
      isRequired : true,
      validation : value => value && value.length > 2 && value.length < 22 && /^\S+$/.test(value)
    },
    lastName: {
      title      : 'Last Name',
      type       : 'string',
      isUnique   : false,
      isRequired : true,
      validation : value => value && value.length > 2 && value.length < 22 && /^\S+$/.test(value)
    },
    isActive: {
      title      : 'Alive',
      type       : 'bool',
      isUnique   : false,
      isRequired : false
    }
  }
};

const search = {
  component: null,  // Custom React component in place of default one.
  listFields: ['id', 'firstName', 'lastName'],
  filters: {
    fullNameSubstr(str, author) {
      str = str.toLowerCase();

      return '${author.firstName} ${author.lastName}'.toLowerCase().includes(str) ||
        '${author.lastName} ${author.firstName}'.toLowerCase().includes(str) ||
        '${author.lastName}, ${author.firstName}'.toLowerCase().includes(str)
    },
    simpleSearch(str, author) {
      str = str.toLowerCase();
      let searchFields: ['id', 'firstName', 'lastName'];
      return searchFields.some(fieldName => author[fieldName].toLowerCase().includes(str));
    }
  }
};

function createOrEdit(mode) {
  let rez = {
    component: null,  // Custom React component in place of default one.
    listFields: ['firstName', 'lastName', 'isActive'],
    validate: {
      individualField(fieldName, fieldValue) {
        // The function return error object in case of error or null in case of success.
        switch (fieldName) {
          case 'firstName':
            if (!fieldValue) {
              return [new Error('First Name must not be empty')];
            }
            break;
          case 'lastName':
            if (!fieldValue) {
              return [new Error('Last Name must not be empty')];
            }
            break;
        }

        return null;
      },
      allFields(author) {
        let fieldsErrors = Object.entries(author).reduce((fieldsErrors, [fieldName, fieldValue]) => {
          let fieldErrors = this.individualField(fieldName, fieldValue);

          if (fieldErrors) {
            fieldsErrors[fieldName] = fieldErrors;
          }

          return fieldsErrors;
        }, {});

        if (Object.keys(fieldErrors).length) {
          return fieldErrors;
        }

        if (author.lastName === author.firstName) {
          return {
            firstName: [new Error('First Name and Last Name must differ')],
            lastName: [new Error('First Name and Last Name must differ')]
          }
        }

        return null;
      }
    }
  };

  return rez;
}

export default {
  general,
  security,
  search,
  createOrEdit
};
