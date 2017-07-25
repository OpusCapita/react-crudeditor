import FieldString from './FieldString';
import FieldBoolean from './FieldBoolean';

export default fieldType =>
  fieldType === 'string'  && FieldString ||
  fieldType === 'number'  && FieldString ||
  fieldType === 'date'    && FieldString ||
  fieldType === 'boolean' && FieldBoolean;
