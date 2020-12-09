import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as jsgeoda from 'jsgeoda';


// Helper and Utility functions //
// first row: data loading
// second row: data parsing for specific outputs
// third row: data accessing
import { 
  getParseCSV, mergeData, getColumns, findDates, loadJson,
  getDataForBins, getDataForCharts, getDataForLisa, 
  getLisaValues, getVarId, getCartogramValues } from './utils';

// Actions -- Redux state manipulation following Flux architecture //
// first row: data storage
// second row: data and metadata handling 
// third row: map and variable parameters
import { 
  dataLoad, dataLoadExisting, storeLisaValues, storeCartogramData,
  setCentroids, setMapParams, setNewBins, setUrlParams, setPanelState } from './actions';

import { Map, NavBar,
  VariablePanel, BottomPanel, DataPanel, MainLineChart, Scaleable, Draggable, TopPanel,
  Popover, Preloader, InfoBox, NotificationBox
} from './components';  
import { colorScales, fixedScales, dataPresets, 
  legacyOverlayOrder, legacyResourceOrder, legacySourceOrder } from './config';

// Main function, App. This function does 2 things:
// 1: App manages the majority of the side effects when the state changes.
//    This takes the form of React's UseEffect hook, which listens
//    for changes in the state and then performs the functions in the hook.
//    App listens for different state changes and then calculates the relevant
//    side effects (such as binning calculations and GeoDa functions, column parsing)
//    and then dispatches new data to the store.
// 2: App assembles all of the components together and sends Props down
//    (as of 12/1 only Preloader uses props and is a higher order component)


function App() {
  // static variables for floating panel sizing
  let [ defaultX, defaultY, defaultWidth, defaultHeight,
    minHeight, minWidth] = window.innerWidth <= 1024 ? 
    [window.innerWidth*.05, window.innerHeight*.35, window.innerWidth*.8, window.innerHeight*.4, window.innerHeight*.2, window.innerWidth*.5] : 
    [window.innerWidth-400, window.innerHeight-400, 300, 300, 300, 300]


  // These selectors access different pieces of the store. While App mainly
  // dispatches to the store, we need checks to make sure side effects
  // are OK to trigger. Issues arise with missing data, columns, etc.
  const {storedData, storedGeojson, storedLisaData, storedCartogramData,
    currentData, cols, dates, mapParams, dataParams, 
    startDateIndex, mapLoaded } = useSelector(state => state);
  
  // gda_proxy is the WebGeoda proxy class. Generally, having a non-serializable
  // data in the state is poor for performance, but the App component state only
  // contains gda_proxy.
  const [gda_proxy, set_gda_proxy] = useState(null);
  const dispatch = useDispatch();  
  
  // // Dispatch helper functions for side effects and data handling
  // Get centroid data for cartogram
  // const getCentroids = (geojson, gda_proxy) =>  dispatch(setCentroids(gda_proxy.GetCentroids(geojson), geojson))
  
  // Main data loader
  // This functions asynchronously accesses the Geojson data and CSVs
  //   then performs a join and loads the data into the store
  const loadData = async (params, gda_proxy) => {
    // destructure parameters
    const { geojson, csvs, joinCols, tableNames, accumulate } = params

    // promise all data fetching - CSV and Json
    const csvPromises = csvs.map(csv => 
      getParseCSV(
        `${process.env.PUBLIC_URL}/csv/${csv}.csv`, 
        joinCols[1], 
        accumulate.includes(csv)
      ).then(result => {return result}))

    Promise.all([
      loadJson(`${process.env.PUBLIC_URL}/geojson/${geojson}`, gda_proxy).then(result => {return result}),
      ...csvPromises
    ]).then(values => {
      // store geojson lookup table
      // merge data and get results
      let tempData = mergeData(values[0]['data'], joinCols[0], values.slice(1,), tableNames, joinCols[1]);
      let ColNames = getColumns(values.slice(1,), tableNames);
      let tempDates = findDates(ColNames.cases);
      let chartData = getDataForCharts(tempData,'cases',tempDates[1],tempDates[0]);
      let binData = getDataForBins(tempData, {...dataParams, nIndex: null});
      // calculate breaks
      let nb = gda_proxy.custom_breaks(
        geojson, 
        mapParams.mapType,
        mapParams.nBins,
        null, 
        binData
      );

      // store data, data name, and column names
      dispatch(
        dataLoad({
          storeData: {
            data: tempData, 
            name: geojson
          },
          currentData: geojson,
          columnNames: {
            data: ColNames,
            name: geojson
          },
          storeGeojson: {
            data: values[0]['geoidIndex'],
            name: geojson
          },
          chartData: chartData,
          mapParams: {
            bins: {
              bins: mapParams.mapType === "natural_breaks" ? nb.bins : ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
              breaks: [-Math.pow(10, 12), ...nb.breaks.slice(1,-1), Math.pow(10, 12)]
            },
            colorScale: colorScales[mapParams.customScale || mapParams.mapType]
          },
          dates: {
            data:tempDates[0],
            name:geojson
          },
          currDate: tempDates[0][tempDates.length-1],
          startDateIndex: tempDates[1],
          variableParams: {
            nIndex: ColNames['cases'].length-1,
            binIndex: ColNames['cases'].length-1
          }
        })
      )
    })
  }

  const updateBins = () => {
    if (gda_proxy !== null && storedData.hasOwnProperty(currentData) && mapParams.mapType !== "lisa" && mapParams.binMode !== 'dynamic'){
      if (mapParams.fixedScale !== null) {
        dispatch(
          setMapParams({
            bins: fixedScales[mapParams.fixedScale],
            colorScale: colorScales[mapParams.fixedScale]
          })
        )
      } else {
        let nb = gda_proxy.custom_breaks(
          currentData, 
          mapParams.mapType, 
          mapParams.nBins, 
          null, 
          getDataForBins( storedData[currentData], {...dataParams, nIndex: null} )
        )
        
        dispatch(
          setMapParams({
            bins: {
              bins: mapParams.mapType === "natural_breaks" ? nb.bins : ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
              breaks: [-Math.pow(10, 12), ...nb.breaks.slice(1,-1), Math.pow(10, 12)]
            },
            colorScale: colorScales[mapParams.customScale || mapParams.mapType]
          })
        )
      }
    }
  }
  // After runtime is initialized, this loads in gda_proxy to the state
  // TODO: Recompile WebGeoda and load it into a worker
  useEffect(() => {
    
    let paramsDict = {}; 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams ) { paramsDict[key] = value; }

    dispatch(
      setUrlParams({
        currentData: paramsDict['src'] ? legacySourceOrder[decodeURI(paramsDict['src'])] : 'county_usfacts.geojson',
        paramsDict,
        mapParams: {
          vizType: paramsDict['cartogram'] ? 'cartogram' : paramsDict['3d'] ? '3D' : '2D',
          mapType: paramsDict['mthd'] ? decodeURI(paramsDict['mthd']) : 'natural_breaks',
          overlay: paramsDict['ovr'] !== undefined ? legacyOverlayOrder[paramsDict['ovr']] : '',
          resource: paramsDict['res'] !== undefined ? legacyResourceOrder[paramsDict['res']] : ''
        }
      })
    );

    if (window.innerWidth <= 1024) {
      dispatch(setPanelState({
        variables:false,
        info:false,
        tutorial:false,
        lineChart: false
      }))
    }

    const newGeoda = async () => {
      let geoda = await jsgeoda.New();
      set_gda_proxy(geoda);
    }

    newGeoda()
  },[])


  // On initial load and after gda_proxy has been initialized, this loads in the default data sets (USA Facts)
  // Otherwise, this side-effect loads the selected data.
  // Each conditions checks to make sure gda_proxy is working.
  useEffect(() => {
    if (gda_proxy === null) {
      return;
    } else if (storedData === {}) {
      loadData(
        dataPresets[currentData],
        gda_proxy
      )
    } else if (storedData[currentData] === undefined) {
      loadData(
        dataPresets[currentData],
        gda_proxy
      )
    } else if (cols[currentData] !== undefined) {
      let dateIndex = findDates(cols[currentData].cases)[1];
      let dataLength = cols[currentData].cases.length;

      dispatch(
        dataLoadExisting({
          currDate: dates[currentData][dates[currentData].length-1],
          startDateIndex: dateIndex,
          variableParams: {
            nIndex: dataLength-1,
            binIndex: dataLength-1
          },
          chartData: getDataForCharts(storedData[currentData],'cases',dateIndex,dates[currentData]),
        })
      )
      
      updateBins();
    }
  },[gda_proxy, currentData])

  // This listens for gda_proxy events for LISA and Cartogram calculations
  // Both of these are computationally heavy.
  useEffect(() => {
    if (gda_proxy !== null && mapParams.mapType === "lisa"){
      let tempId = getVarId(currentData, dataParams)
      if (!(storedLisaData.hasOwnProperty(tempId))) {
        dispatch(
          storeLisaValues(
            getLisaValues(
              gda_proxy, 
              currentData, 
              getDataForLisa(
                storedData[currentData], 
                dataParams,
                storedGeojson[currentData].indexOrder
              )
            ),
            tempId
          )
        )
      }
    } 
    if (gda_proxy !== null && mapParams.vizType === 'cartogram'){
      let tempId = getVarId(currentData, dataParams)
      if (!(storedCartogramData.hasOwnProperty(tempId))) {
        dispatch(
          storeCartogramData(
            getCartogramValues(
              gda_proxy, 
              currentData, 
              getDataForLisa( storedData[currentData], dataParams, storedGeojson[currentData].indexOrder )
            ),
            tempId
          )
        )
      }
    }
  }, [dataParams, mapParams])

  // Trigger on parameter change for metric values
  // Gets bins and sets map parameters
  useEffect(() => {
    updateBins();
  }, [currentData, dataParams.numerator, dataParams.nProperty, 
    dataParams.nRange, dataParams.denominator, dataParams.dProperty,
    dataParams.dRange, dataParams.scale, mapParams.mapType]
  )

  // trigger on date (index) change for dynamic binning
  useEffect(() => {
    if (gda_proxy !== null && mapParams.binMode === 'dynamic' && currentData !== '' && mapParams.mapType !== 'lisa'){
      let nb = gda_proxy.custom_breaks(
        currentData, 
        mapParams.mapType,
        mapParams.nBins,
        null, 
        getDataForBins( storedData[currentData], dataParams ), 
      );
      dispatch(
        setNewBins({
          mapParams: {
            bins: {
              bins: mapParams.mapType === "natural_breaks" ? nb.bins : ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
              breaks: [-Math.pow(10, 12), ...nb.breaks.slice(1,-1), Math.pow(10, 12)]
            },
            colorScale: colorScales[mapParams.customScale || mapParams.mapType]
          },
          variableParams: {
            binIndex: dataParams.nIndex, 
          }
        })
      )
    }

  }, [dataParams.nIndex, dataParams.dIndex, mapParams.binMode])
  

  // default width handlers on resize
  useEffect(() => {
    [ defaultX, defaultY, defaultWidth, defaultHeight,
      minHeight, minWidth] = window.innerWidth <= 1024 ? 
      [window.innerWidth*.05, window.innerHeight*.35, window.innerWidth*.8, window.innerHeight*.4, window.innerHeight*.2, window.innerWidth*.5] : 
      [window.innerWidth-400, window.innerHeight-400, 300, 300, 300, 300]
  }, [window.innerHeight, window.innerWidth])
  // const dragHandlers = {onStart: this.onStart, onStop: this.onStop};

  return (
    <div className="App">
      <Preloader loaded={mapLoaded} />
      <NavBar />
      {/* <header className="App-header" style={{position:'fixed', left: '20vw', top:'100px', zIndex:10}}>
        <button onClick={() => console.log(gda_proxy.wasm.GetNeighbors('county_usfacts.geojson','w_queencounty_usfacts.geojson100',100))}>LOG NEIGHBORS</button>
        <button onClick={() => total(5)}>test wasm</button>
      </header> */}
      <div id="mainContainer">
        <Map />
        <TopPanel />
        <BottomPanel />
        <VariablePanel />
        <DataPanel />
        <Popover />
        <NotificationBox />
        
        <Draggable 
          defaultX={defaultX}
          defaultY={defaultY}
          title="tutorial"
          content={
          <Scaleable 
            notScaleable={true}
            content={
              <InfoBox />
            } 
            title="tutorial"
            defaultWidth={defaultWidth}
            defaultHeight={defaultHeight}
            minHeight={minHeight}
            minWidth={minWidth} />
        }/>
        <Draggable 
          defaultX={defaultX}
          defaultY={defaultY}
          title="lineChart"
          content={
          <Scaleable 
            content={
              <MainLineChart />
            } 
            title="lineChart"
            defaultWidth={defaultWidth}
            defaultHeight={defaultHeight}
            minHeight={minHeight}
            minWidth={minWidth} />
        }/>
      </div>
    </div>
  );
}

export default App;