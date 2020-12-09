// branchless variant
// const dataFn = (numeratorData, numeratorProperty, index, range, denominatorData, denominatorProperty, denominatorIndex, denominatorRange, scale)  => {

//     return (
//       (
//         (
//           (
//             (numeratorData[index]||numeratorData[numeratorProperty])
//             -
//             ((range!==null)&&(numeratorData[index-range]))
//           )
          
//           /
//           (range+(range===null))
//         )
//       /
//         (
//           (
//             (
//               (denominatorData[denominatorIndex]||denominatorData[denominatorProperty])
//               -
//               ((denominatorRange!==null)&&(denominatorData[denominatorIndex-denominatorRange]))
//             )
//             /
//             (denominatorRange+(denominatorRange===null))
//           )
//           ||
//             (denominatorData[denominatorProperty])
//           || 
//           1
//         )
//       )
//       *
//       scale
//     )
// }

// export default dataFn;

const dataFn = (numeratorData, denominatorData, dataParams)  => {
  const { 
    nProperty, nIndex, nRange,
    dProperty, dIndex, dRange, 
    scale
  } = dataParams;

  if (numeratorData === undefined) {
    return 0;
  } else if (dProperty===null&&nRange===null){ // whole count or number -- no range, no normalization
    return (numeratorData[nProperty]||numeratorData[nIndex])*scale
  } else if (dProperty===null&&nRange!==null){ // range number, daily or weekly count -- no normalization
    return (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange*scale
  } else if (dProperty!==null&&nRange===null){ // whole count or number normalized -- no range
    return (numeratorData[nProperty]||numeratorData[nIndex])/(denominatorData[dProperty]||denominatorData[dIndex])*scale
  } else if (dProperty!==null&&nRange!==null&&dRange===null){ // range number, daily or weekly count, normalized to a single value
    return (
      (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)/(denominatorData[dProperty]||denominatorData[dIndex]
        )*scale
  } else if (dProperty!==null&&nRange!==null&&dRange!==null){ // range number, daily or weekly count, normalized to a range number, daily or weekly count
    return (
      (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)
      /
      ((denominatorData[dIndex]-denominatorData[dIndex-nRange])/nRange)
      *scale
  } else {      
    return 0;
  }
}

export default dataFn;