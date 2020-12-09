import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import styled from 'styled-components';
import { setDate, setVariableParams, incrementDate, setMapParams } from '../actions';
import Switch from '@material-ui/core/Switch';
import { StyledDropDownNoLabel, SwitchContainer } from '../styled_components';
// import { getParseCSV, getJson, mergeData, colIndex, getDataForBins } from './utils';

const SliderContainer = styled.div`
    color: white;
    box-sizing:border-box;
    padding:0 20px;
    width:100%;
`

const DateButton = styled(Button)`
    color:rgb(200,200,200) !important;
    background: none;
    transition: 250ms all;
    border:none !important;
    font-size: 75% !important;
    transition:250ms all;
    &:hover {
        color:white;
        border:none !important;
    }
    &.active {
        cursor: initial;
        font-size: 75%;
        color:black !important;
        background: white !important;
        transition: 250ms all;
        border:none !important;
    }
    .MuiButtonGroup-vertical {
        border:none !important;
    }
    .MuiButton-label {
        justify-content: left !important;
        text-transform:none;
        font-family:'Lato', sans-serif;
        font-weight:bold;
    }
`
const PlayPauseButton = styled(Button)`
    background:none;
    padding:0;
    margin:0;
    transform:translateY(16px);
    svg {
        width: 30px;
        height:30px;
        g {
            fill: white;
        },
        path {
            fill:white;
        }
    }
    &.MuiButton-text {
        padding:6px 0;
    }
`

const LineSlider = styled(Slider)`
transform:translateY(22px);
    &.MuiSlider-root {
        width:90%;
        margin-left:3%;
        box-sizing:border-box;
    }
    span.MuiSlider-rail {
        color:white;
        height:4px;
    }
    span.MuiSlider-track {
        color:white;
        height:4px;
    }
    span.MuiSlider-thumb {
        color:white;
        width:15px;
        height:15px;
        transform:translate(-1.5px, -1.5px);
        .MuiSlider-valueLabel {
            transform:translateY(-10px);
            pointer-events:none;
            font-size:15px;
            span {
                background: none;
            }
        }
    }
    // .MuiSlider-valueLabel span{
    //     transform:translateX(-100%);        
    // }
    span.MuiSlider-thumb.MuiSlider-active {
        box-shadow: 0px 0px 10px rgba(200,200,200,0.5);
    }
`

const RangeSlider = styled(Slider)`
    box-sizing:border-box;
    transform:translateY(22px);
    &.MuiSlider-root {
        width:90%;
        margin-left:3%;
        box-sizing:border-box;
    }
    span.MuiSlider-rail {
        color:white;
        height:4px;
    }
    span.MuiSlider-track {
        color:white;
        height:4px;
    }
    span.MuiSlider-thumb {
        color:white;
        .MuiSlider-valueLabel {
            transform:translateY(0px);
            pointer-events:none;
            span {
                background: none;
            }
        }
    }
    span.MuiSlider-thumb.MuiSlider-active: {
        box-shadow: 0px 0px 10px rgba(200,200,200,0.5);
    }
`

const BinSlider = styled(LineSlider)`
    span.MuiSlider-rail,span.MuiSlider-track {
        display:none;
    }
    
    span.MuiSlider-thumb {
        color:white;
        background:none;
        &:before{
            content:'△';
            color:white;
            opacity:0.5;
            position:relative;
            left:0;
            right:0;
        }
        overflow: visible;
        border-radius:0;
        .MuiSlider-valueLabel {
            opacity:0;
            transition:250ms all;
            transform:translate(-100%, 24px);
            pointer-events:none;
            span {
                background: none;
                width:200px;
                text-align:right;
            }
        }
    }
    &:hover { 
        span.MuiSlider-thumb {
            .MuiSlider-valueLabel {
                opacity:1;
            }
        }
    }
`

const DateTitle = styled.h3`
    width:100%;
    position:absolute;
    font-size:1.05rem;
    top:-5px;
    left:0;
    text-align:center;
    pointer-events:none;

`
const InitialDate = styled.p`
    position:absolute;
    left:7%;
    top:0;
    font-size:75%;
`

const EndDate = styled(InitialDate)`
    left:initial;
    right:10px;
`
const DateSlider = () => {
    const dispatch = useDispatch();  
    
    const currentData = useSelector(state => state.currentData);
    const dates = useSelector(state => state.dates);
    const currDate = useSelector(state => state.currDate);
    const dataParams = useSelector(state => state.dataParams);
    const startDateIndex = useSelector(state => state.startDateIndex);
    const mapParams = useSelector(state => state.mapParams)
    
    const [timerId, setTimerId] = useState(null);
    const [customRange, setCustomRange] = useState(false);
    const [rangeSelectVal, setRangeSelectVal] = useState(7);
    
    const handleChange = (event, newValue) => {
        if (dataParams.nType === "time-series" && dataParams.dType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue, dIndex: newValue}))
        } else if (dataParams.nType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue}))
        } else if (dataParams.dType === "time-series") {
            dispatch(setVariableParams({dIndex: newValue}))
        } 
        dispatch(setDate(dates[currentData][newValue]));
    };

    
    const handleSwitch = () => {
        if (mapParams.binMode === 'dynamic') {
            dispatch(setMapParams({binMode:''}))
        } else {
            dispatch(setMapParams({binMode:'dynamic'}))
        }
    }
    
    // const handleBinChange = (event, newValue) => {
    //     dispatch(setVariableParams(
    //         {
    //             binIndex: newValue 
    //         }
    //     ))
    // }
    
    const handleRangeChange = (event, newValue) => { 
        if (dataParams.dRange) {
            dispatch(setVariableParams(
                {
                    nIndex: newValue[1], 
                    nRange: newValue[1]-newValue[0],
                    rIndex: newValue[1], 
                    rRange: newValue[1]-newValue[0]
                }
            ))
        } else {
            dispatch(setVariableParams(
                {
                    nIndex: newValue[1], 
                    nRange: newValue[1]-newValue[0]
                }
            ))
        }
    }

    const handlePlayPause = (timerId, rate, interval) => {
        if (timerId === null) {
            setTimerId(setInterval(o => dispatch(incrementDate(rate)), interval))
        } else {
            clearInterval(timerId);
            setTimerId(null)
        }
    }
    

    const handleRangeButton = (event) => {
        let val = event.target.value;

        if (val === 'custom') { // if swapping over to a custom range, which will use a 2-part slider to scrub the range
            setCustomRange(true)
            if (dataParams.nType === "time-series" && dataParams.dType === "time-series") {
                dispatch(setVariableParams({nRange: 30, dRange: 30}))
            } else if (dataParams.nType === "time-series") {
                dispatch(setVariableParams({nRange: 30}))
            } else if (dataParams.dType === "time-series") {
                dispatch(setVariableParams({dRange: 30}))
            } 
        } else { // use the new value -- null for cumulative, 1 for daily, 7 for weekly
            setCustomRange(false)
            if (dataParams.nType === "time-series" && dataParams.dType === "time-series") {
                dispatch(setVariableParams({nRange: val, dRange: val}))
            } else if (dataParams.nType === "time-series") {
                dispatch(setVariableParams({nRange: val}))
            } else if (dataParams.dType === "time-series") {
                dispatch(setVariableParams({dRange: val}))
            }    
        }
        
        setRangeSelectVal(val);
    }

    const valuetext = (value) => `${dates[currentData][value-startDateIndex].slice(0,-3)}`;
    
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        let rawDate = new Date(date);
        return rawDate.toLocaleDateString('en-US', options);
    }

    if (dates[currentData] !== undefined) {
        return (
            <SliderContainer style={{display: (dataParams.nType === 'time-series' ? 'initial' : 'none')}}>
                <Grid container spacing={2} style={{display:'flex'}}>
                    {!customRange && <DateTitle>{formatDate(dates[currentData][dataParams.nIndex-startDateIndex])}</DateTitle>}
                    <Grid item xs={1}>
                        <PlayPauseButton id="playPause" onClick={() => handlePlayPause(timerId, 1, 100)}>
                            {timerId === null ? 
                                <svg x="0px" y="0px" viewBox="0 0 100 100" ><path d="M78.627,47.203L24.873,16.167c-1.082-0.625-2.227-0.625-3.311,0C20.478,16.793,20,17.948,20,19.199V81.27  c0,1.25,0.478,2.406,1.561,3.031c0.542,0.313,1.051,0.469,1.656,0.469c0.604,0,1.161-0.156,1.703-0.469l53.731-31.035  c1.083-0.625,1.738-1.781,1.738-3.031C80.389,48.984,79.71,47.829,78.627,47.203z"></path></svg>
                                : 
                                <svg x="0px" y="0px" viewBox="0 0 100 100">
                                    <g transform="translate(50 50) scale(0.69 0.69) rotate(0) translate(-50 -50)">
                                        <g>
                                            <path d="M22.4,0.6c3.4,0,6.8,0,10.3,0c6.5,0,11.8,5.3,11.8,11.8c0,25,0,50.1,0,75.2c0,6.5-5.3,11.8-11.8,11.8
                                                c-3.4,0-6.8,0-10.3,0c-6.5,0-11.8-5.3-11.8-11.8c0-25.1,0-50.2,0-75.2C10.6,5.9,15.9,0.6,22.4,0.6z M22.4,6.5c3.4,0,6.8,0,10.3,0
                                                c3.2,0,5.9,2.6,5.9,5.9c0,25,0,50.1,0,75.2c0,3.2-2.7,5.9-5.9,5.9c-3.4,0-6.8,0-10.3,0c-3.2,0-5.9-2.7-5.9-5.9
                                                c0-25.1,0-50.2,0-75.2C16.5,9.1,19.2,6.5,22.4,6.5z M67.3,6.5c3.4,0,6.8,0,10.2,0s6,2.6,6,5.9c0,25,0,50.1,0,75.2
                                                c0,3.2-2.7,5.9-6,5.9s-6.7,0-10.2,0c-3.3,0-5.9-2.7-5.9-5.9c0-25.1,0-50.2,0-75.2C61.4,9.1,64,6.5,67.3,6.5z M67.3,0.6
                                                c3.4,0,6.8,0,10.2,0c6.5,0,11.8,5.3,11.8,11.8c0,25,0,50.1,0,75.2c0,6.5-5.3,11.8-11.8,11.8c-3.3,0-6.7,0-10.2,0
                                                c-6.5,0-11.8-5.3-11.8-11.8c0-25.1,0-50.2,0-75.2C55.5,5.9,60.8,0.6,67.3,0.6z"/>
                                        </g>
                                    </g>
                                </svg>

                            }
                        </PlayPauseButton>
                    </Grid>
                    <Grid item xs={11}> {/* Sliders Grid Item */}
                        {/* Main Slider for changing date */}
                        {!customRange && 
                            <LineSlider 
                                value={dataParams.nIndex} 
                                // valueLabelDisplay="on"
                                onChange={handleChange} 
                                // getAriaValueText={valuetext}
                                // valueLabelFormat={valuetext}
                                // aria-labelledby="aria-valuetext"
                                min={startDateIndex}
                                step={1}
                                max={startDateIndex+dates[currentData].length-1}
                        />}
                        {/* Slider for bin date */}
                        {/* {!customRange && 
                            <BinSlider 
                                value={dataParams.binIndex} 
                                valueLabelDisplay="auto"
                                onChange={handleBinChange} 
                                getAriaValueText={binValuetext}
                                valueLabelFormat={binValuetext}
                                aria-labelledby="aria-valuetext"
                                min={startDateIndex}
                                step={1}
                                max={startDateIndex+dates[currentData].length-1}
                        />} */}
                        {/* Slider for changing date range */}
                        {customRange && <RangeSlider 
                            value={[dataParams.nIndex-dataParams.nRange, dataParams.nIndex]} 
                            valueLabelDisplay="on"
                            onChange={handleRangeChange} 
                            getAriaValueText={valuetext}
                            valueLabelFormat={valuetext}
                            aria-labelledby="aria-valuetext"
                            min={startDateIndex}
                            step={1}
                            max={startDateIndex+dates[currentData].length-1}
                        />}
                    </Grid>
                    <Grid item xs={6} id="dateRangeSelector" style={{transform:'translateX(25%)'}}>
                        <StyledDropDownNoLabel>
                            <InputLabel htmlFor="date-select">Date Range</InputLabel>
                            <Select  
                                id="date-select"
                                value={rangeSelectVal}
                                onChange={handleRangeButton}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={null} key={'cumulative'}>Cumulative</MenuItem>
                                <MenuItem value={1} key={'daily'}>New Daily</MenuItem>
                                <MenuItem value={7} key={'weekly'}>Weekly Average</MenuItem>
                                <MenuItem value={'custom'} key={'customRange'}>Custom Range</MenuItem>
                            </Select>
                        </StyledDropDownNoLabel>
                    </Grid>
                    <SwitchContainer item xs={6} 
                        style={{display: (dataParams.nType === 'time-series' ? 'initial' : 'none'), float:'right', transform:'translate(25%, 5px)'}}
                        id="binModeSwitch"
                    >
                        <Switch
                            checked={mapParams.binMode === 'dynamic'}
                            onChange={handleSwitch}
                            name="bin chart switch"
                        />
                        <p>{mapParams.binMode === 'dynamic' ? 'Dynamic Bins' : 'Fixed Bins'}</p>
                    </SwitchContainer>
                    {!customRange && <InitialDate>{dates[currentData][0]}</InitialDate>}
                    {!customRange && <EndDate>{dates[currentData][dates[currentData].length-1]}</EndDate>}
                </Grid>
            </SliderContainer>
        );
    } else {
        return <SliderContainer />
    }
}

export default DateSlider