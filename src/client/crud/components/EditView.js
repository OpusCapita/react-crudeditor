import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import classnames from 'classnames';

export const EditViewReducer = function(dispatch, viewState, context) {
  const {entryName, formTabs} = context;
  const {activeTab, searchState} = viewState;

  return {
    entryName,
    //first tab should be open by default
    activeTab: activeTab ? activeTab : formTabs[0].name,
    onCancel() {
      dispatch('search', searchState);
    },
    onSelectTab(activeTab) {
      dispatch({...viewState, activeTab});
    },
    //todo: cursor not implemented
    onBack() {},
    onForward() {},
    hasBack: true,
    hasForward: true,
  };
};

export default function (props) {
  const {
    mode,
    entryName,
    title,
    onCancel,
    //cursor navigation
    onBack,
    onForward,
    hasBack,
    hasForward,
    //navigation tabs
    activeTab,
    formTabs,
    onSelectTab,
    //active form
    formEntry,
  } = props;

  return (
    <div>
      <h1>
        {mode === 'create' ? `Create ${entryName}` : null}
        {mode === 'edit' ? `Edit ${entryName}` : null}

        {title ? <small>{title}</small> : null }

        {mode === 'edit' ? (
          <div className="pull-right">
            <button className="btn btn-link" onClick={() => onCancel()}>Search result</button>

            <div className="btn-group">
              <button className={classnames('btn', 'btn-default', {disabled: !hasBack})} onClick={() => onBack()}>
                <span className="glyphicon glyphicon-arrow-left"/>
              </button>
              <button className={classnames('btn', 'btn-default', {disabled: !hasForward})} onClick={() => onForward()}>
                <span className="glyphicon glyphicon-arrow-right"/>
              </button>
            </div>
          </div>
        ) : null }
      </h1>

      <Nav bsStyle="tabs" activeKey={activeTab} onSelect={onSelectTab}>
        {formTabs.map(formTab => {
          const {name, title, disabled} = formTab;
          return (
            <NavItem activeKey={name} title={title} disabled={disabled}/>
          )
        })}
      </Nav>

      {formEntry}
    </div>
  );
}