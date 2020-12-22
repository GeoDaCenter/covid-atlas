import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  LineChart, Line, XAxis, YAxis, ReferenceArea, 
  Tooltip, Label, ResponsiveContainer
} from 'recharts';

import Switch from '@material-ui/core/Switch';

import styled from 'styled-components';
import { colors } from '../config';
import { setVariableParams, setDate } from '../actions';

const ChartContainer = styled.span`
    background:red;
`

const StyledSwitch = styled.div`
    float:left;
    p {
        color:white;
        display:inline;
    }
    span.MuiSwitch-track {
        background-color:${colors.lightgray};
    }
    .MuiSwitch-colorSecondary.Mui-checked {
        color:${colors.lightblue};
    }
    .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
        background-color: ${colors.lightblue};
    }
    .MuiSwitch-colorSecondary:hover {
        background-color:${colors.lightblue}55;
    }
`


const ChartTitle = styled.h3`
    text-align: center;
    font-family:'Playfair Display', serif;
    padding:0;
    font-weight:normal;
    margin:0;
    color:white;
`
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

const millionFormatter = val => { return `${val/1000000}M` };
const thousandFormatter = val => { return `${val/1000}K` };
// const dateFormatter = val => { 
//     let tempDate = new Date(val).getMonth();
//     return `${monthNames[tempDate]}`
// };

const CustomTick = props => {
    return <text {...props}>{props.labelFormatter(props.payload.value)}</text>
};

const getStartDate = (range, index, data) => {
    if (range === null) {
        try {
            return data.slice(0,1)[0].date
        } catch {
            return null
        }
    } else {
        try {
            return data[index-range].date
        } catch {
            return null
        }
    }
}

const getEndDate = (index, data) => {
    try {
        return data[index].date;
    } catch {
        return null;
    }
}

const CustomTooltip = props => {
    if (props.active) {
        let data = props.payload
        return (
            <div 
                style={{
                    background:colors.darkgray,
                    padding:'1px 10px',
                    borderRadius:'4px',
                    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            
            }}> 
            <p style={{color:'white', padding:0,}}>{data[0].payload.date}</p>
                {data.map(data => 
                    <p style={{color: data.color, textShadow: `2px 2px 4px ${colors.black}`, fontWeight:600}}>{data.name}: {Number.isInteger(Math.floor(data.payload[data.dataKey])) ? 
                        Math.floor(data.payload[data.dataKey]).toLocaleString('en') 
                        : data.payload[data.dataKey]}
                    </p>
                    
                )}
            </div>
        )
    }
    return null;
};

const MainLineChart = () => {
    
    const chartData = useSelector(state => state.chartData);
    const dataParams = useSelector(state => state.dataParams);
    const currentVariable = useSelector(state => state.currentVariable);
    const dates = useSelector(state => state.dates);
    const currentData = useSelector(state => state.currentData);
    const startDateIndex = useSelector(state => state.startDateIndex);
    const sidebarData = useSelector(state => state.sidebarData);
    const [logChart, setLogChart] = useState(false)
    const { properties } = useSelector(state => state.sidebarData);
    const chartKeys = useSelector(state => state.chartKeys);

    const dispatch = useDispatch();

    const handleSwitch = () => {
        setLogChart(prev => !prev);
    }

    const chartSetDate = (e) => {
        if (e?.activeTooltipIndex !== undefined) handleChange(e.activeTooltipIndex+startDateIndex)
    }    

    const handleChange = (newValue) => {
        if (dataParams.nType === "time-series" && dataParams.dType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue, dIndex: newValue}))
        } else if (dataParams.nType === "time-series") {
            dispatch(setVariableParams({nIndex: newValue}))
        } else if (dataParams.dType === "time-series") {
            dispatch(setVariableParams({dIndex: newValue}))
        } else if (currentVariable.includes('Testing')){
            dispatch(setVariableParams({nIndex: newValue}))
        }
        dispatch(setDate(dates[currentData][newValue]));
    };

    return (
        <ChartContainer>
            <ChartTitle>Total Cases and 7-Day Average New Cases{properties && <span>: {properties.NAME}{properties.state_name && `, ${properties.state_name}`}</span>}</ChartTitle>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 0, right: 10, left: 10, bottom: 0,
                    }}
                    onClick={chartSetDate}
                >
                    <XAxis 
                        dataKey="date"
                        tick={
                            <CustomTick
                            style={{
                                fill: `${colors.white}88`,
                                fontSize: "10px",
                                fontFamily: "Lato",
                                fontWeight: 600,
                                transform:'translateY(10px)'
                            }}
                            labelFormatter={chartSetDate}
                            />
                        }
                    />
                    {/* <YAxis type="number" /> */}
                    <YAxis yAxisId="left" type="number" scale={logChart ? "log" : "linear"} domain={[0.01, 'dataMax']} allowDataOverflow 
                        ticks={Object.keys(sidebarData).length === 0 ? [2000000,4000000,6000000,8000000,10000000,12000000,14000000] : []} 
                        tick={
                            <CustomTick
                            style={{
                                fill: colors.lightgray,
                                fontSize: "10px",
                                fontFamily: "Lato",
                                fontWeight: 600
                            }}
                            labelFormatter={Object.keys(sidebarData).length === 0 ? millionFormatter : thousandFormatter}
                            />
                        }
                        >
                        <Label value="Total Cases" position='insideLeft' style={{marginTop:10, fill:colors.lightgray, fontFamily: 'Lato', fontWeight: 600}} angle={-90}  />
                    </YAxis>
                    <YAxis yAxisId="right" orientation="right" scale={logChart ? "log" : "linear"} domain={[0.01, 'dataMax']} allowDataOverflow 
                        // ticks={[20000,40000,60000,80000,100000, 120000, 140000]} 
                        tick={
                            <CustomTick
                                style={{
                                    fill: colors.lightgray,
                                    fontSize: "10px",
                                    fontFamily: "Lato",
                                    fontWeight: 600,
                                }}
                                labelFormatter={thousandFormatter}
                            />
                        }
                        >
                        <Label value="7-Day Average New Cases" position='insideTopRight' style={{marginTop:10, fill:colors.yellow, fontFamily: 'Lato', fontWeight: 600}} angle={-90}  />
                    </YAxis>
                    <Tooltip
                        content={CustomTooltip}
                    />
                    <ReferenceArea 
                        yAxisId="left"
                        x1={getStartDate(dataParams.nRange, dataParams.nIndex-startDateIndex, chartData)}
                        x2={getEndDate(dataParams.nIndex-startDateIndex, chartData)} 
                        fill="white" 
                        fillOpacity={0.15}
                        isAnimationActive={false}
                    />
                    {chartKeys.length===0 && <Line type="monotone" yAxisId="left" dataKey="sum" name="Total Cases" stroke={colors.lightgray} dot={false} isAnimationActive={false} /> }
                    {chartKeys.length===0 && <Line type="monotone" yAxisId="right" dataKey="count" name="7-Day Average New Cases" stroke={colors.yellow} dot={false} isAnimationActive={false} /> }
                    
                    {chartKeys.length !== 0 && chartKeys.map(key => { return <Line type="monotone" yAxisId="left" dataKey={key + ' Total Cases'} name={key + ' Total Cases'} stroke={colors.lightgray} dot={false} isAnimationActive={false}  />})}
                    {chartKeys.length !== 0 && chartKeys.map(key => { return <Line type="monotone" yAxisId="right" dataKey={key + ' Daily Count'} name={key + ' 7-Day Ave'} stroke={colors.yellow} dot={false} isAnimationActive={false}  />})}
                </LineChart>
            </ResponsiveContainer>
            <StyledSwitch>
                <Switch
                    checked={logChart}
                    onChange={handleSwitch}
                    name="log chart switch"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <p>{logChart ? 'Log Scale' : 'Linear Scale'}</p>
            </StyledSwitch>
        </ChartContainer>
    );
}

export default MainLineChart

// dataParams.nIndex-(dataParams.nRange||dataParams.nIndex)