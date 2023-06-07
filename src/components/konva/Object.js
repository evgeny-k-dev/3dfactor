import React from 'react'
import { Image, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useAppDispatch } from '../../redux/hooks';
import { changeObject } from '../../redux/commonSlice';

const Object = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const dispatch = useAppDispatch();
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  console.log("rerender");
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  let [img] = useImage(shapeProps.src);
        if (img?.width){
          img.width=shapeProps.width || 100;
          img.height=shapeProps.height || 100;
        }
        return (
    <>
    <Image
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e)=>{
          if (shapeProps.objectType!=="door"){
          onChange({
            ...shapeProps,
            x: Math.round(e.target.x() / 100) * 100,
            y: Math.round(e.target.y() / 100) * 100,
            randid: Math.random()
          }) 
          console.log(
            {
              ...shapeProps,
              x: Math.round(e.target.x() / 100) * 100,
              y: Math.round(e.target.y() / 100) * 100
            }
          )
          }
          else{
            onChange({...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
          }
        }}
        image={img}
        onTransformEnd={(e) => {
          console.log("transform");
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
          if (shapeProps.type==="door" || Math.abs(node.rotation())){
            onChange({...shapeProps, 
            x: e.target.x(),
            y: e.target.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY
          })
          }
          else{
            onChange({
              ...shapeProps,
              rotation: node.rotation(),
              // randid: Math.random(),
              x: Math.round(e.target.x() / 100)*100,
              y: Math.round(e.target.y() / 100)*100,
              // set minimal value
              width: Math.max(100, Math.round(node.width() * scaleX / 100)*100),
              height: Math.max(100, Math.round(node.height() * scaleY / 100) *100),
            });
          }
        }}
        {...shapeProps}
        // I will use offset to set origin to the center of the image
        // offsetX={img ? img.width / 2 : 0}
        // offsetY={img ? img.height / 2 : 0}
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
            if (!newBox.rotation){
              if (newBox.width < 100 || newBox.height < 100) {
                return oldBox;
              }
            }
            return newBox;
          }}
        />
      )}
        </>
  )
}

export default Object