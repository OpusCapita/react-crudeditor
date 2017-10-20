import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldDate from "./";
import { DateInput } from '@opuscapita/react-dates';

Enzyme.configure({ adapter: new Adapter() });

describe("FieldDate", _ => {
  it("should properly render a DateInput", () => {
    const props = {
      value: new Date()
    };
    const wrapper = Enzyme.mount(<FieldDate {...props} />);
    expect(wrapper.find(DateInput).prop('value')).to.equal(props.value); // eslint-disable-line no-unused-expressions
  });

  it("should pass a null value for null/undefined value prop", () => {
    const props = {};
    const wrapper = Enzyme.mount(<FieldDate {...props} />);
    expect(wrapper.find(DateInput).prop('value')).to.equal(null); // eslint-disable-line no-unused-expressions
  });

  it("should render a DateInput and pass handlers", () => {
    const onChange = sinon.spy();
    const props = {
      readOnly: false,
      value: new Date('2011-10-04'),
      onChange
    };
    const wrapper = Enzyme.mount(<FieldDate {...props} />);
    const fc = wrapper.find(DateInput)
    const d = new Date();
    fc.prop('onChange')(d)
    fc.prop('onBlur')()
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith(d)).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
