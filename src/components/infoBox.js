import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { colors } from '../config';

const InfoContainer = styled.div`
    background: ${colors.gray};
    color: ${colors.white};
    padding: 0;
    overflow: hidden;
    display: ${props => props.active ? 'initial' : 'none'};
    border-radius: 4px;
    -moz-box-shadow: 0 0 2px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 0 2px rgba(0,0,0,.1);
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    svg {
        width: 10px;
        height: 10px;
        padding: 5px;
        fill: ${colors.white};
        display: inline;
        transition: 250ms all;
        cursor: pointer;
    }
    a {
       color: ${colors.yellow}; 
       text-decoration:none;
    }
    @media (max-width:1024px) {
        right:50%;
        bottom:50%;
        transform: translate(50%, 50%);
        overflow:hidden;
        -moz-box-shadow: 0 0 5px rgba(0,0,0,.2);
        -webkit-box-shadow: 0 0 5px rgba(0,0,0,.2);
        box-shadow: 0 0 0 5px rgba(0,0,0,.2);
    }
`

const PanelContainer = styled.div`
    height: 100%;
    position: absolute;
    top: 0;
    left: ${props => props.position*-100}%;
    display: flex;
    -ms-flex: 1;
    transition: 250ms all;
    width: ${props => props.panelCount*100}%;
`

const Panel = styled.div`
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    h3 {
        margin:0;
    }
    p.subtitle {
        font-size:75%;
        padding:0;
        margin:1px;
    } 
    ul {
       padding-inline-start: 15px;
    }
    img {
        width: 25px;
        height: 25px;
        padding:5px 10px 0 0;
        transition: 250ms all;
        opacity: 0.7;
    }
    img:hover {
        opacity:1;
    }

`

const DotsContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    width: calc(100% - 60px);
    height: 25px;
    margin-left: 30px;
    padding: 0 20px;
    box-sizing: border-box;
`

const Dot = styled.button`
    background:none;
    outline:none;
    border:none;
    &.active {
        svg {
            transform: scale(1.5);
        }
    }
`

const Arrow = styled.svg`
    position: absolute;
    bottom:0;
    &#right-arrow {
        right: 0;
        width: 20px;
        height: 20px;
    }
    &#left-arrow {
        left: 0;
        transform: rotate(180deg);
        width: 20px;
        height: 20px;
    }
`

const InfoBox = () => {
    const panelOpen = useSelector(state => state.panelState.tutorial)

    const [panelPosition, setPanelPosition] = useState(0);

    const panels = [
        {
            title:`Welcome to the US Covid Atlas v2`,
            subtitle:`1/4 Notes`,
            content: `Welcome to the refactored US Covid Atlas. We have greatly expanded the functionality,
            usability, and portability of the Atlas by refactoring the project into the frontend framework, React.
            <br/><br/>While we've worked to maintain the general structure of the Atlas, we've introduced a few new features
            and interface elements we hope will make the Atlas more robust and usable for more people.`
        },
        {
            title:`New Features`,
            subtitle:`January Release Notes`,
            content:`<ul>
                <li>New data available: New York Times State and County Data, CDC County Data with County-Level Testing Data</li>
                <li>New map view: 3D style map visualization</li>
                <li>Improved line chart module: Click the line chart button by the time slider to view</li>
                <li>Time range selection: You can now select a specific time range by click the time drop down in the time slider</li>
                <li>Multiple selection: By holding down the Control or Command key, you can select and aggregate stats from multiple geographies</li>
                <li>Improved report panel: New visual styles have been added to the report panel</li>
            </ul>`
        },
        // {
        //     title:`Getting Started`,
        //     subtitle:`November Release Notes`,
        //     content:`To get started, try the following:
        //     <ul>
        //       <li>Click the play button in the <a href="#" onclick="highlightElement('sliderdiv', 'id')">timeline</a> on the top of the page to see how the pandemic has unfolded</li>
        //       <li>Explore <a href="#" onclick="highlightElement('select-source', 'id')">state level data</a> on testing positivity rates and capacities</li>
        //       <li>Use the <a href="#" onclick="highlightElement('mapboxgl-ctrl-geolocate', 'class')">geolocation</a> function and <a href="#" onclick="highlightElement('select-resource', 'id')">Health Clinics layers</a> to find COVID-19 testing near you</li>
        //       <li><a href="#" onclick="highlightElement('share-container', 'id')">Share your map</a> on Social Media, or with a colleague or community member</li>
        //     </ul>`
        // },
        {
            title:`Found a bug or have a suggestion?`,
            subtitle:`November Release Notes`,
            content:`The US Covid Atlas team is always working to improve the platform and its ability to generate insights.<br><br>
                Please contact the team at <a href="mailto:contact@theuscovidatlas.org">contact@theuscovidatlas.org</a>
                or reach out on social media below.
                <div class="social-container">
                    <a href="https://twitter.com/covid_atlas" target="_blank" rel="noopener noreferrer">
                        <img src="${process.env.PUBLIC_URL}/icons/twitter-icon.png" alt="Twitter Icon">
                    </a>
                    <a href="https://github.com/GeoDaCenter/covid"  target="_blank" rel="noopener noreferrer">
                        <img src="${process.env.PUBLIC_URL}/icons/github-icon.png" alt="Twitter Icon">
                    </a>
                </div>`
        }
    ]
    return (
        <InfoContainer active={panelOpen}>
            <PanelContainer panelCount={panels.length} position={panelPosition}>
                {panels.map((panel,index) => {
                    return (
                        <Panel key={`panel-${index}`}>
                            <h3>{panel.title}</h3>
                            <p className="subtitle">{panel.subtitle}</p>
                            <p dangerouslySetInnerHTML={{__html: panel.content}}></p>
                        </Panel>
                    )
                })}
            </PanelContainer>
            <DotsContainer>
                {panels.map((panel,index) => {
                    return (
                        <Dot key={`dot-${index}`} onClick={() => setPanelPosition(index)} className={panelPosition === index ? 'active' : ''}>
                            <svg viewBox="0 0 100 100" className="dot"><circle cx="50" cy="50" r="40"></circle></svg>
                        </Dot>
                    )
                })}
            </DotsContainer>
            <Arrow viewBox="0 0 100 100" id="right-arrow" onClick={() => setPanelPosition(prev => (prev+1) % panels.length)}><g transform="translate(0,-952.36218)"><path d="m 71.20311,1002.3622 -2.84375,-3.28121 -31.99997,-37 -7.5625,6.5624 29.15622,33.71881 -29.15622,33.7188 7.5625,6.5624 31.99997,-37 2.84375,-3.2812 z"></path></g></Arrow>
            <Arrow viewBox="0 0 100 100" id="left-arrow" onClick={() => setPanelPosition(prev => (prev-1) >= 0 ? prev-1 : panels.length-1)}><g transform="translate(0,-952.36218)"><path d="m 71.20311,1002.3622 -2.84375,-3.28121 -31.99997,-37 -7.5625,6.5624 29.15622,33.71881 -29.15622,33.7188 7.5625,6.5624 31.99997,-37 2.84375,-3.2812 z"></path></g></Arrow>
        </InfoContainer>
    )
}

export default InfoBox;