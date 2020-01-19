import Markdown from "markdown-to-jsx";
import styled from "styled-components";

export default styled(Markdown)`
  code {
    display: inline-block;
    padding: 4px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #576877;
    border-radius: 4px;
  }

  blockquote {
    display: inline-block;
    margin: 0px;
    padding-left: 8px;
    border-left: 4px solid #576877;
    background: rgba(255, 255, 255, 0.1);
  }
`;
