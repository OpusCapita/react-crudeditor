import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Spinner from './Spinner';
import DefaultSpinner from './DefaultSpinner';

describe('uiSpinner', () => {
  it('should have a default component initially', () => {
    const wrapper = shallow(Spinner.component)
    expect(wrapper.contains(<DefaultSpinner/>)).to.equal(true);
  })

  it('should ', () => {
    Spinner.start();
    expect(Spinner.loadingTasks).to.equal(1);
    console.log(document.querySelector('span.spinner'))
  })
})