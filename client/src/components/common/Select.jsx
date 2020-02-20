import React, { Component } from 'react';
import ReactSelect from 'react-select';

import styled from 'styled-components';
import { rgba } from 'polished';

const institutions = {
  'abdn.ac.uk': {
    name: 'University of Aberdeen',
    id: '8c2b19ad-5f9c-49d4-9077-3ec3cfc52b3f'
  },
  'abertay.ac.uk': {
    name: 'Abertay University (formerly University of Abertay Dundee)',
    id: 'aacb1aba-f38f-410e-9153-c16a00ebf4cc'
  },
  'aber.ac.uk': {
    name: 'Aberystwyth University (Prifysgol Aberystwyth)',
    id: 'd47b090e-3f5a-4ca0-84d0-9f89d269f175'
  },
  'anglia.ac.uk': {
    name: 'Anglia Ruskin University',
    id: '2f7b8f0d-2d82-4501-918c-21d4a982384a'
  },
  'aecc.ac.uk': {
    name: 'Anglo-European College of Chiropractic',
    id: 'f13ae0fe-0692-43ad-8a1d-355b8c3cac9e'
  },
  'arden.ac.uk': {
    name: 'Arden University (formerly known as Resource Development International)',
    id: 'b0f37574-1a82-4028-9f21-6a1391c5327e'
  },
  'aston.ac.uk': {
    name: 'Aston University',
    id: 'a085950c-4c25-44d5-945a-b852fa44a221'
  },
  'bangor.ac.uk': {
    name: 'Bangor University (Prifysgol Bangor)',
    id: 'c6474c55-a923-4d2a-9bd4-ece37148dbb2'
  },
  'bath.ac.uk': {
    name: 'University of Bath',
    id: '377e3d22-4ea1-422d-b0ad-8fcc89406b9e'
  },
  'bathspa.ac.uk': {
    name: 'Bath Spa University',
    id: 'bathspa.ac.uk'
  },
  'beds.ac.uk': {
    name: 'University of Bedfordshire',
    id: '3133dbdc-3c64-4bda-a66a-751445a19275'
  },
  'bbk.ac.uk': {
    name: 'Birkbeck, University of London',
    id: '89d07f47-d258-463c-8700-635ffaeca38e'
  },
  'bham.ac.uk': {
    name: 'University of Birmingham',
    id: 'b024cacf-dede-4241-a15c-3c97d553e9f3'
  },
  'bcu.ac.uk': {
    name: 'Birmingham City University',
    id: '7e2be055-828a-4523-b5e5-b77ad9939785'
  },
  'ucb.ac.uk': {
    name: 'University College Birmingham',
    id: 'a3950553-7d10-400b-bc8d-89c957233230'
  },
  'bishopg.ac.uk': {
    name: 'Bishop Grossteste University',
    id: '108f3af8-970e-4451-94fa-01855a016852'
  },
  'bolton.ac.uk': {
    name: 'University of Bolton',
    id: 'dea51c67-ef23-4343-9d6c-6eb04d3029de'
  },
  'aub.ac.uk': {
    name: 'Arts University Bournemouth',
    id: 'f8eeeb9f-0990-4abf-950c-eb8f53fe7c77'
  },
  'bournemouth.ac.uk': {
    name: 'Bournemouth University',
    id: 'ede29655-d097-42e4-bbb5-f38d427fbfb8'
  },
  // 'bppuniversity.ac.uk': {
  //   name: 'BPP University',
  //   id: ''
  // },
  'bradford.ac.uk': {
    name: 'University of Bradford',
    id: '245ea2d1-4365-4726-805a-631eb93d93aa'
  },
  'brighton.ac.uk': {
    name: 'University of Brighton',
    id: 'a900bb90-94fe-4658-8b34-dd72084c5064'
  },
  'brunel.ac.uk': {
    name: 'Brunel University London',
    id: '4cad97b1-5935-4103-a866-57ad98a1517e'
  },
  'buckingham.ac.uk': {
    name: 'University of Buckingham',
    id: 'eba46400-24e6-4c07-a7c6-cc061e0f8d26'
  },
  'bucks.ac.uk': {
    name: 'Buckinghamshire New University',
    id: '8fca115b-60cd-4375-a972-ef2b948c0fa5'
  },
  'cam.ac.uk': {
    name: 'University of Cambridge',
    id: '49a50445-bdfa-4b79-ade3-547b4f3986e9'
  },
  'canterbury.ac.uk': {
    name: 'Canterbury Christ Church University',
    id: '0320b2da-22dd-4dab-8c21-6e644ba14f13'
  },
  'cardiffmet.ac.uk': {
    name: 'Cardiff Metropolitan University (Prifysgol Metropolitan Caerdydd)',
    id: '189dc61c-769b-4048-8b0f-6de074bba26c'
  },
  'cf.ac.uk': {
    name: 'Cardiff University (Prifysgol Caerdydd)',
    id: 'bdb74b30-9568-4856-bdbf-06759778fcbc'
  },
  'chester.ac.uk': {
    name: 'University of Chester',
    id: '18843e6e-1846-456c-a05c-500f0aee12f6'
  },
  'chi.ac.uk': {
    name: 'University of Chichester',
    id: '32622811-fc4d-4784-80a8-fd991eedd987'
  },
  'city.ac.uk': {
    name: 'City University London',
    id: 'dd615949-5bd0-4da0-ac52-28ef8d336373'
  },
  'courtauld.ac.uk': {
    name: 'Courtauld Institute of Art',
    id: '5727205c-1b19-4f58-a060-dab605720a20'
  },
  'coventry.ac.uk': {
    name: 'Coventry University',
    id: '4b18ab9a-3765-4abe-ac7c-0e0d398afd4f'
  },
  'cranfield.ac.uk': {
    name: 'Cranfield University',
    id: '31dca259-f714-4c48-ba5c-aa96dcf60aaa'
  },
  'uca.ac.uk': {
    name: 'University for the Creative Arts',
    id: '069c310c-d4c2-4554-b166-90ca805a5eaa'
  },
  'cumbria.ac.uk': {
    name: 'University of Cumbria',
    id: 'b627db1d-9958-4fd1-8ea4-8ac3b27cf00f'
  },
  'rgu.ac.uk': {
    name: 'Robert Gordon University',
    id: '51a0a69c-0e4f-4b3d-b642-12e013198635'
  },
  'ed.ac.uk': {
    name: 'The University of Edinburgh',
    id: '2e9f06b0-1669-4589-8789-10a06934dc61'
  },
  'nescol.ac.uk': {
    name: 'North East Scotland College',
    id: 'b8c4db00-0d50-40e1-b5eb-7b8290a8b9bb'
  },
  'gla.ac.uk': {
    name: 'University of Glasgow',
    id: '6e725c29-763a-4f50-81f2-2e254f0133c8'
  },
  'strath.ac.uk': {
    name: 'University of Strathclyde',
    id: '631e0763-1533-47eb-a5cd-0457bee5944e'
  },
  'harvard.edu': {
    name: 'Harvard University',
    id: '6ffa22f4-4568-4105-ad43-2e3ad4726957'
  },
  'ox.ac.uk': {
    name: 'University of Oxford',
    id: 'cc95de1b-97f5-4f93-b4ba-fe68b852cf91'
  },
  'st-andrews.ac.uk': {
    name: 'University of St Andrews',
    id: 'f85626cb-0da8-49d3-aa58-64ef678ef01a'
  },
  'uws.ac.uk': {
    name: 'University of the West of Scotland',
    id: 'f89944b7-4a4e-4ea7-9156-3299f3411647'
  },
  'hw.ac.uk': {
    name: 'Heriot Watt University',
    id: '6c425ff2-6865-42df-a4db-8e6af634813d'
  },
  'upenn.edu': {
    name: 'University of Pennsylvania',
    id: '6c4d949d-b91c-4c45-9aae-66d76443110d'
  },
  'cornell.edu': {
    name: 'Cornell University',
    id: '5d7e4366-1b9b-45cf-8e79-b14b27df46e1'
  },
  'mcgill.ca': {
    name: 'McGill University',
    id: 'cd319671-52e7-4a68-afa9-fcf8f89f09ea'
  },
  'gcu.ac.uk': {
    name: 'Glasgow Caledonian University',
    id: 'c72728f7-4cca-49fe-bc49-47ab02f7a930'
  },
  'stir.ac.uk': {
    name: 'University of Stirling',
    id: '4e8d09f7-cc79-4ccb-9149-a4238dd17422'
  },
  'dundee.ac.uk': {
    name: 'University of Dundee',
    id: 'ae323139-093a-4d2a-81a6-5d334bcd9019'
  },
  'napier.ac.uk': {
    name: 'Edinburgh Napier University',
    id: '99e0dc58-9c4b-4820-8617-04c386c254c6'
  },
  'gsa.ac.uk': {
    name: 'Glasgow School of Art',
    id: 'gsa.ac.uk'
  },
  'rcs.ac.uk': {
    name: 'Royal Conservatoire of Scotland',
    id: '09ab91a8-e6d6-4fba-98da-63eac7ab3ce2'
  }
};

function hydrate(institutions) {
  return Object.keys(institutions).map((institution, i) => {
    return { label: institutions[institution].name, value: institution };
  });
}

const options = hydrate(institutions);

// const options = [
//   { label: 'Robert Gordon University', value: 'rgu.ac.uk' },
//   { label: 'University of Aberdeen', value: 'abdn.ac.uk' },
//   { label: 'The University of Edinburgh', value: 'ed.ac.uk' },
//   { label: 'North East Scotland College', value: 'nescol.ac.uk' },
//   { label: 'University of Glasgow', value: 'gla.ac.uk' },
//   { label: 'University of Strathclyde', value: 'strath.ac.uk' },
//   { label: 'Harvard University', value: 'harvard.edu' },
//   { label: 'University of Oxford', value: 'ox.ac.uk' },
//   { label: 'University of Cambridge', value: 'cam.ac.uk' },
//   { label: 'University of St Andrews', value: 'st-andrews.ac.uk' },
//   { label: 'University of the West of Scotland', value: 'uws.ac.uk' },
//   { label: 'Heriot Watt University', value: 'hw.ac.uk' },
//   { label: 'University of Pennsylvania', value: 'upenn.edu' },
//   { label: 'Cornell University', value: 'cornell.edu' },
//   { label: 'McGill University', value: 'mcgill.ca' },
//   { label: 'Glasgow Caledonian University', value: 'gcu.ac.uk' },
//   { label: 'University of Stirling', value: 'stir.ac.uk' },
//   { label: 'University of Dundee', value: 'dundee.ac.uk' },
//   { label: 'Edinburgh Napier University', value: 'napier.ac.uk' },
//   { label: 'Glasgow School of Art', value: 'gsa.ac.uk' },
//   { label: 'Royal Conservatoire of Scotland', value: 'rcs.ac.uk' }
// ];

function Select(props) {
  return <ReactSelect classNamePrefix="react-select" {...props} options={options}></ReactSelect>;
}

export default styled(Select)`
  .react-select__input {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']} !important;
  }
  .react-select__option--is-focused {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
  }

  .react-select__control {
    box-shadow: none !important;
    background: -webkit-linear-gradient(
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};

    &:hover {
      border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
    }
  }

  .react-select__menu {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
  }

  .react-select__single-value,
  .react-select__placeholder {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']} !important;
  }

  .react-select__option,
  .react-select__option--is-focused {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']} !important;
    background: auto;
  }

  .react-select__option--is-selected {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']} !important;
  }

  .react-select__option:hover {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
  }
`;
