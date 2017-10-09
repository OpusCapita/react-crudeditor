import { select, all } from 'redux-saga/effects';

import { onInstancesSearch } from '../sagas';
import { MIN_ENTITY_CONFIGURATION } from './constants';

import {
  getResultFilter,
  getSortField,
  getSortOrder,
  getPageMax,
  getPageOffset
} from '../selectors';

describe('search sagas', () => {
  const gen = onInstancesSearch(MIN_ENTITY_CONFIGURATION, {
    payload: {
      filter: { description: 'le' }
    },
    meta: { source: 'owner' }
  });

  it('should search for instances', () => {
    expect(
      gen.next().value
    ).toEqual(all([
      select(getResultFilter, MIN_ENTITY_CONFIGURATION),
      select(getSortField, MIN_ENTITY_CONFIGURATION),
      select(getSortOrder, MIN_ENTITY_CONFIGURATION),
      select(getPageMax, MIN_ENTITY_CONFIGURATION),
      select(getPageOffset, MIN_ENTITY_CONFIGURATION)
    ]));
  });
});
