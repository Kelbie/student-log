import Markdown from 'markdown-to-jsx';

// Styling
import styled from 'styled-components';

// add custom styling to Markdown to keep it consistent to our styles
export default styled(Markdown)`
  color: ${props => (props.theme.is === 'dark' ? 'white' : 'black')} code {
    display: inline-block;
    padding: 4px;
    background: ${props => (props.theme.is === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'white')};
    border: 1px solid #576877;
    border-radius: 4px;
  }

  blockquote {
    display: inline-block;
    margin: 0px;
    padding-left: 8px;
    border-left: 4px solid #576877;
    background: ${props => (props.theme.is === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'white')};
  }
`;
