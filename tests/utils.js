import sinon from 'sinon';

/*█████████████████████████████████*\
 *███ NO CONSOLE ERRORS ALLOWED ███*
\*█████████████████████████████████*/

beforeEach(_ => sinon.stub(console, 'error'));

afterEach(_ => {
  sinon.assert.notCalled(console.error);
  console.error.restore();
});

// Usage:
// import './utils';
