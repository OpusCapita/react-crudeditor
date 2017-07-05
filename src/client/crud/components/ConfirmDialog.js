import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import upperFirst from 'lodash/upperFirst';

export default class ConfirmDialog extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    message: React.PropTypes.any,
    trigger: React.PropTypes.string,
    children: React.PropTypes.element.isRequired,
  };

  static defaultProps = {
    trigger: 'click',
    onConfirm: () => {
    },
    onCancel: () => {
    }
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
    let {onConfirm} = this.props;

    onConfirm();

    this.setState({show: false});
  };

  handleOpenDialog = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.setState({show: true});
  };

  handleCancelDialog = () => {
    let {onCancel} = this.props;

    onCancel();

    this.setState({show: false});
  };

  renderDialog = () => {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this, this._dialog, this._mountNode
    );
  };

  render() {
    let {show} = this.state;
    let {title, message, children, trigger} = this.props;

    let eventId = 'on' + upperFirst(trigger);

    this._dialog = (
      <Modal key={1} show={show} onHide={this.handleCancelDialog}>
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>

        <Modal.Footer>
          <button className="btn btn-link" onClick={this.handleCancelDialog}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={this.handleConfirm}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    );

    let child = Array.isArray(children) ? children[0] : children;

    let childProps = {
      ...child.props
    };

    childProps[eventId] = this.handleOpenDialog;

    return React.cloneElement(child, childProps);
  }
}
