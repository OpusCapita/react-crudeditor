import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="col-sm-12">
              <FormGrid
                model={this.props.model}
                toggledFieldErrors={toggledFieldErrors}
                toggleFieldErrors={toggleFieldErrors}
              />
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <div className="form-submit text-right">
                  <div role="toolbar" className="btn-toolbar crud--search-result-listing__action-buttons">
                    { buttons }
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </OperationsBar>
    );
  }
}
