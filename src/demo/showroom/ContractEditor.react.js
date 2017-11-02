// import '../../../styles/main.scss';
// import '../client/global-styles.less';
import buildModel from '../models';
import createCrud from '../../crudeditor-lib';

const model = buildModel('contracts');

const CrudEditor = createCrud(model);

export default CrudEditor;
