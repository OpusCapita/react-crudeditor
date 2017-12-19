import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldDate from "./";
import { DateInput } from '@opuscapita/react-dates';
import { I18nManager } from '@opuscapita/i18n';

const context = { i18n: new I18nManager() }

Enzyme.configure({ adapter: new Adapter() });

describe("FieldDate", _ => {
  it("should properly render a DateInput", () => {
    const props = {
      value: new Date()
    };
    const wrapper = Enzyme.mount(<FieldDate {...props} />, {
      context
    });
    expect(wrapper.find(DateInput).prop('value')).to.equal(props.value); // eslint-disable-line no-unused-expressions
  });

  it("should pass a null value for null/undefined value prop", () => {
    const props = {};
    const wrapper = Enzyme.mount(<FieldDate {...props} />, {
      context
    });
    expect(wrapper.find(DateInput).prop('value')).to.equal(null); // eslint-disable-line no-unused-expressions
  });

  it("should render a DateInput and pass handlers", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: false,
      value: new Date('2011-10-04'),
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldDate {...props} />, {
      context
    });
    const fc = wrapper.find(DateInput)
    const d = new Date();
    fc.prop('onChange')(d)
    expect(onChange.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onChange.calledWith(d)).to.be.true; // eslint-disable-line no-unused-expressions
    expect(onBlur.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should not pass handlers when in readOnly mode", () => {
    const onChange = sinon.spy();
    const props = {
      readOnly: true,
      value: new Date('2011-10-04'),
      onChange
    };
    const wrapper = Enzyme.mount(<FieldDate {...props} />, {
      context
    });
    const fc = wrapper.find(DateInput)
    expect(fc.prop('onChange')()).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(fc.prop('onBlur')).to.equal(DateInput.defaultProps.onBlur)
  });
});
