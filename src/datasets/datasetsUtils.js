import papaparse from 'papaparse';

export async function fetchUsafactsCountiesDataset(options) {
  const { url, countType } = options;

  const response = await fetch(url);
  const text = await response.text();

  // parse csv
  const parseResults = papaparse.parse(text, { header: true });
  const counties = parseResults.data;
  
  // tidy and index by county fips
  const countiesHandled = tidyUsafactsCounties(counties, countType);

  return countiesHandled;
}

/*
 * this takes the objects parsed from a usafacts csv file and cleans them up
 * so they can be merged and put into state. the general structure is:
 * county fips id => {
 *  snapshot date (in iso-8601 format) => {
 *    cases: <int>,
 *    deaths: <int>
 *  }
 * }
*/
export function tidyUsafactsCounties(counties = [], countType) {
  const countiesTidied = {};

  // make sure we have at least one county
  if (counties.length === 0) {
    return countiesTidied;
  }

  // cache dates
  const firstCounty = counties[0];
  const countyKeys = Object.keys(firstCounty);
  const snapshotDates = countyKeys.filter((countyKey) => {
    return countyKey.match(/\d+\/\d+\/\d+/);
  });

  // cache a map of dates => iso dates
  const snapshotDatesIso = snapshotDates.reduce((acc, snapshotDate) => {
    const snapshotDateObj = new Date(Date.parse(snapshotDate));
    const snapshotDateIso = snapshotDateObj.toISOString();
    acc[snapshotDate] = snapshotDateIso;
    
    return acc;
  }, {});

  counties.forEach((county) => {
    const fips = county.countyFIPS;

    const snapshotsTidied = {};

    snapshotDates.forEach((snapshotDate) => {
      const snapshotDateIso = snapshotDatesIso[snapshotDate];

      snapshotsTidied[snapshotDateIso] = {
        [countType]: county[snapshotDate],
      };
    });

    countiesTidied[fips] = snapshotsTidied;
  });

  return countiesTidied;
}
