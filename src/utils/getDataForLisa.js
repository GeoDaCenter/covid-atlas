// import dataFn from './dataFunction';

// this function loops through the current data set and provides data for GeodaJS to create custom breaks 
const getDataForLisa = (tableData, dataParams, order) => {
    let t0 = performance.now() // logging performance

    const dataFn = (numeratorData, denominatorData, dataParams)  => {
        const { 
          nProperty, nIndex, nRange,
          dProperty, dIndex, dRange, 
          scale
        } = dataParams;
      
        if (numeratorData === undefined) {
          return 0;
        } else if (dProperty===null&&nRange===null){ // whole count or number -- no range, no normalization
          return (numeratorData[nProperty]||numeratorData[nIndex])*scale
        } else if (dProperty===null&&nRange!==null){ // range number, daily or weekly count -- no normalization
          return (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange*scale
        } else if (dProperty!==null&&nRange===null){ // whole count or number normalized -- no range
          return (numeratorData[nProperty]||numeratorData[nIndex])/(denominatorData[dProperty]||denominatorData[dIndex])*scale
        } else if (dProperty!==null&&nRange!==null&&dRange===null){ // range number, daily or weekly count, normalized to a single value
          return (
            (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)/(denominatorData[dProperty]||denominatorData[dIndex]
              )*scale
        } else if (dProperty!==null&&nRange!==null&&dRange!==null){ // range number, daily or weekly count, normalized to a range number, daily or weekly count
          return (
            (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)
            /
            ((denominatorData[dIndex]-denominatorData[dIndex-nRange])/nRange)
            *scale
        } else {      
          return 0;
        }
      }
    
    const { numerator, nType, nProperty, nIndex, nRange, denominator, dType, 
        dProperty, dIndex, dRange, scale} = dataParams;

    // declare empty array for return variables
    let tempDict = {};

    // length of data table to loop through
    let n = tableData.length;

    // this checks if the bins generated should be dynamic (generating for each date) or fixed (to the most recent date)
    if (nIndex === null && nProperty === null) {
        // if fixed, get the most recent date
        let tempNIndex = tableData[0][denominator].length-1;
        
        // if the denominator is time series data (eg. deaths / cases this week), make the indices the same (most recent)
        let tempDIndex = dType === 'time-series' ? tableData[0][denominator].length-1 : dIndex;

        // loop through, do appropriate calculation. add returned value to rtn array
        while (n>0) {
            n--;
            tempDict[tableData[n].properties.GEOID] = dataFn(tableData[n][numerator], tableData[n][denominator], {...dataParams, nIndex:tempNIndex, dIndex: tempDIndex})
        }
    } else {
       while (n>0) {
            n--;
            tempDict[tableData[n].properties.GEOID] = dataFn(tableData[n][numerator], tableData[n][denominator], dataParams)
        }
    }
    
    let rtn = [];

    n = 0;
    let keys = Object.keys(order)
    while (n<keys.length) {
        rtn.push(tempDict[order[keys[n]]]);
        n++;
    }

    console.log(performance.now() - t0);

    return rtn;
    
}
export default getDataForLisa