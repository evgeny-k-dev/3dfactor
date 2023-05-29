// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react'
import { addObject, addRoom, changeObject, changeRoom, selectFloors, selectObjects, selectRooms } from '../redux/commonSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import useImage from 'use-image';
import {StlViewer} from "react-stl-viewer";

const Mockup = () => {
    const dispatch = useAppDispatch();
    const floors = useAppSelector(selectFloors);
    const rooms = useAppSelector(selectRooms);
    const objects = useAppSelector(selectObjects);
    const [info, setInfo] = useState({width: 0, height: 0})
    const ref = useRef({});
    const shown3d = true;
    const stageRef = useRef({});
    const [draggedObject, setDraggedObject] = useState({})
    const [mode, setMode] = useState("default")
    useEffect(()=>{
        setInfo(ref.current?.getBoundingClientRect())
    },[ref])
  const [newAnnotation, setNewAnnotation] = useState([]);

  const handleMouseDown = event => {
    if (newAnnotation.length === 0 && mode==="drawRoom") {
      let { x, y } = event.target.getStage().getRelativePointerPosition();
      // x= x / stage.scale;
      // y= y / stage.scale;
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
    }
  };

  const handleMouseUp = event => {
    if (newAnnotation.length === 1 && mode==="drawRoom") {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      let { x, y } = event.target.getStage().getRelativePointerPosition();
      // x= x / stage.scale;
      // y= y / stage.scale;
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
    // x= x / stage.scale;
    // y= y / stage.scale;
    if (newAnnotation.length === 1 && mode==="drawRoom") {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
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
    const URLImg = ({image})=>{
      let [img] = useImage(image.src);
        if (img?.width){
          img.width=32;
          img.height=32;
          console.log("HERE", img, image.src);
        }
        return <Image
        draggable
        onDragEnd={(e)=>{
          console.log("imgid", image.id);
          stageRef.current.setPointersPositions(e.evt);
          dispatch(changeObject({
            ...image,
            ...stageRef.current.getRelativePointerPosition(),
          })) 
          console.log(
            e,
            image,
            stageRef.current.getRelativePointerPosition()
          )
        }}
        image={img}
        x={image.x}
        y={image.y}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        />
    }
    return (
        <div style={mode=="drawRoom" ? {cursor: "crosshair"} : {}} className="MockupWrapper">
            <div
                onDrop={(e)=>{
                e.preventDefault();
                if (mode=="default" && draggedObject){
                    stageRef.current.setPointersPositions(e);
                    if (draggedObject.id===100000000000000){
                    dispatch(addObject({
                        ...stageRef.current.getPointerPosition(),
                        ...draggedObject
                    }))
                    }
                    else{
                        dispatch(changeObject({
                            ...stageRef.current.getPointerPosition(),
                            ...draggedObject
                        })) 
                    }
                    console.log({
                      ...stageRef.current.getPointerPosition(),
                      ...draggedObject
                    });
                    console.log("done");
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
                 ref={stageRef} width={info.width} height={info.height} draggable={mode!=="drawRoom"}>
                    <Layer
                    draggable={false}>
                        {annotationsToDraw.map((value)=>{
                            return <Rect
                            draggable={mode=="default"}
                            x={value.x}
                            y={value.y}
                            width={value.width}
                            height={value.height}
                            fill={"#FFFFFF"}
                            stroke="#000"
                            />
                        })}
                    </Layer>
                    <Layer>
                        {objects.map((e, key)=>{
                        return e.x!==undefined ? <URLImg key={key} image={e}/> : ""
                    })}
                    </Layer>
                </Stage>
                
            </div>
            <div className="ToolbarWrapper">
                <button draggable={false} onClick={(e)=>{
                    setMode("drawRoom")
                }}>
                    <img draggable={false} src="./svg/room.svg"/>
                    Помещение
                </button>
                <button
                draggable={true}
                onDragStart={(e)=>{
                    setMode("default")
                    console.log("started");
                    setDraggedObject({
                        id: 100000000000000,
                        src: "/svg/water.svg",
                        objectType: "waterSource"
                    })
                }}>
                    <img draggable={false} src="./svg/water.svg"/>
                    Источник Воды
                </button>
                <button
                draggable={true}
                onDragStart={(e)=>{
                    setMode("default")
                    console.log("started");
                    setDraggedObject({
                        id: 100000000000000,
                        src: "/svg/power.svg",
                        objectType: "powerSource"
                    })
                }}
                >
                    <img draggable={false} src="./svg/power.svg"/>
                    Источник Электричества
                </button>
            </div>
        </div>
    )
}

export default Mockup