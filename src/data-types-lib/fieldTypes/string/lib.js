import { EMPTY_VALUE } from '../../constants';

export const isValid = value => value === EMPTY_VALUE || typeof value === 'string';
