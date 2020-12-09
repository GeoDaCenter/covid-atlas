import React, {useState} from 'react';
import styled from 'styled-components';

const PreloaderContainer = styled.div`
    position:fixed;
    width:100%;
    height:100%;
    z-index:500;
    top:0;
    left:0;
    background:#2b2b2b;
    transition: 500ms opacity;
    img {
        width:100px;
        height:86px;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
    }
    svg {
        width:40vw;
        height:40vh;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
        g {
            rect {
                fill:#EC1E24;
                animation: fade 1s infinite ease-in-out;
            }
            #topLeft {
                animation-delay:0.25s;
            }
            #bottomRight {
                animation-delay:0.5s;
            }
            #bottomLeft {
                animation-delay:0.75s;
            }
        }
    }
    @keyframes fade {
        0% {fill-opacity:1};
        50% {fill-opacity:0.25};
        100% {fill-opacity:1};
    }
    &.fadeOut {
        opacity:0;
        pointer-events:none;
    }
`;

const fixedPoints = {
    topRight: {
        y: 13.2
    }
}
const Preloader = ( props ) => {
    const [isHidden, setIsHidden] = useState(false);

    if (props.loaded) {
        setTimeout(() => {
            setIsHidden(true)
        }, 500)
    }

    return (
        <PreloaderContainer className={props.loaded ? 'fadeOut' : ''} style={{display: (isHidden ? 'none' : 'initial')}} id="preloaderContainer">
            <img src={`${process.env.PUBLIC_URL}/assets/img/preloader.gif`} alt="Preloader" />
            {/* <svg version="1.1" x="0px" y="0px" viewBox="0 0 54.5 50">
                <g>
                    <rect id="topLeft" y="5.5" width="23.4" height="23.4" rx="1"/>
                    <rect id="bottomRight" x="27.3" y="17.1" width="27.3" height="19.5" rx="1"/>
                    <rect id="bottomLeft" x="7.8" y="32.8" width="15.6" height="15.6" rx="1"/>
                    <rect id="topRight" x="27.3" y="1.5" width="11.7" height="11.7" rx="1"/>
                </g>
            </svg> */}

        </PreloaderContainer>
    );
};

export default Preloader;