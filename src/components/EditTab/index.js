import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, ButtonToolbar } from 'react-bootstrap';

import OperationsBar from '../OperationsBar';
import FormGrid from '../FormGrid';
import './styles.less';

export default class EditTab extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      operations: PropTypes.any
    }).isRequired,
    toggleFieldErrors: PropTypes.func,
    toggledFieldErrors: PropTypes.object
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.toggleFieldErrors(true);
  }

  render() {
    const {
      model: { operations },
      toggledFieldErrors,
      toggleFieldErrors
    } = this.props;

    return (
      <OperationsBar operations={operations}>
        {buttons => (
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
        )}
      </OperationsBar>
    );
  }
}
