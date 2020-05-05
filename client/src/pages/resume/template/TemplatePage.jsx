import React, { useEffect, useCallback } from 'react';

// Helper
import _ from 'lodash';

// Forms
import { useForm } from 'react-hook-form';

// Styling
import styled from 'styled-components';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Common
import H1 from '../../../components/common/H1';

// Templates
import template1 from './template_1.png';
import template2 from './template_2.png';
import template3 from './template_3.png';
import template4 from './template_4.png';
import template5 from './template_5.png';
import template6 from './template_6.png';
import template7 from './template_7.png';
import template8 from './template_8.png';
import template9 from './template_9.png';


function TemplatesPage(props) {
  // Get template resume from store
  const mapState = useCallback(
    state => ({
      template: state.resume.template
    }),
    []
  );

  const { template } = useMappedState(mapState);

  console.log(template);
  // Form config
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      template: template.toString()
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    dispatch(
      saveResume({
        template
      })
    );
  };

  useEffect(() => {
    console.log(watch('template'))
    if (watch('template')) {
      dispatch(saveResume({ template: parseInt(watch('template')) }));
    }
  }, [watch('template')]);

  return (
    <div {...props}>
      <H1>Pick a template</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input ref={register} type="radio" name="template" id="template1" value="1" />
          <img src={template1} alt="" />
          <label htmlFor="template1"></label>
        </div>

        <div>
          <input ref={register} type="radio" name="template" id="template2" value="2" />
          <img src={template2} alt="" />
          <label htmlFor="template2"></label>
        </div>

        <div>
          <input ref={register} type="radio" name="template" id="template3" value="3" />
          <img src={template3} alt="" />
          <label htmlFor="template3"></label>
        </div>
{/* 
        <div>
          <input ref={register} type="radio" name="template" id="template4" value="4" />
          <img src={template4} alt="" />
          <label htmlFor="template4"></label>
        </div> */}

        <div>
          <input ref={register} type="radio" name="template" id="template5" value="5" />
          <img src={template5} alt="" />
          <label htmlFor="template5"></label>
        </div>

        {/* <div>
          <input ref={register} type="radio" name="template" id="template6" value="6" />
          <img src={template6} alt="" />
          <label htmlFor="template6"></label>
        </div> */}

        {/* <div>
          <input ref={register} type="radio" name="template" id="template7" value="7" />
          <img src={template7} alt="" />
          <label htmlFor="template7"></label>
        </div> */}

        {/* <div>
          <input ref={register} type="radio" name="template" id="template8" value="8" />
          <img src={template8} alt="" />
          <label htmlFor="template8"></label>
        </div> */}

        <div>
          <input ref={register} type="radio" name="template" id="template9" value="9" />
          <img src={template9} alt="" />
          <label htmlFor="template9"></label>
        </div>
      </form>
    </div>
  );
}

export default React.memo(styled(TemplatesPage)`
  color: ${props => props.theme.PALLET['400']};
  h1 {
    margin-bottom: 8px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 8px;

    @media only screen and (max-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }

    @media only screen and (max-width: 300px) {
      grid-template-columns: 1fr;
    }

    input {
      display: none;
    }

    img {
      width: 100%;
      border-radius: 4px;
      opacity: 0.5;
    }

    div {
      position: relative;
    }

    label {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      cursor: pointer;
    }

    input:checked ~ img {
      opacity: 1;
    }
  }
`);
