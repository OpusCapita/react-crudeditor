import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldBoolean from "./";
import { Checkbox } from 'react-bootstrap';

Enzyme.configure({ adapter: new Adapter() });

describe("FieldBoolean", _ => {
  it("should properly render", () => {
    const props = {
      value: true
    };
    const wrapper = Enzyme.mount(<FieldBoolean {...props} />);
    expect(wrapper.find(Checkbox).prop('checked')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should render a checkbox and pass handlers", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: false,
      value: false,
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldBoolean {...props} />);
    const checkbox = wrapper.find(Checkbox)
    checkbox.prop('onChange')()
    checkbox.prop('onBlur')()
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onBlur.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith(true)).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should mute handlers in readonly mode", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: true,
      value: false,
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldBoolean {...props} />);
    const checkbox = wrapper.find(Checkbox)
    expect(checkbox.prop('onChange')).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(checkbox.prop('onBlur')).to.not.exist; // eslint-disable-line no-unused-expressions
  });
});
