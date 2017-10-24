import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Glyphicon } from 'react-bootstrap';
import { getSectionText } from '../lib';

class EditSelection extends React.Component {
  state = {
    collapsed: false
  }

  handleSelect = _ => this.setState({
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
        onSelect={this.handleSelect}
        header={(
          <span style={{ cursor: 'pointer' }}>
            <Glyphicon glyph={`menu-${collapsed ? 'down' : 'up'}`} />
            &nbsp;
            { getSectionText(this.context.i18n, title) }
          </span>
        )}
      >
        {fields}
      </Panel>
    );
  }
}

EditSelection.propTypes = {
  title: PropTypes.string
}

EditSelection.contextTypes = {
  i18n: PropTypes.object
};

export default EditSelection;
