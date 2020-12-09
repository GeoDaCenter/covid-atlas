import { legacyOverlayOrder, legacyResourceOrder, legacySourceOrder, legacyVariableOrder } from '../config';

const getURLParams = (params) => {

    let { URLmapParams, URLcurrentData, URLcurrentVariable, URLviewState } = params;
    
    let overlay = URLmapParams.overlay ? `&ovr=${legacyOverlayOrder.indexOf(URLmapParams.overlay)}` : '';
    let resource = URLmapParams.resource ? `&res=${legacyResourceOrder.indexOf(URLmapParams.resource)}` : '';
    let variable = URLcurrentVariable !== "7-Day Average Daily New Confirmed Count" ? `&var=${legacyVariableOrder[URLcurrentData].indexOf(URLcurrentVariable)}` : '';
    let method = URLmapParams.mapType !== 'natural_breaks' ? `&mthd=${URLmapParams.mapType}` : '';
    let source = URLcurrentData !== 'county_usfacts.geojson' ? `&src=${legacySourceOrder.indexOf(URLcurrentData)}` : '';
    let coords = `?lat=${Math.round(URLviewState.latitude*1000)/1000}&lon=${Math.round(URLviewState.longitude*1000)/1000}&z=${Math.round(URLviewState.zoom*10)/10}`;
    let date =  '' //`&dt=${selectedDate}`;
    let cartogram = URLmapParams.vizType === "cartogram" ? `&cartogram=true` : '';
  
    return `${coords}${overlay}${resource}${variable}${method}${source}${date}${cartogram}&v=1`
}

export default getURLParams;