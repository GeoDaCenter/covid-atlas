// This components formats the data for the selected geography
// and displays it in the right side panel.

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';

import Tooltip from './tooltip';
import TwoWeekChart from './twoWeekLineChart';
import { setPanelState } from '../actions';
import {dataFn, colLookup} from '../utils';

// Styled components CSS
const DataPanelContainer = styled.div`
  position:fixed;
  right:0;
  top:50px;
  height:calc(100vh - 50px);
  background-color: #2b2b2bfa;
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
  div.container {
    width:100%;
    height:100vh;
    overflow-y:scroll;
    padding:5px 0 0 30px;
    box-sizing:border-box;
    div {
      padding-right:20px;
      box-sizing:border-box;
    }
  }
  button#showHideRight {
    position:absolute;    
    right:95%;
    top:20px;
    width:40px;
    height:40px;
    padding:0;
    margin:0;
    background-color: #2b2b2b;
    box-shadow: 0px 0px 6px rgba(0,0,0,1);
    outline:none;
    border:none;
    cursor: pointer;
    transition:500ms all;
    svg {
      width:30px;
      height:30px;
      margin:5px 0 0 0;
      @media (max-width:600px){
        width:20px;
        height:20px;
        margin:5px;
      }
      fill:white;
      transform:rotate(90deg);
      transition:500ms all;
    }
    :after {
      opacity:0;
      font-weight:bold;
      color:white;
      position: relative;
      top:-27px;
      transition:500ms all;
      content: 'Info';
      right:40px;
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
      color:#FFCE00;
      text-decoration:none;
    }
  }
  .extraPadding {
    padding-bottom:20vh;
  }
`

const BigNumber = styled.h2`
  font-size:1.5rem;
  padding:0 0 15px 0 !important;
`

const NumberChartContainer = styled.div`
  width:100%;
  display:flex;
  align-items: center;
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

  // helper for predictions data
  const parsePredictedDate = (list) => `${list.slice(-2,)[0]}/${list.slice(-1,)[0]}`

  // handles panel open/close
  const handleOpenClose = () => panelState.info ? dispatch(setPanelState({info:false})) : dispatch(setPanelState({info:true}))
  
  return (
    <DataPanelContainer className={panelState.info ? 'open' : ''} id="data-panel" otherPanels={panelState.variables}>
      <div className="container">
        {properties && <h2>{properties.NAME}{properties.state_name && `, ${properties.state_name}`}</h2>}
        {properties && 
          <div>
            <p>Population: {properties.population?.toLocaleString('en')}</p>
          </div>
        }
        {(cases && deaths) && 
          <div><br/>
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


            <p>Cases per 100k Population: {dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
            <p>Deaths per 100k Population: {dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: null, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
            <p>New Cases per 100k Population: {dataFn(cases, properties, {nProperty: null, nIndex: cases.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
            <p>New Deaths per 100k Population: {dataFn(deaths, properties, {nProperty: null, nIndex: deaths.length-1, nRange: 1, dProperty: 'population', dIndex: null, dRange: null, scale: 100000})?.toFixed(2).toLocaleString('en')}</p><br/>
            <p>Licensed Hospital Beds: {properties.beds?.toLocaleString('en')}</p><br/>
            {/* <p>Cases per Bed: {dataFn(cases, null, cases.length-1, null, properties, 'beds', null, null, 1)?.toFixed(2)?.toLocaleString('en')}</p><br/> */}
          </div>
        }
        {testing &&
          <div>
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
            <p>7-Day Confirmed Cases per Testing: {(testing_ccpt[testing_ccpt.length-1]*100).toFixed(2)}%</p><br/>
            <p>Testing Criterion: {properties.criteria}</p><br/>
          </div>

        }
        {chr_health_factors &&
          <div>
            <h2>Community Health Factors<Tooltip id="healthfactor"/></h2>
            <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
            <p>Children in poverty %: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PovChldPrc')]}<Tooltip id="PovChldPrc"/></p><br/>
            <p>Income inequality: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'IncRt')]}<Tooltip id="IncRt"/></p><br/>
            <p>Median household income: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'MedianHouseholdIncome')]?.toLocaleString('en')}<Tooltip id="MedianHouseholdIncome"/></p><br/>
            <p>Food insecurity %: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'FdInsPrc')]}<Tooltip id="FdInsPrc"/></p><br/>
            <p>Unemployment %: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnEmplyPrc')]}<Tooltip id="UnEmplyPrc"/></p><br/>
            <p>Uninsured %: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'UnInPrc')]}<Tooltip id="UnInPrc"/></p><br/>
            <p>Primary care physicians: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrmPhysRt')]}<Tooltip id="PrmPhysRt"/></p><br/>
            <p>Preventable hospital stays: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'PrevHospRt')]?.toLocaleString('en')}<Tooltip id="PrevHospRt"/></p><br/>
            <p>Residential segregation-black/white: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'RsiSgrBlckRt')]||'NA'}</p><br/>
            <p>Severe housing problems %: {chr_health_factors[colLookup(cols, currentData, 'chr_health_factors', 'SvrHsngPrbRt')]}<Tooltip id="SvrHsngPrbRt"/></p><br/>
          </div>
        }
        {chr_health_context &&
          <div>
            <h2>Community Health Context</h2><Tooltip id="healthcontext"/>
            <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
            <p>% 65 and older: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'Over65YearsPrc')]}<Tooltip id="Over65YearsPrc"/></p><br/>
            <p>Adult obesity %: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdObPrc')]}<Tooltip id="AdObPrc"/></p><br/>
            <p>Diabetes prevalence %: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'AdDibPrc')]}<Tooltip id="AdDibPrc"/></p><br/>
            <p>Adult smoking %: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'SmkPrc')]}<Tooltip id="SmkPrc"/></p><br/>
            <p>Excessive drinking %: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'ExcDrkPrc')]}<Tooltip id="ExcDrkPrc"/></p><br/>
            <p>Drug overdose deaths: {chr_health_context[colLookup(cols, currentData, 'chr_health_context', 'DrOverdMrtRt')]||'0'}<Tooltip id="DrOverdMrtRt"/></p><br/>
          </div>
        }
        {chr_life && 
          <div>
            <h2>Length and Quality of Life<Tooltip id="healthlife"/></h2>
            <h6>Source: <a href="https://www.countyhealthrankings.org/" target="_blank" rel="noopener noreferrer">County Health Rankings</a></h6>
            <p>Life expectancy: {chr_life[colLookup(cols, currentData, 'chr_life', 'LfExpRt')]}<Tooltip id="LfExpRt"/></p><br/>
            <p>Self-rated health %: {chr_life[colLookup(cols, currentData, 'chr_life', 'SlfHlthPrc')]}<Tooltip id="SlfHlthPrc"/></p><br/>
          </div>
        }
        {(predictions && cols[currentData] && cols[currentData].predictions) &&  
          <div>
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
          </div>
        }
        
        <div className="extraPadding"></div>
        
        {cases && <button onClick={handleOpenClose} id="showHideRight" className={panelState.info ? 'active' : 'hidden'}>
          {/* <svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
            <g transform="translate(50 50) scale(0.69 0.69) rotate(0) translate(-50 -50)">
              <path d="M38,33.8L23.9,47.9c-1.2,1.2-1.2,3.1,0,4.2L38,66.2l4.2-4.2l-9-9H71v17c0,0.6-0.4,1-1,1H59v6h11
                c3.9,0,7-3.1,7-7V30c0-3.9-3.1-7-7-7H59v6h11c0.6,0,1,0.4,1,1v17H33.2l9-9L38,33.8z"/>
            </g>
          </svg> */}
          <svg x="0px" y="0px" viewBox="0 0 100 100" >
            <path d="M61.7,14.1H22.8c-4.8,0-8.7,3.9-8.7,8.7v54.4c0,4.8,3.9,8.7,8.7,8.7h54.4c4.8,0,8.7-3.9,8.7-8.7V38.3
              c0-2.3-0.9-4.5-2.5-6.2L67.9,16.6C66.2,15,64,14.1,61.7,14.1z M64.2,30.4c0-1.2,0.7-1.5,1.5-0.7l4.4,4.4c0.8,0.8,0.5,1.5-0.7,1.5
              h-3.1c-1.2,0-2.2-1-2.2-2.2V30.4z M27.1,75c-1.2,0-2.2-1-2.2-2.2V27.1c0-1.2,1-2.2,2.2-2.2h23.9c1.2,0,2.2,1,2.2,2.2V38
              c0,4.8,3.9,8.7,8.7,8.7h10.9c1.2,0,2.2,1,2.2,2.2v23.9c0,1.2-1,2.2-2.2,2.2H27.1z"/>
          </svg>



        </button>}
      </div>
    </DataPanelContainer>
  );
}

export default DataPanel;