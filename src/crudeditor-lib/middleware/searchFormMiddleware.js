import { FORM_FILTER_UPDATE } from '../views/search/constants';
import { parseFormFilter } from '../views/search/actions';

export default ({ getState }) => next => action => {
  if (action.type === FORM_FILTER_UPDATE) {
    next(action)
    // explicitly call regular onBlur handler
    // it parses value and converts it into proper field type
    // and stores parsed value in formFilter
    // we can compare fromFilter and resultFilter in selectors if we need to know
    // if the form has changed or not
    next(parseFormFilter(action.payload.path))

    // const { formFilter } = getState().views[getState().common.activeViewName];
    // console.log("after parsing")
    // console.log(formFilter)
  } else {
    next(action)
  }
}
