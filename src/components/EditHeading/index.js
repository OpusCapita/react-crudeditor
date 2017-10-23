import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem } from 'react-bootstrap';

class EditHeading extends PureComponent {
  render() {
    const {
      model: {
        data: {
          activeTab: {
            tab: activeTabName
          } = {},
          instanceLabel, // TBD not implemented?
          tabs,
          viewName
        },
        actions: {
          selectTab
        }
      }
    } = this.props;

    const title = this.context.i18n.getMessage(
      `crudEditor.${viewName.toLowerCase()}.header`,
      { modelName: this.context.i18n.getMessage('model.name') }
    )

    return (<div>
      <h1>
        { title }
        &nbsp;
        { instanceLabel && <small>{instanceLabel}</small> }
      </h1>
      <br />
      {
        tabs.length !== 0 && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
          {
            tabs.map(({ tab: name, disabled }, index) =>
              (<NavItem eventKey={name} disabled={!!disabled} key={index}>
                {
                  name.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
                }
              </NavItem>)
            )
          }
        </Nav>
      }
    </div>);
  }
}

EditHeading.propTypes = {
  model: PropTypes.object.isRequired
}

EditHeading.contextTypes = {
  i18n: PropTypes.object
};

export default EditHeading;
