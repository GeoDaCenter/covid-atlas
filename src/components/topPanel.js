// this components houses the slider, legend, and bottom dock chart
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';

import { DateSlider } from '../components';

// Styled components
const TopDrawer = styled.div`
    position: fixed;
    top:50px;
    left:50%;
    background:#2b2b2b;
    transform:translateX(-50%);
    width:90vw;
    max-width: 500px;
    box-sizing: border-box;
    padding:0;
    margin:0;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.7);
    border-radius:0 0 0.5vh 0.5vh ;
    transition:250ms all;
    hr {
        opacity:0.5;
    }
    div.MuiGrid-item {
        padding:0;
    }
    @media (max-width:1024px){
        // div {
        //     padding-bottom:0;
        // }
        // #binModeSwitch {
        //     position:absolute !important;
        //     right: 10px !important;
        //     top: 10px !important;
        // }
        // #dateRangeSelector {
        //     position:absolute !important;
        //     left: 66% !important;
        //     transform:translateX(-50%) !important;
        //     top: 10px !important;
        // }
    }
    
    @media (max-width:768px){
        width:100%;
        max-width:100%;
        padding:0;
        left:0;
        transform:none;
    }
    @media (max-width:750px) and (orientation: landscape) {
        // bottom all the way down for landscape phone
    }
`
const TopPanel = () => {
    
    return (
        <TopDrawer>
            <DateSlider />
        </TopDrawer>
    )

}

export default TopPanel