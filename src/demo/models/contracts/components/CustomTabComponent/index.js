import React from 'react';
import PropTypes from 'prop-types';

const CustomTabComponent = ({ viewName, instance }) => (
  <div>
    <h1>Custom Tab Component Example</h1>
    <h4><a href="https://github.com/OpusCapita/react-crudeditor#tabformcomponent" target="_blank">Click me for Documentation reference</a></h4>
    <h3>props.viewName: {viewName}</h3>
    <h3>props.instance:</h3>
    <ul>
      {
        Object.keys(instance).map(key => <li key={key}>{`${key}: ${JSON.stringify(instance[key])}`}</li>)
      }
    </ul>
  </div>
)

CustomTabComponent.propTypes = {
  viewName: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired
}

export default CustomTabComponent;
