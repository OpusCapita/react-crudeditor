import React, { Component } from 'react'

import { formatEntry } from '../EditMain'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Section from '../EditSection';
import Field from '../EditField';

export default class CreateView extends Component {
  constructor(props) {
    super(props)

    // console.log("Create receives props: \n" + JSON.stringify(this.props, null, 2))
  }

  render() {
    const { model } = this.props;

    const { createInstance } = model.actions;
    // console.log("------CREATE: \n" + JSON.stringify(createInstance(), null, 2) + "\n-----------")
    // const { modelDefinition: { model: { fields } } } = this.props;
    const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;
    // console.log("active tab: " + ActiveTabComponent)

    return (<div>
      hi
    </div>);
  }
}
