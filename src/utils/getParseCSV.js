import * as d3 from 'd3-dsv';
import { findDates } from '../utils';

async function getParseCSV(url, joinCol, accumulate){
    const tempData = await fetch(url)
      .then(response => {
        return response.ok ? response.text() : Promise.reject(response.status);
      }).then(text => {
        let data = d3.csvParse(text, d3.autoType)
        let rtn = {};
        let n = data.length;
        let selectedJoinColumn;
        
        joinCol.forEach(colOption => {
          if (data[0].hasOwnProperty(colOption)) selectedJoinColumn = colOption;
        })

        if (accumulate) {
          let indexStart = findDates(Object.keys(data[0]))[1]
          while (n>0){
            n--;
            let vals = Object.values(data[n])
            let tempArr = [];
            let i = indexStart;
            let j = 0;
            while (i<vals.length) {
              if (i===indexStart) {
                tempArr.push(vals[i])
              } else {
                tempArr.push(vals[i]+tempArr[j])
                j++;
              }
              i++;
            }
            for (let i = 0; i < indexStart; i++) {
              tempArr.unshift(vals[i])
            }
            rtn[data[n][selectedJoinColumn]] = tempArr
          }
        } else {
          while (n>0){
            n--;
            rtn[data[n][selectedJoinColumn]] = Object.values(data[n])
          }
        }
        return [rtn, Object.keys(data[0])]
      });
    return tempData;
}

export default getParseCSV