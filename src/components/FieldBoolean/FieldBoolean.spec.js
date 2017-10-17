import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldBoolean from "./";
import { JSDOM } from 'jsdom';
import { Checkbox } from 'react-bootstrap';

const doc = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = doc;
global.document = window.document;
global.window = window;

Enzyme.configure({ adapter: new Adapter() });

describe("FieldBoolean", _ => {
  it("should properly render", () => {
    const props = {
      value: true
    };
    const wrapper = Enzyme.mount(<FieldBoolean {...props} />);
    expect(wrapper.find(Checkbox).prop('checked')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should mute handlers when receives readOnly = true", () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const props = {
      readOnly: true,
      onChange,
      onBlur
    };
    const wrapper = Enzyme.mount(<FieldBoolean {...props} />);
    expect(wrapper.prop('handleChange')).to.not.exist; // eslint-disable-line no-unused-expressions
    expect(wrapper.prop('handleBlur')).to.not.exist; // eslint-disable-line no-unused-expressions
  });
});
