import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import styled from 'styled-components';

import { colLookup, getArrayCSV, getGzipData } from '../utils';
import Tooltip from './tooltip';
import { StyledDropDown } from '../styled_components';
import { setVariableParams, setVariableName, setMapParams, setCurrentData, setPanelState, setNotification, storeMobilityData } from '../actions';
import { fixedScales, colorScales, dataPresets, legacyVariableOrder, colors } from '../config';
import { settings } from '../config/svg';

const VariablePanelContainer = styled.div`
  position:fixed;
  left:0;
  top:50px;
  height:auto;
  min-height:calc(100vh - 50px);
  min-width:200px;
  background-color: ${colors.gray}fa;
  box-shadow: 2px 0px 5px rgba(0,0,0,0.7);
  padding:0;
  box-sizing: border-box;
  transition:250ms all;
  font: 'Lato', sans-serif;
  color:white;
  z-index:50;
  @media (max-width:1024px) {
    min-width:50vw;
  }  
  @media (max-width:600px) {
    width:100%;
    display: ${props => props.otherPanels ? 'none' : 'initial'};
  }
  div.noteContainer {
    position: absolute;
    bottom:0;
    left:0;
    padding:20px;
    box-sizing:border-box;
    background:${colors.gray};
    width:calc(100%);
    box-shadow: 0px -5px 10px rgba(0,0,0,0.25);
    a {  
      color: ${colors.yellow};
      -webkit-text-decoration: none;
      text-decoration: none;
      }
    }
  }
  p.note {
    font-family: 'Lato', sans-serif;
    font-weight:300;
    font-size:90%;
  }
  div.poweredByGeoda {
    color:white;
    width:100%;
    text-align:center;
    @media (max-height:900px){
    }
    a {
      color:white;
      margin:0 auto;
      text-decoration: none;
      letter-spacing: 2px;
      font-size:75%;
      img {
        width:23px;
        height:27px;
        transform: translate(-50%,40%);
      }
    }
  }
  button#showHideLeft {
    position:absolute;
    left:95%;
    top:20px;
    width:40px;
    height:40px;
    box-sizing:border-box;
    padding:0;
    margin:0;
    background-color: ${colors.gray};
    box-shadow: 0px 0px 6px rgba(0,0,0,1);
    outline:none;
    border:none;
    cursor: pointer;
    transition:500ms all;
    svg { 
      width:20px;
      height:20px;
      margin:10px 0 0 0;
      @media (max-width:600px){
        width:20px;
        height:20px;
        margin:5px;
      }
      fill:white;
      transform:rotate(0deg);
      transition:500ms all;
      .cls-1 {
        fill:none;
        stroke-width:6px;
        stroke:white;
      }
    }
    :after {
      opacity:0;
      font-weight:bold;
      content: 'Variables';
      color:white;
      position: relative;
      right:-50px;
      top:-22px;
      transition:500ms all;
      z-index:4;
    }
    @media (max-width:768px){
      top:120px;
    }
    @media (max-width:600px) {
      left:90%;
      width:30px;
      height:30px;
      :after {
        display:none;
      }
    }
  }
  button#showHideLeft.hidden {
    left:100%;
    svg {
      transform:rotate(90deg);
    }
    :after {
      opacity:1;
    }
  }
`
const StyledButtonGroup = styled(ButtonGroup)`
  color:white;
  padding-bottom:20px;
  .MuiButtonGroup-grouped {
    color:white;
    border-color:${colors.white}77;
    &:hover {
      border-color:white;
    }
    &.active {
      background:white;
      color:${colors.gray};
    }
  }
`

const TwoUp = styled.div`
  width:100%;
  .MuiFormControl-root {
    width:45%;
    min-width:60px;
    margin-right:5px;
  }
`

const ControlsContainer = styled.div`
  max-height:74vh;
  overflow-y:visible;
  box-sizing:border-box;
  padding:20px;

  @media (max-height:1079px){
    overflow-y:scroll;
    padding:20px 20px 25vh 20px;
  }
  
  @media (max-width:600px) {
    width:100%;
    padding:0 10px 25vh 10px;
  }
`

const ListSubheader = styled(MenuItem)`
  font-variant: small-caps;
  font-weight:800;
`

const VariablePanel = (props) => {

  const getGzipAndCentroids = async (gzipUrl, centroidsUrl) => {
    Promise.all([
        getGzipData(gzipUrl),
        getArrayCSV(centroidsUrl)
      ]).then(
        values => dispatch(storeMobilityData({centroids: values[1], flows: values[0]}))
    )
  } 

  const dispatch = useDispatch();    

  const { cols, currentData, currentVariable, dataParams,
    mapParams, panelState, urlParams, storedMobilityData } = useSelector(state => state);

  const PresetVariables = {
    "HEADER:cases":{},
    "Confirmed Count": {
        numerator: 'cases',
        nType: 'time-series',
        nProperty: null,
        denominator: 'properties',
        dType: null,
        dProperty: null,
        dRange:null,
        dIndex:null,
        scale:1,
        scale3D: 100
    },
    "Confirmed Count per 100K Population": {
        numerator: 'cases',
        nType: 'time-series',
        nProperty: null,
        denominator: 'properties',
        dType: 'characteristic',
        dProperty: 'population',
        dRange:null,
        dIndex:null,
        scale:100000,
        scale3D: 1000
    },
    "Confirmed Count per Licensed Bed": {
        numerator: 'cases',
        nType: 'time-series',
        nProperty: null,
        denominator: 'properties',
        dType: 'characteristic',
        dProperty: 'beds',
        dRange:null,
        dIndex:null,
        scale:1,
        scale3D: 100000
    },
    "HEADER:deaths":{},
    "Death Count":{
      numerator: 'deaths',
      nType: 'time-series',
      nProperty: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      scale3D: 10000
        
    }, 
    "Death Count per 100K Population":{
      numerator: 'deaths',
      nType: 'time-series',
      nProperty: null,
      denominator: 'properties',
      dType: 'characteristic',
      dProperty: 'population',
      dRange:null,
      dIndex:null,
      scale:100000,
      scale3D: 15000

    },
    "Death Count / Confirmed Count":{
      numerator: 'deaths',
      nType: 'time-series',
      nProperty: null,
      denominator: 'cases',
      dType: 'time-series',
      dProperty: null,
      scale:1

    },
    "HEADER:community health":{},
    "Uninsured % (Community Health Factor)":{
      numerator: 'chr_health_factors',
      nType: 'characteristic',
      nProperty: colLookup(cols, currentData, 'chr_health_factors', 'UnInPrc'),
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      colorScale: 'uninsured',
      scale3D: 15000

    },
    "Over 65 Years % (Community Health Context)":{
      numerator: 'chr_health_context',
      nType: 'characteristic',
      nProperty: colLookup(cols, currentData, 'chr_health_context', 'Over65YearsPrc'),
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      colorScale: 'over65',
      scale3D: 15000
    },
    "Life expectancy (Length and Quality of Life)":{
      numerator: 'chr_life',
      nType: 'characteristic',
      nProperty: colLookup(cols, currentData, 'chr_life', 'LfExpRt'),
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      colorScale: 'lifeExp',
      scale3D: 1000
    }
  }

  const CountyVariables = {
    "HEADER:forecasting":{},
    "Forecasting (5-Day Severity Index)": {
      numerator: 'predictions',
      nType: 'characteristic',
      nProperty: colLookup(cols, currentData, 'predictions', 'severity_index'),
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      colorScale: 'forecasting',
      fixedScale: 'forecasting',
      scale3D: 50000
    }
  }

  const StateVariables = {
    "HEADER:testing":{},
    "7 Day Testing Positivity Rate %": {
      numerator: 'testing_wk_pos',
      nType: 'characteristic',
      nProperty: null,
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      fixedScale: 'testing',
      colorScale: 'testing',
      scale3D: 10000000
    },
    "7 Day Testing Capacity": {
      numerator: 'testing_tcap',
      nType: 'characteristic',
      nProperty: null,
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      fixedScale: 'testingCap',
      colorScale: 'testingCap',
      scale3D: 3000
    }, 
    "7 Day Confirmed Cases per Testing %":{
      numerator: 'testing_ccpt',
      nType: 'characteristic',
      nProperty: null,
      nRange: null,
      denominator: 'properties',
      dType: null,
      dProperty: null,
      dRange:null,
      dIndex:null,
      scale:1,
      fixedScale: 'testing',
      colorScale: 'testing',
      scale3D: 10000000
    }
  }

  useEffect(() => {
    if (urlParams.var) handleVariable({event: { target: { 
      value: legacyVariableOrder[urlParams.src||'county_usfacts.geojson'][urlParams.var]
      }}})
  },[])

  useEffect(() => {
    if (mapParams.overlay === "mobility-county" && storedMobilityData === {}) {
      getGzipAndCentroids(
        `${process.env.PUBLIC_URL}/gz/county_lex_2020-11-28.csv.gz`,
        `${process.env.PUBLIC_URL}/csv/county_centroids.csv`
      )
      console.log('loaded mobility data')
    }
  },[mapParams.overlay])

  const handleVariable = (event) => {
    let variable = event.target.value;
    let tempParams = PresetVariables[variable] || CountyVariables[variable] || StateVariables[variable] || null;
    
    // dispatch(variableChange({
    //   variable,
    //   mapParams: {
    //     customScale: tempParams.colorScale || '', 
    //     fixedScale: tempParams.fixedScale || null
    //   },
    //   variableParams: {
    //     ...tempParams
    //   }
    // }))
    if (dataParams.nType === 'characteristic' && tempParams.nType === 'time-series') tempParams.nRange = 7;

    dispatch(setVariableName(variable))
    dispatch(setMapParams({customScale: tempParams.colorScale || '', fixedScale: tempParams.fixedScale || null}))
    dispatch(setVariableParams({...tempParams}))
  };

  const handleDataSource = (event) => {
    let newDataSet = event.target.value
    if ((newDataSet.includes("state") && CountyVariables.hasOwnProperty(currentVariable))||(newDataSet.includes("county") && StateVariables.hasOwnProperty(currentVariable))) {

      // dispatch(resetVariable({
      //   mapParams: {
      //     customScale: '', 
      //     fixedScale: null
      //   },
      //   variableParams: {
      //     ...PresetVariables["Confirmed Count per 100K Population"]
      //   },
      //   variable: "Confirmed Count per 100K Population",
      //   notification: `${dataPresets[newDataSet].plainName} data do not have ${currentVariable}. The Atlas will default to Confirmed Cases Per 100k People.`
      // }))

      dispatch(setMapParams({customScale: '', fixedScale: null}))
      dispatch(setVariableParams({...PresetVariables["Confirmed Count per 100K Population"]}))
      dispatch(setVariableName("Confirmed Count per 100K Population"))
      dispatch(setNotification(`${dataPresets[newDataSet].plainName} data do not have ${currentVariable}. The Atlas will default to Confirmed Cases Per 100k People.`))  

      setTimeout(() => {dispatch(setCurrentData(newDataSet))}, 250);
      setTimeout(() => {dispatch(setNotification(null))},10000);
    } else {
      dispatch(setCurrentData(newDataSet)); 
    }
  };


  const handleMapType = (event, newValue) => {
    let nBins = newValue === 'hinge15_breaks' ? 6 : 8
    if (newValue === 'lisa') {
      dispatch(
        setMapParams(
          {
            mapType: newValue,
            nBins: 4,
            bins: fixedScales[newValue],
            colorScale: colorScales[newValue]
          }
        )
      )
    } else {
      dispatch(
        setMapParams(
          {
            nBins,
            mapType: newValue
          }
        )
      )
    }
  }

  const handleMapOverlay = (event) =>{
    dispatch(
      setMapParams(
        {
          overlay: event.target.value
        }
      )
    )
  }

  const handleMapResource = (event) =>{
    dispatch(
      setMapParams(
        {
          resource: event.target.value
        }
      )
    )
  }

  const handleOpenClose = () => {
    if (panelState.variables) {
      dispatch(setPanelState({variables:false}))
    } else {
      dispatch(setPanelState({variables:true}))
    }
  }

  const handleVizTypeButton = (vizType) => {
    if (mapParams.vizType !== vizType) {
      dispatch(setMapParams({vizType}))
    }
  }
  return (
    <VariablePanelContainer style={{transform: (panelState.variables ? '' : 'translateX(-100%)')}} otherPanels={panelState.info}>
      <ControlsContainer>
        <h2>Data Sources &amp;<br/> Map Variables</h2>
        <StyledDropDown>
          <InputLabel htmlFor="data-select">Data Source</InputLabel>
          <Select  
            id="data-select"
            value={currentData}
            onChange={handleDataSource}
          >
            
          <ListSubheader disabled>county data</ListSubheader>
            <MenuItem value={'county_usfacts.geojson'} key={'county_usfacts.geojson'}>USA Facts (County)</MenuItem>
            <MenuItem value={'county_nyt.geojson'} key={'county_nyt.geojson'}>New York Times (County)</MenuItem>
            <MenuItem value={'county_1p3a.geojson'} key={'county_1p3a.geojson'}>1point3acres (County)</MenuItem>
          <ListSubheader disabled>state data</ListSubheader>
            <MenuItem value={'state_usafacts.geojson'} key={'state_usafacts.geojson'}>USA Facts (State)</MenuItem>
            <MenuItem value={'state_nyt.geojson'} key={'state_nyt.geojson'}>New York Times (State)</MenuItem>
          {/* <ListSubheader disabled>global data</ListSubheader>
            <MenuItem value={'global_jhu.geojson'} key={'global_jhu.geojson'}>John Hopkins University (Global)</MenuItem> */}
            
          </Select>
        </StyledDropDown>
        <br />
        <StyledDropDown>
          <InputLabel htmlFor="numerator-select">Select Variable</InputLabel>
          <Select 
            value={currentVariable} 
            id="numerator-select"
            onChange={handleVariable}
          >
            {
              Object.keys(PresetVariables).map((variable) => {
                if (variable.split(':')[0]==="HEADER") {
                  return <ListSubheader key={variable.split(':')[1]} disabled>{variable.split(':')[1]}</ListSubheader>
                } else {
                  return <MenuItem value={variable} key={variable}>{variable}</MenuItem> 
                }
              })
            }
            
            {
              currentData.includes("county") && Object.keys(CountyVariables).map((variable) => {
                if (variable.split(':')[0]==="HEADER") {
                  return <ListSubheader key={variable.split(':')[1]} disabled>{variable.split(':')[1]}</ListSubheader>
                } else {
                  return <MenuItem value={variable} key={variable}>{variable}</MenuItem> 
                }
              })
            }
            
            {
              currentData.includes("state") && Object.keys(StateVariables).map((variable) => {
                if (variable.split(':')[0]==="HEADER") {
                  return <ListSubheader key={variable.split(':')[1]} disabled>{variable.split(':')[1]}</ListSubheader>
                } else {
                  return <MenuItem value={variable} key={variable}>{variable}</MenuItem> 
                }
              })
            }
          </Select>
        </StyledDropDown>
        <br/>
        <StyledDropDown component="Radio" >
          <FormLabel component="legend">Map Type</FormLabel>
          <RadioGroup 
            aria-label="maptype" 
            name="maptype1" 
            onChange={handleMapType} 
            value={mapParams.mapType}
            className="radioContainer"
            >
            <FormControlLabel 
              value="natural_breaks" 
              key="natural_breaks" 
              control={<Radio />} 
              label="Natural Breaks"
            /><Tooltip id="NaturalBreaks"/>
            <br/>
            <FormControlLabel 
              value="hinge15_breaks" 
              key="hinge15_breaks" 
              control={<Radio />} 
              label="Box Map" 
            /><Tooltip id="BoxMap"/>
            <br/>
            <FormControlLabel 
              value="lisa" 
              key="lisa" 
              control={<Radio />} 
              label="Hotspot" 
            /><Tooltip id="Hotspot"/>
            <br/>
          </RadioGroup>
        </StyledDropDown>
        <p>Visualization Type</p>
        <StyledButtonGroup color="primary" aria-label="text button group">
          <Button className={mapParams.vizType === '2D' ? 'active' : ''} data-val="2D" key="2D-btn" onClick={() => handleVizTypeButton('2D')}>2D</Button>
          <Button className={mapParams.vizType === '3D' ? 'active' : ''} data-val="3D" key="3D-btn" onClick={() => handleVizTypeButton('3D')}>3D</Button>
          <Button className={mapParams.vizType === 'cartogram' ? 'active' : ''} data-val="cartogram" key="cartogram-btn" onClick={() => handleVizTypeButton('cartogram')}>Cartogram</Button>
        </StyledButtonGroup>
        <br/>
        <TwoUp>
          <StyledDropDown>
            <InputLabel htmlFor="overlay-select">Overlay</InputLabel>
            <Select  
              id="overlay-select"
              value={mapParams.overlay}
              onChange={handleMapOverlay}
            >
              <MenuItem value="" key={'None'}>None</MenuItem> 
              <MenuItem value={'native_american_reservations'} key={'native_american_reservations'}>Native American Reservations</MenuItem>
              <MenuItem value={'segregated_cities'} key={'segregated_cities'}>Hypersegregated Cities<Tooltip id="Hypersegregated"/></MenuItem>
              <MenuItem value={'blackbelt'} key={'blackbelt'}>Black Belt Counties<Tooltip id="BlackBelt" /></MenuItem>
              <MenuItem value={'uscongress-districts'} key={'uscongress-districts'}>US Congressional Districts <Tooltip id="USCongress" /></MenuItem>
              {/* <MenuItem value={'mobility-county'} key={'mobility-county'}>Mobility Flows (County) WARNING BIG DATA</MenuItem> */}
            </Select>
          </StyledDropDown>
          <StyledDropDown>
            <InputLabel htmlFor="resource-select">Resource</InputLabel>
            <Select  
              id="resource-select"
              value={mapParams.resource}
              onChange={handleMapResource}
            >
              <MenuItem value="" key='None'>None</MenuItem> 
              <MenuItem value={'clinics_hospitals'} key={'variable1'}>Clinics and Hospitals</MenuItem>
              <MenuItem value={'clinics'} key={'variable2'}>Clinics</MenuItem>
              <MenuItem value={'hospitals'} key={'variable3'}>Hospitals</MenuItem>
            </Select>
          </StyledDropDown>
        </TwoUp>        
      </ControlsContainer>
      <div className="noteContainer">
        <h2>Help us improve the Atlas!</h2>
        <h3>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSf0KdYeVyvwnz0RLnZijY3kdyFe1SwXukPc--a1HFPE1NRxyw/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">Take the Atlas v2 survey here </a>
          or share your thoughts at <a href="mailto:contact@theuscovidatlas.org" target="_blank" rel="noopener noreferrer">contact@theuscovidatlas.org.</a>
        </h3>
        <hr></hr>
        <p className="note">
          Data is updated with freshest available data at 3pm CST daily, at minimum. 
          In case of data discrepancy, local health departments are considered most accurate as per CDC recommendations. 
          More information on <a href="data.html">data</a>, <a href="methods.html">methods</a>, 
          and <a href="FAQ.html">FAQ</a> at main site.
        </p>
        <div className="poweredByGeoda">
            <a href="https://geodacenter.github.io" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/assets/img/geoda-logo.png`} />
              POWERED BY GEODA
            </a>
        </div> 
      </div>
      <button onClick={handleOpenClose} id="showHideLeft" className={panelState.variables ? 'active' : 'hidden'}>{settings}</button>

    </VariablePanelContainer>
  );
}

export default VariablePanel;