// this components houses the slider, legend, and bottom dock chart
import React from 'react';

import styled from 'styled-components';

import { DateSlider } from '../components';
import { colors } from '../config';

// Styled components
const TopDrawer = styled.div`
    position: fixed;
    top:50px;
    left:calc(50% - 25px);
    background:${colors.gray};
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