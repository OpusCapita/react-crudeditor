import React from 'react';
import ReactDOM from 'react-dom';
import DefaultSpinner from './DefaultSpinner';
import './Spinner.less';

class Spinner {
  constructor() {
    this.loadingTasks = 0;
    this.setDefaultComponent();
  }

  setComponent = (Component, props) => {
    this.component = (<span className="spinner"><Component {...props}/></span>);
    return this
  }

  setDefaultComponent = _ => this.setComponent(DefaultSpinner)

  show = _ => {
    if (this.loadingTasks === 0) {
      this.render()
    }

    this.loadingTasks++;
  }

  hide = _ => {
    if (this.loadingTasks > 0) {
      this.loadingTasks--
    }

    if (this.loadingTasks === 0 && ReactDOM.findDOMNode(this.container)) {
      ReactDOM.unmountComponentAtNode(this.container)
    }
  }

  render() {
    /* istanbul ignore next */
    if (!this.container) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
    }

    ReactDOM.render(this.component, this.container)
  }
}

export default new Spinner();
