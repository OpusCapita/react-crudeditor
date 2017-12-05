import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldNumber from "./";
import { FormControl } from 'react-bootstrap';
import { I18nManager } from '@opuscapita/i18n';

const i18n = new I18nManager();
const context = { i18n };

Enzyme.configure({ adapter: new Adapter() });

describe("FieldNumber", _ => {
  it("should properly render a FormControl", () => {
    const props = {
      value: 342
    };
    const formattedProp = i18n.formatNumber(props.value);
    const wrapper = Enzyme.mount(<FieldNumber {...props} />, {
      context
    });
    expect(wrapper.find(FormControl).prop('value')).
      to.equal(formattedProp); // eslint-disable-line no-unused-expressions
  });

  it("should pass an empty string value for null/undefined value prop", () => {
    const props = {
      value: null
    };
    const wrapper = Enzyme.mount(<FieldNumber {...props} />, {
      context
    });
    expect(wrapper.find(FormControl).prop('value')).to.equal(''); // eslint-disable-line no-unused-expressions
  });

  it("should render a decimal input and pass handlers", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const onFocus = sinon.spy();
    const props = {
      readOnly: false,
      value: 4535,
      onChange,
      onBlur,
      onFocus,
      type: 'decimal'
    };
    const wrapper = Enzyme.mount(<FieldNumber {...props} />, {
      context
    });
    expect(wrapper.find(FormControl).prop('value')).to.equal(i18n.formatDecimalNumber(props.value))
    expect(wrapper.find(FormControl).prop('onBlur')).to.equal(onBlur)
    expect(wrapper.find(FormControl).prop('onFocus')).to.equal(onFocus)
  });

  it("should mute handlers in readonly mode", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const onFocus = sinon.spy();
    const props = {
      readOnly: true,
      value: 4535,
      onChange,
      onBlur,
      onFocus
    };
    const wrapper = Enzyme.mount(<FieldNumber {...props} />, {
      context
    });
    expect(wrapper.find(FormControl).prop('value')).to.equal(i18n.formatNumber(props.value));
    expect(wrapper.find(FormControl).prop('onBlur')).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(wrapper.find(FormControl).prop('onFocus')).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(wrapper.find(FormControl).prop('onChange')).to.not.exist; // eslint-disable-line no-unused-expressions
  });
});
