import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import DateRangeCellRender from "./";

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

  it("should properly display the Date range if passed Date objects instead of strings", () => {
    const props = {
      name: "dateRange",
      instance: {
        dateRange: {
          from: new Date(Date.parse('2008-09-01')),
          to: new Date(Date.parse('2010-09-19'))
        }
      }
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />);
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal('1/8/2008 - 19/8/2010');
  });

  it("should return null in render function for unmatched props", () => {
    const props = {
      name: "date",
      instance: {}
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />);
    expect(wrapper.isEmptyRender()).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it("should render 'from' if 'to' is missing", () => {
    const props = {
      name: "dateRange",
      instance: {
        dateRange: {
          from: '2008-09-01'
        }
      }
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />);
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal('1/8/2008 - ...');
  });

  it("should render 'to' if 'from' is missing", () => {
    const props = {
      name: "dateRange",
      instance: {
        dateRange: {
          to: '2008-09-01'
        }
      }
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />);
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal('... - 1/8/2008');
  });
});
