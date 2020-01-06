import React, { useCallback, useState, useEffect } from "react";

import styled from "styled-components";

import { useDispatch } from "redux-react-hook";
import { setColorTheme } from "../actions/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
// import { toggleTheme } from "../actions/actions";

function ThemePicker(props) {
    const [picked, setPicked] = useState("blue");

    const dispatch = useDispatch()

    useEffect(() => {
        switch (picked) {
            case "pink":
                dispatch(setColorTheme({ PRIMARY_COLOR: "#E87BBE", SECONDARY_COLOR: "#8E9DEF" }))
                break;
            case "blue":
                dispatch(setColorTheme({ PRIMARY_COLOR: "#59A2EC", SECONDARY_COLOR: "#434DC3" }))
                break;
            case "orange":
                dispatch(setColorTheme({ PRIMARY_COLOR: "#E87A40", SECONDARY_COLOR: "#EF6A6A" }))
                break;
            case "green":
                dispatch(setColorTheme({ PRIMARY_COLOR: "#40E853", SECONDARY_COLOR: "#16A72D" }))
                break;
        }
    }, [picked]);

    return <div {...props}>
        <fieldset>
            <label onClick={() => setPicked("blue")}>
                <input type="radio" name="color" id="blue" defaultChecked />
                <div className="color">
                    {
                        picked === "blue" ?
                            <FontAwesomeIcon icon={faCheckCircle} />
                            : <FontAwesomeIcon icon={faCircle} />
                    }
                </div>
            </label>
            <label onClick={() => setPicked("pink")}>
                <input type="radio" name="color" id="pink" />
                <div className="color">
                    {
                        picked === "pink" ?
                            <FontAwesomeIcon icon={faCheckCircle} />
                            : <FontAwesomeIcon icon={faCircle} />
                    }
                </div>
            </label>
            <label onClick={() => setPicked("orange")}>
                <input type="radio" name="color" id="orange" />
                <div className="color">
                    {
                        picked === "orange" ?
                            <FontAwesomeIcon icon={faCheckCircle} />
                            : <FontAwesomeIcon icon={faCircle} />
                    }
                </div>
            </label>
            <label onClick={() => setPicked("green")}>
                <input type="radio" name="color" id="green" />
                <div className="color">
                    {
                        picked === "green" ?
                            <FontAwesomeIcon icon={faCheckCircle} />
                            : <FontAwesomeIcon icon={faCircle} />
                    }
                </div>
            </label>
        </fieldset>
    </div>
}

ThemePicker = styled(ThemePicker)`
    fieldset {
        display: flex;
        border: none;
    }
    #orange {
        & + div > svg {
            color: #E87A40;
        }
    }

    #blue {
        & + div > svg {
            color: #59A2EC;
        }
    }

    #pink {
        & + div > svg {
            color: #E87BBE;
        }
    }

    #green {
        & + div > svg {
            color: #40E853;
        }
    }

    .color {
        cursor: pointer;
        display: block;
        font-size: 20px;
        /* width: 16px;
        height: 16px; */
        /* border-radius: 100%; */
    }
    input {
        visibility: hidden;
        position: absolute;
    }
`;

function Header(props) {
    const dispatch = useDispatch()
    const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), [

    ]);

    return <div {...props}>
        <h1>STUDENT<span>LOG</span></h1>
        <input type="checkbox" value={true} onClick={toggleTheme} />
        <ThemePicker />
    </div>
}

Header = styled(Header)`
    width: 100vw;
    /* background: #24252D; */
    /* box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.02); */

    width: 100%;
    max-width: 800px;
    margin: auto;
    padding: 24px 0px 8px 12px !important;

    h1 {
        font-size: 20px; 
        color: ${props => props.theme.is === "dark" ? "white" : "#939399"};
        span {
            font-weight: 600;
            position: sticky;
            background: -webkit-linear-gradient(${props => props.theme.PRIMARY_COLOR}, ${props => props.theme.SECONDARY_COLOR});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`;

export default Header;