import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {fromJS} from 'immutable';
import {find} from 'lodash';

import DeckGL from '@deck.gl/react';
import {MapView, _GlobeView as GlobeView, FlyToInterpolator} from '@deck.gl/core';
import { GeoJsonLayer, PolygonLayer, ScatterplotLayer,  IconLayer, TextLayer, LineLayer } from '@deck.gl/layers';
import {fitBounds} from '@math.gl/web-mercator';
// import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
// import {IcoSphereGeometry} from '@luma.gl/engine';

import ReactMapGL, {NavigationControl, GeolocateControl } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder'

import { MapTooltipContent } from '../components';
import { colorScales } from '../config';
import { setDataSidebar, setMapParams, setMapLoaded, setPanelState, setChartData } from '../actions';
import { mapFn, dataFn, getVarId, getCSV, getCartogramCenter, getDataForCharts, parseMobilityData, getURLParams } from '../utils';
import MAP_STYLE from '../config/style.json';

// const cartoGeom = new IcoSphereGeometry({
//   iterations: 1
// });
const bounds = fitBounds({
    width: window.innerWidth,
    height: window.innerHeight,
    bounds: [[-130.14, 53.96],[-67.12, 19]]
})

const ICON_MAPPING = {
    hospital: {x: 0, y: 0, width: 128, height: 128},
    clinic: {x: 128, y: 0, width: 128, height: 128},
  };

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGl4dW45MTAiLCJhIjoiY2locXMxcWFqMDAwenQ0bTFhaTZmbnRwaiJ9.VRNeNnyb96Eo-CorkJmIqg';

const defaultMapStyle = fromJS(MAP_STYLE);

const MapContainer = styled.div`
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background:#1a1a1a;
    @media (max-width:600px) {
        div.mapboxgl-ctrl-geocoder {
            display:none;
        }
    }
`

const HoverDiv = styled.div`
    background:#2b2b2b;
    padding:20px;
    color:white;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.7);
    border-radius:0.5vh 0.5vh 0 0;
    transition:0s all;
    h3 {
        margin:2px 0;
    }
`;

const NavInlineButton = styled.button`
    width:29px;
    height:29px;
    padding:5px;
    margin-bottom:10px;
    display:block;
    background-color: ${props => props.isActive ? '#C1EBEB' : '#f5f5f5'};
    -moz-box-shadow: 0 0 2px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 0 2px rgba(0,0,0,.1);
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    border-radius: 4px;
    outline:none;
    border:none;
    transition:250ms all;
    cursor:pointer;
    &:last-of-type {
        margin-top:10px;
    }
    :after {
        opacity: ${props => props.shareNotification ? 1 : 0};
        content:'Map Link Copied to Clipboard!';
        background:#f5f5f5;
        -moz-box-shadow: 0 0 2px rgba(0,0,0,.1);
        -webkit-box-shadow: 0 0 2px rgba(0,0,0,.1);
        box-shadow: 0 0 0 2px rgba(0,0,0,.1);
        border-radius: 4px;
        position: absolute;
        transform:translate(-120%, -25%);
        padding:5px;
        width:150px;
        pointer-events:none;
        max-width:50vw;
        transition:250ms all;
    }
`

const NavBarBacking = styled.div`
    width:100%;
    height:50px;
    position:absolute;
    top:0;
    left:0;
    background:#2b2b2b;
    -moz-box-shadow: 0 0 2px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 0 2px rgba(0,0,0,.1);
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
`

const MapGeocoder = styled(Geocoder)`
    @media (max-width:600px) {
        display:none !important;
    }
`

const MapButtonContainer = styled.div`
    position: absolute;
    right: ${props => props.infoPanel ? 317 : 10}px;
    bottom: 30px;
    zIndex: 10;
    transition: 250ms all;
    @media (max-width:768px) {
        bottom:100px;
    }
    @media (max-width: 400px) {
        transform:scale(0.75) translate(20%, 20%);
    }
`

const ShareURL = styled.input`
    position:fixed;
    left:110%;
`

const viewGlobe = new GlobeView({id: 'globe', controller: false, resolution:1});
const view = new MapView({repeat: true});

const Map = () => { 

    const { storedData, storedGeojson, currentData, storedLisaData,
        storedCartogramData, storedMobilityData, panelState, dates, dataParams, mapParams,
        currentVariable, startDateIndex, urlParams } = useSelector(state => state);

    const [hoverInfo, setHoverInfo] = useState(false);
    const [highlightGeog, setHighlightGeog] = useState(false);
    const [globalMap, setGlobalMap] = useState(false);
    const [mapStyle, setMapStyle] = useState(defaultMapStyle);
    const [currLisaData, setCurrLisaData] = useState({})
    const [viewState, setViewState] = useState({
        latitude: +urlParams.lat || bounds.latitude,
        longitude: +urlParams.lon || bounds.longitude,
        zoom: +urlParams.z || bounds.zoom,
        bearing:0,
        pitch:0
    })
    const [cartogramData, setCartogramData] = useState([]);
    const [currVarId, setCurrVarId] = useState(null);
    const [hospitalData, setHospitalData] = useState(null);
    const [clinicData, setClinicData] = useState(null);
    const [storedCenter, setStoredCenter] = useState(null);
    const [shared, setShared] = useState(false);
    // const [mobilityData, setMobilityData] = useState([]);
    
    const dispatch = useDispatch();

    useEffect(() => {
        let arr = [];
        if (storedData[currentData] && mapParams.vizType === 'cartogram') {
            for (let i=0; i<storedData[currentData].length; i++) {
                arr.push({id:i})
            }
        }
        setCartogramData(arr)
    }, [storedData, mapParams.vizType])

    useEffect(() => {
        setCurrVarId(getVarId(currentData, dataParams))
    }, [dataParams, mapParams])


    useEffect(() => {
        switch(mapParams.vizType) {
            case '2D': 
                setViewState(view => ({
                    ...view,
                    latitude: +urlParams.lat || bounds.latitude,
                    longitude: +urlParams.lon || bounds.longitude,
                    zoom: +urlParams.z || bounds.zoom,
                    bearing:0,
                    pitch:0
                }));
                setStoredCenter(null)
                break
            case '3D':
                setViewState(view => ({
                    ...view,
                    latitude: +urlParams.lat || bounds.latitude,
                    longitude: +urlParams.lon || bounds.longitude,
                    zoom: +urlParams.z || bounds.zoom,
                    bearing:-30,
                    pitch:30
                }));
                setStoredCenter(null)
                break
            // case 'cartogram':
            //     useCallback(() => {
            //         let center = getCartogramCenter(storedCartogramData[getVarId(currentData, dataParams)])
            //         setViewState(view => ({
            //             ...view,
            //             latitude: center[1],
            //             longitude: center[0],
            //             zoom: 5,
            //             bearing:0,
            //             pitch:0
            //         }));
            //     }, [cartogramData])
            //     break
            default:
                //
        }
    }, [mapParams.vizType, currentData])

    useEffect(() => {
        let tempData = storedLisaData[getVarId(currentData, dataParams)]
        if (tempData !== undefined) setCurrLisaData(tempData);
    }, [storedLisaData, dataParams, mapParams])

    useEffect(() => {
        const defaultLayers = defaultMapStyle.get('layers');
        let tempLayers;

        if (mapParams.vizType === 'cartogram') {
            tempLayers = defaultLayers.map(layer => {
                return layer.setIn(['layout', 'visibility'], 'none');
            });
        } else if (mapParams.vizType === '3D') {
            tempLayers = defaultLayers.map(layer => {
                if (layer.get('id').includes('label')) return layer;
                return layer.setIn(['layout', 'visibility'], 'none');
            });
        } else {
            tempLayers = defaultLayers.map(layer => {
                if (mapParams.resource.includes(layer.get('id')) || mapParams.overlay.includes(layer.get('id'))) {
                    return layer.setIn(['layout', 'visibility'], 'visible');
                } else {
                    return layer;
                }
            });
        }
        setMapStyle(defaultMapStyle.set('layers', tempLayers));

    }, [mapParams.overlay, mapParams.vizType])

    useEffect(() => {
        if (hospitalData === null) {
            getCSV('https://raw.githubusercontent.com/covidcaremap/covid19-healthsystemcapacity/master/data/published/us_healthcare_capacity-facility-CovidCareMap.csv')
            .then(values => setHospitalData(values))
        }

        if (clinicData === null) {
            getCSV(`${process.env.PUBLIC_URL}/csv/health_centers.csv`)
            .then(values => setClinicData(values))
        }
    },[])

    useEffect(() => {
        if (storedCartogramData[getVarId(currentData, dataParams)]){
            let center = getCartogramCenter(storedCartogramData[getVarId(currentData, dataParams)])
            let roundedCenter = [Math.floor(center[0]),Math.floor(center[1])]
            if (storedCenter === null || roundedCenter[0] !== storedCenter[0]) {
                setViewState(view => ({
                    ...view,
                    latitude: center[1],
                    longitude: center[0],
                    zoom: 5,
                    bearing:0,
                    pitch:0
                }));
                setStoredCenter(roundedCenter)
            }
        }
    }, [storedCartogramData])

    useEffect(() => {
        setViewState(view => ({
            ...view,
            latitude: +urlParams.lat || bounds.latitude,
            longitude: +urlParams.lon || bounds.longitude,
            zoom: +urlParams.z || bounds.zoom,
            bearing:0,
            pitch:0
        }));
    }, [urlParams])

    const mapRef = useRef();
    
    const GetFillColor = (f, bins, mapType) => {
        if (!bins.hasOwnProperty("bins")) {
            return [0,0,0]
        } else if (mapType === 'lisa') {
            return colorScales.lisa[currLisaData[storedGeojson[currentData]['geoidOrder'][f.properties.GEOID]]]
        } else {
            return mapFn(dataFn(f[dataParams.numerator], f[dataParams.denominator], dataParams), bins.breaks, mapParams.colorScale, mapParams.mapType) 
        }
    }
    
    const GetHeight = (f, bins) => bins.hasOwnProperty("bins") ? dataFn(f[dataParams.numerator], f[dataParams.denominator], dataParams)*(dataParams.scale3D/((dataParams.nType === "time-series" && dataParams.nRange === null) ? (dataParams.nIndex-startDateIndex)/10 : 1)) : 0
    
    const handle3dButton = (using3d) => {
        if (using3d) {
            dispatch(setMapParams({vizType: '2D'}))
            setViewState(view => ({
                ...view,
                bearing:0,
                pitch:0,
                zoom: 3.5,
                transitionInterpolator: new FlyToInterpolator(),
                transitionDuration: 250,
            }))
        } else {
            dispatch(setMapParams({vizType: '3D'}))
            setViewState(view => ({
                ...view,
                bearing:-30,
                pitch:45,
                zoom: 3.5,
                transitionInterpolator: new FlyToInterpolator(),
                transitionDuration: 250,
            }))
        }
    }
    
    const handleGeolocate = (viewState) => {
        setViewState(view => ({
            ...view,
            latitude: viewState.coords.latitude,
            longitude: viewState.coords.longitude,
            zoom: 8,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 250,
        }))
    }

    const getCartogramFillColor = (val, id, bins, mapType) => {
        
        if (!bins.hasOwnProperty("bins")) {
            return [0,0,0]
        } else if (mapType === 'lisa') {
            return colorScales.lisa[currLisaData[id]]
        } else {
            return mapFn(val, bins.breaks, mapParams.colorScale, mapParams.mapType) 
        }
    }
    const Layers = [
        new GeoJsonLayer({
            id: 'choropleth',
            data: {
                "type": "FeatureCollection",
                "name": currentData,
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": storedData[currentData] ? storedData[currentData] : [],
            },
            visible: mapParams.vizType !== 'cartogram',
            pickable: mapParams.vizType !== 'cartogram',
            stroked: false,
            filled: true,
            wireframe: mapParams.vizType === '3D',
            extruded: mapParams.vizType === '3D',
            opacity: 0.8,
            material:false,
            getFillColor: f => GetFillColor(f, mapParams.bins, mapParams.mapType),
            getElevation: f => GetHeight(f, mapParams.bins, mapParams.mapType),
            // getLineColor: [255, 80, 80],
            // getLineWidth:50,
            // minLineWidth:20,
            // lineWidthScale: 20,
            updateTriggers: {
                data: currentData,
                pickable: mapParams.vizType,
                getFillColor: [dataParams, mapParams],
                getElevation: [dataParams, mapParams],
            },
            onHover: info => {
                try {
                    setHoverInfo(info)
                } catch {
                    setHoverInfo(null)
                }
            },
            onClick: info => {
                try {
                    dispatch(setDataSidebar(info.object));
                    setHighlightGeog(info.object.properties.GEOID);
                    dispatch(setChartData(getDataForCharts({data: info.object}, 'cases', startDateIndex, dates[currentData], info.object?.properties?.population/100000||1)));
                    // if (mapParams.overlay === "mobility-county") {
                    //     setMobilityData(parseMobilityData(info.object.properties.GEOID, storedMobilityData.flows[info.object.properties.GEOID], storedMobilityData.centroids));
                    // }
                } catch {}

            },
                // parameters: {
                //     depthTest: false
                // }
        }),
        new GeoJsonLayer({
            id: 'highlightLayer',
            data: {
                "type": "FeatureCollection",
                "name": currentData,
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": storedData[currentData] ? storedData[currentData] : [],
            },
            pickable: false,
            stroked: true,
            filled:false,
            getLineColor: f => (highlightGeog === f.properties.GEOID ? [255,255,255] : [255,255,255,0]), 
            lineWidthScale: 10,
            getLineWidth: 1,
            lineWidthMinPixels: 2,
            updateTriggers: {
                data: currentData,
                getLineColor: highlightGeog,
            },
        }),
        // new LineLayer({
        //     id: 'mobility flows',
        //     data: mobilityData,
        //     pickable: false,
        //     visible: mapParams.overlay === "mobility-county",
        //     widthUnits: 'meters',
        //     widthScale: 10000,
        //     getSourcePosition: d => [d[1],d[2]],
        //     getTargetPosition: d => [d[3],d[4]],
        //     getWidth: d => d[5] < 10 ? d[5] : 0,
        //     updateTriggers: {
        //         data: [mobilityData],
        //         visible: [mapParams.overlay]
        //     }
        // }),
        new IconLayer({
            id: 'hospital-layer',
            data: hospitalData,
            pickable:true,
            visible: mapParams.resource.includes('hospital'),
            iconAtlas: `${process.env.PUBLIC_URL}/assets/img/icon_atlas.png`,
            iconMapping: ICON_MAPPING,
            getIcon: d => 'hospital',
            getPosition: d => [d.Longitude, d.Latitude],
            sizeUnits: 'meters',
            getSize: 20000,
            sizeMinPixels:12,
            sizeMaxPixels:24,
            updateTriggers: {
                data: hospitalData,
                visible: mapParams
            },
            onHover: info => {
                try {
                    setHoverInfo(info)
                } catch {
                    setHoverInfo(null)
                }
            },
        }),
        new IconLayer({
            id: 'clinics-layer',
            data: clinicData,
            pickable:true,
            visible: mapParams.resource.includes('clinic'),
            iconAtlas: `${process.env.PUBLIC_URL}/assets/img/icon_atlas.png`,
            iconMapping: ICON_MAPPING,
            getIcon: d => 'clinic',
            getSize: 20000,
            getPosition: d => [d.lon, d.lat],
            sizeUnits: 'meters',
            sizeMinPixels:7,
            sizeMaxPixels:20,
            updateTriggers: {
                data: clinicData,
                visible: mapParams
            },
            onHover: info => {
                try {
                    setHoverInfo(info)
                } catch {
                    setHoverInfo(null)
                }
            },
        }),
        new PolygonLayer({
            id: 'background',
            data: [
                // prettier-ignore
                [[-180, 90], [0, 90], [180, 90], [180, -90], [0, -90], [-180, -90]]
            ],
            opacity: 1,
            getPolygon: d => d,
            stroked: false,
            filled: true,
            visible: mapParams.vizType === 'cartogram',
            getFillColor: [10,10,10],
            updateTriggers: {
                visible: mapParams.vizType
            }
        }),
        new ScatterplotLayer({
            id: 'cartogram layer',
            data: cartogramData,
            pickable:true,
            visible: mapParams.vizType === 'cartogram',
            getPosition: f => {
                try {
                    return storedCartogramData[currVarId][f.id].position;
                } catch {
                    return [0,0];
                }
            },
            getFillColor: f => {
                try {
                    return getCartogramFillColor(storedCartogramData[currVarId][f.id].value, f.id, mapParams.bins, mapParams.mapType);
                } catch {
                    return [0,0,0];
                }
            },
            getRadius: f => {
                try {
                    return storedCartogramData[currVarId][f.id].radius*10;
                } catch {
                    return 0;
                }
            },
            // transitions: {
            //     getPosition: 1,
            //     getFillColor: 1,
            //     getRadius: 1
            // },   
            onHover: f => {
                try {
                    setHoverInfo(
                        {
                            ...f,
                            object: find(storedData[currentData], o => o.properties.GEOID === storedGeojson[currentData]['indexOrder'][f.object?.id]),
                        }
                    )
                } catch {
                    setHoverInfo(null)
                }
            },
            updateTriggers: {
                getPosition: [cartogramData, mapParams, dataParams, currVarId],
                getFillColor: [cartogramData, mapParams, dataParams, currVarId],
                getRadius: [cartogramData, mapParams, dataParams, currVarId],
                visible: [cartogramData, mapParams, dataParams, currVarId]
            }
          }),
          new TextLayer({
            id: 'cartogram text layer',
            data: cartogramData,
            pickable:false,
            visible: mapParams.vizType === 'cartogram' && currentData.includes('state'),
            getPosition: f => {
                try {
                    return storedCartogramData[currVarId][f.id].position;
                } catch {
                    return [0,0];
                }
            },
            sizeUnits: 'meters',
            fontWeight: 'bold',
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            maxWidth: 500,
            wordBreak: 'break-word',
            getSize: f => {
                try {
                    return storedCartogramData[currVarId][f.id].radius*5;
                } catch {
                    return 0;
                }
            },
            getText: f => {
                try {
                    if (currentData.includes('state')) return find(storedData[currentData], o => +o.properties.GEOID == storedGeojson[currentData].indexOrder[f.id]).properties.NAME;
                    return '';
                } catch {
                    return '';
                }
            },
            updateTriggers: {
                getPosition: [cartogramData, mapParams, dataParams, currVarId],
                getFillColor: [cartogramData, mapParams, dataParams, currVarId],
                getSize: [cartogramData, mapParams, dataParams, currVarId],
                getRadius: [cartogramData, mapParams, dataParams, currVarId],
                visible: [cartogramData, mapParams, dataParams, currVarId]
            }
          }),
        // new SimpleMeshLayer({
        //     id: 'cartogram layer',
        //     data: cartogramData,
        //     // texture: 'texture.png',
        //     sizeScale:10,
        //     visible: mapParams.vizType === 'cartogram',
        //     mesh: cartoGeom,
        //     getPosition:f => getCartogramPosition(storedCartogramData[currVarId][f.id]),
        //     getColor: f => getCartogramFillColor(storedCartogramData[currVarId][f.id].value, mapParams.bins, mapParams.mapType),
        //     getScale: f => getCartogramScale(storedCartogramData[currVarId][f.id]),
        //     // getTranslation: f => getCartogramTranslation(storedCartogramData[currVarId][f.id]),
        //     transitions: {
        //         getPosition: 150,
        //         getColor: 150,
        //         getScale: 150,
        //         getTranslation: 150
        //     },   
        //     updateTriggers: {
        //         getPosition: [mapParams, dataParams, currVarId],
        //         getColor: [mapParams, dataParams, currVarId],
        //         getScale: [mapParams, dataParams, currVarId],
        //         getTranslation: [mapParams, dataParams, currVarId]
        //     }
        //   })
    ]

    const handlePanelButton = (panel) => panelState[panel] ? dispatch(setPanelState({[panel]: false})) : dispatch(setPanelState({[panel]: true}))

    const handleShare = async (params) => {
        const shareData = {
            title: 'The US Covid Atlas',
            text: 'Near Real-Time Exploration of the COVID-19 Pandemic.',
            url: `${window.location.href}${getURLParams(params)}`,
        }

        try {
            await navigator.share(shareData)
          } catch(err) {
            let copyText = document.querySelector("#share-url");
            copyText.value = `${shareData.url}`;
            copyText.style.display = 'block'
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            copyText.style.display = 'none';
            setShared(true)
            setTimeout(() => setShared(false), 5000);
        }
    }

    return (
        <MapContainer>
            <DeckGL
                initialViewState={viewState}
                controller={true}
                layers={Layers}
                views={globalMap ? viewGlobe : view} //enable this for globe view
            >
                <ReactMapGL
                    reuseMaps
                    ref={mapRef}
                    mapStyle={mapStyle} //{globalMap || mapParams.vizType === 'cartogram' ? 'mapbox://styles/lixun910/ckhtcdx4b0xyc19qzlt4b5c0d' : 'mapbox://styles/lixun910/ckhkoo8ix29s119ruodgwfxec'}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    // onViewportChange={viewState  => console.log(mapRef.current.props.viewState)} 
                    onLoad={() => {
                        dispatch(setMapLoaded(true))
                    }}
                    >
                        
                    <MapGeocoder 
                    mapRef={mapRef}
                    onViewportChange={viewState  => setViewState(viewState)} 
                    mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    position="top-right"
                    id="mapGeocoder"
                    style={{transform:'translateY(-5px)'}}
                    />
                    <NavBarBacking />
                        
                    <MapButtonContainer infoPanel={panelState.info}>
                        {/* <NavInlineButton
                            onClick={() => setGlobalMap(prev => !prev)}
                            isActive={globalMap}
                        >
                            <svg  x="0px" y="0px" viewBox="0 0 100 100" >
                                <g transform="translate(50 50) scale(0.69 0.69) rotate(0) translate(-50 -50)">
                                    <g>
                                        <path d="M50-21c-39.2,0-71,31.9-71,71c0,39.2,31.9,71,71,71c39.2,0,71-31.9,71-71C121,10.8,89.2-21,50-21z M50-10.9
                                            c1.7,0,3.7,0.9,6.1,3.5c2.4,2.7,4.9,7,7.1,12.5c2.1,5.4,3.8,12.1,5.1,19.4H31.7c1.2-7.4,3-14,5.1-19.4c2.1-5.6,4.7-9.9,7.1-12.5
                                            C46.3-10,48.3-10.9,50-10.9z M32-8.2c-1.7,2.9-3.3,6.1-4.7,9.7c-2.6,6.7-4.6,14.5-5.9,23.1H-5.3C1.8,9,15.4-3.1,32-8.2z M68-8.2
                                            C84.6-3.1,98.2,9,105.3,24.6H78.6C77.2,16,75.2,8.2,72.7,1.5C71.3-2.1,69.7-5.3,68-8.2z M-8.9,34.8h29.1c-0.4,4.9-0.7,10-0.7,15.2
                                            c0,5.2,0.2,10.3,0.7,15.2H-8.9c-1.3-4.9-2-10-2-15.2C-10.9,44.7-10.2,39.6-8.9,34.8z M30.5,34.8h39c0.5,4.9,0.8,9.9,0.8,15.2
                                            c0,5.3-0.3,10.3-0.8,15.2h-39c-0.5-4.9-0.8-9.9-0.8-15.2C29.7,44.7,30,39.7,30.5,34.8z M79.8,34.8h29.1c1.3,4.9,2,10,2,15.2
                                            c0,5.3-0.7,10.4-2,15.2H79.8c0.4-4.9,0.7-10,0.7-15.2C80.4,44.8,80.2,39.7,79.8,34.8z M-5.3,75.4h26.8c1.3,8.6,3.3,16.4,5.9,23.1
                                            c1.4,3.6,2.9,6.8,4.7,9.7C15.4,103.1,1.8,91-5.3,75.4z M31.7,75.4h36.5c-1.2,7.4-3,14-5.1,19.5c-2.1,5.6-4.7,9.9-7.1,12.5
                                            c-2.4,2.7-4.4,3.5-6.1,3.5s-3.7-0.9-6.1-3.5c-2.4-2.7-4.9-7-7.1-12.5C34.7,89.4,33,82.8,31.7,75.4z M78.6,75.4h26.8
                                            C98.2,91,84.6,103.1,68,108.2c1.7-2.9,3.3-6.1,4.7-9.7C75.2,91.8,77.2,84,78.6,75.4z"/>
                                    </g>
                                </g>
                            </svg>
                        </NavInlineButton> */}
                        {/* <NavInlineButton
                            onClick={() => console.log( getCartogramCenter(storedCartogramData[getVarId(currentData, dataParams)]))}
                            isActive={mapParams.use3d}
                        >
                            <svg x="0px" y="0px" viewBox="0 0 100 100">
                                <g transform="translate(50 50) scale(0.69 0.69) rotate(0) translate(-50 -50)">
                                    <path d="M109,23.7c0-1-0.2-1.9-0.7-2.8c-0.1-0.2-0.3-0.4-0.5-0.7c-0.4-0.6-0.8-1.1-1.3-1.5l0,0L54.1-20.5c-2.3-1.7-5.5-1.7-7.9,0
                                        L-6.2,18.8l0,0c-0.5,0.4-1,0.9-1.3,1.5C-7.7,20.5-7.8,20.7-8,21c-0.6,0.8-0.9,1.8-1,2.8v52.5c0,0,0,0,0,0.5c0.2,1.7,1,3.3,2.2,4.5
                                        v0.3l52.5,39.3l0.9,0.5l0.7,0.4c1.5,0.6,3.2,0.6,4.7,0l0.7-0.4l0.9-0.5l52.5-39.3v-0.3c1.3-1.2,2.1-2.8,2.2-4.5c0,0,0,0,0-0.5
                                        L109,23.7z M4.1,36.8l39.3,29.5v36.1L4.1,72.9V36.8z M56.6,66.3l39.3-29.5v36.1l-39.3,29.5V66.3z M50-7.4l41.5,31.1L50,54.9
                                        L8.5,23.7L50-7.4z"/>
                                </g>
                            </svg>
                        </NavInlineButton> */}
                        <NavInlineButton
                            title="Show Line Chart"
                            isActive={panelState.lineChart}
                            onClick={() => handlePanelButton('lineChart')}
                        >
                            <svg x="0px" y="0px" viewBox="0 0 100 100">
                                <g>
                                    <path d="M52.5,21.4c-1.9,0-3.6,1.3-4.1,3.1L37.9,63.7l-6.4-11.1c-1.2-2-3.7-2.7-5.7-1.5c-0.3,0.2-0.6,0.4-0.9,0.7
                                        L10.1,66.6c-1.7,1.6-1.7,4.2-0.2,5.9c1.6,1.7,4.2,1.7,5.9,0.2c0.1,0,0.1-0.1,0.1-0.1L27,61.5l8.7,15.1c1.2,2,3.7,2.7,5.7,1.5
                                        c0.9-0.6,1.6-1.5,1.9-2.5l9.1-33.9l4.6,17.2c0.6,2.2,2.9,3.5,5.1,2.9c1.1-0.3,2-1,2.5-1.9l10.4-18l8.9,9.4c1.6,1.7,4.2,1.8,5.9,0.3
                                        s1.8-4.2,0.3-5.9c0,0-0.1-0.1-0.1-0.1L77.3,32.1c-1.6-1.7-4.2-1.8-5.9-0.2c-0.3,0.3-0.6,0.6-0.8,1L62.5,47l-6-22.5
                                        C56,22.7,54.4,21.4,52.5,21.4L52.5,21.4z"/>
                                </g>
                            </svg>
                        </NavInlineButton>
                        <NavInlineButton
                            title="Show Tutorial"
                            isActive={panelState.tutorial}
                            onClick={() => handlePanelButton('tutorial')}
                        >
                            <svg viewBox="0 0 100 100" x="0px" y="0px">
                                <g>
                                    <path d="M 62.0763 27.4552 C 64.0258 25.642 65 23.4406 65 20.8589 C 65 18.2815 64.0258 16.0809 62.0763 14.2511 C 60.1273 12.4207 57.7859 11.5 55.0413 11.5 C 52.3076 11.5 49.9438 12.4207 47.9833 14.2511 C 46.0343 16.0809 45.0487 18.2815 45.0487 20.8589 C 45.0487 23.4406 46.0343 25.642 47.9833 27.4552 C 49.9438 29.2682 52.3076 30.178 55.0413 30.178 C 57.7859 30.178 60.1273 29.2682 62.0763 27.4552 ZM 57.5841 88.0802 C 61.1017 86.4348 62.9616 83.3419 61.1353 81.9274 C 60.0823 81.1132 58.7041 82.4604 57.6963 82.4604 C 55.5343 82.4604 54.0103 82.1065 53.1367 81.3939 C 52.2518 80.6754 51.8261 79.3446 51.8261 77.3796 C 51.8261 76.5942 51.9493 75.4433 52.2182 73.9213 C 52.487 72.395 52.8007 71.0302 53.1367 69.8404 L 57.3153 55.0418 C 57.7073 53.683 57.9988 52.1893 58.1554 50.5672 C 58.301 48.9276 58.3798 47.7935 58.3798 47.1533 C 58.3798 44.0378 57.2817 41.5004 55.0971 39.5465 C 52.9237 37.5991 49.8094 36.6159 45.7765 36.6159 C 43.5361 36.6159 41.1501 36.9472 38.652 37.8117 C 33.7564 39.5293 34.8432 43.7968 35.9296 43.7968 C 38.1364 43.7968 39.6152 44.1722 40.3995 44.9193 C 41.1837 45.6604 41.5868 46.9796 41.5868 48.8828 C 41.5868 49.9269 41.4413 51.1007 41.1947 52.3689 C 40.9369 53.6381 40.635 54.9909 40.2541 56.4111 L 36.053 71.2659 C 35.6947 72.8267 35.4253 74.2246 35.2463 75.4648 C 35.0784 76.7058 35 77.9187 35 79.1091 C 35 82.1578 36.12 84.6722 38.3716 86.6596 C 40.6238 88.6528 44.0854 90.5 48.1405 90.5 C 50.7731 90.5 54.537 89.518 57.5841 88.0802 Z">
                                    </path>
                                </g>
                            </svg>
                        </NavInlineButton>
                        <GeolocateControl
                            positionOptions={{enableHighAccuracy: false}}
                            trackUserLocation={false}
                            onGeolocate={viewState  => handleGeolocate(viewState)}
                            style={{marginBottom: 10}}
                        />
                        <NavigationControl
                            onViewportChange={viewState  => setViewState(viewState)} 
                        />
                        
                        <NavInlineButton
                            title="Share this Map"
                            shareNotification={shared}
                            onClick={() => handleShare({URLmapParams:mapParams, URLcurrentData:currentData, URLcurrentVariable:currentVariable, URLviewState: mapRef.current.props.viewState})}
                        >
                            <svg x="0px" y="0px" viewBox="0 0 100 100">
                                <path d="M22.5,65c4.043,0,7.706-1.607,10.403-4.208l29.722,14.861C62.551,76.259,62.5,76.873,62.5,77.5c0,8.284,6.716,15,15,15   s15-6.716,15-15c0-8.284-6.716-15-15-15c-4.043,0-7.706,1.608-10.403,4.209L37.375,51.847C37.449,51.241,37.5,50.627,37.5,50   c0-0.627-0.051-1.241-0.125-1.847l29.722-14.861c2.698,2.601,6.36,4.209,10.403,4.209c8.284,0,15-6.716,15-15   c0-8.284-6.716-15-15-15s-15,6.716-15,15c0,0.627,0.051,1.241,0.125,1.848L32.903,39.208C30.206,36.607,26.543,35,22.5,35   c-8.284,0-15,6.716-15,15C7.5,58.284,14.216,65,22.5,65z">
                                </path>
                            </svg>

                        </NavInlineButton>
                        <ShareURL type="text" value="" id="share-url" />
                    </MapButtonContainer>
                    <div></div>
                </ReactMapGL >
                {hoverInfo.object && (
                <HoverDiv style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
                    <MapTooltipContent content={hoverInfo.object} />
                </HoverDiv>
                )}
            </DeckGL>
        </MapContainer>
    ) 
}

export default Map