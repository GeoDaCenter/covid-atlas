const getDataForCharts = (data, table, startIndex, dates) => {
    let features = Object.keys(data);
    let n = startIndex;
    let rtn = []
    let j = -7;

    while (n<data[features[0]][table].length) {
        let tempObj = {};
        let sum = 0;
        let i = 0;

        while (i<features.length) {
            if (data[features[i]][table]!== undefined) sum += data[features[i]][table][n]
            // tempObj[`n${i}`] = data[features[i]][table][n]
            i++;
        }
        tempObj.count = sum
        // dates[n-startIndex]
        tempObj.date = dates[n-startIndex]
        if (j<0) {
            tempObj.dailyNew = sum
        } else {
            tempObj.dailyNew = (sum - rtn[j].count)/7
        }
        rtn.push(tempObj);
        n++;
        j++;
    }
    
    return rtn;

}

export default getDataForCharts