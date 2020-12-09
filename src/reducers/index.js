import { INITIAL_STATE } from '../constants/defaults';

var reducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'DATA_LOAD':
            // main new data loading reducer
            // I: Destructure payload (load) object
            let { storeData, currentData, columnNames, 
                storeGeojson, chartData, mapParams, 
                dates, currDate, startDateIndex, variableParams} = action.payload.load;

            // II: Create copies of existing state objects.
            // This is necessary to avoid mutating the state
            let [
                    dataObj, colDataObj, geoDataObj, 
                    mapParamsDataObj, datesDataObj, 
                    variableParamsDataObj, panelsDataObj
                ] = [
                    {
                    ...state.storedData
                }, {
                    ...state.cols
                }, {
                    ...state.storedGeojson,
                }, {
                    ...state.mapParams,
                    ...mapParams
                }, {
                    ...state.dates
                }, {
                    ...state.dataParams,
                    ...variableParams
                }, {
                    ...state.panelState,
                    info: false
                }];

                dataObj[storeData.name] = storeData.data;
                colDataObj[columnNames.name] = columnNames.data;
                geoDataObj[storeGeojson.name] = storeGeojson.data;
                datesDataObj[dates.name] = dates.data;
            return {
                ...state,
                storedData: dataObj,
                cols: colDataObj,
                storedGeojson: geoDataObj,
                mapParams: mapParamsDataObj,
                dates: datesDataObj,
                dataParams: variableParamsDataObj,
                currentData,
                chartData,
                currDate,
                startDateIndex,
                sidebarData: {},
                panelState: panelsDataObj

            };
        case 'DATA_LOAD_EXISTING':
            
            let [ variableParamsExDataObj, panelsExDataObj ] 
                = [
                    {
                    ...state.dataParams,
                    ...action.payload.load.variableParams
                }, {
                    ...state.panelState,
                    info: false
                }];

            return {
                ...state,
                dataParams: variableParamsExDataObj,
                chartData: action.payload.load.chartData,
                currDate: action.payload.load.currDate,
                startDateIndex: action.payload.load.startDateIndex,
                sidebarData: {},
                panelState: panelsExDataObj

            };
        case 'SET_NEW_BINS':
            let [ binsVariableParams, binsMapParams] 
                = [{
                    ...state.dataParams,
                    ...action.payload.load.variableParams
                },{
                    ...state.mapParams,
                    ...action.payload.load.mapParams
                }]
            return {
                ...state,
                dataParams: binsVariableParams,
                mapParams: binsMapParams
            }
        case 'SET_GEOID': 
            return {
                ...state,
                currentGeoid: action.payload.geoid
            };
        case 'SET_STORED_DATA':
            let obj = {
                ...state.storedData,
            }
            obj[action.payload.name] = action.payload.data
            return {
                ...state,
                storedData: obj
            };
        case 'SET_STORED_GEOJSON':
            let geojsonObj = {
                ...state.storedGeojson,
            }
            geojsonObj[action.payload.name] = action.payload.data
            return {
                ...state,
                storedGeojson: geojsonObj
            };
        case 'SET_STORED_LISA_DATA':
            let lisaObj = {
                ...state.storedLisaData,
            }
            lisaObj[action.payload.name] = action.payload.data
            return {
                ...state,
                storedLisaData: lisaObj
            };
        case 'SET_STORED_CARTOGRAM_DATA':
            let cartoObj = {
                ...state.storedCartogramData,
            }
            cartoObj[action.payload.name] = action.payload.data
            return {
                ...state,
                storedCartogramData: cartoObj
            };
        case 'SET_STORED_MOBILITY_DATA':
            return {
                ...state,
                storedMobilityData: action.payload.data
            }
        case 'SET_CENTROIDS':
            let centroidsObj = {
                ...state.centroids,
            }
            centroidsObj[action.payload.name] = action.payload.data
            return {
                ...state,
                centroids: centroidsObj
            };
        case 'SET_CURRENT_DATA':
            return {
                ...state,
                currentData: action.payload.data
            }
        case 'SET_GEODA_PROXY':
            return {
                ...state,
                geodaProxy: action.payload.proxy
            }
        case 'SET_DATES':
            let datesObj = {
                ...state.dates
            }
            datesObj[action.payload.name] = action.payload.data
            return {
                ...state,
                dates: datesObj
            }
        case 'SET_DATA_FUNCTION':
            return {
                ...state,
                currentDataFn: action.payload.fn
            }
        case 'SET_COLUMN_NAMES':
            let colObj = {
                ...state.cols
            }
            colObj[action.payload.name] = action.payload.data
            return {
                ...state,
                cols: colObj
            }
        case 'SET_CURR_DATE':
            return {
                ...state,
                currDate: action.payload.date
            }
        case 'SET_DATE_INDEX':
            return {
                ...state,
                currDateIndex: action.payload.index
            }
        case 'SET_START_DATE_INDEX':
            return {
                ...state,
                startDateIndex: action.payload.index
            }
        case 'SET_BINS':
            let binsObj = {};
            binsObj['bins'] =  action.payload.bins;
            binsObj['breaks'] =  action.payload.breaks;
            return {
                ...state,
                bins: binsObj
            }
        case 'SET_3D':
            return {
                ...state,
                use3D: !state.use3D
            }
        case 'SET_DATA_SIDEBAR':
            return {
                ...state,
                sidebarData: action.payload.data
            }
        case 'INCREMENT_DATE':
            let dateObj = {
                ...state.dataParams
            }
            if (action.payload.index+state.dataParams.nIndex > state.dates[state.currentData].length) {
                dateObj.nIndex = state.startDateIndex;
                dateObj.dIndex = state.startDateIndex;
                return {
                    ...state,
                    dataParams:dateObj
                }
            } else {
                dateObj.nIndex = dateObj.nIndex + action.payload.index;
                dateObj.dIndex = dateObj.dIndex + action.payload.index;
                return {
                    ...state,
                    dataParams:dateObj
                }
            }
        case 'SET_VARIABLE_PARAMS':
            let paramObj = {
                ...state.dataParams,
                ...action.payload.params
            }

            if (paramObj.nType === 'time-series' && paramObj.nIndex === null) {
                paramObj.nIndex = state.storedIndex;
                paramObj.nRange = state.storedRange;
            }
            if (paramObj.dType === 'time-series' && paramObj.dIndex === null) {
                paramObj.dIndex = state.storedIndex;
                paramObj.dRange = state.storedRange;
            }
            if (paramObj.nType === 'characteristic' && state.dataParams.nType === 'time-series') {
                return {
                    ...state,
                    storedIndex: state.dataParams.nIndex,
                    storedRange: state.dataParams.nRange,
                    dataParams: paramObj,
                }
            } else {
                return {
                    ...state,
                    dataParams: paramObj 
                }
            }
        case 'SET_MAP_PARAMS':
            let mapParamObj = {
                ...state.mapParams,
                ...action.payload.params
            }
            return {
                ...state,
                mapParams: mapParamObj 
            }
        case 'SET_PANELS':
            let panelsObj = {
                ...state.panelState,
                ...action.payload.params
            }
            return {
                ...state,
                panelState: panelsObj 
            }
        case 'SET_VARIABLE_NAME':
            return {
                ...state,
                currentVariable: action.payload.name
            }
        case 'SET_CHART_DATA':
            return {
                ...state,
                chartData: action.payload.data
            }
        case 'SET_ANCHOR_EL':
            return {
                ...state,
                anchorEl: action.payload.anchorEl
            }
        case 'SET_MAP_LOADED':
            return {
                ...state,
                mapLoaded: action.payload.loaded
            }
        case 'SET_NOTIFICATION':
            return {
                ...state,
                notification: action.payload.info
            }
        case 'SET_URL_PARAMS':
            let urlMapParamsObj = {
                ...state.mapParams,
                ...action.payload.load.mapParams
            }
            return {
                ...state,
                currentData: action.payload.load.currentData,
                urlParams: action.payload.load.paramsDict,
                mapParams: urlMapParamsObj
            }
        default:
            return state;
    }
}

export default reducer;