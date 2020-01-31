import React from "react";

import styled, { withTheme } from "styled-components";

import getSlug from 'speakingurl';

import date from "date-and-time";

import ImageMask from "./ImageMask";
import { darken, opacify, rgba } from "polished";

import A from "./A";

import moment from "moment";
import Button, {ButtonLink2, Button2, ButtonExternal} from "./Button";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

function Placeholder(props) {
    return (
        <div {...props}>
            <ImageMask mask={props.mask} />
        </div>
    );
}

Placeholder = styled(Placeholder)`
    background: white;
`;

function Class(props) {
    console.log(props.date.toString())
    return (
        <div {...props}>
            <div className="gradient" />
            <div className="top">
                <div className="photo-container"></div>
                <div className="text">
                    <div className="left">
                        <A to={`/work/${props.id}/${getSlug(props.title + " " + props.company)}`} className="title">
                            {props.title}
                        </A>
                        <div className="module raise">
                            {props.company}
                            {` • `}
                            {props.type}
                        </div>
                    </div>
                    {
                        props.apply_link ? 
                            <ButtonExternal variant={"fill"} href={props.apply_link} icon={faExternalLinkAlt}>Apply</ButtonExternal>
                        :
                        <div className="right">
                            <div>
                                {props.date.format("MMM DD")}
                            </div>
                            <div className="new">
                                {
                                    props.date.add(3, "days").isAfter(moment(new Date())) ? "NEW" : ""
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
                {props.featured ? 
            <div className="bottom">
                    <div className="duration-container">
                        <div className="duration raise">FEATURED</div>
                    </div> 
            </div>
                    : ""
                }
        </div>
    );
}

Class = styled(Class)`
    grid-column: 2;
    border: 2px solid
        ${props => (props.theme.is === "dark" ? "white" : "black")};
    position: relative;
    border-radius: 4px;
    box-shadow: 0px 0px 16px 0px
        ${props =>
            props.featured
                ? rgba(props.theme.SECONDARY_COLOR, 0.3)
                : "rgba(0,0,0,0.1)"};
    .gradient {
        border-radius: 4px;
        position: absolute;
        z-index: 1;
        content: "";
        display: block;
        height: calc(100% + 4px);
        width: calc(100% + 4px);
        top: -2px;
        left: -2px;
        background: linear-gradient(
            to bottom right,
            ${props =>
                props.featured ? props.theme.PRIMARY_COLOR :  props.theme.is === "dark" ? "#24252d" : "white"},
            ${props =>
                props.featured ? props.theme.SECONDARY_COLOR : props.theme.is === "dark" ? "#24252d" : "white"}
        );
        mix-blend-mode: ${props =>
            props.theme.is === "dark" ? "multiply" : "lighten"};
    }
    /* Styling for main section */
    &::before {
        position: absolute;
        z-index: 0;
        content: "";
        display: block;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        background: ${props => (props.theme.is === "dark" ? "black" : "white")};
        border-radius: 4px;
    }
    .top {
        display: flex;
        position: relative;
        z-index: 1;
        padding: 16px;
        border-radius: 0px 0px 0px 0px;
        background: ${props =>
            props.theme.is === "dark" ? "#24252d" : "#fff"};
        mix-blend-mode: ${props =>
            props.theme.is === "dark" ? "lighten" : "darken"};
        /* &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: black;
        } */
    }
    .photo-container {
        width: 48px;
        height: 48px;
        margin-right: 8px;
        flex-shrink: 0;
        background: ${props => props.theme.is === "dark" ? "#17171C" : "#F8F7F7"};
    }
    .text {
        display: grid;
        grid-template-columns: 1fr max-content;
        flex-grow: 1;
        .left {
            margin-right: 8px;
            border-right: 1px solid ${props => !props.apply_link ? props.theme.is === "dark" ? "#494a55" : "#d9d9d9" : "none"};
        }
        .right {
            text-align: right;
            color: ${props => (props.theme.is === "dark" ? "#cbcbcb" : "#848484")};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 8px;
            .new {
                position: sticky;
                font-weight: 600;
                background: -webkit-linear-gradient(
                    ${props => props.theme.PRIMARY_COLOR},
                    ${props => props.theme.SECONDARY_COLOR}
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 12px;
            }
        }
    }
    .time {
        color: ${props => (props.theme.is === "dark" ? "#cbcbcb" : "#848484")};
        font-size: 12px;
        font-weight: 600;
    }
    .title {
        position: sticky;
        font-weight: 600;
        background: -webkit-linear-gradient(
            ${props => props.theme.PRIMARY_COLOR},
            ${props => props.theme.SECONDARY_COLOR}
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 20px;
    }
    .module {
        color: ${props => (props.theme.is === "dark" ? "#cbcbcb" : "#848484")};
        font-size: 16px;
    }
    .raise {
        position: relative;
        z-index: 2;
        isolation: isolate;
    }
    .drop {
        position: initial;
    }
    .bottom {
        position: relative;
        height: 24px;
        width: 100%;
        background: ${props => (props.theme.is === "dark" ? "white" : "black")};
    }
    .duration-container {
        position: absolute;
        display: inline-block;
        background: ${props =>
            props.theme.is === "dark" ? "#24252d" : "#fff"};
        border: 2px solid
            ${props => (props.theme.is === "dark" ? "white" : "black")};
        bottom: 0;
        left: 24px;
    }
    .duration {
        background: ${props =>
            props.theme.is === "dark" ? "#24252d" : "#fff"};
        padding: 8px;
        color: ${props => (props.theme.is === "dark" ? "#cbcbcb" : "#919191")};
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }
    .images {
        display: flex;
        position: absolute;
        bottom: 0;
        right: 24px;
    }
    .image,
    ${Placeholder} {
        width: 100%;
        height: 100%;
        mix-blend-mode: lighten;
    }
    img {
        width: 100%;
        height: 100%;
    }
    .image-container {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        border: 2px solid
            ${props => (props.theme.is === "dark" ? "white" : "black")};
        background: ${props => (props.theme.is === "dark" ? "black" : "white")};
        margin-left: -8px;
        overflow: hidden;
        background: gray;
    }
    grid-row: span ${props => props.index};
`;

export default withTheme(Class);