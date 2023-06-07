import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Transformer, Text } from 'react-konva';

const Room = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable={shapeProps.mode==="default"}
        onDragMove={(e)=>{
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: Math.round(e.target.x()/100)*100,
            y: Math.round(e.target.y()/100)*100,
          });
          console.log(e.target.x(), e.target.y(), ~~(e.target.x()/100)*100,
            ~~(e.target.y()/100)*100)
        }}
        onTransformEnd={(e) => {
          console.log(e);
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            rotation: node.rotation(),
            randid: node.rotation() ? Math.random() : shapeProps.randid,
            x: Math.round(e.target.x() / 100)*100,
            y: Math.round(e.target.y() / 100)*100,
            // set minimal value
            width: node.rotation() ? node.width() * scaleX : Math.max(100, Math.round(node.width() * scaleX / 100)*100),
            height:node.rotation() ? node.height() * scaleY  :  Math.max(100, Math.round(node.height() * scaleY / 100) *100),
          });
        }}
        {...shapeProps}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          rotationSnaps={[0,45,90,135,180,225,270,315,360]}
          rotationSnapTolerance={30}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            // newBox.x-=newBox.x%100;
            // newBox.y-=newBox.y%100;
            console.log(newBox, oldBox);
            if (!newBox.rotation){
              if (newBox.width < 50 || newBox.height < 50) {
                return oldBox;
              }
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default Room