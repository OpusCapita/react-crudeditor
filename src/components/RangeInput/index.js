import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  InputGroup,
  FormControl
} from 'react-bootstrap';
import './styles.less';

const isDef = v => v !== null && v !== undefined;

export default class RangeInput extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string
      }),
      PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number
      })
    ]),
    type: PropTypes.oneOf(['number', 'string', 'stringNumber'])
  }

  static defaultProps = {
    type: 'string',
    value: {
      from: null,
      to: null
    }
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  render() {
    const {
      value,
      type,
      onChange,
      onBlur
    } = this.props;

    const { i18n } = this.context;

    const inputType = type === 'number' ? 'number' : 'text';

    return (
      <InputGroup className="crud--range-input">
        <FormControl
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.from')}
          value={isDef(value.from) ? value.from : null}
        />
        <InputGroup.Addon>{`\u2013`}</InputGroup.Addon>
        <FormControl
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.to')}
          value={isDef(value.to) ? value.to : null}
        />
      </InputGroup>
    )
  }
}