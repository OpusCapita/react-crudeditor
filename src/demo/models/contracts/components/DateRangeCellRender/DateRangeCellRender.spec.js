import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import DateRangeCellRender from "./";
import { I18nManager } from '@opuscapita/i18n';

Enzyme.configure({ adapter: new Adapter() });

describe("DateRangeCellRender", _ => {
  const i18n = new I18nManager();

  const context = { i18n }

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
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props}/>, {
      context
    });
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal(
      i18n.formatDate(new Date(props.instance.dateRange.from)) +
      ' - ' +
      i18n.formatDate(new Date(props.instance.dateRange.to))
    );
  });

  it("should properly display the Date range if passed Date objects instead of strings", () => {
    const props = {
      name: "dateRange",
      instance: {
        dateRange: {
          from: new Date('2008-09-01'),
          to: new Date('2010-09-19')
        }
      }
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />, {
      context
    });
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal(
      i18n.formatDate(props.instance.dateRange.from) + ' - ' + i18n.formatDate(props.instance.dateRange.to)
    );
  });

  it("should return null in render function for unmatched props", () => {
    const props = {
      name: "date",
      instance: {}
    };
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />, {
      context
    });
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
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />, {
      context
    });
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal(i18n.formatDate(new Date(props.instance.dateRange.from)) + ' - ...');
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
    const wrapper = Enzyme.mount(<DateRangeCellRender {...props} />, {
      context
    });
    expect(wrapper.exists()).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.find('span').text()).to.equal('... - ' + i18n.formatDate(new Date(props.instance.dateRange.to)));
  });
});
