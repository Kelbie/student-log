import React, { useEffect } from 'react';

// Styling
import styled from 'styled-components';

// Icons
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// Forms
import { useForm } from 'react-hook-form';

// Common
import Label from '../../components/common/Label';
import Select from '../../components/common/Select';
import ButtonRefactor from '../../components/common/ButtonRefactor';
import Error from '../../components/common/Error';

function Login(props) {
  const { register, handleSubmit, setValue, errors, triggerValidation } = useForm();

  const handleMultiChange = selectedOption => {
    setValue('uni', selectedOption.value);
    triggerValidation();
  };

  useEffect(() => {
    register({ name: 'uni' }, { required: true });
  }, []);

  function onSubmit({ uni }) {
    window.location.href = `/login?uni=${uni}&redirect=/`;
  }

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Verify your student status</legend>
        <Label required>Educational Institution</Label>
        <Select onChange={e => handleMultiChange(e)}></Select>
        <Error errors={errors} name="uni" message={'this field is required'} />
        <ButtonRefactor icon={faSignInAlt} variant={'fill'} type="submit">
          Student Login
        </ButtonRefactor>
      </fieldset>
    </form>
  );
}

export default styled(Login)`
  padding: 24px 16px 24px 16px;
  background: ${props => props.theme.PALLET[900]};
  border-radius: 8px;
  fieldset {
    border: none;

    padding: 16px;
    border-radius: 4px;
    border: none;
    margin-bottom: 16px;
  }

  legend {
    position: sticky;
    font-weight: 600;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 28px;
  }

  fieldset {
    padding: 8px;
    > * {
      margin-bottom: 8px;
    }

    ${Select} {
      margin-bottom: 0px;
    }

    ${ButtonRefactor} {
      margin-bottom: 0px;
      margin-top: 8px;
    }
  }
`;
