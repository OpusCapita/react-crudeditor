import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import StatusField from "./";
import { JSDOM } from 'jsdom';
import { FormControl } from 'react-bootstrap';

const doc = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = doc;
global.document = window.document;
global.window = window;

Enzyme.configure({ adapter: new Adapter() });

describe("StatusField", _ => {
  it("renders with a passed value", () => {
    const props = {
      value: 100,
      readOnly: false,
      onChange: _ => null,
      onBlur: _ => null
    };
    const wrapper = Enzyme.mount(<StatusField {...props} />);
    expect(wrapper.find(FormControl).get(0).props.value).to.equal(props.value);
  });
});
