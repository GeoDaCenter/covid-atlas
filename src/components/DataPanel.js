// This components formats the data for the selected geography
// and displays it in the right side panel.

import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';

import Tooltip from './tooltip';
import TwoWeekChart from './twoWeekLineChart';
import { setPanelState } from '../actions';
import {dataFn, colLookup} from '../utils';
import { colors } from '../config';
import { compact, expand, report, verticalGrip} from '../config/svg';

// Styled components CSS
const DataPanelContainer = styled.div`
  position:fixed;
  right:0;
  top:50px;
  overflow-x:visible;
  height:calc(100vh - 50px);
  background-color: ${colors.gray}fa;
  box-shadow: -2px 0px 5px rgba(0,0,0,0.7);
  padding:20px;
  box-sizing: border-box;
  transition:250ms all;
  font: 'Lato', sans-serif;
  color: white;
  font-size:100%;
  padding:0;
  z-index:5;
  transform: translateX(100%);
  &.open {
    transform:none;
  }
  @media (max-width:1024px) {
    min-width:50vw;
  }  
  @media (max-width:600px) {
    width:100%;
    left:0;
    transform:translateX(-100%);
    z-index:51;
    &.open {
      transform:none;
    }
    display: ${props => props.otherPanels ? 'none' : 'initial'};
  }
  button#showHideRight {
    position:absolute;    
    right:calc(100% - 20px);
    top:20px;
    width:40px;
    height:40px;
    padding:0;
    margin:0;
    background-color: ${colors.gray};
    box-shadow: 0px 0px 6px rgba(0,0,0,1);
    outline:none;
    border:none;
    cursor: pointer;
    transition:500ms all;
    svg {
      width:15px;
      height:15px;
      margin:12.5px 0 0 0;
      @media (max-width:600px){
        width:20px;
        height:20px;
        margin:5px;
      }
      fill:white;
      transform:rotate(180deg);
      transition:500ms all;
    }
    :after {
      opacity:0;
      font-weight:bold;
      color:white;
      position: relative;
      top:-17px;
      transition:500ms all;
      content: 'Report';
      right:50px;
      z-index:4;
    }  
    &.hidden {
      right:100%;
      svg {
        transform:rotate(0deg);
      }
      :after {
        opacity:1;
      }
    }
    @media (max-width:768px){
      top:120px;
    }
    @media (max-width:600px) {
      left:100%;
      width:30px;
      height:30px;
      top:160px;
      &.hidden svg {
        transform:rotate(0deg);
      }
      :after {
        display:none;
      }
      &.active {
        left:90%;
      }
      &.active svg {
        transform:rotate(90deg);
      }
    }
  }
  

  div {
    div {
      p {
        line-height:1.5;
        margin:0;
        display:inline-block;
      }
    }
  }
  h2 {
    padding:15px 0 5px 0;
    margin:0;
    display:inline-block;
  }
  h6 {
    padding:0 0 15px 0;
    margin:0;
    a {
      color:${colors.yellow};
      text-decoration:none;
    }
  }
  .extraPadding {
    padding-bottom:20vh;
  }
`

const ReportWrapper = styled.div`
  height:100vh;
  overflow-y:scroll;
`

const ReportContainer = styled.div`
    padding:5px 0 0 30px;
    box-sizing:border-box;
    overflow-x:visible;
    // display:flex;
    // flex-direction:column;
    // flex-wrap:wrap;
    width:500px;
    columns:${props => props.cols} 250px;
    column-gap:10px;
    display:inline-block;
`

const ReportSection = styled.span`
    padding-right:20px;
    box-sizing:border-box;
    width:100%;
    display:inline-block;
    padding: 0;
    margin: 0;
`

const BigNumber = styled.h2`
  font-size:1.15rem;
  padding:0 0 15px 0 !important;
`

const NumberChartContainer = styled.div`
  width:100%;
  display:flex;
  align-items: center;
`

const ExpandButtons = styled(ButtonGroup)`
  outline:none;
  border:none;
  position:absolute;
  right:20px;
  top:15px;
  svg {
    fill:${colors.white}44;
    transition:250ms all;
    height:15px;
    &:hover {
      fill:${colors.white}77;
    }
  }
  .MuiButton-root {
    outline:none !important;
    border:none !important;
    min-width:0;
    padding:10px;
    box-sizing:border-box;
    outline:none !important;
    color:white !important;
  }
  .MuiButton-root.active {
    svg {
      fill:white;
      &:hover: {
        fill:white;
      }
    }
  }
`
const ResizeButton = styled.button`
    position:absolute;
    left:5px;
    bottom:50%;
    background:none;
    outline:none;
    border:none;
    transform: translateY(-50%);
    cursor:grab;
    width:10px;
    padding:0;
    margin:0;
    height:20px;
    svg {
      width:15px;
      height:30px;
      fill:white;
    }
    @media (max-width:1024px) {
      display:none;
    }
`

const DataPanel = () => {

  const dispatch = useDispatch();

  // de-structure sidebarData, which houses selected geography data
  const { properties, cases, deaths, predictions,
    chr_health_factors, chr_life, chr_health_context,
    testing_ccpt, testing_tcap, testing_wk_pos, testing
   } = useSelector(state => state.sidebarData);
  // name of current data set

  const currentData = useSelector(state => state.currentData);
  // panels open/close state
  const panelState = useSelector(state => state.panelState);
  //column names
  const cols = useSelector(state => state.cols);

  const [expanded, setExpanded] = useState(true)
  const [width, setWidth] = useState(250);
  const [colCount, setColCount] = useState(1);
  const [currXPos, setCurrXPos] = useState(false);

  // helper for predictions data
  const parsePredictedDate = (list) => `${list.slice(-2,)[0]}/${list.slice(-1,)[0]}`

  // handles panel open/close
  const handleOpenClose = () => panelState.info ? dispatch(setPanelState({info:false})) : dispatch(setPanelState({info:true}))
  
  const listener = (e) => {
    setWidth(prevWidth => {
      if ((prevWidth - (window.innerWidth-e.screenX) < 25) && (prevWidth - (window.innerWidth-e.screenX) > -25)){
        return prevWidth;
      } else if ((window.innerWidth-e.screenX) < 300) {
        setColCount(1);
        return 300;
      } else {
        setColCount(Math.floor((window.innerWidth-e.screenX)/300));
        return window.innerWidth-e.screenX
      }
    })
  }

  const touchListener = (e) => {
      setWidth(prev => (e?.targetTouches[0]?.clientX-currXPos) || prev)
  }

  const removeListener = () => {
      window.removeEventListener('mousemove', listener)
      window.removeEventListener('mouseup', removeListener)
  }

  const removeTouchListener = () => {
      window.removeEventListener('touchmove', touchListener);
      window.removeEventListener('touchend', removeTouchListener);
  }

  const handleDown = () => {
      window.addEventListener('mousemove', listener)
      window.addEventListener('mouseup', removeListener)
  }

  const handleTouch = (e) => {
      setCurrXPos(+e.target.parentNode.parentNode.parentNode.style.left.slice(0,-2))
      window.addEventListener('touchmove', touchListener)
      window.addEventListener('touchend', removeTouchListener)
  }

  return (
    <DataPanelContainer className={panelState.info ? 'open' : ''} id="data-panel"  otherPanels={panelState.variables}>
      {properties && <ExpandButtons>
        <Button onClick={() => setExpanded(true)} className={expanded ? 'active' : ''}>{expand}</Button>
        <Button onClick={() => setExpanded(false)} className={expanded ? '' : 'active'}>{compact}</Button>
      </ExpandButtons>}
      <ReportWrapper>
        <ReportContainer cols={colCount} style={{width: width}}>
          <ReportSection>
            {properties && <h2>{properties.NAME}{properties.state_name && `, ${properties.state_name}`}</h2>}
            <br/>
          {properties && ( 
            expanded ? 
              <span>
                <p>Population</p><br/> 
                <NumberChartContainer>
                  <BigNumber>{properties.population?.toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 
              </span>
            :
              <p>Population: {properties.population?.toLocaleString('en')}</p>
          )}       
          </ReportSection>
          {(cases && deaths) && ( 
            expanded ? 
              <ReportSection><br/>
                <p>Total Cases</p><br/>
                <NumberChartContainer>
                  <BigNumber>{cases.slice(-1,)[0]?.toLocaleString('en')}</BigNumber>
                  <TwoWeekChart data={cases.slice(-14,)} schema='cases/deaths'/>
                </NumberChartContainer>
                
                <p>Total Deaths </p><br/>
                <NumberChartContainer>
                  <BigNumber>{deaths.slice(-1,)[0]?.toLocaleString('en')}</BigNumber>
                  <TwoWeekChart data={deaths.slice(-14,)} schema='cases/deaths'/>
                </NumberChartContainer>

                <p>Cases per 100k Population</p><br/>
                <NumberChartContainer>
                  <BigNumber>{dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>Deaths per 100k Population</p><br/>               
                <NumberChartContainer>
                  <BigNumber>{dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>New Cases per 100k Population</p><br/> 
                <NumberChartContainer>
                  <BigNumber>{dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>New Deaths per 100k Population</p><br/> 
                <NumberChartContainer>
                  <BigNumber>{dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>Licensed Hospital Beds</p><br/> 
                <NumberChartContainer>
                  <BigNumber>{properties.beds?.toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 
                {/* <p>Cases per Bed: {dataFn(cases, null, cases.length-1, null, properties, 'beds', null, null, 1)?.toFixed(2)?.toLocaleString('en')}</p><br/> */}
              </ReportSection>
            :
            <ReportSection><br/>
              <p>Total Cases: {cases.slice(-1,)[0]?.toLocaleString('en')}</p><br/>            
              <p>Total Deaths: {deaths.slice(-1,)[0]?.toLocaleString('en')}</p><br/>
              <p>Cases per 100k Population: {dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
              <p>Deaths per 100k Population: {dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
              <p>New Cases per 100k Population: {dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
              <p>New Deaths per 100k Population: {dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
              <p>Licensed Hospital Beds: {properties.beds?.toLocaleString('en')}</p><br/>
              {/* <p>Cases per Bed: {dataFn(cases, null, cases.length-1, null, properties, 'beds', null, null, 1)?.toFixed(2)?.toLocaleString('en')}</p><br/> */}
            </ReportSection>
            
          )}
          {testing && ( 
            expanded ? 
              <ReportSection>
                <h2>Testing</h2><br/>
                <p>7-Day Positivity Rate</p><br/>
                <NumberChartContainer>
                  <BigNumber>{(testing_wk_pos[testing_wk_pos.length-1]*100).toFixed(2)}%</BigNumber>
                  <TwoWeekChart data={testing_wk_pos.slice(-14,)} schema='testingPos'/>
                </NumberChartContainer>

                <p>7-Day Testing Capacity per 100k People</p><br/>
                <NumberChartContainer>
                  <BigNumber>{(testing_tcap[testing_tcap.length-1]).toLocaleString('en')}</BigNumber>
                  <TwoWeekChart data={testing_tcap.slice(-14,)} schema='testingCap'/>
                </NumberChartContainer>

                <p>Total Testing: {(testing[testing.length-1]).toLocaleString('en')}</p><br/>
                <NumberChartContainer>
                  <BigNumber>{(testing_tcap[testing_tcap.length-1]).toLocaleString('en')}</BigNumber>
                </NumberChartContainer>

                <p>7-Day Confirmed Cases per Testing</p><br/>
                <NumberChartContainer>
                  <BigNumber>{(testing_ccpt[testing_ccpt.length-1]*100).toFixed(2)}%</BigNumber>
                </NumberChartContainer>

                <p>Testing Criterion</p><br/>
                <NumberChartContainer>
                  <BigNumber> {properties.criteria}</BigNumber>
                </NumberChartContainer>

              </ReportSection>
            :
              <ReportSection>
                <h2>Testing</h2><br/>
                <p>7-Day Positivity Rate: {(testing_wk_pos[testing_wk_pos.length-1]*100).toFixed(2)}%</p><br/>
                <p>7-Day Testing Capacity per 100k People: {(testing_tcap[testing_tcap.length-1]).toLocaleString('en')}</p><br/>
                <p>Total Testing: {(testing[testing.length-1]).toLocaleString('en')}</p><br/>
                <p>7-Day Confirmed Cases per Testing: {(testing_ccpt[testing_ccpt.length-1]*100).toFixed(2)}%</p><br/>
                <p>Testing Criterion: {properties.criteria}</p><br/>
              </ReportSection>
          )}
          {chr_health_factors && ( 
            expanded ? 
              <ReportSection>
                <h2>Community Health Factors<Tooltip id="healthfactor"/></h2>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
                <p>Children in poverty</p><Tooltip id="PovChldPrc"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PovChldPrc')]}%</BigNumber>
                </NumberChartContainer>

                <p>Income inequality<Tooltip id="IncRt"/></p>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'IncRt')]}</BigNumber>
                </NumberChartContainer> 

                <p>Median household income</p><Tooltip id="MedianHouseholdIncome"/><br/>
                <NumberChartContainer>
                  <BigNumber>${chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'MedianHouseholdIncome')]?.toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>Food insecurity</p><Tooltip id="FdInsPrc"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'FdInsPrc')]}%</BigNumber>
                </NumberChartContainer> 

                <p>Unemployment</p><Tooltip id="UnEmplyPrc"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnEmplyPrc')]}%</BigNumber>
                </NumberChartContainer> 

                <p>Uninsured</p><Tooltip id="UnInPrc"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnInPrc')]}%</BigNumber>
                </NumberChartContainer> 

                <p>Primary care physicians</p><Tooltip id="PrmPhysRt"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrmPhysRt')]}</BigNumber>
                </NumberChartContainer> 

                <p>Preventable hospital stays</p><Tooltip id="PrevHospRt"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrevHospRt')]?.toLocaleString('en')}</BigNumber>
                </NumberChartContainer> 

                <p>Residential segregation-black/white</p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'RsiSgrBlckRt')]||'NA'}</BigNumber>
                </NumberChartContainer> 

                <p>Severe housing problems</p><Tooltip id="SvrHsngPrbRt"/><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'SvrHsngPrbRt')]}%</BigNumber>
                </NumberChartContainer> 

              </ReportSection>
            : 
              <ReportSection>
                <h2>Community Health Factors<Tooltip id="healthfactor"/></h2>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
                <p>Children in poverty: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PovChldPrc')]}%<Tooltip id="PovChldPrc"/></p><br/>
                <p>Income inequality: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'IncRt')]}<Tooltip id="IncRt"/></p><br/>
                <p>Median household income: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'MedianHouseholdIncome')]?.toLocaleString('en')}<Tooltip id="MedianHouseholdIncome"/></p><br/>
                <p>Food insecurity: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'FdInsPrc')]}<Tooltip id="FdInsPrc"/></p><br/>
                <p>Unemployment: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnEmplyPrc')]}%<Tooltip id="UnEmplyPrc"/></p><br/>
                <p>Uninsured: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnInPrc')]}%<Tooltip id="UnInPrc"/></p><br/>
                <p>Primary care physicians: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrmPhysRt')]}<Tooltip id="PrmPhysRt"/></p><br/>
                <p>Preventable hospital stays: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrevHospRt')]?.toLocaleString('en')}<Tooltip id="PrevHospRt"/></p><br/>
                <p>Residential segregation-black/white: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'RsiSgrBlckRt')]||'NA'}</p><br/>
                <p>Severe housing problems: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'SvrHsngPrbRt')]}%<Tooltip id="SvrHsngPrbRt"/></p><br/>
              </ReportSection>
          )}
          {chr_health_context && ( 
            expanded ? 
              <ReportSection>
                <h2>Community Health Context</h2><Tooltip id="healthcontext"/>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>

                <p>65 and older<Tooltip id="Over65YearsPrc"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'Over65YearsPrc')]}%</BigNumber>
                </NumberChartContainer> 

                <p>Adult obesity<Tooltip id="AdObPrc"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdObPrc')]}%</BigNumber>
                </NumberChartContainer>  

                <p>Diabetes prevalence<Tooltip id="AdDibPrc"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdDibPrc')]}%</BigNumber>
                </NumberChartContainer>  

                <p>Adult smoking<Tooltip id="SmkPrc"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'SmkPrc')]}%</BigNumber>
                </NumberChartContainer> 

                <p>Excessive drinking<Tooltip id="ExcDrkPrc"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'ExcDrkPrc')]}%</BigNumber>
                </NumberChartContainer>  

                <p>Drug overdose deaths<Tooltip id="DrOverdMrtRt"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'DrOverdMrtRt')]||'0'}</BigNumber>
                </NumberChartContainer> 
              </ReportSection>
            :  
              <ReportSection>
                <h2>Community Health Context</h2><Tooltip id="healthcontext"/>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
                <p>65 and older: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'Over65YearsPrc')]}% <Tooltip id="Over65YearsPrc"/></p><br/>
                <p>Adult obesity: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdObPrc')]}%<Tooltip id="AdObPrc"/></p><br/>
                <p>Diabetes prevalence: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdDibPrc')]}% <Tooltip id="AdDibPrc"/></p><br/>
                <p>Adult smoking: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'SmkPrc')]}% <Tooltip id="SmkPrc"/></p><br/>
                <p>Excessive drinking: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'ExcDrkPrc')]}% <Tooltip id="ExcDrkPrc"/></p><br/>
                <p>Drug overdose deaths: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'DrOverdMrtRt')]||'0'}<Tooltip id="DrOverdMrtRt"/></p><br/>
              </ReportSection>
          )}
          {chr_life && ( 
            expanded ? 
              <ReportSection>
                <h2>Length and Quality of Life<Tooltip id="healthlife"/></h2>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
                <p>Life expectancy<Tooltip id="LfExpRt"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_life[colLookup(cols, currentData, 'chr_life', 'LfExpRt')]}</BigNumber>
                </NumberChartContainer>  

                <p>Self-rated health<Tooltip id="SlfHlthPrc"/></p><br/>
                <NumberChartContainer>
                  <BigNumber>{chr_life[colLookup(cols, currentData, 'chr_life', 'SlfHlthPrc')]}%</BigNumber>
                </NumberChartContainer> 

              </ReportSection>
            :
              <ReportSection>
                <h2>Length and Quality of Life<Tooltip id="healthlife"/></h2>
                <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
                <p>Life expectancy: {chr_life[colLookup(cols, currentData, 'chr_life', 'LfExpRt')]}<Tooltip id="LfExpRt"/></p><br/>
                <p>Self-rated health: {chr_life[colLookup(cols, currentData, 'chr_life', 'SlfHlthPrc')]}% <Tooltip id="SlfHlthPrc"/></p><br/>
              </ReportSection>
          )}
          {(predictions && cols[currentData] && cols[currentData].predictions) && ( 
            expanded ? 
              <ReportSection>
                <h2>Forecasting</h2><br/>            
                <h6>Source: <a href="https://github.com/Yu-Group/covid19-severity-prediction/" target="_blank" rel="noopener noreferrer">Yu Group at Berkeley</a></h6>            
                <p>5-Day Severity Index<Tooltip id="SeverityIndex"/></p><br />
                <NumberChartContainer>
                  <BigNumber> {['','Low','Medium','High'][predictions[1]]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[2].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[2]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[4].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber> {predictions[4]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[6].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[6]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[8].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[8]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[10].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[10]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[12].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[12]}</BigNumber>
                </NumberChartContainer> 
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[14].split('_'))}<Tooltip id="PredictedDeaths"/></p><br/> 
                <NumberChartContainer>
                  <BigNumber>{predictions[14]}</BigNumber>
                </NumberChartContainer> 
              </ReportSection>
            : 
              <ReportSection>
                <h2>Forecasting</h2><br/>            
                <h6>Source: <a href="https://github.com/Yu-Group/covid19-severity-prediction/" target="_blank" rel="noopener noreferrer">Yu Group at Berkeley</a></h6>            
                <p>5-Day Severity Index: {['','Low','Medium','High'][predictions[1]]}<Tooltip id="SeverityIndex"/></p><br />
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[2].split('_'))}: {predictions[2]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[4].split('_'))}: {predictions[4]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[6].split('_'))}: {predictions[6]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[8].split('_'))}: {predictions[8]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[10].split('_'))}: {predictions[10]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[12].split('_'))}: {predictions[12]}<Tooltip id="PredictedDeaths"/></p><br/>
                <p>Predicted Deaths by {parsePredictedDate(cols[currentData].predictions[14].split('_'))}: {predictions[14]}<Tooltip id="PredictedDeaths"/></p><br/>
              </ReportSection>
          )}
          
          <div className="extraPadding"></div>
          
          {properties && <button onClick={handleOpenClose} id="showHideRight" className={panelState.info ? 'active' : 'hidden'}>{report}</button>}
          {properties && <ResizeButton 
                  id="resize"
                  onMouseDown={handleDown}
                  onTouchStart={handleTouch}
                  style={{zIndex:10}}
              >
                  {verticalGrip}
              </ResizeButton>}
        </ReportContainer>
      </ReportWrapper>
    </DataPanelContainer>
  );
}

export default DataPanel;