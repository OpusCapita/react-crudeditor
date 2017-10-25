import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Field from '../EditField';
import { formatEntry } from '../lib';
import withAlerts from '../WithAlertsHOC'

const CreateMain = ({ model }) => {
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

CreateMain.propTypes = {
  model: PropTypes.object.isRequired
}

export default withAlerts(CreateMain);
