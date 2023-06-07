// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react'
import { addObject, addRoom, changeObject, changeRoom, removeObject, removeRoom, selectFloors, selectObjects, selectRooms } from '../redux/commonSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import {StlViewer} from "react-stl-viewer";
import GridLayer from './konva/GridLayer';
import Room from './konva/Room';
import Object from './konva/Object';

const Mockup = () => {
    const dispatch = useAppDispatch();
    const floors = useAppSelector(selectFloors);
    const rooms = useAppSelector(selectRooms);
    const objects = useAppSelector(selectObjects);
    const [info, setInfo] = useState({width: 0, height: 0})
    const ref = useRef({});
    const shown3d = true;
    const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 })
    const stageRef = useRef({});
    const [activeRoom, setActiveRoom] = useState(-1)
    const [activeObject, setActiveObject] = useState(-1)
    const [draggedObject, setDraggedObject] = useState({})
    const [mode, setMode] = useState("default")
    const shapeRef = useRef({});
    const transformerRef = useRef({});
    const [roomUpdated, setRoomUpdated] = useState(false);
    useEffect(()=>{
        setInfo(ref.current?.getBoundingClientRect())
    },[ref])
  const [newAnnotation, setNewAnnotation] = useState([]);
  const handleMouseDown = event => {
    if (newAnnotation.length === 0 && mode==="drawRoom") {
      let { x, y } = event.target.getStage().getRelativePointerPosition();
      console.log(x,y, "1st");
      x= Math.round(x/100)*100;
      y= Math.round(y/100)*100;
      console.log(x,y, "2nd");
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
    }
  };

  const handleMouseUp = event => {
    if (newAnnotation.length === 1 && mode==="drawRoom") {
      const sx = Math.round(newAnnotation[0].x/100)*100;
      const sy = Math.round(newAnnotation[0].y/100)*100;
      let { x, y } = event.target.getStage().getRelativePointerPosition();
      x = Math.round(x/100)*100;
      y = Math.round(y/100)*100;
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
      };
      dispatch(addRoom(annotationToAdd));
      setNewAnnotation([]);
      setMode("default")
    }
  };

  const handleMouseMove = event => {
    let { x, y } = event.target.getStage().getRelativePointerPosition();
    x = Math.round(x/100)*100;
    y = Math.round(y/100)*100;
    if (newAnnotation.length === 1 && mode==="drawRoom") {
      const sx = Math.round(newAnnotation[0].x/100)*100;
      const sy = Math.round(newAnnotation[0].y/100)*100;
      console.log(x,y,sx,sy);
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
        }
      ]);
    }
  };
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0
  });

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStage({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
    });
  };
  const annotationsToDraw = [...rooms, ...newAnnotation];
    // const URLImg = ({image})=>{
    //   let [img] = useImage(image.src);
    //     if (img?.width){
    //       img.width=32;
    //       img.height=32;
    //     }
    //     return <Image
    //     draggable
    //     onDragEnd={(e)=>{
    //       stageRef.current.setPointersPositions(e.evt);
    //       dispatch(changeObject({
    //         ...image,
    //         ...stageRef.current.getRelativePointerPosition(),
    //       })) 
    //       console.log(
    //         e,
    //         image,
    //         stageRef.current.getRelativePointerPosition()
    //       )
    //     }}
    //     image={img}
    //     x={image.x}
    //     y={image.y}
    //     // I will use offset to set origin to the center of the image
    //     offsetX={img ? img.width / 2 : 0}
    //     offsetY={img ? img.height / 2 : 0}
    //     />
    // }
    return (
        <div style={mode=="drawRoom" ? {cursor: "crosshair"} : {}} className="MockupWrapper">
                <div
                onClick={e=>e.target.focus()}
                tabIndex={1}
                onKeyUp={(e)=>{
                  console.log(e.key, e);
                  if (e.which==8 || e.which==46){
                    dispatch(removeRoom(activeRoom))
                    dispatch(removeObject(activeObject))
                  }
                  else if (e.key=="Escape"){
                    setActiveRoom(-1)
                    setActiveObject(-1)
                  }
                }}
                onDrop={(e)=>{
                e.preventDefault();
                if (mode=="default" && draggedObject){
                    stageRef.current.setPointersPositions(e);
                    if (draggedObject.id===100000000000000){
                    dispatch(addObject({
                        ...stageRef.current.getPointerPosition(),
                        ...draggedObject,
                        width: 100,
                        height: 100,
                    }))
                    }
                    else{
                        dispatch(changeObject({
                            ...stageRef.current.getPointerPosition(),
                            ...draggedObject
                        })) 
                    }
                    setDraggedObject({})
                }
            }}
            onDragOver={(e) => e.preventDefault()}
            ref={ref} className="MockupMain">
                Увеличение: {stage.scale.toFixed(2)}x<br />
                <Stage 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
                scaleX={stage.scale}
                scaleY={stage.scale}
                x={stage.x}
                y={stage.y}
                onDragEnd={(e)=>{
                  setGridOffset(e.currentTarget.position());
                }}
                 ref={stageRef} width={info.width} height={info.height} draggable={mode!=="drawRoom"}>
                  <GridLayer scale={stage.scale} stagePos={gridOffset}/>
                    <Layer
                    draggable={false}>
                        {annotationsToDraw.map((value,key)=>{
                          console.log(value);
                            return <Room
                            key={value.randid || key}
                            onSelect={(e)=>{
                              e.evt.preventDefault()
                              setActiveRoom(value.id)
                              if (activeObject){
                                setActiveObject(-1)
                              }
                            }}
                            onChange={(e)=>{
                              console.log(e, "!!!!");
                              dispatch(changeRoom(e))
                            }}
                            isSelected={activeRoom===value.id}
                            shapeProps={{
                            mode, 
                            id: value.id,
                            x: value.x,
                            y: value.y,
                            width: value.width,
                            height: value.height,
                            fill: "#FFFFFF",
                            stroke: "#000"
                            }}
                            />
                        })}
                    </Layer>
                    <Layer>
                        {objects.map((value, key)=>{
                        return value.x!==undefined ? <Object
                        key={value.randid || key}
                        shapeProps={value}
                        onSelect={(e)=>{
                          e.evt.preventDefault()
                          setActiveObject(value.id)
                          if (activeRoom){
                            setActiveRoom(-1)
                          }
                        }}
                        onChange={(e)=>{
                          dispatch(changeObject(e))
                        }}
                        isSelected={activeObject===value.id}
                        /> : ""
                    })}
                    </Layer>
                    <Layer>
                      <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}/>
                    </Layer>
                </Stage>
                
            </div>
            <div className="ToolbarWrapper">
                <button draggable={false} onClick={(e)=>{
                    setMode("drawRoom")
                }}>
                    <img draggable={false} src="/3dfactor/svg/room.svg"/>
                    Помещение
                </button>
                <button
                draggable={true}
                onDragStart={(e)=>{
                    setMode("default")
                    console.log("started");
                    setDraggedObject({
                        id: 100000000000000,
                        src: "svg/water.svg",
                        objectType: "waterSource"
                    })
                }}>
                    <img width="64" height="64" draggable={false} src="/3dfactor/svg/water.svg"/>
                    Вода
                </button>
                <button
                draggable={true}
                onDragStart={(e)=>{
                    setMode("default")
                    console.log("started");
                    setDraggedObject({
                        id: 100000000000000,
                        src: "svg/power.svg",
                        objectType: "powerSource"
                    })
                }}
                >
                    <img width="64" height="64" draggable={false} src="/3dfactor/svg/power.svg"/>
                    Электричество
                </button>
                <button
                draggable={true}
                onDragStart={(e)=>{
                    setMode("default")
                    console.log("started");
                    setDraggedObject({
                        id: 100000000000000,
                        src: "svg/door.svg",
                        objectType: "door"
                    })
                }}
                >
                    <img width="64" height="64" draggable={false} src="/3dfactor/svg/door.svg"/>
                    Дверь
                </button>
            </div>
        </div>
    )
}

export default Mockup