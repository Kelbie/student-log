import React from "react";

import styled from "styled-components";

function EditDropdown(props) {
    return <div {...props}>
        <div onClick={() => props.setIsEditable(true)}>Edit</div>
        <div>Delete</div>
    </div>
}

export default styled(EditDropdown)`

`;