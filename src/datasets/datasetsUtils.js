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
export function tidyUsafactsCounties(counties, countType) {
  const countiesTidied = {};

  counties.forEach((county) => {
    const {
      // these aren't used, just assigned to plucked off the snapshots spread
      'County Name': countyName,
      State,
      stateFIPS,
      // these are used
      countyFIPS: fips,
      ...caseSnapshots
    } = county;
    const snapshots = {};

    // convert dates (m-d-yy) to iso dates
    Object.keys(caseSnapshots).forEach((caseSnapshotDateStr) => {
      const caseSnapshotDate = new Date(Date.parse(caseSnapshotDateStr));
      const caseSnapshotDateIso = caseSnapshotDate.toISOString();
      snapshots[caseSnapshotDateIso] = {
        [countType]: caseSnapshots[caseSnapshotDateStr],
      };
    });

    countiesTidied[fips] = snapshots;
  });

  return countiesTidied;
}
