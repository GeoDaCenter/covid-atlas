import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Steps, Hints } from 'intro.js-react';
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

const Drawer = styled.div`
    position:absolute;
    left:5px;
    top:25px;
`

const DrawerButton = styled.button`
    display:block;
    background:none;
    color:white;
    border:none;
    outline:none;
    line-height:2;
`

const BodyContainer = styled.div`
    position:absolute;
    left: 10%;
    padding: 0 50px 50px 0;
    box-sizing:border-box;
    top:25px;
    transform:translateX(25px);
    overflow-y:scroll;
    height:calc(100% - 25px);
    width:90%;

`

const InfoBox = () => {
    const panelOpen = useSelector(state => state.panelState.tutorial)
    const [wikiCategories, setWikiCategories] = useState([])
    const [stepsEnabled, setStepsEnabled] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [body, setBody] = React.useState('');
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/wiki/index.json`)
            .then(r => r.json())
            .then(d => setWikiCategories(d))
        
        fetch(`${process.env.PUBLIC_URL}/wiki/pages/welcome.md`)
            .then(r => r.text())
            .then(t => setBody(t))
    }, [])

    const handleWikiLoad = (page) => {
        fetch(`${process.env.PUBLIC_URL}/wiki/pages/${page}.md`)
            .then(r => r.text())
            .then(t => setBody(t))
    }

    const parseMarkdown = (markdownText) => {
        const htmlText = markdownText
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
            .replace(/\n$/gim, '<br />')
    
        return htmlText.trim()
    }
    const test = (info) => console.log(info)

    const steps = [
        {
          element: '.selector1',
          intro: 'test 1',
          position: 'right',
          tooltipClass: 'myTooltipClass',
          highlightClass: 'myHighlightClass',
        },
        {
          element: '.selector2',
          intro: 'test 2',
        },
        {
          element: '.selector3',
          intro: 'test 3',
        },
    ];

    const onExit = () => {
        setStepsEnabled(false)
    }

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
            <Steps
                enabled={stepsEnabled}
                options={{disableInteraction: false}}
                disableInteraction={false}
                steps={steps}
                initialStep={0}
                onExit={onExit}
                />
            <Drawer>
                {wikiCategories.Pages !== undefined && 
                    wikiCategories['Pages'].map(page => <DrawerButton onClick={() => handleWikiLoad(page.file)}>{page.pageName}</DrawerButton>)}
            </Drawer>
            <BodyContainer>
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(body) }} />
                {test}
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