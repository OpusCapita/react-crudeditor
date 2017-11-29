import React, { PureComponent, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import upperFirst from 'lodash/upperFirst';
import './styles.less';

export default class MaybeConfirm extends PureComponent {
  static propTypes = {
    trigger: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    textCancel: PropTypes.string,
    textConfirm: PropTypes.string,
    showDialog: PropTypes.func
  }

  static defaultProps = {
    trigger: 'click',
    showDialog: _ => true
  }

  state = {
    show: false,
    confirmHandler: null
  }

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

  handleClose = _ => this.setState({
    show: false,
    confirmHandler: null
  })

  handleOpenDialog = childHandler => _ => this.setState({
    show: true,
    confirmHandler: childHandler
  })

  handleConfirm = event => {
    this.state.confirmHandler(event)
    this.handleClose();
  }

  createDialog = _ => {
    const {
      message,
      textConfirm,
      textCancel
    } = this.props;

    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton={true}>
          <h4>{message}</h4>
          <div className="text-right">
            <Button
              onClick={this.handleClose}
              bsStyle="link"
            >
              {textCancel}
            </Button>
            <Button
              onClick={this.handleConfirm}
              bsStyle="primary"
            >
              {textConfirm}
            </Button>
          </div>
        </Modal.Header>
      </Modal>
    )
  }

  renderDialog = _ => {
    ReactDOM.render(this.createDialog(), this._mountNode);
  }

  render() {
    const {
      children,
      trigger,
      showDialog
    } = this.props;

    const eventId = 'on' + upperFirst(trigger);

    return (Children.count(children) === 1) ?
      (
        Child => (
          <Child.type
            {...Child.props}
            {...{
              [eventId]: showDialog() ?
                this.handleOpenDialog(Child.props[eventId]) :
                Child.props[eventId]
            }}
          />
        )
      )(Children.toArray(children)[0]) :
      (
        <span className="confirm-dialog-span">
          {
            Children.map(children, (Child, index) => (
              <Child.type
                key={index}
                {...Child.props}
                {...{
                  [eventId]: showDialog() ?
                    this.handleOpenDialog(Child.props[eventId]) :
                    Child.props[eventId]
                }}
              />
            ))
          }
        </span>
      )
  }
}
