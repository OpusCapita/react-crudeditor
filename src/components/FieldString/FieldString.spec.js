import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldString from "./";
import FormControl from 'react-bootstrap/lib/FormControl';

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
});
