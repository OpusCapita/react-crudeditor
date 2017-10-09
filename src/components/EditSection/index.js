import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';

export default
class EditSelection extends React.Component {
  state = {
    collapsed: false
  }

  changeVisibility = _ => this.setState({
    collapsed: !this.state.collapsed
  })

  render() {
    const {
      title,
      children: fields
    } = this.props;

    const { collapsed } = this.state;

    return (
      <Panel
        collapsible={true}
        expanded={!collapsed}
        onSelect={this.changeVisibility}
        header={(
          <span style={{ cursor: 'pointer' }}>
            <Glyphicon glyph={`menu-${collapsed ? 'down' : 'up'}`} />
            &nbsp;
            {title}
          </span>
        )}
      >
        {fields}
      </Panel>
    );
  }
}
