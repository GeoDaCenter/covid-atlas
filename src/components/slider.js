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
import { StyledDropDownNoLabel, BinsContainer } from '../styled_components';
import { Tooltip } from '../components';
// import { getParseCSV, getJson, mergeData, colIndex, getDataForBins } from './utils';

const SliderContainer = styled.div`
    color: white;
    box-sizing:border-box;
    padding:0 20px;
    width:100%;
`

const PlayPauseButton = styled(Button)`
    background:none;
    padding:0;
    margin:0;
    transform:translateY(16px);
    @media (max-width: 600px) {
        transform:translateY(18px);
    }
    svg {
        width: 30px;
        height:30px;
        @media (max-width: 600px) {
            width: 20px;
            height:20px;
        }
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
        width:70%;
        margin-left:13%;
        box-sizing:border-box;
        @media (max-width: 600px) {
            width:50%;
            margin-left:24%;
        }
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
        width:70%;
        margin-left:13%;
        box-sizing:border-box;
        @media (max-width: 600px) {
            width:50%;
            margin-left:24%;
        }
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

const DateTitle = styled.h3`
    width:100%;
    font-size:1.05rem;
    padding:10px 0 5px 0;
    margin:0;
    left:0;
    text-align:center;
    pointer-events:none;
`
const InitialDate = styled.p`
    position:absolute;
    left:7%;
    bottom:8px;
    font-size:75%;
    @media (max-width: 600px) {
        bottom:0px;
        left:12%;
    }
`

const EndDate = styled(InitialDate)`
    left:initial;
    right:10px;
`

const DateSelectorContainer = styled(Grid)`
    margin:0 18px -10px 0 !important;
    display:flex;
    justify-items: center;
    justify-content: flex-end;
    align-items:center;
    @media (max-width: 450px) {
        margin:0 18px 22px 0 !important;
    }
    .MuiFormControl-root {
        padding: 0 0 0 20px !important; 
    }
    span {
        font-weight:bold;
    }
    #dateSelector {
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        @media (max-width: 600px) {
            transform:none;
            left:20px;
        }
        @media (max-width: 450px) {
            transform:none;
            left:0px;
        }
    }
    #binModeSwitch {
        @media (max-width: 450px) {
            transform:translateY(40px);
        }
        .MuiSwitch-root {
            height:32px;
            width:50px;
            padding: 0,
            display: 'flex',
        }
        .MuiButtonBase-root {
            .MuiIconButton-label {
                .MuiSwitch-thumb {
                    height: 12px;
                    width: 12px;
                    transform:translateY(1px);
                }
            }   
        }
    }
`
const DateSlider = () => {
    const dispatch = useDispatch();  

    const currentData = useSelector(state => state.currentData);
    const dates = useSelector(state => state.dates);
    const dataParams = useSelector(state => state.dataParams);
    const startDateIndex = useSelector(state => state.startDateIndex);
    const mapParams = useSelector(state => state.mapParams);
    const currentVariable = useSelector(state => state.currentVariable);
    
    const [timerId, setTimerId] = useState(null);
    const [customRange, setCustomRange] = useState(false);
    const [rangeSelectVal, setRangeSelectVal] = useState(7);
    
    const handleChange = (event, newValue) => {

        let tempRange = null;

        if ((newValue - startDateIndex < 7) && (dataParams.nRange === 7)) tempRange = newValue-startDateIndex || 1

        if (dataParams.nType === "time-series" && dataParams.dType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue, dIndex: newValue, nRange: tempRange || dataParams.nRange, dRange: tempRange || dataParams.nRange }))
        } else if (dataParams.nType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue, nRange: tempRange || dataParams.nRange}))
        } else if (dataParams.dType === "time-series") {
            dispatch(setVariableParams({dIndex: newValue, dRange: tempRange  || dataParams.nRange }))
        } else if (currentVariable.includes('Testing')){
            dispatch(setVariableParams({nIndex: newValue}))
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
        rawDate.setDate(rawDate.getDate() + 1);
        return rawDate.toLocaleDateString('en-US', options);
    }
    
    const cleanRanges = {
        null: 'Cumulative',
        1: 'Daily New',
        7: '7-Day Average'
    }

    if (dates[currentData] !== undefined) {
        return (
            <SliderContainer style={{display: ((dataParams.nType === 'time-series' || currentVariable.includes('Testing')) ? 'initial' : 'none')}}>
                <Grid container spacing={2} style={{display:'flex', padding: '0 0 10px 0'}}>
                    {currentVariable.includes('Testing') && 
                        <DateSelectorContainer item xs={12}>
                            <DateTitle>{formatDate(`${dates[currentData][dataParams.nIndex-startDateIndex]} 24:00`)}</DateTitle>
                        </DateSelectorContainer>
                    }
                    {dataParams.nType !== 'characteristic' && 
                        <DateSelectorContainer item xs={12}>
                            <StyledDropDownNoLabel id="dateSelector">
                                <InputLabel htmlFor="date-select">Date Range</InputLabel>
                                <Select  
                                    id="date-select"
                                    value={''}
                                    onChange={handleRangeButton}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="" disabled style={{display:'none'}}>
                                        {!customRange && <span>{formatDate(dates[currentData][dataParams.nIndex-startDateIndex])} ({cleanRanges[rangeSelectVal]})</span>}
                                        {customRange && 'Custom Range'}
                                    </MenuItem>
                                    <MenuItem value={null} key={'cumulative'}>Cumulative</MenuItem>
                                    <MenuItem value={1} key={'daily'}>Daily New</MenuItem>
                                    <MenuItem value={7} key={'7-day-ave'}>7-Day Average</MenuItem>
                                    <MenuItem value={'custom'} key={'customRange'}>Custom Range</MenuItem>
                                </Select>
                            </StyledDropDownNoLabel>

                            <BinsContainer item xs={12} 
                                id="binModeSwitch"
                            >
                                <Switch
                                    checked={mapParams.binMode === 'dynamic'}
                                    onChange={handleSwitch}
                                    name="bin chart switch"
                                />
                                <p>{mapParams.binMode === 'dynamic' ? 'Dynamic' : 'Fixed Bins'}<Tooltip id="BinModes"/></p>
                            </BinsContainer>
                        </DateSelectorContainer>
                    }
                    
                    
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