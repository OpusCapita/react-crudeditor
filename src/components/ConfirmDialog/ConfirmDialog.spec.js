import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai';
import sinon from 'sinon';
import ConfirmDialog from './';
import { I18nManager } from '@opuscapita/i18n';

Enzyme.configure({ adapter: new Adapter() });

const context = {
  i18n: new I18nManager()
}

describe("ConfirmDialog", _ => {
  it("should properly render", () => {
    const onClick = sinon.spy();
    const showDialogInner = sinon.spy();
    const showDialog = _ => {
      showDialogInner();
      return true
    }
    const child = _ => (<button onClick={onClick}>Hi I'm a child</button>);
    const wrapper = Enzyme.mount(<ConfirmDialog showDialog={showDialog}>{child}</ConfirmDialog>, {
      context
    });
    expect(wrapper).to.exist; // eslint-disable-line no-unused-expressions
  });

  it("should render array of children into a span", () => {
    const onClick = sinon.spy();
    const showDialogInner = sinon.spy();
    const showDialog = _ => {
      showDialogInner();
      return true
    }
    const child = _ => (<button onClick={onClick}>Hi I'm a child</button>);
    const children = [child, child, child];
    const wrapper = Enzyme.mount(<ConfirmDialog showDialog={showDialog}>{children}</ConfirmDialog>, {
      context
    });

    expect(wrapper.getDOMNode()).to.have.property('className').equal('confirm-dialog-span'); // eslint-disable-line no-unused-expressions
  });
});