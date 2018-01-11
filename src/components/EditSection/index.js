import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import { getModelMessage, titleCase } from '../lib';
import './styles.less';

export default class EditSelection extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

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
            {getModelMessage({
              i18n: this.context.i18n,
              key: `model.section.${title}.label`,
              defaultMessage: titleCase(title)
            })}
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

