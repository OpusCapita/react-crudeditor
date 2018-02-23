import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Form,
  FormGroup,
  Col,
  ButtonToolbar
} from 'react-bootstrap';

import getOperationButtons from '../OperationButton';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';
import FormGrid from '../FormGrid';
import './EditTab.less';

export default class EditTab extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func),
      operations: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string,
        handler: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        dropdown: PropTypes.bool,
        confirm: PropTypes.shape({
          message: PropTypes.string.isRequired,
          textConfirm: PropTypes.string.isRequired,
          textCancel: PropTypes.string.isRequired
        })
      })).isRequired
    }).isRequired,
    toggleFieldErrors: PropTypes.func,
    toggledFieldErrors: PropTypes.object
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleSubmit = e => { // TODO: check if toggleFieldErrors() must be called on other buttons press.
    e.preventDefault();
    this.props.toggleFieldErrors(true);
    this.props.model.actions.saveInstance();
  }

  render() {
    const {
      model: {
        actions: {
          exitView,
          saveInstance
        },
        data: {
          unsavedChanges
        },
        operations
      },
      toggledFieldErrors,
      toggleFieldErrors
    } = this.props;

    const { i18n } = this.context;

    const buttons = [
      ...(exitView && [
        <ConfirmUnsavedChanges key='Cancel' showDialog={_ => unsavedChanges}>
          <Button bsStyle='link' onClick={exitView}>
            {i18n.getMessage('crudEditor.cancel.button')}
          </Button>
        </ConfirmUnsavedChanges>
      ]),
      ...getOperationButtons({ operations }),
      ...(saveInstance && [
        <Button disabled={!unsavedChanges} bsStyle='primary' type='submit' key='Save'>
          {i18n.getMessage('crudEditor.save.button')}
        </Button>
      ])
    ];

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        <Col sm={12}>
          <FormGrid
            model={this.props.model}
            toggledFieldErrors={toggledFieldErrors}
            toggleFieldErrors={toggleFieldErrors}
          />
        </Col>
        <FormGroup>
          <Col sm={12}>
            <div className="form-submit text-right">
              <ButtonToolbar className="crud--search-result-listing__action-buttons">
                { buttons }
              </ButtonToolbar>
            </div>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
