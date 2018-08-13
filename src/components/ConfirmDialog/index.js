import React, { PureComponent, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import upperFirst from 'lodash/upperFirst';
import './styles.less';

export default class ConditionalConfirm extends PureComponent {
  static propTypes = {
    trigger: PropTypes.string,
    message: PropTypes.string.isRequired,
    textCancel: PropTypes.string.isRequired,
    textConfirm: PropTypes.string.isRequired,
    showDialog: PropTypes.func
  }

  static defaultProps = {
    trigger: 'click',
    showDialog: _ => true
  }

  state = { show: false }

  componentDidMount = _ => {
    this._mountNode = document.createElement('div');
    this.renderDialog();
  };

  componentDidUpdate = _ => {
    if (this._mountNode) {
      this.renderDialog();
    }
  };

  componentWillUnmount = _ => {
    ReactDOM.unmountComponentAtNode(this._mountNode);
    this._mountNode = null;
  };

  handleClose = _ => this.setState({ show: false })

  handleConfirm = _ => {
    this.confirmHandler();
    this.handleClose();
  }

  createDialog = _ => {
    const { message, textConfirm, textCancel } = this.props;

    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton={true}>
          <h4>{message}</h4>
          <div className="text-right">
            <Button onClick={this.handleClose} bsStyle="link">
              {textCancel}
            </Button>
            <Button onClick={this.handleConfirm} bsStyle="primary">
              {textConfirm}
            </Button>
          </div>
        </Modal.Header>
      </Modal>
    )
  }

  confirmableElement = elem => {
    const { trigger, showDialog } = this.props;
    const eventId = 'on' + upperFirst(trigger);

    return React.cloneElement(elem, {
      [eventId]: event => { // eslint-disable-line consistent-return
        if (!showDialog()) {
          return elem.props[eventId](event);
        }

        if (event.persist) { // React synthetic event?
          event.persist();

          event = { // eslint-disable-line no-param-reassign
            ...event,

            // currentTarget changes as the event bubbles up
            // => accessing currentTarget in async way requires caching it in a variable.
            currentTarget: event.currentTarget
          };
        }

        this.confirmHandler = _ => elem.props[eventId](event);
        this.setState({ show: true });
      }
    });
  }

  renderDialog = _ => {
    ReactDOM.render(this.createDialog(), this._mountNode);
  }

  render() {
    const { children } = this.props;

    return (Children.count(children) === 1) ?
      this.confirmableElement(Children.toArray(children)[0]) :
      (
        <span className="confirm-dialog-span">
          { Children.map(children, this.confirmableElement) }
        </span>
      )
  }
}
