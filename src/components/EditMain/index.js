import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Heading from '../EditHeading';
import Tab from '../EditTab';
import Field from '../EditField';
import { formatEntry } from '../lib';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import SpinnerOverlay from '../Spinner/SpinnerOverlay';

const EditMain = ({ model, fieldErrorsWrapper }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  const spinnerElement = model.data.isLoading ? (<SpinnerOverlay />) : null;

  const { columns } = model.data.activeTab;

  const sectionFieldsLayout = ({ fields, model, supIndex }) => fields.map(({ props }, subIndex) => (
    <Field key={`${supIndex}_${subIndex}`}
      {...props} model={model}
      fieldErrorsWrapper={fieldErrorsWrapper}
    />));

  const tabLayout = columns < 2 ?
    // plain vertical full-width grid
    model.data.activeEntries.map(formatEntry).map(({ Entry, props, fields }, supIndex) =>
      (<Entry key={supIndex}
         {...props} model={model}
         fieldErrorsWrapper={fieldErrorsWrapper}
      >
        { fields ? sectionFieldsLayout({ fields, model, supIndex }) : null }
      </Entry>)
    ) :
    // now funky stuff with columns begins
    model.data.activeEntries.map(formatEntry).reduce(
      // result hold 'blocks' array with 'block' and 'type' props, where 'block' is
      // a collection of top-level fields organized in columns
      // or a single section
      (result, { Entry, props, fields }, supIndex) => {
        // sections have not-null 'fields' property
        if (fields) {
          return {
            ...result,
            blocks: result.blocks.concat({
              block: (
                <Entry key={supIndex}
                  {...props} model={model}
                  fieldErrorsWrapper={fieldErrorsWrapper}
                >
                  { sectionFieldsLayout({ fields, model, supIndex }) }
                </Entry>
              ),
              type: 'section'
            }),
            currIndex: result.currIndex + 1
          }
        }
        // this is a regular top-level field
        const field = (<Entry
          key={supIndex}
          {...props} model={model}
          fieldErrorsWrapper={fieldErrorsWrapper}
        ></Entry>);

        let blocks;

        if (result.blocks[result.currIndex]) { // add field to current array inside
          blocks = result.blocks.map((b, i) => i === result.currIndex ? {
            ...b,
            block: b.block.concat(field)
          } : b)
        } else {
          blocks = result.blocks.concat({
            block: [field],
            type: 'fields'
          })
        }

        return {
          ...result,
          // Array<{ block: [] || section, type: "fields" || "section" }>
          blocks
        }
      }, {
        blocks: [],
        currIndex: 0
      }
    ).blocks.map(({ block, type }) => block);

  return (<div className="ready-for-spinner">
    {spinnerElement}
    <div className={`${model.data.isLoading ? 'under-active-spinner' : ''}`}>
      <Heading model={model} />
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <Tab model={model}>
          {tabLayout}
          {
            // model.data.activeEntries.map(formatEntry).map(({ Entry, props, fields }, supIndex) => {
            //   console.log("supppp: " + supIndex)
            //   console.log({ Entry, props, fields })
            //   return (<Entry key={supIndex}
            //     {...props} model={model}
            //     fieldErrorsWrapper={fieldErrorsWrapper}
            //   >  {/* either Section or top-level Field */}
            //     <Row>
            //       <Col sm={6}>
            //     {
            //       fields && fields.map(({ props }, subIndex) => {
            //         console.log(supIndex + " " + subIndex);
            //         console.log(props)
            //         return (<Field key={`${supIndex}_${subIndex}`}
            //           {...props} model={model}
            //           fieldErrorsWrapper={fieldErrorsWrapper}
            //         />)
            //       })
            //     }
            //       </Col>
            //     </Row>
            //   </Entry>)
            // })
          }

        </Tab>
      }
    </div>
  </div>);
};

EditMain.propTypes = {
  model: PropTypes.object.isRequired,
  fieldErrorsWrapper: PropTypes.object
}

export default WithFieldErrors(EditMain);
