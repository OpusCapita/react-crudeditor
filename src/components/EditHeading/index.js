import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { getModelMessage, getTabLabel } from '../lib';
import { VIEW_CREATE } from '../../crudeditor-lib/common/constants';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';

export default class EditHeading extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        activeTab: PropTypes.array,
        instanceLabel: PropTypes.string,
        tabs: PropTypes.array,
        viewName: PropTypes.string.isRequired,
        persistentInstance: PropTypes.object,
        unsavedChanges: PropTypes.bool
      }),
      actions: PropTypes.objectOf(PropTypes.func),
      uiConfig: PropTypes.object.isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  showConfirmDialog = _ => this.props.model.data.unsavedChanges;

  render() {
    const {
      model: {
        data: {
          activeTab: {
            tab: activeTabName
          } = {},
          instanceLabel,
          tabs,
          viewName
        },
        actions: {
          selectTab,
          exitView,
          gotoPreviousInstance,
          gotoNextInstance
        },
        uiConfig: {
          headerLevel = 1
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const modelName = getModelMessage({ i18n, key: 'model.name' });

    const title = exitView ?
      (
        <ConfirmUnsavedChanges showDialog={this.showConfirmDialog}>
          <a style={{ cursor: 'pointer' }} onClick={exitView}>
            {modelName}
          </a>
        </ConfirmUnsavedChanges>
      ) :
      modelName;

    const arrows = [
      <ConfirmUnsavedChanges showDialog={this.showConfirmDialog} key='arrow-left'>
        <button
          type="button"
          className="btn btn-default"
          disabled={!gotoPreviousInstance}
          onClick={gotoPreviousInstance}
        >
          <span className="glyphicon glyphicon-arrow-left"></span>
        </button>
      </ConfirmUnsavedChanges>,
      <ConfirmUnsavedChanges showDialog={this.showConfirmDialog} key='arrow-right'>
        <button
          type="button"
          className="btn btn-default"
          disabled={!gotoNextInstance}
          onClick={gotoNextInstance}
        >
          <span className="glyphicon glyphicon-arrow-right"></span>
        </button>
      </ConfirmUnsavedChanges>
    ]

    const H = 'h' + headerLevel;

    return (<div style={{ marginBottom: '10px' }}>
      <H>
        <div className="row">
          <div className="col-xs-8">
            {title}
            {
              (instanceLabel || viewName === VIEW_CREATE) &&
              <small>
                {' / ' + (viewName === VIEW_CREATE ? i18n.getMessage('crudEditor.new.title') : instanceLabel)}
              </small>
            }
          </div>
          <div className="col-xs-4">
            <div style={{ float: "right" }}>
              <div className="btn-group">
                {arrows}
              </div>
            </div>
          </div>
        </div>
      </H>

      {
        tabs.length > 1 &&
        <ConfirmUnsavedChanges
          trigger='select'
          showDialog={this.showConfirmDialog}
        >
          <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
            {
              tabs.map(({ tab: name, disabled }, index) =>
                (<NavItem
                  eventKey={name}
                  disabled={!!disabled || name === activeTabName}
                  key={index}
                >
                  <h4>
                    {
                      getTabLabel({ i18n, name })
                    }
                  </h4>
                </NavItem>)
              )
            }
          </Nav>
        </ConfirmUnsavedChanges>
      }
    </div>);
  }
}

