import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { colors } from '../config';
import { pages } from '../wiki';

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

const Drawer = styled.div`
    position:absolute;
    left:5px;
    top:25px;
    max-width:120px;
`

const DrawerButton = styled.button`
    display:block;
    text-align:left;
    background:none;
    color:${props => props.active ? colors.lightblue : colors.white};
    border:none;
    outline:none;
    line-height:2;
    transition:250ms;
    opacity: ${props => props.active ? 1 : 0.6};
    &:hover {
        opacity:1;
    }
`

const BodyContainer = styled.div`
    position:absolute;
    left: 120px;
    padding: 0 50px 50px 0;
    box-sizing:border-box;
    top:25px;
    transform:translateX(25px);
    overflow-y:scroll;
    height:calc(100% - 25px);
    width:calc(100% - 105px);
    .social-container {
        a {
            img {
                width: 25px;
                height: 25px;
                padding: 5px 10px 0px 0px;
                transition: all 250ms ease 0s;
                opacity: 0.7;
                &:hover {
                    opacity:1;
                }
            }
        }
    }
    button.hoverButton {
        background:none;
        border:none;
        border-bottom:1px solid ${colors.yellow};
        outline:none;
        color:${colors.yellow};
        padding:0;
        &:after {
            content:' ⚼';
        }
    }

`

const InfoBox = () => {
    const panelOpen = useSelector(state => state.panelState.tutorial)
    const [currArticle, setCurrArticle] = useState("welcome")

    return (
        <InfoContainer active={panelOpen}>
            {/* <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                    })}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    Mini variant drawer
                </Typography>
                </Toolbar>
            </AppBar> */}
            <Drawer>
                {Object.keys(pages).map(page => 
                    pages[page]["pageName"] !== null ? 
                    <DrawerButton 
                            onClick={() => setCurrArticle(page)}
                            active={currArticle === page}
                        >
                                {pages[page]["pageName"]}
                    </DrawerButton>
                    : ''
                )}
            </Drawer>
            <BodyContainer>
                {pages[currArticle]['content']}
                {(currArticle === "tutorials" || currArticle === "getting-started") && 
                    <button onClick={() => setCurrArticle("choropleth-tutorial")}>"choropleth-tutorial"</button>
                }
            </BodyContainer>
            {/* <PanelContainer panelCount={panels.length} position={panelPosition}>
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
            <Arrow viewBox="0 0 100 100" id="left-arrow" onClick={() => setPanelPosition(prev => (prev-1) >= 0 ? prev-1 : panels.length-1)}><g transform="translate(0,-952.36218)"><path d="m 71.20311,1002.3622 -2.84375,-3.28121 -31.99997,-37 -7.5625,6.5624 29.15622,33.71881 -29.15622,33.7188 7.5625,6.5624 31.99997,-37 2.84375,-3.2812 z"></path></g></Arrow> */}
        </InfoContainer>
    )
}

export default InfoBox;