// Default field INPUT for Search/Edit/Create forms.

import FieldString from '../../../components/FieldString';
import FieldBoolean from '../../../components/FieldBoolean';

export default fieldType =>
  fieldType === 'string'  && FieldString ||
  fieldType === 'number'  && FieldString ||
  fieldType === 'date'    && FieldString ||
  fieldType === 'boolean' && FieldBoolean;
