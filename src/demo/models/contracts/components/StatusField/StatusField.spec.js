import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import StatusField from "./";
import { FormControl } from 'react-bootstrap';
import { I18nManager } from '@opuscapita/i18n'

Enzyme.configure({ adapter: new Adapter() });

const context = {
  i18n: new I18nManager()
}

describe("StatusField", _ => {
  it("should properly render a FormControl and pass handlers", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      value: null,
      onBlur,
      onChange,
      readOnly: false
    };
    const wrapper = Enzyme.mount(<StatusField {...props}/>, { context });
    const fc = wrapper.find(FormControl);
    expect(fc.prop('value')).to.equal('');
    expect(fc.prop('disabled')).to.equal(props.readOnly);
    fc.prop('onChange')({ target: { value: '200' } })
    fc.prop('onBlur')()
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onBlur.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith(200)).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should create a muted onChange handler if none passed in props", () => {
    const wrapper = Enzyme.mount(<StatusField/>, { context });
    const fc = wrapper.find(FormControl);
    expect(fc.prop('onChange')).to.exist; // eslint-disable-line no-unused-expressions
    const result = fc.prop('onChange')({ target: { value: '200' } });
    expect(result).to.not.exist; // eslint-disable-line no-unused-expressions
  });

  it("should pass 0 as a number to select element", () => {
    const wrapper = Enzyme.mount(<StatusField value={0} />, { context });
    expect(wrapper.find(FormControl).prop('value')).to.equal(0); // eslint-disable-line no-unused-expressions
  });

  it("should pass a number to select element", () => {
    const wrapper = Enzyme.mount(<StatusField value={34} />, { context });
    expect(wrapper.find(FormControl).prop('value')).to.equal(34); // eslint-disable-line no-unused-expressions
  });

  it("should check if onChange receives defined value", () => {
    const onChange = sinon.spy();
    const props = {
      onChange
    };
    const wrapper = Enzyme.mount(<StatusField {...props} />, { context });
    const fc = wrapper.find(FormControl);
    fc.prop('onChange')({ target: { value: 'I am Not A Number' } })
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith(null)).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
