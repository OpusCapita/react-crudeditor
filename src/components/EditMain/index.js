import React from 'react';
import PropTypes from 'prop-types';
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Field from '../EditField';
import { formatEntry } from '../lib';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';

const EditMain = ({ model, fieldErrorsWrapper }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  return (<div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
      <Tab model={model}>
        {
          model.data.activeEntries.map(formatEntry).map(({ Entry, props, fields }, supIndex) =>
            (<Entry key={supIndex}
              {...props} model={model}
              fieldErrorsWrapper={fieldErrorsWrapper}
            >  {/* either Section or top-level Field */}
              {
                fields && fields.map(({ props }, subIndex) =>
                  (<Field key={`${supIndex}_${subIndex}`}
                    {...props} model={model}
                    fieldErrorsWrapper={fieldErrorsWrapper}
                  />)
                )
              }
            </Entry>)
          )
        }
      </Tab>
    }
  </div>);
};

EditMain.propTypes = {
  model: PropTypes.object.isRequired,
  fieldErrorsWrapper: PropTypes.object
}

export default WithFieldErrors(EditMain);
