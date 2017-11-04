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
  }
}

EditSelection.propTypes = {
  title: PropTypes.string
}

EditSelection.contextTypes = {
  i18n: PropTypes.object
};

export default EditSelection;
