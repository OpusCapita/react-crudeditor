import React, { Component } from 'react';

export default class CreateView extends Component {

  constructor(...args) {
    super(args)

    console.log("Create receives props: \n" + JSON.stringify(this.props, null, 2))
  }

  render() {
    return (
      <div>Hi creator</div>
    )
  }
}
