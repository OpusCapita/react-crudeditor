import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual';
import { OCAlert } from '@opuscapita/react-alerts';
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Field from '../EditField';
import { formatEntry } from '../lib';

class CreateMain extends PureComponent {

  componentWillReceiveProps({ model: { data: { generalErrors: newErrors } } }) {
    const { model: { data: { generalErrors: oldErrors } } } = this.props;

    if (newErrors.length > 0 && !isEqual(oldErrors, newErrors)) {
      if (this.errAlert) {
        OCAlert.closeAlert(this.errAlert);
      }
      this.errAlert = OCAlert.alertError(newErrors.map(e => e.message))
    }
  }

  componentWillUnmount() {
    if (this.errAlert) {
      OCAlert.closeAlert(this.errAlert);
    }
  }

  render() {
    const { model } = this.props;
    const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

    return (<div className="showview">
      <Heading model={model} />
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <Tab model={model}>
          {
            model.data.activeEntries.map(formatEntry).map(({ Entry, props, fields }, supIndex) =>
              (<Entry key={supIndex} {...props} model={model}>  {/* either Section or top-level Field */}
                {
                  fields && fields.map(({ props }, subIndex) =>
                    <Field key={`${supIndex}_${subIndex}`} {...props} model={model} />
                  )
                }
              </Entry>)
            )
          }
        </Tab>
      }
    </div>)
  }
};

CreateMain.propTypes = {
  model: PropTypes.object.isRequired
}

export default CreateMain;
