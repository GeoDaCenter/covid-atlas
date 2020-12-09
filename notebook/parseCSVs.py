import pandas as pd
from glob import glob
from datetime import datetime

# check if date format fits either standard format
def validate(strDate):
    if strDate.count('/') == 2 or strDate.count('-') == 2:
        return True
    else:
        return False


def parseCSV(currFile):
    # read in CSV
    raw = pd.read_csv(currFile)
    
    # declare lists for info columns (eg GEOID, population)
    # and date columns (eg 1/1/1970)
    infoCols = []
    dateCols = []

    # loop through columns, sort into date and non-date
    for column in raw.columns:
        if validate(column) == True:
            dateCols.append(column)
        else:
            infoCols.append(column)

    # sort date columns by, well, date
    dateCols.sort(key=lambda date: datetime.strptime(date, "%m/%d/%y"))

    # pull in info columns
    newDf = pd.DataFrame(raw[infoCols])

    # add date columns in chronological order
    newDf[dateCols] = raw[dateCols]

    # export!
    exportPath = 'csv/' + currFile.split('/')[-1]
    newDf.to_csv(exportPath, index=False)


### GO! ###

if __name__ == "__main__":
    fileList = glob('../public/csv/*_usafacts_state.csv')

    for file in fileList:
        parseCSV(file)