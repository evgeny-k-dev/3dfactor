import React from 'react'
import { Layer, Rect } from 'react-konva';
const WIDTH = 100;
const HEIGHT = 100;
const GridLayer = ({stagePos, scale , ...props}) => {
  const startX = (Math.floor((-stagePos.x - window.innerWidth / scale) / WIDTH) * WIDTH);
  const endX =
    Math.floor(((-stagePos.x / scale) + window.innerWidth / scale) / WIDTH) * WIDTH;

  const startY =
    (Math.floor((-stagePos.y - window.innerHeight / scale) / HEIGHT) * HEIGHT);
  const endY =
    Math.floor(((-stagePos.y / scale) + window.innerHeight / scale) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  var i = 0;
  for (var x = startX; x < endX; x += WIDTH) {
    for (var y = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      gridComponents.push(
        <Rect
          onClick={props.onClick}
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          stroke="#0006"
        />
      );
    }
  }
  return (
    <Layer>{gridComponents}</Layer>
  )
}

export default GridLayer