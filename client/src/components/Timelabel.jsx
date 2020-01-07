import React from "react";

import styled from "styled-components";

function Timelabel(props) {
    return <div {...props}>
        <div>{props.children}</div>
    </div>;
}

Timelabel = styled(Timelabel)`
    grid-column: 1;
    grid-row: ${props => props.index + 1} / span 1;
    height: 100%;
    margin: auto;
    position: relative;

    > div {
        color: ${props => props.theme.is === "dark" ? "white" : "#17171c"};
        font-size: 10px;
        position: relative;
        transform: translateY(-50%);
        background: ${props => props.theme.is === "dark" ? "#17171c" : "white"};
        padding: 4px;
        z-index: 100;
    }
`;

export default Timelabel;
