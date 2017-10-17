import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import DateRangeCellRender from "./";
import { JSDOM } from 'jsdom'

const doc = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = doc;
global.document = window.document;
global.window = window;

Enzyme.configure({ adapter: new Adapter() });

describe("DateRangeCellRender", _ => {
  it("should properly display the Date range", () => {
    const props = {
      name: "dateRange",
      instance: {
        dateRange: {
          from: '2008-09-01',
          to: '2010-09-19'
        }
      }
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />);
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal('1/8/2008 - 19/8/2010');
  });
});
