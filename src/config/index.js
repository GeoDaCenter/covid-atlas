export const colorScales = {
    'natural_breaks': [
        [240,240,240],
        [255,255,204],
        [255,237,160],
        [254,217,118],
        [254,178,76],
        [253,141,60],
        [252,78,42],
        [227,26,28],
        [177,0,38],
    ],
    'lisa': [
        [255,255,255],
        [255,0,0],
        [0,0,255],
        [167, 173, 249],
        [244, 173, 168],
        // [70, 70, 70],
        // [153, 153, 153]
    ],
    'hinge15_breaks': [
        [1, 102, 94],
        [90, 180, 172],
        [199, 234, 229],
        [246, 232, 195],
        [216, 179, 101],
        [140, 81, 10],
    ],    
    'uninsured':[
        [240,240,240],
        [247,252,253],
        [224,236,244],
        [191,211,230],
        [158,188,218],
        [140,150,198],
        [140,107,177],
        [136,65,157],
        [129,15,124],
        // [77,0,75],
      ],
    'over65':[
        [240,240,240],
        [247,252,240],
        [224,243,219],
        [204,235,197],
        [168,221,181],
        [123,204,196],
        [78,179,211],
        [43,140,190],
        [8,104,172],
        // [8,64,129],
    ],
    'lifeExp':[
        [240,240,240],
        [247,252,240],
        [224,243,219],
        [204,235,197],
        [168,221,181],
        [123,204,196],
        [78,179,211],
        [43,140,190],
        [8,104,172],
        // [8,64,129],
    ],
    'forecasting': [
        [239, 239, 239],
        [254,232,200],
        [253,187,132],
        [227,74,51],
    ],
    'testing' : [
        [240,240,240],
        [13,8,135],
        [92,1,166],
        [156,23,158],
        [203,70,121],
        [237,121,83],
        [253,180,47],
        [240,249,33],
      ],
      'testingCap':[
        [240,240,240],
        [247,251,255],
        [222,235,247],
        [198,219,239],
        [158,202,225],
        [107,174,214],
        [66,146,198],
        [33,113,181],
        [8,81,156],
        [8,48,107],
      ],
}

export const fixedScales = {
    'testing': {
        bins: ['No Data','<3%','5%','10%','15%','20%','>25%'],
        breaks:[0,.03,.05,.10,.15,.20,.25,Math.pow(10, 12)]
    },
    'testingCap': {
        bins: ['No Data','<50','100','150','200','250','300','350','>400'],
        breaks:[0,50,100,150,200,250,300,350,400,Math.pow(10, 12)]
    },
    'lisa':{
        bins: ["Not significant", "High-High", "Low-Low", "Low-High", "High-Low"] //"Undefined", "Isolated"
    },
    'forecasting': {
        bins: ['N/A','Low', 'Medium', 'High'],
        breaks:[1,2,3,4]

    }
}

export const defaultData = 'county_usfacts.geojson';

export const dataPresets = {
    'county_usfacts.geojson': {
        plainName: 'USA Facts County',
        geojson: 'county_usfacts.geojson', 
        csvs: ['covid_confirmed_usafacts','covid_deaths_usafacts', 'berkeley_predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'], 
        joinCols: ['GEOID', ['FIPS','fips','countyFIPS']], 
        tableNames: ['cases','deaths', 'predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'],
        accumulate: []
    },
    'county_1p3a.geojson': {
        plainName: '1Point3Acres County',
        geojson: 'county_1p3a.geojson', 
        csvs: ['covid_confirmed_1p3a','covid_deaths_1p3a', 'berkeley_predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'], 
        joinCols: ['GEOID', ['FIPS','fips','countyFIPS', 'GEOID']], 
        tableNames: ['cases','deaths', 'predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'],
        accumulate: ['covid_confirmed_1p3a','covid_deaths_1p3a']
    },
    'county_nyt.geojson': {
        plainName: 'New York Times County',
        geojson: 'county_nyt.geojson', 
        csvs: ['covid_confirmed_nyt', 'covid_deaths_nyt', 'berkeley_predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'], 
        joinCols: ['GEOID', ['FIPS','fips','countyFIPS']], 
        tableNames: ['cases', 'deaths', 'predictions', 'chr_health_context', 'chr_life', 'chr_health_factors'],
        accumulate: []
    },
    'state_usafacts.geojson': {
        plainName: 'USA Facts State',
        geojson: 'state_usafacts.geojson', 
        csvs: ['covid_confirmed_usafacts_state','covid_deaths_usafacts_state', 'chr_health_context_state', 'chr_life_state', 'chr_health_factors_state', 'covid_testing_usafacts_state', 'covid_wk_pos_usafacts_state', 'covid_tcap_usafacts_state', 'covid_ccpt_usafacts_state'], 
        joinCols: ['GEOID', ['FIPS','fips','stateFIPS']], 
        tableNames: ['cases', 'deaths', 'chr_health_context', 'chr_life', 'chr_health_factors', 'testing', 'testing_wk_pos', 'testing_tcap', 'testing_ccpt'],
        accumulate: []
    } 
}

export const tooltipInfo = {
  Choropleth: <p>A thematic map used to represent data through various shading patterns on predetermined geographic areas (counties, state).</p>,
  NaturalBreaksFixed: <p>A nonlinear algorithm used to group observations such that the within-group homogeneity is maximized for the latest date, bins fixed over time</p>,
  NaturalBreaks: <p>A nonlinear algorithm used to group observations such that the within-group homogeneity is maximized for every day, bins change over time</p>,
  BoxMap: <p>Mapping counterpart of the idea behind a box plot</p>,
  Hotspot: <p>A map showing statisically significant spatial cluster and outlier locations, color coded by type.</p>,
  LocalMoran: <p>Local Moran used to identify local clusters and outliers</p>,
  NotSig:	<p>Area was not statistically signficant as a spatial cluster core or outlier using given parameters.</p>,
  HighHigh: <p>Hot Spot Cluster: area with high values, neighbored by areas with high values</p>,
  LowLow: <p>Cold Spot Cluster: area with low values, neighbored by areas with low values</p>,
  HighLow: <p>Hot Outlier: area with high values, neighbored by areas with low values</p>,
  LowHigh: <p>Low-High	Cold Outlier: area with low values, neighbored by areas with high values</p>,
  PovChldPrc: <p>Percentage of children under age 18 living in poverty</p>,
  IncRt: <p>Ratio of household income at the 80th percentile to income at the 20th percentile</p>,
  MedianHouseholdIncome: <p>The income where half of households in a county earn more and half of households earn less</p>,
  FdInsPrc: <p>Percentage of population who lack adequate access to food</p>,
  UnEmplyPrc: <p>Percentage of population age 16 and older unemployed but seeking work</p>,
  UnInPrc: <p>Percentage of people under age 65 without insurance</p>,
  PrmPhysRt: <p>Ratio of population to primary care physicians</p>,
  PrevHospRt: <p>Rate of hospital stays for ambulatory-care sensitive conditions per 100,000 Medicare enrollees</p>,
  RsiSgrBlckRt: <p>Index of dissimilarity where higher values indicate greater residential segregation between Black and White county residents</p>,
  SvrHsngPrbRt: <p>Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, lack of kitchen facilities, or lack of plumbing facilities</p>,
  Over65YearsPrc: <p>Percentage of people ages 65 and older</p>,
  AdObPrc: <p>Percentage of the adult population (age 20 and older) that reports a body mass index (BMI) greater than or equal to 30 kg/m2</p>,
  AdDibPrc: <p>Percentage of adults aged 20 and above with diagnosed diabetes</p>,
  SmkPrc: <p>Percentage of adults who are current smokers</p>,
  ExcDrkPrc: <p>Percentage of adults reporting binge or heavy drinking</p>,
  DrOverdMrtRt: <p>Number of drug poisoning deaths per 100,000 population</p>,
  LfExpRt: <p>Average number of years a person can expect to live</p>,
  SlfHlthPrc: <p>Percentage of adults reporting fair or poor health</p>,
  SeverityIndex: <p>Indicates the severity of the local covid-19 outbreak, based on cumulative and predicted deaths</p>,
  PredictedDeaths: <p>Predicted number of deaths for a county</p>,
  PredictedDeathsInterval: <p>Margin of error for predicted death counts for a county </p>,
  healthfactor:<p>Health factors represent those things we can modify to improve community conditions and the length and quality of life for residents</p>,
  healthcontext: <p>Community Health Context reflects the existing health behaviors and demographics of individuals in the community that are influenced by the opportunities to live long and well</p>,
  healthlife:<p>Length and Quality of Life reflects the physical and mental well-being of residents within a community through measures representing how long and how well residents live</p>,
  Hypersegregated: <p>American metropolitan areas where black residents experience hypersegregation, see <a href="https://www.princeton.edu/news/2015/05/18/hypersegregated-cities-face-tough-road-change" target="_blank" rel="noopener noreferrer">here</a></p>,
  BlackBelt: <p>Southern US counties that were at least 40% Black or African American in the 2000 Census, see <a href="https://en.wikipedia.org/wiki/Black_Belt_in_the_American_South" target="_blank" rel="noopener noreferrer">here</a></p>,
  TestingCapacity: <p>New screening (e.g., antigen) and diagnostic (e.g., PCR) testing per capita rates by date. The suggested threshold is >150 daily tests per 100k people.</p>,
  USCongress: <p>Find your representative <a href="https://www.govtrack.us/" target="_blank" rel="noopener noreferrer">here</a></p>,
};

export const legacyVariableOrder = {
    'state_usafacts.geojson': [
        'Confirmed Count',
        'Confirmed Count per 100K Population',
        'Confirmed Count per Licensed Bed',
        'Death Count',
        'Death Count per 100K Population',
        'Death Count/Confirmed Count',
        'Daily New Confirmed Count',
        'Daily New Confirmed Count per 100K Pop',
        '7-Day Average Daily New Confirmed Count',
        '7-Day Average Daily New Confirmed Count per 100K Pop',
        'Daily New Death Count',
        'Daily New Death Count per 100K Pop',
        'Forecasting (5-Day Severity Index)',
        '7 Day Testing Positivity Rate %',
        '7 Day Testing Capacity',
        '7 Day Confirmed Cases per Testing %',
    ],      
    'county_1p3a.geojson': [
        'Confirmed Count',
        'Confirmed Count per 100K Population',
        'Confirmed Count per Licensed Bed',
        'Death Count',
        'Death Count per 100K Population',
        'Death Count/Confirmed Count',
        'Daily New Confirmed Count',
        'Daily New Confirmed Count per 100K Pop',
        '7-Day Average Daily New Confirmed Count',
        '7-Day Average Daily New Confirmed Count per 100K Pop',
        'Daily New Death Count',
        'Daily New Death Count per 100K Pop',
        'Forecasting (5-Day Severity Index)',
        'Uninsured % (Community Health Factor)',
        'Over 65 Years % (Community Health Context)',
        'Life expectancy (Length and Quality of Life)'
    ],
    'county_usfacts.geojson': [
        'Confirmed Count',
        'Confirmed Count per 100K Population',
        'Confirmed Count per Licensed Bed',
        'Death Count',
        'Death Count per 100K Population',
        'Death Count/Confirmed Count',
        'Daily New Confirmed Count',
        'Daily New Confirmed Count per 100K Pop',
        '7-Day Average Daily New Confirmed Count',
        '7-Day Average Daily New Confirmed Count per 100K Pop',
        'Daily New Death Count',
        'Daily New Death Count per 100K Pop',
        'Forecasting (5-Day Severity Index)',
        'Uninsured % (Community Health Factor)',
        'Over 65 Years % (Community Health Context)',
        'Life expectancy (Length and Quality of Life)'
    ]
}

export const legacyOverlayOrder = [
    'native_american_reservations',
    'segregated_cities',
    'blackbelt',
    'uscongressional_districts'
]

export const legacyResourceOrder = [
  'clinic',
  'hospital',
  'clinic-hospitals'
]

export const legacySourceOrder = [
    'county_usfacts.geojson', 
    'county_1p3a.geojson', 
    'state_usafacts.geojson'
]