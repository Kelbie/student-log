import React, { useCallback, useMemo, useState, useEffect } from 'react';

import urlRegex from "url-regex";

// Styling
import styled from 'styled-components';

import Geosuggest from 'react-geosuggest';
import './geo.css';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { useDropzone } from 'react-dropzone';

import StepWizard from 'react-step-wizard';
import RichTextEditor from 'react-rte';

// Forms
import { Formik, ErrorMessage, Field } from 'formik';

// Styling
import { rgba } from 'polished';

// Icons
import { faSave } from '@fortawesome/free-solid-svg-icons';

// GraphQL
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';

// Common
import ButtonRefactor from '../../components/common/ButtonRefactor';
import Label from '../../components/common/Label';

// Testing
import * as Yup from 'yup';

function StyledErrorMessage(props) {
  return (
    <div {...props}>
      <ErrorMessage {...props} />
    </div>
  );
}

StyledErrorMessage = styled(StyledErrorMessage)`
  color: #e53e3e;
`;

let StyledField = styled(Field)`
  outline: none;
  width: 100%;
  font-size: 16px;

  &:required {
    box-shadow: none !important;
  }

  &:invalid {
    box-shadow: 0 0 3px red;
  }
`;

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function MyDropzone(props) {
  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState();

  const onDrop = useCallback(files => {
    var file = files[0];
    const reader = new FileReader();
    reader.onload = event => {
      setImage(event.target.result);
      props.setImage(event.target.result);
      setImagePath(file.path);
    };
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/png'
  });

  const style = useMemo(
    () => ({
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  return (
    <div {...props} {...getRootProps({ style })}>
      <input name={props.name} {...getInputProps()} />
      <p>
        {imagePath
          ? imagePath.split('\\')[imagePath.split('\\').length - 1]
          : "Drag 'n' drop some PNG files here, or click to select files"}
      </p>
    </div>
  );
}

MyDropzone = styled(MyDropzone)`
  background: -webkit-linear-gradient(
    ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
    ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
  );
  border: 1.25px dashed ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
  padding: 16px;
  border-radius: 4px;
  width: 100%;

  p {
    text-align: center;
  }
`;

function StyledDropdown(props) {
  return <Dropdown {...props} />;
}

StyledDropdown = styled(Dropdown)`
  .Dropdown-control {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
    background: -webkit-linear-gradient(
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
    cursor: pointer;
  }

  .Dropdown-arrow {
    border-color: ${props =>
        props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']}
      transparent transparent;
  }

  .is-open {
    background: red !important;
  }

  .Dropdown-menu {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
  }

  .Dropdown-option {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .Dropdown-option.is-selected {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .Dropdown-option:hover {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }
`;

const POST_JOB = gql`
  mutation postJob(
    $job_title: String
    $category: String
    $job_type: String
    $apply_link: String
    $job_desc: String
    $name: String
    $company_statement: String
    $logo: String
    $website: String
    $email: String
    $company_desc: String
    $location: String
  ) {
    postJob(
      job: {
        job_title: $job_title
        category: $category
        job_type: $job_type
        apply_link: $apply_link
        job_desc: $job_desc
        name: $name
        company_statement: $company_statement
        logo: $logo
        website: $website
        email: $email
        company_desc: $company_desc
        location: $location
      }
    ) {
      id
      job_title
      category
      job_type
      apply_link
      job_desc
      name
      company_statement
      # logo
      website
      email
      company_desc
      location
    }
  }
`;

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isURL(url) {
  return !/^(?:f|ht)tps?\:\/\//.test(url);
}

// add the relevant protocol to the input
function addProtocol(url) {
  if (isEmail(url)) {
    url = 'mailto://' + url;
  } else if (isURL(url)) {
    url = 'http://' + url;
  }
  return url;
}

function About(props) {
  const [postJob, { loading }] = useMutation(POST_JOB);

  const [value, setValue] = useState(RichTextEditor.createEmptyValue());

  return (
    <Step {...props}>
      <Formik
        initialValues={{ logo: '' }}
        validationSchema={Yup.object().shape({
          job_title: Yup.string()
            .required('Required')
            .max(128),
          category: Yup.string().required('Required'),
          job_type: Yup.string().required('Required'),
          apply_link: Yup.string('Enter your Email/Phone Number')
            // .email("Enter a valid email")
            .required('Required')
            .test('test-name', 'Enter Valid Url/Email', function(value) {
              // gets either a valid url or email
              let isValidUrl = urlRegex({exact: true, strict: false}).test(value);
              const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              let isValidEmail = emailRegex.test(value);
              if (!isValidEmail && !isValidUrl) {
                return false;
              }
              return true;
            }),
          job_desc: Yup.string()
            .required('Required')
            .max(1000),
          name: Yup.string()
            .required('Required')
            .max(128),
          company_statement: Yup.string()
            .required('Required')
            .max(256),
          logo: Yup.string().required('Required'),
          website: Yup.string()
            .required('Required')
            .max(256)
            .test('test-name', 'Enter a valid url', function(value) {
              // gets either a valid url or email
              let isValidUrl = urlRegex({exact: true, strict: false}).test(value);
              if (!isValidUrl) {
                return false;
              }
              return true;
            }),
          email: Yup.string()
            .required('Required')
            .max(70)
            .email(),
          company_desc: Yup.string()
            .required('Required')
            .max(256),
          location: Yup.string()
            .required('Required')
            .max(64)
        })}
        onSubmit={async (values, { setSubmitting }) => {
          let job = await postJob({
            variables: {
              ...values,
              website: addProtocol(values.website),
              apply_link: addProtocol(values.apply_link),
              email: addProtocol(values.email)
            }
          });

          props.onSubmit({ id: job.data.postJob.id, ...values });

          window.location.href = '/work';
        }}
      >
        {({
          values,
          setValues,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="set">
              <fieldset>
                <legend>First, tell us about the position</legend>
                <Label required>Job Title</Label>
                <StyledField
                  required
                  type="text"
                  name="job_title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.job_title}
                />
                <StyledErrorMessage name="job_title" />
                <Label required>Category</Label>
                {/* <StyledField
                                    required
                                    type="text"
                                    name="category"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.category}
                                /> */}
                <StyledDropdown
                  options={[
                    'Design',
                    'Programming',
                    'Customer Support',
                    'Copywriting',
                    'DevOps & Sysadmin',
                    'Sales & Marketing',
                    'Business & Management',
                    'Finance & Legal',
                    'Product',
                    'Administrative',
                    'Education',
                    'Translation & Transcription',
                    'Medial/Health',
                    'Other'
                  ]}
                  onChange={e => {
                    setFieldValue('category', e.value);
                  }}
                  value={values.category}
                  placeholder="Select an category"
                />
                <StyledErrorMessage name="category" />
                <Label required>Job Type</Label>
                <StyledDropdown
                  options={['Full-time', 'Internship', 'Project']}
                  onChange={e => {
                    setFieldValue('job_type', e.value);
                  }}
                  value={values.job_type}
                  placeholder="Select an type"
                />
                <StyledErrorMessage name="job_type" />
                {values.job_type === 'Internship' ? (
                  <>
                    <Label required>Internship Duration</Label>
                    <StyledDropdown
                      options={['Summer', 'Year-long', 'Flexible']}
                      onChange={e => {
                        setFieldValue('internship_duration', e.value);
                      }}
                      value={values.internship_duration}
                      placeholder="Select a duration"
                    />
                    <StyledErrorMessage name="internship_duration" />
                  </>
                ) : (
                  ''
                )}
                <Label required>Apply Link</Label>
                <StyledField
                  required
                  type="text"
                  name="apply_link"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.apply_link}
                />
                <p>Link to Application page or Email address</p>
                <StyledErrorMessage name="apply_link" />
                <Label required>Job Description</Label>
                <RichTextEditor
                  value={value}
                  onChange={e => {
                    setValue(e);
                    setFieldValue('job_desc', e.toString('markdown'));
                  }}
                  toolbarConfig={{
                    display: [
                      'INLINE_STYLE_BUTTONS',
                      'BLOCK_TYPE_BUTTONS',
                      'LINK_BUTTONS',
                      'BLOCK_TYPE_DROPDOWN',
                      'HISTORY_BUTTONS'
                    ],
                    INLINE_STYLE_BUTTONS: [
                      { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                      { label: 'Italic', style: 'ITALIC' }
                    ],
                    BLOCK_TYPE_DROPDOWN: [
                      { label: 'Normal', style: 'unstyled' },
                      { label: 'Heading Large', style: 'header-one' },
                      { label: 'Heading Medium', style: 'header-two' },
                      { label: 'Heading Small', style: 'header-three' }
                    ],
                    BLOCK_TYPE_BUTTONS: [
                      { label: 'UL', style: 'unordered-list-item' },
                      { label: 'OL', style: 'ordered-list-item' }
                    ]
                  }}
                />
                <StyledErrorMessage name="job_desc" />
                <Label required>Job Location</Label>
                <Geosuggest
                  types={['(regions)']}
                  onChange={e => setFieldValue('location', e)}
                  onSuggestSelect={e => {
                    setFieldValue('location', e?.description);
                  }}
                />
                <StyledErrorMessage name="location" />
              </fieldset>
            </div>
            <div className="set">
              <fieldset>
                <legend>Tell Us More About Your Company</legend>
                <p>
                  Posted before? Just enter your email and logo, all other info will be pulled in
                  from your last position!
                </p>
                <Label required>Company Name</Label>
                <StyledField
                  required
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <p>Enter your company or organization’s name.</p>
                <StyledErrorMessage name="name" />
                <Label required>Company Statement</Label>
                <StyledField
                  required
                  type="text"
                  name="company_statement"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.company_statement}
                />
                <p>
                  Enter your company or organization’s mission statement. This will be displayed on
                  your company’s profile.
                </p>
                <StyledErrorMessage name="company_statement" />
                <Label required>Logo (.png file)</Label>
                <MyDropzone
                  type="text"
                  name="logo"
                  setImage={image => setFieldValue('logo', image)}
                  onBlur={handleBlur}
                  value={values.logo}
                />
                <p>
                  It’s highly recommended to use your Twitter or Facebook avatar. Optional — Your
                  company logo will appear at the top of your listing.
                </p>
                <StyledErrorMessage name="logo" />
                <Label required>Company's Website URL</Label>
                <StyledField
                  required
                  type="text"
                  name="website"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.website}
                />
                <StyledErrorMessage name="website" />
                <Label required>Email</Label>
                <StyledField
                  required
                  type="text"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <StyledErrorMessage name="email" />
                <Label required>Company Description</Label>
                <StyledField
                  required
                  type="text"
                  name="company_desc"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.company_desc}
                />
                <StyledErrorMessage name="company_desc" />
              </fieldset>
            </div>
            <ButtonRefactor
              variant={'fill'}
              icon={faSave}
              type="submit"
              onClick={() => console.log(errors)}
              disabled={isSubmitting}
            >
              Submit
            </ButtonRefactor>
          </form>
        )}
      </Formik>
    </Step>
  );
}

About = styled(About)`
  .RichTextEditor__root___2QXK- {
    background: -webkit-linear-gradient(
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .Button__root___1gz0c,
  .Dropdown__value___34Py9 {
    background: linear-gradient(
      180deg,
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)} 0,
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)} !important;
    span {
      filter: brightness(1);
    }
  }

  .IconButton__icon-bold___2zl9t {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOSAxMC4zNDRxLjQzOCAwIC43Mi0uMjk3dC4yOC0uNzAzLS4yOC0uNzAzVDkgOC4zNDVINi42NTZ2Mkg5em0tMi4zNDQtNnYyaDJxLjQwNiAwIC43MDMtLjI5N3QuMjk2LS43MDMtLjI5Ny0uNzAzLS43MDQtLjI5NmgtMnptMy43NSAyLjg0NHExLjQzOC42NTYgMS40MzggMi4yOCAwIDEuMDY0LS43MDMgMS43OThUOS4zNzYgMTJoLTQuNzJWMi42NTZoNC4xOXExLjEyNCAwIDEuODkuNzh0Ljc2NiAxLjkwNy0xLjA5MyAxLjg0NHoiLz48L3N2Zz4=');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOSAxMC4zNDRxLjQzOCAwIC43Mi0uMjk3dC4yOC0uNzAzLS4yOC0uNzAzVDkgOC4zNDVINi42NTZ2Mkg5em0tMi4zNDQtNnYyaDJxLjQwNiAwIC43MDMtLjI5N3QuMjk2LS43MDMtLjI5Ny0uNzAzLS43MDQtLjI5NmgtMnptMy43NSAyLjg0NHExLjQzOC42NTYgMS40MzggMi4yOCAwIDEuMDY0LS43MDMgMS43OThUOS4zNzYgMTJoLTQuNzJWMi42NTZoNC4xOXExLjEyNCAwIDEuODkuNzh0Ljc2NiAxLjkwNy0xLjA5MyAxLjg0NHoiLz48L3N2Zz4=');
    background-image: none;
    mask-size: 100%;
  }

  .IconButton__icon-italic___2hHzc {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNi42NTYgMi42NTZIMTJ2MmgtMS44NzVMNy44NzUgMTBoMS40N3YySDR2LTJoMS44NzVsMi4yNS01LjM0NGgtMS40N3YtMnoiLz48L3N2Zz4=');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNi42NTYgMi42NTZIMTJ2MmgtMS44NzVMNy44NzUgMTBoMS40N3YySDR2LTJoMS44NzVsMi4yNS01LjM0NGgtMS40N3YtMnoiLz48L3N2Zz4=');
    background-image: none;
    mask-size: 100%;
  }

  .IconButton__icon-unordered-list-item___Pvkrr {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNC42NTYgMy4zNDRIMTR2MS4zMTNINC42NTZWMy4zNDR6bTAgNS4zMTJWNy4zNDNIMTR2MS4zMTNINC42NTZ6bTAgNHYtMS4zMTNIMTR2MS4zMTNINC42NTZ6bS0yLTEuNTNxLjM3NSAwIC42NC4yNXQuMjY3LjYyNC0uMjY2LjYyNS0uNjQuMjUtLjYyNi0uMjVUMS43OCAxMnQuMjUtLjYyNS42MjYtLjI1em0wLTguMTI2cS40MDYgMCAuNzAzLjI4dC4yOTYuNzItLjI5Ny43Mi0uNzA0LjI4LS43MDMtLjI4VDEuNjU2IDR0LjI5Ny0uNzIuNzAzLS4yOHptMCA0cS40MDYgMCAuNzAzLjI4dC4yOTYuNzItLjI5Ny43Mi0uNzA0LjI4LS43MDMtLjI4VDEuNjU2IDh0LjI5Ny0uNzIuNzAzLS4yOHoiLz48L3N2Zz4=');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNC42NTYgMy4zNDRIMTR2MS4zMTNINC42NTZWMy4zNDR6bTAgNS4zMTJWNy4zNDNIMTR2MS4zMTNINC42NTZ6bTAgNHYtMS4zMTNIMTR2MS4zMTNINC42NTZ6bS0yLTEuNTNxLjM3NSAwIC42NC4yNXQuMjY3LjYyNC0uMjY2LjYyNS0uNjQuMjUtLjYyNi0uMjVUMS43OCAxMnQuMjUtLjYyNS42MjYtLjI1em0wLTguMTI2cS40MDYgMCAuNzAzLjI4dC4yOTYuNzItLjI5Ny43Mi0uNzA0LjI4LS43MDMtLjI4VDEuNjU2IDR0LjI5Ny0uNzIuNzAzLS4yOHptMCA0cS40MDYgMCAuNzAzLjI4dC4yOTYuNzItLjI5Ny43Mi0uNzA0LjI4LS43MDMtLjI4VDEuNjU2IDh0LjI5Ny0uNzIuNzAzLS4yOHoiLz48L3N2Zz4=');
    background-image: none;
    mask-size: 100%;
  }

  .IconButton__icon-ordered-list-item___2rzD0 {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNC42NTYgOC42NTZWNy4zNDNIMTR2MS4zMTNINC42NTZ6bTAgNHYtMS4zMTNIMTR2MS4zMTNINC42NTZ6bTAtOS4zMTJIMTR2MS4zMTNINC42NTZWMy4zNDR6bS0zLjMxMiA0di0uNjg4aDJ2LjYyNWwtMS4yMiAxLjM3NmgxLjIydi42ODhoLTJWOC43MmwxLjE4OC0xLjM3NkgxLjM0NHptLjY1Ni0ydi0yaC0uNjU2di0uNjg4aDEuMzEzdjIuNjg4SDJ6bS0uNjU2IDZ2LS42ODhoMnYyLjY4OGgtMnYtLjY4OGgxLjMxM3YtLjMxM0gydi0uNjg4aC42NTd2LS4zMTNIMS4zNDR6Ii8+PC9zdmc+');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNC42NTYgOC42NTZWNy4zNDNIMTR2MS4zMTNINC42NTZ6bTAgNHYtMS4zMTNIMTR2MS4zMTNINC42NTZ6bTAtOS4zMTJIMTR2MS4zMTNINC42NTZWMy4zNDR6bS0zLjMxMiA0di0uNjg4aDJ2LjYyNWwtMS4yMiAxLjM3NmgxLjIydi42ODhoLTJWOC43MmwxLjE4OC0xLjM3NkgxLjM0NHptLjY1Ni0ydi0yaC0uNjU2di0uNjg4aDEuMzEzdjIuNjg4SDJ6bS0uNjU2IDZ2LS42ODhoMnYyLjY4OGgtMnYtLjY4OGgxLjMxM3YtLjMxM0gydi0uNjg4aC42NTd2LS4zMTNIMS4zNDR6Ii8+PC9zdmc+');
    background-image: none;
    mask-size: 100%;
  }

  .IconButton__icon-link___2umEl {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNMTkuNSAxNi4yODZxMC0uNTM2LS4zNzUtLjkxbC0yLjc4Ni0yLjc4N3EtLjM3Ni0uMzc2LS45MTItLjM3Ni0uNTYzIDAtLjk2NC40M2wuMjU0LjI0N3EuMjE0LjIwOC4yODguMjl0LjIuMjUzLjE3NS4zNDIuMDQ4LjM2OHEwIC41MzYtLjM3NS45MXQtLjkxLjM3NnEtLjIwMiAwLS4zNy0uMDQ4dC0uMzQtLjE3NC0uMjU1LS4yLS4yODgtLjI5LS4yNDgtLjI1M3EtLjQ0Mi40MTUtLjQ0Mi45NzggMCAuNTM2LjM3NS45MWwyLjc2IDIuNzczcS4zNi4zNjIuOTEuMzYyLjUzNiAwIC45MS0uMzQ4bDEuOTctMS45NTVxLjM3NS0uMzc1LjM3NS0uODk3em0tOS40MTUtOS40NDJxMC0uNTM2LS4zNzUtLjkxTDYuOTUgMy4xNnEtLjM3NC0uMzc0LS45MS0uMzc0LS41MjIgMC0uOTEuMzYyTDMuMTYgNS4xMDNxLS4zNzUuMzc1LS4zNzUuODk3IDAgLjUzNi4zNzUuOTFsMi43ODYgMi43ODdxLjM2Mi4zNjIuOTEuMzYyLjU2NCAwIC45NjUtLjQxNmwtLjI1My0uMjQ4cS0uMjEzLS4yMDgtLjI4OC0uMjg4dC0uMjAyLS4yNTQtLjE3NC0uMzQyLS4wNDctLjM2OHEwLS41MzYuMzc1LS45MXQuOTEtLjM3NnEuMjAyIDAgLjM3LjA0N3QuMzQuMTc0LjI1NS4yLjI4OC4yODguMjQ4LjI1NHEuNDQyLS40MTUuNDQyLS45Nzh6bTExLjk4NiA5LjQ0MnEwIDEuNjA3LTEuMTM3IDIuNzJsLTEuOTcgMS45NTRxLTEuMTEgMS4xMTItMi43MTggMS4xMTItMS42MiAwLTIuNzMyLTEuMTM4bC0yLjc2LTIuNzcycS0xLjExLTEuMTEyLTEuMTEtMi43MiAwLTEuNjQ2IDEuMTc4LTIuNzk4bC0xLjE3OC0xLjE4cS0xLjE1MiAxLjE4LTIuNzg2IDEuMTgtMS42MDcgMC0yLjczMi0xLjEyNUwxLjMzOCA4LjczMlEuMjEzIDcuNjA4LjIxMyA2VDEuMzUgMy4yODNsMS45Ny0xLjk1NVE0LjQzMi4yMTUgNi4wNC4yMTVxMS42MiAwIDIuNzMgMS4xMzhsMi43NiAyLjc3MnExLjExMiAxLjExMiAxLjExMiAyLjcyIDAgMS42NDYtMS4xOCAyLjc5OGwxLjE4IDEuMThxMS4xNTItMS4xOCAyLjc4Ni0xLjE4IDEuNjA3IDAgMi43MzIgMS4xMjVsMi43ODYgMi43ODZxMS4xMjUgMS4xMjUgMS4xMjUgMi43MzJ6Ii8+PC9zdmc+');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNMTkuNSAxNi4yODZxMC0uNTM2LS4zNzUtLjkxbC0yLjc4Ni0yLjc4N3EtLjM3Ni0uMzc2LS45MTItLjM3Ni0uNTYzIDAtLjk2NC40M2wuMjU0LjI0N3EuMjE0LjIwOC4yODguMjl0LjIuMjUzLjE3NS4zNDIuMDQ4LjM2OHEwIC41MzYtLjM3NS45MXQtLjkxLjM3NnEtLjIwMiAwLS4zNy0uMDQ4dC0uMzQtLjE3NC0uMjU1LS4yLS4yODgtLjI5LS4yNDgtLjI1M3EtLjQ0Mi40MTUtLjQ0Mi45NzggMCAuNTM2LjM3NS45MWwyLjc2IDIuNzczcS4zNi4zNjIuOTEuMzYyLjUzNiAwIC45MS0uMzQ4bDEuOTctMS45NTVxLjM3NS0uMzc1LjM3NS0uODk3em0tOS40MTUtOS40NDJxMC0uNTM2LS4zNzUtLjkxTDYuOTUgMy4xNnEtLjM3NC0uMzc0LS45MS0uMzc0LS41MjIgMC0uOTEuMzYyTDMuMTYgNS4xMDNxLS4zNzUuMzc1LS4zNzUuODk3IDAgLjUzNi4zNzUuOTFsMi43ODYgMi43ODdxLjM2Mi4zNjIuOTEuMzYyLjU2NCAwIC45NjUtLjQxNmwtLjI1My0uMjQ4cS0uMjEzLS4yMDgtLjI4OC0uMjg4dC0uMjAyLS4yNTQtLjE3NC0uMzQyLS4wNDctLjM2OHEwLS41MzYuMzc1LS45MXQuOTEtLjM3NnEuMjAyIDAgLjM3LjA0N3QuMzQuMTc0LjI1NS4yLjI4OC4yODguMjQ4LjI1NHEuNDQyLS40MTUuNDQyLS45Nzh6bTExLjk4NiA5LjQ0MnEwIDEuNjA3LTEuMTM3IDIuNzJsLTEuOTcgMS45NTRxLTEuMTEgMS4xMTItMi43MTggMS4xMTItMS42MiAwLTIuNzMyLTEuMTM4bC0yLjc2LTIuNzcycS0xLjExLTEuMTEyLTEuMTEtMi43MiAwLTEuNjQ2IDEuMTc4LTIuNzk4bC0xLjE3OC0xLjE4cS0xLjE1MiAxLjE4LTIuNzg2IDEuMTgtMS42MDcgMC0yLjczMi0xLjEyNUwxLjMzOCA4LjczMlEuMjEzIDcuNjA4LjIxMyA2VDEuMzUgMy4yODNsMS45Ny0xLjk1NVE0LjQzMi4yMTUgNi4wNC4yMTVxMS42MiAwIDIuNzMgMS4xMzhsMi43NiAyLjc3MnExLjExMiAxLjExMiAxLjExMiAyLjcyIDAgMS42NDYtMS4xOCAyLjc5OGwxLjE4IDEuMThxMS4xNTItMS4xOCAyLjc4Ni0xLjE4IDEuNjA3IDAgMi43MzIgMS4xMjVsMi43ODYgMi43ODZxMS4xMjUgMS4xMjUgMS4xMjUgMi43MzJ6Ii8+PC9zdmc+');
    background-image: none;
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position-x: center;
    mask-position-y: center;
  }

  .IconButton__icon-remove-link___j61pw {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNNS44OCAxNy4wMjJsLTMuNDMgMy40M3EtLjEzNC4xMi0uMzA4LjEyLS4xNiAwLS4zMDgtLjEyLS4xMi0uMTM1LS4xMi0uMzF0LjEyLS4zMDdsMy40My0zLjQzcS4xMzMtLjEyLjMwNy0uMTJ0LjMxLjEycS4xMi4xMzUuMTIuMzF0LS4xMi4zMDd6bTIuMjYzLjU1djQuMjg1cTAgLjE4OC0uMTIuMzA4dC0uMzEuMTItLjMwNy0uMTItLjEyLS4zMDhWMTcuNTdxMC0uMTg3LjEyLS4zMDd0LjMwOC0uMTIuMzA4LjEyLjEyLjMwOHptLTMtM3EwIC4xODctLjEyLjMwN3QtLjMxLjEySC40M3EtLjE4OCAwLS4zMDgtLjEyVDAgMTQuNTd0LjEyLS4zMDcuMzA4LS4xMmg0LjI4NnEuMTg4IDAgLjMwOC4xMnQuMTIuMzA4em0xNi45MjggMS43MTRxMCAxLjYwNy0xLjEzNyAyLjcybC0xLjk3IDEuOTU0cS0xLjExIDEuMTEyLTIuNzE4IDEuMTEyLTEuNjIgMC0yLjczMi0xLjEzOEw5LjA0IDE2LjQ0N3EtLjI4LS4yOC0uNTYzLS43NWwzLjItLjI0IDMuNjU3IDMuNjdxLjM2Mi4zNi45MS4zNjd0LjkxMi0uMzU1bDEuOTctMS45NTZxLjM3NC0uMzc1LjM3NC0uODk3IDAtLjUzNi0uMzc1LS45MWwtMy42Ny0zLjY4NC4yNC0zLjJxLjQ3LjI4Ljc1LjU2Mmw0LjUgNC41cTEuMTI2IDEuMTUyIDEuMTI2IDIuNzMyek0xMy44MSA2LjU5bC0zLjIuMjRMNi45NSAzLjE2cS0uMzc0LS4zNzUtLjkxLS4zNzUtLjUyMiAwLS45MS4zNjJMMy4xNiA1LjEwMnEtLjM3NS4zNzUtLjM3NS44OTcgMCAuNTM1LjM3NS45MWwzLjY3IDMuNjctLjI0IDMuMjE0cS0uNDctLjI4LS43NS0uNTYzbC00LjUtNC41US4yMTMgNy41OC4yMTMgNnEwLTEuNjA4IDEuMTM4LTIuNzJsMS45Ny0xLjk1NVE0LjQzLjIxMyA2LjA0LjIxM3ExLjYyIDAgMi43MzIgMS4xMzhsNC40NzMgNC40ODhxLjI4LjI4LjU2My43NXptOC40NzggMS4xMjRxMCAuMTg4LS4xMi4zMDh0LS4zMS4xMmgtNC4yODVxLS4xODcgMC0uMzA3LS4xMnQtLjEyLS4zMDguMTItLjMwOC4zMDgtLjEyaDQuMjg3cS4xODggMCAuMzA4LjEydC4xMi4zMDh6TTE1IC40M3Y0LjI4NXEwIC4xODgtLjEyLjMwOHQtLjMxLjEyLS4zMDctLjEyLS4xMi0uMzA4Vi40M3EwLS4xOS4xMi0uMzFUMTQuNTcgMHQuMzEuMTIuMTIuMzF6bTUuNDUgMi4wMmwtMy40MjggMy40M3EtLjE0Ny4xMi0uMzA4LjEydC0uMzA4LS4xMnEtLjEyLS4xMzQtLjEyLS4zMDh0LjEyLS4zMDhsMy40My0zLjQzcS4xMzMtLjEyLjMwNy0uMTJ0LjMwOC4xMnEuMTIyLjEzNS4xMjIuMzF0LS4xMi4zMDd6Ii8+PC9zdmc+');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNNS44OCAxNy4wMjJsLTMuNDMgMy40M3EtLjEzNC4xMi0uMzA4LjEyLS4xNiAwLS4zMDgtLjEyLS4xMi0uMTM1LS4xMi0uMzF0LjEyLS4zMDdsMy40My0zLjQzcS4xMzMtLjEyLjMwNy0uMTJ0LjMxLjEycS4xMi4xMzUuMTIuMzF0LS4xMi4zMDd6bTIuMjYzLjU1djQuMjg1cTAgLjE4OC0uMTIuMzA4dC0uMzEuMTItLjMwNy0uMTItLjEyLS4zMDhWMTcuNTdxMC0uMTg3LjEyLS4zMDd0LjMwOC0uMTIuMzA4LjEyLjEyLjMwOHptLTMtM3EwIC4xODctLjEyLjMwN3QtLjMxLjEySC40M3EtLjE4OCAwLS4zMDgtLjEyVDAgMTQuNTd0LjEyLS4zMDcuMzA4LS4xMmg0LjI4NnEuMTg4IDAgLjMwOC4xMnQuMTIuMzA4em0xNi45MjggMS43MTRxMCAxLjYwNy0xLjEzNyAyLjcybC0xLjk3IDEuOTU0cS0xLjExIDEuMTEyLTIuNzE4IDEuMTEyLTEuNjIgMC0yLjczMi0xLjEzOEw5LjA0IDE2LjQ0N3EtLjI4LS4yOC0uNTYzLS43NWwzLjItLjI0IDMuNjU3IDMuNjdxLjM2Mi4zNi45MS4zNjd0LjkxMi0uMzU1bDEuOTctMS45NTZxLjM3NC0uMzc1LjM3NC0uODk3IDAtLjUzNi0uMzc1LS45MWwtMy42Ny0zLjY4NC4yNC0zLjJxLjQ3LjI4Ljc1LjU2Mmw0LjUgNC41cTEuMTI2IDEuMTUyIDEuMTI2IDIuNzMyek0xMy44MSA2LjU5bC0zLjIuMjRMNi45NSAzLjE2cS0uMzc0LS4zNzUtLjkxLS4zNzUtLjUyMiAwLS45MS4zNjJMMy4xNiA1LjEwMnEtLjM3NS4zNzUtLjM3NS44OTcgMCAuNTM1LjM3NS45MWwzLjY3IDMuNjctLjI0IDMuMjE0cS0uNDctLjI4LS43NS0uNTYzbC00LjUtNC41US4yMTMgNy41OC4yMTMgNnEwLTEuNjA4IDEuMTM4LTIuNzJsMS45Ny0xLjk1NVE0LjQzLjIxMyA2LjA0LjIxM3ExLjYyIDAgMi43MzIgMS4xMzhsNC40NzMgNC40ODhxLjI4LjI4LjU2My43NXptOC40NzggMS4xMjRxMCAuMTg4LS4xMi4zMDh0LS4zMS4xMmgtNC4yODVxLS4xODcgMC0uMzA3LS4xMnQtLjEyLS4zMDguMTItLjMwOC4zMDgtLjEyaDQuMjg3cS4xODggMCAuMzA4LjEydC4xMi4zMDh6TTE1IC40M3Y0LjI4NXEwIC4xODgtLjEyLjMwOHQtLjMxLjEyLS4zMDctLjEyLS4xMi0uMzA4Vi40M3EwLS4xOS4xMi0uMzFUMTQuNTcgMHQuMzEuMTIuMTIuMzF6bTUuNDUgMi4wMmwtMy40MjggMy40M3EtLjE0Ny4xMi0uMzA4LjEydC0uMzA4LS4xMnEtLjEyLS4xMzQtLjEyLS4zMDh0LjEyLS4zMDhsMy40My0zLjQzcS4xMzMtLjEyLjMwNy0uMTJ0LjMwOC4xMnEuMTIyLjEzNS4xMjIuMzF0LS4xMi4zMDd6Ii8+PC9zdmc+');
    background-image: none;
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position-x: center;
    mask-position-y: center;
  }

  .IconButton__icon-undo___EQSRP {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTcuODU2IDI0YzIuNjY1LTQuODMgMy4xMTUtMTIuMTk1LTcuMzU2LTExLjk1VjE4bC05LTkgOS05djUuODJDMjMuMDM4IDUuNDk1IDI0LjQzNSAxNi44OSAxNy44NTYgMjR6Ii8+PC9zdmc+');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTcuODU2IDI0YzIuNjY1LTQuODMgMy4xMTUtMTIuMTk1LTcuMzU2LTExLjk1VjE4bC05LTkgOS05djUuODJDMjMuMDM4IDUuNDk1IDI0LjQzNSAxNi44OSAxNy44NTYgMjR6Ii8+PC9zdmc+');
    background-image: none;
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position-x: center;
    mask-position-y: center;
  }

  .IconButton__icon-redo___30MVz {
    background-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
    -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuNSA1LjgyVjBsOSA5LTkgOXYtNS45NUMzLjAzIDExLjgwNiAzLjQ3OCAxOS4xNyA2LjE0NCAyNC0uNDM2IDE2Ljg5Ljk2MiA1LjQ5NCAxMy41IDUuODJ6Ii8+PC9zdmc+');
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuNSA1LjgyVjBsOSA5LTkgOXYtNS45NUMzLjAzIDExLjgwNiAzLjQ3OCAxOS4xNyA2LjE0NCAyNC0uNDM2IDE2Ljg5Ljk2MiA1LjQ5NCAxMy41IDUuODJ6Ii8+PC9zdmc+');
    background-image: none;
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position-x: center;
    mask-position-y: center;
  }

  .EditorToolbar__root___3_Aqz {
    border-bottom: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)} !important;
  }

  .Dropdown__root___3ALmx {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']};
  }

  .Dropdown__value___34Py9::before {
    border-bottom-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']} !important;
  }

  .Dropdown__value___34Py9::after {
    border-top-color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']} !important;
  }

  .IconButton__isActive___2Ey8p {
    background: linear-gradient(
      180deg,
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.25)} 0,
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.25)}
    ) !important;
  }

  .geosuggest__suggests {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};

    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .geosuggest__item {
    padding: 8px;
  }

  .geosuggest__item:hover {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  fieldset {
    border: none;
  }

  .set {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
    padding: 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
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

  label {
    font-size: 20px;
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['300'] : props.theme.PALLET['600']};
    font-weight: bold;
    margin: 4px 0px;
  }

  input {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
    background: -webkit-linear-gradient(
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
    padding: 8px;
    border-radius: 4px;
  }

  > input,
  label {
    display: block;
    flex-grow: 1;
  }

  p {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['500'] : props.theme.PALLET['500']};
  }

  .offers {
    .options {
      display: flex;
      flex-direction: row;
      > label {
        margin: 8px;
        > input {
          display: none;
        }
      }
    }
  }
`;

function Step(props) {
  return <div {...props}></div>;
}

Step = styled(Step)``;

function FormNav(props) {
  return (
    <div {...props}>
      <div className="strapline">Reach the young, bright minds of the future</div>
    </div>
  );
}

FormNav = styled(FormNav)`
  background: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  .strapline {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['300'] : props.theme.PALLET['600']};
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
`;

function PostJobPage(props) {
  const [job, setJob] = useState({
    id: '',
    job_title: '',
    category: '',
    job_type: '',
    apply_link: '',
    job_desc: '',
    name: '',
    company_statement: '',
    logo: '',
    website: '',
    email: '',
    company_desc: ''
  });

  return (
    <div {...props}>
      <About onSubmit={setJob}></About>
    </div>
  );
}

PostJobPage = styled(PostJobPage)`
  caret-color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET['300'] : props.theme.PALLET['600']};

  ${StepWizard} {
    overflow: -moz-hidden-unscrollable;
  }

  .set {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
    padding: 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
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
`;

export default PostJobPage;
