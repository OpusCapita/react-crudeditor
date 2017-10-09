import React, { Component } from 'react'

import { formatEntry } from '../EditMain'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Section from '../EditSection';
import Field from '../EditField';

export default class CreateView extends Component {
  constructor(props) {
    super(props)

    console.log("Create receives props: \n" + JSON.stringify(this.props, null, 2))
  }

  render() {
    const { model } = this.props;
    const { modelDefinition: { model: { fields } } } = this.props;
    const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;


    console.log("0000000000000000: \n" + JSON.stringify(fields, null, 2))

    return (<div>
      <form>
        { Object.keys(fields).map(fieldName => (
          <div className="form-group" key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input type="email" className="form-control" id={fieldName} />
          </div>
        ))

        }
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>);
  }
}
