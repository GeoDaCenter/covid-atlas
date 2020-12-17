import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { chart, info } from '../config/svg';

import { setPanelState } from '../actions';

const DockContainer = styled.div`
    position:absolute;
    left:calc(100% + 1px);
    top:-2px;
    @media (max-width:1024px) {
        position:fixed;
        left:0px;
        top:210px;
    }
    @media (max-width:600px) {
        top:240px;
    }
`

const DockButton = styled.button`
    background:${props => props.isActive ? '#d8d8d8' : '#333333'};
    border:none;
    outline:none;
    padding:10px;
    height:51.5px;
    box-sizing:border-box;
    font-family:'Lato', sans-serif;
    font-weight:bold;
    margin-top:2px;
    box-shadow: 2px 0px 5px rgba(0,0,0,0.7);
    border-radius: 0 0.5vh 0.5vh 0;
    cursor:pointer;
    transition:150ms transform, 150ms background;
    font-size:115%;
    svg {
        width:20px;
        height:20px;
        fill:${props => props.isActive ? '#2e2e2e' : 'white'};
    }
    &:hover {
        background:#333333;
        svg {
            fill:#d8d8d8;
        }
    }
    @media (max-width:1024px) {
        height:40px;
        width:40px;
        margin-top:10px;
        display:block;
        border-radius:0;
        &:hover {
            background:${props => props.isActive ? '#d8d8d8' : '#333333'};
            svg {
                fill:${props => props.isActive ? '#2e2e2e' : 'white'};
            }
        }
    }
    
    @media (max-width:600px) {
        height:30px;
        width:30px;
        padding:0;
        svg {
            width:20px;
            height:20px;
        }
    }
`

const Dock = () => {
    const panelState = useSelector(state => state.panelState);
    const dispatch = useDispatch();
    const handlePanelButton = (panel) => panelState[panel] ? dispatch(setPanelState({[panel]: false})) : dispatch(setPanelState({[panel]: true}))
    return (
        <DockContainer>
            <DockButton
                title="Show Line Chart"
                isActive={panelState.lineChart}
                onClick={() => handlePanelButton('lineChart')}
            >   
                {chart}
            </DockButton>
            <DockButton
                title="Show Tutorial"
                isActive={panelState.tutorial}
                onClick={() => handlePanelButton('tutorial')}
            >
                {info}
            </DockButton>
        </DockContainer>
    )
} 

export default Dock