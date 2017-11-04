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

  const { columns: tabColumns = 1 } = model.data.activeTab;

  const sectionFieldsLayout = ({ fields, model, supIndex, columns: sectionColumns = 1 }) => {
    const fieldsArr = fields.map(({ props }, subIndex) => (
      <Field key={`${supIndex}_${subIndex}_section_field`}
        {...props} model={model}
        fieldErrorsWrapper={fieldErrorsWrapper}
        columns={sectionColumns}
      />));

    let columns = [];

    if (sectionColumns < 2) {
      columns = <Col sm={12}>{fieldsArr}</Col>
    } else {
      for (let i = 0; i < sectionColumns; i++) {
        columns.push(
          <Col sm={12 / sectionColumns} key={i + '_section_column'}>
            {fieldsArr.filter((field, index) => index % sectionColumns === i)}
          </Col>
        )
      }
    }
    return <Row>{columns}</Row>
  }

  sectionFieldsLayout.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object),
    model: PropTypes.object,
    supIndex: PropTypes.number,
    columns: PropTypes.number
  }

  const tabLayout = tabColumns < 2 ?
    // plain vertical full-width grid
    model.data.activeEntries.map(formatEntry).map(({ Entry, props, fields }, supIndex) =>
      (<Entry key={supIndex + '_toplevel'}
        {...props} model={model}
        fieldErrorsWrapper={fieldErrorsWrapper}
        columns={tabColumns}
      >
        {
          fields ? sectionFieldsLayout({
            fields, model, supIndex,
            columns: props.columns // eslint-disable-line react/prop-types
          }) : null
        }
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
          const { columns } = props;
          return {
            ...result,
            blocks: result.blocks.concat({
              block: (
                <Entry key={supIndex + '_section'}
                  {...props} model={model}
                  fieldErrorsWrapper={fieldErrorsWrapper}
                  columns={tabColumns}
                >
                  { sectionFieldsLayout({ fields, model, supIndex, columns }) }
                </Entry>
              ),
              type: 'section'
            }),
            currIndex: result.currIndex + 1
          }
        }
        // this is a regular top-level field
        const field = (<Entry
          key={supIndex + '_entry'}
          {...props} model={model}
          fieldErrorsWrapper={fieldErrorsWrapper}
          columns={tabColumns}
        ></Entry>);

        let blocks;

        if (result.blocks[result.currIndex]) {
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
          blocks
        }
      }, {
        blocks: [], // Array<{ block: [] || section, type: "fields" || "section" }>
        currIndex: 0
      }
    ).blocks.map(({ block, type }, index) => {
      // create grids
      if (type === "fields") {
        let columns = [];
        for (let i = 0; i < tabColumns; i++) {
          columns.push(
            <Col sm={12 / tabColumns} key={i + '_column'}>
              {block.filter((field, index) => index % tabColumns === i)}
            </Col>
          )
        }
        return <Row key={type + '_' + index}>{columns}</Row>
      }

      if (type === "section") {
        return block
      }

      throw new Error('Unknown type of grid block!')
    });

  return (<div className="ready-for-spinner">
    {spinnerElement}
    <div className={`${model.data.isLoading ? 'under-active-spinner' : ''}`}>
      <Heading model={model} />
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <Tab model={model}>
          {tabLayout}
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
