import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Spinner from './Spinner';
import DefaultSpinner from './DefaultSpinner';

describe('uiSpinner', () => {
  it('should have a default component initially', () => {
    const wrapper = shallow(Spinner.component)
    expect(wrapper.contains(<DefaultSpinner/>)).to.be.true; // eslint-disable-line no-unused-expressions
  })

  it('should replace default component with a custom one', () => {
    const CustomComponent = _ => (<b>Hi</b>);
    Spinner.setComponent(CustomComponent);
    const wrapper = shallow(Spinner.component)
    expect(wrapper.contains(<DefaultSpinner/>)).to.be.false; // eslint-disable-line no-unused-expressions
    expect(wrapper.contains(<CustomComponent/>)).to.be.true; // eslint-disable-line no-unused-expressions
  })

  it('should properly show/hide itself', () => {
    Spinner.show();
    expect(Spinner.loadingTasks).to.equal(1);
    expect(document.querySelector('span.spinner')).to.exist; // eslint-disable-line no-unused-expressions
    Spinner.show();
    expect(Spinner.loadingTasks).to.equal(2);
    expect(document.querySelector('span.spinner')).to.exist; // eslint-disable-line no-unused-expressions
    Spinner.hide()
    expect(Spinner.loadingTasks).to.equal(1);
    expect(document.querySelector('span.spinner')).to.exist; // eslint-disable-line no-unused-expressions
    Spinner.hide()
    expect(Spinner.loadingTasks).to.equal(0);
    expect(document.querySelector('span.spinner')).to.not.exist; // eslint-disable-line no-unused-expressions
    Spinner.hide()
    Spinner.hide()
    expect(Spinner.loadingTasks).to.equal(0);
  })
})
