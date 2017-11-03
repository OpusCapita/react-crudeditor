import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import { getSectionText } from '../lib';
import './styles.less';

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
      <div>
        <h4
          onClick={this.handleSelect}
          style={{ cursor: "pointer" }}
        >
          <a>
            <span
              className={`fa fa-angle-${collapsed ? 'down' : 'up'}`}
              style={{ marginRight: "0.2em", textDecoration: 'none' }}
            ></span>
            {getSectionText(this.context.i18n, title)}
          </a>
        </h4>
        <Collapse in={!collapsed}>
          <div>
            {fields}
          </div>
        </Collapse>
      </div>

    );

    // return (
    //   <Panel
    //     collapsible={true}
    //     expanded={!collapsed}
    //     onSelect={this.handleSelect}
    //     header={(
    //       <h4 style={{ cursor: 'pointer', fontWeight: 'normal' }}>
    //         <Glyphicon glyph={`chevron-${collapsed ? 'down' : 'up'}`}/>
    //         &nbsp;
    //         { getSectionText(this.context.i18n, title) }
    //       </h4>
    //     )}
    //   >
    //     {fields}
    //   </Panel>
    // );
  }
}

EditSelection.propTypes = {
  title: PropTypes.string
}

EditSelection.contextTypes = {
  i18n: PropTypes.object
};

export default EditSelection;
