const getDataForCharts = (data, table, startIndex, dates, name=null) => {
    let features = Object.keys(data);
    let n = startIndex;
    let rtn = []
    let j = -7;

    let countCol;
    let sumCol;
    
    if (name===null) {
        countCol = 'count'
        sumCol = 'sum'
    } else {
        countCol = name + ' Daily Count'
        sumCol = name + ' Total Cases'
    }
    
    while (n<data[features[0]][table].length) {
        let tempObj = {};
        let sum = 0;
        let i = 0;

        while (i<features.length) {
            if (data[features[i]][table]!== undefined) sum += data[features[i]][table][n]
            // tempObj[`n${i}`] = data[features[i]][table][n]
            i++;
        }
        tempObj[sumCol] = sum
        // dates[n-startIndex]
        tempObj.date = dates[n-startIndex]
        if (j<0) {
            tempObj[countCol] = sum
        } else {
            tempObj[countCol] = (sum - rtn[j][sumCol])/7
        }
        rtn.push(tempObj);
        n++;
        j++;
    }
    
    return rtn;

}

export default getDataForCharts