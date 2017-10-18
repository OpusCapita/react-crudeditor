import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import FieldString from "./";
import { FormControl } from 'react-bootstrap';

const doc = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = doc;
global.document = window.document;
global.window = window;

Enzyme.configure({ adapter: new Adapter() });

describe("FieldString", _ => {
  it("should properly render a FormControl", () => {
    const props = {
      value: 'some string'
    };
    const wrapper = Enzyme.mount(<FieldString {...props} />);
    expect(wrapper.find(FormControl).prop('value')).to.equal(props.value); // eslint-disable-line no-unused-expressions
  });

  it("should pass an empty string value for null/undefined value prop", () => {
    const props = {
      value: null
    };
    const wrapper = Enzyme.mount(<FieldString {...props} />);
    expect(wrapper.find(FormControl).prop('value')).to.equal(''); // eslint-disable-line no-unused-expressions
  });

  it("should render a FormControl and pass handlers", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: false,
      value: 'some string',
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldString {...props} />);
    const fc = wrapper.find(FormControl)
    fc.prop('onChange')({ target: { value: 'new string' } })
    fc.prop('onBlur')()
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onBlur.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith('new string')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should mute handlers in readonly mode", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: true,
      value: 'some other string',
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldString {...props} />);
    const fc = wrapper.find(FormControl)
    expect(fc.prop('value')).to.equal(props.value);
    expect(fc.prop('onChange')).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(fc.prop('onBlur')).to.not.exist; // eslint-disable-line no-unused-expressions
  });
});
