import React from 'react';

const BinsList = (props) => {
    let bins = props.data;

    if (bins.slice(-1,)[0] === '>'+bins.slice(-2,-1)[0]) {
        bins.splice(-2,1)
    }
    return (
        (bins.map(d => <div className="bin label" key={`${d}_${Math.floor(Math.random()*10000)}`}>{d}</div>))
    )
}

export default BinsList;