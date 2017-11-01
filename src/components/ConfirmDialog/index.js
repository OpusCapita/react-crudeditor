import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';

export default class ConfirmDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    message: PropTypes.any,
    trigger: PropTypes.string,
    children: PropTypes.element.isRequired,
    textConfirm: PropTypes.string,
    textCancel: PropTypes.string,
    // showDialog should return a boolean
    // if true -> dialog is displayed
    // else immediately invoke onConfirm
    showDialog: PropTypes.func
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  static defaultProps = {
    trigger: 'click',
    onConfirm: _ => {},
    onCancel: _ => {},
    showDialog: _ => true
  };

  state = {
    show: false
  };

  componentDidMount = () => {
    this._mountNode = document.createElement('div');
    this.renderDialog();
  };

  componentDidUpdate = () => {
    if (this._mountNode) {
      this.renderDialog();
    }
  };

  componentWillUnmount = () => {
    ReactDOM.unmountComponentAtNode(this._mountNode);
    this._mountNode = null;
  };

  handleConfirm = (event) => {
    this.props.onConfirm();
    this.setState({ show: false });
  };

  handleOpenDialog = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.setState({ show: true });
  };

  handleCancelDialog = () => {
    this.props.onCancel();
    this.setState({ show: false });
  };

  renderDialog = () => {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this, this._dialog, this._mountNode
    );
  };

  render() {
    let {
      title,
      message,
      children,
      trigger,
      textConfirm,
      textCancel,
      showDialog
    } = this.props;

    let eventId = 'on' + upperFirst(trigger);

    this._dialog = (
      <Modal key={1} show={this.state.show} onHide={this.handleCancelDialog}>
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>

        <Modal.Footer>
          <button className="btn btn-link" onClick={this.handleCancelDialog}>
            {textCancel}
          </button>
          <button className="btn btn-primary" onClick={this.handleConfirm}>
            {textConfirm}
          </button>
        </Modal.Footer>
      </Modal>
    );

    let child = Array.isArray(children) ? children[0] : children;

    let childProps = {
      ...child.props
    };

    childProps[eventId] = showDialog() ? this.handleOpenDialog : this.handleConfirm;

    return React.cloneElement(child, childProps);
  }
}
